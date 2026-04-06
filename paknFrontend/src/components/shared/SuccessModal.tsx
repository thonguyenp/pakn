import React from "react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
  maTheoDoi: string
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  message,
  maTheoDoi,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[420px] p-6 text-center border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="text-xl font-bold mb-3 text-blue-700">
          Gửi thành công
        </h2>

        {/* Divider */}
        <div className="w-12 h-1 bg-blue-600 mx-auto mb-4 rounded-full"></div>

        {/* Message */}
        <p className="mb-2 text-gray-600">{message}</p>

        {/* Mã theo dõi */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg py-3 px-4 mb-5">
          <p className="text-sm text-gray-500 mb-1">
            Mã theo dõi của bạn
          </p>
          <p className="font-semibold text-lg text-blue-700 tracking-wide">
            {maTheoDoi}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigator.clipboard.writeText(maTheoDoi)}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
          >
            Copy
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal