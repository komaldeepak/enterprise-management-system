'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ProtectedRoute } from '@/components/protected-route';
import { db, Employee } from '@/lib/db';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const employeeSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  departmentId: z.string().min(1, 'Department is required'),
  role: z.string().min(2, 'Role is required'),
  salary: z.number().min(0, 'Salary must be positive'),
  status: z.enum(['active', 'inactive', 'on-leave']),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(db.getEmployees());
  const [departments] = useState(db.getDepartments());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const filteredEmployees = useMemo(
    () =>
      employees.filter((emp) => {
        const matchesSearch =
          emp.name.toLowerCase().includes(search.toLowerCase()) ||
          emp.email.toLowerCase().includes(search.toLowerCase());
        const matchesDept = !departmentFilter || emp.departmentId === departmentFilter;
        const matchesStatus = !statusFilter || emp.status === statusFilter;
        return matchesSearch && matchesDept && matchesStatus;
      }),
    [employees, search, departmentFilter, statusFilter]
  );

  const onSubmit = (data: EmployeeFormData) => {
    if (editingId) {
      const updated = db.updateEmployee(editingId, data);
      if (updated) {
        setEmployees(db.getEmployees());
        setEditingId(null);
      }
    } else {
      const newEmp = db.createEmployee({
        ...data,
        joinDate: new Date().toISOString().split('T')[0],
      });
      setEmployees(db.getEmployees());
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (emp: Employee) => {
    reset(emp);
    setEditingId(emp.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      db.deleteEmployee(id);
      setEmployees(db.getEmployees());
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Employees</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your workforce</p>
            </div>
            <button
              onClick={() => {
                reset();
                setEditingId(null);
                setShowForm(!showForm);
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition font-medium"
            >
              {showForm ? '✕ Close' : '+ Add Employee'}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {editingId ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Name</label>
                  <input
                    {...register('name')}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                    placeholder="Employee name"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                    placeholder="employee@company.com"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Department</label>
                  <select
                    {...register('departmentId')}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                  >
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {errors.departmentId && (
                    <p className="text-red-400 text-xs mt-1">{errors.departmentId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Role</label>
                  <input
                    {...register('role')}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                    placeholder="Job title"
                  />
                  {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Salary</label>
                  <input
                    {...register('salary', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                    placeholder="Annual salary"
                  />
                  {errors.salary && <p className="text-red-400 text-xs mt-1">{errors.salary.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Status</label>
                  <select
                    {...register('status')}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on-leave">On Leave</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="md:col-span-2 lg:col-span-3 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium"
                >
                  {editingId ? 'Update Employee' : 'Add Employee'}
                </button>
              </form>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition"
            />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">Salary</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="border-b border-border hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4 text-sm text-white">{emp.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{emp.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {departments.find((d) => d.id === emp.departmentId)?.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">{emp.role}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">${emp.salary.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            emp.status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : emp.status === 'on-leave'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-slate-800/30 border-t border-border text-sm text-slate-400">
              Showing {filteredEmployees.length} of {employees.length} employees
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
