
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

// Mock classes data
export const classes: Class[] = [
  { id: "c1", name: "Mathematics", grade: "Grade 10", studentCount: 25 },
  { id: "c2", name: "Science", grade: "Grade 10", studentCount: 28 },
  { id: "c3", name: "English", grade: "Grade 11", studentCount: 22 },
  { id: "c4", name: "History", grade: "Grade 9", studentCount: 26 },
  { id: "c5", name: "Computer Science", grade: "Grade 12", studentCount: 20 },
];

// Mock students data
export const students: Student[] = [
  { id: "s1", name: "John Smith", regNumber: "REG001", classId: "c1", qrCode: "REG001" },
  { id: "s2", name: "Emily Johnson", regNumber: "REG002", classId: "c1", qrCode: "REG002" },
  { id: "s3", name: "Michael Davis", regNumber: "REG003", classId: "c1", qrCode: "REG003" },
  { id: "s4", name: "Sarah Wilson", regNumber: "REG004", classId: "c2", qrCode: "REG004" },
  { id: "s5", name: "David Taylor", regNumber: "REG005", classId: "c2", qrCode: "REG005" },
  { id: "s6", name: "Jessica Brown", regNumber: "REG006", classId: "c3", qrCode: "REG006" },
  { id: "s7", name: "James Miller", regNumber: "REG007", classId: "c3", qrCode: "REG007" },
  { id: "s8", name: "Lisa Anderson", regNumber: "REG008", classId: "c4", qrCode: "REG008" },
  { id: "s9", name: "Robert Thomas", regNumber: "REG009", classId: "c4", qrCode: "REG009" },
  { id: "s10", name: "Jennifer White", regNumber: "REG010", classId: "c5", qrCode: "REG010" },
];

// Mock attendance data
export const attendanceRecords: AttendanceRecord[] = [
  { id: "a1", studentId: "s1", date: "2025-05-01", present: true, week: 1, classId: "c1" },
  { id: "a2", studentId: "s2", date: "2025-05-01", present: true, week: 1, classId: "c1" },
  { id: "a3", studentId: "s3", date: "2025-05-01", present: false, week: 1, classId: "c1" },
  { id: "a4", studentId: "s1", date: "2025-05-08", present: true, week: 2, classId: "c1" },
  { id: "a5", studentId: "s2", date: "2025-05-08", present: true, week: 2, classId: "c1" },
  { id: "a6", studentId: "s3", date: "2025-05-08", present: true, week: 2, classId: "c1" },
  { id: "a7", studentId: "s1", date: "2025-05-15", present: true, week: 3, classId: "c1" },
  { id: "a8", studentId: "s2", date: "2025-05-15", present: false, week: 3, classId: "c1" },
  { id: "a9", studentId: "s3", date: "2025-05-15", present: true, week: 3, classId: "c1" },
  { id: "a10", studentId: "s1", date: "2025-05-22", present: true, week: 4, classId: "c1" },
  { id: "a11", studentId: "s2", date: "2025-05-22", present: true, week: 4, classId: "c1" },
  { id: "a12", studentId: "s3", date: "2025-05-22", present: false, week: 4, classId: "c1" },
];

// Helper functions to simulate API calls
export const getClasses = (): Promise<Class[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(classes);
    }, 500);
  });
};

export const getStudentByQR = (qrCode: string): Promise<Student | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const student = students.find((s) => s.qrCode === qrCode);
      resolve(student);
    }, 300);
  });
};

export const getStudentsInClass = (classId: string): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const classStudents = students.filter((s) => s.classId === classId);
      resolve(classStudents);
    }, 500);
  });
};

export const getAttendanceForClass = (classId: string): Promise<AttendanceRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const attendance = attendanceRecords.filter((a) => a.classId === classId);
      resolve(attendance);
    }, 500);
  });
};

export const getClassById = (classId: string): Promise<Class | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const foundClass = classes.find((c) => c.id === classId);
      resolve(foundClass);
    }, 300);
  });
};

export const markAttendance = (
  studentId: string,
  classId: string,
  date: string,
  week: 1 | 2 | 3 | 4
): Promise<AttendanceRecord> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRecord: AttendanceRecord = {
        id: `a${Date.now()}`,
        studentId,
        classId,
        date,
        present: true,
        week,
      };
      
      // In a real app, you would add this to a database
      attendanceRecords.push(newRecord);
      
      resolve(newRecord);
    }, 500);
  });
};
