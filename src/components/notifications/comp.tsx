import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface Notification {
  id: number;
  type: "pending" | "approved" | "rejected";
  user: string;
  date: string;
}

// Add props interface
interface NotificationCompProps {
  limit?: number; // optional, number of notifications to show
}

const NotificationComp = ({ limit }: NotificationCompProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const dummyData: Notification[] = [
      { id: 1, type: "pending", user: "John Mwansa", date: "2025-09-11" },
      { id: 2, type: "approved", user: "Admin", date: "2025-09-10" },
      { id: 3, type: "rejected", user: "Principal", date: "2025-09-09" },
      { id: 4, type: "pending", user: "Alice", date: "2025-09-08" },
      { id: 5, type: "approved", user: "James", date: "2025-09-07" },
      { id: 6, type: "rejected", user: "Mary", date: "2025-09-06" },
      { id: 7, type: "pending", user: "Teacher", date: "2025-09-05" },
      { id: 8, type: "approved", user: "Headmaster", date: "2025-09-04" },
      { id: 9, type: "rejected", user: "Deputy", date: "2025-09-03" },
      { id: 10, type: "pending", user: "System", date: "2025-09-02" },
    ];
    setNotifications(dummyData);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-400" />;
      case "approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getMessage = (notif: Notification) => {
    switch (notif.type) {
      case "pending":
        return `${notif.user} has submitted a transfer request.`;
      case "approved":
        return `${notif.user} has approved your transfer request.`;
      case "rejected":
        return `${notif.user} has rejected your transfer request.`;
      default:
        return "";
    }
  };

  const getBubbleStyle = (type: string) => {
    switch (type) {
      case "pending":
        return "bg-yellow-100 text-yellow-900";
      case "approved":
        return "bg-green-100 text-green-900";
      case "rejected":
        return "bg-red-100 text-red-900";
      default:
        return "bg-gray-100 text-gray-900";
    }
  };

  // Slice notifications if limit is provided
  const displayNotifications = limit ? notifications.slice(0, limit) : notifications;

  return (
    <div className="p-4 flex flex-col space-y-4">
      {displayNotifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        displayNotifications.map((notif) => (
          <div
            key={notif.id}
            className={`flex ${
              notif.type === "approved" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-2xl shadow-md flex items-start space-x-2 ${getBubbleStyle(
                notif.type
              )}`}
            >
              <div className="mt-1">{getIcon(notif.type)}</div>
              <div>
                <p className="text-sm">{getMessage(notif)}</p>
                <p className="text-xs text-gray-500">{notif.date}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationComp;
