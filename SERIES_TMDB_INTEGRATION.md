# Series TMDB Integration

Esta documentación explica cómo funciona la nueva integración de TMDB para series de Spider-Man.

## 🚀 Características Principales

### 1. API Endpoints
- **GET /api/external/series** - Lista todas las series de Spider-Man desde TMDB
- **GET /api/external/series/[id]** - Detalles completos de una serie específica

### 2. Campos TMDB Añadidos al Modelo Series
```prisma
model Series {
  // Campos existentes...
  
  // Nuevos campos TMDB
  tmdbId              Int?      @unique
  originalTitle       String?
  firstAirDate        String?
  lastAirDate         String?
  status              String?   // "Ended", "Returning Series", etc.
  type                String?   // "Scripted", "Animation", etc.
  originalLanguage    String?
  productionCompanies Json?
  countries           String[]
  imdbId              String?
  homepage            String?
  tagline             String?
  posterPath          String?
  backdropPath        String?
  trailerUrl          String?
  amazonLink          String?
  digitalLinks        Json?
}
```

### 3. Funcionalidades de la API

#### Búsqueda Inteligente
- Busca series usando múltiples keywords de Spider-Man
- Filtra resultados para incluir solo series relevantes
- Deduplica resultados automáticamente

#### Enriquecimiento de Datos
- Obtiene trailers de YouTube
- Genera enlaces de afiliado de Amazon
- Crea enlaces de compra digital (Apple TV, Google Play, Netflix, etc.)
- Incluye información de cast y crew

#### Sistema de Cache
- Cache de 6 horas para listas de series
- Cache de 24 horas para detalles de series específicas
- Mejora significativamente el rendimiento

#### Rate Limiting
- Retrasos entre peticiones para respetar límites de TMDB
- Manejo de errores robusto

## 📋 Scripts Disponibles

### 1. Población de Series desde TMDB
```bash
node populate-series-from-tmdb.js
```
- Busca y guarda series de Spider-Man desde TMDB
- Evita duplicados
- Genera contenido SEO automáticamente

### 2. Testing Completo
```bash
node test-series-tmdb-integration.js
```
- Prueba todos los endpoints
- Valida la funcionalidad de cache
- Verifica manejo de errores

### 3. Test Simple
```bash
node test-series-api-simple.js
```
- Test básico para verificar que la API funciona

## 🔧 Configuración Requerida

### Variables de Entorno
```env
TMDB_API_KEY=tu_clave_tmdb
AMAZON_AFFILIATE_TAG=tu_tag_afiliado  # Opcional
```

### Base de Datos
```bash
# Aplicar cambios del schema
npx prisma db push

# Generar cliente actualizado
npx prisma generate
```

## 🎯 Uso en el Código

### Obtener Lista de Series
```javascript
const response = await fetch('/api/external/series');
const data = await response.json();
console.log(data.results); // Array de series
```

### Obtener Detalles de Serie Específica
```javascript
const response = await fetch('/api/external/series/40358'); // Spectacular Spider-Man
const data = await response.json();
console.log(data.result); // Objeto con detalles completos
```

### Respuesta de Ejemplo
```json
{
  "result": {
    "id": 40358,
    "name": "The Spectacular Spider-Man",
    "first_air_date": "2008-03-08",
    "vote_average": 8.9,
    "number_of_seasons": 2,
    "number_of_episodes": 26,
    "trailer_url": "https://www.youtube.com/watch?v=...",
    "amazon_link": "https://www.amazon.com/s?k=...",
    "digital_purchase_links": [
      {
        "platform": "Amazon Prime Video",
        "url": "https://...",
        "price": "Desde $19.99"
      }
    ]
  }
}
```

## 🔍 Series Conocidas Incluidas

- Spider-Man (1967-1970) - ID: 1427
- Spider-Man and His Amazing Friends (1981-1983) - ID: 2703
- Spider-Man: The Animated Series (1994-1998) - ID: 2704
- Spider-Man: The New Animated Series (2003) - ID: 2705
- The Spectacular Spider-Man (2008-2009) - ID: 40358
- Ultimate Spider-Man (2012-2017) - ID: 52315
- Spider-Man (2017-2020) - ID: 71728
- Spidey and His Amazing Friends (2021-presente) - ID: 119171

## 💰 Monetización

### Enlaces de Afiliado
- Amazon: Búsquedas automáticas con tag de afiliado
- Enlaces a Apple TV, Google Play, Netflix
- Precios estimados incluidos

### Información de Compra
- Múltiples plataformas digitales
- Enlaces directos a IMDb para más información
- Precios y disponibilidad

## ⚠️ Consideraciones

1. **Rate Limiting**: TMDB tiene límites de peticiones por minuto
2. **API Key**: Requerida para funcionamiento completo
3. **Cache**: Importante para rendimiento y respeto de límites
4. **Fallbacks**: El sistema continúa funcionando sin TMDB

## 🚀 Próximos Pasos

1. Integrar con la interfaz de usuario existente
2. Añadir más campos de metadatos si es necesario
3. Implementar sincronización periódica
4. Añadir más fuentes de datos si es requerido