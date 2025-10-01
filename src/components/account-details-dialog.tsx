"use client"

import { useState, useMemo } from "react"
import { Account, User } from "@/lib/types/account"
import { UserRole } from "@/lib/types/roles"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoleBadge } from "@/components/role-badge"
import {
  Building2,
  Mail,
  Calendar,
  Users,
  TrendingUp,
  UserCircle,
  Workflow,
  Edit,
  UserX,
  AlertCircle,
  Search
} from "lucide-react"

interface AccountDetailsDialogProps {
  account: Account | null
  users: User[]
  isOpen: boolean
  onClose: () => void
  onEdit?: (account: Account) => void
  onSuspend?: (account: Account) => void
  isStacked?: boolean
}

export function AccountDetailsDialog({
  account,
  users,
  isOpen,
  onClose,
  onEdit,
  onSuspend,
  isStacked = false
}: AccountDetailsDialogProps) {
  const [teamSearchQuery, setTeamSearchQuery] = useState("")

  // Filter users belonging to this account
  const accountUsers = account ? users.filter(user => user.accountId === account.id) : []

  // Filter users based on search query
  const filteredTeamUsers = useMemo(() => {
    if (!teamSearchQuery.trim()) return accountUsers
    
    const query = teamSearchQuery.toLowerCase()
    return accountUsers.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  }, [accountUsers, teamSearchQuery])

  if (!account) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case 'Trial':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">Trial</Badge>
      case 'Suspended':
        return <Badge variant="destructive">Suspended</Badge>
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
    if (dateString === "N/A") return "N/A"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div 
          className={`transition-all duration-300 ${
            isStacked 
              ? 'scale-[0.96] opacity-80' 
              : 'scale-100 opacity-100'
          }`}
          style={{ pointerEvents: isStacked ? 'none' : 'auto' }}
        >
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#5261FF] to-[#4A56E8] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">{account.name.charAt(0)}</span>
              </div>
              <div>
                <DialogTitle className="text-2xl">{account.name}</DialogTitle>
                <div className="flex items-center space-x-2 mt-1">
                  {getPlanBadge(account.plan)}
                  {getStatusBadge(account.status)}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team ({accountUsers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6 min-h-[400px]">
            {/* Account Overview */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-3">Account Overview</h3>
              <div className="grid grid-cols-2 gap-4">
              {/* Contact Email */}
              <div className="flex items-start space-x-3 p-3 bg-zinc-50 rounded-lg">
                <Mail className="w-5 h-5 text-zinc-400 mt-0.5" />
                <div>
                  <div className="text-xs text-zinc-500">Contact Email</div>
                  <div className="text-sm font-medium text-zinc-900">{account.contactEmail}</div>
                </div>
              </div>

              {/* Account Manager */}
              <div className="flex items-start space-x-3 p-3 bg-zinc-50 rounded-lg">
                <UserCircle className="w-5 h-5 text-zinc-400 mt-0.5" />
                <div>
                  <div className="text-xs text-zinc-500">Account Manager</div>
                  <div className="text-sm font-medium text-zinc-900">{account.accountManager}</div>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-start space-x-3 p-3 bg-zinc-50 rounded-lg">
                <Calendar className="w-5 h-5 text-zinc-400 mt-0.5" />
                <div>
                  <div className="text-xs text-zinc-500">Created On</div>
                  <div className="text-sm font-medium text-zinc-900">{formatDate(account.createdAt)}</div>
                </div>
              </div>

              {/* Next Renewal */}
              <div className="flex items-start space-x-3 p-3 bg-zinc-50 rounded-lg">
                <Calendar className="w-5 h-5 text-zinc-400 mt-0.5" />
                <div>
                  <div className="text-xs text-zinc-500">Next Renewal</div>
                  <div className="text-sm font-medium text-zinc-900">{formatDate(account.nextRenewal)}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seat Allocation by Role */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Seat Allocation by Role</h3>
            <div className="grid grid-cols-3 gap-3">
              {/* Admin Seats */}
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="mb-2">
                  <RoleBadge role="Admin" showIcon size="sm" />
                </div>
                <div className="text-lg font-bold text-zinc-900 mb-1.5">
                  {account.seats.admin.used} / {account.seats.admin.total}
                </div>
                <Progress 
                  value={(account.seats.admin.used / account.seats.admin.total) * 100} 
                  className="h-1.5 [&>div]:bg-purple-500" 
                />
              </div>

              {/* Supervisor Seats */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="mb-2">
                  <RoleBadge role="Supervisor" showIcon size="sm" />
                </div>
                <div className="text-lg font-bold text-zinc-900 mb-1.5">
                  {account.seats.supervisor.used} / {account.seats.supervisor.total}
                </div>
                <Progress 
                  value={(account.seats.supervisor.used / account.seats.supervisor.total) * 100} 
                  className="h-1.5 [&>div]:bg-blue-500" 
                />
              </div>

              {/* Agent Seats */}
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="mb-2">
                  <RoleBadge role="Agent" showIcon size="sm" />
                </div>
                <div className="text-lg font-bold text-zinc-900 mb-1.5">
                  {account.seats.agent.used} / {account.seats.agent.total}
                </div>
                <Progress 
                  value={(account.seats.agent.used / account.seats.agent.total) * 100} 
                  className="h-1.5 [&>div]:bg-green-500" 
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Usage & Performance */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Usage & Performance</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Active Workflows */}
              <div className="p-3 bg-zinc-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <Workflow className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs text-zinc-600">Active Workflows</span>
                </div>
                <span className="text-xl font-bold text-zinc-900">
                  {account.activeWorkflows}
                </span>
              </div>

              {/* Conversations */}
              <div className="p-3 bg-zinc-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs text-zinc-600">Conversations</span>
                </div>
                <span className="text-xl font-bold text-zinc-900">
                  {account.conversationsThisMonth.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

            {/* Account Actions */}
            {account.status === "Suspended" && (
              <>
                <Separator />
                <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-red-900">Account Suspended</div>
                    <div className="text-xs text-red-700 mt-1">
                      This account has been suspended. Contact support for more information.
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="team" className="space-y-4 mt-6 min-h-[400px]">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search team members by name, email, or role..."
                value={teamSearchQuery}
                onChange={(e) => setTeamSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Users in This Account */}
            {accountUsers.length > 0 ? (
              filteredTeamUsers.length > 0 ? (
                <div className="space-y-2">
                  {filteredTeamUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#5261FF] to-[#4A56E8] rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-xs">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-zinc-900">{user.name}</div>
                          <div className="text-xs text-zinc-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RoleBadge role={user.role as UserRole} showIcon />
                        {user.status !== "Active" && (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs">
                            {user.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-zinc-300" />
                  <p className="text-sm font-medium">No users found</p>
                  <p className="text-xs mt-1">No team members match your search criteria.</p>
                </div>
              )
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-zinc-300" />
                <p className="text-sm font-medium">No users found</p>
                <p className="text-xs mt-1">This account doesn't have any users yet.</p>
              </div>
            )}
          </TabsContent>

        </Tabs>

        <Separator className="mt-6" />

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit?.(account)}
            >
              <Edit className="w-4 h-4" />
              Edit Account
            </Button>
            {account.status !== "Suspended" && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                onClick={() => onSuspend?.(account)}
              >
                <UserX className="w-4 h-4" />
                Suspend Account
              </Button>
            )}
          </div>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

