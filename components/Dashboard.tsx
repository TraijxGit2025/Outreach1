import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Briefcase, Users, Mail, DollarSign } from 'lucide-react';
import { Investor } from '../types';

interface DashboardProps {
  investors: Investor[];
}

const Dashboard: React.FC<DashboardProps> = ({ investors }) => {
  const data = [
    { name: 'Analysis', value: 100 },
    { name: 'Matched', value: investors.length || 45 },
    { name: 'Outreach', value: 12 },
    { name: 'Meetings', value: 3 },
  ];

  const pieData = [
    { name: 'High Match (>80%)', value: investors.filter(i => (i.matchScore || 0) > 80).length || 5 },
    { name: 'Med Match (50-80%)', value: investors.filter(i => (i.matchScore || 0) <= 80 && (i.matchScore || 0) > 50).length || 8 },
    { name: 'Low Match (<50%)', value: investors.filter(i => (i.matchScore || 0) <= 50).length || 2 },
  ];

  const COLORS = ['#4f46e5', '#818cf8', '#e2e8f0'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Pipeline Value</p>
              <h3 className="text-2xl font-bold text-slate-800">$2.0M</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Investors Matched</p>
              <h3 className="text-2xl font-bold text-slate-800">{investors.length > 0 ? investors.length : '0'}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-full">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Campaigns Active</p>
              <h3 className="text-2xl font-bold text-slate-800">1</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Avg. Open Rate</p>
              <h3 className="text-2xl font-bold text-slate-800">--</h3>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <Mail className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Funnel Velocity</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
              <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Match Quality Distribution</h3>
          {investors.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              No matching data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
