export type TeamMemberStatus = "active" | "inactive"

export interface TeamMember {
  id: number
  name: string
  role: string
  department: string
  email: string
  phone: string
  avatar: string
  status: TeamMemberStatus
  joinDate?: string
  bio?: string
  lastActive?: string
  deactivationReason?: string
  deactivatedAt?: string
  permissions?: TeamMemberPermissions
}

export interface TeamMemberPermissions {
  admin: boolean
  dashboard: {
    view: boolean
    edit: boolean
  }
  team: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
  }
  reports: {
    view: boolean
    create: boolean
    export: boolean
  }
  settings: {
    view: boolean
    edit: boolean
  }
}

