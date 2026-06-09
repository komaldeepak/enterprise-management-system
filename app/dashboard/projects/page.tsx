'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ProtectedRoute } from '@/components/protected-route';
import { db, Project } from '@/lib/db';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(5, 'Description is required'),
  departmentId: z.string().min(1, 'Department is required'),
  status: z.enum(['planning', 'in-progress', 'completed', 'on-hold']),
  progress: z.number().min(0).max(100, 'Progress must be 0-100'),
  budget: z.number().min(0, 'Budget must be positive'),
  teamSize: z.number().min(1, 'Team size must be at least 1'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(db.getProjects());
  const [departments] = useState(db.getDepartments());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const filteredProjects = useMemo(
    () =>
      projects.filter((proj) => {
        const matchesSearch = proj.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = !statusFilter || proj.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [projects, search, statusFilter]
  );

  const onSubmit = (data: ProjectFormData) => {
    if (editingId) {
      const updated = db.updateProject(editingId, data);
      if (updated) {
        setProjects(db.getProjects());
        setEditingId(null);
      }
    } else {
      const newProj = db.createProject({
        ...data,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      setProjects(db.getProjects());
    }
    reset();
    setShowForm(false);
  };

  const handleEdit = (proj: Project) => {
    reset(proj);
    setEditingId(proj.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      db.deleteProject(id);
      setProjects(db.getProjects());
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      planning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'on-hold': 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status as keyof typeof colors] || colors['planning'];
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Projects</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage project portfolio</p>
            </div>
            <button
              onClick={() => {
                reset();
                setEditingId(null);
                setShowForm(!showForm);
              }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition font-medium"
            >
              {showForm ? '✕ Close' : '+ New Project'}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                {editingId ? 'Edit Project' : 'Create New Project'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">Project Name</label>
                    <input
                      {...register('name')}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                      placeholder="Project name"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">Description</label>
                  <textarea
                    {...register('description')}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                    placeholder="Project description"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">Status</label>
                    <select
                      {...register('status')}
                      className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                    >
                      <option value="planning">Planning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">Progress %</label>
                    <input
                      {...register('progress', { valueAsNumber: true })}
                      type="number"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                    />
                    {errors.progress && <p className="text-red-400 text-xs mt-1">{errors.progress.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">Budget</label>
                    <input
                      {...register('budget', { valueAsNumber: true })}
                      type="number"
                      className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                      placeholder="Project budget"
                    />
                    {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">Team Size</label>
                    <input
                      {...register('teamSize', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
                    />
                    {errors.teamSize && <p className="text-red-400 text-xs mt-1">{errors.teamSize.message}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium"
                >
                  {editingId ? 'Update Project' : 'Create Project'}
                </button>
              </form>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 bg-card border border-border rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg text-white focus:border-cyan-500 focus:outline-none transition"
            >
              <option value="">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((proj) => (
              <div key={proj.id} className="bg-card border border-border rounded-xl p-6 hover:border-cyan-500/50 transition flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{proj.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{proj.description}</p>
                  </div>
                  <span className="text-2xl ml-2">📋</span>
                </div>

                <div className="space-y-3 mb-4 py-4 border-y border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Progress</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(proj.status)}`}>
                      {proj.status}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-slate-400">Completion</span>
                      <span className="text-xs font-semibold text-cyan-400">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Budget</span>
                      <p className="font-semibold text-white">${(proj.budget / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Team Size</span>
                      <p className="font-semibold text-white">{proj.teamSize} members</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleEdit(proj)}
                    className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
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
