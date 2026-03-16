#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Iniciando población de personajes en la base de datos...\n');

const scripts = [
  {
    name: 'Spider-Verse Characters',
    file: 'add-characters-spider-verse.js',
    description: '15 personajes del Spider-Verse'
  },
  {
    name: 'Spider-Man Villains',
    file: 'add-characters-villains.js',
    description: '15 villanos de Spider-Man'
  },
  {
    name: 'Marvel Universe Characters',
    file: 'add-characters-marvel-universe.js',
    description: '15 personajes del Marvel Universe'
  }
];

async function runScript(script) {
  try {
    console.log(`📂 Ejecutando: ${script.name}`);
    console.log(`📝 ${script.description}`);
    console.log('⏳ Procesando...\n');
    
    const scriptPath = path.join(__dirname, script.file);
    execSync(`node "${scriptPath}"`, { 
      stdio: 'inherit',
      cwd: __dirname
    });
    
    console.log(`✅ ${script.name} completado exitosamente!\n`);
    
  } catch (error) {
    console.error(`❌ Error ejecutando ${script.name}:`, error.message);
    console.log('🔄 Continuando con el siguiente script...\n');
  }
}

async function populateAllCharacters() {
  console.log('🎯 Objetivo: Agregar 45 personajes en total');
  console.log('📊 Distribución:');
  scripts.forEach(script => {
    console.log(`   • ${script.description}`);
  });
  console.log('\n🔥 ¡Comenzando proceso!\n');
  console.log('=' .repeat(60) + '\n');

  for (const script of scripts) {
    await runScript(script);
  }

  console.log('=' .repeat(60));
  console.log('🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!');
  console.log('📈 Se han agregado 45 nuevos personajes a la base de datos');
  console.log('🗂️  Categorías:');
  console.log('   • 15 personajes del Spider-Verse');
  console.log('   • 15 villanos de Spider-Man');
  console.log('   • 15 personajes del Marvel Universe');
  console.log('\n🔍 Puedes verificar los personajes en:');
  console.log('   • /personajes (página principal)');
  console.log('   • Database: tabla characters');
  console.log('\n🌟 ¡Tu web Spider-Man ahora tiene una base de datos completa de personajes!');
}

// Ejecutar el script principal
populateAllCharacters()
  .catch((error) => {
    console.error('\n💥 Error fatal en el proceso:', error);
    process.exit(1);
  });