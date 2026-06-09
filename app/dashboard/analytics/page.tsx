'use client';

import React, { useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ProtectedRoute } from '@/components/protected-route';
import { db } from '@/lib/db';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const data = useMemo(() => {
    const employees = db.getEmployees();
    const departments = db.getDepartments();
    const projects = db.getProjects();

    // Salary by department
    const salaryByDept = departments.map((d) => {
      const deptEmployees = employees.filter((e) => e.departmentId === d.id);
      const totalSalary = deptEmployees.reduce((sum, e) => sum + e.salary, 0);
      return {
        name: d.name,
        salary: totalSalary,
        employees: deptEmployees.length,
        avgSalary: deptEmployees.length > 0 ? totalSalary / deptEmployees.length : 0,
      };
    });

    // Project budget analysis
    const projectBudget = projects.map((p) => ({
      name: p.name.substring(0, 10),
      budget: p.budget,
      progress: p.progress,
    }));

    // Monthly growth
    const monthlyData = [
      { month: 'Jan', employees: 42, projects: 3, revenue: 450000 },
      { month: 'Feb', employees: 44, projects: 4, revenue: 480000 },
      { month: 'Mar', employees: 46, projects: 4, revenue: 520000 },
      { month: 'Apr', employees: 48, projects: 5, revenue: 580000 },
      { month: 'May', employees: 50, projects: 6, revenue: 640000 },
      { month: 'Jun', employees: 52, projects: 7, revenue: 720000 },
    ];

    return {
      salaryByDept,
      projectBudget,
      monthlyData,
    };
  }, []);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">Company insights and metrics</p>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Salary by Department */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Salary by Department</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.salaryByDept}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="name" stroke="#a0aec0" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#a0aec0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #2d3748',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Legend />
                  <Bar dataKey="salary" fill="#00d4ff" name="Total Salary" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Average Salary */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Average Salary by Department</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.salaryByDept} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis type="number" stroke="#a0aec0" />
                  <YAxis type="category" dataKey="name" stroke="#a0aec0" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #2d3748',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Bar dataKey="avgSalary" fill="#2a5298" name="Avg Salary" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Project Budget */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Project Budget Allocation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.projectBudget}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="name" stroke="#a0aec0" />
                  <YAxis stroke="#a0aec0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #2d3748',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Legend />
                  <Bar dataKey="budget" fill="#4a90e2" name="Budget" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Company Growth */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Company Growth Metrics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="month" stroke="#a0aec0" />
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
                    dataKey="employees"
                    stroke="#00d4ff"
                    name="Employees"
                    strokeWidth={2}
                  />
                  <Line type="monotone" dataKey="projects" stroke="#2a5298" name="Projects" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Trend */}
            <div className="bg-card border border-border rounded-xl p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-6">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="month" stroke="#a0aec0" />
                  <YAxis stroke="#a0aec0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #2d3748',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00d4ff"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: 'Total Salary Expense',
                value: `$${(data.salaryByDept.reduce((sum, d) => sum + d.salary, 0) / 1000000).toFixed(1)}M`,
                icon: '💰',
              },
              {
                label: 'Avg Employee Salary',
                value: `$${(
                  data.salaryByDept.reduce((sum, d) => sum + d.avgSalary * d.employees, 0) /
                  data.salaryByDept.reduce((sum, d) => sum + d.employees, 0)
                ).toFixed(0)}`,
                icon: '👤',
              },
              {
                label: 'Total Project Budget',
                value: `$${(
                  data.projectBudget.reduce((sum, p) => sum + p.budget, 0) / 1000000
                ).toFixed(2)}M`,
                icon: '📋',
              },
              {
                label: 'Growth Rate',
                value: '+23.5%',
                icon: '📈',
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl p-6 flex items-start justify-between"
              >
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
