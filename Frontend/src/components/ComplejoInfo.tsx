import styles from "./ComplejoInfo.module.css"

export default function ComplejoInfo() {
  return (
    <div className={styles.complejoInfo}>
      <h2 className={styles.complejoInfoTitle}>Información del complejo</h2>
      <div className={styles.complejoInfoGrid}>
        {/* Court Details */}
        <div>
          <h3 className={styles.complejoDetailsTitle}>Cancha de Fútbol 5</h3>
          <div className={styles.complejoDetailsList}>
            <div className={styles.complejoDetailsItem}>
              <span className={styles.complejoDetailsIcon}>📏</span>
              <span className={styles.complejoDetailsText}>Dimensiones: 40m x 20m</span>
            </div>
            <div className={styles.complejoDetailsItem}>
              <span className={styles.complejoDetailsIcon}>🌱</span>
              <span className={styles.complejoDetailsText}>Césped sintético de alta calidad</span>
            </div>
            <div className={styles.complejoDetailsItem}>
              <span className={styles.complejoDetailsIcon}>💡</span>
              <span className={styles.complejoDetailsText}>Iluminación LED completa</span>
            </div>
            <div className={styles.complejoDetailsItem}>
              <span className={styles.complejoDetailsIcon}>🚿</span>
              <span className={styles.complejoDetailsText}>Vestuarios con duchas</span>
            </div>
            <div className={styles.complejoDetailsItem}>
              <span className={styles.complejoDetailsIcon}>🅿️</span>
              <span className={styles.complejoDetailsText}>Estacionamiento gratuito</span>
            </div>
          </div>
          <div className={styles.complejoPriceBox}>
            <h4 className={styles.complejoPriceTitle}>Precio por hora</h4>
            <p className={styles.complejoPrice}>$25.000</p>
          </div>
        </div>
        {/* Map */}
        <div>
          <h3 className={styles.complejoMapTitle}>Ubicación</h3>
          <div className={styles.complejoMapBox}>
            <div className={styles.complejoMapIcon}>🗺️</div>
            <div className={styles.complejoMapInfo}>
              <p className={styles.complejoMapInfoTitle}>SportCourt Centro</p>
              <p className={styles.complejoMapInfoAddress}>Av. Principal 123, Ciudad</p>
            </div>
          </div>
          <div className={styles.complejoContactList}>
            <div className={styles.complejoContactItem}>
              <span className={styles.complejoContactIcon}>📍</span>
              <span className={styles.complejoContactText}>Av. Principal 123, Ciudad</span>
            </div>
            <div className={styles.complejoContactItem}>
              <span className={styles.complejoContactIcon}>📞</span>
              <span className={styles.complejoContactText}>+54 11 1234-5678</span>
            </div>
            <div className={styles.complejoContactItem}>
              <span className={styles.complejoContactIcon}>🕒</span>
              <span className={styles.complejoContactText}>Lun-Dom: 8:00 - 22:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
