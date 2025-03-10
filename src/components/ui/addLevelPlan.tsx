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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { departmentOptions } from "@/lib/utils";
import { supabase } from "../../client";
import { v4 as uuidv4 } from "uuid";

interface Classroom {
  department: string;
  tower: string;
  floor: string;
  room_no: string;
}

interface ClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classroom: Classroom) => void;
}
async function handleAddClassroom(classroom: Classroom) {
  try {
    // Ensure department exists before updating
    const { data: department, error: deptError } = await supabase
      .from("departments")
      .select("*")
      .eq("id", classroom.department)
      .single();

    if (deptError || !department) {
      console.error("Department not found:", deptError?.message);
      return;
    }

    // Update the department row with the classroom details
    const { error } = await supabase
      .from("departments")
      .update({
        tower: classroom.tower,
        floor: classroom.floor,
        room_no: classroom.room_no,
      })
      .eq("id", classroom.department);

    if (!error) {
      console.log("Classroom details added to department successfully");
      // You can call a function here to fetch updated data if needed
    } else {
      console.error("Error updating department:", error);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

export const ClassroomModal: React.FC<ClassroomModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [classroom, setClassroom] = useState<Classroom>({
    department: "",
    tower: "",
    floor: "",
    room_no: "",
  });

  const handleSave = () => {
    if (
      !classroom.department.trim() ||
      !classroom.tower.trim() ||
      !classroom.floor.trim() ||
      !classroom.room_no.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }
    handleAddClassroom(classroom);
    onClose(); // Close modal after saving
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 rounded-lg bg-white">
        <DialogHeader>
          <DialogTitle>Add Classroom</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Department */}
          <div>
            <Label>Department</Label>
            <Select
              onValueChange={(value) =>
                setClassroom((prev) => ({ ...prev, department: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Department" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(departmentOptions).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tower */}
          <div>
            <Label>Tower</Label>
            <Input
              type="text"
              value={classroom.tower}
              onChange={(e) =>
                setClassroom((prev) => ({ ...prev, tower: e.target.value }))
              }
              placeholder="Enter Tower"
            />
          </div>

          {/* Floor */}
          <div>
            <Label>Floor</Label>
            <Input
              type="text"
              value={classroom.floor}
              onChange={(e) =>
                setClassroom((prev) => ({ ...prev, floor: e.target.value }))
              }
              placeholder="Enter Floor"
            />
          </div>

          {/* Room No. */}
          <div>
            <Label>Room No.</Label>
            <Input
              type="text"
              value={classroom.room_no}
              onChange={(e) =>
                setClassroom((prev) => ({ ...prev, room_no: e.target.value }))
              }
              placeholder="Enter Room No."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Classroom</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
