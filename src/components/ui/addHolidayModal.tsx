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
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

interface Holiday {
  start_date: Date | null;
  end_date: Date | null;
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

    onSave({
      ...holiday,
      start_date: holiday.start_date,
      end_date: holiday.end_date,
    });
    
    setHoliday({ start_date: null, end_date: null, occasion: "" }); // Reset fields
    onClose();
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !holiday.start_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {holiday.start_date
                    ? format(holiday.start_date, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={holiday.start_date || undefined}
                  onSelect={(date) =>
                    setHoliday((prev) => ({ ...prev, start_date: date }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !holiday.end_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {holiday.end_date
                    ? format(holiday.end_date, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={holiday.end_date || undefined}
                  onSelect={(date) =>
                    setHoliday((prev) => ({ ...prev, end_date: date }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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

export default HolidayModal;