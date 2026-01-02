import { Truck, LoadRequest, User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: "USR-FO-001",
    role: "FactoryOwner",
    name: "Rajesh Gupta",
    companyName: "Vidarbha Textiles",
    phone: "91-9876543210"
  },
  {
    id: "USR-TRK-001",
    role: "Trucker",
    name: "Rajesh Yadav",
    phone: "91-9988776655"
  }
];

export const MOCK_TRUCKS: Truck[] = [
  {
    id: "TRK-001",
    driverId: "USR-TRK-001",
    driverName: "Rajesh Yadav",
    vehicleModel: "Tata 407 (Light Commercial)",
    origin: "Butibori MIDC",
    destination: "Pune (Chakan)",
    departureDate: "2024-10-25",
    capacityTotal: 4.0,
    capacityFilled: 0.0,
    pricePerTon: 3500,
    isGroupShippingAllowed: true,
    status: "Active",
    rating: 4.8,
    driverDetails: {
      age: 38,
      dl: "MH-20-PL-1234"
    }
  },
  {
    id: "TRK-002",
    driverId: "USR-TRK-002",
    driverName: "Amit Singh",
    vehicleModel: "Eicher Pro 1049",
    origin: "Kalmeshwar",
    destination: "Mumbai (Bhiwandi)",
    departureDate: "2024-10-26",
    capacityTotal: 7.0,
    capacityFilled: 3.5,
    pricePerTon: 4200,
    isGroupShippingAllowed: true,
    status: "Partial",
    rating: 4.5
  },
  {
    id: "TRK-003",
    driverId: "USR-TRK-003",
    driverName: "Suresh Patil",
    vehicleModel: "Ashok Leyland Boss",
    origin: "Hingna MIDC",
    destination: "Hyderabad",
    departureDate: "2024-10-25",
    capacityTotal: 10.0,
    capacityFilled: 9.0,
    pricePerTon: 3800,
    isGroupShippingAllowed: false,
    status: "Full",
    rating: 4.2
  },
  {
    id: "TRK-004",
    driverId: "USR-TRK-004",
    driverName: "Vinod Mehra",
    vehicleModel: "Mahindra Bolero Pickup",
    origin: "Wardha",
    destination: "Nagpur City",
    departureDate: "2024-10-25",
    capacityTotal: 1.5,
    capacityFilled: 0.0,
    pricePerTon: 1200,
    isGroupShippingAllowed: true,
    status: "Active",
    rating: 4.9
  }
];

export const MOCK_LOADS: LoadRequest[] = [
  {
    id: "REQ-101",
    ownerId: "USR-FO-001",
    companyName: "Vidarbha Textiles",
    goodsType: "Cotton Bales",
    weight: 1.2,
    origin: "Butibori MIDC",
    destination: "Pune (Chakan)",
    targetPrice: 4000,
    status: "Pending",
    createdAt: "2024-10-24T10:00:00Z"
  }
];

export const LOCATIONS = [
  "Butibori MIDC",
  "Hingna MIDC",
  "Kalmeshwar",
  "Wardha",
  "Bhandara",
  "Nagpur City",
  "Pune (Chakan)",
  "Mumbai (Bhiwandi)",
  "Hyderabad",
  "Raipur"
];
