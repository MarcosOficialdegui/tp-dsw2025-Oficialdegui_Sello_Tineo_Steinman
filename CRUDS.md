## CRUD Propietario de Canchas:
* Crear: Permite a los propietarios de canchas registrarse en la plataforma proporcionando información básica como nombre, dirección y tipo de canchas que ofrecen.
* Leer: Permite ver los detalles de los propietarios registrados, incluyendo información sobre las canchas que administran.
* Actualizar: Permite a los propietarios actualizar la información de su perfil o las características de las canchas que ofrecen.
* Eliminar: Permite a los propietarios eliminar su cuenta y las canchas asociadas si ya no desean utilizar la plataforma.

## CRUD Cancha:
* Crear: Los propietarios pueden agregar nuevas canchas a la plataforma, especificando detalles como el tipo de deporte, tipo de césped, ubicación y precio de alquiler.
* Leer: Los usuarios pueden buscar y ver las canchas disponibles, filtrando por criterios como tipo de deporte, ubicación y precio.
* Actualizar: Los propietarios pueden actualizar la disponibilidad horaria y los precios de sus canchas en la plataforma.
Eliminar: Los propietarios pueden retirar una cancha de la plataforma si ya no está disponible para alquiler.

## CRUD Usuario:
* Crear: Permite a los usuarios registrarse en la plataforma proporcionando información básica como nombre, correo electrónico y número de teléfono.
* Leer: Los usuarios pueden ver su perfil y detalles de su cuenta.
* Actualizar: Los usuarios pueden actualizar su información personal o preferencias en la plataforma.
Eliminar: Los usuarios pueden eliminar su cuenta si ya no desean utilizar la plataforma.

## CRUD Reserva:
* Crear: Permite a los usuarios reservar una cancha seleccionando la fecha, hora y duración del alquiler.
* Leer: Los usuarios y propietarios pueden ver las reservas existentes, incluyendo detalles como la fecha, hora y duración del alquiler.
* Actualizar: Tanto los usuarios como los propietarios pueden solicitar cambios en las reservas existentes, como modificar la fecha o la duración del alquiler.
* Eliminar: Los usuarios pueden cancelar sus reservas, y los propietarios pueden cancelar reservas en caso de emergencia o circunstancias especiales.

## CRUD Cuota Mensual:
* Crear: Permite a los propietarios pagar la cuota mensual para mantener sus canchas publicadas en la plataforma.
* Leer: Los propietarios pueden ver el estado de su suscripción y el historial de pagos de cuotas mensuales.
* Actualizar: Los propietarios pueden actualizar su método de pago o la información de facturación asociada a la cuota mensual.
* Eliminar: No aplica.

## CRUD Gestión de Reservas:
* Crear: No aplica.
* Leer: Los propietarios y usuarios pueden ver y gestionar sus reservas existentes en la plataforma.
* Actualizar: Tanto los propietarios como los usuarios pueden solicitar cambios en las reservas existentes.
* Eliminar: Los propietarios pueden cancelar reservas en caso de emergencia o circunstancias especiales, y los usuarios pueden cancelar sus reservas dentro de un período de tiempo especificado.

## Casos de Uso/Epic:
* Registrarse como propietario de canchas: Permite a los propietarios de canchas registrarse en la plataforma y publicar sus canchas.
* Publicar una cancha: Permite a los propietarios agregar nuevas canchas a la plataforma.
* Registrarse como usuario: Permite a los usuarios registrarse en la plataforma para buscar y reservar canchas.
* Reservar una cancha: Permite a los usuarios reservar una cancha para una fecha y hora específicas.
* Realizar el pago de una reserva: Permite a los usuarios confirmar su reserva realizando un pago.
* Gestionar reservas como propietario o usuario: Permite a propietarios y usuarios ver y gestionar sus reservas existentes en la plataforma.

## CRUD Tipo de Cancha (Dependiente de Cancha):
* Crear: Permite a los propietarios agregar diferentes tipos de canchas (fútbol 5, fútbol 7, pádel, tenis) a sus instalaciones.
* Leer: Los propietarios pueden ver los tipos de canchas que han asociado con sus instalaciones.
* Actualizar: Los propietarios pueden actualizar la información sobre los tipos de canchas disponibles en sus instalaciones.
* Eliminar: Los propietarios pueden eliminar tipos de canchas si ya no están disponibles en sus instalaciones.

## CRUD Localidad (Dependiente de Propietario):
* Crear: Permite a los propietarios agregar la localidad o zona donde se encuentran sus instalaciones de canchas.
* Leer: Los propietarios pueden ver las localidades asociadas con sus instalaciones.
* Actualizar: Los propietarios pueden actualizar la información sobre la localidad de sus instalaciones.
* Eliminar: Los propietarios pueden eliminar localidades si ya no son relevantes para sus instalaciones.
