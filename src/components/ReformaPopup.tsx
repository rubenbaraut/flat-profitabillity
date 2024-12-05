import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input";
import { Label } from "./ui/label"

interface ReformaDetails {
  electricidad: number;
  fontaneria: number;
  ventanas: number;
  suelo: number;
  electrodomesticos: number;
  pintura: number;
  homeStaging: number;
  altaSuministros: number;
}

interface ReformaPopupProps {
  reformaDetails: ReformaDetails;
  onReformaChange: (details: ReformaDetails) => void;
}

export function ReformaPopup({ reformaDetails, onReformaChange }: ReformaPopupProps) {
  const [localDetails, setLocalDetails] = React.useState(reformaDetails);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalDetails(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSave = () => {
    onReformaChange(localDetails);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
        >
          Desglosar costes de reforma
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-100 border border-gray-200">
        <DialogHeader>
          <DialogTitle>Desglose de costes de reforma</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(localDetails).map(([key, value]) => (
            <div key={key} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={key} className="text-right">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Label>
              <Input
                id={key}
                name={key}
                type="number"
                value={value}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <DialogTrigger asChild>
          <Button 
            onClick={handleSave}
            className="bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
          >
            Guardar
          </Button>
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}

