import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";

import FileDropzone from "@/components/shared/FileDropzone";
import ToggleSwitch from "@/components/shared/ToogleSwitch";
import SelectSearchDropdown from "@/components/shared/SelectSearchDropdown";

import { createAction } from "@/api/user/phanAnh/phanAnhService";
import { getMeta } from "@/api/meta/metaService";
import { getPhanAnhChiTiet } from "@/api/user/phanAnh/phanAnhService";

import { actionConfig } from "@/constants/phanAnh/actionConfig";
import { ActionType } from "@/constants/phanAnh/actionType";

import type { DonVi } from "@/types/donvi";

const PhanAnhActionForm = () => {
  const { MaTheoDoi, action } = useParams();

  const navigate = useNavigate();

  const actionType = Number(action) as ActionType;

  const config = actionConfig[actionType];

  const [noiDung, setNoiDung] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const [dsDonVi, setDsDonVi] = useState<DonVi[]>([]);
  const [donvi, setDonVi] = useState("");

  const [currentDonVi, setCurrentDonVi] = useState("");

  const [laNoiBo, setLaNoiBo] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {

        // chỉ load khi action = chuyển đơn vị
        if (actionType !== ActionType.CHUYEN_DON_VI) {
          return;
        }

        const meta = await getMeta("donvi");

        setDsDonVi(meta.donvi || []);

        if (MaTheoDoi) {

          const response = await getPhanAnhChiTiet(MaTheoDoi);
          const phanAnh = response;
          console.log("phanAnh", phanAnh);
          setCurrentDonVi(
            phanAnh?.don_vi?.TenDonVi || "Không rõ"
          );  //Đã hiển thị được Id nhưng làm sao để hiển thị tên

          setDonVi(
            phanAnh?.IdDonVi?.toString() || ""
          );
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

  }, [actionType, MaTheoDoi]);

  const donViOptions = dsDonVi.map(dv => ({
    label: dv.TenDonVi,
    value: dv.IdDonVi.toString()
  }));

  const handleSubmit = async () => {

    if (!noiDung.trim()) {
      alert("Nhập nội dung");

      return;
    }

    if (
      actionType === ActionType.CHUYEN_DON_VI &&
      !donvi
    ) {
      alert("Vui lòng chọn đơn vị");

      return;
    }

    try {

      setLoading(true);
      setError("");
      await createAction(MaTheoDoi!, {
        NoiDung: noiDung,
        files,
        action: Number(action),
        IdDonVi: donvi ? Number(donvi) : undefined,
        LaNoiBo: laNoiBo ? 1 : 0,
      });

      navigate(`/phan-anh/${MaTheoDoi}`);

    }
    catch (error : any) {
      const message =
        error.response.data.error ||
        "Có lỗi xảy ra";
      setError(message);
    }
    finally {

      setLoading(false);

    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <div className="bg-white p-6 rounded-2xl shadow space-y-6">

        <h1 className={`text-2xl font-bold text-${config.color}-600`}>
          {config.title}
        </h1>

        <ReactQuill
          value={noiDung}
          onChange={setNoiDung}
        />

        {actionType === ActionType.CHUYEN_DON_VI && (
          <div className="space-y-4 border rounded-xl p-4 bg-gray-50">

            <div>
              <label className="block text-sm font-medium mb-1">
                Đơn vị hiện tại
              </label>

              <div className="px-4 py-3 rounded-lg bg-gray-200 text-gray-700">
                {currentDonVi}
              </div>
            </div>

            <div>

              <label className="block text-sm font-medium mb-2">
                Chuyển đến đơn vị
              </label>

              <SelectSearchDropdown
                options={donViOptions}
                placeholder="Chọn đơn vị chuyển đến"
                value={donvi}
                onChange={(value) => setDonVi(value)}
              />

            </div>

          </div>
        )}

        <ToggleSwitch
          label="Nội bộ"
          checked={laNoiBo}
          onChange={setLaNoiBo}
        />

        <FileDropzone
          files={files}
          setFiles={setFiles}
        />
        {error && (
          <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}
        <button
          disabled={loading}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-xl text-white ${config.bgColor}`}
        >
          {loading ? "Đang xử lý..." : config.button}
        </button>

      </div>

    </div>
  );
};

export default PhanAnhActionForm;