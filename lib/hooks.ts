import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Employee, Department, Project } from '@/lib/db';
import { getEmployees, getDepartments, getProjects } from '@/lib/db';

// React Query Hooks for Data Fetching

// Employees
export function useEmployees() {
  return useQuery('employees', () => getEmployees());
}

export function useEmployee(id: string) {
  return useQuery(['employee', id], () => {
    const employees = getEmployees();
    return employees.find((e) => e.id === id);
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: Omit<Employee, 'id' | 'createdAt'>) => {
      // In production, this would be an API call
      return { id: Date.now().toString(), ...data, createdAt: new Date() };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('employees');
      },
    }
  );
}

// Departments
export function useDepartments() {
  return useQuery('departments', () => getDepartments());
}

export function useDepartment(id: string) {
  return useQuery(['department', id], () => {
    const departments = getDepartments();
    return departments.find((d) => d.id === id);
  });
}

// Projects
export function useProjects() {
  return useQuery('projects', () => getProjects());
}

export function useProject(id: string) {
  return useQuery(['project', id], () => {
    const projects = getProjects();
    return projects.find((p) => p.id === id);
  });
}

// Usage example:
// const { data: employees, isLoading } = useEmployees();
// if (isLoading) return <div>Loading...</div>;
// return employees?.map(emp => <div key={emp.id}>{emp.name}</div>);
