"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RoleBadge, RoleDescription } from "@/components/role-badge"
import { User } from "@/lib/types/account"
import { UserRole } from "@/lib/types/roles"
import { 
  Mail, 
  Calendar, 
  Clock, 
  Building2, 
  Activity,
  MessageSquare,
  Edit,
  UserX,
  CheckCircle
} from "lucide-react"

interface UserDetailsDialogProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (user: User) => void
  onSuspend?: (user: User) => void
  isStacked?: boolean
}

export function UserDetailsDialog({
  user,
  isOpen,
  onClose,
  onEdit,
  onSuspend,
  isStacked = false
}: UserDetailsDialogProps) {
  if (!user) return null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case 'Pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case 'Suspended':
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div 
          className={`transition-all duration-300 ${
            isStacked 
              ? 'scale-[0.96] opacity-80' 
              : 'scale-100 opacity-100'
          }`}
          style={{ pointerEvents: isStacked ? 'none' : 'auto' }}
        >
        <DialogHeader>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <DialogTitle className="text-xl">{user.name}</DialogTitle>
              <RoleBadge role={user.role as UserRole} showIcon />
              {user.status !== "Active" && getStatusBadge(user.status)}
            </div>
            <DialogDescription className="flex items-center gap-2 mt-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Building2 className="w-4 h-4" />
                Account
              </div>
              <p className="text-sm font-medium text-zinc-900">{user.accountName}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Clock className="w-4 h-4" />
                Last Login
              </div>
              <p className="text-sm font-medium text-zinc-900">
                {formatDateTime(user.lastLogin)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Activity Stats */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  Conversations Processed
                </div>
                <p className="text-2xl font-semibold text-zinc-900">
                  {user.conversationsProcessed?.toLocaleString() || 0}
                </p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
                  <CheckCircle className="w-4 h-4" />
                  Tickets Handled
                </div>
                <p className="text-2xl font-semibold text-zinc-900">
                  {user.ticketsHandled?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Role Information */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Role & Permissions</h3>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <RoleDescription role={user.role as UserRole} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-6 mt-6 border-t">
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit(user)}
              >
                <Edit className="w-4 h-4" />
                Edit User
              </Button>
            )}
            {onSuspend && (
              <Button
                variant="outline"
                onClick={() => onSuspend(user)}
                className={
                  user.status === "Suspended"
                    ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                    : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                }
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

