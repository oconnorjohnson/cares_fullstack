"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { format, subDays, startOfYear, endOfDay } from "date-fns";
import { cn } from "@/server/utils";

interface DateRangeSelectorProps {
  startDate?: Date | null;
  endDate?: Date | null;
  onDateChange: (start: Date | null, end: Date | null) => void;
}

export default function DateRangeSelector({
  startDate,
  endDate,
  onDateChange,
}: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(
    startDate || undefined,
  );
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(
    endDate || undefined,
  );

  // Preset date ranges
  const presets = [
    {
      label: "Last 7 days",
      getValue: () => ({
        start: subDays(new Date(), 7),
        end: new Date(),
      }),
    },
    {
      label: "Last 30 days",
      getValue: () => ({
        start: subDays(new Date(), 30),
        end: new Date(),
      }),
    },
    {
      label: "Last 90 days",
      getValue: () => ({
        start: subDays(new Date(), 90),
        end: new Date(),
      }),
    },
    {
      label: "This Year",
      getValue: () => ({
        start: startOfYear(new Date()),
        end: new Date(),
      }),
    },
  ];

  const handlePresetClick = (preset: { start: Date; end: Date }) => {
    setTempStartDate(preset.start);
    setTempEndDate(preset.end);
    // Auto-apply preset selections
    onDateChange(preset.start, preset.end);
    setIsOpen(false);
  };

  const handleApply = () => {
    onDateChange(tempStartDate || null, tempEndDate || null);
    setIsOpen(false);
  };

  const handleClear = () => {
    setTempStartDate(undefined);
    setTempEndDate(undefined);
    onDateChange(null, null);
    setIsOpen(false);
  };

  const handleCancel = () => {
    // Reset temp dates to current props
    setTempStartDate(startDate || undefined);
    setTempEndDate(endDate || undefined);
    setIsOpen(false);
  };

  // Format display text
  const getDisplayText = () => {
    if (!startDate && !endDate) {
      return "All Time";
    }
    if (startDate && endDate) {
      return `${format(startDate, "MMM dd, yyyy")} - ${format(endDate, "MMM dd, yyyy")}`;
    }
    if (startDate) {
      return `From ${format(startDate, "MMM dd, yyyy")}`;
    }
    if (endDate) {
      return `Until ${format(endDate, "MMM dd, yyyy")}`;
    }
    return "Select dates";
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !startDate && !endDate && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getDisplayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 max-h-[600px] overflow-y-auto"
        align="end"
      >
        <div className="flex">
          {/* Preset buttons column */}
          <div className="flex flex-col gap-2 p-4 border-r min-w-[140px]">
            <div className="text-sm font-semibold mb-2">Quick Select</div>
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => handlePresetClick(preset.getValue())}
              >
                {preset.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start"
              onClick={() => {
                setTempStartDate(undefined);
                setTempEndDate(undefined);
              }}
            >
              All Time
            </Button>
          </div>

          {/* Calendars column */}
          <div className="p-4">
            <div className="flex gap-4">
              {/* Start Date Calendar */}
              <div className="flex flex-col">
                <div className="text-sm font-semibold mb-2">Start Date</div>
                <Calendar
                  mode="single"
                  selected={tempStartDate}
                  onSelect={setTempStartDate}
                  disabled={(date) =>
                    tempEndDate ? date > tempEndDate : date > new Date()
                  }
                  initialFocus
                  captionLayout="dropdown-buttons"
                  fromYear={2020}
                  toYear={new Date().getFullYear()}
                />
              </div>

              {/* End Date Calendar */}
              <div className="flex flex-col">
                <div className="text-sm font-semibold mb-2">End Date</div>
                <Calendar
                  mode="single"
                  selected={tempEndDate}
                  onSelect={setTempEndDate}
                  disabled={(date) =>
                    tempStartDate
                      ? date < tempStartDate || date > new Date()
                      : date > new Date()
                  }
                  captionLayout="dropdown-buttons"
                  fromYear={2020}
                  toYear={new Date().getFullYear()}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between mt-4 pt-4 border-t">
              <div>
                {(tempStartDate || tempEndDate) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleApply}>
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
