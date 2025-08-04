import { useState } from 'react';
import SearchBar from '../components/SearchBar';

type Complejo = {
  _id: string;
  nombre: string;
  direccion: string;
  localidad: string;
};

type Filtros = {
  ciudad: string;
  tipoCancha: string;
  fecha: string;
};

const Home = () => {
  const [filters, setFilters] = useState<Filtros>({
    ciudad: '',
    tipoCancha: '',
    fecha: '',
  });

  const [complejos, setComplejos] = useState<Complejo[]>([]);

  const handleFilterChange = (name: keyof Filtros, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const buscarComplejos = async (filtros: Filtros) => {
    console.log('Buscando con filtros:', filtros);
    try {
      const res = await fetch(
        `http://localhost:3000/api/complejos?ciudad=${filtros.ciudad}&tipo=${filtros.tipoCancha}`
      );
      const data = await res.json();
      console.log('Recibidos:', data);
      setComplejos(data);
    } catch (error) {
      console.error('Error al buscar complejos', error);
    }
  };

  return (
    <div>
      <SearchBar
        filters={filters}
        onChange={handleFilterChange}
        onSearch={() => buscarComplejos(filters)}
      />

      <div>
        <h2>Complejos encontrados:</h2>
        {complejos.length === 0 ? (
          <p>No se encontraron complejos</p>
        ) : (
          <ul>
            {complejos.map((complejo) => (
              <li key={complejo._id}>
                <h3>{complejo.nombre}</h3>
                <p>Dirección: {complejo.direccion}</p>
                <p>Ciudad: {complejo.localidad}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
