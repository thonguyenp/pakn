import { ActionType } from "./actionType";

export const actionConfig = {
  [ActionType.TIEP_NHAN]: {
    title: "Tiếp nhận phản ánh",
    color: "green",
    button: "Tiếp nhận",
    requireForm: false,
  },

  [ActionType.XU_LY]: {
    title: "Chuyển sang xử lý",
    color: "blue",
    button: "Bắt đầu xử lý",
    requireForm: true,
  },

  [ActionType.GIAI_QUYET]: {
    title: "Đánh dấu đã giải quyết",
    color: "emerald",
    button: "Hoàn thành",
    requireForm: false,
  },

  [ActionType.TU_CHOI]: {
    title: "Từ chối phản ánh",
    color: "red",
    button: "Xác nhận từ chối",
    requireForm: true,
  },

  [ActionType.BO_SUNG]: {
    title: "Yêu cầu bổ sung",
    color: "yellow",
    button: "Gửi yêu cầu",
    requireForm: true,
  },

  [ActionType.CHUYEN_DON_VI]: {
    title: "Chuyển đơn vị",
    color: "purple",
    button: "Chuyển",
    extra: "donVi",
    requireForm: true,
  },
};