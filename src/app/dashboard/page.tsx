"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import RootLayout from "@/components/layout/root-layout"
import { InviteUserDialog } from "@/components/invite-user-dialog"
import { CreateAccountDialog } from "@/components/create-account-dialog"
import { 
  Users,
  UserCheck,
  Building2,
  TrendingUp,
  MessageSquare,
  Workflow,
  UserPlus,
  Plus,
  Activity,
  Clock
} from "lucide-react"

// Mock data - replace with real API calls
const mockData = {
  stats: {
    totalAccounts: 127,
    activeAccounts: 118,
    trialAccounts: 5,
    suspendedAccounts: 4,
    totalUsers: 1843,
    activeUsers: 1756,
    pendingUsers: 87,
    totalConversations: 45892,
    conversationsThisMonth: 12347,
    activeWorkflows: 342,
    mrr: 89500, // Monthly Recurring Revenue
    accountsThisMonth: 12,
    usersThisMonth: 156
  },
  recentActivity: [
    {
      id: "1",
      type: "account_created",
      title: "New account created",
      description: "TechVision Inc. joined on Enterprise plan",
      timestamp: "2024-03-15T14:30:00Z",
      icon: "building"
    },
    {
      id: "2",
      type: "user_invited",
      title: "User invitation sent",
      description: "Sarah Chen invited to DataCorp Solutions",
      timestamp: "2024-03-15T13:15:00Z",
      icon: "user"
    },
    {
      id: "3",
      type: "account_upgraded",
      title: "Account upgraded",
      description: "StartupLabs upgraded from Pro to Enterprise",
      timestamp: "2024-03-15T11:45:00Z",
      icon: "trending"
    },
    {
      id: "4",
      type: "user_activated",
      title: "User activated",
      description: "Michael Torres completed account setup",
      timestamp: "2024-03-15T10:20:00Z",
      icon: "check"
    },
    {
      id: "5",
      type: "workflow_created",
      title: "Workflow created",
      description: "InnovateLabs created 3 new workflows",
      timestamp: "2024-03-15T09:00:00Z",
      icon: "workflow"
    }
  ],
  accounts: [
    { id: "1", name: "TechCorp Solutions", plan: "Enterprise" as const, contactEmail: "admin@techcorp.com" },
    { id: "2", name: "InnovateLabs", plan: "Pro" as const, contactEmail: "hello@innovatelabs.com" },
    { id: "3", name: "Quantum Dynamics", plan: "Free" as const, contactEmail: "contact@quantum.com" }
  ]
}

export default function Dashboard() {
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false)
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false)
  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return <Badge variant="default" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Enterprise</Badge>
      case 'Pro':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pro</Badge>
      case 'Free':
        return <Badge variant="outline">Free</Badge>
      default:
        return <Badge variant="outline">{plan}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case 'Trial':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Trial</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return formatDate(dateString)
  }

  return (
    <RootLayout>
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsInviteUserOpen(true)}
              >
                <UserPlus className="w-4 h-4" />
                Invite User
              </Button>
              <Button 
                size="sm" 
                className="bg-[#5261FF] hover:bg-[#4A56E8]"
                onClick={() => setIsCreateAccountOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Accounts */}
          <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-zinc-600">Total Accounts</CardTitle>
                <Building2 className="w-5 h-5 text-zinc-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-zinc-900">{mockData.stats.totalAccounts}</div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-green-600 font-medium">+{mockData.stats.accountsThisMonth}</span>
                <span className="text-zinc-500">this month</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-zinc-600">Total Users</CardTitle>
                <Users className="w-5 h-5 text-zinc-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-zinc-900">{mockData.stats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-green-600 font-medium">+{mockData.stats.usersThisMonth}</span>
                <span className="text-zinc-500">this month</span>
              </div>
            </CardContent>
          </Card>

          {/* Active Workflows */}
          <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-zinc-600">Active Workflows</CardTitle>
                <Workflow className="w-5 h-5 text-zinc-400" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-zinc-900">{mockData.stats.activeWorkflows}</div>
              <p className="text-xs text-zinc-500 mt-2">Across all accounts</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-zinc-900">Recent Activity</CardTitle>
                <Activity className="w-5 h-5 text-zinc-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.recentActivity.map((activity) => {
                  const getIcon = () => {
                    switch (activity.icon) {
                      case 'building': return <Building2 className="w-4 h-4" />
                      case 'user': return <UserPlus className="w-4 h-4" />
                      case 'trending': return <TrendingUp className="w-4 h-4" />
                      case 'check': return <UserCheck className="w-4 h-4" />
                      case 'workflow': return <Workflow className="w-4 h-4" />
                      default: return <Activity className="w-4 h-4" />
                    }
                  }

                  const getIconColor = () => {
                    switch (activity.icon) {
                      case 'building': return 'bg-purple-100 text-purple-600'
                      case 'user': return 'bg-blue-100 text-blue-600'
                      case 'trending': return 'bg-green-100 text-green-600'
                      case 'check': return 'bg-emerald-100 text-emerald-600'
                      case 'workflow': return 'bg-orange-100 text-orange-600'
                      default: return 'bg-zinc-100 text-zinc-600'
                    }
                  }

                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor()}`}>
                        {getIcon()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900">{activity.title}</p>
                        <p className="text-xs text-zinc-500 truncate">{activity.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-400 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(activity.timestamp)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Platform Stats */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-zinc-900">Platform Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Conversations */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">Total Conversations</p>
                      <p className="text-xs text-zinc-500">All time</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-zinc-900">{mockData.stats.totalConversations.toLocaleString()}</p>
                    <p className="text-xs text-green-600 font-medium">+{mockData.stats.conversationsThisMonth.toLocaleString()} this month</p>
                  </div>
                </div>

                {/* Account Status Breakdown */}
                <div className="p-4 rounded-lg bg-zinc-50">
                  <p className="text-sm font-medium text-zinc-900 mb-3">Account Status</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-zinc-600">Active</span>
                      </div>
                      <span className="text-sm font-medium text-zinc-900">{mockData.stats.activeAccounts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-zinc-600">Trial</span>
                      </div>
                      <span className="text-sm font-medium text-zinc-900">{mockData.stats.trialAccounts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <span className="text-sm text-zinc-600">Suspended</span>
                      </div>
                      <span className="text-sm font-medium text-zinc-900">{mockData.stats.suspendedAccounts}</span>
                    </div>
                  </div>
                </div>

                {/* User Status Breakdown */}
                <div className="p-4 rounded-lg bg-zinc-50">
                  <p className="text-sm font-medium text-zinc-900 mb-3">User Status</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-zinc-600">Active</span>
                      </div>
                      <span className="text-sm font-medium text-zinc-900">{mockData.stats.activeUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <span className="text-sm text-zinc-600">Pending</span>
                      </div>
                      <span className="text-sm font-medium text-zinc-900">{mockData.stats.pendingUsers}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Invite User Dialog */}
      <InviteUserDialog
        isOpen={isInviteUserOpen}
        onClose={() => setIsInviteUserOpen(false)}
        accounts={mockData.accounts}
      />

      {/* Create Account Dialog */}
      <CreateAccountDialog
        isOpen={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
      />
    </RootLayout>
  )
}
