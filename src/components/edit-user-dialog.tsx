"use client"

import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X as XIcon } from "lucide-react"
import {
  Dialog,
  DialogPortal,
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
import { User } from "@/lib/types/account"
import { useState } from "react"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

const editUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["Admin", "Supervisor", "Agent"], {
    required_error: "Please select a role",
  }),
})

type EditUserFormData = z.infer<typeof editUserSchema>

interface EditUserDialogProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onDelete?: (user: User) => void
}

export function EditUserDialog({
  user,
  isOpen,
  onClose,
  onDelete
}: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: user ? {
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ').slice(1).join(' '),
      email: user.email,
      role: user.role as "Admin" | "Supervisor" | "Agent",
    } : undefined,
  })

  // Set selectedRole when user changes
  useState(() => {
    if (user) {
      setSelectedRole(user.role)
    }
  })

  const onSubmit = async (data: EditUserFormData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    console.log("Edit user data:", {
      ...data,
      name: `${data.firstName} ${data.lastName}`,
    })
    
    toast.success("User updated", {
      description: `${data.firstName} ${data.lastName} has been updated successfully.`
    })
    
    setIsSubmitting(false)
    onClose()
  }

  if (!user) return null

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-700"
      case "Supervisor":
        return "bg-blue-100 text-blue-700"
      case "Agent":
        return "bg-green-100 text-green-700"
      default:
        return "bg-zinc-100 text-zinc-700"
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "Admin":
        return "Full access to all platform features and settings"
      case "Supervisor":
        return "Access to configurations and team management"
      case "Agent":
        return "Handle customer conversations and human-in-the-loop tasks"
      default:
        return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        {/* Stacked overlay with higher z-index and darker backdrop */}
        <DialogPrimitive.Overlay
          className={cn(
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px] transition-all duration-300"
          )}
        />
        {/* Stacked content with higher z-index and enhanced shadow */}
        <DialogPrimitive.Content
          className={cn(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[60] grid w-full max-w-lg max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-2xl duration-300"
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-xl">Edit User</DialogTitle>
          </DialogHeader>
          
          {/* Close button */}
          <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
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
                  setValue("role", value as "Admin" | "Supervisor" | "Agent", {
                    shouldValidate: true,
                  })
                }}
              >
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">
                    <div className="flex items-center gap-2">
                      <span>🛡️</span>
                      <span>Admin</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Supervisor">
                    <div className="flex items-center gap-2">
                      <span>👁️</span>
                      <span>Supervisor</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Agent">
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
                    {selectedRole}
                  </div>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    {getRoleDescription(selectedRole)}
                  </p>
                </div>
              )}
            </div>

            {/* Account (Read-only) */}
            <div className="space-y-2">
              <Label>Account</Label>
              <Input
                value={user.accountName}
                disabled
                className="bg-zinc-50"
              />
              <p className="text-xs text-zinc-500">User account cannot be changed</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (user) {
                    onDelete?.(user)
                    onClose()
                  }
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete User
              </Button>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#5261FF] hover:bg-[#4A56E8]"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

