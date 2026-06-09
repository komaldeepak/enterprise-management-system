export interface Employee {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  role: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  budget: number;
  employeeCount: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  teamSize: number;
}

// Mock Data
const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    manager: 'John Doe',
    budget: 500000,
    employeeCount: 15,
  },
  {
    id: '2',
    name: 'Sales',
    manager: 'Jane Smith',
    budget: 300000,
    employeeCount: 10,
  },
  {
    id: '3',
    name: 'Marketing',
    manager: 'Mike Johnson',
    budget: 200000,
    employeeCount: 8,
  },
  {
    id: '4',
    name: 'HR',
    manager: 'Sarah Williams',
    budget: 150000,
    employeeCount: 5,
  },
];

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@enterprise.com',
    departmentId: '1',
    role: 'Senior Developer',
    salary: 120000,
    joinDate: '2022-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@enterprise.com',
    departmentId: '1',
    role: 'Full Stack Developer',
    salary: 95000,
    joinDate: '2022-06-01',
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@enterprise.com',
    departmentId: '2',
    role: 'Sales Executive',
    salary: 85000,
    joinDate: '2021-03-20',
    status: 'active',
  },
  {
    id: '4',
    name: 'Emily Brown',
    email: 'emily@enterprise.com',
    departmentId: '3',
    role: 'Marketing Manager',
    salary: 75000,
    joinDate: '2022-09-10',
    status: 'active',
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@enterprise.com',
    departmentId: '1',
    role: 'DevOps Engineer',
    salary: 110000,
    joinDate: '2021-11-01',
    status: 'on-leave',
  },
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Platform Redesign',
    description: 'Complete redesign of the main platform',
    departmentId: '1',
    status: 'in-progress',
    progress: 65,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    budget: 250000,
    teamSize: 8,
  },
  {
    id: '2',
    name: 'Q2 Sales Push',
    description: 'Sales campaign for Q2',
    departmentId: '2',
    status: 'in-progress',
    progress: 45,
    startDate: '2024-04-01',
    endDate: '2024-06-30',
    budget: 150000,
    teamSize: 6,
  },
  {
    id: '3',
    name: 'Brand Refresh',
    description: 'Update brand identity and materials',
    departmentId: '3',
    status: 'planning',
    progress: 20,
    startDate: '2024-05-01',
    endDate: '2024-07-31',
    budget: 80000,
    teamSize: 4,
  },
  {
    id: '4',
    name: 'API Integration',
    description: 'Integrate third-party payment APIs',
    departmentId: '1',
    status: 'completed',
    progress: 100,
    startDate: '2023-12-01',
    endDate: '2024-02-28',
    budget: 120000,
    teamSize: 5,
  },
];

// Database instance stored in localStorage
class MockDatabase {
  private employees: Employee[] = mockEmployees;
  private departments: Department[] = mockDepartments;
  private projects: Project[] = mockProjects;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('db_mock');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.employees = data.employees || this.employees;
        this.departments = data.departments || this.departments;
        this.projects = data.projects || this.projects;
      } catch (e) {
        console.error('Failed to load database from storage', e);
      }
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        'db_mock',
        JSON.stringify({
          employees: this.employees,
          departments: this.departments,
          projects: this.projects,
        })
      );
    } catch (e) {
      console.error('Failed to save database to storage', e);
    }
  }

  // Employees
  getEmployees(): Employee[] {
    return [...this.employees];
  }

  getEmployee(id: string): Employee | null {
    return this.employees.find((e) => e.id === id) || null;
  }

  createEmployee(employee: Omit<Employee, 'id'>): Employee {
    const newEmployee: Employee = {
      ...employee,
      id: Math.random().toString(),
    };
    this.employees.push(newEmployee);
    this.saveToStorage();
    return newEmployee;
  }

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const index = this.employees.findIndex((e) => e.id === id);
    if (index === -1) return null;
    this.employees[index] = { ...this.employees[index], ...updates };
    this.saveToStorage();
    return this.employees[index];
  }

  deleteEmployee(id: string): boolean {
    const index = this.employees.findIndex((e) => e.id === id);
    if (index === -1) return false;
    this.employees.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Departments
  getDepartments(): Department[] {
    return [...this.departments];
  }

  getDepartment(id: string): Department | null {
    return this.departments.find((d) => d.id === id) || null;
  }

  createDepartment(department: Omit<Department, 'id'>): Department {
    const newDept: Department = {
      ...department,
      id: Math.random().toString(),
    };
    this.departments.push(newDept);
    this.saveToStorage();
    return newDept;
  }

  updateDepartment(id: string, updates: Partial<Department>): Department | null {
    const index = this.departments.findIndex((d) => d.id === id);
    if (index === -1) return null;
    this.departments[index] = { ...this.departments[index], ...updates };
    this.saveToStorage();
    return this.departments[index];
  }

  deleteDepartment(id: string): boolean {
    const index = this.departments.findIndex((d) => d.id === id);
    if (index === -1) return false;
    this.departments.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Projects
  getProjects(): Project[] {
    return [...this.projects];
  }

  getProject(id: string): Project | null {
    return this.projects.find((p) => p.id === id) || null;
  }

  createProject(project: Omit<Project, 'id'>): Project {
    const newProject: Project = {
      ...project,
      id: Math.random().toString(),
    };
    this.projects.push(newProject);
    this.saveToStorage();
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.projects[index] = { ...this.projects[index], ...updates };
    this.saveToStorage();
    return this.projects[index];
  }

  deleteProject(id: string): boolean {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.projects.splice(index, 1);
    this.saveToStorage();
    return true;
  }
}

export const db = new MockDatabase();
