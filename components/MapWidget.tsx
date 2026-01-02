import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface MapWidgetProps {
  origin: string;
  destination: string;
  status: string; // 'Accepted', 'Pickup', 'InTransit', 'Delivered'
}

export const MapWidget: React.FC<MapWidgetProps> = ({ origin, destination, status }) => {
  // Simple simulation of progress based on status
  let progress = 0;
  if (status === 'Accepted') progress = 5;
  if (status === 'Pickup') progress = 20;
  if (status === 'InTransit') progress = 60; // Animated in real app, static here for demo simplicity
  if (status === 'Delivered') progress = 100;

  return (
    <div className="bg-slate-100 dark:bg-slate-900 rounded-lg h-48 sm:h-64 relative overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center">
      
      {/* Visual Background (Simulating Map) */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      {/* Route Line */}
      <div className="relative w-3/4 h-2 bg-gray-300 dark:bg-gray-600 rounded-full">
        <div 
          className="absolute top-0 left-0 h-full bg-primary-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
        
        {/* Truck Icon on Line */}
        <div 
          className="absolute top-1/2 -mt-3 -ml-3 transition-all duration-1000 ease-out bg-white dark:bg-slate-800 p-1 rounded-full shadow-md border border-primary-500 z-10"
          style={{ left: `${progress}%` }}
        >
          <Navigation size={16} className="text-primary-600 transform rotate-90" />
        </div>
      </div>

      {/* Locations */}
      <div className="w-3/4 flex justify-between mt-6 relative z-10">
        <div className="flex flex-col items-center">
          <MapPin size={24} className="text-green-600 mb-1" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded">{origin}</span>
        </div>
        <div className="flex flex-col items-center">
          <MapPin size={24} className="text-red-600 mb-1" />
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded">{destination}</span>
        </div>
      </div>
      
      {status === 'InTransit' && (
        <div className="absolute bottom-2 right-2 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-md text-xs font-mono border dark:border-slate-700 animate-pulse">
          GPS Active • 45km/h
        </div>
      )}
    </div>
  );
};
