import { toast } from "react-toastify";
import type { ToastOptions } from "react-toastify";

const opcionesBase: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

/** Notificación de éxito  */
export const mostrarExito = (mensaje: string) =>
  toast.success(mensaje, {
    ...opcionesBase,
    style: {
      backgroundColor: "#2e7d32", 
      color: "#fff",
      borderRadius: "10px",
      fontWeight: 500,
    },
  });

/** Notificación de error */
export const mostrarError = (mensaje: string) =>
  toast.error(mensaje, {
    ...opcionesBase,
    style: {
      backgroundColor: "#c62828",
      color: "#fff",
      borderRadius: "10px",
      fontWeight: 500,
    },
  });

/** Notificación informativa  */
export const mostrarInfo = (mensaje: string) =>
  toast.info(mensaje, {
    ...opcionesBase,
    style: {
      backgroundColor: "#0288d1",
      color: "#fff",
      borderRadius: "10px",
      fontWeight: 500,
    },
  });

/** Notificación de advertencia  */
export const mostrarAdvertencia = (mensaje: string) =>
  toast.warn(mensaje, {
    ...opcionesBase,
    style: {
      backgroundColor: "#fbc02d",
      color: "#222",
      borderRadius: "10px",
      fontWeight: 500,
    },
  });
