/**
 * Dashboard Service Layer
 * Handles dashboard stats, sales data, and category distribution.
 */

import { DashboardStats, GenderFilter } from '@/types';
import { fetchProducts } from './product.service';
import { fetchOrders } from './order.service';

export const fetchDashboardStats = async (gender: GenderFilter): Promise<DashboardStats> => {
  const [products, orders] = await Promise.all([
    fetchProducts(gender),
    fetchOrders(),
  ]);

  const relevantOrders = gender === 'All'
    ? orders
    : orders.filter(order => order.items.some(item => {
        const product = products.find(p => p.id === item.productId);
        return product?.gender === gender;
      }));

  const totalSales = relevantOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const activeOrders = relevantOrders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const lowStockAlerts = products.filter(p => p.stockLevel < 10).length;
  const totalCustomers = new Set(relevantOrders.map(o => o.customerEmail)).size;

  return { totalSales, activeOrders, lowStockAlerts, totalCustomers };
};

export const fetchSalesData = async (gender: GenderFilter) => {
  const orders = await fetchOrders();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthData: Record<string, { men: number; women: number }> = {};

  monthNames.forEach(m => { monthData[m] = { men: 0, women: 0 }; });

  orders.forEach(order => {
    const date = new Date(order.orderDate);
    const month = monthNames[date.getMonth()];
    if (month) {
      monthData[month].men += order.totalAmount / 2;
      monthData[month].women += order.totalAmount / 2;
    }
  });

  return monthNames.map(month => ({
    month,
    men: Math.round(monthData[month].men),
    women: Math.round(monthData[month].women),
    total: Math.round(monthData[month].men + monthData[month].women),
  }));
};

export const fetchCategoryDistribution = async (gender: GenderFilter) => {
  const products = await fetchProducts(gender);
  const fitCounts: Record<string, number> = {};
  products.forEach(p => {
    fitCounts[p.fit] = (fitCounts[p.fit] || 0) + 1;
  });

  const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  return Object.entries(fitCounts).map(([name, value], i) => ({
    name,
    value,
    fill: colors[i % colors.length],
  }));
};
