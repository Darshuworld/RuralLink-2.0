import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { Plus, Package, Clock, CheckCircle, MapPin, ChevronRight, Search } from 'lucide-react';
import { LOCATIONS } from '../constants';
import { LoadRequest, Booking } from '../types';

export const FactoryDashboard = () => {
  const { loads, bookings, trucks, createLoad } = useStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter logic
  const myLoads = loads.filter(l => l.status === 'Pending');
  const activeBookings = bookings.filter(b => ['Pending', 'Accepted', 'Pickup', 'InTransit'].includes(b.status));
  const pastBookings = bookings.filter(b => ['Delivered', 'Revoked'].includes(b.status));

  return (
    <div className="space-y-8">
      {/* Hero / Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Shipments</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{activeBookings.length}</h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-slate-700 rounded-lg text-blue-600">
              <Package size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Requests</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{myLoads.length}</h3>
            </div>
            <div className="p-2 bg-orange-50 dark:bg-slate-700 rounded-lg text-orange-600">
              <Clock size={24} />
            </div>
          </div>
        </div>
         <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 rounded-xl shadow-lg text-white flex flex-col justify-center items-center text-center cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setShowCreateModal(true)}>
            <Plus size={32} className="mb-2" />
            <span className="font-semibold text-lg">Create New Request</span>
        </div>
      </div>

      {/* Active Bookings Section */}
      {activeBookings.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Active Shipments</h2>
          <div className="grid gap-4">
            {activeBookings.map(booking => {
              const truck = trucks.find(t => t.id === booking.truckId);
              return (
                <div key={booking.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                           <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                              ${booking.status === 'InTransit' ? 'bg-blue-100 text-blue-800' : 
                                booking.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'}`}>
                              {booking.status}
                           </span>
                           <span className="text-gray-400 text-sm">#{booking.id}</span>
                        </div>
                        <h3 className="text-lg font-semibold mt-1">{truck?.vehicleModel} <span className="text-gray-500 text-base font-normal">with {truck?.driverName}</span></h3>
                      </div>
                      <div className="mt-2 md:mt-0 text-right">
                         <div className="text-2xl font-bold text-primary-600">₹{booking.price}</div>
                         <div className="text-sm text-gray-500">{booking.weight} Tons</div>
                      </div>
                    </div>
                    
                    {booking.otp && (
                       <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 p-3 rounded-md mb-4 flex justify-between items-center">
                          <span className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">Share OTP with Driver on Pickup</span>
                          <span className="text-xl font-mono font-bold tracking-widest text-gray-900 dark:text-white">{booking.otp}</span>
                       </div>
                    )}

                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <MapPin size={16} />
                      <span>{truck?.origin}</span>
                      <ChevronRight size={16} />
                      <span>{truck?.destination}</span>
                    </div>

                    <div className="flex space-x-3 mt-2">
                       <Link to={`/booking/${booking.id}`} className="flex-1 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-600 text-center transition-colors">
                          View Details & Track
                       </Link>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-700">
                    <div 
                      className="h-full bg-primary-500 transition-all duration-500"
                      style={{ 
                        width: booking.status === 'Accepted' ? '25%' : 
                               booking.status === 'Pickup' ? '50%' : 
                               booking.status === 'InTransit' ? '75%' : '5%' 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Pending Requests */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Unmatched Requests</h2>
          <Link to="/market" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
            Find Trucks Manually <ChevronRight size={16} />
          </Link>
        </div>
        
        {myLoads.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No pending requests. Create one to get started.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 divide-y divide-gray-100 dark:divide-slate-700">
            {myLoads.map(load => (
              <div key={load.id} className="p-4 flex flex-col md:flex-row justify-between md:items-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                <div>
                   <h4 className="font-semibold text-gray-900 dark:text-white">{load.goodsType} ({load.weight} Tons)</h4>
                   <div className="flex items-center text-sm text-gray-500 mt-1 space-x-2">
                      <span>{load.origin}</span>
                      <ChevronRight size={14} />
                      <span>{load.destination}</span>
                   </div>
                </div>
                <div className="mt-3 md:mt-0 flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Target</div>
                    <div className="font-semibold text-gray-900 dark:text-white">₹{load.targetPrice}</div>
                  </div>
                  <Link to={`/market?loadId=${load.id}`} className="bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors">
                    Find Match
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateLoadModal onClose={() => setShowCreateModal(false)} onCreate={createLoad} />
      )}
    </div>
  );
};

const CreateLoadModal = ({ onClose, onCreate }: { onClose: () => void, onCreate: any }) => {
  const [formData, setFormData] = useState({
    goodsType: 'Cotton Bales',
    weight: 1,
    origin: LOCATIONS[0],
    destination: LOCATIONS[1],
    targetPrice: 3000,
    companyName: 'My Factory'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">New Shipping Request</h3>
          <button onClick={onClose}><XIcon /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goods Type</label>
             <input type="text" className="w-full rounded-lg border-gray-300 dark:border-slate-600 dark:bg-slate-700 p-2" 
                value={formData.goodsType} onChange={e => setFormData({...formData, goodsType: e.target.value})} />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (Tons)</label>
               <input type="number" step="0.1" className="w-full rounded-lg border-gray-300 dark:border-slate-600 dark:bg-slate-700 p-2" 
                  value={formData.weight} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Price (₹)</label>
               <input type="number" className="w-full rounded-lg border-gray-300 dark:border-slate-600 dark:bg-slate-700 p-2" 
                  value={formData.targetPrice} onChange={e => setFormData({...formData, targetPrice: parseFloat(e.target.value)})} />
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Origin</label>
                <select className="w-full rounded-lg border-gray-300 dark:border-slate-600 dark:bg-slate-700 p-2"
                   value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})}>
                   {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
                <select className="w-full rounded-lg border-gray-300 dark:border-slate-600 dark:bg-slate-700 p-2"
                   value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})}>
                   {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
           </div>

           <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl mt-4 transition-colors">
             Create Request
           </button>
        </form>
      </div>
    </div>
  );
}

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
