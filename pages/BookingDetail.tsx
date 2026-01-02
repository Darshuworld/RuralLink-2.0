import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { MapWidget } from '../components/MapWidget';
import { MessageCircle, Phone, Shield, Send, Paperclip } from 'lucide-react';

export const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { bookings, trucks, currentUser, messages, sendMessage, notifications } = useStore();
  const [chatText, setChatText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const booking = bookings.find(b => b.id === id);
  const truck = trucks.find(t => t.id === booking?.truckId);

  const bookingMessages = messages.filter(m => m.bookingId === id);
  const sosActive = booking?.sosActive;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bookingMessages]);

  if (!booking || !truck) return <div className="p-8">Booking not found</div>;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    sendMessage(booking.id, chatText);
    setChatText('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Left Panel: Details & Tracking */}
      <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2">
        {sosActive && (
           <div className="bg-red-600 text-white p-4 rounded-xl animate-pulse flex items-center gap-3 font-bold">
              <Shield size={24} />
              SOS TRIGGERED: Driver has reported an emergency.
           </div>
        )}
        
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-slate-700">
           <MapWidget origin={truck.origin} destination={truck.destination} status={booking.status} />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
           <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Booking Details</h2>
           <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div className="text-gray-500">Booking ID</div>
              <div className="font-mono">{booking.id}</div>
              
              <div className="text-gray-500">Status</div>
              <div className="font-semibold">{booking.status}</div>

              <div className="text-gray-500">Driver</div>
              <div>{truck.driverName}</div>

              <div className="text-gray-500">Vehicle</div>
              <div>{truck.vehicleModel}</div>

              <div className="text-gray-500">Weight</div>
              <div>{booking.weight} Tons</div>

              <div className="text-gray-500">Total Price</div>
              <div className="font-bold text-primary-600">₹{booking.price}</div>
           </div>
           
           {booking.status === 'Accepted' && currentUser?.role === 'FactoryOwner' && (
             <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg text-center">
                <span className="block text-xs text-gray-500 uppercase mb-1">Pickup OTP</span>
                <span className="text-3xl font-mono font-bold">{booking.otp}</span>
             </div>
           )}
        </div>
      </div>

      {/* Right Panel: Chat */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden h-[600px] lg:h-auto">
        <div className="p-4 border-b dark:border-slate-700 bg-gray-50 dark:bg-slate-900 flex justify-between items-center">
           <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
              <MessageCircle size={18} /> Chat with {currentUser?.role === 'Trucker' ? 'Owner' : 'Driver'}
           </div>
           <button className="text-green-600 hover:bg-green-50 p-2 rounded-full">
              <Phone size={18} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-900/50">
           {bookingMessages.length === 0 && (
              <div className="text-center text-gray-400 text-sm mt-10">Start the conversation...</div>
           )}
           {bookingMessages.map(msg => {
             const isMe = msg.senderId === currentUser?.id;
             return (
               <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    isMe 
                    ? 'bg-primary-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-700 border dark:border-slate-600 rounded-tl-none text-gray-800 dark:text-gray-200'
                  }`}>
                     <p className="text-sm">{msg.text}</p>
                     <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-200' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </p>
                  </div>
               </div>
             )
           })}
           <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-3 border-t dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-2">
           <button type="button" className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <Paperclip size={20} />
           </button>
           <input 
             type="text" 
             value={chatText}
             onChange={e => setChatText(e.target.value)}
             placeholder="Type a message..."
             className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
           />
           <button type="submit" disabled={!chatText.trim()} className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send size={18} />
           </button>
        </form>
      </div>
    </div>
  );
};
