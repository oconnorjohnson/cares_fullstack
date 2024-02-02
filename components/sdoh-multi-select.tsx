"use client";
import React from "react";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

interface MultipleSelectorControlledProps {
  value: Option[]; // This remains the same, as the component receives Option[] for value
  onChange: (selectedValues: Option[]) => void; // Correctly typed to match the implementation
}

const OPTIONS: Option[] = [
  { label: "Education Access", value: "Education Access" },
  { label: "Health Care", value: "Health Care" },
  { label: "Neighborhood Safety", value: "Neighborhood Safety" },
  { label: "Social & Community", value: "Social & Community" },
  { label: "Economic Instability", value: "Economic Instability" },
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
