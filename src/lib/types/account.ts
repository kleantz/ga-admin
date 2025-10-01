// Account-related type definitions

export interface Account {
  id: string
  name: string
  plan: "Enterprise" | "Pro" | "Free"
  // Deprecated fields (keeping for backwards compatibility)
  seatsUsed: number
  seatsTotal: number
  // Role-based seats
  seats: {
    admin: { used: number; total: number }
    supervisor: { used: number; total: number }
    agent: { used: number; total: number }
  }
  status: "Active" | "Trial" | "Suspended"
  usage: number
  createdAt: string
  contactEmail: string
  nextRenewal: string
  conversationsThisMonth: number
  accountManager: string
  activeWorkflows: number
}

export interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Agent" | "Supervisor"
  accountId: string
  accountName: string
  status: "Active" | "Pending"
  lastLogin: string
  ticketsHandled: number
  conversationsProcessed: number
}

