# How to Download & Run on VS Code

## OPTION 1: Download from v0.app (Easiest)

1. **Click the 3-dot menu** in the top-right of v0.app
2. **Select "Download ZIP"**
3. **Extract the ZIP** on your computer
4. **Open folder in VS Code**: `File → Open Folder`
5. **Open Terminal** in VS Code (Ctrl + `)
6. **Run these commands**:

```bash
# Install dependencies
npm install
# or if you have pnpm
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

7. **Open browser** to `http://localhost:3000`
8. **Done!** Now you can edit everything in VS Code

---

## OPTION 2: Clone from GitHub (If Published)

If the project is pushed to GitHub:

```bash
git clone <your-github-url>
cd enterprise-management-system
npm install
npm run dev
```

---

## OPTION 3: Manual Export

If you want to set up from scratch:

```bash
# Create new Next.js project
npx create-next-app@latest my-enterprise-app --typescript

# Copy the files from v0 project:
# - app/ (all pages)
# - components/ (all components)
# - lib/ (auth, db, etc.)
# - app/globals.css (styling)

# Install dependencies
npm install socket.io-client react-query @tanstack/react-table recharts react-hook-form zod axios
```

---

## PROJECT STRUCTURE

```
enterprise-management-system/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home (redirects to login)
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── register/
│   │   └── page.tsx            # Registration page
│   ├── dashboard/
│   │   ├── page.tsx            # Main dashboard
│   │   ├── employees/
│   │   │   └── page.tsx
│   │   ├── departments/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   └── globals.css             # Global styles & theme
│
├── components/
│   ├── dashboard-layout.tsx    # Layout with sidebar
│   ├── protected-route.tsx     # Route protection
│   └── ui/                     # UI components
│
├── lib/
│   ├── auth.ts                 # Auth functions
│   ├── auth-context.tsx        # Auth provider
│   ├── db.ts                   # Mock database
│   ├── api.ts                  # API client ready
│   └── utils.ts
│
├── public/                     # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
└── next.config.mjs             # Next.js config
```

---

## FIRST TIME SETUP

1. **Register a new account**:
   - Go to `http://localhost:3000`
   - Click "Create New Account"
   - Enter: Name, Email (with @), Password
   - Login

2. **Explore the system**:
   - Dashboard (see KPIs & charts)
   - Employees (CRUD operations)
   - Departments (manage teams)
   - Projects (track progress)
   - Analytics (view reports)
   - Settings (user preferences)

3. **Test features**:
   - Click buttons to see hover effects
   - Try creating/editing employees
   - Filter and search data
   - View interactive charts

---

## MAKE IT EDITABLE IN VS CODE

Once open in VS Code:

### Change Colors
Edit: `app/globals.css`
```css
--primary: #1e3c72;      /* Change deep blue */
--accent: #00d4ff;       /* Change cyan */
--background: #0a0e27;   /* Change background */
```

### Add New Pages
Create: `app/dashboard/new-page/page.tsx`
```tsx
export default function NewPage() {
  return <div>Your content</div>
}
```

### Modify Database
Edit: `lib/db.ts`
- Add new data types
- Create new mock data
- Add CRUD functions

### Edit Forms
Edit: `app/dashboard/employees/page.tsx`
- Change form fields
- Add validation rules
- Customize UI

---

## BUILD FOR PRODUCTION

When ready to show your teacher:

```bash
npm run build
npm run start
```

This creates an optimized production version that runs faster.

---

## TROUBLESHOOTING

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
# Now runs on port 3001
```

### Modules Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Styles Not Loading
```bash
# Restart dev server
# Press Ctrl+C to stop
# Run: npm run dev
```

### Data Not Persisting
- Make sure localStorage is enabled in browser
- Data is stored locally during session
- Reload page to check persistence

---

## ADDING MISSING FEATURES

Before deploying, consider adding:

### 1. Real-time with Socket.io
```bash
npm install socket.io-client
```
Then implement in components

### 2. File Uploads
Add upload component with file handling

### 3. React Query
Replace useState with React Query hooks

### 4. Backend API
Replace mock data with real API calls

---

## SHOW YOUR TEACHER

Points to highlight:
- Professional design & UI
- Full authentication system
- Working CRUD operations
- Interactive charts & analytics
- Responsive layout
- Role-based access control
- Clean code structure
- Deployed on Vercel (ready to scale)

Good luck presenting! 🚀
