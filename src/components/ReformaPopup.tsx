import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { X } from 'lucide-react'

interface ReformaDetails {
  materiales: number;
  manoDeObra: number;
  otros: number;
  costeElectricidad: number;
  costeFontaneria: number;
  costeAlbanileria: number;
  costePuertas: number;
  costeVentanas: number;
  costeSuelo: number;
  costePintura: number;
  costeHomeStaging: number;
  costeAltaSuministros: number;
}

interface ReformaPopupProps {
  reformaDetails: ReformaDetails;
  onReformaChange: (details: ReformaDetails) => void;
  onClose: () => void;
}

const formatLabel = (key: string): string => {
  const labels: { [key: string]: string } = {
    materiales: "Materiales",
    manoDeObra: "Mano de obra",
    otros: "Otros",
    costeElectricidad: "Coste electricidad",
    costeFontaneria: "Coste fontanería",
    costeAlbanileria: "Coste albañilería",
    costePuertas: "Coste puertas",
    costeVentanas: "Coste ventanas",
    costeSuelo: "Coste suelo",
    costePintura: "Coste pintura",
    costeHomeStaging: "Coste home staging",
    costeAltaSuministros: "Coste alta suministros"
  };
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

export function ReformaPopup({ reformaDetails, onReformaChange, onClose }: ReformaPopupProps) {
  const [localDetails, setLocalDetails] = useState(reformaDetails);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = Object.values(localDetails).reduce((sum, value) => sum + value, 0);
    setTotal(newTotal);
  }, [localDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalDetails(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSave = () => {
    onReformaChange(localDetails);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white">
        <DialogHeader>
          <DialogTitle>Desglose de costes de reforma</DialogTitle>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <div className="grid grid-cols-2 gap-4 py-4">
          {Object.entries(localDetails).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <Label htmlFor={key} className="w-1/2 text-right">
                {formatLabel(key)}
              </Label>
              <Input
                id={key}
                name={key}
                type="number"
                value={value}
                onChange={handleInputChange}
                className="w-1/2"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-lg font-bold">
            Total: {total.toFixed(2)}€
          </div>
          <Button onClick={handleSave} className="bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200">
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

