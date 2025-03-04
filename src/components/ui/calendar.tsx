import * as React from "react";
import { useEffect, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { supabase } from "../../client";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; // Import modal components

export type CalendarProps = React.ComponentProps<typeof DayPicker>;
interface Holiday {
  id: string;
  start_date: string | null;
  end_date: string | null;
  occasion: string;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [holidayData, setHolidayData] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const fetchAllData = async () => {
    await Promise.all([fetchAllHolidayData()]);
  };

  const fetchAllHolidayData = async () => {
    const { data, error } = await supabase.from("holidays").select("*");
    if (!error && data) setHolidayData(data);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Convert holiday start dates into Date objects
  const holidayDates = holidayData
    .map((holiday) =>
      holiday.start_date ? new Date(holiday.start_date) : null
    )
    .filter(Boolean) as Date[];
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);

    // Find if it's a holiday
    const holiday = holidayData.find(
      (h) =>
        h.start_date &&
        format(new Date(h.start_date), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
    );

    if (holiday) {
      setSelectedHoliday(holiday);
    } else {
      setSelectedHoliday(null);
    }
  };
  return (
    <>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months:
            "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: cn(
            "h-9 w-9 text-center text-sm p-0 relative",
            "[&:has([aria-selected].day-range-end)]:rounded-r-md",
            "[&:has([aria-selected].day-outside)]:bg-accent/50",
            "[&:has([aria-selected])]:bg-accent",
            "first:[&:has([aria-selected])]:rounded-l-md",
            "last:[&:has([aria-selected])]:rounded-r-md",
            "focus-within:relative focus-within:z-20"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        modifiers={{
          weekend: (date) => {
            const day = date.getDay();
            return day === 5 || day === 6; // Friday (5) & Saturday (6)
          },
          holiday: (date) =>
            holidayDates.some(
              (holidayDate) =>
                format(holidayDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
            ),
        }}
        onDayClick={handleDateClick} // Handle date clicks
        modifiersClassNames={{
          weekend: "bg-red-200 text-red-800", // Weekend styling
          holiday: "bg-green-300 text-green-900 font-bold", // Holiday styling
        }}
        components={{
          IconLeft: ({ className, ...props }) => (
            <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
          ),
          IconRight: ({ className, ...props }) => (
            <ChevronRight className={cn("h-4 w-4", className)} {...props} />
          ),
        }}
        {...props}
      />
      {selectedHoliday && (
        <Dialog
          open={!!selectedHoliday}
          onOpenChange={() => setSelectedHoliday(null)}
        >
          <DialogContent className="w-60 h-60 bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center space-y-4">
            <DialogTitle className="text-lg font-semibold text-gray-900 text-center">
              Occassion: {selectedHoliday.occasion}
            </DialogTitle>
            <p className="text-gray-800 text-m text-center">
              Date:{" "}
              {format(new Date(selectedHoliday.start_date!), "dd MMMM yyyy")}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
