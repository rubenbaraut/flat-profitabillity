import React from 'react';
import RentabilityCalculator from './components/RentabilityCalculator';

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Calculadora de Rentabilidad de Pisos</h1>
      <RentabilityCalculator />
    </div>
  );
};

export default App;