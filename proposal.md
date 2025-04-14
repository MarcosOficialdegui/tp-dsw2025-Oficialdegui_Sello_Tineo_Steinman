# TP DSW 2025

## Grupo
### Integrantes
* Legajo - Apellido - Nombres
* 51405 - Sello - Valentino
* 51379 - Tineo - Tomas Ivan
* 51790 - Marcos - Oficialdegui
* 51662 - Alejo - Steinman

### Repositorios
* [fullstack app]: (https://github.com/TomasTineo/Complejos-futbol)

## Tema
### 
### Descripcion 
Aplicación web para realizar alquileres de canchas de fútbol 5, fútbol 7, pádel y tenis. Los propietarios tendrán la opción de publicar sus respectivas canchas. Los usuarios podrán visualizar su disponibilidad y su precio. Para tener la cancha publicada se deberá pagar una cuota mensual.

### Modelo de Dominio
 ![md-dsw.png](https://i.postimg.cc/0Nj3SvBb/MDCanchas.jpg)
 (https://postimg.cc/QFP4hcxF)

## Alcance Funcional
### Alcance Minimo 

Regularidad:
|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Propietario.<br> 2. CRUD Cancha. <br> 3. CRUD Reserva. <br> |
|CRUD dependiente|1. CRUD Tipo de cancha {depende de} CRUD Cancha. <br>2. CRUD Localidad {depende de} CRUD Propietario|
|CUU/Epic|1. Registrarse como propietario de canchas. <br>2. Publicar una cancha. <br> 3. Reservar una cancha|

### Adicional Para Aprobacion 

|Req|Detalle|
|:-|:-|
|CRUD simple|1. CRUD Propietario de Canchas.<br> 2. CRUD Cancha. <br> 3. CRUD Reserva. <br> 4. CRUD Usuario.  <br> 5. CRUD Tipo de cancha, <br> 6.CRUD Localidad. <br> 7. Gestión de Reservas. <br> 8. CRUD Cuota Mensual 
|CUU/Epic| 1.Registro de propietarios. <br> 2.Publicar canchas.<br> 3. Registro usuarios. <br> 4. Reservar cancha. <br> 5. Pago reserva. <br> 6. Gestion de reservas.
