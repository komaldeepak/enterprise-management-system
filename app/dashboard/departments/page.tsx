'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ProtectedRoute } from '@/components/protected-route';
import { db, Department } from '@/lib/db';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const departmentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  manager: z.string().min(2, 'Manager name is required'),
  budget: z.number().min(0, 'Budget must be positive'),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(db.getDepartments());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
  });

  const filteredDepartments = useMemo(
    () =>
      departments.filter(
        (dept) =>
          dept.name.toLowerCase().includes(search.toLowerCase()) ||
          dept.manager.toLowerCase().includes(search.toLowerCase())
      ),
    [departments, search]
  );

  const onSubmit = (data: DepartmentFormData) => {
    if (editingId) {
      const updated = db.updateDepartment(editingId, data);
      if (updated) {
        setDepartments(db.getDepartments());
        setEditingId(null);
      }
    } else {
      db.createDepartment({
        ...data,
        employeeCount: 0,
      });
      setDepartments(db.getDepartments());
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (dept: Department) => {
    reset(dept);
    setEditingId(dept.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      db.deleteDepartment(id);
      setDepartments(db.getDepartments());
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Departments</h1>
              <p className="text-sm text-muted-foreground mt-1">Organize your organization</p>
            </div>
            <button
              onClick={() => {
                reset();
                setEditingId(null);
                setShowForm(!showForm);
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition font-medium"
            >
              {showForm ? '✕ Close' : '+ Add Department'}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {editingId ? 'Edit Department' : 'Add New Department'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Department Name</label>
                  <input
                    {...register('name')}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                    placeholder="Department name"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Manager</label>
                  <input
                    {...register('manager')}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                    placeholder="Manager name"
                  />
                  {errors.manager && <p className="text-red-400 text-xs mt-1">{errors.manager.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Annual Budget</label>
                  <input
                    {...register('budget', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                    placeholder="Annual budget"
                  />
                  {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget.message}</p>}
                </div>

                <button
                  type="submit"
                  className="md:col-span-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium"
                >
                  {editingId ? 'Update Department' : 'Add Department'}
                </button>
              </form>
            </div>
          )}

          {/* Search */}
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition"
          />

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((dept) => (
              <div key={dept.id} className="bg-card border border-border rounded-xl p-6 hover:border-cyan-500/50 transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{dept.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">Manager: {dept.manager}</p>
                  </div>
                  <span className="text-2xl">🏢</span>
                </div>

                <div className="space-y-3 mb-6 py-4 border-y border-border">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Annual Budget</span>
                    <span className="text-sm font-semibold text-cyan-400">
                      ${(dept.budget / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400">Employees</span>
                    <span className="text-sm font-semibold text-white">{dept.employeeCount}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(dept)}
                    className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
