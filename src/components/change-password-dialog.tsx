"use client"

import { useState } from "react"
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
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react"

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type PasswordFormData = z.infer<typeof passwordSchema>

interface ChangePasswordDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ChangePasswordDialog({ isOpen, onClose }: ChangePasswordDialogProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const newPassword = watch("newPassword")

  // Password strength indicators
  const passwordStrength = {
    hasMinLength: newPassword?.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword || ""),
    hasLowerCase: /[a-z]/.test(newPassword || ""),
    hasNumber: /[0-9]/.test(newPassword || ""),
    hasSpecialChar: /[^A-Za-z0-9]/.test(newPassword || ""),
  }

  const onSubmit = async (data: PasswordFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      console.log("Password change data:", {
        currentPassword: "***",
        newPassword: "***",
      })
      
      toast.success("Password updated", {
        description: "Your password has been changed successfully."
      })
      
      setIsSuccess(true)
      
      // Reset form and close after showing success message
      setTimeout(() => {
        reset()
        setIsSuccess(false)
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Failed to change password:", error)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      reset()
      setIsSuccess(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Update your password to keep your account secure
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">
              Password Changed Successfully
            </h3>
            <p className="text-sm text-zinc-500">
              Your password has been updated
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  {...register("currentPassword")}
                  className={errors.currentPassword ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword")}
                  className={errors.newPassword ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword.message}</p>
              )}

              {/* Password Strength Indicators */}
              {newPassword && (
                <div className="space-y-2 mt-3 p-3 bg-zinc-50 rounded-md">
                  <p className="text-xs font-medium text-zinc-700 mb-2">Password Requirements:</p>
                  <div className="space-y-1">
                    <PasswordRequirement
                      met={passwordStrength.hasMinLength}
                      text="At least 8 characters"
                    />
                    <PasswordRequirement
                      met={passwordStrength.hasUpperCase}
                      text="One uppercase letter"
                    />
                    <PasswordRequirement
                      met={passwordStrength.hasLowerCase}
                      text="One lowercase letter"
                    />
                    <PasswordRequirement
                      met={passwordStrength.hasNumber}
                      text="One number"
                    />
                    <PasswordRequirement
                      met={passwordStrength.hasSpecialChar}
                      text="One special character"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-900">
                For security reasons, you'll be logged out from all devices after changing your password.
              </p>
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
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
        met ? "bg-green-100" : "bg-zinc-200"
      }`}>
        {met && <Check className="w-3 h-3 text-green-600" />}
      </div>
      <span className={`text-xs ${met ? "text-green-700" : "text-zinc-600"}`}>
        {text}
      </span>
    </div>
  )
}

