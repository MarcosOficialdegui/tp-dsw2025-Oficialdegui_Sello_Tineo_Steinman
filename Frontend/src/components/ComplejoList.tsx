
import "./ComplejoList.css";

type Cancha = {
  tipoCancha: string;
  cantidad?: number;
};

type Complejo = {
  _id: string;
  nombre: string;
  direccion?: string;
  ciudad?: string;
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
      <h2>🏟️ {nombreLista}</h2>
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
              <p>📍 {complejo.direccion}</p>
              <p>🏙️ {complejo.ciudad}</p>
              <p>
                ⚽ Tipos de canchas:{" "}
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
                  🗑️ Eliminar
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

