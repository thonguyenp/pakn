import { useEffect, useState } from "react"
import { type PhanAnh } from "@/types/phanAnh"
import { getPhanAnhCuaToi, getPhanAnhDonVi, type PhanAnhFilter } from "@/api/user/phanAnh/phanAnhService"


export const usePhanAnhCuaToi = () => {

  const [data, setData] = useState<PhanAnh[]>([])
  const [loading, setLoading] = useState(true)

  const [filter, setFilter] = useState<PhanAnhFilter>({})

  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  const load = async (p = page) => {

    setLoading(true)

    try {

      const res = await getPhanAnhCuaToi({
        page: p,
        ...filter
      })

      setData(res.data)
      setPage(res.current_page)
      setLastPage(res.last_page)

    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    load(1)
  }, [filter])

  useEffect(() => {
    load(page)
  }, [page])

  return {
    data,
    loading,
    page,
    lastPage,
    setPage,
    filter,
    setFilter
  }
}

export const usePhanAnhDonVi = () => {

  const [data, setData] = useState<PhanAnh[]>([])
  const [loading, setLoading] = useState(true)

  const [filter, setFilter] = useState<PhanAnhFilter>({})

  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)

  const load = async (p = page) => {

    setLoading(true)

    try {

      const res = await getPhanAnhDonVi({
        page: p,
        ...filter
      })

      setData(res.data)
      setPage(res.current_page)
      setLastPage(res.last_page)

    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    load(1)
  }, [filter])

  useEffect(() => {
    load(page)
  }, [page])

  return {
    data,
    loading,
    page,
    lastPage,
    setPage,
    filter,
    setFilter
  }
}