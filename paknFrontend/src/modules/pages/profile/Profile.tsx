import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    updateProfileApi,
    getProfile
} from "@/api/user/profileApi";

import ChangePassword from "@/components/homepage/profile/ChangePassword";
import MainProfile from "@/components/homepage/profile/MainProfile";
import NotificationTab from "@/components/homepage/profile/NotificationTab";
import { useAuth } from "@/contexts/AuthContext";

interface User {
    userId: number;
    HoTen: string;
    Email: string;
    SoDienThoai: string;
    MaSo: string;
}

type TabType = "profile" | "password" | "notifications";

export default function Profile() {
    const location = useLocation();
    const navigate = useNavigate();

    const getTabFromHash = (): TabType => {
        const hash = location.hash.replace("#", "");

        if (
            hash === "profile" ||
            hash === "password" ||
            hash === "notifications"
        ) {
            return hash;
        }

        return "profile";
    };

    const [user, setUser] = useState<User | null>(null);

    const [tab, setTab] = useState<TabType>(
        getTabFromHash()
    );

    const [form, setForm] = useState({
        HoTen: "",
        SoDienThoai: ""
    });

    useEffect(() => {
        setTab(getTabFromHash());
    }, [location.hash]);

    const changeTab = (newTab: TabType) => {
        setTab(newTab);

        navigate({
            hash: newTab
        });
    };

    const { logout } = useAuth();

    const fetchProfile = async () => {
        try {
            const res = await getProfile();

            setUser(res.data);

            setForm({
                HoTen: res.data.HoTen,
                SoDienThoai: res.data.SoDienThoai || ""
            });

        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const updateProfile = async () => {
        try {
            await updateProfileApi(form);

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
        return (
            <div className="text-center mt-20">
                Loading...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mt-10 px-4 mb-4">

            <div className="grid grid-cols-1 md:grid-cols-10 gap-6">

                {/* LEFT */}
                <div className="md:col-span-3 bg-white shadow rounded-lg p-6">

                    <div className="mb-6">
                        <p className="text-gray-500 text-sm">
                            {user.Email}
                        </p>

                        <p className="font-semibold text-lg">
                            {user.HoTen}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">

                        <button
                            onClick={() => changeTab("profile")}
                            className="w-full bg-[#1e54a4] text-white py-2 rounded hover:bg-blue-700"
                        >
                            Thông tin tài khoản
                        </button>

                        <button
                            onClick={() => changeTab("password")}
                            className="w-full border border-gray-300 py-2 rounded hover:bg-gray-100"
                        >
                            Đổi mật khẩu
                        </button>

                        <button
                            onClick={() => changeTab("notifications")}
                            className="w-full border border-gray-300 py-2 rounded hover:bg-gray-100"
                        >
                            Thông báo
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
                <div className="md:col-span-7 bg-white shadow rounded-lg p-6 md:p-8 flex flex-col">

                    {tab === "profile" && (
                        <MainProfile
                            user={user}
                            form={form}
                            handleChange={handleChange}
                            updateProfile={updateProfile}
                        />
                    )}

                    {tab === "password" && (
                        <ChangePassword
                            onCancel={() => changeTab("profile")}
                        />
                    )}

                    {tab === "notifications" && (
                        <NotificationTab />
                    )}

                </div>

            </div>

        </div>
    );
}