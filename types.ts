
export enum Role {
  Student = 'student',
  Parent = 'student',
  Tutor = 'tutor',
  Admin = 'admin',
}

export interface Subject {
  id: number;
  name: string;
}

export interface Expertise {
  id: number;
  name: string;
}

export interface StudentProfile {
  grade_level: string | null;
}

export interface TutorProfile {
  bio: string | null;
  subject: Subject[];
  hourly_rate: string | null;
  id_photo: string | null;
  title: string | null;
  expertise: Expertise[];
}

export interface User {
  id: number | string;
  username: string;
  email: string | null;
  first_name: string;
  last_name: string;
  role: Role;
  photo: string | null;
  location: string;
  phone_number: string | null;
  is_phone_verified: boolean;
  is_id_verified: boolean;
  balance: string;
  student_profile?: StudentProfile | null;
  tutor_profile?: TutorProfile | null;
  // UI/Legacy compatibility
  name?: string;
  avatarUrl?: string;
}

export enum TutorStatus {
  Pending = 'Pending Verification',
  Verified = 'Verified',
  Rejected = 'Rejected',
}

export enum QualificationType {
  Education = 'education',
  Award = 'award',
  Certificate = 'certificate',
  WorkExperience = 'work_experience',
}

export enum QualificationStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export interface QualificationImage {
  id: number;
  image: string;
}

export interface Qualification {
  id: number;
  tutor: number;
  title: string;
  type: QualificationType;
  status: QualificationStatus;
  description: string | null;
  link: string | null;
  pdf: string | null;
  word_doc: string | null;
  images: QualificationImage[];
}

export interface Availability {
  id: number;
  tutor: number;
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
}

export interface Tutor extends User {
  // Legacy fields kept as optional for now
  title?: string | null;
  hourly_rate?: string | null;
  subject?: Subject[];
  expertise?: Expertise[];
  id_photo: string | null;
  // UI/Computed/Mock fields
  rating?: number;
  reviews_count?: number;
  reviews?: number;
  bio?: string;
  status?: TutorStatus | string;
  experience?: string | Subject[];
  subjects?: string[] | Subject[];
  qualifications?: Qualification[] | string[];
  availabilities?: Availability[];
  availability?: any;
  matchScore?: number;
  pricePerHour?: number;
}

export interface Parent extends User {
  // Legacy
  studentGradeLevel?: string;
}

// Re-defining Parent Request as StudentRequest to align with model
export interface StudentRequest {
  gradeLevel: string;
  subject: string;
  mode: 'online' | 'in-person';
  location: string;
  budget: number;
  notes: string;
}

export type ParentRequest = StudentRequest;

export interface Commission {
  id: string | number;
  tutorName: string;
  parentName: string;
  amount: number;
  date: string;
}

export enum TransactionType {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
  Payment = 'payment',
}

export enum TransactionStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
}

export interface Transaction {
  id: number;
  user: number;
  amount: string;
  transaction_type: TransactionType;
  status: TransactionStatus;
  reference: string;
  created_at: string;
}

export interface Review {
  id: number;
  reviewer: number;
  reviewee: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

export enum SessionStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export interface Session {
  id: string | number;
  tutor: Tutor;
  student?: User;
  parent?: Parent;
  subject: string;
  date: string;
  time: string;
  status: SessionStatus;
  meetingLink: string;
}
