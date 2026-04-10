import { useEffect, useState } from "react";
import { verifyEmail } from "@/api/user/authApi";
import { useNavigate } from "react-router-dom";

interface Props {
    token: string;
    onClose: () => void;
}

export default function VerifyEmailModal({ token, onClose }: Props) {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        verifyEmail(token)
            .then(res => {
                setStatus("success");
                setMessage(res.message);
            })
            .catch(err => {
                setStatus("error");
                setMessage(err.response?.data?.message || "Có lỗi xảy ra");
            });
    }, [token]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[400px] text-center shadow-lg">
                
                {status === "loading" && (
                    <p className="text-blue-500">Đang xác thực...</p>
                )}

                {status === "success" && (
                    <p className="text-green-600 font-semibold">
                        {message}
                    </p>
                )}

                {status === "error" && (
                    <p className="text-red-500 font-semibold">
                        {message}
                    </p>
                )}

                <button
                    onClick={() => {
                        navigate("/");
                        onClose();
                    }}
                    className="mt-4 px-4 py-2 bg-gray-800 text-white rounded"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
}