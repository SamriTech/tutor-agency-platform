import React from 'react';

interface Stats {
  totalRevenue: number;
  todayCommissions: number;
  activeTutors: number;
  totalSessions: number;
}

interface AnalyticsDashboardProps {
  stats: Stats;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-neutral-500">Total Revenue</h3>
        <p className="text-3xl font-bold text-primary mt-2">ETB {stats.totalRevenue.toLocaleString()}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-neutral-500">Commissions (Today)</h3>
        <p className="text-3xl font-bold text-neutral-800 mt-2">ETB {stats.todayCommissions.toFixed(2)}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-neutral-500">Active Tutors</h3>
        <p className="text-3xl font-bold text-neutral-800 mt-2">{stats.activeTutors}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-neutral-500">Total Sessions</h3>
        <p className="text-3xl font-bold text-neutral-800 mt-2">{stats.totalSessions}</p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
