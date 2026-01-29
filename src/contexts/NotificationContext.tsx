import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Notification, NotificationType } from '@/types/notifications';
import { mockProducts, mockOrders } from '@/data/mockData';
import { toast } from 'sonner';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for new notification
    const toastType = notification.type === 'low_stock' ? 'warning' : 'info';
    if (toastType === 'warning') {
      toast.warning(notification.title, { description: notification.message });
    } else {
      toast.info(notification.title, { description: notification.message });
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Generate initial notifications from mock data
  useEffect(() => {
    const initialNotifications: Notification[] = [];

    // Low stock alerts
    mockProducts
      .filter(p => p.stockLevel < 10)
      .slice(0, 5)
      .forEach(product => {
        initialNotifications.push({
          id: `low-stock-${product.id}`,
          type: 'low_stock',
          title: 'Low Stock Alert',
          message: `${product.name} (${product.size}) has only ${product.stockLevel} units left`,
          timestamp: new Date(Date.now() - Math.random() * 86400000),
          read: false,
          productId: product.id,
        });
      });

    // Recent orders
    mockOrders
      .slice(0, 3)
      .forEach(order => {
        initialNotifications.push({
          id: `order-${order.id}`,
          type: 'new_order',
          title: 'New Order',
          message: `Order #${order.id} from ${order.customerName} - $${order.totalAmount.toFixed(2)}`,
          timestamp: new Date(order.orderDate),
          read: false,
          orderId: order.id,
        });
      });

    // Sort by timestamp descending
    initialNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setNotifications(initialNotifications);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
