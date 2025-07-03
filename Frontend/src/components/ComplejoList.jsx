
import React, { useEffect, useState } from 'react';
import './ComplejoList.css'; 

function ComplejoList() {
  const [complejos, setComplejos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/complejos') 
      .then(res => res.json())
      .then(data => setComplejos(data))
      .catch(err => console.error('Error al obtener complejos:', err));
  }, []);

  return (
    <div className="complejo-list">
      <h2>Complejos Deportivos</h2>
      <ul>
        {complejos.map(complejo => (
          <li key={complejo._id}>
            <h3>{complejo.nombre}</h3>
            <p>Dirección: {complejo.direccion}</p>
            <p>Localidad: {complejo.localidad}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ComplejoList;
