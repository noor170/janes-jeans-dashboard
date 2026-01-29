export type NotificationType = 'low_stock' | 'new_order' | 'order_status';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  productId?: string;
  orderId?: string;
}
