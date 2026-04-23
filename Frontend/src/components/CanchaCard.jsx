import './CanchaCard.css';

function CanchaCard({ cancha }) {
  return (
    <div className="card">
      <h2>{cancha.nombre}</h2>
      <p><strong>Tipo:</strong> {cancha.tipoCancha?.nombre}</p>
      <p><strong>Precio/turno:</strong> ${cancha.precioTurno}</p>
      <p><strong>Complejo:</strong> {cancha.complejo?.nombre}</p>
      <button className="btn">Ver disponibilidad</button>
    </div>
  );
}

export default CanchaCard;
