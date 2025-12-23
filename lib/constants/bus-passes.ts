/**
 * Bus Pass Configuration Constants
 *
 * Centralizes all bus pass pricing and type mappings to avoid hardcoded values
 * throughout the codebase. This supports the transition from legacy Sac-only bus
 * passes to the new dual Yolo/Sac system.
 *
 * History:
 * - FundType 3 (Legacy): Original "Bus Pass" at $2.50 - kept for historical data
 * - FundType 7 (Sac): Sacramento County single fare at $2.50
 * - FundType 8 (Yolo): Yolo County double fare at $5.00
 */

export const BUS_PASS_CONFIG = {
  SAC: { fundTypeId: 7, unitValue: 2.5, label: "Sac Bus Pass" },
  YOLO: { fundTypeId: 8, unitValue: 5.0, label: "Yolo Bus Pass" },
  LEGACY: { fundTypeId: 3, unitValue: 2.5, label: "Bus Pass" },
} as const;

/** All FundType IDs that represent bus passes (legacy + new types) */
export const BUS_PASS_FUND_TYPE_IDS = [3, 7, 8] as const;

/** FundType IDs for new bus pass types only (excludes legacy) */
export const NEW_BUS_PASS_FUND_TYPE_IDS = [7, 8] as const;

/** Legacy bus pass FundType ID - hidden from new requests but honored for pending/historical */
export const LEGACY_BUS_PASS_FUND_TYPE_ID = 3;

/**
 * Gets the unit value (price per pass) for a given bus pass FundType
 * @param fundTypeId - The FundType ID to look up
 * @returns The unit value in dollars, or 0 if not a bus pass type
 */
export function getBusPassUnitValue(fundTypeId: number): number {
  switch (fundTypeId) {
    case 7:
      return BUS_PASS_CONFIG.SAC.unitValue; // $2.50 Sac
    case 8:
      return BUS_PASS_CONFIG.YOLO.unitValue; // $5.00 Yolo
    case 3:
      return BUS_PASS_CONFIG.LEGACY.unitValue; // $2.50 Legacy
    default:
      return 0;
  }
}

/**
 * Checks if a FundType ID represents any type of bus pass
 * @param fundTypeId - The FundType ID to check
 * @returns true if this is a bus pass FundType (legacy, Sac, or Yolo)
 */
export function isBusPassFundType(fundTypeId: number): boolean {
  return (BUS_PASS_FUND_TYPE_IDS as readonly number[]).includes(fundTypeId);
}

/**
 * Checks if a FundType ID is the legacy bus pass type
 * @param fundTypeId - The FundType ID to check
 * @returns true if this is the legacy bus pass FundType (id=3)
 */
export function isLegacyBusPassFundType(fundTypeId: number): boolean {
  return fundTypeId === LEGACY_BUS_PASS_FUND_TYPE_ID;
}

/**
 * Calculates the total value for a bus pass fund based on quantity and type
 * For non-bus-pass fund types, returns the amount as-is (assumed to be dollar value)
 * @param fundTypeId - The FundType ID
 * @param amount - The quantity (for bus passes) or dollar amount (for other funds)
 * @returns The calculated total value in dollars
 */
export function calculateBusPassValue(
  fundTypeId: number,
  amount: number,
): number {
  if (isBusPassFundType(fundTypeId)) {
    return amount * getBusPassUnitValue(fundTypeId);
  }
  return amount;
}
