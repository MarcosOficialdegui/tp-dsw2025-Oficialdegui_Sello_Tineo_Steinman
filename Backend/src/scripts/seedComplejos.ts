import mongoose from 'mongoose';
import Complejo, { SERVICIOS_DISPONIBLES } from '../models/Complejo';
import Ciudad from '../models/Ciudad';
import dotenv from 'dotenv';

dotenv.config();

// Datos de ejemplo para complejos
const complejosEjemplo = [
  {
    nombre: "SportCourt Centro",
    direccion: "Av. Principal 123",
    ciudad: "Buenos Aires",
    servicios: ["Vestuario", "Estacionamiento", "Bar / Restaurante", "Wi-Fi"],
    canchas: [
      {
        tipoCancha: "Futbol 5",
        precioHora: 25000,
        disponible: true
      },
      {
        tipoCancha: "Futbol 7",
        precioHora: 30000,
        disponible: true
      }
    ]
  },
  {
    nombre: "Complejo Deportivo Norte",
    direccion: "Calle Norte 456",
    ciudad: "Córdoba",
    servicios: ["Vestuario", "Estacionamiento", "Parrilla", "Quincho", "Cumpleaños", "Seguridad"],
    canchas: [
      {
        tipoCancha: "Futbol 5",
        precioHora: 22000,
        disponible: true
      },
      {
        tipoCancha: "Padel",
        precioHora: 18000,
        disponible: true
      }
    ]
  },
  {
    nombre: "Arena Sports",
    direccion: "Boulevard Sur 789",
    ciudad: "Rosario",
    servicios: ["Vestuario", "Estacionamiento", "Torneos", "Wi-Fi", "Buffet"],
    canchas: [
      {
        tipoCancha: "Futbol 5",
        precioHora: 20000,
        disponible: true
      }
    ]
  },
  {
    nombre: "Complejo Premium Club",
    direccion: "Av. Libertador 1500",
    ciudad: "Buenos Aires",
    servicios: ["Vestuario", "Estacionamiento", "Bar / Restaurante", "Quincho", "Cumpleaños", "Seguridad", "Wi-Fi"],
    canchas: [
      {
        tipoCancha: "Futbol 5",
        precioHora: 35000,
        disponible: true
      },
      {
        tipoCancha: "Futbol 7",
        precioHora: 45000,
        disponible: true
      },
      {
        tipoCancha: "Padel",
        precioHora: 28000,
        disponible: true
      }
    ]
  },
  {
    nombre: "Sport Center Villa",
    direccion: "Calle Belgrano 234",
    ciudad: "Mendoza",
    servicios: ["Vestuario", "Parrilla", "Quincho", "Cumpleaños"],
    canchas: [
      {
        tipoCancha: "Futbol 5",
        precioHora: 18000,
        disponible: true
      },
      {
        tipoCancha: "Padel",
        precioHora: 15000,
        disponible: true
      }
    ]
  },
  {
    nombre: "Cancha Express",
    direccion: "Ruta 9 Km 15",
    ciudad: "La Plata",
    servicios: ["Vestuario", "Estacionamiento"],
    canchas: [
      {
        tipoCancha: "Futbol 7",
        precioHora: 26000,
        disponible: true
      }
    ]
  },
  {
    nombre: "Club Deportivo Elite",
    direccion: "Av. San Martín 890",
    ciudad: "Córdoba",
    servicios: ["Vestuario", "Estacionamiento", "Bar / Restaurante", "Torneos", "Buffet", "Seguridad", "Wi-Fi"],
    canchas: [
      {
        tipoCancha: "Futbol 5",
        precioHora: 24000,
        disponible: true
      },
      {
        tipoCancha: "Futbol 7",
        precioHora: 32000,
        disponible: true
      },
      {
        tipoCancha: "Padel",
        precioHora: 20000,
        disponible: true
      },
      {
        tipoCancha: "Padel",
        precioHora: 20000,
        disponible: true
      }
    ]
  },
  {
    nombre: "Pádel House",
    direccion: "Av. Rivadavia 567",
    ciudad: "Buenos Aires",
    servicios: ["Vestuario", "Bar / Restaurante", "Wi-Fi", "Buffet"],
    canchas: [
      {
        tipoCancha: "Padel",
        precioHora: 22000,
        disponible: true
      },
      {
        tipoCancha: "Padel",
        precioHora: 22000,
        disponible: true
      },
      {
        tipoCancha: "Padel",
        precioHora: 25000,
        disponible: true
      }
    ]
  }
];

async function seedComplejos() {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ Conectado a MongoDB');

    console.log('🗑️ Limpiando complejos existentes...');
    await Complejo.deleteMany({});

    console.log('🔍 Buscando ciudades para asociar...');
    
    // Crear complejos con ObjectIds de ciudades reales
    const complejosConCiudadId = [];
    
    for (const complejoData of complejosEjemplo) {
      // Buscar la ciudad por nombre
      const ciudadEncontrada = await Ciudad.findOne({ 
        nombre: new RegExp(`^${complejoData.ciudad}$`, 'i') 
      });
      
      if (ciudadEncontrada) {
        const complejoConCiudadId = {
          ...complejoData,
          ciudad: ciudadEncontrada._id // Usar ObjectId en lugar del nombre
        };
        complejosConCiudadId.push(complejoConCiudadId);
        console.log(`  ✅ ${complejoData.nombre} → ${ciudadEncontrada.nombre} (${ciudadEncontrada._id})`);
      } else {
        console.log(`  ❌ No se encontró la ciudad: ${complejoData.ciudad}`);
      }
    }

    console.log(`\n🌱 Creando ${complejosConCiudadId.length} complejos...`);
    const complejosCreados = await Complejo.insertMany(complejosConCiudadId);
    
    console.log(`\n✅ Se crearon ${complejosCreados.length} complejos exitosamente`);

  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar el script
seedComplejos();
