import mongoose from "mongoose";


export interface IUsuario extends mongoose.Document {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: 'propietario' | 'usuario';
}


const usuarioSchema = new mongoose.Schema<IUsuario>({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    rol: { type: String, enum: ['propietario', 'usuario'], default: 'usuario' },
});

export default mongoose.model<IUsuario>("Usuario", usuarioSchema);
