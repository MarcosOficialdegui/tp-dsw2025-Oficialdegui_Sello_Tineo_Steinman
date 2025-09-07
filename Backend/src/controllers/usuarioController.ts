import { Request, Response } from 'express';
import Usuario from '../models/Usuario';


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

export const findUsuario = async (req: Request, res: Response): Promise<void> => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Faltan campos obligatorios: email, password' });
            return;
        }

        const usuario = await Usuario.findOne({ email, password });
        if (usuario) {
            res.status(200).json(usuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado o credenciales incorrectas' });
        }
        

    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el usuario' });
    }


}