import { api } from "@/api/api"
import { type DonVi } from "@/types/donvi"

export const getDonViList = async (): Promise<DonVi[]> => {
  const res = await api.get("/donvi")
  return res.data
}