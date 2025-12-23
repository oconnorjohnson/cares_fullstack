import { describe, it, expect } from "vitest";
import {
  BUS_PASS_CONFIG,
  BUS_PASS_FUND_TYPE_IDS,
  NEW_BUS_PASS_FUND_TYPE_IDS,
  LEGACY_BUS_PASS_FUND_TYPE_ID,
  getBusPassUnitValue,
  isBusPassFundType,
  isLegacyBusPassFundType,
  calculateBusPassValue,
} from "../bus-passes";

describe("Bus Pass Configuration", () => {
  describe("BUS_PASS_CONFIG", () => {
    it("should have correct Sac Bus Pass configuration", () => {
      expect(BUS_PASS_CONFIG.SAC.fundTypeId).toBe(7);
      expect(BUS_PASS_CONFIG.SAC.unitValue).toBe(2.5);
      expect(BUS_PASS_CONFIG.SAC.label).toBe("Sac Bus Pass");
    });

    it("should have correct Yolo Bus Pass configuration", () => {
      expect(BUS_PASS_CONFIG.YOLO.fundTypeId).toBe(8);
      expect(BUS_PASS_CONFIG.YOLO.unitValue).toBe(5.0);
      expect(BUS_PASS_CONFIG.YOLO.label).toBe("Yolo Bus Pass");
    });

    it("should have correct Legacy Bus Pass configuration", () => {
      expect(BUS_PASS_CONFIG.LEGACY.fundTypeId).toBe(3);
      expect(BUS_PASS_CONFIG.LEGACY.unitValue).toBe(2.5);
      expect(BUS_PASS_CONFIG.LEGACY.label).toBe("Bus Pass");
    });
  });

  describe("BUS_PASS_FUND_TYPE_IDS", () => {
    it("should include all bus pass fund type IDs", () => {
      expect(BUS_PASS_FUND_TYPE_IDS).toContain(3); // Legacy
      expect(BUS_PASS_FUND_TYPE_IDS).toContain(7); // Sac
      expect(BUS_PASS_FUND_TYPE_IDS).toContain(8); // Yolo
      expect(BUS_PASS_FUND_TYPE_IDS.length).toBe(3);
    });
  });

  describe("NEW_BUS_PASS_FUND_TYPE_IDS", () => {
    it("should only include new bus pass fund type IDs", () => {
      expect(NEW_BUS_PASS_FUND_TYPE_IDS).toContain(7); // Sac
      expect(NEW_BUS_PASS_FUND_TYPE_IDS).toContain(8); // Yolo
      expect(NEW_BUS_PASS_FUND_TYPE_IDS).not.toContain(3); // Not Legacy
      expect(NEW_BUS_PASS_FUND_TYPE_IDS.length).toBe(2);
    });
  });

  describe("LEGACY_BUS_PASS_FUND_TYPE_ID", () => {
    it("should be 3", () => {
      expect(LEGACY_BUS_PASS_FUND_TYPE_ID).toBe(3);
    });
  });
});

describe("getBusPassUnitValue", () => {
  it("should return $2.50 for Sac Bus Pass (FundType 7)", () => {
    expect(getBusPassUnitValue(7)).toBe(2.5);
  });

  it("should return $5.00 for Yolo Bus Pass (FundType 8)", () => {
    expect(getBusPassUnitValue(8)).toBe(5.0);
  });

  it("should return $2.50 for Legacy Bus Pass (FundType 3)", () => {
    expect(getBusPassUnitValue(3)).toBe(2.5);
  });

  it("should return 0 for non-bus-pass fund types", () => {
    expect(getBusPassUnitValue(1)).toBe(0); // Walmart Gift Card
    expect(getBusPassUnitValue(2)).toBe(0); // Arco Gift Card
    expect(getBusPassUnitValue(4)).toBe(0); // Cash
    expect(getBusPassUnitValue(5)).toBe(0); // Invoice
    expect(getBusPassUnitValue(6)).toBe(0); // Check
    expect(getBusPassUnitValue(999)).toBe(0); // Unknown
  });
});

describe("isBusPassFundType", () => {
  it("should return true for all bus pass fund types", () => {
    expect(isBusPassFundType(3)).toBe(true); // Legacy
    expect(isBusPassFundType(7)).toBe(true); // Sac
    expect(isBusPassFundType(8)).toBe(true); // Yolo
  });

  it("should return false for non-bus-pass fund types", () => {
    expect(isBusPassFundType(1)).toBe(false); // Walmart Gift Card
    expect(isBusPassFundType(2)).toBe(false); // Arco Gift Card
    expect(isBusPassFundType(4)).toBe(false); // Cash
    expect(isBusPassFundType(5)).toBe(false); // Invoice
    expect(isBusPassFundType(6)).toBe(false); // Check
    expect(isBusPassFundType(999)).toBe(false); // Unknown
  });
});

describe("isLegacyBusPassFundType", () => {
  it("should return true only for legacy bus pass (FundType 3)", () => {
    expect(isLegacyBusPassFundType(3)).toBe(true);
  });

  it("should return false for new bus pass types", () => {
    expect(isLegacyBusPassFundType(7)).toBe(false); // Sac
    expect(isLegacyBusPassFundType(8)).toBe(false); // Yolo
  });

  it("should return false for non-bus-pass fund types", () => {
    expect(isLegacyBusPassFundType(1)).toBe(false);
    expect(isLegacyBusPassFundType(2)).toBe(false);
    expect(isLegacyBusPassFundType(999)).toBe(false);
  });
});

describe("calculateBusPassValue", () => {
  describe("for bus pass fund types", () => {
    it("should calculate correct value for Sac Bus Passes (10 passes * $2.50)", () => {
      expect(calculateBusPassValue(7, 10)).toBe(25); // 10 * $2.50
    });

    it("should calculate correct value for Yolo Bus Passes (10 passes * $5.00)", () => {
      expect(calculateBusPassValue(8, 10)).toBe(50); // 10 * $5.00
    });

    it("should calculate correct value for Legacy Bus Passes (10 passes * $2.50)", () => {
      expect(calculateBusPassValue(3, 10)).toBe(25); // 10 * $2.50
    });

    it("should handle zero quantity", () => {
      expect(calculateBusPassValue(7, 0)).toBe(0);
      expect(calculateBusPassValue(8, 0)).toBe(0);
      expect(calculateBusPassValue(3, 0)).toBe(0);
    });

    it("should handle single pass", () => {
      expect(calculateBusPassValue(7, 1)).toBe(2.5);
      expect(calculateBusPassValue(8, 1)).toBe(5.0);
      expect(calculateBusPassValue(3, 1)).toBe(2.5);
    });
  });

  describe("for non-bus-pass fund types", () => {
    it("should return the amount as-is (dollar value)", () => {
      expect(calculateBusPassValue(1, 50)).toBe(50); // Walmart $50
      expect(calculateBusPassValue(2, 25)).toBe(25); // Arco $25
      expect(calculateBusPassValue(4, 100)).toBe(100); // Cash $100
      expect(calculateBusPassValue(5, 500)).toBe(500); // Invoice $500
      expect(calculateBusPassValue(6, 75)).toBe(75); // Check $75
    });
  });

  describe("edge cases", () => {
    it("should handle decimal amounts for non-bus-pass types", () => {
      expect(calculateBusPassValue(1, 49.99)).toBe(49.99);
    });

    it("should handle large quantities", () => {
      expect(calculateBusPassValue(7, 1000)).toBe(2500); // 1000 * $2.50
      expect(calculateBusPassValue(8, 1000)).toBe(5000); // 1000 * $5.00
    });
  });
});

describe("Pricing consistency", () => {
  it("should have Sac Bus Pass priced at single fare ($2.50)", () => {
    // Sacramento County bus pass is single fare
    expect(BUS_PASS_CONFIG.SAC.unitValue).toBe(2.5);
    expect(getBusPassUnitValue(BUS_PASS_CONFIG.SAC.fundTypeId)).toBe(2.5);
  });

  it("should have Yolo Bus Pass priced at double fare ($5.00)", () => {
    // Yolo County bus pass is double fare (2 * $2.50)
    expect(BUS_PASS_CONFIG.YOLO.unitValue).toBe(5.0);
    expect(getBusPassUnitValue(BUS_PASS_CONFIG.YOLO.fundTypeId)).toBe(5.0);
    // Verify it's exactly double the Sac price
    expect(BUS_PASS_CONFIG.YOLO.unitValue).toBe(
      BUS_PASS_CONFIG.SAC.unitValue * 2,
    );
  });

  it("should have Legacy Bus Pass priced same as Sac ($2.50)", () => {
    // Legacy bus passes were Sac bus passes before the Yolo/Sac split
    expect(BUS_PASS_CONFIG.LEGACY.unitValue).toBe(
      BUS_PASS_CONFIG.SAC.unitValue,
    );
  });
});
