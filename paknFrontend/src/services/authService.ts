export const getToken = () => {
  return localStorage.getItem("token")
}

export const getPermissions = (): string[] => {
  const data = localStorage.getItem("permissions")
  return data ? JSON.parse(data) : []
}

export const hasPermission = (permission: string) => {
  const permissions = getPermissions()
  return permissions.includes(permission)
}