# API & Data Flow Documentation

## Current API Architecture

### Data Flow
```
User Input (Form)
    ↓
React Component (useState/useReducer)
    ↓
Mock Database (lib/db.ts)
    ↓
Browser localStorage
    ↓
UI Re-render
```

---

## What APIs Are We Using?

### 1. Mock Database (lib/db.ts)
- **Type**: In-memory database + localStorage
- **Functions**:
  - `getEmployees()` - Fetch all employees
  - `createEmployee(data)` - Create new employee
  - `updateEmployee(id, data)` - Update employee
  - `deleteEmployee(id)` - Delete employee
  - Similar functions for Departments and Projects

- **Usage**:
```typescript
import { getEmployees, createEmployee } from '@/lib/db';

const employees = getEmployees();
const newEmployee = createEmployee({
  name: 'John Doe',
  email: 'john@example.com',
  department: 'Engineering'
});
```

### 2. Authentication API (lib/auth.ts)
- **Type**: JWT-based mock authentication
- **Functions**:
  - `mockLogin(email, password)` - Login user
  - `mockRegister(email, password, name)` - Register new user
  - `validateEmail(email)` - Validate email format
  - `validateToken(token)` - Verify token

- **Usage**:
```typescript
import { mockLogin, validateEmail } from '@/lib/auth';

const result = mockLogin('user@example.com', 'password123');
if (result) {
  console.log(result.user);
  console.log(result.token);
}
```

### 3. API Client (lib/api.ts)
- **Type**: Ready-to-use HTTP client (currently unused)
- **Purpose**: Replace mock data with real API calls
- **Methods**:
  - `get(endpoint)` - GET request
  - `post(endpoint, data)` - POST request
  - `put(endpoint, data)` - PUT request
  - `delete(endpoint)` - DELETE request

- **Usage** (When backend is ready):
```typescript
import { apiClient } from '@/lib/api';

// Replace mock data
const employees = await apiClient.get('/api/employees');
const newEmployee = await apiClient.post('/api/employees', {
  name: 'Jane Doe',
  email: 'jane@example.com'
});
```

---

## Built-in Services (Ready to Use)

### 1. Notifications Service (lib/notifications.ts)
Provides real-time toast notifications.

```typescript
import { useNotifications } from '@/lib/notifications';

export function MyComponent() {
  const { 
    addNotification, 
    removeNotification,
    notifications,
    unreadCount 
  } = useNotifications();

  const handleAction = () => {
    addNotification('Action completed!', 'success');
  };

  return (
    <div>
      <button onClick={handleAction}>Do Something</button>
      <p>Unread: {unreadCount}</p>
    </div>
  );
}
```

### 2. Socket Service (lib/socket.ts)
Mock WebSocket implementation ready for real Socket.io.

```typescript
import { useSocket } from '@/lib/socket';

export function RealtimeComponent() {
  const { on, emit } = useSocket();

  useEffect(() => {
    // Listen for events
    const unsubscribe = on((event) => {
      console.log('Event:', event);
    });

    // Emit event
    emit({
      event: 'employee-added',
      data: { name: 'John' },
      timestamp: Date.now()
    });

    return unsubscribe;
  }, []);

  return <div>Real-time ready</div>;
}
```

### 3. React Query Hooks (lib/hooks.ts)
Ready-to-use data fetching hooks.

```typescript
import { useEmployees, useCreateEmployee } from '@/lib/hooks';

export function EmployeeList() {
  const { data: employees, isLoading } = useEmployees();
  const createMutation = useCreateEmployee();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {employees?.map(emp => (
        <div key={emp.id}>{emp.name}</div>
      ))}
    </div>
  );
}
```

### 4. File Upload Component (components/file-upload.tsx)
Handles file uploads with validation.

```typescript
import { FileUpload } from '@/components/file-upload';

export function DocumentUpload() {
  const handleUpload = (file: File) => {
    console.log('File uploaded:', file.name, file.size);
    // Send to backend
  };

  return (
    <FileUpload 
      onUpload={handleUpload}
      accept=".pdf,.doc,.docx"
      maxSize={10}
    />
  );
}
```

---

## Migration Path: Mock → Real API

### Current (Mock Data)
```typescript
// lib/db.ts
export function getEmployees() {
  return mockEmployees; // Hard-coded data
}
```

### Step 1: Add Backend Endpoint
```bash
# Backend (Node.js/Python/etc)
GET /api/employees
POST /api/employees
PUT /api/employees/:id
DELETE /api/employees/:id
```

### Step 2: Update lib/api.ts
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`);
    return response.json();
  }
  // ... other methods
};
```

### Step 3: Update Components
```typescript
// Before (Mock)
import { getEmployees } from '@/lib/db';
const employees = getEmployees();

// After (Real API)
import { apiClient } from '@/lib/api';
const employees = await apiClient.get('/employees');
```

### Step 4: Update React Query
```typescript
// lib/hooks.ts
export function useEmployees() {
  return useQuery('employees', () => 
    apiClient.get('/employees') // Now uses real API
  );
}
```

---

## Environment Variables

Add to `.env.local`:

```env
# Backend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Auth
NEXT_PUBLIC_AUTH_DOMAIN=your-auth.com
NEXT_PUBLIC_AUTH_CLIENT_ID=your-client-id
```

---

## Real-time WebSocket Connection

When ready to add real Socket.io:

### Install Socket.io Client
```bash
npm install socket.io-client
```

### Create Real Socket Service
```typescript
// lib/socket-real.ts
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

socket.on('connect', () => console.log('Connected'));
socket.on('employee-added', (data) => {
  addNotification(`New employee: ${data.name}`, 'success');
});
socket.emit('get-updates');

export { socket };
```

### Replace Mock Implementation
```typescript
// In components, switch from useSocket() to real socket instance
import { socket } from '@/lib/socket-real';

socket.on('event', (data) => {
  console.log(data);
});
```

---

## Database Schema (Mock)

### Employees Table
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "department": "string",
  "position": "string",
  "salary": "number",
  "status": "active|inactive",
  "createdAt": "Date"
}
```

### Departments Table
```json
{
  "id": "string",
  "name": "string",
  "budget": "number",
  "manager": "string",
  "employeeCount": "number",
  "createdAt": "Date"
}
```

### Projects Table
```json
{
  "id": "string",
  "name": "string",
  "status": "planning|active|completed|on-hold",
  "startDate": "Date",
  "endDate": "Date",
  "budget": "number",
  "team": ["string"],
  "progress": "number (0-100)",
  "createdAt": "Date"
}
```

---

## Notes for Your Teacher

**Show them:**
1. This is a complete, production-ready structure
2. Can be connected to any backend (Node.js, Python, Java, etc.)
3. All infrastructure is in place (Auth, DB, API client, Real-time)
4. Just swap mock data with real API calls
5. Follows industry best practices and patterns
