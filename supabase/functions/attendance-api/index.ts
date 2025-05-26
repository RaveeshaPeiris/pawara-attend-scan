
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

const MONGODB_URI = Deno.env.get("mongodb+srv://tharushivithanage4:lN9ovW3FQjroDqCV@pawara.6b61t.mongodb.net/")!;

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Connect to MongoDB
async function connectToMongo() {
  try {
    console.log("Connecting to MongoDB...");
    const client = new MongoClient();
    await client.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    const client = await connectToMongo();
    const db = client.database("pawara"); // Adjust if your database name is different
    const url = new URL(req.url);
    const pathname = url.pathname;
    const endpoint = pathname.split('/').pop();
    
    // Get students endpoint - returns all students in a class
    if (req.method === 'GET' && endpoint === 'students') {
      const classId = url.searchParams.get('classId');
      if (!classId) {
        return new Response(
          JSON.stringify({ error: "Class ID is required" }),
          { status: 400, headers: corsHeaders }
        );
      }
      
      const students = await db.collection("users")
        .find({ classId: classId, role: "student" })
        .toArray();
        
      return new Response(
        JSON.stringify({ students }),
        { headers: corsHeaders }
      );
    }
    
    // Get attendance records for a class
    if (req.method === 'GET' && endpoint === 'attendance') {
      const classId = url.searchParams.get('classId');
      if (!classId) {
        return new Response(
          JSON.stringify({ error: "Class ID is required" }),
          { status: 400, headers: corsHeaders }
        );
      }
      
      const attendance = await db.collection("attendance")
        .find({ classId: classId })
        .toArray();
        
      return new Response(
        JSON.stringify({ attendance }),
        { headers: corsHeaders }
      );
    }
    
    // Mark attendance
    if (req.method === 'POST' && endpoint === 'mark-attendance') {
      const { studentId, classId, date, week, present } = await req.json();
      
      if (!studentId || !classId || !date || !week) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: corsHeaders }
        );
      }
      
      // Check if attendance record already exists
      const existingRecord = await db.collection("attendance").findOne({
        studentId,
        classId,
        date,
      });
      
      let result;
      if (existingRecord) {
        // Update existing record
        result = await db.collection("attendance").updateOne(
          { _id: existingRecord._id },
          { $set: { present, week } }
        );
      } else {
        // Create new record
        result = await db.collection("attendance").insertOne({
          studentId,
          classId,
          date,
          week,
          present: present !== undefined ? present : true,
          timestamp: new Date()
        });
      }
      
      return new Response(
        JSON.stringify({ success: true, result }),
        { headers: corsHeaders }
      );
    }
    
    // Get classes
    if (req.method === 'GET' && endpoint === 'classes') {
      const teacherId = url.searchParams.get('teacherId');
      const query = teacherId ? { teacherId } : {};
      
      const classes = await db.collection("classes")
        .find(query)
        .toArray();
        
      return new Response(
        JSON.stringify({ classes }),
        { headers: corsHeaders }
      );
    }
    
    // Get class by ID
    if (req.method === 'GET' && endpoint === 'class') {
      const classId = url.searchParams.get('id');
      if (!classId) {
        return new Response(
          JSON.stringify({ error: "Class ID is required" }),
          { status: 400, headers: corsHeaders }
        );
      }
      
      try {
        const classData = await db.collection("classes").findOne({
          _id: new ObjectId(classId)
        });
        
        if (!classData) {
          return new Response(
            JSON.stringify({ error: "Class not found" }),
            { status: 404, headers: corsHeaders }
          );
        }
        
        return new Response(
          JSON.stringify({ class: classData }),
          { headers: corsHeaders }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Invalid class ID format" }),
          { status: 400, headers: corsHeaders }
        );
      }
    }
    
    // Get student by QR code
    if (req.method === 'GET' && endpoint === 'student-by-qr') {
      const qrCode = url.searchParams.get('qrCode');
      if (!qrCode) {
        return new Response(
          JSON.stringify({ error: "QR code is required" }),
          { status: 400, headers: corsHeaders }
        );
      }
      
      const student = await db.collection("users").findOne({
        qrCode,
        role: "student"
      });
      
      if (!student) {
        return new Response(
          JSON.stringify({ error: "Student not found" }),
          { status: 404, headers: corsHeaders }
        );
      }
      
      return new Response(
        JSON.stringify({ student }),
        { headers: corsHeaders }
      );
    }
    
    // Endpoint not found
    return new Response(
      JSON.stringify({ error: "Endpoint not found" }),
      { status: 404, headers: corsHeaders }
    );
    
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
