export interface Class {
  id: string;
  name: string;
  grade: number;
  studentCount: number;
}

export interface Student {
  id: string;
  name: string;
  regNumber: string;
  classId: string;
 classIds?: string[];
  qrCode: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  present: boolean;
  week: 1 | 2 | 3 | 4;
  classId: string;
}

const baseUrl = "http://192.168.8.102:5001/api"; 
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Token not found in localStorage");
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ✅ Get all classes
export const getClasses = async (): Promise<Class[]> => {
  const response = await fetch(`${baseUrl}/class/fetch-all`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    console.error("Class fetch failed:", result.message);
    throw new Error(result.message || "Failed to fetch classes");
  }

  return result.data.map((cls: any) => ({
    id: cls._id,
    name: cls.class_text,
    grade: cls.class_num,
    studentCount: cls.studentAttendee?.length || 0,
  }));
};


export const getClassById = async (classId: string): Promise<Class | undefined> => {
  const response = await fetch(`${baseUrl}/class/fetch-single/${classId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success || !result.data) {
    return undefined;
  }

  const cls = result.data;
  return {
    id: cls._id,
    name: cls.class_text,
    grade: cls.class_num,
    studentCount: cls.studentAttendee?.length || 0,
  };
};


export const getStudentsInClass = async (classId: string): Promise<Student[]> => {
  const response = await fetch(`${baseUrl}/student/fetch-with-query?student_classes=${classId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch students");
  }

  return result.data.map((student: any) => ({
    id: student._id,
    name: student.name,
    regNumber: student.unique_id || student.email,
    classId,
    qrCode: student.qr_code || "",
  }));
};


export const getStudentByQR = async (qrCode: string) => {
  const res = await fetch(`${baseUrl}/student/fetch-by-qr/${qrCode}`, {
    headers: getAuthHeaders()
  });
  const result = await res.json();
  if (!result.success) return undefined;

  return {
    id: result.data.id,
    name: result.data.name,
    regNumber: result.data.unique_id,
    classId: result.data.student_classes?.[0]?._id,
    classIds: result.data.student_classes.map((cls: any) => cls._id),
    qrCode: result.data.qr_code
  };
};



export const getAttendanceForClass = async (classId: string): Promise<AttendanceRecord[]> => {
  const response = await fetch(`${baseUrl}/attendance/fetch-by-class/${classId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch attendance records");
  }

  return result.data.map((record: any) => ({
    id: record._id,
    studentId: record.studentId,
    date: record.date,
    present: record.present,
    week: record.week,
    classId: record.classId,
  }));
};


export const markAttendance = async (
  studentId: string,
  classId: string,
  date: string,
  week: 1 | 2 | 3 | 4,
   present: boolean
): Promise<AttendanceRecord> => {

  const token = localStorage.getItem("token"); // ✅ Retrieve token
  if (!token) throw new Error("No token found. Please log in again.");

  const response = await fetch(`${baseUrl}/attendance/mark`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ studentId, classId, date, week, present}),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to mark attendance");
  }

  const record = result.data;
  return {
    id: record._id,
    studentId: record.studentId,
    date: record.date,
     present: record.status === "Present",
    week: record.week,
    classId: record.classId,
  };
};


