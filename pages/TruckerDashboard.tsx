import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { Truck, MapPin, Check, X, AlertTriangle, Navigation, DollarSign } from 'lucide-react';

export const TruckerDashboard = () => {
  const { currentUser, trucks, bookings, updateBookingStatus, triggerSOS } = useStore();

  const myTruck = trucks.find(t => t.driverId === currentUser?.id);
  const myBookings = bookings.filter(b => b.truckId === myTruck?.id);
  
  const pendingBookings = myBookings.filter(b => b.status === 'Pending');
  const activeBookings = myBookings.filter(b => ['Accepted', 'Pickup', 'InTransit'].includes(b.status));

  if (!myTruck) return <div className="p-8 text-center">No truck profile found.</div>;

  const handleUpdateStatus = (id: string, currentStatus: string) => {
    const sequence = ['Accepted', 'Pickup', 'InTransit', 'Delivered'];
    const idx = sequence.indexOf(currentStatus);
    if (idx < sequence.length - 1) {
      updateBookingStatus(id, sequence[idx + 1] as any);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hello, {currentUser?.name}</h1>
            <p className="text-gray-500">{myTruck.vehicleModel} • {myTruck.id}</p>
          </div>
          <div className={`px-4 py-1 rounded-full text-sm font-semibold ${myTruck.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {myTruck.status}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{myTruck.capacityFilled}T / {myTruck.capacityTotal}T</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Capacity Filled</div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg text-center">
             <div className="text-2xl font-bold text-green-600">₹{myBookings.reduce((acc, b) => b.status !== 'Revoked' ? acc + b.price : acc, 0)}</div>
             <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Est. Earnings</div>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingBookings.length > 0 && (
        <div className="bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-blue-100 dark:bg-slate-700 px-6 py-3 font-semibold text-blue-800 dark:text-blue-200">
            Incoming Requests ({pendingBookings.length})
          </div>
          <div className="divide-y divide-blue-100 dark:divide-slate-700">
            {pendingBookings.map(b => (
              <div key={b.id} className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{b.weight} Tons</span>
                    <span className="text-gray-500 ml-2">Shipment</span>
                  </div>
                  <div className="text-xl font-bold text-primary-600">₹{b.price}</div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                   <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded border dark:border-slate-600">{myTruck.origin}</span>
                   <Navigation size={14} />
                   <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded border dark:border-slate-600">{myTruck.destination}</span>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => updateBookingStatus(b.id, 'Accepted')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2"
                  >
                    <Check size={20} /> Accept Load
                  </button>
                  <button 
                    onClick={() => updateBookingStatus(b.id, 'Revoked')}
                    className="flex-1 bg-white dark:bg-slate-700 text-red-600 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 py-3 rounded-lg font-semibold flex justify-center items-center gap-2"
                  >
                    <X size={20} /> Decline
                  </button>
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">Expires in 11:30 hours</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Trip Control */}
      {activeBookings.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Current Trip</h2>
          {activeBookings.map(b => (
             <div key={b.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 mb-4 p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                     <div className="text-sm text-gray-500">Booking #{b.id}</div>
                     <div className="text-xl font-bold">{b.status}</div>
                  </div>
                  <Link to={`/booking/${b.id}`} className="text-primary-600 text-sm font-medium hover:underline">
                    View Details & Chat
                  </Link>
                </div>
                
                {/* OTP Display if Accepted */}
                {b.status === 'Accepted' && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6 text-center">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-1">Verify Pickup OTP from Owner</p>
                    <div className="text-3xl font-mono font-bold tracking-widest">{b.otp}</div>
                  </div>
                )}

                {/* Status Stepper */}
                <div className="space-y-3">
                   {b.status === 'Accepted' && (
                      <button onClick={() => handleUpdateStatus(b.id, 'Accepted')} className="w-full bg-primary-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-primary-700">
                        Start Pickup
                      </button>
                   )}
                   {b.status === 'Pickup' && (
                      <button onClick={() => handleUpdateStatus(b.id, 'Pickup')} className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-blue-700">
                        Confirm Loaded & Start Transit
                      </button>
                   )}
                   {b.status === 'InTransit' && (
                      <button onClick={() => handleUpdateStatus(b.id, 'InTransit')} className="w-full bg-green-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-green-700">
                        Confirm Delivery
                      </button>
                   )}
                </div>

                {b.status === 'InTransit' && (
                   <button 
                      onClick={() => triggerSOS(b.id)}
                      className="mt-6 w-full border-2 border-red-500 text-red-600 dark:text-red-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <AlertTriangle size={20} /> REPORT SOS / EMERGENCY
                   </button>
                )}
             </div>
          ))}
        </section>
      )}
    </div>
  );
};
