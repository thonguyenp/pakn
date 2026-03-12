import { useEffect, useState } from "react";
import { guiPhanAnh } from "@/services/phanAnhService";
import {api} from "@/api/api";

const GuiPhanAnh = () => {

  const [tieuDe,setTieuDe] = useState("");
  const [noiDung,setNoiDung] = useState("");

  const [linhVuc,setLinhVuc] = useState("");
  const [donVi,setDonVi] = useState("");

  const [mucDoKhanCap,setMucDoKhanCap] = useState("THAP");

  const [anDanh,setAnDanh] = useState(false);

  const [files,setFiles] = useState<File[]>([]);

  const [dsLinhVuc,setDsLinhVuc] = useState<any[]>([]);
  const [dsDonVi,setDsDonVi] = useState<any[]>([]);

  useEffect(()=>{

    const fetchData = async()=>{

      const linhVucRes = await api.get("/linhvuc");
      const donViRes = await api.get("/donvi");

      setDsLinhVuc(linhVucRes.data);
      setDsDonVi(donViRes.data);

    };

    fetchData();

  },[]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
      setFiles(Array.from(e.target.files));
    }
  };


  const handleSubmit = async (e:React.FormEvent) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("TieuDe",tieuDe);
    formData.append("NoiDung",noiDung);
    formData.append("IdLinhVuc",linhVuc);
    formData.append("IdDonVi",donVi);
    formData.append("MucDoKhanCap",mucDoKhanCap);
    formData.append("AnDanh",anDanh ? "1" : "0");

    files.forEach((file)=>{
      formData.append("files[]",file);
    });

    try{

      await guiPhanAnh(formData);

      alert("Gửi phản ánh thành công");

    }catch(error){

      console.error(error);
      alert("Gửi thất bại");

    }

  };


  return (

    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">

      <h1 className="text-2xl font-bold mb-6">
        Gửi phản ánh kiến nghị
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Tiêu đề"
          value={tieuDe}
          onChange={(e)=>setTieuDe(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Nội dung phản ánh"
          value={noiDung}
          onChange={(e)=>setNoiDung(e.target.value)}
          className="w-full border p-2 rounded"
          rows={5}
          required
        />

        {/* Lĩnh vực */}

        <select
          value={linhVuc}
          onChange={(e)=>setLinhVuc(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >

          <option value="">Chọn lĩnh vực</option>

          {dsLinhVuc.map((lv)=>(
            <option key={lv.IdLinhVuc} value={lv.IdLinhVuc}>
              {lv.TenLinhVuc}
            </option>
          ))}

        </select>


        {/* Đơn vị */}

        <select
          value={donVi}
          onChange={(e)=>setDonVi(e.target.value)}
          className="w-full border p-2 rounded"
          required
        >

          <option value="">Chọn đơn vị</option>

          {dsDonVi.map((dv)=>(
            <option key={dv.IdDonVi} value={dv.IdDonVi}>
              {dv.TenDonVi}
            </option>
          ))}

        </select>


        {/* Mức độ khẩn cấp */}

        <select
          value={mucDoKhanCap}
          onChange={(e)=>setMucDoKhanCap(e.target.value)}
          className="w-full border p-2 rounded"
        >

          <option value="THAP">Thấp</option>
          <option value="TRUNG_BINH">Trung bình</option>
          <option value="CAO">Cao</option>
          <option value="KHAN_CAP">Khẩn cấp</option>

        </select>


        {/* Ẩn danh */}

        <div className="flex items-center gap-2">

          <input
            type="checkbox"
            checked={anDanh}
            onChange={(e)=>setAnDanh(e.target.checked)}
          />

          <label>
            Gửi phản ánh ẩn danh
          </label>

        </div>


        {/* Upload file */}

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full"
        />


        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Gửi phản ánh
        </button>

      </form>

    </div>

  );

};

export default GuiPhanAnh;