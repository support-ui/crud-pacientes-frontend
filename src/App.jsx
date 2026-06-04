import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/pacientes';

const initialForm = {
  id: null,
  dni: '',
  nombres: '',
  apellido_paterno: '',
  apellido_materno: '',
  fecha_nacimiento: '',
  sexo: 'M',
  telefono: '',
  direccion: ''
};

function App() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      const res = await axios.get(API_URL);
      setPacientes(res.data);
    } catch (error) {
      console.error("Error cargando pacientes:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm(initialForm);
      cargarPacientes();
    } catch (error) {
      alert(error.response?.data?.error || "Ocurrió un error al guardar.");
    }
  };

  const handleEdit = (paciente) => {
    const fechaFormateada = paciente.fecha_nacimiento 
      ? paciente.fecha_nacimiento.split('T')[0] 
      : '';
    setForm({ ...paciente, fecha_nacimiento: fechaFormateada });
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar este paciente?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        cargarPacientes();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Pacientes</h1>
          <p className="text-sm text-slate-500 mt-1">Módulo Frontend estructurado con React, Vite y Tailwind CSS</p>
        </header>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Columna Formulario */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {form.id ? 'Editar Paciente' : 'Nuevo Paciente'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">DNI</label>
                <input type="text" name="dni" value={form.dni} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Nombres</label>
                <input type="text" name="nombres" value={form.nombres} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Ap. Paterno</label>
                  <input type="text" name="apellido_paterno" value={form.apellido_paterno} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Ap. Materno</label>
                  <input type="text" name="apellido_materno" value={form.apellido_materno} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Fecha de Nacimiento</label>
                <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Sexo</label>
                <select name="sexo" value={form.sexo} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Teléfono</label>
                <input type="text" name="telefono" value={form.telefono} onChange={handleChange} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Dirección</label>
                <textarea name="direccion" value={form.direccion} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none" />
              </div>
              
              <div className="pt-2">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm">
                  {form.id ? 'Actualizar Paciente' : 'Registrar Paciente'}
                </button>
                {form.id && (
                  <button type="button" onClick={() => setForm(initialForm)} className="w-full mt-2 bg-slate-500 hover:bg-slate-600 text-white font-medium py-2 rounded-lg text-sm transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Columna Listado */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto h-fit">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Listado de Pacientes</h2>
            {pacientes.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No hay pacientes registrados activos actualmente.</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">DNI</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre Completo</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Teléfono</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pacientes.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-slate-900">{p.dni}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{p.nombre_completo}</td>
                      <td className="py-3 px-4 text-sm text-slate-500">{p.telefono || '-'}</td>
                      <td className="py-3 px-4 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" onClick={() => handleEdit(p)} className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-2.5 py-1.5 rounded font-medium transition-colors">
                            Editar
                          </button>
                          <button type="button" onClick={() => handleDelete(p.id)} className="bg-rose-500 hover:bg-rose-600 text-white text-xs px-2.5 py-1.5 rounded font-medium transition-colors">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;