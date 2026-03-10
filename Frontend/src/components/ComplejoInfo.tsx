import styles from "./ComplejoInfo.module.css"

import {
  MdShower,
  MdLocalParking,
  MdEmojiEvents,
  MdCake,
  MdFireplace,
  MdRestaurant,
  MdHome,
  MdWifi,
  MdFastfood,
  MdSecurity,
  MdSportsTennis,
  MdSportsSoccer,
  MdStadium,
  MdLocationOn,
  MdStraighten,
  MdLightbulb,
  MdCheckCircle,
  MdCancel,
  MdStar,
  MdArrowForward
} from "react-icons/md";

interface ComplejoData {
  _id: string;
  nombre: string;
  direccion: string;
  ciudad: {
    _id: string;
    nombre: string;
  };
  servicios: string[];
  canchas: Array<{
    _id?: string;
    nombre?: string;
    tipoCancha: string;
    precioHora: number;
    disponible: boolean;
  }>;
}

const getIconoServicio = (servicio: string) => {
  const iconProps = { size: 18 };
  switch (servicio) {
    case 'Vestuario': return <MdShower {...iconProps} />;
    case 'Estacionamiento': return <MdLocalParking {...iconProps} />;
    case 'Torneos': return <MdEmojiEvents {...iconProps} />;
    case 'Cumpleaños': return <MdCake {...iconProps} />;
    case 'Parrilla': return <MdFireplace {...iconProps} />;
    case 'Bar / Restaurante': return <MdRestaurant {...iconProps} />;
    case 'Quincho': return <MdHome {...iconProps} />;
    case 'Wi-Fi': return <MdWifi {...iconProps} />;
    case 'Buffet': return <MdFastfood {...iconProps} />;
    case 'Seguridad': return <MdSecurity {...iconProps} />;
    default: return <MdStadium {...iconProps} />;
  }
};

interface ComplejoInfoProps {
  complejo: ComplejoData;
  onSeleccionCancha?: (canchaId: string, canchaTipo: string) => void;
}

export default function ComplejoInfo({ complejo, onSeleccionCancha }: ComplejoInfoProps) {

  const getDescripcionCancha = (tipoCancha: string) => {
    switch (tipoCancha) {
      case 'Padel': return 'Paletas disponibles para alquiler';
      case 'Futbol 5': return 'Césped sintético de alta calidad';
      case 'Futbol 7': return 'Césped sintético profesional';
      default: return 'Instalaciones de primera calidad';
    }
  };

  const getIconoCancha = (tipoCancha: string) => {
    const iconProps = { size: 22 };
    switch (tipoCancha) {
      case 'Padel': return <MdSportsTennis {...iconProps} />;
      case 'Futbol 5':
      case 'Futbol 7': return <MdSportsSoccer {...iconProps} />;
      default: return <MdStadium {...iconProps} />;
    }
  };

  const getDimensionesCancha = (tipoCancha: string) => {
    switch (tipoCancha) {
      case 'Padel': return '20m × 10m';
      case 'Futbol 5': return '40m × 20m';
      case 'Futbol 7': return '65m × 45m';
      default: return 'Dimensiones estándar';
    }
  };

  const getTagCancha = (tipoCancha: string) => {
    switch (tipoCancha) {
      case 'Padel': return 'PÁDEL';
      case 'Futbol 5': return 'FÚTBOL 5';
      case 'Futbol 7': return 'FÚTBOL 7';
      default: return tipoCancha.toUpperCase();
    }
  };

  return (
    <div className={styles.wrapper}>

      {/* ── CANCHAS ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionDot} />
          <h2 className={styles.sectionTitle}>Canchas</h2>
          <span className={styles.sectionCount}>{complejo.canchas.length}</span>
        </div>

        {complejo.canchas.length > 0 ? (
          <div className={styles.canchasGrid}>
            {complejo.canchas.map((cancha, index) => (
              <div
                key={cancha._id || index}
                className={`${styles.canchaCard} ${!cancha.disponible ? styles.canchaNoDisponible : ''}`}
                onClick={() => cancha.disponible && onSeleccionCancha && onSeleccionCancha(cancha._id || "", cancha.tipoCancha)}
              >
                {/* Card top stripe */}
                <div className={styles.canchaStripe} />

                <div className={styles.canchaCardInner}>
                  {/* Header row */}
                  <div className={styles.canchaCardHeader}>
                    <div className={styles.canchaIconWrap}>
                      {getIconoCancha(cancha.tipoCancha)}
                    </div>
                    <div className={styles.canchaNameGroup}>
                      <span className={styles.canchaTag}>{getTagCancha(cancha.tipoCancha)}</span>
                      <h3 className={styles.canchaNombre}>
                        {cancha.nombre || `Cancha ${index + 1}`}
                      </h3>
                    </div>
                    <div className={`${styles.disponibleBadge} ${cancha.disponible ? styles.disponibleOn : styles.disponibleOff}`}>
                      {cancha.disponible
                        ? <><MdCheckCircle size={14} /> Disponible</>
                        : <><MdCancel size={14} /> Ocupada</>
                      }
                    </div>
                  </div>

                  {/* Specs */}
                  <div className={styles.canchaSpecs}>
                    <div className={styles.specItem}>
                      <MdStraighten size={15} />
                      <span>{getDimensionesCancha(cancha.tipoCancha)}</span>
                    </div>
                    <div className={styles.specItem}>
                      <MdLightbulb size={15} />
                      <span>Iluminación LED</span>
                    </div>
                    <div className={styles.specItem}>
                      {getIconoCancha(cancha.tipoCancha)}
                      <span>{getDescripcionCancha(cancha.tipoCancha)}</span>
                    </div>
                    {cancha.tipoCancha.toLowerCase().includes('padel') && (
                      <div className={styles.specItem}>
                        <MdStadium size={15} />
                        <span>Cristales reglamentarios</span>
                      </div>
                    )}
                  </div>

                  {/* Footer: price + CTA */}
                  <div className={styles.canchaCardFooter}>
                    <div className={styles.precioGroup}>
                      <span className={styles.precioLabel}>por hora</span>
                      <span className={styles.precioValor}>${cancha.precioHora.toLocaleString()}</span>
                    </div>
                    {cancha.disponible && (
                      <button className={styles.reservarBtn}>
                        Reservar <MdArrowForward size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyMsg}>Sin canchas registradas.</p>
        )}
      </section>

      {/* ── SERVICIOS + UBICACIÓN ── */}
      <div className={styles.bottomGrid}>

        {/* Servicios */}
        {complejo.servicios && complejo.servicios.length > 0 && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionDot} />
              <h2 className={styles.sectionTitle}>Servicios</h2>
              <span className={styles.sectionCount}>{complejo.servicios.length}</span>
            </div>
            <div className={styles.serviciosGrid}>
              {complejo.servicios.map((servicio) => (
                <div key={servicio} className={styles.servicioChip}>
                  <span className={styles.servicioIcon}>{getIconoServicio(servicio)}</span>
                  <span>{servicio}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ubicación */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionDot} />
            <h2 className={styles.sectionTitle}>Ubicación</h2>
          </div>
          <div className={styles.ubicacionCard}>
            <div className={styles.ubicacionIconWrap}>
              <MdLocationOn size={28} />
            </div>
            <div className={styles.ubicacionInfo}>
              <p className={styles.ubicacionNombre}>{complejo.nombre}</p>
              <p className={styles.ubicacionDireccion}>
                {complejo.direccion}, {complejo.ciudad.nombre}
              </p>
            </div>
          </div>

          {/* Resumen rápido */}
          <div className={styles.resumenRow}>
            <div className={styles.resumenItem}>
              <span className={styles.resumenNum}>{complejo.canchas.length}</span>
              <span className={styles.resumenLabel}>cancha{complejo.canchas.length !== 1 ? 's' : ''}</span>
            </div>
            {complejo.servicios && complejo.servicios.length > 0 && (
              <div className={styles.resumenItem}>
                <span className={styles.resumenNum}>{complejo.servicios.length}</span>
                <span className={styles.resumenLabel}>servicio{complejo.servicios.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            <div className={styles.resumenItem}>
              <MdStar size={18} color="#a8e6b0" />
              <span className={styles.resumenLabel}>Verificado</span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}