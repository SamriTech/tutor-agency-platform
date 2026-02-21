
import { Tutor, TutorStatus, Commission, Parent, Role, Session, SessionStatus } from './types';

export const TUTORS: Tutor[] = [
  {
    id: 'tutor-1',
    name: 'Abebe Bikila',
    email: 'abebe@hytor.com',
    role: Role.Tutor,
    avatarUrl: 'https://picsum.photos/seed/abebe/200',
    rating: 4.9,
    reviews: 125,
    pricePerHour: 500,
    subjects: ['Mathematics', 'Physics'],
    bio: 'Experienced Math & Physics tutor with a passion for helping students excel. MSc in Applied Physics from Addis Ababa University with over 8 years of experience in preparing students for national exams. My teaching philosophy is centered on breaking down complex problems into manageable steps.',
    status: TutorStatus.Verified,
    experience: '8+ years',
    matchScore: 98,
    qualifications: ['MSc in Applied Physics, Addis Ababa University', 'BSc in Physics, Bahir Dar University', 'Certified High School Teacher'],
    availability: [
      { day: 'Monday', times: ['4 PM - 6 PM', '7 PM - 8 PM'] },
      { day: 'Wednesday', times: ['5 PM - 8 PM'] },
      { day: 'Friday', times: ['3 PM - 7 PM'] },
      { day: 'Saturday', times: ['10 AM - 2 PM'] },
    ],
  },
  {
    id: 'tutor-2',
    name: 'Fatuma Roba',
    email: 'fatuma@hytor.com',
    role: Role.Tutor,
    avatarUrl: 'https://picsum.photos/seed/fatuma/200',
    rating: 4.8,
    reviews: 98,
    pricePerHour: 450,
    subjects: ['English', 'History'],
    bio: 'Dedicated English literature graduate focused on building strong reading and writing skills.',
    status: TutorStatus.Verified,
    experience: '5 years',
    matchScore: 95,
    qualifications: ['BA in English Literature, University of Gondar', 'TEFL Certified'],
    availability: [
      { day: 'Tuesday', times: ['4 PM - 7 PM'] },
      { day: 'Thursday', times: ['4 PM - 7 PM'] },
      { day: 'Sunday', times: ['1 PM - 5 PM'] },
    ],
  },
  {
    id: 'tutor-3',
    name: 'Haile Gebreselassie',
    email: 'haile@hytor.com',
    role: Role.Tutor,
    avatarUrl: 'https://picsum.photos/seed/haile/200',
    rating: 5.0,
    reviews: 210,
    pricePerHour: 600,
    subjects: ['Chemistry', 'Biology'],
    bio: 'Medical student with a deep understanding of biological sciences. Making complex topics easy to grasp.',
    status: TutorStatus.Verified,
    experience: '4 years',
    matchScore: 92,
    qualifications: ['4th Year Medical Student, Black Lion Hospital', 'Top Scorer in National Exams (Biology)'],
    availability: [
      { day: 'Monday', times: ['6 PM - 9 PM'] },
      { day: 'Saturday', times: ['9 AM - 1 PM', '3 PM - 6 PM'] },
      { day: 'Sunday', times: ['9 AM - 1 PM'] },
    ],
  },
  {
    id: 'tutor-4',
    name: 'Derartu Tulu',
    email: 'derartu@hytor.com',
    role: Role.Tutor,
    avatarUrl: 'https://picsum.photos/seed/derartu/200',
    rating: 4.7,
    reviews: 80,
    pricePerHour: 400,
    subjects: ['Amharic', 'Social Studies'],
    bio: 'Patient and encouraging tutor for primary and middle school students.',
    status: TutorStatus.Verified,
    experience: '6 years',
    qualifications: ['BEd in Primary Education, Kotebe University'],
     availability: [
      { day: 'Monday', times: ['4 PM - 6 PM'] },
      { day: 'Tuesday', times: ['4 PM - 6 PM'] },
      { day: 'Wednesday', times: ['4 PM - 6 PM'] },
      { day: 'Thursday', times: ['4 PM - 6 PM'] },
    ],
  },
    {
    id: 'tutor-5',
    name: 'Kenenisa Bekele',
    email: 'kenenisa@hytor.com',
    role: Role.Tutor,
    avatarUrl: 'https://picsum.photos/seed/kenenisa/200',
    rating: 4.8,
    reviews: 150,
    pricePerHour: 550,
    subjects: ['Computer Science', 'Programming'],
    bio: 'Software developer helping students with Python, Java, and web development fundamentals.',
    status: TutorStatus.Verified,
    experience: '7 years',
    qualifications: ['BSc in Computer Science, Addis Ababa Institute of Technology'],
     availability: [
      { day: 'Friday', times: ['6 PM - 9 PM'] },
      { day: 'Saturday', times: ['2 PM - 8 PM'] },
      { day: 'Sunday', times: ['2 PM - 8 PM'] },
    ],
  },
];

export const PARENTS: Parent[] = [
    {
        id: 'parent-1',
        name: 'Aster Aweke',
        email: 'aster@parent.com',
        role: Role.Parent,
        studentGradeLevel: 'Grade 8',
        location: 'Bole, Addis Ababa',
        avatarUrl: 'https://picsum.photos/seed/aster/200',
    }
];

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
