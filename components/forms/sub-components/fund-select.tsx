import React from "react";
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

  // const handleAmountChange = (index: number, newValue: string) => {
  //   const newAmount = parseFloat(newValue);
  //   const fund = value[index];
  //   const fundType = fundTypesData.find((ft) => ft.id === fund.fundTypeId);

  //   if (fundType && fundType.id === 3) {
  //     if (newAmount % 10 !== 0) {
  //       toast.error("Bus Pass amount must be a multiple of 10.");
  //       return;
  //     }
  //   }

  //   const newFunds = value.map((fund, idx) => {
  //     if (idx === index) {
  //       return { ...fund, aount: newAmount };
  //     }
  //     return fund;
  //   });
  //   onChange(newFunds);
  // };

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
    const fundType = fundTypesData.find((ft) => ft.id === fund.fundTypeId);
    if (fundType && fundType.id === 3 && fund.amount % 10 !== 0) {
      toast.error("Bus Pass amount must be a multiple of 10.");
      handleAmountChange(index, "0"); // Reset to 0 or the nearest valid multiple
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
                  {fundTypesData.map((fundType) => (
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
