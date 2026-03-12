/**
 * Constantes de la aplicación
 */

// URL del backend
export const API_BASE_URL = 'http://localhost:3000';

// Imágenes predeterminadas
export const IMAGEN_PREDETERMINADA_COMPLEJO = '/images/hombres-de-tiro-completo-jugando-al-futbol.jpg';
export const IMAGEN_PREDETERMINADA_CANCHA = '/images/vista-de-pelota-mirando-hacia-porteria.jpg';
export const IMAGEN_PREDETERMINADA_PADEL = '/images/campo-de-padel-con-pelotas-en-canasta.jpg';

/**
 * Obtiene la imagen predeterminada según el tipo de cancha
 */
export function getImagenPredeterminadaCancha(tipoCancha?: string): string {
  if (!tipoCancha) return IMAGEN_PREDETERMINADA_COMPLEJO;
  
  const tipo = tipoCancha.toLowerCase();
  
  if (tipo.includes('padel') || tipo.includes('pádel')) {
    return IMAGEN_PREDETERMINADA_PADEL;
  }
  
  if (tipo.includes('futbol') || tipo.includes('fútbol')) {
    return IMAGEN_PREDETERMINADA_CANCHA;
  }
  
  return IMAGEN_PREDETERMINADA_COMPLEJO;
}

/**
 * Construye la URL completa de una imagen
 */
export function construirUrlImagen(imagePath?: string, tipoCanchaFallback?: string): string {
  if (!imagePath) {
    return getImagenPredeterminadaCancha(tipoCanchaFallback);
  }
  
  // Si la ruta ya es absoluta (comienza con http), usarla directamente
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Si es una ruta local (comienza con /images), usarla tal cual
  if (imagePath.startsWith('/images')) {
    return imagePath;
  }
  
  // Si la ruta es relativa del backend, construir URL completa
  return `${API_BASE_URL}${imagePath}`;
}
