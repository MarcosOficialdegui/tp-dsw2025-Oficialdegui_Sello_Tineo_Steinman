import mongoose from "mongoose";


export interface IUsuario extends mongoose.Document {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol: 'propietario' | 'usuario';
    complejos: mongoose.Types.ObjectId[]; // Referencia a los complejos que posee
}


const usuarioSchema = new mongoose.Schema<IUsuario>({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    rol: { 
        type: String, 
        required: true, 
        enum: ['propietario', 'usuario'], 
        default: 'usuario' 
    },
    complejos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complejo' }] // Referencia a los complejos que posee
});



export default mongoose.model<IUsuario>("Usuario", usuarioSchema);
