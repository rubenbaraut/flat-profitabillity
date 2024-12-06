import React from 'react';
import { RentabilityTabs } from '@/components/RentabilityTabs';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Calculadora de Rentabilidad de Pisos</h1>
      <RentabilityTabs />
    </div>
  );
};

export default Home;

