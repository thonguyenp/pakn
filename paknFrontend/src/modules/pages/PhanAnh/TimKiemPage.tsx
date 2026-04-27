import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchPhanAnh } from "@/api/user/phanAnhService";
import { getMeta } from "@/api/meta/metaService";
import type { PhanAnh } from "@/types/phanAnh";
import SelectSearchDropdown from "@/components/shared/SelectSearchDropdown";
import type { DonVi } from "@/types/donvi";
import type { LinhVuc } from "@/types/linhvuc";

export default function TimKiemPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const keyword = searchParams.get("keyword") || "";

    const [data, setData] = useState<PhanAnh[]>([]);
    const [dsLinhVuc, setDsLinhVuc] = useState<LinhVuc[]>([]);
    const [dsDonVi, setDsDonVi] = useState<DonVi[]>([]);

    const [idLinhVuc, setIdLinhVuc] = useState<string>("");
    const [idDonVi, setIdDonVi] = useState<string>("");

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const linhVucOptions = dsLinhVuc.map((lv) => ({
        label: lv.TenLinhVuc,
        value: lv.IdLinhVuc.toString(),
    }));

    const donViOptions = dsDonVi.map((dv) => ({
        label: dv.TenDonVi,
        value: dv.IdDonVi.toString(),
    }));
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // hoặc "auto" nếu không muốn animation
        });
    }, [page]);
    
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const res = await getMeta("linhvuc,donvi");
                setDsLinhVuc(res.linhvuc || []);
                setDsDonVi(res.donvi || []);
            } catch (err) {
                console.error(err);
            }
        };

        fetchMeta();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!keyword) return;

            try {
                setLoading(true);

                const res = await searchPhanAnh(
                    keyword,
                    page,
                    idLinhVuc ? Number(idLinhVuc) : undefined,
                    idDonVi ? Number(idDonVi) : undefined
                );

                setData(res.data?.data || []);
                setLastPage(res.data?.last_page || 1);
            } catch (err) {
                console.error(err);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [keyword, page, idLinhVuc, idDonVi]);

    useEffect(() => {
        setPage(1);
    }, [keyword, idLinhVuc, idDonVi]);

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">
                Kết quả tìm kiếm: "{keyword}"
            </h1>

            <div className="flex gap-4 mb-4">
                <SelectSearchDropdown
                    options={linhVucOptions}
                    value={idLinhVuc}
                    onChange={setIdLinhVuc}
                    placeholder="Chọn lĩnh vực"
                />

                <SelectSearchDropdown
                    options={donViOptions}
                    value={idDonVi}
                    onChange={setIdDonVi}
                    placeholder="Chọn đơn vị"
                />
            </div>

            {loading && <p>Đang tìm...</p>}

            {!loading && data.length === 0 && (
                <p>Không tìm thấy kết quả</p>
            )}

            <div className="space-y-4">
                {data.map((item) => (
                    <div
                        key={item.IdPhanAnh}
                        className="border p-4 rounded-md hover:shadow cursor-pointer"
                        onClick={() =>
                            navigate(
                                `/phan-anh/${item.MaTheoDoi}/${new Date(
                                    item.NgayGui
                                ).toISOString().split("T")[0]}`,
                                {
                                    state: {
                                        ngayGui: item.NgayGui,
                                        idTrangThaiPhanAnh:
                                            item.IdTrangThaiPhanAnh,
                                    },
                                }
                            )
                        }
                    >
                        <h2 className="font-semibold text-lg">
                            {item.TieuDe}
                        </h2>

                        <p className="text-gray-500 text-sm">
                            {item.NoiDung || "Không có nội dung"}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                            {item.NgayGui}
                        </p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-6 gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <span>Trang {page} / {lastPage}</span>

                <button
                    disabled={page === lastPage}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}