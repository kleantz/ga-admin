// Role definitions and hierarchy for the platform

export type UserRole = "Admin" | "Supervisor" | "Agent"

export interface RoleDefinition {
  name: UserRole
  label: string
  description: string
  permissions: string[]
  color: string
  level: number // 1 = highest, 3 = lowest
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  Admin: {
    name: "Admin",
    label: "Admin",
    description: "Full access to the platform including all configurations, user management, and settings",
    permissions: [
      "Manage all users",
      "Configure workflows",
      "Access all conversations",
      "Manage billing & plans",
      "Full administrative access"
    ],
    color: "purple",
    level: 1
  },
  Supervisor: {
    name: "Supervisor",
    label: "Supervisor",
    description: "Access to configurations and administrative features with oversight of agents and conversations",
    permissions: [
      "Manage agents",
      "View all conversations",
      "Configure some settings",
      "Generate reports",
      "Monitor performance"
    ],
    color: "blue",
    level: 2
  },
  Agent: {
    name: "Agent",
    label: "Agent",
    description: "Serve as 'human in the loop' to handle conversations when AI assistance is needed",
    permissions: [
      "Handle live conversations",
      "Take over from AI",
      "View assigned conversations",
      "Update conversation status"
    ],
    color: "green",
    level: 3
  }
}

export const getRoleDefinition = (role: UserRole): RoleDefinition => {
  return ROLE_DEFINITIONS[role]
}

export const getRoleColor = (role: UserRole): string => {
  const definition = getRoleDefinition(role)
  return definition.color
}

export const getRolesByHierarchy = (): RoleDefinition[] => {
  return Object.values(ROLE_DEFINITIONS).sort((a, b) => a.level - b.level)
}

