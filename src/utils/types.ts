import { ConfirmationResult } from "firebase/auth";
import { ChangeEvent, MouseEvent } from "react";


export interface LabelInputProps {
  type?: string
  placeholder?: string
  name?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  value?: string
  size?: "small" | "medium" | "large"
  showLabel?: boolean
  label?: string; // Optional label prop to override the name prop
  required?: boolean;
  nameAttr?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  pattern?: string;
  title?: string;
  helperText?: string;
  iconPosition?: 'left' | 'right';
  icon?: React.ReactNode;
  error?: string;


}
export interface ButtonProps {
  variant?: "orange" | "transparent-orange" | "white" | "transparent-white"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  name?: string
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

export interface ProductAttribute {
  wattage: string;
  voltage: string;
  batteryLife: string;
  screenSize: string;
  resolution: string;
  connectivity: string;
  color: string;
  weight: string;
  dimensions: string;
  powerSource: string;
  warranty: string;
}
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  priceAtAdd: number;
  rating: number;
  category: string;
  image: string;
  quantity: number;
  cartItemId?: string;


}


export interface Category {
  _id: string;
  name: string;
  allowedAttributes: string[];
}


export interface Product {
  _id?: string;
  id?: string;        // Add this
  name: string;
  category: string;
  brand: string;
  model: string;
  price: number;
  discountPrice: number;
  shortDescription: string;
  description: string;
  imageUrls: string[];
  attributeValues: ProductAttribute;
  createdAt: string;
  updatedAt: string;
  stock: boolean;
  availableStock: number;
  image?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  authChecking: boolean;
  userId: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
  phoneNumber: string | null;
  loading: boolean;
  error: string | null;
  confirmationResult: ConfirmationResult | null;
  isOTPSent: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  country: string;
  phone: string;
  avatar?: string;
  about: string;
  age: number;
  gender: string;
  dob: string;
  address: string;
  latestOrder?: {
    id: string;
    date: string;
    amount: string;
    status: string;
  };


  latestPayment?: {
    id: string;
    date: string;
    amount: string;
    method: string;
  };
}


export interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
  read: boolean;
}

export interface Address {
  id?: string;
  addressLine2?: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone?: string;
  fullName?: string;
}



//Trademark Filing
export interface Service {
  id: string
  price: number
  name: string
  note?: string
  description?: string
  benifits?: string
  deliverables?: string[]
  docRequired?: string[]
  premiumPrice?: number
  governmentCharges?: number
  isActive: boolean
  createdAt: string
  applications?: any[]
  payments?: any[]
  _count?: {
    applications: number
    payments: number
  }
}

//Applications
export interface Application {
  id: string;
  ticketNo: string;
  applicationStatus: string;
  autoCloseAt: string
  userId: string;
  serviceId: string;
  service: {
    name: string;
  };
  createdAt: string;
  objectionReason: string;
  payments: any[];
  user: {
    email: string;
    fullName: string;
    id: string;
    phone: string;
  }
  totalPaid?: number;
  updates: {
    updateCharges: number;
    pendingPayment: number;
    pendingDocs: number;
    createdAt: string;
    UpdateType: string;
  }
}

export interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalApplications: number;
}


export interface ApplicationDetails {
  ticketNo: string;
  applicationStatus: string;
  objectionReason: string | null;
  businessName: string;
  serviceFor: string;
  createdAt: string;
  autoCloseAt: string | null;
  isExpired: boolean | null;
  totalPaid: number;
  paymentCount: number;
  userDetails: UserDetails;
  serviceName: string;
  paymentHistory: PaymentHistory[];
  updateHistory: UpdateHistory[];
}

export interface UserDetails {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  gender: string;
  dob: string | null;
}

export interface PaymentHistory {
  amount: string;
  status: "PENDING" | "FAILED" | "SUCCESS" | string;
  purpose: string;
  paymentType: "INITIAL" | "OBJECTION" | "ADDITIONAL" | "CORRECTION" | string;
  transactionId: string;
  paymentMethod: string;
  paymentDate: string;
}

export interface UpdateHistory {
  message: string;
  newStatus: string;
  prevStatus: string;
  createdAt: string;
  type: string | null;
  UpdateType: string | null;
  updateCharges: number | null;
  pendingPayment: boolean;
  pendingDocs: boolean;
  updater: Updater;
}

export interface Updater {
  fullName: string;
  role: "USER" | "ADMIN" | string;
}

