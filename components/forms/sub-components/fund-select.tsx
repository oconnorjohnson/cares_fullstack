import React, { useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  LEGACY_BUS_PASS_FUND_TYPE_ID,
  NEW_BUS_PASS_FUND_TYPE_IDS,
} from "@/lib/constants/bus-passes";

interface FundType {
  id: number;
  typeName: string;
  needsReceipt: boolean;
}

interface FundInput {
  fundTypeId: number;
  amount: number;
  needsReceipt: boolean;
}

interface FundSelectProps {
  value: FundInput[];
  onChange: (newValue: FundInput[]) => void;
  fundTypesData: FundType[];
}

export default function FundSelect({
  value,
  onChange,
  fundTypesData,
}: FundSelectProps) {
  // Filter out legacy bus pass (FundType 3) from new requests
  // Users should select Sac Bus Pass (7) or Yolo Bus Pass (8) instead
  const availableFundTypes = useMemo(() => {
    return fundTypesData.filter(
      (fundType) => fundType.id !== LEGACY_BUS_PASS_FUND_TYPE_ID,
    );
  }, [fundTypesData]);

  const handleAddFund = () => {
    if (value.length < 4) {
      const newFunds = [
        ...value,
        { fundTypeId: 0, amount: 0, needsReceipt: false },
      ];
      onChange(newFunds);
    } else {
      toast.error("You cannot add more than 4 funds.");
    }
  };

  const handleRemoveFund = (index: number) => {
    if (value.length > 1) {
      const newFunds = value.filter((_, i) => i !== index);
      onChange(newFunds);
    } else {
      toast.error("Minimum of 1 fund required.");
    }
  };

  const handleFundTypeChange = (index: number, selectedValue: string) => {
    const selectedFundType = fundTypesData.find(
      (fundType) => fundType.id === parseInt(selectedValue, 10),
    );
    const newFunds = value.map((fund, idx) => {
      if (idx === index) {
        return {
          ...fund,
          fundTypeId: parseInt(selectedValue, 10),
          needsReceipt: selectedFundType?.needsReceipt ?? false,
        };
      }
      return fund;
    });
    onChange(newFunds);
  };

  const handleAmountChange = (index: number, newValue: string) => {
    const newFunds = value.map((fund, idx) => {
      if (idx === index) {
        return { ...fund, amount: parseFloat(newValue) || 0 };
      }
      return fund;
    });
    onChange(newFunds);
  };

  const validateAmount = (index: number) => {
    const fund = value[index];
    // Validate bus pass amounts (legacy type 3 and new types 7, 8) must be multiples of 10
    const isBusPass =
      fund.fundTypeId === LEGACY_BUS_PASS_FUND_TYPE_ID ||
      (NEW_BUS_PASS_FUND_TYPE_IDS as readonly number[]).includes(
        fund.fundTypeId,
      );

    if (isBusPass && fund.amount % 10 !== 0) {
      toast.error("Bus Pass amount must be a multiple of 10.");
      handleAmountChange(index, "0");
    }
  };

  return (
    <>
      <div className="flex flex-col pb-1">
        <div className="py-1" />
        <div className="flex flex-row">
          <Button
            type="button"
            size="sm"
            className="text-xs"
            onClick={handleAddFund}
          >
            Add Fund
          </Button>
        </div>
        <div className="py-2" />
        <p className="text-xs text-muted-foreground">
          <strong>Bus Pass Note:</strong> Sac Bus Passes are single fare
          ($2.50/each). Yolo Bus Passes are double fare ($5.00/each). Please
          account for this when requesting bus passes.
        </p>
        <div className="py-2" />
        <div className="space-y-2">
          {value.map((fund, index) => (
            <div key={index} className="flex flex-row items-center gap-2">
              <Select
                value={(fund.fundTypeId ?? "").toString()}
                onValueChange={(selectedValue) =>
                  handleFundTypeChange(index, selectedValue)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Fund Type" />
                </SelectTrigger>
                <SelectContent>
                  {availableFundTypes.map((fundType) => (
                    <SelectItem
                      key={fundType.id}
                      value={fundType.id.toString()}
                    >
                      {fundType.typeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={fund.amount.toString()}
                onChange={(e) => handleAmountChange(index, e.target.value)}
                onBlur={() => validateAmount(index)}
              />
              <Button
                variant="destructive"
                className="text-black"
                type="button"
                size="sm"
                onClick={() => handleRemoveFund(index)}
              >
                <TrashIcon className="" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
