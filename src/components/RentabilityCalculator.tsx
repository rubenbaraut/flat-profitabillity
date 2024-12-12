import React, { useState, useMemo, useCallback, useEffect } from 'react';
import defaultValues from '../../public/data/default-values.json';
import { ReformaPopup } from './ReformaPopup';
import { SaveCalculationForm } from './SaveCalculationForm';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';

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
  perdidaAlquiler: number;
  precioAlquiler: number;
  numeroHabitaciones?: number;
  precioHabitacion?: number;
  ocupacionAnual?: number;
  comisionPlataforma?: number;
  name?: string;
}

const comunidadesAutonomas = Object.keys(defaultValues.itpValues);

interface RentabilityCalculatorProps {
  type: 'traditional' | 'rooms' | 'touristic';
  initialData?: FormData;
  onSave: (formData: FormData) => void;
}

const itpOptions = [4, 5, 6, 7, 8, 9, 10, 11, 12];

const RentabilityCalculator: React.FC<RentabilityCalculatorProps> = ({ type, initialData, onSave }) => {
  const [formData, setFormData] = useState<FormData>(() => {
    if (initialData) {
      return { ...defaultValues, ...initialData };
    }
    return {
      ...defaultValues,
      numeroHabitaciones: 1,
      precioHabitacion: 0,
      ocupacionAnual: 100,
      comisionPlataforma: 0,
      itp: 0,
      perdidaAlquiler: 0,
    };
  });

  const [customITP, setCustomITP] = useState<boolean>(false);
  const [showReformaDetails, setShowReformaDetails] = useState(false);
  const [reformaDetails, setReformaDetails] = useState({
    materiales: 0,
    manoDeObra: 0,
    otros: 0,
    costeElectricidad: 0,
    costeFontaneria: 0,
    costeAlbanileria: 0,
    costePuertas: 0,
    costeVentanas: 0,
    costeSuelo: 0,
    costePintura: 0,
    costeHomeStaging: 0,
    costeAltaSuministros: 0
  });
  const [showSaveForm, setShowSaveForm] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({ ...prevData, ...initialData }));
    }
  }, [initialData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedData = { ...prev, [name]: name === 'direccion' || name === 'comunidadAutonoma' ? value : value === '' ? '' : Number(value) };
      
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

  const handleReformaDetailsChange = (newDetails: typeof reformaDetails) => {
    setReformaDetails(newDetails);
    setFormData(prev => ({
      ...prev,
      costeReforma: Object.values(newDetails).reduce((a, b) => a + b, 0)
    }));
  };

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
      formData.mantenimiento + formData.perdidaAlquiler;

    const ingresoNeto = type === 'touristic' 
      ? ingresoAnual * (1 - formData.comisionPlataforma! / 100) 
      : ingresoAnual;

    const rentabilidadBruta = (ingresoAnual / inversionTotal) * 100;
    const rentabilidadNeta = ((ingresoNeto - gastosAnuales) / inversionTotal) * 100;
    const roce = ((ingresoNeto - gastosAnuales) / (formData.precioCompra + formData.costeReforma)) * 100;
    const cashflowAnual = ingresoNeto - gastosAnuales;
    const cashflowMensual = cashflowAnual / 12;

    return {
      rentabilidadBruta: isNaN(rentabilidadBruta) ? "0.00" : rentabilidadBruta.toFixed(2),
      rentabilidadNeta: isNaN(rentabilidadNeta) ? "0.00" : rentabilidadNeta.toFixed(2),
      roce: isNaN(roce) ? "0.00" : roce.toFixed(2),
      cashflowAnual: isNaN(cashflowAnual) ? "0.00" : cashflowAnual.toFixed(2),
      cashflowMensual: isNaN(cashflowMensual) ? "0.00" : cashflowMensual.toFixed(2),
    };
  }, [formData, type]);

  const results = calculateResults;

  const Label = ({ htmlFor, label }: { htmlFor: string; label: string }) => (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-gray-700">{label}</label>
  );

  const handleSaveCalculation = (name: string) => {
    onSave({ ...formData, name });
    setShowSaveForm(false);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0') {
      e.target.value = '';
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      e.target.value = '0';
      handleInputChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

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
                <Input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <Input
                    type="number"
                    id="precioAlquiler"
                    name="precioAlquiler"
                    value={formData.precioAlquiler}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
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
                    <Input
                      type="number"
                      id="numeroHabitaciones"
                      name="numeroHabitaciones"
                      value={formData.numeroHabitaciones}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="precioHabitacion"
                      label="Precio por habitación (€/mes)"
                    />
                    <Input
                      type="number"
                      id="precioHabitacion"
                      name="precioHabitacion"
                      value={formData.precioHabitacion}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
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
                    <Input
                      type="number"
                      id="precioAlquiler"
                      name="precioAlquiler"
                      value={formData.precioAlquiler}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="ocupacionAnual"
                      label="Ocupación anual (%)"
                    />
                    <Input
                      type="number"
                      id="ocupacionAnual"
                      name="ocupacionAnual"
                      value={formData.ocupacionAnual}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="comisionPlataforma"
                      label="Comisión plataforma (%)"
                    />
                    <Input
                      type="number"
                      id="comisionPlataforma"
                      name="comisionPlataforma"
                      value={formData.comisionPlataforma}
                      onChange={handleInputChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
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
              <Input
                type="number"
                id="precioCompra"
                name="precioCompra"
                value={formData.precioCompra}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {itpOptions.map(option => (
                    <option key={option} value={option}>{option}%</option>
                  ))}
                  <option value="custom">Personalizado</option>
                </select>
                {customITP && (
                  <Input
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
                    placeholder="ITP personalizado"
                    step="0.1"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                )}
              </div>
            </div>
            <div>
              <Label
                htmlFor="impuestoITP"
                label="Impuesto ITP (€)"
              />
              <Input
                type="number"
                id="impuestoITP"
                name="impuestoITP"
                value={formData.impuestoITP}
                readOnly
              />
            </div>
            <div>
              <Label
                htmlFor="gastosNotariaRegistro"
                label="Gastos Notaría, Registro (€)"
              />
              <Input
                type="number"
                id="gastosNotariaRegistro"
                name="gastosNotariaRegistro"
                value={formData.gastosNotariaRegistro}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <Label
                htmlFor="gastosHipoteca"
                label="Gastos hipoteca (€)"
              />
              <Input
                type="number"
                id="gastosHipoteca"
                name="gastosHipoteca"
                value={formData.gastosHipoteca}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <Label
                htmlFor="costeReforma"
                label="Coste reforma (€)"
              />
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  id="costeReforma"
                  name="costeReforma"
                  value={formData.costeReforma}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="flex-grow"
                />
                <Button
                  onClick={() => setShowReformaDetails(true)}
                  className="whitespace-nowrap bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
                >
                  Desglosar
                </Button>
              </div>
            </div>
            <div>
              <Label
                htmlFor="comisionCompra"
                label="Comisión compra (€)"
              />
              <Input
                type="number"
                id="comisionCompra"
                name="comisionCompra"
                value={formData.comisionCompra}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <Label
                htmlFor="mobiliario"
                label="Mobiliario (€)"
              />
              <Input
                type="number"
                id="mobiliario"
                name="mobiliario"
                value={formData.mobiliario}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
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
              <Input
                type="number"
                id="ibi"
                name="ibi"
                value={formData.ibi}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <Label
                htmlFor="basuras"
                label="Basuras (€)"
              />
              <Input
                type="number"
                id="basuras"
                name="basuras"
                value={formData.basuras}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <Label
                htmlFor="seguroHogar"
                label="Seguro Hogar (€)"
              />
              <Input
                type="number"
                id="seguroHogar"
                name="seguroHogar"
                value={formData.seguroHogar}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <Label
                htmlFor="seguroVida"
                label="Seguro Vida (€)"
              />
              <Input
                type="number"
                id="seguroVida"
                name="seguroVida"
                value={formData.seguroVida}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <Label
                htmlFor="seguroImpago"
                label="Seguro Impago (€)"
              />
              <Input
                type="number"
                id="seguroImpago"
                name="seguroImpago"
                value={formData.seguroImpago}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <Label
                htmlFor="comunidadPropietarios"
                label="Comunidad de propietarios (€)"
              />
              <Input
                type="number"
                id="comunidadPropietarios"
                name="comunidadPropietarios"
                value={formData.comunidadPropietarios}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <Label
                htmlFor="mantenimiento"
                label="Mantenimiento (€)"
              />
              <Input
                type="number"
                id="mantenimiento"
                name="mantenimiento"
                value={formData.mantenimiento}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
            <div>
              <Label
                htmlFor="perdidaAlquiler"
                label="Pérdida por periodos vacíos (€)"
              />
              <Input
                type="number"
                id="perdidaAlquiler"
                name="perdidaAlquiler"
                value={formData.perdidaAlquiler}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
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
      <Button onClick={() => setShowSaveForm(true)} className="mt-4 bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200">
        Guardar cálculo
      </Button>
      {showReformaDetails && (
        <ReformaPopup 
          reformaDetails={reformaDetails}
          onReformaChange={(newDetails) => {
            setReformaDetails(newDetails);
            setFormData(prev => ({
              ...prev,
              costeReforma: Object.values(newDetails).reduce((a, b) => a + b, 0)
            }));
          }}
          onClose={() => setShowReformaDetails(false)}
        />
      )}
      <SaveCalculationForm
        isOpen={showSaveForm}
        onSave={handleSaveCalculation}
        onClose={() => setShowSaveForm(false)}
      />
    </div>
  );
};

export default RentabilityCalculator;

