import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface jwtpayload {
    id: string;
    email: string;
}


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    try{
        const decoded = jwt.verify(token, "tu_clave_secreta_aqui") as jwtpayload;
        (req as any).user = decoded;
       
        next();
    }catch (error) {
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
}