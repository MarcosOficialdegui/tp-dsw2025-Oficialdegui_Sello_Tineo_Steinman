import React, { useState } from "react";
import SearchBar from "../components/SearchBar";

const Home: React.FC = () => {
  const [filters, setFilters] = useState({
    ciudad: "",
    deporte: "",
    fecha: "",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <SearchBar filters={filters} onChange={handleFilterChange} />

    </div>
  );
};

export default Home;
