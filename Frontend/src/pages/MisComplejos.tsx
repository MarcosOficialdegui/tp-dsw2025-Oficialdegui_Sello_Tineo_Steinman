import { useEffect, useState } from 'react';
import ComplejoList from '../components/ComplejoList';
import './MisComplejos.css';
import { useNavigate } from 'react-router-dom';
import ComplejoForm from '../components/ComplejoForm';
import { ChevronDown } from 'lucide-react';


export default function MisComplejos() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [registrar, setRegistrar] = useState(false);

    const [complejos, setComplejos] = useState<any[]>([]);

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

            const complejos = await data.json();
            setComplejos(complejos.complejos || []);
            console.log(complejos);


        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
        }

        setLoading(false);
    };

    const handleVerComplejo = (complejoId: string) => {
        navigate(`/complejo/${complejoId}`);
    };

    const handleEliminarComplejo = async (complejoId: string) => {
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
        } else {
            alert("No se pudo eliminar el complejo.");
        }
    } catch (error) {
        console.error("Error al eliminar el complejo:", error);
    }
};



    useEffect(() => {
        llamarDatos();
    }, []);



    return (
        <>
            <div className='main-container'>


                <section style={{ marginTop: 24 }}>
                    {loading ? (
                        <p className="loading-message">Cargando...</p>
                    ) : complejos.length === 0 ? (
                        <p className="no-results-message">No hay complejos cargados.</p>
                    ) : (
                        <div className='complejos-grid'>
                            <ComplejoList
                                complejos={complejos}
                                onComplejoClick={handleVerComplejo}
                                nombreLista='Mis Complejos'
                                onEliminarComplejo={handleEliminarComplejo}
                            />
                        </div>
                    )}
                </section>




                <div className='desplegar'>

                    <button onClick={() => setRegistrar(prev => (!prev))}>
                        <ChevronDown size={20} /> Registrar Complejo <ChevronDown size={20} />
                    </button>

                </div>

                <div className={`desplegar-form ${registrar ? 'abierto' : ''}`}>
                    <ComplejoForm />
                </div>


            </div>



        </>
    );

}