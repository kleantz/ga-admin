# GenAssist Admin Dashboard - MVP

A minimal, focused admin dashboard for managing GenAssist accounts and users. Built with Next.js, TypeScript, and Tailwind CSS.

## 🎯 Current Status: MVP (Minimum Viable Product)

This is a **simplified, UI-only prototype** focused on core account management. The interface uses mock data and does not yet have backend integration.

## ✨ Features (Current)

### 📊 Dashboard
- Overview of total accounts and users
- Quick stats (active, suspended, pending)
- Recent accounts list
- Simple, clean interface

### 👥 Account Management
- View all accounts with detailed information
- View all users across accounts
- Filter by status (Active, Trial, Suspended)
- Search functionality (UI ready)
- Account details including:
  - Plan type (Enterprise, Pro, Free)
  - Seat usage
  - Contact information
  - Status tracking

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Design**: Minimal, Apple-style interface

## 📁 Project Structure

```
genassist/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Account Management (main page)
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard with stats
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── root-layout.tsx   # Main layout wrapper
│   │   │   └── sidebar.tsx       # Navigation sidebar
│   │   └── ui/                   # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── table.tsx
│   │       └── ... (other shadcn components)
│   └── lib/
│       └── utils.ts              # Utility functions
├── public/                        # Static assets
└── package.json                   # Dependencies
```

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design Principles

- **Minimal & Clean**: Apple-style interface with plenty of white space
- **Focus on Core**: Only essential features for account management
- **Modern UI**: Using shadcn/ui components for consistency
- **Mobile-First**: Responsive design that works on all devices
- **Accent Color**: Primary accent `#5261FF` for key actions

## 📦 Current Data Model (Mock)

### Account
```typescript
{
  id: string
  name: string
  plan: "Enterprise" | "Pro" | "Free"
  seatsUsed: number
  seatsTotal: number
  status: "Active" | "Trial" | "Suspended"
  usage: number (percentage)
  createdAt: string (ISO date)
  contactEmail: string
  nextRenewal: string (ISO date)
  conversationsThisMonth: number
  aiProvider: string
}
```

### User
```typescript
{
  id: string
  name: string
  email: string
  role: "Admin" | "Agent" | "Supervisor"
  accountId: string
  accountName: string
  status: "Active" | "Pending"
  lastLogin: string (ISO timestamp)
  ticketsHandled: number
  conversationsProcessed: number
}
```

## 🔄 Next Steps

See [NEXT_STEPS.md](./NEXT_STEPS.md) for detailed guidance on:
- Backend API implementation
- Database schema design
- Authentication & authorization
- Feature roadmap (billing, analytics, security)

## 🧹 What Was Removed

This MVP version removed the following features that were too advanced for initial release:
- ❌ Security & Compliance (audit logs, GDPR, incidents)
- ❌ Billing & Payments (invoices, subscriptions, coupons)
- ❌ Analytics & Usage Tracking
- ❌ Product Configuration (feature flags, integrations, API keys)

These features can be added back incrementally as the product matures.

## 📝 Development Notes

### Mock Data
All data is currently hardcoded in the components. Search for `mockData` to find these sections:
- `/src/app/page.tsx` - Account and user data
- `/src/app/dashboard/page.tsx` - Dashboard stats

### UI Components
Uses shadcn/ui components which are:
- Fully customizable
- Built on Radix UI primitives
- Copy-paste into your project
- No NPM package needed

## 🤝 Contributing

When building features:
1. Start with the backend API first
2. Replace mock data with real API calls
3. Add proper error handling
4. Implement loading states
5. Add TypeScript types for all data

## 📄 License

This project is proprietary software for GenAssist internal use.
# ga-admin
