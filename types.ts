export type Role = 'FactoryOwner' | 'Trucker';

export interface User {
  id: string;
  role: Role;
  name: string;
  phone: string;
  companyName?: string;
}

export interface Truck {
  id: string;
  driverId: string; // Link to user
  driverName: string;
  vehicleModel: string;
  origin: string;
  destination: string;
  departureDate: string;
  capacityTotal: number; // in tons
  capacityFilled: number; // in tons
  pricePerTon: number;
  isGroupShippingAllowed: boolean;
  status: 'Active' | 'Partial' | 'Full' | 'InTransit' | 'Completed';
  rating: number;
  driverDetails?: {
    age: number;
    dl: string;
  };
}

export interface LoadRequest {
  id: string;
  ownerId: string;
  companyName: string;
  goodsType: string;
  weight: number; // in tons
  origin: string;
  destination: string;
  targetPrice: number;
  status: 'Pending' | 'Booked' | 'Completed';
  createdAt: string;
}

export type BookingStatus = 'Pending' | 'Accepted' | 'Pickup' | 'InTransit' | 'Delivered' | 'Revoked';

export interface Booking {
  id: string;
  truckId: string;
  loadRequestId: string;
  factoryOwnerId: string;
  truckerId: string;
  status: BookingStatus;
  weight: number;
  price: number;
  otp?: string;
  acceptedAt?: string;
  pickupAt?: string;
  deliveredAt?: string;
  sosActive?: boolean;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'BookingRequest' | 'BookingAccepted' | 'TripUpdate' | 'SOS';
  message: string;
  read: boolean;
  timestamp: string;
  link?: string;
}
