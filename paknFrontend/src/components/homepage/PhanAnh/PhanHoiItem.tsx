type Props = {
  phanHoi: any;
};

const PhanHoiItem = ({ phanHoi }: Props) => {
  return (
    <div className="border rounded-xl p-4 bg-gray-50">
      <div className="flex justify-between text-sm text-gray-500">
        <span>{phanHoi.nguoi_dung?.Ten}</span>
        <span>{new Date(phanHoi.NgayPhanHoi).toLocaleString()}</span>
      </div>

      {phanHoi.LaNoiBo === 1 && (
        <span className="text-xs text-red-500">Nội bộ</span>
      )}

      <p className="mt-2 whitespace-pre-line">{phanHoi.NoiDung}</p>
    </div>
  );
};

export default PhanHoiItem;