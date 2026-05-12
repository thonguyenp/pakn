import { ActionType } from "./actionType";

export const actionTransitions: Record<number, ActionType[]> = {
  [ActionType.CHO_DUYET]: [
    ActionType.TIEP_NHAN,
    ActionType.TU_CHOI,
  ],

  [ActionType.TIEP_NHAN]: [
    ActionType.XU_LY,
    ActionType.CHUYEN_DON_VI,
    ActionType.TU_CHOI,
  ],

  [ActionType.XU_LY]: [
    ActionType.GIAI_QUYET,
    ActionType.BO_SUNG,
  ],

  [ActionType.BO_SUNG]: [
    ActionType.XU_LY,
  ],

  [ActionType.CHUYEN_DON_VI]: [
    ActionType.XU_LY,
  ],

  [ActionType.GIAI_QUYET]: [],

  [ActionType.TU_CHOI]: [],
};