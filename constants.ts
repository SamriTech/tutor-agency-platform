
import { Tutor, TutorStatus, Commission, Parent, Role, Session, SessionStatus } from './types';

export const TUTORS: Tutor[] = []

export const PARENTS: Parent[] = [];

export const COMMISSIONS: Commission[] = [
  { id: '1', tutorName: 'Abebe Bikila', parentName: 'Aster Aweke', amount: 50.00, date: '2024-07-21' },
  { id: '2', tutorName: 'Fatuma Roba', parentName: 'Tilahun Gessesse', amount: 45.00, date: '2024-07-21' },
  { id: '3', tutorName: 'Haile Gebreselassie', parentName: 'Mahmoud Ahmed', amount: 60.00, date: '2024-07-20' },
  { id: '4', tutorName: 'Abebe Bikila', parentName: 'Gigi Shibabaw', amount: 50.00, date: '2024-07-20' },
  { id: '5', tutorName: 'Kenenisa Bekele', parentName: 'Teddy Afro', amount: 55.00, date: '2024-07-19' },
];

export const SESSIONS: Session[] = [
  {
    id: 'session-1',
    tutor: TUTORS[0],
    parent: PARENTS[0],
    subject: 'Mathematics',
    date: '2024-08-05',
    time: '4:00 PM',
    status: SessionStatus.Confirmed,
    meetingLink: '/session/session-1'
  },
  {
    id: 'session-2',
    tutor: TUTORS[1],
    parent: PARENTS[0],
    subject: 'English',
    date: '2024-08-07',
    time: '5:00 PM',
    status: SessionStatus.Pending,
    meetingLink: '/session/session-2'
  }
]

export const GRADE_LEVELS = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
  'University Level'
];

export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
  'Amharic', 'History', 'Geography', 'Social Studies', 'Computer Science'
];
