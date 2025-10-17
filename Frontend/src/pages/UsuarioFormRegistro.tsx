import { useSearchParams } from "react-router-dom";
import "./UsuarioForm.css";
import { useState, useEffect } from "react";
import { mostrarExito, mostrarError } from "../utils/notificaciones";




export default function UsuarioFormRegistro() {

    const [searchParams] = useSearchParams();
    const tipo = searchParams.get("tipo");



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

    const [validarPassword, setValidarPassword] = useState(false);
    const [validarMail, setValidarMail] = useState(false);


 useEffect(() => {
    if(tipo == "propietario" || tipo == "usuario"){
            setFormData({ ...formData, rol: tipo});
        }else{ 
            window.location.href = "/TipoUsuario";
        }
 }, [tipo]);
 

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();


        if (formData.password.length < 8) {
            setValidarPassword(true);
            return;
        }


        
        const enviarDatos = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/usuarios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });
                if (res.ok) {
                    setValidarMail(false);
                    setValidarPassword(false);
                    mostrarExito("Usuario registrado con éxito");
                    window.location.href = "/login";
                } else {
                    mostrarError(res.status === 400 ? "El email ya se encuentra registrado" : "Error al registrar el usuario");
                }
            } catch (err) {
                mostrarError("Error de conexión");
            }
        };

        const verificarPassword = () => {
            if (formData.password !== (document.getElementById("passwordCheck") as HTMLInputElement).value) {
                mostrarError("Las contraseñas no coinciden");
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
                    <p>¿Ya tienes una cuenta? <a className="texto-resaltado" href="/login">Iniciar sesión</a></p>

                    <div>

                        {validarPassword && <p className="error">La contraseña debe tener mas de 7 caracteres</p>}
                        {validarMail && <p className="error">El email ya se encuentra registrado</p>}

                    </div>

                </form>
            </div>
        </>
    );
};
