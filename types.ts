
export enum Role {
  Parent = 'Parent',
  Tutor = 'Tutor',
  Admin = 'Admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export enum TutorStatus {
    Pending = 'Pending Verification',
    Verified = 'Verified',
    Rejected = 'Rejected',
}

export interface Tutor extends User {
  rating: number;
  reviews: number;
  pricePerHour: number;
  subjects: string[];
  bio: string;
  status: TutorStatus;
  experience: string;
  qualifications: string[];
  availability: { day: string; times: string[] }[];
  matchScore?: number;
}

export interface Parent extends User {
    studentGradeLevel: string;
    location: string;
}

export interface ParentRequest {
  gradeLevel: string;
  subject: string;
  mode: 'online' | 'in-person';
  location: string;
  budget: number;
  notes: string;
}

export interface Commission {
  id: string;
  tutorName: string;
  parentName: string;
  amount: number;
  date: string;
}

export enum SessionStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export interface Session {
    id: string;
    tutor: Tutor;
    parent: Parent;
    subject: string;
    date: string;
    time: string;
    status: SessionStatus;
    meetingLink: string;
}
