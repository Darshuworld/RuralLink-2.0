import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Truck, Factory, ArrowRight } from 'lucide-react';

export const Landing = () => {
  const { login } = useStore();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'FactoryOwner' | 'Trucker') => {
    login(role);
    if (role === 'FactoryOwner') navigate('/factory-dashboard');
    else navigate('/trucker-dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-primary-600 rounded-2xl shadow-xl mb-4">
          <Truck size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
          RuralLink
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Connecting rural factories with trucks. Match loads, share capacity, and save costs.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Factory Card */}
        <button 
          onClick={() => handleRoleSelect('FactoryOwner')}
          className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-primary-500 text-left"
        >
          <div className="absolute top-6 right-6 text-gray-300 group-hover:text-primary-500 transition-colors">
            <ArrowRight size={24} />
          </div>
          <Factory size={48} className="text-primary-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Factory Owner</h2>
          <p className="text-gray-500 dark:text-gray-400">
            I have goods to ship. I want to find a truck or share space.
          </p>
        </button>

        {/* Trucker Card */}
        <button 
          onClick={() => handleRoleSelect('Trucker')}
          className="group relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-primary-500 text-left"
        >
          <div className="absolute top-6 right-6 text-gray-300 group-hover:text-primary-500 transition-colors">
            <ArrowRight size={24} />
          </div>
          <Truck size={48} className="text-primary-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Truck Driver</h2>
          <p className="text-gray-500 dark:text-gray-400">
            I have a truck. I want to find loads and fill my empty capacity.
          </p>
        </button>
      </div>
      
      <div className="mt-12 text-sm text-gray-400">
        Nagpur Region Prototype • Built for Demo
      </div>
    </div>
  );
};
