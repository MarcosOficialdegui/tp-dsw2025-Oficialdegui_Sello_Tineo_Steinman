
import "./ComplejoList.css";
import {
  //MdStadium,        // Estadio/Complejo
  MdLocationOn,     // Ubicación
  MdLocationCity,   // Ciudad
  MdSportsSoccer,   // Deportes
  MdDelete          // Eliminar
} from "react-icons/md";


type Cancha = {
  tipoCancha: string;
  cantidad?: number;
};

type Complejo = {
  _id: string;
  nombre: string;
  direccion?: string;
  ciudad?: {
    _id: string;
    nombre: string;
  };
  imagen?: string;
  canchas?: Cancha[];
};

interface Props {
  complejos: Complejo[];
  onComplejoClick: (complejoId: string) => void;
  nombreLista: string;
  onEliminarComplejo?: (complejoId: string) => void;
}
  

function ComplejoList({ complejos, onComplejoClick, nombreLista, onEliminarComplejo }: Props) {
  return (
    <div className="complejo-list">
      <h2>{nombreLista}</h2>
      <div className="complejos-grid">
        {complejos.map((complejo) => (
          <div className="complejo-card" key={complejo._id}
          onClick={() => onComplejoClick(complejo._id)}>

            <img
              src={complejo.imagen || "/images/cancha-placeholder.jpg"}
              alt={complejo.nombre}
              className="complejo-img"
            />
            <div className="complejo-info">
              <h3>{complejo.nombre}</h3>
              <p>
                <MdLocationOn size={16} color="#4CAF50" />
                &nbsp;{complejo.direccion}
              </p>
              <p>
                <MdLocationCity size={16} color="#4CAF50" />
                &nbsp;{complejo.ciudad?.nombre || 'Ciudad no especificada'}
              </p>
              <p>
                <MdSportsSoccer size={16} color="#4CAF50" />
                &nbsp;Tipos de canchas:{" "}
                {complejo.canchas?.map((c) => c.tipoCancha).join(", ") || "—"}
              </p>
              {onEliminarComplejo && (
                <button
                  className="eliminar-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEliminarComplejo(complejo._id);
                  }}
                >
                  <MdDelete size={18} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComplejoList;

