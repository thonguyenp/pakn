import { api } from "../api"

export const getMeta = async (include: string) => {

  const res = await api.get(`/meta?include=${include}`)

  return res.data

}