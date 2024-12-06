import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"

interface Tool {
  id: string;
  name: string;
  description: string;
  price: number;
  route: string;
}

const tools: Tool[] = [
  {
    id: 'rentability-calculator',
    name: 'Calculadora de Rentabilidad',
    description: 'Calcula la rentabilidad de tu inversión inmobiliaria de forma rápida y precisa.',
    price: 19.99,
    route: '/calculo-de-rentabilidad'
  },
  // Aquí puedes agregar más herramientas en el futuro
];

const ToolsPage: React.FC = () => {
  return (
    <div className="py-10 bg-gray-200">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Herramientas para Inversores Inmobiliarios</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <Card key={tool.id} className="bg-white">
                  <CardHeader>
                    <CardTitle>{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{tool.price.toFixed(2)}€</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button asChild className="bg-gray-800 hover:bg-gray-900 text-white font-bold">
                      <Link href={tool.route}>Usar herramienta</Link>
                    </Button>
                    <Button variant="outline" asChild className="border-gray-800 text-gray-800 hover:bg-gray-100 font-semibold">
                      <Link href={`/herramientas/${tool.id}`}>Más información</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ToolsPage;

