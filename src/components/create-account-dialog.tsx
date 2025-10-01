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
import { Check, Building2 } from "lucide-react"
import { useState } from "react"

const createAccountSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  contactEmail: z.string().email("Invalid email address"),
  plan: z.enum(["Enterprise", "Pro", "Free"], {
    required_error: "Please select a plan",
  }),
  adminSeats: z.number().min(1, "Must have at least 1 admin seat"),
  supervisorSeats: z.number().min(0, "Must be 0 or greater"),
  agentSeats: z.number().min(0, "Must be 0 or greater"),
  accountManager: z.string().optional(),
})

type CreateAccountFormData = z.infer<typeof createAccountSchema>

interface CreateAccountDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateAccountDialog({ isOpen, onClose }: CreateAccountDialogProps) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      adminSeats: 1,
      supervisorSeats: 0,
      agentSeats: 0,
    },
  })

  const adminSeats = watch("adminSeats")
  const supervisorSeats = watch("supervisorSeats")
  const agentSeats = watch("agentSeats")
  const totalSeats = (adminSeats || 0) + (supervisorSeats || 0) + (agentSeats || 0)

  const onSubmit = async (data: CreateAccountFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Create account data:", data)

      toast.success("Account created", {
        description: `${data.name} has been created successfully.`
      })

      setIsSuccess(true)

      // Reset form and close after showing success message
      setTimeout(() => {
        reset({
          adminSeats: 1,
          supervisorSeats: 0,
          agentSeats: 0,
        })
        setSelectedPlan("")
        setIsSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Failed to create account:", error)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      reset({
        adminSeats: 1,
        supervisorSeats: 0,
        agentSeats: 0,
      })
      setSelectedPlan("")
      setIsSuccess(false)
      onClose()
    }
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "Pro":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "Free":
        return "bg-zinc-100 text-zinc-700 border-zinc-200"
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200"
    }
  }

  const getPlanDescription = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return "Unlimited seats, advanced features, dedicated support"
      case "Pro":
        return "Up to 50 seats, premium features, priority support"
      case "Free":
        return "Up to 3 seats, basic features, community support"
      default:
        return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
          <DialogDescription>
            Set up a new company account on GenAssist
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">
              Account Created Successfully!
            </h3>
            <p className="text-sm text-zinc-500">
              The new account has been created and is ready to use
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Account Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                  placeholder="Acme Corporation"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">
                  Contact Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register("contactEmail")}
                  className={errors.contactEmail ? "border-red-500" : ""}
                  placeholder="admin@acme.com"
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountManager">Account Manager (Optional)</Label>
                <Input
                  id="accountManager"
                  {...register("accountManager")}
                  placeholder="Jane Smith"
                />
              </div>
            </div>

            {/* Plan Selection */}
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <h3 className="text-sm font-semibold text-zinc-900">Plan Selection</h3>

              <div className="space-y-2">
                <Label htmlFor="plan">
                  Plan <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedPlan}
                  onValueChange={(value) => {
                    setSelectedPlan(value)
                    setValue("plan", value as "Enterprise" | "Pro" | "Free", {
                      shouldValidate: true,
                    })
                  }}
                >
                  <SelectTrigger className={errors.plan ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Enterprise">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-600">★</span>
                        <span>Enterprise</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Pro">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">●</span>
                        <span>Pro</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Free">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400">○</span>
                        <span>Free</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.plan && (
                  <p className="text-sm text-red-500">{errors.plan.message}</p>
                )}
                {selectedPlan && (
                  <div className="flex items-start gap-2 p-3 bg-zinc-50 rounded-md">
                    <div className={`text-xs px-2 py-1 rounded border ${getPlanBadgeColor(selectedPlan)}`}>
                      {selectedPlan}
                    </div>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {getPlanDescription(selectedPlan)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Seat Allocation */}
            <div className="space-y-4 pt-4 border-t border-zinc-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-900">Seat Allocation</h3>
                <div className="text-xs text-zinc-500">
                  Total: <span className="font-semibold text-zinc-900">{totalSeats}</span> seats
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Admin Seats */}
                <div className="space-y-2">
                  <Label htmlFor="adminSeats">
                    <div className="flex items-center gap-1.5">
                      <span>🛡️</span>
                      <span>Admin</span>
                      <span className="text-red-500">*</span>
                    </div>
                  </Label>
                  <Input
                    id="adminSeats"
                    type="number"
                    min="1"
                    {...register("adminSeats", { valueAsNumber: true })}
                    className={errors.adminSeats ? "border-red-500" : ""}
                  />
                  {errors.adminSeats && (
                    <p className="text-xs text-red-500">{errors.adminSeats.message}</p>
                  )}
                  <p className="text-xs text-zinc-500">Full access</p>
                </div>

                {/* Supervisor Seats */}
                <div className="space-y-2">
                  <Label htmlFor="supervisorSeats">
                    <div className="flex items-center gap-1.5">
                      <span>👁️</span>
                      <span>Supervisor</span>
                    </div>
                  </Label>
                  <Input
                    id="supervisorSeats"
                    type="number"
                    min="0"
                    {...register("supervisorSeats", { valueAsNumber: true })}
                    className={errors.supervisorSeats ? "border-red-500" : ""}
                  />
                  {errors.supervisorSeats && (
                    <p className="text-xs text-red-500">{errors.supervisorSeats.message}</p>
                  )}
                  <p className="text-xs text-zinc-500">Team management</p>
                </div>

                {/* Agent Seats */}
                <div className="space-y-2">
                  <Label htmlFor="agentSeats">
                    <div className="flex items-center gap-1.5">
                      <span>🎧</span>
                      <span>Agent</span>
                    </div>
                  </Label>
                  <Input
                    id="agentSeats"
                    type="number"
                    min="0"
                    {...register("agentSeats", { valueAsNumber: true })}
                    className={errors.agentSeats ? "border-red-500" : ""}
                  />
                  {errors.agentSeats && (
                    <p className="text-xs text-red-500">{errors.agentSeats.message}</p>
                  )}
                  <p className="text-xs text-zinc-500">Conversations</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
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
                {isSubmitting ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

