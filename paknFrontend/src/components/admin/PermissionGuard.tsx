import { Navigate } from "react-router-dom"
import { hasPermission } from "@/services/authService"

interface Props {
  permission: string
  children: React.ReactNode
}

export default function PermissionGuard({ permission, children }: Props) {

  if (!hasPermission(permission)) {
    return <Navigate to="/404" replace />
  }

  return <>{children}</>
}