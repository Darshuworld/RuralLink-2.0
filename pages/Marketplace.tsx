import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Star, Truck as TruckIcon } from 'lucide-react';
import { MOCK_TRUCKS } from '../constants';

export const Marketplace = () => {
  const { trucks, createBooking, currentUser, loads } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse query params for specific load matching
  const params = new URLSearchParams(location.search);
  const targetLoadId = params.get('loadId');
  const targetLoad = loads.find(l => l.id === targetLoadId);

  const availableTrucks = useMemo(() => {
    return trucks.filter(t => t.status !== 'Full' && t.status !== 'InTransit');
  }, [trucks]);

  const handleBook = (truckId: string) => {
    if (!targetLoad) {
      alert("Please select a load to book first (Demo limitation)");
      return;
    }
    createBooking(truckId, targetLoad.id);
    navigate('/factory-dashboard');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Find Trucks</h1>
        {targetLoad && (
          <div className="mt-2 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-200">
            Matching for: <strong>{targetLoad.goodsType}</strong> ({targetLoad.weight}T) from {targetLoad.origin} to {targetLoad.destination}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
             <div className="flex items-center gap-2 font-bold mb-4 text-gray-700 dark:text-gray-200">
                <Filter size={18} /> Filters
             </div>
             <div className="space-y-4">
                <div>
                   <label className="text-xs font-semibold text-gray-500 uppercase">Origin</label>
                   <select className="w-full mt-1 p-2 border rounded bg-transparent dark:border-slate-600 dark:text-white">
                      <option>Any</option>
                      <option>Butibori</option>
                      <option>Kalmeshwar</option>
                   </select>
                </div>
                <div>
                   <label className="text-xs font-semibold text-gray-500 uppercase">Min Capacity</label>
                   <input type="range" className="w-full mt-1" />
                </div>
             </div>
          </div>
        </div>

        {/* Truck List */}
        <div className="lg:col-span-3 space-y-4">
          {availableTrucks.map(truck => (
            <div key={truck.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 dark:bg-slate-700 p-3 rounded-lg">
                    <TruckIcon size={32} className="text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{truck.vehicleModel}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-medium">
                       <Star size={14} fill="currentColor" /> {truck.rating} • {truck.driverName}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                       {truck.origin} ➝ {truck.destination}
                    </div>
                    <div className="mt-2 flex gap-2">
                       {truck.isGroupShippingAllowed && (
                         <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Group Shipping</span>
                       )}
                       <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded-full">
                         {truck.departureDate}
                       </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-0 flex flex-col items-end justify-between">
                   <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">₹{truck.pricePerTon}<span className="text-sm font-normal text-gray-500">/ton</span></div>
                      <div className="text-sm text-gray-500">{truck.capacityTotal - truck.capacityFilled}T Available</div>
                   </div>
                   
                   <button 
                     onClick={() => handleBook(truck.id)}
                     disabled={!targetLoad}
                     className={`mt-3 px-6 py-2 rounded-lg font-bold transition-colors ${
                       targetLoad 
                       ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                       : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                     }`}
                   >
                     {targetLoad ? 'Book Now' : 'Select Request First'}
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
