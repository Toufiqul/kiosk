interface Department {
  id: string;
  name: string;
  code: string;
  created_at: string;
  floor: string | null;
  head_id: string | null;
  location: string | null;
  room_no: string | null;
  tower: string | null;
}
interface ModalProps {
  department: Department;
  onClose: () => void;
}

const DepartmentModal: React.FC<ModalProps> = ({ department, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {department.name}
        </h2>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Code:</strong> {department.code}
            <p>
              <strong>Tower:</strong> {department.tower ?? "Not Assigned"}
            </p>
          </p>
          <p>
            <strong>Floor:</strong> {department.floor ?? "Not Assigned"}
          </p>
          <p>
            <strong>Room No:</strong> {department.room_no ?? "Not Assigned"}
          </p>
        </div>
        <button
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DepartmentModal;
