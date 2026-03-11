import { useEffect, useState } from "react";
import { api } from "@/api/api";
import ChangePassword from "@/components/homepage/profile/ChangePassword";

interface User {
    HoTen: string;
    Email: string;
    SoDienThoai: string;
    MaSo: string;
}

export default function Profile() {

    const [user, setUser] = useState<User | null>(null);
    const [tab, setTab] = useState<"profile" | "password">("profile");
    const [form, setForm] = useState({
        HoTen: "",
        SoDienThoai: ""
    });

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("permissions");
        window.location.href = "/login";
    };

    const fetchProfile = async () => {
        try {
            const res = await api.get("/profile");

            setUser(res.data);
            setForm({
                HoTen: res.data.HoTen,
                SoDienThoai: res.data.SoDienThoai || ""
            });

        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const updateProfile = async () => {
        try {

            await api.put("/profile", form);

            alert("Cập nhật thông tin thành công");

            fetchProfile();

        } catch (err) {
            console.error(err);
            alert("Cập nhật thất bại");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (!user) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto mt-10 px-4">

            <div className="grid grid-cols-10 gap-6">

                {/* LEFT */}
                <div className="col-span-3 bg-white shadow rounded-lg p-6">

                    <div className="mb-6">
                        <p className="text-gray-500 text-sm">{user.Email}</p>
                        <p className="font-semibold text-lg">{user.HoTen}</p>
                    </div>

                    <div className="flex flex-col gap-3">

                        <button 
                        onClick={() => setTab("profile")}
                        className="w-full bg-[#1e54a4] text-white py-2 rounded hover:bg-blue-700">
                            Thông tin tài khoản
                        </button>

                        <button
                            onClick={() => setTab("password")}
                            className="w-full border border-gray-300 py-2 rounded hover:bg-gray-100">
                            Đổi mật khẩu
                        </button>

                        <button
                            onClick={logout}
                            className="w-full border border-red-400 text-red-500 py-2 rounded hover:bg-red-50"
                        >
                            Đăng xuất
                        </button>

                    </div>

                </div>

                {/* RIGHT */}
                <div className="col-span-7 bg-white shadow rounded-lg p-8 flex flex-col">
                    {tab === "profile" && (
                        <>
                            <h2 className="text-xl font-semibold mb-6">
                                Thông tin cá nhân
                            </h2>
                            <h2 className="text-xl font-semibold mb-6">
                                Thông tin cá nhân
                            </h2>

                            <div className="grid grid-cols-2 gap-6">

                                <div>
                                    <label className="text-gray-500 text-sm">
                                        Họ và tên
                                    </label>

                                    <input
                                        type="text"
                                        name="HoTen"
                                        value={form.HoTen}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 px-1 py-2 focus:outline-none focus:border-blue-500 bg-gray-100"
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-500 text-sm">
                                        Email
                                    </label>

                                    <input
                                        type="text"
                                        value={user.Email}
                                        readOnly
                                        className="w-full border-b border-gray-300 px-1 py-2 focus:outline-none focus:border-blue-500 bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-500 text-sm">
                                        Số điện thoại
                                    </label>

                                    <input
                                        type="text"
                                        name="SoDienThoai"
                                        value={form.SoDienThoai}
                                        onChange={handleChange}
                                        className="w-full border-b border-gray-300 px-1 py-2 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-500 text-sm">
                                        Mã số
                                    </label>

                                    <input
                                        type="text"
                                        value={user.MaSo}
                                        readOnly
                                        className="w-full border-b border-gray-300 px-1 py-2 focus:outline-none focus:border-blue-500 bg-gray-100"
                                    />
                                </div>

                            </div>

                            {/* BUTTON */}
                            <div className="flex justify-end mt-8">
                                <button
                                    onClick={updateProfile}
                                    className="bg-[#1e54a4] text-white px-6 py-2 rounded hover:bg-blue-700"
                                >
                                    Cập nhật thông tin
                                </button>
                            </div>
                        </>
                    )}
                    {tab === "password" && (
                        <ChangePassword onCancel={() => setTab("profile")} />
                    )}
                </div>

            </div>

        </div>
    );
}