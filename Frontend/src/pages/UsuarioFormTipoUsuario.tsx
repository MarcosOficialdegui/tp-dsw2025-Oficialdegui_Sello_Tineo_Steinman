import "./UsuarioForm.css"



export default function TipoUsuario() {

  
    return (
        <>
            <div className="centered-div">
                <div className="main-content">
                    <h2>Seleccione el tipo de usuario</h2>
                    <div className="button-group">
                        <button onClick={() => window.location.href = "/registrarse?tipo=usuario"}>Usuario</button>
                        <button onClick={() => window.location.href = "/registrarse?tipo=propietario"}>Administrador de Complejo</button>
                    </div>

                </div>
            </div>
        </>
    );
}