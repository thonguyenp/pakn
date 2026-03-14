import React from "react";

interface User {
    HoTen: string;
    Email: string;
    SoDienThoai: string;
    MaSo: string;
}

interface Props {
    user: User;
    form: {
        HoTen: string;
        SoDienThoai: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    updateProfile: () => void;
}

export default function MainProfile({
    user,
    form,
    handleChange,
    updateProfile
}: Props) {

    return (
        <>
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
                        className="w-full border-b border-gray-300 px-1 py-2 bg-gray-100"
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
                        className="w-full border-b border-gray-300 px-1 py-2 bg-gray-100"
                    />
                </div>

            </div>

            <div className="flex justify-end mt-8">
                <button
                    onClick={updateProfile}
                    className="bg-[#1e54a4] text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Cập nhật thông tin
                </button>
            </div>
        </>
    );
}