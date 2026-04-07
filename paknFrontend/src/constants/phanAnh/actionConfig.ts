import { ActionType } from "./actionType";

export const actionConfig = {
  [ActionType.TU_CHOI]: {
    title: "Từ chối phản ánh",
    color: "red",
    button: "Xác nhận từ chối",
  },
  [ActionType.BO_SUNG]: {
    title: "Yêu cầu bổ sung",
    color: "yellow",
    button: "Gửi yêu cầu",
  },
  [ActionType.CHUYEN_DON_VI]: {
    title: "Chuyển đơn vị",
    color: "blue",
    button: "Chuyển",
    extra: "donVi",
  },
};