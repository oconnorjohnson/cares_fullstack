-- Migration: Add Sac Bus Pass and Yolo Bus Pass FundTypes
-- Date: 2025-12-23
-- Description: Creates two new FundTypes for Sacramento County bus passes ($2.50 single fare)
--              and Yolo County bus passes ($5.00 double fare). Legacy FundType 3 (Bus Pass) 
--              is preserved for historical data.

-- Insert Sac Bus Pass FundType (expected id=7)
INSERT INTO "FundType" ("typeName", "needsReceipt")
VALUES ('Sac Bus Pass', false);

-- Insert Yolo Bus Pass FundType (expected id=8)
INSERT INTO "FundType" ("typeName", "needsReceipt")
VALUES ('Yolo Bus Pass', false);

-- Note: After running this migration, verify the IDs assigned match expectations (7 and 8).
-- If IDs differ, update server/constants/bus-passes.ts accordingly.

