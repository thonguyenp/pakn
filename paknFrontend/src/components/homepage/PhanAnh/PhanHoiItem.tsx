type Props = {
    phanHoi: any;
    phanAnh?: any;
};

const PhanHoiItem = ({ phanHoi, phanAnh }: Props) => {
    return (
        <div className="border rounded-xl p-4 bg-gray-50 space-y-3">

            {/* Header */}
            <div className="flex justify-between text-sm text-gray-500">
                <b>{phanHoi.nguoi_dung?.HoTen}</b>
                <span>{new Date(phanHoi.NgayPhanHoi).toLocaleString()}</span>
            </div>
            <p>Lĩnh vực: {phanAnh?.linh_vuc?.TenLinhVuc}</p>
            <p>Đơn vị: {phanHoi?.nguoi_dung?.don_vi?.TenDonVi}</p>
            {/* Nội bộ */}
            {phanHoi.LaNoiBo === 1 && (
                <span className="text-xs text-red-500">Nội bộ</span>
            )}

            {/* Nội dung */}
            <div
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{
                    __html: `<strong>Nội dung:</strong> ${phanHoi.NoiDung}`
                }}
            />
            {/* FILE ĐÍNH KÈM */}
            {phanHoi.files && phanHoi.files.length > 0 && (
                <div className="space-y-2">
                    <div className="text-sm font-medium">File đính kèm:</div>

                    {phanHoi.files.map((file: any, index: number) => (
                        <a
                            key={index}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-600 hover:underline text-sm"
                        >
                            {file.TenFile}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};
export default PhanHoiItem;