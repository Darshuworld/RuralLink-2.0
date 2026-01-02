import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Truck, LoadRequest, Booking, User, ChatMessage, Notification, BookingStatus } from '../types';
import { MOCK_TRUCKS, MOCK_LOADS, MOCK_USERS } from '../constants';

interface StoreContextType {
  currentUser: User | null;
  trucks: Truck[];
  loads: LoadRequest[];
  bookings: Booking[];
  notifications: Notification[];
  messages: ChatMessage[];
  login: (role: string) => void;
  logout: () => void;
  createLoad: (load: Omit<LoadRequest, 'id' | 'status' | 'createdAt' | 'ownerId'>) => void;
  createBooking: (truckId: string, loadId: string) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  sendMessage: (bookingId: string, text: string) => void;
  triggerSOS: (bookingId: string) => void;
  markNotificationRead: (id: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  // State initialization with localStorage fallback or mock data
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [trucks, setTrucks] = useState<Truck[]>(() => {
    const saved = localStorage.getItem('trucks');
    return saved ? JSON.parse(saved) : MOCK_TRUCKS;
  });

  const [loads, setLoads] = useState<LoadRequest[]>(() => {
    const saved = localStorage.getItem('loads');
    return saved ? JSON.parse(saved) : MOCK_LOADS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Persistence effects
  useEffect(() => localStorage.setItem('currentUser', JSON.stringify(currentUser)), [currentUser]);
  useEffect(() => localStorage.setItem('trucks', JSON.stringify(trucks)), [trucks]);
  useEffect(() => localStorage.setItem('loads', JSON.stringify(loads)), [loads]);
  useEffect(() => localStorage.setItem('bookings', JSON.stringify(bookings)), [bookings]);
  useEffect(() => localStorage.setItem('messages', JSON.stringify(messages)), [messages]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Actions
  const login = (role: string) => {
    // Simple mock login based on role
    const user = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const createLoad = (data: Omit<LoadRequest, 'id' | 'status' | 'createdAt' | 'ownerId'>) => {
    if (!currentUser) return;
    const newLoad: LoadRequest = {
      ...data,
      id: `REQ-${Date.now()}`,
      ownerId: currentUser.id,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setLoads(prev => [newLoad, ...prev]);
  };

  const createBooking = (truckId: string, loadId: string) => {
    if (!currentUser) return;
    const truck = trucks.find(t => t.id === truckId);
    const load = loads.find(l => l.id === loadId);
    if (!truck || !load) return;

    const newBooking: Booking = {
      id: `BKG-${Date.now()}`,
      truckId,
      loadRequestId: loadId,
      factoryOwnerId: load.ownerId,
      truckerId: truck.driverId,
      status: 'Pending',
      weight: load.weight,
      price: truck.pricePerTon * load.weight
    };

    setBookings(prev => [newBooking, ...prev]);
    
    // Notify Trucker
    addNotification(truck.driverId, 'BookingRequest', `New booking request for ${load.weight}T of ${load.goodsType}`);
    
    // Update Load Status
    setLoads(prev => prev.map(l => l.id === loadId ? { ...l, status: 'Booked' } : l));
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      
      const updates: Partial<Booking> = { status };
      if (status === 'Accepted') {
        updates.acceptedAt = new Date().toISOString();
        updates.otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Update truck capacity
        setTrucks(currTrucks => currTrucks.map(t => {
          if (t.id === b.truckId) {
             const newFilled = t.capacityFilled + b.weight;
             return { 
               ...t, 
               capacityFilled: newFilled,
               status: newFilled >= t.capacityTotal ? 'Full' : 'Partial'
             };
          }
          return t;
        }));

        addNotification(b.factoryOwnerId, 'BookingAccepted', `Booking ${bookingId} accepted! OTP: ${updates.otp}`);
      } else if (status === 'InTransit') {
        // Set truck to InTransit
         setTrucks(currTrucks => currTrucks.map(t => t.id === b.truckId ? { ...t, status: 'InTransit' } : t));
         addNotification(b.factoryOwnerId, 'TripUpdate', `Your shipment is now in transit.`);
      } else if (status === 'Delivered') {
         setTrucks(currTrucks => currTrucks.map(t => t.id === b.truckId ? { ...t, capacityFilled: 0, status: 'Active' } : t));
         updates.deliveredAt = new Date().toISOString();
         addNotification(b.factoryOwnerId, 'TripUpdate', `Shipment delivered successfully!`);
      }

      return { ...b, ...updates };
    }));
  };

  const sendMessage = (bookingId: string, text: string) => {
    if (!currentUser) return;
    const msg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      bookingId,
      senderId: currentUser.id,
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, msg]);
  };

  const triggerSOS = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, sosActive: true } : b));
    addNotification(booking.factoryOwnerId, 'SOS', `URGENT: SOS triggered by driver for Booking ${bookingId}`);
  };

  const addNotification = (userId: string, type: Notification['type'], message: string) => {
    const newNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      userId,
      type,
      message,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <StoreContext.Provider value={{
      currentUser,
      trucks,
      loads,
      bookings,
      notifications,
      messages,
      login,
      logout,
      createLoad,
      createBooking,
      updateBookingStatus,
      sendMessage,
      triggerSOS,
      markNotificationRead,
      isDarkMode,
      toggleTheme
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};