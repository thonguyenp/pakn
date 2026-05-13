import { ActionType } from "./actionType";

export const actionConfig = {
  [ActionType.TIEP_NHAN]: {
    title: "Tiếp nhận phản ánh",
    bgColor: "bg-green-500",
    button: "Tiếp nhận",
    requireForm: false,
  },

  [ActionType.XU_LY]: {
    title: "Chuyển sang xử lý",
    bgColor: "bg-blue-500",
    button: "Bắt đầu xử lý",
    requireForm: true,
  },

  [ActionType.GIAI_QUYET]: {
    title: "Đánh dấu đã giải quyết",
    bgColor: "bg-emerald-500",
    button: "Hoàn thành",
    requireForm: false,
  },

  [ActionType.TU_CHOI]: {
    title: "Từ chối phản ánh",
    bgColor: "bg-red-500",
    button: "Xác nhận từ chối",
    requireForm: true,
  },

  [ActionType.BO_SUNG]: {
    title: "Yêu cầu bổ sung",
    bgColor: "bg-yellow-500",
    button: "Bổ sung thông tin",
    requireForm: true,
  },

  [ActionType.CHUYEN_DON_VI]: {
    title: "Chuyển đơn vị",
    bgColor: "bg-teal-500",
    button: "Chuyển đơn vị",
    extra: "donVi",
    requireForm: true,
  },
};