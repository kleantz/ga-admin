"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Trash2, UserX } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText: string
  type?: "danger" | "warning"
  isLoading?: boolean
  requireTextConfirmation?: boolean
  confirmationText?: string
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  type = "danger",
  isLoading = false,
  requireTextConfirmation = false,
  confirmationText = ""
}: ConfirmDialogProps) {
  const [inputValue, setInputValue] = useState("")
  const isDanger = type === "danger"
  
  // Reset input when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setInputValue("")
    }
  }, [isOpen])

  const isConfirmDisabled = requireTextConfirmation 
    ? inputValue !== confirmationText || isLoading
    : isLoading

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start space-x-3">
            {isDanger ? (
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <UserX className="w-5 h-5 text-orange-600" />
              </div>
            )}
            <div className="flex-1">
              <DialogTitle className="text-lg">{title}</DialogTitle>
              <p className="text-sm text-zinc-600 mt-2">{description}</p>
            </div>
          </div>
        </DialogHeader>

        {requireTextConfirmation && (
          <div className="space-y-3 mt-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-800">
                Please type <span className="font-mono font-semibold bg-red-100 px-1.5 py-0.5 rounded">{confirmationText}</span> to confirm
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmation" className="text-sm">
                Confirmation
              </Label>
              <Input
                id="confirmation"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Type "${confirmationText}" to confirm`}
                className="font-mono"
                autoComplete="off"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className={isDanger 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-orange-600 hover:bg-orange-700 text-white"
            }
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

