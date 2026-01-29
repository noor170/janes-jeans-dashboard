export type Language = 'en' | 'bn';

export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    orders: 'Orders',
    settings: 'Settings',
    analytics: 'Analytics',
    
    // Header
    janesJeans: "Jane's Jeans",
    adminDashboard: 'Admin Dashboard',
    
    // Gender Toggle
    men: 'Men',
    women: 'Women',
    all: 'All',
    filterBy: 'Filter by',
    
    // Stats Cards
    totalSales: 'Total Sales',
    activeOrders: 'Active Orders',
    lowStockAlerts: 'Low Stock Alerts',
    totalCustomers: 'Total Customers',
    
    // Charts
    salesAnalytics: 'Sales Analytics',
    categoryDistribution: 'Category Distribution',
    monthlySales: 'Monthly Sales Trend',
    
    // Inventory Table
    productName: 'Product Name',
    gender: 'Gender',
    fit: 'Fit',
    size: 'Size',
    wash: 'Wash',
    price: 'Price',
    stockLevel: 'Stock Level',
    lowStock: 'Low Stock',
    inStock: 'In Stock',
    products: 'Products',
    
    // Orders
    orderId: 'Order ID',
    customer: 'Customer',
    items: 'Items',
    status: 'Status',
    orderDate: 'Order Date',
    total: 'Total',
    actions: 'Actions',
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    newOrder: 'New Order',
    editOrder: 'Edit Order',
    deleteOrder: 'Delete Order',
    viewDetails: 'View Details',
    updateStatus: 'Update Status',
    
    // Forms
    customerName: 'Customer Name',
    customerEmail: 'Customer Email',
    shippingAddress: 'Shipping Address',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Confirm',
    
    // Settings
    language: 'Language',
    english: 'English',
    bengali: 'বাংলা',
    preferences: 'Preferences',
    languageSettings: 'Language Settings',
    
    // Theme
    lightMode: 'Light',
    darkMode: 'Dark',
    systemMode: 'System',
    theme: 'Theme',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    refresh: 'Refresh',
    loading: 'Loading...',
    noData: 'No data available',
    notes: 'Notes',
  },
  bn: {
    // Navigation
    dashboard: 'ড্যাশবোর্ড',
    inventory: 'ইনভেন্টরি',
    orders: 'অর্ডার',
    settings: 'সেটিংস',
    analytics: 'বিশ্লেষণ',
    
    // Header
    janesJeans: "জেন'স জিন্স",
    adminDashboard: 'অ্যাডমিন ড্যাশবোর্ড',
    
    // Gender Toggle
    men: 'পুরুষ',
    women: 'মহিলা',
    all: 'সব',
    filterBy: 'ফিল্টার',
    
    // Stats Cards
    totalSales: 'মোট বিক্রয়',
    activeOrders: 'সক্রিয় অর্ডার',
    lowStockAlerts: 'কম স্টক সতর্কতা',
    totalCustomers: 'মোট গ্রাহক',
    
    // Charts
    salesAnalytics: 'বিক্রয় বিশ্লেষণ',
    categoryDistribution: 'বিভাগ বন্টন',
    monthlySales: 'মাসিক বিক্রয় প্রবণতা',
    
    // Inventory Table
    productName: 'পণ্যের নাম',
    gender: 'লিঙ্গ',
    fit: 'ফিট',
    size: 'সাইজ',
    wash: 'ওয়াশ',
    price: 'মূল্য',
    stockLevel: 'স্টক স্তর',
    lowStock: 'কম স্টক',
    inStock: 'স্টকে আছে',
    products: 'পণ্য',
    
    // Orders
    orderId: 'অর্ডার আইডি',
    customer: 'গ্রাহক',
    items: 'আইটেম',
    status: 'স্থিতি',
    orderDate: 'অর্ডারের তারিখ',
    total: 'মোট',
    actions: 'অ্যাকশন',
    pending: 'মুলতুবি',
    processing: 'প্রসেসিং',
    shipped: 'শিপড',
    delivered: 'ডেলিভার্ড',
    newOrder: 'নতুন অর্ডার',
    editOrder: 'অর্ডার সম্পাদনা',
    deleteOrder: 'অর্ডার মুছুন',
    viewDetails: 'বিস্তারিত দেখুন',
    updateStatus: 'স্থিতি আপডেট',
    
    // Forms
    customerName: 'গ্রাহকের নাম',
    customerEmail: 'গ্রাহকের ইমেইল',
    shippingAddress: 'শিপিং ঠিকানা',
    save: 'সংরক্ষণ',
    cancel: 'বাতিল',
    delete: 'মুছুন',
    confirm: 'নিশ্চিত',
    
    // Settings
    language: 'ভাষা',
    english: 'English',
    bengali: 'বাংলা',
    preferences: 'পছন্দসমূহ',
    languageSettings: 'ভাষা সেটিংস',
    
    // Theme
    lightMode: 'হালকা',
    darkMode: 'অন্ধকার',
    systemMode: 'সিস্টেম',
    theme: 'থিম',
    
    // Common
    search: 'অনুসন্ধান',
    filter: 'ফিল্টার',
    export: 'এক্সপোর্ট',
    refresh: 'রিফ্রেশ',
    loading: 'লোড হচ্ছে...',
    noData: 'কোন ডেটা নেই',
    notes: 'নোট',
  },
};

export type TranslationKey = keyof typeof translations.en;
