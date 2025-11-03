import styles from "./ComplejoInfo.module.css"

import {
  MdShower,           // Vestuario
  MdLocalParking,     // Estacionamiento  
  MdEmojiEvents,      // Torneos
  MdCake,             // Cumpleaños
  MdFireplace,        // Parrilla
  MdRestaurant,       // Bar / Restaurante
  MdHome,             // Quincho
  MdWifi,             // Wi-Fi
  MdFastfood,         // Buffet
  MdSecurity,         // Seguridad
  MdSportsTennis,     // Pádel
  MdSportsSoccer,     // Fútbol
  MdStadium,          // Estadio/Complejo
  MdLocationOn,       // Ubicación
  MdStraighten,       // Dimensiones
  MdLightbulb,        // Iluminación
  MdCheckCircle,      // Disponible
  MdCancel,           // No disponible
  MdStar              // Calificación
} from "react-icons/md";

// Interfaz para los datos del complejo
interface ComplejoData {
  _id: string;
  nombre: string;
  direccion: string;
  ciudad: {
    _id: string;
    nombre: string;
  };
  servicios: string[]; // Array de servicios disponibles
  canchas: Array<{
    _id?: string;
    nombre?: string;
    tipoCancha: string; // En el backend es string, no objeto
    precioHora: number;
    disponible: boolean;
  }>;
}

// Función para obtener el ícono de un servicio
const getIconoServicio = (servicio: string) => {
  const iconProps = { size: 20, style: { marginRight: '8px' } };

  switch (servicio) {
    case 'Vestuario':
      return <MdShower {...iconProps} />;
    case 'Estacionamiento':
      return <MdLocalParking {...iconProps} />;
    case 'Torneos':
      return <MdEmojiEvents {...iconProps} />;
    case 'Cumpleaños':
      return <MdCake {...iconProps} />;
    case 'Parrilla':
      return <MdFireplace {...iconProps} />;
    case 'Bar / Restaurante':
      return <MdRestaurant {...iconProps} />;
    case 'Quincho':
      return <MdHome {...iconProps} />;
    case 'Wi-Fi':
      return <MdWifi {...iconProps} />;
    case 'Buffet':
      return <MdFastfood {...iconProps} />;
    case 'Seguridad':
      return <MdSecurity {...iconProps} />;
    default:
      return <MdStadium {...iconProps} />;
  }
};

// Props
interface ComplejoInfoProps {
  complejo: ComplejoData;
  onSeleccionCancha?: (canchaId: string , canchaTipo: string) => void; 
}



export default function ComplejoInfo({ complejo, onSeleccionCancha }: ComplejoInfoProps) {

  

  // Función para obtener descripción específica según tipo de cancha
  const getDescripcionCancha = (tipoCancha: string) => {
    const tipo = tipoCancha; // Normalizar texto

    switch (tipo) {
      case 'Padel':
        return 'Paletas disponibles para alquiler';
      case 'Futbol 5':
        return 'Césped sintético de alta calidad';
      case 'Futbol 7':
        return 'Césped sintético profesional';
      default:
        return 'Instalaciones de primera calidad';
    }
  };

  // Función para obtener ícono específico según tipo de cancha
  const getIconoCancha = (tipoCancha: string) => {
    const iconProps = { size: 24, style: { marginRight: '8px' } };

    switch (tipoCancha) {
      case 'Padel':
        return <MdSportsTennis {...iconProps} />;
      case 'Futbol 5':
      case 'Futbol 7':
        return <MdSportsSoccer {...iconProps} />;
      default:
        return <MdStadium {...iconProps} />;
    }
  };

  // Función para obtener dimensiones según tipo de cancha
  const getDimensionesCancha = (tipoCancha: string) => {
    const tipo = tipoCancha; // Normalizar texto

    switch (tipo) {
      case 'Padel':
        return 'Dimensiones: 20m x 10m';
      case 'Futbol 5':
        return 'Dimensiones: 40m x 20m';
      case 'Futbol 7':
        return 'Dimensiones: 65m x 45m';
      default:
        return 'Dimensiones estándar';
    }
  };

  return (
    <div className={styles.complejoInfo}>
      <h2 className={styles.complejoSubheading}>
        <MdStadium size={24} color="#4CAF50" />
        Canchas disponibles
      </h2>
      <div className={styles.complejoInfoGrid}>

        <div>
          {/* Información de canchas dinámicas */}
          {complejo.canchas.length > 0 ? (
            //<div classname = {styles.selectCanchaSection}> </div>
            complejo.canchas.map((cancha, index) => (

              <div className ={styles.canchaHoverBox} onClick = {() => {onSeleccionCancha && onSeleccionCancha(cancha._id || "", cancha.tipoCancha || "")}} key={cancha._id || index}>

                <div key={cancha._id || index} className={styles.canchaSection}>
                  <h3 className={styles.complejoDetailsTitle}>
                    {cancha.nombre || `Cancha ${index + 1}`} - {cancha.tipoCancha}
                  </h3>
                  <div className={styles.complejoDetailsList}>
                    <div className={styles.complejoDetailsItem}>
                      <span className={styles.complejoDetailsIcon}>
                        <MdStraighten size={20} />
                      </span>
                      <span className={styles.complejoDetailsText}>
                        {getDimensionesCancha(cancha.tipoCancha)}
                      </span>
                    </div>
                    <div className={styles.complejoDetailsItem}>
                      <span className={styles.complejoDetailsIcon}>{getIconoCancha(cancha.tipoCancha)}</span>
                      <span className={styles.complejoDetailsText}>{getDescripcionCancha(cancha.tipoCancha)}</span>
                    </div>
                    {/* Información adicional específica para pádel */}
                    {cancha.tipoCancha.toLowerCase().includes('padel') && (
                      <div className={styles.complejoDetailsItem}>
                        <span className={styles.complejoDetailsIcon}>
                          <MdStadium size={20} />
                        </span>
                        <span className={styles.complejoDetailsText}>Pistas con cristales reglamentarios</span>
                      </div>
                    )}
                    <div className={styles.complejoDetailsItem}>
                      <span className={styles.complejoDetailsIcon}>
                        <MdLightbulb size={20} />
                      </span>
                      <span className={styles.complejoDetailsText}>Iluminación LED completa</span>
                    </div>
                    <div className={styles.complejoDetailsItem}>
                      <span className={styles.complejoDetailsIcon}>
                        {cancha.disponible ?
                          <MdCheckCircle size={20} color="#4CAF50" /> :
                          <MdCancel size={20} color="#f44336" />
                        }
                      </span>
                      <span className={styles.complejoDetailsText}>
                        {cancha.disponible ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.complejoPriceBox}>
                    <h4 className={styles.complejoPriceTitle}>Precio por hora</h4>
                    <p className={styles.complejoPrice}>${cancha.precioHora.toLocaleString()}</p>
                  </div>
                  {index < complejo.canchas.length - 1 && <hr className={styles.separator} />}
                </div>


              </div>


            ))
          ) : (
            <div>
              <h3 className={styles.complejoDetailsTitle}>Sin canchas disponibles</h3>
            </div>
          )}

          {/* Servicios del complejo */}
          {complejo.servicios && complejo.servicios.length > 0 && (
            <div className={styles.serviciosSection}>
              <h4 className={styles.complejoDetailsTitle}>Servicios disponibles</h4>
              <div className={styles.complejoDetailsList}>
                {complejo.servicios.map((servicio) => (
                  <div key={servicio} className={styles.complejoDetailsItem}>
                    <span className={styles.complejoDetailsIcon}>
                      {getIconoServicio(servicio)}
                    </span>
                    <span className={styles.complejoDetailsText}>{servicio}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Ubicación y contacto */}
        <div>
          <h3 className={styles.complejoMapTitle}>Ubicación</h3>
          <div className={styles.complejoMapBox}>
            <div className={styles.complejoMapIcon}>
              <MdLocationOn size={32} color="#4CAF50" />
            </div>
            <div className={styles.complejoMapInfo}>
              <p className={styles.complejoMapInfoTitle}>{complejo.nombre}</p>
              <p className={styles.complejoMapInfoAddress}>
                {complejo.direccion}, {complejo.ciudad.nombre}
              </p>
            </div>
          </div>
          <div className={styles.complejoContactList}>
            <div className={styles.complejoContactItem}>
              <span className={styles.complejoContactIcon}>
                <MdLocationOn size={16} color="#4CAF50" />
              </span>
              <span className={styles.complejoContactText}>
                {complejo.direccion}, {complejo.ciudad.nombre}
              </span>
            </div>
          </div>

          {/* Resumen del complejo */}
          <div className={styles.resumenComplejo}>
            <h4 className={styles.complejoDetailsTitle}>Resumen</h4>
            <div className={styles.complejoDetailsList}>
              <div className={styles.complejoDetailsItem}>
                <span className={styles.complejoDetailsIcon}>
                  <MdStadium size={16} color="#4CAF50" />
                </span>
                <span className={styles.complejoDetailsText}>
                  {complejo.canchas.length} cancha{complejo.canchas.length !== 1 ? 's' : ''} disponible{complejo.canchas.length !== 1 ? 's' : ''}
                </span>
              </div>


              {complejo.servicios && complejo.servicios.length > 0 && (
                <div className={styles.complejoDetailsItem}>
                  <span className={styles.complejoDetailsIcon}>
                    <MdStar size={16} color="#FFD700" />
                  </span>
                  <span className={styles.complejoDetailsText}>
                    {complejo.servicios.length} servicio{complejo.servicios.length !== 1 ? 's' : ''} adicional{complejo.servicios.length !== 1 ? 'es' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
