import { useEffect, useState } from 'react';
import './MisComplejos.css';
import { useNavigate } from 'react-router-dom';
import ComplejoForm from '../components/ComplejoForm';
import ReservasCalendario from '../components/ReservasCalendar.tsx';
import {
  MdAdd,
  MdExpandMore,
  MdExpandLess,
  MdLocationOn,
  MdSportsSoccer,
  MdDelete,
  MdCalendarToday,
  MdVisibility,
  MdImage
} from 'react-icons/md';
import { mostrarError, mostrarExito } from '../utils/notificaciones.ts';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { construirUrlImagen, IMAGEN_PREDETERMINADA_COMPLEJO } from '../utils/constants.ts'; 

interface Complejo {
  _id: string;
  nombre: string;
  direccion: string;
  ciudad: {
    _id: string;
    nombre: string;
  };
  servicios: string[];
  canchas: any[];
  imagen?: string;
}

export default function MisComplejos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registrar, setRegistrar] = useState(false);
  const [complejos, setComplejos] = useState<Complejo[]>([]);
  const [complejoExpandido, setComplejoExpandido] = useState<string | null>(null);

  const llamarDatos = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No se encontró el token de autenticación.");
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      const data = await fetch("http://localhost:3000/api/usuarios/miscomplejos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      if (!data.ok) {
        console.error("Error en la respuesta del servidor:", data.statusText);
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      const response = await data.json();
      setComplejos(response.complejos || []);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }

    setLoading(false);
  };

  const handleVerComplejo = (complejoId: string) => {
    navigate(`/complejo/${complejoId}`);
  };

  const handleCambiarImagen = (complejoId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) return;
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        mostrarError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        mostrarError('La imagen no debe superar los 5MB');
        return;
      }

      const formData = new FormData();
      formData.append('imagen', file);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/api/complejos/${complejoId}/imagen`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (res.ok) {
          mostrarExito('Imagen actualizada correctamente');
          llamarDatos(); // Recargar los complejos
        } else {
          const data = await res.json();
          mostrarError(data.error || 'Error al actualizar la imagen');
        }
      } catch (error) {
        console.error('Error al actualizar imagen:', error);
        mostrarError('Error de conexión al actualizar la imagen');
      }
    };
    
    input.click();
  };

const handleEliminarComplejo = (complejoId: string) => {
  confirmAlert({
    title: 'Confirmación',
    message: '¿Estás seguro de que deseas eliminar este complejo?',
    buttons: [
      {
        label: 'Sí',
        onClick: async () => {
          const token = localStorage.getItem("token");
          if (!token) return;

          try {
            const res = await fetch(`http://localhost:3000/api/complejos/${complejoId}`, {
              method: "DELETE",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            });

            if (res.ok) {
              setComplejos(prev => prev.filter(c => c._id !== complejoId));
              mostrarExito("Complejo eliminado correctamente");
            } else {
              mostrarError("No se pudo eliminar el complejo.");
            }
          } catch (error) {
            console.error("Error al eliminar el complejo:", error);
            mostrarError("Error al eliminar el complejo");
          }
        }
      },
      {
        label: 'No',
        onClick: () => {
         
        }
      }
    ]
  });
};
  const toggleExpansion = (complejoId: string) => {
    setComplejoExpandido(complejoExpandido === complejoId ? null : complejoId);
  };

  useEffect(() => {
    llamarDatos();
  }, []);

  return (
    <div className='main-container'>
      {/* Botón para agregar complejo */}
      <div className='desplegar'>
        <button onClick={() => setRegistrar(prev => !prev)}>
          {registrar ? <MdExpandLess size={20} /> : <MdAdd size={20} />}
          {registrar ? "Cancelar" : "Registrar Complejo"}
        </button>
      </div>

      {/* Formulario de registro */}
      <div className={`desplegar-form ${registrar ? 'abierto' : ''}`}>
        <ComplejoForm />
      </div>

      {/* Lista de complejos */}
      <section style={{ marginTop: 24 }}>
        {loading ? (
          <p className="loading-message">Cargando...</p>
        ) : complejos.length === 0 ? (
          <p className="no-results-message">No tienes complejos cargados.</p>
        ) : (
          <div className='complejos-lista'>
            {complejos.map((complejo) => (
              <div key={complejo._id} className='complejo-card'>
                {/* Header de la card con imagen */}
                <div className='complejo-header'>
                  {/* Imagen del complejo */}
                  <div className='complejo-imagen-container'>
                    <img 
                      src={construirUrlImagen(complejo.imagen, complejo.canchas?.[0]?.tipoCancha)}
                      alt={complejo.nombre}
                      className='complejo-imagen'
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = IMAGEN_PREDETERMINADA_COMPLEJO;
                      }}
                    />
                    <button 
                      className='btn-cambiar-imagen'
                      onClick={() => handleCambiarImagen(complejo._id)}
                      title="Cambiar imagen"
                    >
                      <MdImage size={18} />
                      Cambiar imagen
                    </button>
                  </div>

                  <div className='complejo-info'>
                    <h2>{complejo.nombre}</h2>
                    <div className='complejo-detalles'>
                      <span className='detalle-item'>
                        <MdLocationOn size={18} />
                        {complejo.direccion}, {complejo.ciudad?.nombre || "Sin ciudad"}
                      </span>
                      <span className='detalle-item'>
                        <MdSportsSoccer size={18} />
                        {complejo.canchas?.length || 0} canchas
                      </span>
                    </div>
                  </div>

                  <div className='complejo-acciones'>
                    <button
                      className='btn-ver'
                      onClick={() => handleVerComplejo(complejo._id)}
                    >
                      <MdVisibility size={18} />
                      Ver Complejo
                    </button>
                    <button
                      className='btn-ver-reservas'
                      onClick={() => toggleExpansion(complejo._id)}
                    >
                      <MdCalendarToday size={18} />
                      {complejoExpandido === complejo._id ? "Ocultar" : "Ver"} Reservas
                      {complejoExpandido === complejo._id ?
                        <MdExpandLess size={20} /> :
                        <MdExpandMore size={20} />
                      }
                    </button>
                    <button
                      className='btn-eliminar'
                      onClick={() => handleEliminarComplejo(complejo._id)}
                    >
                      <MdDelete size={18} />
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Sección de reservas expandible */}
                {complejoExpandido === complejo._id && (
                  <div className='reservas-section'>
                    <ReservasCalendario complejoId={complejo._id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}