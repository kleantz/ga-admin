"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import RootLayout from "@/components/layout/root-layout"
import { AccountDetailsDialog } from "@/components/account-details-dialog"
import { EditAccountDialog } from "@/components/edit-account-dialog"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { RoleBadge } from "@/components/role-badge"
import { InviteUserDialog } from "@/components/invite-user-dialog"
import { CreateAccountDialog } from "@/components/create-account-dialog"
import { UserDetailsDialog } from "@/components/user-details-dialog"
import { EditUserDialog } from "@/components/edit-user-dialog"
import { Account, User } from "@/lib/types/account"
import { UserRole } from "@/lib/types/roles"
import { 
  Plus,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  X,
  Eye,
  Edit,
  UserX,
  CheckCircle,
  Trash2,
  Shield,
  Headphones,
  LogIn
} from "lucide-react"

// Mock data - replace with real API calls
const mockData: { accounts: Account[], users: User[] } = {
  accounts: [
    {
      id: "1",
      name: "TechCorp Solutions",
      plan: "Enterprise",
      seatsUsed: 45,
      seatsTotal: 50,
      seats: {
        admin: { used: 2, total: 5 },
        supervisor: { used: 8, total: 10 },
        agent: { used: 35, total: 35 }
      },
      status: "Active",
      usage: 78,
      createdAt: "2024-01-15",
      contactEmail: "admin@techcorp.com",
      nextRenewal: "2024-04-15",
      conversationsThisMonth: 1247,
      accountManager: "Sarah Chen",
      activeWorkflows: 24
    },
    {
      id: "2",
      name: "InnovateLabs",
      plan: "Pro",
      seatsUsed: 12,
      seatsTotal: 25,
      seats: {
        admin: { used: 2, total: 3 },
        supervisor: { used: 4, total: 7 },
        agent: { used: 6, total: 15 }
      },
      status: "Trial",
      usage: 92,
      createdAt: "2024-02-01",
      contactEmail: "hello@innovatelabs.com",
      nextRenewal: "2024-03-01",
      conversationsThisMonth: 856,
      accountManager: "Michael Torres",
      activeWorkflows: 8
    },
    {
      id: "3",
      name: "Quantum Dynamics",
      plan: "Free",
      seatsUsed: 3,
      seatsTotal: 5,
      seats: {
        admin: { used: 1, total: 1 },
        supervisor: { used: 0, total: 1 },
        agent: { used: 2, total: 3 }
      },
      status: "Active",
      usage: 45,
      createdAt: "2024-01-20",
      contactEmail: "contact@quantum.com",
      nextRenewal: "N/A",
      conversationsThisMonth: 234,
      accountManager: "Jennifer Lee",
      activeWorkflows: 3
    },
    {
      id: "4",
      name: "NexGen Technologies",
      plan: "Enterprise",
      seatsUsed: 28,
      seatsTotal: 100,
      seats: {
        admin: { used: 3, total: 10 },
        supervisor: { used: 10, total: 20 },
        agent: { used: 15, total: 70 }
      },
      status: "Suspended",
      usage: 65,
      createdAt: "2023-11-10",
      contactEmail: "admin@nexgen.com",
      nextRenewal: "2024-05-10",
      conversationsThisMonth: 0,
      accountManager: "David Kumar",
      activeWorkflows: 15
    }
  ],
  users: [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@techcorp.com",
      role: "Admin",
      accountId: "1",
      accountName: "TechCorp Solutions",
      status: "Active",
      lastLogin: "2024-01-27T10:30:00Z",
      ticketsHandled: 156,
      conversationsProcessed: 892
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike@techcorp.com",
      role: "Agent",
      accountId: "1",
      accountName: "TechCorp Solutions",
      status: "Active",
      lastLogin: "2024-01-27T09:15:00Z",
      ticketsHandled: 89,
      conversationsProcessed: 445
    },
    {
      id: "3",
      name: "Alex Rivera",
      email: "alex@innovatelabs.com",
      role: "Supervisor",
      accountId: "2",
      accountName: "InnovateLabs",
      status: "Active",
      lastLogin: "2024-01-26T16:45:00Z",
      ticketsHandled: 67,
      conversationsProcessed: 334
    },
    {
      id: "4",
      name: "Emma Wilson",
      email: "emma@quantum.com",
      role: "Admin",
      accountId: "3",
      accountName: "Quantum Dynamics",
      status: "Pending",
      lastLogin: "2024-01-25T14:20:00Z",
      ticketsHandled: 23,
      conversationsProcessed: 156
    },
    {
      id: "5",
      name: "David Kim",
      email: "david.kim@techcorp.com",
      role: "Agent",
      accountId: "1",
      accountName: "TechCorp Solutions",
      status: "Active",
      lastLogin: "2024-01-27T11:45:00Z",
      ticketsHandled: 142,
      conversationsProcessed: 678
    },
    {
      id: "6",
      name: "Lisa Anderson",
      email: "lisa.anderson@techcorp.com",
      role: "Supervisor",
      accountId: "1",
      accountName: "TechCorp Solutions",
      status: "Active",
      lastLogin: "2024-01-27T08:30:00Z",
      ticketsHandled: 98,
      conversationsProcessed: 512
    },
    {
      id: "7",
      name: "James Cooper",
      email: "james@innovatelabs.com",
      role: "Agent",
      accountId: "2",
      accountName: "InnovateLabs",
      status: "Active",
      lastLogin: "2024-01-26T17:20:00Z",
      ticketsHandled: 76,
      conversationsProcessed: 389
    },
    {
      id: "8",
      name: "Sofia Martinez",
      email: "sofia@innovatelabs.com",
      role: "Admin",
      accountId: "2",
      accountName: "InnovateLabs",
      status: "Active",
      lastLogin: "2024-01-27T09:00:00Z",
      ticketsHandled: 54,
      conversationsProcessed: 267
    }
  ]
}

export default function AccountManagement() {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null)
  const [accountToSuspend, setAccountToSuspend] = useState<Account | null>(null)
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null)
  const [isInviteUserOpen, setIsInviteUserOpen] = useState(false)
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false)
  
  // User states
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  const [userToSuspend, setUserToSuspend] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [userToImpersonate, setUserToImpersonate] = useState<User | null>(null)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all")

  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setTimeout(() => setSelectedAccount(null), 200)
  }

  const handleEditAccount = (account: Account) => {
    setAccountToEdit(account)
    setIsEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setTimeout(() => setAccountToEdit(null), 200)
  }

  const handleSuspendAccount = (account: Account) => {
    setAccountToSuspend(account)
  }

  const confirmSuspendAccount = () => {
    if (accountToSuspend) {
      const action = accountToSuspend.status === "Suspended" ? "activated" : "suspended"
      console.log(`${action} account:`, accountToSuspend.id)
      toast.success(`Account ${action}`, {
        description: `${accountToSuspend.name} has been ${action} successfully.`
      })
      setAccountToSuspend(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteAccount = (account: Account) => {
    setAccountToDelete(account)
  }

  const confirmDeleteAccount = () => {
    if (accountToDelete) {
      console.log("Deleting account:", accountToDelete.id)
      toast.success("Account deleted", {
        description: `${accountToDelete.name} has been permanently deleted.`
      })
      setAccountToDelete(null)
      setIsDialogOpen(false)
    }
  }

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
    setIsUserDialogOpen(true)
  }

  const handleCloseUserDialog = () => {
    setIsUserDialogOpen(false)
    setTimeout(() => setSelectedUser(null), 200)
  }

  const handleEditUser = (user: User) => {
    setUserToEdit(user)
    setIsEditUserDialogOpen(true)
  }

  const handleCloseEditUserDialog = () => {
    setIsEditUserDialogOpen(false)
    setTimeout(() => setUserToEdit(null), 200)
  }

  const handleSuspendUser = (user: User) => {
    setUserToSuspend(user)
  }

  const confirmSuspendUser = () => {
    if (userToSuspend) {
      const action = userToSuspend.status === "Suspended" ? "activated" : "suspended"
      console.log(`${action} user:`, userToSuspend.id)
      toast.success(`User ${action}`, {
        description: `${userToSuspend.name} has been ${action} successfully.`
      })
      setUserToSuspend(null)
      setIsUserDialogOpen(false)
    }
  }

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
  }

  const confirmDeleteUser = () => {
    if (userToDelete) {
      console.log("Deleting user:", userToDelete.id)
      toast.success("User deleted", {
        description: `${userToDelete.name} has been permanently deleted.`
      })
      setUserToDelete(null)
      setIsUserDialogOpen(false)
    }
  }

  const handleImpersonateUser = (user: User) => {
    setUserToImpersonate(user)
  }

  const confirmImpersonateUser = () => {
    if (userToImpersonate) {
      console.log("Impersonating user:", userToImpersonate.id)
      // TODO: API call to create impersonation session and log the action
      // This would typically:
      // 1. Create an audit log entry
      // 2. Create an impersonation session token
      // 3. Redirect to the user's dashboard/application
      
      toast.success("Logging in as user", {
        description: `Switching to ${userToImpersonate.name}'s account...`
      })
      
      // For now, just close the dialog
      // In a real implementation, you would redirect to the user's session
      setTimeout(() => {
        setUserToImpersonate(null)
        // router.push(`/impersonate/${userToImpersonate.id}`) // Example redirect
      }, 1000)
    }
  }

  const filteredAccounts = mockData.accounts.filter((account) => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || account.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const filteredUsers = mockData.users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.accountName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter

    return matchesSearch && matchesRole
  })

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
  }

  const clearUserFilters = () => {
    setSearchQuery("")
    setUserRoleFilter("all")
  }

  const activeFilterCount = (searchQuery ? 1 : 0) + (statusFilter !== "all" ? 1 : 0)
  const activeUserFilterCount = (searchQuery ? 1 : 0) + (userRoleFilter !== "all" ? 1 : 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case 'Trial':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Trial</Badge>
      case 'Suspended':
        return <Badge variant="destructive">Suspended</Badge>
      case 'Pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <RootLayout>
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-zinc-900">Accounts</h1>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-zinc-600 hover:text-zinc-900"
                onClick={() => setIsInviteUserOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
                Invite User
              </Button>
              <Button 
                size="sm" 
                className="bg-[#5261FF] hover:bg-[#4A56E8]"
                onClick={() => setIsCreateAccountOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="overflow-y-auto h-full">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Tabs defaultValue="accounts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-xs">
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="accounts" className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-lg font-semibold text-zinc-900">
                      All Accounts
                      <span className="ml-2 text-sm font-normal text-zinc-500">
                        ({filteredAccounts.length})
                      </span>
                    </CardTitle>
                    
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                        <Input 
                          placeholder="Search accounts…" 
                          className="pl-10 w-64 bg-white border-zinc-200 h-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[170px] h-9">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Trial">Trial</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>

                      {activeFilterCount > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearFilters}
                          className="text-zinc-600 h-9"
                        >
                          <X className="h-4 w-4" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account / Company</TableHead>
                        <TableHead>Available Seats</TableHead>
                        <TableHead>Workflows</TableHead>
                        <TableHead>Created On</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAccounts.length > 0 ? (
                        filteredAccounts.map((account) => (
                        <TableRow 
                          key={account.id} 
                          className="hover:bg-zinc-50 cursor-pointer"
                          onClick={() => handleAccountClick(account)}
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-[#5261FF] to-[#4A56E8] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{account.name.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-zinc-900">{account.name}</span>
                                  {getPlanBadge(account.plan)}
                                  {account.status !== "Active" && getStatusBadge(account.status)}
                                </div>
                                <div className="text-sm text-zinc-500">{account.contactEmail}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1" title="Admin seats available">
                                <Shield className="w-3.5 h-3.5 text-purple-600" />
                                <span className="font-medium text-zinc-700">
                                  {account.seats.admin.total - account.seats.admin.used}/{account.seats.admin.total}
                                </span>
                              </div>
                              <div className="flex items-center gap-1" title="Supervisor seats available">
                                <Eye className="w-3.5 h-3.5 text-blue-600" />
                                <span className="font-medium text-zinc-700">
                                  {account.seats.supervisor.total - account.seats.supervisor.used}/{account.seats.supervisor.total}
                                </span>
                              </div>
                              <div className="flex items-center gap-1" title="Agent seats available">
                                <Headphones className="w-3.5 h-3.5 text-green-600" />
                                <span className="font-medium text-zinc-700">
                                  {account.seats.agent.total - account.seats.agent.used}/{account.seats.agent.total}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-zinc-600">
                            {account.activeWorkflows}
                          </TableCell>
                          <TableCell className="text-sm text-zinc-600">
                            {formatDate(account.createdAt)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation()
                                  handleAccountClick(account)
                                }}>
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditAccount(account)
                                }}>
                                  <Edit className="w-4 h-4" />
                                  Edit Account
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {account.status === "Suspended" ? (
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    handleSuspendAccount(account)
                                  }}>
                                    <CheckCircle className="w-4 h-4" />
                                    Activate Account
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    handleSuspendAccount(account)
                                  }}>
                                    <UserX className="w-4 h-4" />
                                    Suspend Account
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteAccount(account)
                                  }}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Account
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center text-zinc-500">
                              <Search className="w-8 h-8 mb-2 text-zinc-300" />
                              <p className="text-sm font-medium">No accounts found</p>
                              <p className="text-xs mt-1">Try adjusting your search or filters</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-lg font-semibold text-zinc-900">
                      All Users
                      <span className="ml-2 text-sm font-normal text-zinc-500">
                        ({filteredUsers.length})
                      </span>
                    </CardTitle>
                    
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                        <Input 
                          placeholder="Search users…" 
                          className="pl-10 w-64 bg-white border-zinc-200 h-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      <Select value={userRoleFilter} onValueChange={setUserRoleFilter}>
                        <SelectTrigger className="w-[140px] h-9">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="Admin">
                            <span className="flex items-center">
                              Admin
                              <span className="ml-1.5 text-xs text-zinc-400">(Full)</span>
                            </span>
                          </SelectItem>
                          <SelectItem value="Supervisor">
                            <span className="flex items-center">
                              Supervisor
                              <span className="ml-1.5 text-xs text-zinc-400">(Config)</span>
                            </span>
                          </SelectItem>
                          <SelectItem value="Agent">
                            <span className="flex items-center">
                              Agent
                              <span className="ml-1.5 text-xs text-zinc-400">(Support)</span>
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      {activeUserFilterCount > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={clearUserFilters}
                          className="text-zinc-600 h-9"
                        >
                          <X className="h-4 w-4" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name & Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                        <TableRow 
                          key={user.id} 
                          className="hover:bg-zinc-50 cursor-pointer"
                          onClick={() => handleUserClick(user)}
                        >
                          <TableCell>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-zinc-900">{user.name}</span>
                                {user.status !== "Active" && getStatusBadge(user.status)}
                              </div>
                              <div className="text-sm text-zinc-500">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <RoleBadge role={user.role as UserRole} showIcon />
                          </TableCell>
                          <TableCell className="text-sm text-zinc-600">
                            {user.accountName}
                          </TableCell>
                          <TableCell className="text-sm text-zinc-600">
                            {formatDateTime(user.lastLogin)}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleUserClick(user)
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                  View User
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditUser(user)
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleImpersonateUser(user)
                                  }}
                                >
                                  <LogIn className="w-4 h-4" />
                                  Sign In As User
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSuspendUser(user)
                                  }}
                                >
                                  {user.status === "Suspended" ? (
                                    <>
                                      <CheckCircle className="w-4 h-4" />
                                      Activate User
                                    </>
                                  ) : (
                                    <>
                                      <UserX className="w-4 h-4" />
                                      Suspend User
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteUser(user)
                                  }}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center text-zinc-500">
                              <Search className="w-8 h-8 mb-2 text-zinc-300" />
                              <p className="text-sm font-medium">No users found</p>
                              <p className="text-xs mt-1">Try adjusting your search or filters</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AccountDetailsDialog
        account={selectedAccount}
        users={mockData.users}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onEdit={handleEditAccount}
        onSuspend={handleSuspendAccount}
        isStacked={isEditDialogOpen}
      />

      <EditAccountDialog
        account={accountToEdit}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onDelete={handleDeleteAccount}
      />

      <ConfirmDialog
        isOpen={!!accountToSuspend}
        onClose={() => setAccountToSuspend(null)}
        onConfirm={confirmSuspendAccount}
        title={accountToSuspend?.status === "Suspended" ? "Activate Account?" : "Suspend Account?"}
        description={
          accountToSuspend?.status === "Suspended"
            ? `Are you sure you want to activate ${accountToSuspend?.name}? Users will regain access to the platform.`
            : `Are you sure you want to suspend ${accountToSuspend?.name}? All users will lose access to the platform immediately.`
        }
        confirmText={accountToSuspend?.status === "Suspended" ? "Activate Account" : "Suspend Account"}
        type="warning"
      />

      <ConfirmDialog
        isOpen={!!accountToDelete}
        onClose={() => setAccountToDelete(null)}
        onConfirm={confirmDeleteAccount}
        title="Delete Account?"
        description={`Are you sure you want to permanently delete ${accountToDelete?.name}? This action cannot be undone. All users, data, and configurations will be permanently removed.`}
        confirmText="Delete Account"
        type="danger"
        requireTextConfirmation
        confirmationText={accountToDelete?.name || ""}
      />

      <InviteUserDialog
        isOpen={isInviteUserOpen}
        onClose={() => setIsInviteUserOpen(false)}
        accounts={mockData.accounts}
      />

      <CreateAccountDialog
        isOpen={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
      />

      <UserDetailsDialog
        user={selectedUser}
        isOpen={isUserDialogOpen}
        onClose={handleCloseUserDialog}
        onEdit={handleEditUser}
        onSuspend={handleSuspendUser}
        isStacked={isEditUserDialogOpen}
      />

      <EditUserDialog
        user={userToEdit}
        isOpen={isEditUserDialogOpen}
        onClose={handleCloseEditUserDialog}
        onDelete={handleDeleteUser}
      />

      <ConfirmDialog
        isOpen={!!userToSuspend}
        onClose={() => setUserToSuspend(null)}
        onConfirm={confirmSuspendUser}
        title={userToSuspend?.status === "Suspended" ? "Activate User?" : "Suspend User?"}
        description={
          userToSuspend?.status === "Suspended"
            ? `Are you sure you want to activate ${userToSuspend?.name}? They will regain access to the platform.`
            : `Are you sure you want to suspend ${userToSuspend?.name}? They will lose access to the platform immediately.`
        }
        confirmText={userToSuspend?.status === "Suspended" ? "Activate User" : "Suspend User"}
        type="warning"
      />

      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDeleteUser}
        title="Delete User?"
        description={`Are you sure you want to permanently delete ${userToDelete?.name}? This action cannot be undone. All user data and activity history will be permanently removed.`}
        confirmText="Delete User"
        type="danger"
        requireTextConfirmation
        confirmationText={userToDelete?.name || ""}
      />

      {/* Impersonate User Confirmation */}
      <ConfirmDialog
        isOpen={!!userToImpersonate}
        onClose={() => setUserToImpersonate(null)}
        onConfirm={confirmImpersonateUser}
        title="Sign In As User?"
        description={`You are about to sign in as ${userToImpersonate?.name} (${userToImpersonate?.email}). This action will be logged for security and audit purposes. You will have full access to their account and data. Do you want to proceed?`}
        confirmText="Sign In As User"
        type="info"
      />
    </RootLayout>
  )
}
