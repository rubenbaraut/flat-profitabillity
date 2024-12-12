import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { RentabilityTabs } from '../components/RentabilityTabs';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/use-toast';
import { Toaster } from '../components/ui/toaster';

interface SavedForm {
  id: string;
  name: string;
  data: any;
}

const CalculoDeRentabilidad: React.FC = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  const [currentForm, setCurrentForm] = useState<SavedForm | null>(null);
  const [formName, setFormName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      loadSavedForms();
    }
  }, [session]);

  const loadSavedForms = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('rentability_forms')
      .select('*')
      .eq('user_id', session?.user.id);

    if (error) {
      console.error('Error loading saved forms:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los formularios guardados.',
        variant: 'destructive',
      });
    } else {
      setSavedForms(data || []);
    }
    setIsLoading(false);
  };

  const saveForm = async (formData: any) => {
    if (!session) {
      toast({
        title: 'Error',
        description: 'Debes iniciar sesión para guardar formularios.',
        variant: 'destructive',
      });
      return;
    }

    if (!formName) {
      toast({
        title: 'Error',
        description: 'Por favor, ingrese un nombre para el formulario.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from('rentability_forms')
      .insert({
        user_id: session.user.id,
        name: formName,
        data: formData,
      })
      .select();

    if (error) {
      console.error('Error saving form:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el formulario.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Éxito',
        description: 'Formulario guardado correctamente.',
      });
      setFormName('');
      loadSavedForms();
    }
    setIsLoading(false);
  };

  const deleteForm = async (formId: string) => {
    setIsLoading(true);
    const { error } = await supabase
      .from('rentability_forms')
      .delete()
      .eq('id', formId);

    if (error) {
      console.error('Error deleting form:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el formulario.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Éxito',
        description: 'Formulario eliminado correctamente.',
      });
      loadSavedForms();
      if (currentForm?.id === formId) {
        setCurrentForm(null);
      }
    }
    setIsLoading(false);
  };

  const loadForm = (form: SavedForm) => {
    setCurrentForm(form);
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <main className="p-6 container mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Calculadora de Rentabilidad</h1>
        <div className="flex">
          <div className="w-1/4 bg-white p-4 mr-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Formularios guardados</h2>
            {session ? (
              isLoading ? (
                <p>Cargando formularios...</p>
              ) : (
                <ul className="space-y-2">
                  {savedForms.map((form) => (
                    <li key={form.id} className="flex justify-between items-center">
                      <button
                        onClick={() => loadForm(form)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {form.name}
                      </button>
                      <button
                        onClick={() => deleteForm(form.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              <p>Inicia sesión para ver tus formularios guardados.</p>
            )}
          </div>
          <div className="w-3/4 bg-white shadow rounded-lg p-6">
            <RentabilityTabs initialData={currentForm?.data} onSave={saveForm} />
          </div>
        </div>
      </main>
      <Toaster/>
    </div>
  );
};

export default CalculoDeRentabilidad;

