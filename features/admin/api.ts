import { api } from '../../lib/api/axios';

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getVerificationQueue: () => api.get('/admin/tutors/verification-queue'),
  verifyTutor: (id: string, approved: boolean) => api.post(`/admin/tutors/${id}/verify`, { approved }),
  getCommissions: () => api.get('/admin/commissions'),
  getTopTutors: () => api.get('/admin/tutors/top'),
  getSession: (sessionId: string) => api.get(`/sessions/${sessionId}`),
};
