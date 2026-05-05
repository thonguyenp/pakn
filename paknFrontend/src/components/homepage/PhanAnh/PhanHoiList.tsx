import DanhGiaPhanHoi from "./DanhGiaPhanHoi";
import PhanHoiItem from "./PhanHoiItem";

type Props = {
  danhSach: any[];
  phanAnh?: any;
  phanHoiMoiNhatId?: number;
};

const PhanHoiList = ({ danhSach, phanAnh, phanHoiMoiNhatId }: Props) => {
  if (!danhSach || danhSach.length === 0) {
    return <div className="text-gray-500">Chưa có phản hồi</div>;
  }

  return (
    <div className="space-y-4">
      {danhSach.map((item) => (
        <div key={item.IdPhanHoi} className="space-y-2">
          
          {/* Phản hồi */}
          <PhanHoiItem phanHoi={item} phanAnh={phanAnh} />

          {/* Đánh giá */}
          {phanAnh?.IdTrangThaiPhanAnh === 6 && item.LaNoiBo === 0 && (
            <DanhGiaPhanHoi
              idPhanHoi={item.IdPhanHoi}
              chiChoDanhGia={item.IdPhanHoi === phanHoiMoiNhatId}
            />
          )}

        </div>
      ))}
    </div>
  );
};

export default PhanHoiList;