import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import FileDropzone from "@/components/shared/FileDropzone";
import { createAction } from "@/api/user/phanAnhService";
import { actionConfig } from "@/constants/phanAnh/actionConfig";
import { ActionType } from "@/constants/phanAnh/actionType";
import ToggleSwitch from "@/components/shared/ToogleSwitch";

const PhanAnhActionForm = () => {
  const { MaTheoDoi, action } = useParams();
  const navigate = useNavigate();
    const actionType = Number(action) as ActionType;
  const config = actionConfig[actionType];

  const [noiDung, setNoiDung] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [donVi, setDonVi] = useState("");
  const [laNoiBo, setLaNoiBo] = useState(false);

  const handleSubmit = async () => {
    if (!noiDung.trim()) {
      alert("Nhập nội dung");
      return;
    }

    try {
      setLoading(true);

      await createAction(MaTheoDoi!, {
        NoiDung: noiDung,
        files,
        action: Number(action),
        donVi,
        LaNoiBo: laNoiBo ? 1 : 0,
      });

      navigate(`/phan-anh/${MaTheoDoi}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-6 rounded-2xl shadow space-y-6">

        <h1 className={`text-2xl font-bold text-${config.color}-600`}>
          {config.title}
        </h1>

        <ReactQuill value={noiDung} onChange={setNoiDung} />

        {/* {config.extra === "donVi" && (
          <input
            value={donVi}
            onChange={(e) => setDonVi(e.target.value)}
            placeholder="Nhập đơn vị"
            className="w-full border p-2 rounded"
          />
        )} */}
        <ToggleSwitch
          label="Nội bộ"
          checked={laNoiBo}
          onChange={setLaNoiBo}
        />
        <FileDropzone files={files} setFiles={setFiles} />

        <button
          onClick={handleSubmit}
          className={`w-full py-3 bg-${config.color}-600 text-white`}
        >
          {config.button}
        </button>
      </div>
    </div>
  );
};

export default PhanAnhActionForm;