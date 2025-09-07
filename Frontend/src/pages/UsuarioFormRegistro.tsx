import "./UsuarioForm.css";
import { useState } from "react";



export default function UsuarioFormRegistro() {

    const handleContactoClick = () => {
        window.alert("TERMINOS Y CONDICIONES");
    };

    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        rol: "usuario"
    });



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData);

        const enviarDatos = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/usuarios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });
                if (res.ok) {
                    alert("Usuario registrado con éxito");
                } else {
                    alert("Error al registrar usuario");
                }
            } catch (err) {
                alert("Error de conexión");
            }
        };

        const verificarPassword = () => {
            if (formData.password !== (document.getElementById("passwordCheck") as HTMLInputElement).value) {
                alert("Las contraseñas no coinciden");
                return false;
            } else { return true }
        }

        if (verificarPassword()) {
            enviarDatos();
        }
    }





    return (
        <>

            <div className="form-container">


                <form className="main-content" onSubmit={handleSubmit}>
                    <h1>Registro de Usuario</h1>

                    <input type="text" id="nombre" name="nombre" placeholder="Nombre"
                        onChange={e => setFormData({ ...formData, nombre: e.target.value })} required />
                    <br />
                    <input type="text" id="apellido" name="apellido" placeholder="Apellido"
                        onChange={e => setFormData({ ...formData, apellido: e.target.value })} required />
                    <br />
                    <input type="email" id="email" name="email" placeholder="Email"
                        onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    <br />
                    <input type="password" id="password" name="password" placeholder="Contraseña"
                        onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                    <br />
                    <input type="password" id="passwordCheck" name="passwordCheck" placeholder="Confirmar contraseña"
                    />
                    <br />

                    <button type="submit">Registrarse</button>

                    <p>Al registrarse acepta los <a className="texto-resaltado" onClick={handleContactoClick}>Terminos y Condiciones.</a></p>
                </form>
            </div>
        </>
    );
};
