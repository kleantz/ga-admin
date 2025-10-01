"use client"

import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Check, Search } from "lucide-react"
import { useState, useMemo } from "react"
import { Account } from "@/lib/types/account"

const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.enum(["admin", "supervisor", "agent"], {
    required_error: "Please select a role",
  }),
  accountId: z.string().min(1, "Please select an account"),
  message: z.string().optional(),
})

type InviteUserFormData = z.infer<typeof inviteUserSchema>

interface InviteUserDialogProps {
  isOpen: boolean
  onClose: () => void
  accounts: Account[]
  preSelectedAccountId?: string
}

export function InviteUserDialog({
  isOpen,
  onClose,
  accounts,
  preSelectedAccountId,
}: InviteUserDialogProps) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [selectedAccountId, setSelectedAccountId] = useState<string>(preSelectedAccountId || "")
  const [accountSearchQuery, setAccountSearchQuery] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      accountId: preSelectedAccountId || "",
    },
  })

  // Filter accounts based on search query
  const filteredAccounts = useMemo(() => {
    if (!accountSearchQuery.trim()) return accounts
    
    const query = accountSearchQuery.toLowerCase()
    return accounts.filter(
      (account) =>
        account.name.toLowerCase().includes(query) ||
        account.contactEmail.toLowerCase().includes(query) ||
        account.plan.toLowerCase().includes(query)
    )
  }, [accounts, accountSearchQuery])

  const onSubmit = async (data: InviteUserFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Invite user data:", data)

      toast.success("Invitation sent", {
        description: `An invitation has been sent to ${data.email}.`
      })

      setIsSuccess(true)

      // Reset form and close after showing success message
      setTimeout(() => {
        reset()
        setSelectedRole("")
        setSelectedAccountId(preSelectedAccountId || "")
        setAccountSearchQuery("")
        setIsSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Failed to invite user:", error)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      reset()
      setSelectedRole("")
      setSelectedAccountId(preSelectedAccountId || "")
      setAccountSearchQuery("")
      setIsSuccess(false)
      onClose()
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700"
      case "supervisor":
        return "bg-blue-100 text-blue-700"
      case "agent":
        return "bg-green-100 text-green-700"
      default:
        return "bg-zinc-100 text-zinc-700"
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Full access to all platform features and settings"
      case "supervisor":
        return "Access to configurations and team management"
      case "agent":
        return "Handle customer conversations and human-in-the-loop tasks"
      default:
        return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Send an invitation to join an account on GenAssist
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">
              Invitation Sent!
            </h3>
            <p className="text-sm text-zinc-500">
              An email invitation has been sent to the user
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Account Selection */}
            <div className="space-y-2">
              <Label htmlFor="accountId">
                Account <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedAccountId}
                onValueChange={(value) => {
                  setSelectedAccountId(value)
                  setValue("accountId", value, { shouldValidate: true })
                }}
                onOpenChange={(open) => {
                  if (!open) setAccountSearchQuery("")
                }}
              >
                <SelectTrigger className={errors.accountId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select account">
                    {selectedAccountId && accounts.find(a => a.id === selectedAccountId)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {/* Search Input */}
                  <div className="flex items-center border-b px-3 pb-2">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                      className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Search accounts..."
                      value={accountSearchQuery}
                      onChange={(e) => setAccountSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  {/* Account List */}
                  <div className="max-h-[300px] overflow-y-auto">
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          <div className="flex items-center gap-2">
                            <span>{account.name}</span>
                            <span className="text-xs text-zinc-500">({account.plan})</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-6 text-center text-sm text-zinc-500">
                        No accounts found
                      </div>
                    )}
                  </div>
                </SelectContent>
              </Select>
              {errors.accountId && (
                <p className="text-sm text-red-500">{errors.accountId.message}</p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  className={errors.firstName ? "border-red-500" : ""}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  className={errors.lastName ? "border-red-500" : ""}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
                placeholder="john.doe@company.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setSelectedRole(value)
                  setValue("role", value as "admin" | "supervisor" | "agent", {
                    shouldValidate: true,
                  })
                }}
              >
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <span>🛡️</span>
                      <span>Admin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="supervisor">
                    <div className="flex items-center gap-2">
                      <span>👁️</span>
                      <span>Supervisor</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="agent">
                    <div className="flex items-center gap-2">
                      <span>🎧</span>
                      <span>Agent</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
              {selectedRole && (
                <div className="flex items-start gap-2 p-3 bg-zinc-50 rounded-md">
                  <div className={`text-xs px-2 py-1 rounded ${getRoleBadgeColor(selectedRole)}`}>
                    {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                  </div>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    {getRoleDescription(selectedRole)}
                  </p>
                </div>
              )}
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Custom Message (Optional)</Label>
              <Textarea
                id="message"
                {...register("message")}
                placeholder="Add a personal message to the invitation email..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#5261FF] hover:bg-[#4A56E8]"
              >
                {isSubmitting ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

