# Integración API de Marvel

Este proyecto incluye una integración completa con la API oficial de Marvel Comics para obtener datos e imágenes de alta calidad de personajes, cómics y series.

## 🚀 Configuración

### 1. Obtener Credenciales de Marvel API

1. Ve a [Marvel Developer Portal](https://developer.marvel.com/)
2. Crea una cuenta gratuita
3. Obtén tu **Public Key** y **Private Key**

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Marvel API Configuration
MARVEL_PUBLIC_KEY=tu_public_key_aqui
MARVEL_PRIVATE_KEY=tu_private_key_aqui

# Next.js Configuration
NEXT_PUBLIC_MARVEL_API_URL=https://gateway.marvel.com/v1/public
```

### 3. Funcionalidades Disponibles

#### 📦 Servicios API (`lib/marvel-api.ts`)

- **`getSpiderManCharacter()`** - Obtiene datos de Spider-Man
- **`getSpiderVerseCharacters()`** - Obtiene personajes del Spider-Verse
- **`getSpiderManComics()`** - Obtiene cómics de Spider-Man
- **`getSpiderManSeries()`** - Obtiene series de Spider-Man
- **`searchCharacters()`** - Busca personajes por nombre
- **`getHighQualityImageUrl()`** - Genera URLs de imágenes HD

#### 🎨 Componentes UI

- **`MarvelCharacterCard`** - Tarjeta individual de personaje
- **`MarvelCharacterGrid`** - Grid de múltiples personajes

#### 📄 Páginas

- **`/personajes`** - Página principal de personajes Marvel

## 🖼️ Calidad de Imágenes

La API de Marvel proporciona imágenes en múltiples resoluciones:

- **`portrait_xlarge`** - 150x225px
- **`landscape_xlarge`** - 270x200px  
- **`standard_xlarge`** - 200x200px
- **`detail`** - Máxima resolución disponible

## 📊 Datos Disponibles

### Personajes
- Información básica (nombre, descripción)
- Imágenes oficiales de alta calidad
- Número de cómics y series
- Enlaces oficiales de Marvel

### Cómics
- Títulos y descripciones
- Fechas de publicación
- Creadores (escritores, artistas)
- Imágenes de portadas

### Series
- Información de series
- Años de inicio y fin
- Clasificaciones
- Creadores

## 🔒 Autenticación

La API utiliza autenticación MD5 hash:
```
hash = MD5(timestamp + privateKey + publicKey)
```

El sistema maneja automáticamente:
- Generación de timestamps
- Creación de hashes MD5
- Construcción de URLs autenticadas

## 🚀 Uso

```typescript
import { getSpiderVerseCharacters, getHighQualityImageUrl } from '@/lib/marvel-api';

// Obtener personajes
const characters = await getSpiderVerseCharacters();

// Obtener imagen de alta calidad
const imageUrl = getHighQualityImageUrl(character.thumbnail, 'detail');
```

## 📈 Límites y Caché

- **Rate Limit**: 3000 requests/día (cuenta gratuita)
- **Caché**: Las respuestas se cachean por 1 hora
- **Revalidación**: Automática en Next.js

## 🛠️ Troubleshooting

### Error: "Marvel API error: 401"
- Verifica que las keys estén correctas
- Asegúrate de que el dominio esté autorizado

### Error: "Marvel API error: 409"
- Has excedido el rate limit
- Espera o actualiza tu plan

### Imágenes no cargan
- Las imágenes tienen fallback automático
- Verifica la URL generada

## 🌟 Características

✅ **Datos Oficiales** - Directamente de Marvel Comics  
✅ **Imágenes HD** - Máxima calidad disponible  
✅ **Caché Inteligente** - Optimización de rendimiento  
✅ **Fallback Automático** - Manejo de errores robusto  
✅ **TypeScript** - Tipado completo  
✅ **SSR Compatible** - Server-side rendering

## 📝 Ejemplo Completo

```tsx
import { getSpiderVerseCharacters } from '@/lib/marvel-api';
import { MarvelCharacterGrid } from '@/components/marvel/MarvelCharacterCard';

export default async function PersonajesPage() {
  const characters = await getSpiderVerseCharacters();
  
  return (
    <div>
      <h1>Personajes Marvel</h1>
      <MarvelCharacterGrid 
        characters={characters}
        title="El Spider-Verse"
        maxItems={6}
      />
    </div>
  );
}
```

Esta integración te permite mostrar contenido oficial de Marvel con imágenes de alta calidad, mejorando significativamente la experiencia visual de tu sitio web Spider-Man. 