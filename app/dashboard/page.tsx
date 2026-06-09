'use client';

import React, { useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ProtectedRoute } from '@/components/protected-route';
import { db } from '@/lib/db';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const data = useMemo(() => {
    const employees = db.getEmployees();
    const departments = db.getDepartments();
    const projects = db.getProjects();

    return {
      employees,
      departments,
      projects,
      stats: {
        totalEmployees: employees.length,
        totalDepartments: departments.length,
        activeProjects: projects.filter((p) => p.status === 'in-progress').length,
        totalBudget: departments.reduce((sum, d) => sum + d.budget, 0),
      },
    };
  }, []);

  // Chart data
  const departmentData = data.departments.map((d) => ({
    name: d.name,
    employees: d.employeeCount,
    budget: d.budget / 1000, // in thousands
  }));

  const projectStatusData = [
    { name: 'In Progress', value: data.projects.filter((p) => p.status === 'in-progress').length },
    { name: 'Completed', value: data.projects.filter((p) => p.status === 'completed').length },
    { name: 'Planning', value: data.projects.filter((p) => p.status === 'planning').length },
    { name: 'On Hold', value: data.projects.filter((p) => p.status === 'on-hold').length },
  ];

  const salaryDistribution = [
    {
      name: 'Jan',
      engineering: 500000,
      sales: 300000,
      marketing: 200000,
      hr: 150000,
    },
    {
      name: 'Feb',
      engineering: 510000,
      sales: 310000,
      marketing: 210000,
      hr: 160000,
    },
    {
      name: 'Mar',
      engineering: 520000,
      sales: 320000,
      marketing: 220000,
      hr: 170000,
    },
    {
      name: 'Apr',
      engineering: 530000,
      sales: 330000,
      marketing: 230000,
      hr: 180000,
    },
  ];

  const colors = ['#00d4ff', '#2a5298', '#4a90e2', '#7b68ee'];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: 'Total Employees',
                value: data.stats.totalEmployees,
                icon: '👥',
                color: 'from-cyan-500/20 to-blue-500/20',
              },
              {
                label: 'Departments',
                value: data.stats.totalDepartments,
                icon: '🏢',
                color: 'from-purple-500/20 to-pink-500/20',
              },
              {
                label: 'Active Projects',
                value: data.stats.activeProjects,
                icon: '📋',
                color: 'from-green-500/20 to-emerald-500/20',
              },
              {
                label: 'Total Budget',
                value: `$${(data.stats.totalBudget / 1000000).toFixed(1)}M`,
                icon: '💰',
                color: 'from-orange-500/20 to-red-500/20',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${card.color} border border-cyan-500/20 rounded-xl p-6 pro-border-accent`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{card.label}</p>
                    <p className="text-3xl font-bold text-white">{card.value}</p>
                  </div>
                  <span className="text-4xl">{card.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Performance */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Department Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="name" stroke="#a0aec0" />
                  <YAxis stroke="#a0aec0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #2d3748',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="employees" fill="#00d4ff" name="Employees" />
                  <Bar dataKey="budget" fill="#2a5298" name="Budget (K)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Project Status */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Project Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #2d3748',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Budget Allocation */}
            <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-6">Budget Allocation Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salaryDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="name" stroke="#a0aec0" />
                  <YAxis stroke="#a0aec0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #2d3748',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="engineering"
                    stroke="#00d4ff"
                    name="Engineering"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#2a5298"
                    name="Sales"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="marketing"
                    stroke="#4a90e2"
                    name="Marketing"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="hr"
                    stroke="#7b68ee"
                    name="HR"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { event: 'New project created', time: '2 hours ago', icon: '📋' },
                { event: 'Employee onboarded', time: '4 hours ago', icon: '👤' },
                { event: 'Budget updated', time: '1 day ago', icon: '💰' },
                { event: 'Project completed', time: '2 days ago', icon: '✅' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 hover:bg-slate-700/50 rounded-lg transition">
                  <span className="text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.event}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
