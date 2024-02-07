"use client";
import React from "react";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

interface MultipleSelectorControlledProps {
  value: Option[];
  onChange: (selectedValues: Option[]) => void;
}

const OPTIONS: Option[] = [
  { label: "Walmart Gift Card", value: "Walmart Gift Card" },
  { label: "Arco Gift Card", value: "Arco Gift Card" },
  { label: "Bus Passes", value: "Bus Passes" },
  { label: "Invoice", value: "Invoice" },
  { label: "Check", value: "Check" },
  { label: "Cash", value: "Cash" },
];

const MultipleSelectorControlled: React.FC<MultipleSelectorControlledProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (selectedOptions: Option[]) => {
    onChange(selectedOptions); // Pass Option[] directly to parent component
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <MultipleSelector
        value={value}
        onChange={handleChange}
        defaultOptions={OPTIONS}
        placeholder="Select all that apply"
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            No results found.
          </p>
        }
      />
    </div>
  );
};

export default MultipleSelectorControlled;
