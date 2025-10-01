import { Badge } from "@/components/ui/badge"
import { UserRole, getRoleDefinition } from "@/lib/types/roles"
import { Shield, Eye, Headphones } from "lucide-react"

interface RoleBadgeProps {
  role: UserRole
  showIcon?: boolean
  size?: "sm" | "md"
}

export function RoleBadge({ role, showIcon = false, size = "md" }: RoleBadgeProps) {
  const definition = getRoleDefinition(role)
  
  const getIcon = () => {
    switch (role) {
      case "Admin":
        return <Shield className="w-3 h-3" />
      case "Supervisor":
        return <Eye className="w-3 h-3" />
      case "Agent":
        return <Headphones className="w-3 h-3" />
    }
  }

  const getColorClasses = () => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200"
      case "Supervisor":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
      case "Agent":
        return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
    }
  }

  const sizeClass = size === "sm" ? "text-xs" : "text-xs"

  return (
    <Badge 
      variant="outline" 
      className={`${getColorClasses()} ${sizeClass} font-medium`}
      title={definition.description}
    >
      {showIcon && (
        <span className="mr-1">
          {getIcon()}
        </span>
      )}
      {definition.label}
    </Badge>
  )
}

interface RoleDescriptionProps {
  role: UserRole
}

export function RoleDescription({ role }: RoleDescriptionProps) {
  const definition = getRoleDefinition(role)
  
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <RoleBadge role={role} showIcon />
        <span className="text-sm font-medium text-zinc-900">{definition.label}</span>
      </div>
      <p className="text-xs text-zinc-600">{definition.description}</p>
      <div className="space-y-1">
        <p className="text-xs font-medium text-zinc-700">Permissions:</p>
        <ul className="text-xs text-zinc-600 space-y-0.5 pl-4">
          {definition.permissions.map((permission, index) => (
            <li key={index} className="list-disc">{permission}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

