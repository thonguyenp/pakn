import PhanHoiItem from "./PhanHoiItem";

type Props = {
  danhSach: any[];
  phanAnh?: any;
};

const PhanHoiList = ({ danhSach, phanAnh }: Props) => {
  if (!danhSach || danhSach.length === 0) {
    return <div className="text-gray-500">Chưa có phản hồi</div>;
  }

  return (
    <div className="space-y-4">
      {danhSach.map((item, index) => (
        <PhanHoiItem key={index} phanHoi={item} phanAnh={phanAnh} />
      ))}
    </div>
  );
};

export default PhanHoiList;