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

export const ClassroomModal: React.FC<ClassroomModalProps> = ({
  isOpen,
  onClose,
  onSave,
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
    onSave(classroom);
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
            <Input
              type="text"
              value={classroom.department}
              onChange={(e) =>
                setClassroom((prev) => ({
                  ...prev,
                  department: e.target.value,
                }))
              }
              placeholder="Enter Department"
            />
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
