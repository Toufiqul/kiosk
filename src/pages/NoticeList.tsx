import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "../client";

function NoticeList() {
  const [noticeData, setNoticeData] = useState<any[]>([]);

  async function fetchAllNoticeData() {
    const { data, error } = await supabase.from("notices").select();
    if (error) {
      console.error("Error fetching data:", error.message);
      return;
    }
    setNoticeData(data);
  }
  useEffect(() => {
    fetchAllNoticeData();
    console.log(noticeData);
  }, []);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Notice List</h1>
      {noticeData.length > 0 ? (
        <div className="space-y-4">
          {noticeData.map((notice) => (
            <div
              key={notice.id}
              className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {notice.title}
              </h2>
              <p className="text-gray-600 mt-2">{notice.content}</p>
              <p className="text-sm text-gray-500 mt-4">
                <strong>Department ID:</strong> {notice.department_id}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Published By:</strong> {notice.published_by}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No notices available.</p>
      )}
    </div>
  );
}

export default NoticeList;
