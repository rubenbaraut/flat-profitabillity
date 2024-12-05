import React, { useState, useEffect } from 'react';
import defaultValues from '../data/default-values.json';

interface FormData {
  direccion: string;
  comunidadAutonoma: string;
  itp: number;
  precioCompra: number;
  impuestoITP: number;
  gastosNotariaRegistro: number;
  gastosHipoteca: number;
  costeReforma: number;
  comisionCompra: number;
  mobiliario: number;
  ibi: number;
  basuras: number;
  seguroHogar: number;
  seguroVida: number;
  seguroImpago: number;
  comunidadPropietarios: number;
  mantenimiento: number;
  periodosVacios: number;
  precioAlquiler: number;
}

const comunidadesAutonomas = [
  "Andalucía", "Aragón", "Asturias", "Baleares", "Canarias", "Cantabria", 
  "Castilla-La Mancha", "Castilla y León", "Cataluña", "Comunidad Valenciana", 
  "Extremadura", "Galicia", "La Rioja", "Madrid", "Murcia", "Navarra", "País Vasco"
];

const itpOptions = [4, 5, 6, 7, 8, 9, 10, 11, 12];

const RentabilityCalculator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(defaultValues);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'direccion' || name === 'comunidadAutonoma' ? value : Number(value) }));
  };

  useEffect(() => {
    const itpAmount = (formData.precioCompra * formData.itp) / 100;
    setFormData(prev => ({ ...prev, impuestoITP: itpAmount }));
  }, [formData.precioCompra, formData.itp]);

  const calculateResults = () => {
    const inversionTotal = formData.precioCompra + formData.impuestoITP + 
      formData.gastosNotariaRegistro + formData.gastosHipoteca + 
      formData.costeReforma + formData.comisionCompra + formData.mobiliario;

    const ingresoAnual = formData.precioAlquiler * 12;
    const gastosAnuales = formData.ibi + formData.basuras + formData.seguroHogar + 
      formData.seguroVida + formData.seguroImpago + formData.comunidadPropietarios + 
      formData.mantenimiento;

    const rentabilidadBruta = (ingresoAnual / inversionTotal) * 100;
    const rentabilidadNeta = ((ingresoAnual - gastosAnuales) / inversionTotal) * 100;
    const roce = ((ingresoAnual - gastosAnuales) / (formData.precioCompra + formData.costeReforma)) * 100;
    const cashflowAnual = ingresoAnual - gastosAnuales;
    const cashflowMensual = cashflowAnual / 12;

    return {
      rentabilidadBruta: rentabilidadBruta.toFixed(2),
      rentabilidadNeta: rentabilidadNeta.toFixed(2),
      roce: roce.toFixed(2),
      cashflowAnual: cashflowAnual.toFixed(2),
      cashflowMensual: cashflowMensual.toFixed(2),
    };
  };

  const results = calculateResults();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Calculadora de Rentabilidad de Pisos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Datos Generales</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección de la vivienda</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="comunidadAutonoma" className="block text-sm font-medium text-gray-700">Comunidad Autónoma</label>
              <select
                id="comunidadAutonoma"
                name="comunidadAutonoma"
                value={formData.comunidadAutonoma}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="">Seleccione una comunidad</option>
                {comunidadesAutonomas.map(ca => (
                  <option key={ca} value={ca}>{ca}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="precioCompra" className="block text-sm font-medium text-gray-700">Precio de compra (€)</label>
              <input
                type="number"
                id="precioCompra"
                name="precioCompra"
                value={formData.precioCompra}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="precioAlquiler" className="block text-sm font-medium text-gray-700">Precio alquiler (€/mes)</label>
              <input
                type="number"
                id="precioAlquiler"
                name="precioAlquiler"
                value={formData.precioAlquiler}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Gastos Compra Venta</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="itp" className="block text-sm font-medium text-gray-700">ITP (%)</label>
              <select
                id="itp"
                name="itp"
                value={formData.itp}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                {itpOptions.map(option => (
                  <option key={option} value={option}>{option}%</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="impuestoITP" className="block text-sm font-medium text-gray-700">Impuesto ITP (€)</label>
              <input
                type="number"
                id="impuestoITP"
                name="impuestoITP"
                value={formData.impuestoITP}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="gastosNotariaRegistro" className="block text-sm font-medium text-gray-700">Gastos Notaría, Registro (€)</label>
              <input
                type="number"
                id="gastosNotariaRegistro"
                name="gastosNotariaRegistro"
                value={formData.gastosNotariaRegistro}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="gastosHipoteca" className="block text-sm font-medium text-gray-700">Gastos hipoteca (€)</label>
              <input
                type="number"
                id="gastosHipoteca"
                name="gastosHipoteca"
                value={formData.gastosHipoteca}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="costeReforma" className="block text-sm font-medium text-gray-700">Coste reforma (€)</label>
              <input
                type="number"
                id="costeReforma"
                name="costeReforma"
                value={formData.costeReforma}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="comisionCompra" className="block text-sm font-medium text-gray-700">Comisión compra (€)</label>
              <input
                type="number"
                id="comisionCompra"
                name="comisionCompra"
                value={formData.comisionCompra}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="mobiliario" className="block text-sm font-medium text-gray-700">Mobiliario (€)</label>
              <input
                type="number"
                id="mobiliario"
                name="mobiliario"
                value={formData.mobiliario}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Gastos Recurrentes</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="ibi" className="block text-sm font-medium text-gray-700">IBI (€)</label>
              <input
                type="number"
                id="ibi"
                name="ibi"
                value={formData.ibi}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="basuras" className="block text-sm font-medium text-gray-700">Basuras (€)</label>
              <input
                type="number"
                id="basuras"
                name="basuras"
                value={formData.basuras}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="seguroHogar" className="block text-sm font-medium text-gray-700">Seguro Hogar (€)</label>
              <input
                type="number"
                id="seguroHogar"
                name="seguroHogar"
                value={formData.seguroHogar}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="seguroVida" className="block text-sm font-medium text-gray-700">Seguro Vida (€)</label>
              <input
                type="number"
                id="seguroVida"
                name="seguroVida"
                value={formData.seguroVida}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="seguroImpago" className="block text-sm font-medium text-gray-700">Seguro Impago (€)</label>
              <input
                type="number"
                id="seguroImpago"
                name="seguroImpago"
                value={formData.seguroImpago}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="comunidadPropietarios" className="block text-sm font-medium text-gray-700">Comunidad de propietarios (€)</label>
              <input
                type="number"
                id="comunidadPropietarios"
                name="comunidadPropietarios"
                value={formData.comunidadPropietarios}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="mantenimiento" className="block text-sm font-medium text-gray-700">Mantenimiento (€)</label>
              <input
                type="number"
                id="mantenimiento"
                name="mantenimiento"
                value={formData.mantenimiento}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="periodosVacios" className="block text-sm font-medium text-gray-700">Periodos vacíos (días)</label>
              <input
                type="number"
                id="periodosVacios"
                name="periodosVacios"
                value={formData.periodosVacios}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </section>
      </div>

      <section className="mt-8 bg-gray-100 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Resultados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="font-semibold">Rentabilidad Bruta:</p>
            <p className="text-2xl">{results.rentabilidadBruta}%</p>
          </div>
          <div>
            <p className="font-semibold">Rentabilidad Neta:</p>
            <p className="text-2xl">{results.rentabilidadNeta}%</p>
          </div>
          <div>
            <p className="font-semibold">ROCE:</p>
            <p className="text-2xl">{results.roce}%</p>
          </div>
          <div>
            <p className="font-semibold">Cashflow Anual:</p>
            <p className="text-2xl">{results.cashflowAnual}€</p>
          </div>
          <div>
            <p className="font-semibold">Cashflow Mensual:</p>
            <p className="text-2xl">{results.cashflowMensual}€</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RentabilityCalculator;

