export type UserRole = "customer" | "admin";

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export interface Vendor {
  _id: string;
  shopName: string;
  ownerName: string;
  address: string;
  phone: string;
  category: string;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  featured?: boolean;
  vendor: Vendor;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  name: string;
}

export interface Order {
  _id: string;
  user: User;
  products: OrderItem[];
  totalPrice: number;
  orderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  address?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalVendors: number;
  totalUsers: number;
  totalOrders: number;
  recentOrders: Order[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
