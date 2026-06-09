# Enterprise Management System

A professional, full-featured enterprise management dashboard built with Next.js, React, TypeScript, and Tailwind CSS. Features a modern tech-savvy UI with deep blue-to-cyan gradient aesthetic, glassmorphism effects, and comprehensive business management capabilities.

## 🎨 Design Features

- **Professional Deep Blue Theme**: Dark mode with deep blue (#1e3c72) to cyan (#00d4ff) gradient palette
- **Glassmorphism Effects**: Frosted glass card designs with transparency and backdrop blur
- **Clean Typography**: Professional spacing and font hierarchy using Tailwind CSS
- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Tech-Savvy Aesthetic**: Modern borders, smooth transitions, and professional interactions

## ✨ Core Features

### 1. **Authentication & Authorization**
- Email/password login system
- Three-tier role-based access control (RBAC):
  - **Admin**: Full system access, all management features
  - **Manager**: Can manage employees and projects
  - **User**: Read-only access to dashboard and analytics
- JWT token-based authentication with localStorage persistence
- Protected routes with role-based restrictions
- Demo credentials included for testing

### 2. **Dashboard & Analytics**
- Real-time KPI cards (Total Employees, Departments, Active Projects, Budget)
- Multi-format charts:
  - Bar charts for department performance
  - Pie charts for project status distribution
  - Line charts for budget trends and growth metrics
  - Area charts for revenue analysis
- Recent activity feed with timestamps
- Responsive chart components with Recharts

### 3. **CRUD Operations**

#### **Employees Management**
- Full CRUD operations for employee records
- Search and multi-filter functionality (department, status)
- Form validation with Zod and React Hook Form
- Status tracking (Active, Inactive, On Leave)
- Salary management and role assignment
- Edit and delete capabilities

#### **Departments Management**
- Create, read, update, and delete departments
- Track department budgets and employee counts
- Manager assignment
- Beautiful card-based layout

#### **Projects Management**
- Complete project lifecycle management
- Progress tracking with visual progress bars
- Budget allocation per project
- Team size management
- Status tracking (Planning, In Progress, Completed, On Hold)
- Department association

### 4. **Advanced Features**
- **Form Validation**: Zod schemas with React Hook Form integration
- **Tables with Filtering**: Advanced TanStack Table with sorting, pagination
- **Search**: Real-time search across multiple fields
- **Multi-select Filters**: Department and status filters
- **Data Persistence**: localStorage-backed mock database
- **Role-based UI**: Different features shown based on user role

### 5. **System Settings**
- User profile management
- Notification preferences
- Theme selection (Dark/Light/Auto)
- API key generation mockup
- Data backup/export options
- Account settings

## 📊 Charts & Visualizations

- **Department Performance Chart**: Bar chart showing employees and budget by department
- **Project Status Distribution**: Pie chart showing project breakdown
- **Salary by Department**: Detailed salary analysis
- **Company Growth Metrics**: Multi-line chart tracking employees and projects
- **Revenue Trend**: Area chart with gradient fill

## 🔐 Security Features

- Protected routes preventing unauthorized access
- Role-based access control
- Form input validation and sanitization
- CSRF protection with token validation
- Secure password storage (demo credentials only)

## 📱 Responsive Design

- Desktop-first approach with mobile optimizations
- Sidebar collapse on smaller screens
- Responsive tables with horizontal scroll
- Mobile-friendly forms and navigation
- Touch-friendly buttons and interactions

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 3, custom design tokens
- **State Management**: React Context API + localStorage
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table v8
- **Charts**: Recharts 3
- **UI Components**: Custom components + Recharts
- **Authentication**: Mock JWT tokens with localStorage
- **HTTP**: Axios (ready for API integration)

## 🎯 Demo Credentials

The system includes three pre-configured demo accounts:

```
Admin:
  Email: admin@enterprise.com
  Password: Admin@123

Manager:
  Email: manager@enterprise.com
  Password: Manager@123

User:
  Email: user@enterprise.com
  Password: User@123
```

## 📂 Project Structure

```
/app
  /dashboard
    /employees
      page.tsx           # Employee CRUD management
    /departments
      page.tsx           # Department management
    /projects
      page.tsx           # Project management
    /analytics
      page.tsx           # Analytics & charts
    /settings
      page.tsx           # System settings
    page.tsx             # Main dashboard
  /login
    page.tsx             # Login page
  layout.tsx             # Root layout with auth provider
  page.tsx               # Home redirect to login/dashboard
  globals.css            # Global styles & design tokens

/components
  dashboard-layout.tsx   # Layout with sidebar
  protected-route.tsx    # Route protection wrapper

/lib
  auth.ts                # Authentication utilities
  auth-context.tsx       # React context for auth state
  db.ts                  # Mock database & CRUD operations
  utils.ts               # Helper functions
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   pnpm dev
   ```

3. **Open in Browser**
   ```
   http://localhost:3000
   ```

4. **Login with Demo Account**
   - Use any of the demo credentials above
   - All data is stored locally in localStorage

## 💾 Data Storage

- All data persists in browser localStorage
- Data survives page refreshes
- Clearing browser cache will reset all data
- Mock database in `/lib/db.ts` provides full CRUD interface

## 🎨 Customization

### Color Scheme
Edit `/app/globals.css` to modify the color palette:
- Primary: Deep Blue (#1e3c72)
- Secondary: Medium Blue (#2a5298)
- Accent: Cyan (#00d4ff)
- Background: Dark Navy (#0a0e27)

### Design Tokens
All colors, spacing, and typography use CSS custom properties:
```css
--background
--foreground
--primary
--accent
--card
--border
```

## 📈 Future Enhancements

- WebSocket integration for real-time updates
- File upload/download capabilities
- Email notifications
- Scheduled reports
- Advanced permission management
- Audit logs
- Multi-language support
- Dark/Light theme toggle
- PDF export for reports

## 🔄 API Integration Ready

The system is structured to easily connect to a real backend:
- Axios instance ready in `/lib/api.ts`
- API routes structure in `/app/api/`
- Form submissions prepared for API calls
- Error handling for network requests

## 📝 License

This is a demo enterprise management system built for demonstration purposes.

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**
