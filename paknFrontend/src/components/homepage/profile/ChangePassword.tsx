import { useState } from "react";
import { api } from "@/api/api";
import PasswordInput from "@/components/shared/PasswordInput";

interface Props {
    onCancel: () => void;
}

export default function ChangePassword({ onCancel }: Props) {

    const [form, setForm] = useState({
        old_password: "",
        new_password: "",
        new_password_confirmation: ""
    });

    const changePassword = async () => {
        try {

            await api.post("/change-password", form);

            alert("Đổi mật khẩu thành công");

            setForm({
                old_password: "",
                new_password: "",
                new_password_confirmation: ""
            });

            onCancel();

        } catch (err: any) {

            alert(err.response?.data?.message || "Đổi mật khẩu thất bại");

        }
    };

    return (
        <div>

            <h2 className="text-xl font-semibold mb-6">
                Đổi mật khẩu
            </h2>

            <div className="space-y-5">

                <div>
                    <label className="text-gray-500 text-sm">
                        Mật khẩu cũ
                    </label>

                    <PasswordInput
                        value={form.old_password}
                        onChange={value => setForm({ ...form, old_password: value })}
                        placeholder="Mật khẩu cũ"
                        className="w-full border-b pl-10 border-gray-300 px-1 py-2 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="text-gray-500 text-sm">
                        Mật khẩu mới
                    </label>

                    <PasswordInput
                        value={form.new_password}
                        onChange={value => setForm({ ...form, new_password: value })}
                        placeholder="Mật khẩu mới"
                        className="w-full border-b pl-10 border-gray-300 px-1 py-2 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="text-gray-500 text-sm">
                        Xác nhận mật khẩu mới
                    </label>

                    <PasswordInput
                        value={form.new_password_confirmation}
                        onChange={value => setForm({ ...form, new_password_confirmation: value })}
                        placeholder="Xác nhận mật khẩu mới"
                        className="w-full border-b pl-10 border-gray-300 px-1 py-2 focus:outline-none focus:border-blue-500"
                    />
                </div>

            </div>

            <div className="flex justify-end mt-8 gap-3">

                <button
                    onClick={onCancel}
                    className="px-6 py-2 border rounded hover:bg-gray-100"
                >
                    Hủy
                </button>

                <button
                    onClick={changePassword}
                    className="bg-[#1e54a4] text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Đổi mật khẩu
                </button>

            </div>

        </div>
    );
}