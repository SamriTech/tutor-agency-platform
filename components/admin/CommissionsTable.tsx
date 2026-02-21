import React from 'react';
import { Commission } from '../../types';

interface CommissionsTableProps {
  commissions: Commission[];
}

const CommissionsTable: React.FC<CommissionsTableProps> = ({ commissions }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-left text-neutral-500">
        <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
          <tr>
            <th className="px-6 py-3">Tutor</th>
            <th className="px-6 py-3">Parent</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {commissions.map(c => (
            <tr key={c.id} className="bg-white border-b hover:bg-neutral-50">
              <td className="px-6 py-4 font-medium text-neutral-900">{c.tutorName}</td>
              <td className="px-6 py-4">{c.parentName}</td>
              <td className="px-6 py-4">{c.date}</td>
              <td className="px-6 py-4 font-semibold text-secondary">ETB {c.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommissionsTable;
