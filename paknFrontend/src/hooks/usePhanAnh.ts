import { useEffect, useState } from "react"
import { type PhanAnh } from "@/types/phanAnh"
import { getPhanAnhCuaToi, getPhanAnhDonVi } from "@/api/user/phanAnhService"

export const usePhanAnhCuaToi = () => {

  const [data, setData] = useState<PhanAnh[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPhanAnhCuaToi()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading }
}

export const usePhanAnhDonVi = () => {

  const [data, setData] = useState<PhanAnh[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPhanAnhDonVi()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  return { data, loading }
}