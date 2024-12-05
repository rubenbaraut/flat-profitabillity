import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import RentabilityCalculator from "./RentabilityCalculator"

export function RentabilityTabs() {
  const [activeTab, setActiveTab] = useState('traditional');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3 bg-gray-200 p-1 rounded-lg border border-gray-300">
        <TabsTrigger 
          value="traditional" 
          onClick={() => setActiveTab('traditional')}
          className="px-3 py-1.5 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 hover:bg-gray-500 hover:text-white rounded-md"
        >
          Alquiler Tradicional
        </TabsTrigger>
        <TabsTrigger 
          value="rooms" 
          onClick={() => setActiveTab('rooms')}
          className="px-3 py-1.5 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 hover:bg-gray-500 hover:text-white rounded-md"
        >
          Alquiler por Habitaciones
        </TabsTrigger>
        <TabsTrigger 
          value="touristic" 
          onClick={() => setActiveTab('touristic')}
          className="px-3 py-1.5 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-400 data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700 hover:bg-gray-500 hover:text-white rounded-md"
        >
          Alquiler Turístico
        </TabsTrigger>
      </TabsList>
      <TabsContent value="traditional">
        <RentabilityCalculator type="traditional"/>
      </TabsContent>
      <TabsContent value="rooms">
        <RentabilityCalculator type="rooms"/>
      </TabsContent>
      <TabsContent value="touristic">
        <RentabilityCalculator type="touristic"/>
      </TabsContent>
    </Tabs>
  )
}

