import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createPhanHoi } from "@/api/user/phanHoiService";
import { getPhanAnhChiTiet } from "@/api/user/phanAnhService";
import FileDropzone from "@/components/shared/FileDropzone";
import ReactQuill from "react-quill-new";

const PhanHoiCreate = () => {
  const { maTheoDoi } = useParams();
  const navigate = useNavigate();

  const [noiDung, setNoiDung] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [idPhanAnh, setIdPhanAnh] = useState<number | null>(null);
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],

      ["bold", "italic", "underline", "strike"],

      [{ color: [] }, { background: [] }],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],

      ["blockquote", "code-block"],

      ["clean"],
    ],
  };

  // Lấy thông tin phản ánh
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!maTheoDoi) return;
        const res = await getPhanAnhChiTiet(maTheoDoi);
        setIdPhanAnh(res.IdPhanAnh);
      } catch (error) {
        console.error("Không lấy được phản ánh", error);
      }
    };

    fetchData();
  }, [maTheoDoi]);

  const handleSubmit = async () => {
    if (!noiDung.trim() || noiDung === "<p></p>") {
      alert("Vui lòng nhập nội dung phản hồi");
      return;
    }

    if (!idPhanAnh) {
      alert("Không tìm thấy phản ánh");
      return;
    }

    try {
      setLoading(true);
      await createPhanHoi({
        NoiDung: noiDung,
        IdPhanAnh: idPhanAnh,
        files: files,
      });

      alert("Phản hồi đã được gửi thành công!");
      navigate(`/phan-anh/${maTheoDoi}`);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi gửi phản hồi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-6 rounded-2xl shadow space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gửi phản hồi - #{maTheoDoi}
        </h1>

        <div className="border rounded-xl bg-white shadow-sm">
          <div className="max-h-[250px] overflow-hidden">
            <ReactQuill
              value={noiDung}
              onChange={setNoiDung}
              modules={modules}
              className="bg-white rounded-xl"
            />
          </div>
        </div>        {/* Upload file */}
        <FileDropzone setFiles={setFiles} files={files} />

        {/* Nút gửi */}
        <button
          onClick={handleSubmit}
          disabled={loading || !idPhanAnh}
          className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors"
        >
          {loading ? "Đang gửi phản hồi..." : "Gửi phản hồi"}
        </button>
      </div>
    </div>
  );
};

export default PhanHoiCreate;