import { Request, Response, NextFunction } from 'express';


export const rolMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const user = (req as any).user;
    if (!user) {
        console.log('Usuario no autenticado en rolMiddleware');
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    if (user.rol !== "propietario") {
        return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
    }
    next();

}