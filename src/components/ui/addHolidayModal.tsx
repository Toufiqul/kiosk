import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar"; // Assuming you have a Calendar component
import { format } from "date-fns";

interface Holiday {
  start_date: string | null;
  end_date: string | null;
  occasion: string;
}

interface HolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (holiday: Holiday) => void;
}

export const HolidayModal: React.FC<HolidayModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [holiday, setHoliday] = useState<Holiday>({
    start_date: null,
    end_date: null,
    occasion: "",
  });

  const handleSave = () => {
    if (!holiday.start_date || !holiday.end_date || !holiday.occasion.trim()) {
      alert("Please fill all fields.");
      return;
    }
    onSave(holiday);
    onClose(); // Close modal after saving
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 rounded-lg bg-white">
        <DialogHeader>
          <DialogTitle>Add Holiday</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Start Date */}
          <div>
            <Label>Start Date</Label>
            <Calendar
              selected={
                holiday.start_date ? new Date(holiday.start_date) : undefined
              }
              onSelect={(date) =>
                setHoliday((prev) => ({
                  ...prev,
                  start_date: date ? format(date, "yyyy-MM-dd") : null,
                }))
              }
            />
          </div>

          {/* End Date */}
          <div>
            <Label>End Date</Label>
            <Calendar
              selected={
                holiday.end_date ? new Date(holiday.end_date) : undefined
              }
              onSelect={(date) =>
                setHoliday((prev) => ({
                  ...prev,
                  end_date: date ? format(date, "yyyy-MM-dd") : null,
                }))
              }
            />
          </div>

          {/* Occasion */}
          <div>
            <Label>Occasion</Label>
            <Input
              type="text"
              value={holiday.occasion}
              onChange={(e) =>
                setHoliday((prev) => ({ ...prev, occasion: e.target.value }))
              }
              placeholder="Enter occasion (e.g. New Year, Independence Day)"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Holiday</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
