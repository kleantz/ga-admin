# Next Steps: From MVP to Production

This guide outlines how to take your GenAssist admin dashboard from a UI prototype to a fully functional production application.

## 🎯 Phase 1: Backend Foundation (Week 1-2)

### 1.1 Choose Your Stack

**Option A: Node.js/Express**
```bash
npm install express prisma @prisma/client bcrypt jsonwebtoken
npm install -D @types/express @types/bcrypt @types/jsonwebtoken
```

**Option B: Next.js API Routes** (Recommended for this project)
- Built-in API routes in `/src/app/api/`
- No separate backend server needed
- Easy deployment on Vercel

### 1.2 Database Setup

**Recommended: PostgreSQL with Prisma**

1. Install Prisma:
```bash
npm install prisma @prisma/client
npx prisma init
```

2. Create schema (`prisma/schema.prisma`):
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Account {
  id                      String   @id @default(cuid())
  name                    String
  plan                    String   // "Enterprise" | "Pro" | "Free"
  seatsTotal              Int
  seatsUsed               Int      @default(0)
  status                  String   // "Active" | "Trial" | "Suspended"
  contactEmail            String
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  
  users                   User[]
  
  @@index([status])
  @@index([createdAt])
}

model User {
  id                      String   @id @default(cuid())
  name                    String
  email                   String   @unique
  passwordHash            String
  role                    String   // "Admin" | "Agent" | "Supervisor"
  status                  String   // "Active" | "Pending" | "Suspended"
  lastLogin               DateTime?
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  
  accountId               String
  account                 Account  @relation(fields: [accountId], references: [id], onDelete: Cascade)
  
  @@index([email])
  @@index([accountId])
  @@index([status])
}

model AdminUser {
  id                      String   @id @default(cuid())
  email                   String   @unique
  passwordHash            String
  name                    String
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
  lastLogin               DateTime?
  
  @@index([email])
}
```

3. Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 1.3 Create API Routes

**Structure:**
```
src/app/api/
├── accounts/
│   ├── route.ts              # GET /api/accounts, POST /api/accounts
│   └── [id]/
│       ├── route.ts          # GET, PUT, DELETE /api/accounts/:id
│       └── users/
│           └── route.ts      # GET /api/accounts/:id/users
├── users/
│   ├── route.ts              # GET /api/users, POST /api/users
│   └── [id]/
│       └── route.ts          # GET, PUT, DELETE /api/users/:id
└── auth/
    ├── login/
    │   └── route.ts          # POST /api/auth/login
    └── logout/
        └── route.ts          # POST /api/auth/logout
```

**Example: GET /api/accounts**
```typescript
// src/app/api/accounts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    const accounts = await prisma.account.findMany({
      where: status ? { status } : undefined,
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(accounts)
  } catch (error) {
    console.error('Error fetching accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accounts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    
    const body = await request.json()
    const { name, plan, seatsTotal, contactEmail } = body
    
    // Validation
    if (!name || !plan || !seatsTotal || !contactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const account = await prisma.account.create({
      data: {
        name,
        plan,
        seatsTotal,
        contactEmail,
        status: 'Active'
      }
    })
    
    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    console.error('Error creating account:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
```

### 1.4 Update Frontend to Use API

**Create a data fetching utility:**
```typescript
// src/lib/api.ts
export async function fetchAccounts(status?: string) {
  const url = status 
    ? `/api/accounts?status=${status}`
    : '/api/accounts'
    
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch accounts')
  return res.json()
}

export async function createAccount(data: {
  name: string
  plan: string
  seatsTotal: number
  contactEmail: string
}) {
  const res = await fetch('/api/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to create account')
  return res.json()
}
```

**Update page.tsx to use real data:**
```typescript
// src/app/page.tsx
import { fetchAccounts } from '@/lib/api'

export default async function AccountManagement() {
  const accounts = await fetchAccounts()
  
  // Rest of your component using real data
}
```

## 🔐 Phase 2: Authentication (Week 3)

### 2.1 Install NextAuth.js

```bash
npm install next-auth @auth/prisma-adapter
```

### 2.2 Setup Authentication

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const admin = await prisma.adminUser.findUnique({
          where: { email: credentials.email }
        })

        if (!admin) {
          return null
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          admin.passwordHash
        )

        if (!isValid) {
          return null
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 2.3 Protect Routes

```typescript
// src/middleware.ts
export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/", "/dashboard", "/api/:path*"]
}
```

## 📱 Phase 3: Core Features (Week 4-5)

### 3.1 Implement CRUD Operations

For each entity (Accounts, Users):
- ✅ Create
- ✅ Read (list + detail)
- ✅ Update
- ✅ Delete (with confirmation)

### 3.2 Add Search & Filtering

```typescript
// Update API route to support search
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  const status = searchParams.get('status')
  
  const accounts = await prisma.account.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { contactEmail: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        status ? { status } : {}
      ]
    }
  })
  
  return NextResponse.json(accounts)
}
```

### 3.3 Add Loading & Error States

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchAccounts()
      .then(setAccounts)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])
  
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return (
    // Your component with accounts data
  )
}
```

## 🎨 Phase 4: Enhanced UX (Week 6)

### 4.1 Add Forms

Install form library:
```bash
npm install react-hook-form zod @hookform/resolvers
```

Create account form:
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const accountSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  plan: z.enum(['Enterprise', 'Pro', 'Free']),
  seatsTotal: z.number().min(1, 'Must have at least 1 seat'),
  contactEmail: z.string().email('Invalid email address')
})

export function CreateAccountForm() {
  const form = useForm({
    resolver: zodResolver(accountSchema)
  })
  
  async function onSubmit(data: z.infer<typeof accountSchema>) {
    await createAccount(data)
    // Handle success
  }
  
  return (
    // Form JSX
  )
}
```

### 4.2 Add Toast Notifications

```bash
npm install sonner
```

### 4.3 Add Confirmation Dialogs

Use shadcn AlertDialog for destructive actions.

## 📊 Phase 5: Advanced Features (Week 7+)

### 5.1 Add Analytics (After Core Works)

- Track account creation over time
- Monitor active users
- Dashboard metrics with real data

### 5.2 Add Billing (When Monetizing)

- Integrate Stripe
- Invoice generation
- Subscription management

### 5.3 Add Security Features (When Needed)

- Audit logs for admin actions
- RBAC (Role-Based Access Control)
- 2FA for admin users

## 🚀 Phase 6: Deployment

### Option A: Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel
```

Set environment variables:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### Option B: Docker + Railway/Render

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["npm", "start"]
```

## 📋 Checklist

### Must-Have Before Launch
- [ ] Database setup and migrations
- [ ] Basic CRUD for accounts
- [ ] Basic CRUD for users
- [ ] Authentication for admin users
- [ ] Protected API routes
- [ ] Error handling
- [ ] Input validation
- [ ] Loading states

### Nice-to-Have
- [ ] Search functionality
- [ ] Advanced filtering
- [ ] Pagination
- [ ] Export data (CSV)
- [ ] Email notifications
- [ ] Activity logs

### Can Wait
- [ ] Analytics dashboard
- [ ] Billing integration
- [ ] Security features (GDPR, audit logs)
- [ ] API keys and webhooks
- [ ] Multi-tenant support

## 🛠 Development Tips

1. **Start with one entity**: Get accounts working end-to-end before moving to users
2. **Test as you go**: Use Postman/Thunder Client to test API routes
3. **Use TypeScript**: Type safety will save you hours of debugging
4. **Handle errors properly**: User-friendly error messages matter
5. **Think about scale later**: Get it working first, optimize later

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Vercel Deployment](https://vercel.com/docs)

## 🤔 Questions to Answer

Before building each feature, ask:
1. **Do I need this now?** (MVP mindset)
2. **Can users accomplish their goals without it?**
3. **Is there a simpler way to solve this?**
4. **What's the minimum version that works?**

Remember: **Ship fast, iterate faster.** 🚀


