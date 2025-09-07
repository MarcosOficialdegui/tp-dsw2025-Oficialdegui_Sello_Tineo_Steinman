import "./UsuarioForm.css";
import { useState } from "react";



export default function UsuarioFormLogin() {

    

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData);

        const enviarDatos = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/usuarios/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });
                if (res.ok) {
                    alert("Inicio de sesion exitoso");
                } else {
                    alert("El usuario no existe o las credenciales son incorrectas");
                }
            } catch (err) {
                alert("Error de conexión");
            }
        };

        enviarDatos();
    }





    return (
        <>

            <div className="form-container">


                <form className="main-content" onSubmit={handleSubmit}>
                    <h1>Iniciar Sesion</h1>

                    
                    <input type="email" id="email" name="email" placeholder="Email"
                        onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    <br />
                    <input type="password" id="password" name="password" placeholder="Contraseña"
                        onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                    <br />
                    

                    <button type="submit">Iniciar Sesion</button>

                </form>
            </div>
        </>
    );
};
