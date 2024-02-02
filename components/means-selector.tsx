"use client";
import React from "react";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

const OPTIONS: Option[] = [
  { label: "Walmart Gift Card", value: "Walmart Gift Card" },
  { label: "Arco Gift Card", value: "Arco Gift Card" },
  { label: "Bus Passes", value: "Bus Passes" },
  { label: "Invoice", value: "Invoice" },
  { label: "Check", value: "Check" },
  { label: "Cash", value: "Cash" },
];

const MultipleSelectorControlled = ({ value, onChange }) => {
  const handleChange = (selectedOptions: Option[]) => {
    // map selected options to their string values
    const valueArray = selectedOptions.map((option) => option.value);
    onChange(valueArray); //pas array of strings to parent component
  };

  return (
    <div className="flex w-full flex-col gap-5">
      {/* <p className="text-primary">
        Your selection: {value.map((val) => val.label).join(", ")}
      </p> */}
      <MultipleSelector
        value={value}
        onChange={handleChange}
        defaultOptions={OPTIONS}
        placeholder="Select all that apply"
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
      />
    </div>
  );
};

export default MultipleSelectorControlled;
