import React from 'react';
import { Button } from './ui/button';

interface SideMenuProps {
  savedForms: any[];
  loadForm: (form: any) => void;
  deleteForm: (id: string) => void;
  isLoading: boolean;
  session: any;
}

const SideMenu: React.FC<SideMenuProps> = ({
  savedForms,
  loadForm,
  deleteForm,
  isLoading,
  session
}) => {
  return (
    <aside className="w-64 bg-white p-4 border-r border-gray-200">
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
    </aside>
  );
};

export default SideMenu;

