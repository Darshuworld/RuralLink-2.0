import React from 'react';
import { useStore } from '../context/StoreContext';
import { History as HistoryIcon, ArrowRight, FileText } from 'lucide-react';

export const History = () => {
  const { currentUser, bookings, trucks, loads } = useStore();

  if (!currentUser) return null;

  const isFactory = currentUser.role === 'FactoryOwner';

  // Filter bookings for current user
  const myBookings = bookings.filter(b => 
    isFactory ? b.factoryOwnerId === currentUser.id : b.truckerId === currentUser.id
  ).sort((a, b) => {
    // Sort by ID descending (mock ID is timestamp based)
    return b.id.localeCompare(a.id);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                <HistoryIcon size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isFactory ? 'Shipment History' : 'Trip History & Earnings'}
            </h1>
        </div>
        
        {!isFactory && (
             <div className="bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-lg border border-green-200 dark:border-green-800">
                <span className="text-sm text-green-800 dark:text-green-300 font-medium">Total Earnings: </span>
                <span className="text-lg font-bold text-green-700 dark:text-green-400">
                    ₹{myBookings.filter(b => b.status === 'Delivered').reduce((acc, b) => acc + b.price, 0).toLocaleString()}
                </span>
             </div>
        )}
      </div>

      {myBookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No transaction history found.</p>
          <p className="text-sm text-gray-400 mt-1">Completed deliveries will appear here.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cargo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {myBookings.map(booking => {
                  const truck = trucks.find(t => t.id === booking.truckId);
                  const load = loads.find(l => l.id === booking.loadRequestId);
                  
                  // Extract timestamp from ID or use status dates
                  let dateDisplay = 'N/A';
                  if (booking.deliveredAt) dateDisplay = new Date(booking.deliveredAt).toLocaleDateString();
                  else if (booking.acceptedAt) dateDisplay = new Date(booking.acceptedAt).toLocaleDateString();
                  else dateDisplay = new Date(parseInt(booking.id.split('-')[1] || Date.now().toString())).toLocaleDateString();

                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {booking.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {dateDisplay}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{truck?.origin || 'Unknown'}</span>
                          <ArrowRight size={14} className="mx-2 text-gray-400" />
                          <span className="font-medium">{truck?.destination || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">{load?.goodsType || 'General Goods'}</div>
                        <div className="text-xs text-gray-500">{booking.weight} Tons</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                           ${booking.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                             booking.status === 'Revoked' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                             'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                           {booking.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900 dark:text-white">
                        ₹{booking.price.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};