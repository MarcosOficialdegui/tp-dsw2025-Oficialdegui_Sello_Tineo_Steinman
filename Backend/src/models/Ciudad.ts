import mongoose from 'mongoose';

// Capitalizar los nombres de las ciudades
const capitalizarNombre = (nombre : string): string => {
    return nombre
        .toLowerCase()
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
};

// Validar que el nombre solo contenga letras, espacios, acentos y guiones
const validarNombreCiudad = (nombre : string): boolean => {
    const regex = /^[a-zA-ZÀ-ÿ\s\-]+$/;
    return regex.test(nombre) && nombre.trim().length >= 2;
};

const ciudadSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la ciudad es obligatorio'],
        trim: true,
        minlength: [2, 'El nombre de la ciudad debe tener al menos 2 caracteres'],
        maxlength: [25, 'El nombre de la ciudad no puede exceder los 25 caracteres'],
        validate:{
            validator: validarNombreCiudad,
            message: 'El nombre de la ciudad solo puede contener letras, espacios, acentos y guiones'
        },
        set: capitalizarNombre,
        unique: true,
        index: true
    },
    creadaPor: {
        type: String,
        enum: ['desarrollador', 'propietario'],
        default: 'propietario'
    }
});

export default mongoose.model('Ciudad', ciudadSchema);
