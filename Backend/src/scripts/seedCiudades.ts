import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ciudad from '../models/Ciudad';

dotenv.config();

const ciudadesArgentinas = [
  'Buenos Aires',
  'Córdoba', 
  'Rosario',
  'Mendoza',
  'San Miguel de Tucumán',
  'La Plata',
  'Mar del Plata',
  'Salta',
  'Santa Fe',
  'San Juan',
  'Resistencia',
  'Neuquén',
  'Posadas',
  'Bahía Blanca',
  'Paraná',
  'San Salvador de Jujuy',
  'Formosa',
  'San Luis',
  'Catamarca',
  'La Rioja',
  'Villa Carlos Paz',
  'Villa General Belgrano',
  'Tandil',
  'San Carlos de Bariloche',
  'Ushuaia'
];

const seedCiudades = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || '';
    
    if (!MONGO_URI) {
      console.error('❌ MONGO_URI no encontrada en .env');
      process.exit(1);
    }

    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar ciudades existentes
    await Ciudad.deleteMany({});
    console.log('🗑️ Ciudades existentes eliminadas');

    // Crear ciudades con creadaPor: 'desarrollador'
    const ciudadesConMetadata = ciudadesArgentinas.map(nombre => ({
      nombre,
      creadaPor: 'desarrollador' as const
    }));

    const ciudadesCreadas = await Ciudad.insertMany(ciudadesConMetadata);
    console.log(`✅ ${ciudadesCreadas.length} ciudades creadas exitosamente`);

    // Mostrar algunas ciudades creadas
    console.log('\n📍 Ciudades creadas:');
    ciudadesCreadas.forEach(ciudad => {
      console.log(`   - ${ciudad.nombre}`);
    });

    console.log('\n🎉 Seed de ciudades completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed de ciudades:', error);
    process.exit(1);
  }
};

// Ejecutar si este archivo se llama directamente
if (require.main === module) {
  seedCiudades();
}

export default seedCiudades;