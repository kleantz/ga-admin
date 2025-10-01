"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Account } from "@/lib/types/account"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon, Trash2, Shield, Eye, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const accountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  contactEmail: z.string().email("Invalid email address"),
  plan: z.enum(["Enterprise", "Pro", "Free"]),
  adminSeats: z.number().min(1, "Must have at least 1 admin seat"),
  supervisorSeats: z.number().min(0, "Cannot be negative"),
  agentSeats: z.number().min(0, "Cannot be negative"),
})

type AccountFormData = z.infer<typeof accountSchema>

interface EditAccountDialogProps {
  account: Account | null
  isOpen: boolean
  onClose: () => void
  onDelete?: (account: Account) => void
}

export function EditAccountDialog({
  account,
  isOpen,
  onClose,
  onDelete
}: EditAccountDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selectedPlan, setSelectedPlan] = useState<"Enterprise" | "Pro" | "Free">(
    account?.plan || "Free"
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: account ? {
      name: account.name,
      contactEmail: account.contactEmail,
      plan: account.plan,
      adminSeats: account.seats.admin.total,
      supervisorSeats: account.seats.supervisor.total,
      agentSeats: account.seats.agent.total,
    } : undefined
  })

  // Reset form when account changes
  useEffect(() => {
    if (account) {
      setSelectedPlan(account.plan)
      reset({
        name: account.name,
        contactEmail: account.contactEmail,
        plan: account.plan,
        adminSeats: account.seats.admin.total,
        supervisorSeats: account.seats.supervisor.total,
        agentSeats: account.seats.agent.total,
      })
    }
  }, [account, reset])

  const onSubmit = async (data: AccountFormData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const updatedAccount = {
      ...account,
      name: data.name,
      contactEmail: data.contactEmail,
      plan: selectedPlan,
      seats: {
        admin: { ...account!.seats.admin, total: data.adminSeats },
        supervisor: { ...account!.seats.supervisor, total: data.supervisorSeats },
        agent: { ...account!.seats.agent, total: data.agentSeats }
      }
    }
    
    console.log("Updated account:", updatedAccount)
    
    toast.success("Account updated", {
      description: `${data.name} has been updated successfully.`
    })
    
    setIsSubmitting(false)
    onClose()
  }

  if (!account) return null

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
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[60] grid w-full max-w-xl max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-2xl duration-300"
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Account</DialogTitle>
          </DialogHeader>
          
          {/* Close button */}
          <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Account Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., TechCorp Solutions"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              {...register("contactEmail")}
              placeholder="e.g., admin@company.com"
            />
            {errors.contactEmail && (
              <p className="text-sm text-red-600">{errors.contactEmail.message}</p>
            )}
          </div>

          {/* Plan Selection */}
          <div className="space-y-2">
            <Label htmlFor="plan">Plan</Label>
            <Select
              value={selectedPlan}
              onValueChange={(value) => {
                const planValue = value as "Enterprise" | "Pro" | "Free"
                setSelectedPlan(planValue)
                setValue("plan", planValue)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            {errors.plan && (
              <p className="text-sm text-red-600">{errors.plan.message}</p>
            )}
          </div>

          <Separator />

          {/* Seat Allocation by Role */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Seat Allocation by Role</Label>
              <p className="text-xs text-zinc-500 mt-1">
                Allocate seats for each role level: Admin (full access), Supervisor (config & oversight), Agent (human-in-the-loop support)
              </p>
            </div>

            {/* Admin Seats */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <Label htmlFor="adminSeats" className="text-purple-900">Admin Seats</Label>
              </div>
              <Input
                id="adminSeats"
                type="number"
                {...register("adminSeats", { valueAsNumber: true })}
                placeholder="e.g., 5"
                className="border-purple-200 focus:border-purple-400"
              />
              {errors.adminSeats && (
                <p className="text-sm text-red-600">{errors.adminSeats.message}</p>
              )}
              <p className="text-xs text-purple-700">
                Currently using: {account.seats.admin.used} / {account.seats.admin.total} seats
              </p>
            </div>

            {/* Supervisor Seats */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <Label htmlFor="supervisorSeats" className="text-blue-900">Supervisor Seats</Label>
              </div>
              <Input
                id="supervisorSeats"
                type="number"
                {...register("supervisorSeats", { valueAsNumber: true })}
                placeholder="e.g., 10"
                className="border-blue-200 focus:border-blue-400"
              />
              {errors.supervisorSeats && (
                <p className="text-sm text-red-600">{errors.supervisorSeats.message}</p>
              )}
              <p className="text-xs text-blue-700">
                Currently using: {account.seats.supervisor.used} / {account.seats.supervisor.total} seats
              </p>
            </div>

            {/* Agent Seats */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Headphones className="w-4 h-4 text-green-600" />
                <Label htmlFor="agentSeats" className="text-green-900">Agent Seats</Label>
              </div>
              <Input
                id="agentSeats"
                type="number"
                {...register("agentSeats", { valueAsNumber: true })}
                placeholder="e.g., 35"
                className="border-green-200 focus:border-green-400"
              />
              {errors.agentSeats && (
                <p className="text-sm text-red-600">{errors.agentSeats.message}</p>
              )}
              <p className="text-xs text-green-700">
                Currently using: {account.seats.agent.used} / {account.seats.agent.total} seats
              </p>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (account) {
                  onDelete?.(account)
                  onClose()
                }
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={isSubmitting}
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
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

