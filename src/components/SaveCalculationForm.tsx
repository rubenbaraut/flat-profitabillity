import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label"
import { X } from 'lucide-react'

interface SaveCalculationFormProps {
  onSave: (name: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function SaveCalculationForm({ onSave, onClose, isOpen }: SaveCalculationFormProps) {
  const [formName, setFormName] = useState('');

  const handleSave = () => {
    if (formName.trim()) {
      onSave(formName);
      setFormName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Guardar cálculo</DialogTitle>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="formName" className="text-right">
              Nombre
            </Label>
            <Input
              id="formName"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSave} className="bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200">
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

