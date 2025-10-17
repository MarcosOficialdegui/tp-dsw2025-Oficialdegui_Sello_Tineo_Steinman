import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Calendar from "../components/Calendar";
import ComplejoInfo from "../components/ComplejoInfo";
import "./PerfilComplejo.css";

interface ComplejoData {
  _id: string;
  nombre: string;
  direccion: string;
  ciudad: { _id: string; nombre: string; };
  servicios: string[];
  canchas: Array<{
    _id?: string;
    nombre?: string;
    tipoCancha: string;
    precioHora: number;
    disponible: boolean;
  }>;
}

export default function Complejo() {
  const { id } = useParams<{ id: string }>();
  const [complejo, setComplejo] = useState<ComplejoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seleccionCancha, setSeleccionCancha] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchComplejo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/complejos/${id}`);

        if (!response.ok) {
          throw new Error('Complejo no encontrado');
        }

        const data = await response.json();
        setComplejo(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComplejo();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="complejo-container">
        <div className="loading">Cargando complejo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="complejo-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!complejo) {
    return (
      <div className="complejo-container">
        <div className="error">Complejo no encontrado</div>
      </div>
    );
  }


  // Obtener los datos de los componentes hijos
  const handleSeleccionCancha = (canchaId: string) => {
    setSeleccionCancha(canchaId);
  }


  return (
    <div className="complejo-container">
      <main className="complejo-main">
        <div className="complejo-grid">
          {seleccionCancha && seleccionCancha !== "" ? (
            <div>
              <Calendar complejoId={complejo._id} canchaId = {seleccionCancha} />
            </div>
          ) : null}

          <div>
            <ComplejoInfo complejo={complejo}
              onSeleccionCancha={handleSeleccionCancha} />
          </div>
        </div>
      </main>
    </div>
  );
}
