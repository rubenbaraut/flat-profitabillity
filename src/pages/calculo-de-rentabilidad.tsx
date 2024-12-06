import React from 'react';
import { RentabilityTabs } from '../components/RentabilityTabs';

const CalculoDeRentabilidad: React.FC = () => {
  return (
    <div className="py-10 bg-gray-200">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Calculadora de Rentabilidad</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <RentabilityTabs />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalculoDeRentabilidad;

