"use client";
import React from "react";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

// Adjusted interface to correctly type the onChange handler
interface MultipleSelectorControlledProps {
  value: Option[]; // This remains the same, as the component receives Option[] for value
  onChange: (selectedValues: Option[]) => void; // Correctly typed to match the implementation
}
const OPTIONS: Option[] = [
  { label: "Food", value: "Food" },
  { label: "Clothing", value: "Clothing" },
  { label: "Hygiene Items", value: "Hygiene Items" },
  { label: "Basic Necessities", value: "Basic Necessities" },
  { label: "Medication Co-Pay", value: "Medication Co-Pay" },
  { label: "Durable Medical Equipment", value: "Durable Medical Equipment" },
  { label: "Gas", value: "Gas" },
  { label: "Rideshare", value: "Rideshare" },
  { label: "Busspass", value: "Busspass" },
  { label: "Specialty Medical Supplies", value: "Specialty Medical Supplies" },
  { label: "Rental Assistance", value: "Rental Assistance" },
  { label: "Utilities Assistance", value: "Utilities Assistance" },
];
const MultipleSelectorControlled: React.FC<MultipleSelectorControlledProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (selectedOptions: Option[]) => {
    // Map selected options to their string values
    const valueArray = selectedOptions.map((option) => option.value);
    onChange(selectedOptions); // Pass array of strings to parent component
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <MultipleSelector
        value={value}
        onChange={handleChange}
        defaultOptions={OPTIONS} // Ensure OPTIONS is defined and accessible in this scope
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
