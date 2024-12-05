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
  numeroHabitaciones?: number;
  precioHabitacion?: number;
  ocupacionAnual?: number;
  comisionPlataforma?: number;
}

const comunidadesAutonomas = Object.keys(defaultValues.itpValues);

interface RentabilityCalculatorProps {
  type: 'traditional' | 'rooms' | 'touristic';
}

const itpOptions = [4, 5, 6, 7, 8, 9, 10, 11, 12];

const RentabilityCalculator: React.FC<RentabilityCalculatorProps> = ({ type }) => {
  const [formData, setFormData] = useState<FormData>({
    ...defaultValues,
    numeroHabitaciones: 1,
    precioHabitacion: 0,
    ocupacionAnual: 100,
    comisionPlataforma: 0,
    itp: 0,
  });

  const [customITP, setCustomITP] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [name]: name === 'direccion' || name === 'comunidadAutonoma' ? value : Number(value) };
      
      if (name === 'comunidadAutonoma') {
        const newITP = defaultValues.itpValues[value as keyof typeof defaultValues.itpValues] || 0;
        updatedData.itp = newITP;
        setCustomITP(false);
      }
      
      if (name === 'precioCompra' || name === 'itp') {
        updatedData.impuestoITP = (updatedData.precioCompra * updatedData.itp) / 100;
      }
      
      return updatedData;
    });
  };

  const handleITPChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setCustomITP(true);
    } else {
      setCustomITP(false);
      handleInputChange(e);
    }
  };

  const calculateResults = () => {
    const inversionTotal = formData.precioCompra + formData.impuestoITP + 
      formData.gastosNotariaRegistro + formData.gastosHipoteca + 
      formData.costeReforma + formData.comisionCompra + formData.mobiliario;

    let ingresoAnual = 0;
    if (type === 'traditional') {
      ingresoAnual = formData.precioAlquiler * 12;
    } else if (type === 'rooms') {
      ingresoAnual = formData.numeroHabitaciones! * formData.precioHabitacion! * 12;
    } else if (type === 'touristic') {
      ingresoAnual = formData.precioAlquiler * 365 * (formData.ocupacionAnual! / 100);
    }

    const gastosAnuales = formData.ibi + formData.basuras + formData.seguroHogar + 
      formData.seguroVida + formData.seguroImpago + formData.comunidadPropietarios + 
      formData.mantenimiento;

    const ingresoNeto = type === 'touristic' 
      ? ingresoAnual * (1 - formData.comisionPlataforma! / 100) 
      : ingresoAnual;

    const rentabilidadBruta = (ingresoAnual / inversionTotal) * 100;
    const rentabilidadNeta = ((ingresoNeto - gastosAnuales) / inversionTotal) * 100;
    const roce = ((ingresoNeto - gastosAnuales) / (formData.precioCompra + formData.costeReforma)) * 100;
    const cashflowAnual = ingresoNeto - gastosAnuales;
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <section className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Datos Generales</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="direccion" className="block text-sm font-semibold text-gray-700">Dirección de la vivienda</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
                />
              </div>
              <div>
                <label htmlFor="comunidadAutonoma" className="block text-sm font-semibold text-gray-700">Comunidad Autónoma</label>
                <select
                  id="comunidadAutonoma"
                  name="comunidadAutonoma"
                  value={formData.comunidadAutonoma}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
                >
                  <option value="">Seleccione una comunidad</option>
                  {comunidadesAutonomas.map(ca => (
                    <option key={ca} value={ca}>{ca}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Ingresos</h2>
            <div className="space-y-4">
              {type === 'traditional' && (
                <div>
                  <label htmlFor="precioAlquiler" className="block text-sm font-semibold text-gray-700">Precio alquiler (€/mes)</label>
                  <input
                    type="number"
                    id="precioAlquiler"
                    name="precioAlquiler"
                    value={formData.precioAlquiler}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
                  />
                </div>
              )}
              {type === 'rooms' && (
                <>
                  <div>
                    <label htmlFor="numeroHabitaciones" className="block text-sm font-semibold text-gray-700">Número de habitaciones</label>
                    <input
                      type="number"
                      id="numeroHabitaciones"
                      name="numeroHabitaciones"
                      value={formData.numeroHabitaciones}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
                    />
                  </div>
                  <div>
                    <label htmlFor="precioHabitacion" className="block text-sm font-semibold text-gray-700">Precio por habitación (€/mes)</label>
                    <input
                      type="number"
                      id="precioHabitacion"
                      name="precioHabitacion"
                      value={formData.precioHabitacion}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
                    />
                  </div>
                </>
              )}
              {type === 'touristic' && (
                <>
                  <div>
                    <label htmlFor="precioAlquiler" className="block text-sm font-semibold text-gray-700">Precio alquiler (€/noche)</label>
                    <input
                      type="number"
                      id="precioAlquiler"
                      name="precioAlquiler"
                      value={formData.precioAlquiler}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
                    />
                  </div>
                  <div>
                    <label htmlFor="ocupacionAnual" className="block text-sm font-semibold text-gray-700">Ocupación anual (%)</label>
                    <input
                      type="number"
                      id="ocupacionAnual"
                      name="ocupacionAnual"
                      value={formData.ocupacionAnual}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
                    />
                  </div>
                  <div>
                    <label htmlFor="comisionPlataforma" className="block text-sm font-semibold text-gray-700">Comisión plataforma (%)</label>
                    <input
                      type="number"
                      id="comisionPlataforma"
                      name="comisionPlataforma"
                      value={formData.comisionPlataforma}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
                    />
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        <section className="bg-gray-100 p-4 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Gastos Compra Venta</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="precioCompra" className="block text-sm font-semibold text-gray-700">Precio de compra (€)</label>
              <input
                type="number"
                id="precioCompra"
                name="precioCompra"
                value={formData.precioCompra}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
            <div>
              <label htmlFor="itp" className="block text-sm font-semibold text-gray-700">ITP (%)</label>
              <div className="flex items-center space-x-2">
                <select
                  id="itp"
                  name="itp"
                  value={customITP ? 'custom' : formData.itp}
                  onChange={handleITPChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
                >
                  {itpOptions.map(option => (
                    <option key={option} value={option}>{option}%</option>
                  ))}
                  <option value="custom">Personalizado</option>
                </select>
                {customITP && (
                  <input
                    type="number"
                    name="itp"
                    value={formData.itp}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
                    placeholder="ITP personalizado"
                    step="0.1"
                  />
                )}
              </div>
            </div>
            <div>
              <label htmlFor="impuestoITP" className="block text-sm font-semibold text-gray-700">Impuesto ITP (€)</label>
              <input
                type="number"
                id="impuestoITP"
                name="impuestoITP"
                value={formData.impuestoITP}
                readOnly
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm py-1.5 px-3"
              />
            </div>
            <div>
              <label htmlFor="gastosNotariaRegistro" className="block text-sm font-semibold text-gray-700">Gastos Notaría, Registro (€)</label>
              <input
                type="number"
                id="gastosNotariaRegistro"
                name="gastosNotariaRegistro"
                value={formData.gastosNotariaRegistro}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
            <div>
              <label htmlFor="gastosHipoteca" className="block text-sm font-semibold text-gray-700">Gastos hipoteca (€)</label>
              <input
                type="number"
                id="gastosHipoteca"
                name="gastosHipoteca"
                value={formData.gastosHipoteca}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
            <div>
              <label htmlFor="costeReforma" className="block text-sm font-semibold text-gray-700">Coste reforma (€)</label>
              <input
                type="number"
                id="costeReforma"
                name="costeReforma"
                value={formData.costeReforma}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
            <div>
              <label htmlFor="comisionCompra" className="block text-sm font-semibold text-gray-700">Comisión compra (€)</label>
              <input
                type="number"
                id="comisionCompra"
                name="comisionCompra"
                value={formData.comisionCompra}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
            <div>
              <label htmlFor="mobiliario" className="block text-sm font-semibold text-gray-700">Mobiliario (€)</label>
              <input
                type="number"
                id="mobiliario"
                name="mobiliario"
                value={formData.mobiliario}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-100 p-4 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Gastos Recurrentes</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="ibi" className="block text-sm font-semibold text-gray-700">IBI (€)</label>
              <input
                type="number"
                id="ibi"
                name="ibi"
                value={formData.ibi}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
            <div>
              <label htmlFor="basuras" className="block text-sm font-semibold text-gray-700">Basuras (€)</label>
              <input
                type="number"
                id="basuras"
                name="basuras"
                value={formData.basuras}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
            <div>
              <label htmlFor="seguroHogar" className="block text-sm font-semibold text-gray-700">Seguro Hogar (€)</label>
              <input
                type="number"
                id="seguroHogar"
                name="seguroHogar"
                value={formData.seguroHogar}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
            <div>
              <label htmlFor="seguroVida" className="block text-sm font-semibold text-gray-700">Seguro Vida (€)</label>
              <input
                type="number"
                id="seguroVida"
                name="seguroVida"
                value={formData.seguroVida}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
            <div>
              <label htmlFor="seguroImpago" className="block text-sm font-semibold text-gray-700">Seguro Impago (€)</label>
              <input
                type="number"
                id="seguroImpago"
                name="seguroImpago"
                value={formData.seguroImpago}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
            <div>
              <label htmlFor="comunidadPropietarios" className="block text-sm font-semibold text-gray-700">Comunidad de propietarios (€)</label>
              <input
                type="number"
                id="comunidadPropietarios"
                name="comunidadPropietarios"
                value={formData.comunidadPropietarios}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
            <div>
              <label htmlFor="mantenimiento" className="block text-sm font-semibold text-gray-700">Mantenimiento (€)</label>
              <input
                type="number"
                id="mantenimiento"
                name="mantenimiento"
                value={formData.mantenimiento}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
            <div>
              <label htmlFor="periodosVacios" className="block text-sm font-semibold text-gray-700">Periodos vacíos (días)</label>
              <input
                type="number"
                id="periodosVacios"
                name="periodosVacios"
                value={formData.periodosVacios}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
              />
            </div>
          </div>
        </section>
      </div>

      <section className="mt-8 bg-gray-100 p-4 rounded-lg border border-gray-200">
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

