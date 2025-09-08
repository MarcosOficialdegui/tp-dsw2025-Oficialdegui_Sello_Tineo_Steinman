import { Request, Response } from 'express';
import Usuario from '../models/Usuario';
import jwt from "jsonwebtoken";


const SECRET_KEY = "tu_clave_secreta_aqui"; // Cambiar esto por una clave  segura y mantenerla en un entorno seguro


// Crear un nuevo usuario
export const createUsuario = async (req: Request, res: Response): Promise<void> => {

    try {
        const { nombre, apellido, email, password, rol } = req.body;

        if (!nombre || !apellido || !email || !password) {
            res.status(400).json({ error: 'Faltan campos obligatorios: nombre, email, password' });
            return;
        }

        const nuevoUsuario = new Usuario({ nombre, apellido, email, password, rol });

        const usuarioGuardado = await nuevoUsuario.save();

        res.status(201).json(usuarioGuardado);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }

}

export const generarToken = async (req: Request, res: Response): Promise<void> => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Faltan campos obligatorios: email, password' });
            return;
        }

        const usuario = await Usuario.findOne({ email, password });
        if (usuario) {
            

            // Generar token
            const token = jwt.sign(
                { id: usuario._id, email: usuario.email, rol: usuario.rol },
                SECRET_KEY,
                { expiresIn: '1h' });
                 
            res.json({ token });


        } else {
            res.status(404).json({ error: 'Usuario no encontrado o credenciales incorrectas' });
        }


    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el usuario' });
    }


}

export const buscarUsuarioToken = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = (req as any).user.id;
        const usuario = await Usuario.findById(userId).select('-password');

        if(!usuario){
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }

        res.json(usuario); //Devolver el usuario encontrado con el token

    }catch(error){
        res.status(500).json({ error: 'Error al obtener el perfil del usuario' });
    }
}