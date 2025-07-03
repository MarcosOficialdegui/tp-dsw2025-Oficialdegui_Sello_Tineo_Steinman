import { useEffect, useState } from 'react';
import api from '../services/api';
import CanchaCard from '../components/CanchaCard';
import './Home.css';

function Home() {
  const [canchas, setCanchas] = useState([]);

  useEffect(() => {
    api.get('/canchas')
      .then((res) => setCanchas(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="home-container">
      <h1>Canchas Disponibles</h1>
      <div className="card-grid">
        {canchas.length === 0 ? (
          <p>No hay canchas disponibles por el momento.</p>
        ) : (
          canchas.map((cancha) => (
            <CanchaCard key={cancha._id} cancha={cancha} />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
