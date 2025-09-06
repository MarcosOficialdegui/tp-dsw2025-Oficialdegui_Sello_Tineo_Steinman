import { Request, Response } from 'express';
import Usuario from '../models/Usuario';


// Crear un nuevo usuario
export const createUsuario = async (req: Request, res: Response) : Promise<void> => {

    try {
        const { nombre, apellido, email, password, rol } = req.body;

        if(!nombre || !apellido || !email || !password) {
            res.status(400).json({ error: 'Faltan campos obligatorios: nombre, email, password' });
            return;
        }

        const nuevoUsuario = new Usuario({ nombre, apellido ,email, password, rol });

        const usuarioGuardado = await nuevoUsuario.save();

        res.status(201).json(usuarioGuardado);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }

}