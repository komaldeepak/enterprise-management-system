import { jwtDecode } from 'jwt-decode';

export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthToken {
  token: string;
  user: User;
}

// Email validation
export function validateEmail(email: string): boolean {
  return email.includes('@') && email.includes('.');
}

// Get stored users from localStorage
function getStoredUsers(): Array<{
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}> {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('users');
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Save users to localStorage
function saveStoredUsers(users: Array<{
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('users', JSON.stringify(users));
}

// Mock users database - starts empty
let mockUsers = getStoredUsers();

// Mock JWT token creation
function createMockToken(user: Omit<User, 'id'>): string {
  const payload = {
    sub: Math.random().toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function mockLogin(email: string, password: string): AuthToken | null {
  const user = mockUsers.find((u) => u.email === email && u.password === password);
  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  const token = createMockToken(userWithoutPassword);

  return {
    token,
    user: userWithoutPassword as User,
  };
}

export function mockRegister(
  email: string,
  password: string,
  name: string
): AuthToken | null {
  // Validate email format
  if (!validateEmail(email)) {
    return null; // Invalid email format
  }

  // Check if email already exists
  if (mockUsers.some((u) => u.email === email)) {
    return null; // Email already exists
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password,
    name,
    role: 'user' as UserRole,
  };

  mockUsers.push(newUser);
  saveStoredUsers(mockUsers);

  const { password: _, ...userWithoutPassword } = newUser;
  const token = createMockToken(userWithoutPassword as Omit<User, 'id'>);

  return {
    token,
    user: userWithoutPassword as User,
  };
}

export function validateToken(token: string): User | null {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp < now) {
      return null; // Token expired
    }

    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

export function getStoredAuth(): AuthToken | null {
  if (typeof window === 'undefined') return null;

  const stored = localStorage.getItem('auth');
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setStoredAuth(auth: AuthToken): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth', JSON.stringify(auth));
}

export function clearStoredAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth');
}
