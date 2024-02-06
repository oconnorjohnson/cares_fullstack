"use client";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/app/_trpc/client";

interface FundType {
  id: number;
  typeName: string;
}

interface FundInput {
  fundTypeId: number;
  amount: string;
}

interface SelectedFunds {
  [key: number]: { selected: boolean; amount: number };
}

export default function FundSelect() {
  const [fundTypesData, setFundTypesData] = useState<FundType[]>([]);
  const { data: fundTypes, isLoading: isLoadingFundTypes } =
    trpc.getFundTypes.useQuery();
  useEffect(() => {
    if (fundTypes) {
      setFundTypesData(fundTypes);
    }
  }, [fundTypes]);

  const [funds, setFunds] = useState<FundInput[]>([
    { fundTypeId: 0, amount: "" },
  ]);

  const handleAddFund = () => {
    setFunds([...funds, { fundTypeId: 0, amount: "" }]);
  };

  const handleRemoveFund = (index: number) => {
    if (funds.length > 1) {
      const newFunds = funds.filter((_, i) => i !== index);
      setFunds(newFunds);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row pb-2">
          <Button onClick={handleAddFund}>Add Fund</Button>
        </div>
        <div className="space-y-2">
          {funds.map((fund, index) => (
            <div key={index} className="flex flex-row items-center gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Fund Type" />
                </SelectTrigger>
                <SelectContent>
                  {!isLoadingFundTypes &&
                    fundTypesData.map((fundType) => (
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
                value={fund.amount}
                onChange={(e) => {
                  const newFunds = [...funds];
                  newFunds[index].amount = e.target.value;
                  setFunds(newFunds);
                }}
              />
              <Button onClick={() => handleRemoveFund(index)}>Remove</Button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
