import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const tools = {
  'rentability-calculator': {
    name: 'Calculadora de Rentabilidad de Pisos',
    description: 'Calcula la rentabilidad de tu inversión inmobiliaria de forma rápida y precisa.',
    features: [
      'Cálculo de rentabilidad bruta y neta',
      'Estimación de gastos e ingresos',
      'Comparación de diferentes escenarios',
      'Análisis detallado de costos'
    ],
    price: 19.99,
    route: '/calculo-de-rentabilidad'
  },
  // Aquí puedes agregar más herramientas en el futuro
};

const ToolLandingPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const tool = tools[id as keyof typeof tools];

  if (!tool) {
    return <div>Herramienta no encontrada</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">{tool.name}</h1>
      <p className="text-xl mb-6">{tool.description}</p>
      <h2 className="text-2xl font-semibold mb-4">Características:</h2>
      <ul className="list-disc list-inside mb-6">
        {tool.features.map((feature, index) => (
          <li key={index} className="mb-2">{feature}</li>
        ))}
      </ul>
      <p className="text-2xl font-bold mb-6">Precio: {tool.price.toFixed(2)}€</p>
      <div className="flex gap-4">
        <Link href={tool.route} className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors">
          Usar herramienta
        </Link>
        <Link href="/" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default ToolLandingPage;

