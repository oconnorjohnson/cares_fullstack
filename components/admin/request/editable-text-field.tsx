"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Pencil, X, Check } from "lucide-react";

interface EditableTextFieldProps {
  initialValue: string;
  requestId: number;
  fieldName: "implementation" | "sustainability";
  onUpdate: (requestId: number, value: string) => Promise<boolean>;
}

export default function EditableTextField({
  initialValue,
  requestId,
  fieldName,
  onUpdate,
}: EditableTextFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (value.trim() === "") {
      toast.error(`${fieldName} cannot be empty`);
      return;
    }

    setIsSaving(true);
    try {
      const success = await onUpdate(requestId, value);
      if (success) {
        toast.success(`${fieldName} updated successfully`);
        setIsEditing(false);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast.error(`Failed to update ${fieldName}`);
      console.error(`Error updating ${fieldName}:`, error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-h-[120px] w-full"
            disabled={isSaving}
          />
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Check className="h-4 w-4 mr-1" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex-1">{value}</div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="ml-2"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
