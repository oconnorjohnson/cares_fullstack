/**
 * Bus Pass Configuration Constants
 */

export const BUS_PASS_CONFIG = {
  SAC: { fundTypeId: 7, unitValue: 2.5, label: "Sac Bus Pass" },
  YOLO: { fundTypeId: 8, unitValue: 5.0, label: "Yolo Bus Pass" },
  LEGACY: { fundTypeId: 3, unitValue: 2.5, label: "Bus Pass" },
} as const;

export const BUS_PASS_FUND_TYPE_IDS = [3, 7, 8] as const;
export const NEW_BUS_PASS_FUND_TYPE_IDS = [7, 8] as const;
export const LEGACY_BUS_PASS_FUND_TYPE_ID = 3;

export function getBusPassUnitValue(fundTypeId: number): number {
  switch (fundTypeId) {
    case 7:
      return BUS_PASS_CONFIG.SAC.unitValue;
    case 8:
      return BUS_PASS_CONFIG.YOLO.unitValue;
    case 3:
      return BUS_PASS_CONFIG.LEGACY.unitValue;
    default:
      return 0;
  }
}

export function isBusPassFundType(fundTypeId: number): boolean {
  return (BUS_PASS_FUND_TYPE_IDS as readonly number[]).includes(fundTypeId);
}

export function isLegacyBusPassFundType(fundTypeId: number): boolean {
  return fundTypeId === LEGACY_BUS_PASS_FUND_TYPE_ID;
}

export function calculateBusPassValue(
  fundTypeId: number,
  amount: number,
): number {
  if (isBusPassFundType(fundTypeId)) {
    return amount * getBusPassUnitValue(fundTypeId);
  }
  return amount;
}
