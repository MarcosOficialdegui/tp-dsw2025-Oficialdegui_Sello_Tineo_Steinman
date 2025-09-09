import "./Perfil.css"
import { useState, useEffect } from 'react';

interface User {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    // reservas: any[];                           AGREGAR LOS OBJETOS RESERVAS
}

const Perfil = () => {



    const [userData, setUserData] = useState<User>({
        id: 0,
        nombre: '',
        apellido: '',
        email: '',
        // reservas
    });

    const llamarDatos = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No se encontró el token de autenticación.");
                localStorage.removeItem("token");
                window.location.href = "/"; 
                return;
            }

            const data = await fetch("http://localhost:3000/api/usuarios/perfil", {
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

            const user = await data.json();
            setUserData(user);
            console.log("Datos del usuario:", user);




        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
        }

    };



    useEffect(() => {

        llamarDatos();

    }, []);




    return (
        <>
            <div className="perfil-container">
                <div className="avatar-container">
                    <img src="https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png" alt="Avatar" />
                    <h1 className="nombre-usuario">{userData.nombre} {userData.apellido}</h1>
                </div>

                <div className="info-container">
                    <h2>Información del Usuario</h2>
                    <p><strong>Email: {userData.email}</strong></p>
                    <p><strong>Reservas vigentes:</strong></p>
                </div>

            </div>

        </>
    )
}

export default Perfil;