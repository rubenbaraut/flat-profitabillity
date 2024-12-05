import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  }, []);

  const handleITPChange = useCallback((e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setCustomITP(true);
    } else {
      setCustomITP(false);
      const numValue = Number(value);
      setFormData(prev => ({
        ...prev,
        itp: numValue,
        impuestoITP: (prev.precioCompra * numValue) / 100
      }));
    }
  }, []);

  const calculateResults = useMemo(() => {
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
  }, [formData, type]);

  const results = calculateResults;

  const Label = ({ htmlFor, label }: { htmlFor: string; label: string }) => (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700">{label}</label>
  );

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6">
          <section className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Datos Generales</h2>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="direccion"
                  label="Dirección de la vivienda"
                />
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
                <Label
                  htmlFor="comunidadAutonoma"
                  label="Comunidad Autónoma"
                />
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
                  <Label
                    htmlFor="precioAlquiler"
                    label="Precio alquiler (€/mes)"
                  />
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
                    <Label
                      htmlFor="numeroHabitaciones"
                      label="Número de habitaciones"
                    />
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
                    <Label
                      htmlFor="precioHabitacion"
                      label="Precio por habitación (€/mes)"
                    />
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
                    <Label
                      htmlFor="precioAlquiler"
                      label="Precio alquiler (€/noche)"
                    />
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
                    <Label
                      htmlFor="ocupacionAnual"
                      label="Ocupación anual (%)"
                    />
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
                    <Label
                      htmlFor="comisionPlataforma"
                      label="Comisión plataforma (%)"
                    />
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
              <Label
                htmlFor="precioCompra"
                label="Precio de compra (€)"
              />
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
              <Label
                htmlFor="itp"
                label="ITP (%)"
              />
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
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        itp: value,
                        impuestoITP: (prev.precioCompra * value) / 100
                      }));
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 px-3"
                    placeholder="ITP personalizado"
                    step="0.1"
                  />
                )}
              </div>
            </div>
            <div>
              <Label
                htmlFor="impuestoITP"
                label="Impuesto ITP (€)"
              />
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
              <Label
                htmlFor="gastosNotariaRegistro"
                label="Gastos Notaría, Registro (€)"
              />
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
              <Label
                htmlFor="gastosHipoteca"
                label="Gastos hipoteca (€)"
              />
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
              <Label
                htmlFor="costeReforma"
                label="Coste reforma (€)"
              />
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
              <Label
                htmlFor="comisionCompra"
                label="Comisión compra (€)"
              />
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
              <Label
                htmlFor="mobiliario"
                label="Mobiliario (€)"
              />
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
              <Label
                htmlFor="ibi"
                label="IBI (€)"
              />
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
              <Label
                htmlFor="basuras"
                label="Basuras (€)"
              />
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
              <Label
                htmlFor="seguroHogar"
                label="Seguro Hogar (€)"
              />
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
              <Label
                htmlFor="seguroVida"
                label="Seguro Vida (€)"
              />
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
              <Label
                htmlFor="seguroImpago"
                label="Seguro Impago (€)"
              />
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
              <Label
                htmlFor="comunidadPropietarios"
                label="Comunidad de propietarios (€)"
              />
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
              <Label
                htmlFor="mantenimiento"
                label="Mantenimiento (€)"
              />
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
              <Label
                htmlFor="periodosVacios"
                label="Periodos vacíos (días)"
              />
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

