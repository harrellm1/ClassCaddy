import { useState, useEffect } from "react";
import io from "socket.io-client";
import { api } from "~/trpc/react";
import { Notification } from "@prisma/client";

const NotificationList = () => {
  const { data: notifications, refetch } = api.notification.getNotifications.useQuery();
  const markAsRead = api.notification.markAsRead.useMutation();
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    const socketInstance = io();
    setSocket(socketInstance);

    socketInstance.on("new-notification", (newNotification: Notification) => {
      refetch();
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [refetch]);

  const handleMarkAsRead = (id: number) => {
    markAsRead.mutate({ notificationId: id }, { onSuccess: () => refetch() });
  };

  if (!notifications) return <p>Loading...</p>;

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notif: Notification) => (
          <li key={notif.id}>
            <p>{notif.content}</p>
            {!notif.read && (
              <button onClick={() => handleMarkAsRead(notif.id)}>Mark as Read</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
