import { api } from "@/api/api"
import { type LinhVuc } from "@/types/linhvuc"

export const getLinhVucList = async (): Promise<LinhVuc[]> => {
  const res = await api.get("/linhvuc")
  return res.data
}