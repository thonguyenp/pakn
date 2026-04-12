import PhanHoiItem from "./PhanHoiItem";

type Props = {
  danhSach: any[];
};

const PhanHoiList = ({ danhSach }: Props) => {
  if (!danhSach || danhSach.length === 0) {
    return <div className="text-gray-500">Chưa có phản hồi</div>;
  }

  return (
    <div className="space-y-4">
      {danhSach.map((item, index) => (
        <PhanHoiItem key={index} phanHoi={item} />
      ))}
    </div>
  );
};

export default PhanHoiList;