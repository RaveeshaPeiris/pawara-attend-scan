
/*export interface Class {
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

const baseUrl = "http://192.168.8.101:5001/api"; // Replace with your IP if changed

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

// ✅ Get class by ID (NEWLY ADDED)
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

// ✅ Get students in a class
export const getStudentsInClass = async (classId: string): Promise<Student[]> => {
  const response = await fetch(`${baseUrl}/student/fetch-by-class/${classId}`, {
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
    regNumber: student.regNumber || student.registrationNumber || "",
    classId: student.classId,
    qrCode: student.qrCode || "",
  }));
};

// ✅ Get student by QR
export const getStudentByQR = async (qrCode: string): Promise<Student | undefined> => {
  const response = await fetch(`${baseUrl}/student/fetch-by-qr/${qrCode}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success || !result.data) {
    return undefined;
  }

  const student = result.data;
  return {
    id: student._id,
    name: student.name,
    regNumber: student.regNumber || "",
    classId: student.classId,
    qrCode: student.qrCode || "",
  };
};

// ✅ Get attendance records for a class
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

// ✅ Mark attendance
export const markAttendance = async (
  studentId: string,
  classId: string,
  date: string,
  week: 1 | 2 | 3 | 4
): Promise<AttendanceRecord> => {
  const response = await fetch(`${baseUrl}/attendance/mark`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ studentId, classId, date, week, present: true }),
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
    present: true,
    week: record.week,
    classId: record.classId,
  };
};*/

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

const baseUrl = "http://192.168.8.100:5001/api"; // Update this if your backend IP changes

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

// ✅ Get class by ID
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

// ✅ Get students in a class (UPDATED ✅ using student_classes query param)
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

// ✅ Get student by QR
export const getStudentByQR = async (qrCode: string): Promise<Student | undefined> => {
  const response = await fetch(`${baseUrl}/student/fetch-by-qr/${qrCode}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success || !result.data) {
    return undefined;
  }

  const student = result.data;
  return {
    id: student._id,
    name: student.name,
    regNumber: student.unique_id || "",
    classId: "",
    //classId: student.student_classes?.[0]?._id || "", // fallback if multiple
    qrCode: student.qr_code || "",
    classIds: student.student_classes?.map((cls: any) => cls._id) || [],
  };
};

// ✅ Get attendance records for a class
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

// ✅ Mark attendance
export const markAttendance = async (
  studentId: string,
  classId: string,
  date: string,
  week: 1 | 2 | 3 | 4
): Promise<AttendanceRecord> => {
  const response = await fetch(`${baseUrl}/attendance/mark`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ studentId, classId, date, week, present: true }),
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
    present: true,
    week: record.week,
    classId: record.classId,
  };
};


