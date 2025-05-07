
import { supabase } from "@/integrations/supabase/client";

export interface Class {
  id: string;
  name: string;
  grade: string;
  studentCount: number;
}

export interface Student {
  id: string;
  name: string;
  regNumber: string;
  classId: string;
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

// Get all classes
export const getClasses = async (): Promise<Class[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('attendance-api', {
      method: 'GET',
      path: '/classes'
    });

    if (error) {
      console.error("Error fetching classes:", error);
      throw error;
    }
    
    // Transform MongoDB data to match our interface
    const classes = data.classes.map((cls: any) => ({
      id: cls._id.toString(),
      name: cls.name,
      grade: cls.grade,
      studentCount: cls.studentCount || 0
    }));

    return classes;
  } catch (error) {
    console.error("Error in getClasses:", error);
    throw error;
  }
};

// Get class by ID
export const getClassById = async (classId: string): Promise<Class | undefined> => {
  try {
    const { data, error } = await supabase.functions.invoke('attendance-api', {
      method: 'GET',
      path: '/class',
      query: { id: classId }
    });

    if (error) {
      console.error("Error fetching class:", error);
      throw error;
    }

    if (!data.class) {
      return undefined;
    }

    return {
      id: data.class._id.toString(),
      name: data.class.name,
      grade: data.class.grade,
      studentCount: data.class.studentCount || 0
    };
  } catch (error) {
    console.error("Error in getClassById:", error);
    throw error;
  }
};

// Get student by QR code
export const getStudentByQR = async (qrCode: string): Promise<Student | undefined> => {
  try {
    const { data, error } = await supabase.functions.invoke('attendance-api', {
      method: 'GET',
      path: '/student-by-qr',
      query: { qrCode }
    });

    if (error) {
      console.error("Error fetching student by QR:", error);
      throw error;
    }

    if (!data.student) {
      return undefined;
    }

    return {
      id: data.student._id.toString(),
      name: data.student.name,
      regNumber: data.student.regNumber || data.student.registrationNumber || "",
      classId: data.student.classId,
      qrCode: data.student.qrCode
    };
  } catch (error) {
    console.error("Error in getStudentByQR:", error);
    throw error;
  }
};

// Get students in a class
export const getStudentsInClass = async (classId: string): Promise<Student[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('attendance-api', {
      method: 'GET',
      path: '/students',
      query: { classId }
    });

    if (error) {
      console.error("Error fetching students in class:", error);
      throw error;
    }

    // Transform MongoDB data to match our interface
    const students = data.students.map((student: any) => ({
      id: student._id.toString(),
      name: student.name,
      regNumber: student.regNumber || student.registrationNumber || "",
      classId: student.classId,
      qrCode: student.qrCode || student.regNumber || ""
    }));

    return students;
  } catch (error) {
    console.error("Error in getStudentsInClass:", error);
    throw error;
  }
};

// Get attendance records for a class
export const getAttendanceForClass = async (classId: string): Promise<AttendanceRecord[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('attendance-api', {
      method: 'GET',
      path: '/attendance',
      query: { classId }
    });

    if (error) {
      console.error("Error fetching attendance records:", error);
      throw error;
    }

    // Transform MongoDB data to match our interface
    const attendance = data.attendance.map((record: any) => ({
      id: record._id.toString(),
      studentId: record.studentId,
      date: record.date,
      present: record.present,
      week: record.week,
      classId: record.classId
    }));

    return attendance;
  } catch (error) {
    console.error("Error in getAttendanceForClass:", error);
    throw error;
  }
};

// Mark attendance
export const markAttendance = async (
  studentId: string,
  classId: string,
  date: string,
  week: 1 | 2 | 3 | 4
): Promise<AttendanceRecord> => {
  try {
    const { data, error } = await supabase.functions.invoke('attendance-api', {
      method: 'POST',
      path: '/mark-attendance',
      body: { studentId, classId, date, week, present: true }
    });

    if (error) {
      console.error("Error marking attendance:", error);
      throw error;
    }

    // Return a simplified attendance record
    return {
      id: data.result.id || data.result._id || Date.now().toString(),
      studentId,
      date,
      present: true,
      week,
      classId
    };
  } catch (error) {
    console.error("Error in markAttendance:", error);
    throw error;
  }
};
