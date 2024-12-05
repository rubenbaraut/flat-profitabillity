import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import RentabilityCalculator from "./RentabilityCalculator"

export function RentabilityTabs() {
  const [activeTab, setActiveTab] = useState('traditional');

  return (
    <div className="space-y-6 bg-gray-100 p-6 rounded-lg shadow-md">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="inline-flex bg-gray-200 px-0 py-1 rounded-lg border border-gray-300">
          <TabsTrigger 
            value="traditional" 
            className="px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 hover:bg-gray-500 hover:text-white rounded-l-md"
          >
            Alquiler Tradicional
          </TabsTrigger>
          <TabsTrigger 
            value="rooms" 
            className="px-4 py-2 mx-1 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 hover:bg-gray-500 hover:text-white"
          >
            Alquiler por Habitaciones
          </TabsTrigger>
          <TabsTrigger 
            value="touristic" 
            className="px-4 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 hover:bg-gray-500 hover:text-white rounded-r-md"
          >
            Alquiler Turístico
          </TabsTrigger>
        </TabsList>
        <div className="mt-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <TabsContent value="traditional">
            <RentabilityCalculator type="traditional" />
          </TabsContent>
          <TabsContent value="rooms">
            <RentabilityCalculator type="rooms" />
          </TabsContent>
          <TabsContent value="touristic">
            <RentabilityCalculator type="touristic" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

