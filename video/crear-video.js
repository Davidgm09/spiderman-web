/**
 * Crea un vídeo vertical (1080x1920, para TikTok, Shorts y Reels) a partir de un artículo del blog.
 *
 *   1. Guion: la API de Claude resume el artículo en 30-60 segundos (solo con datos del artículo).
 *   2. Voz: voces gratuitas de Microsoft Edge (video/tts.py, paquete edge-tts).
 *   3. Imágenes: las del propio artículo, con zoom suave y fondo desenfocado.
 *   4. Subtítulos grandes palabra a palabra, sincronizados con la voz.
 *   5. Música de fondo opcional: cualquier .mp3 de video/musica (usa música libre de derechos).
 *
 * Uso:
 *   node video/crear-video.js                      → menú con los últimos artículos
 *   node video/crear-video.js <slug>               → un artículo concreto
 *   node video/crear-video.js <slug> --guion g.json → usa un guion propio en vez de la API de Claude
 *
 * Requisitos: ffmpeg, Python con edge-tts (pip install -U edge-tts) y ANTHROPIC_API_KEY en .env.
 * El resultado se guarda en el Escritorio, en la carpeta «Videos Sentido Aracnido».
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const { spawnSync, spawn } = require('child_process');

const RAIZ = path.join(__dirname, '..');
require('dotenv').config({ path: path.join(RAIZ, '.env') });
const { PrismaClient } = require('@prisma/client');

const CONFIG = {
  modelo: 'claude-sonnet-5-5',
  voz: 'es-ES-AlvaroNeural', // también: es-ES-ElviraNeural, es-ES-XimenaNeural
  velocidad: '+8%',
  ancho: 1080,
  alto: 1920,
  fps: 30,
  pausa: 0.3, // silencio entre escenas (segundos)
  volumenMusica: 0.12,
  web: 'https://www.sentidoaracnido.com',
};
const SALIDA = path.join(os.homedir(), 'Desktop', 'Videos Sentido Aracnido');
const MUSICA = path.join(__dirname, 'musica');

// ---------- utilidades ----------

const paso = (n, texto) => console.log(`\n[${n}/6] ${texto}`);

function ejecutar(cmd, args, opciones = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...opciones });
  if (r.error) throw new Error(`No se pudo ejecutar ${cmd}: ${r.error.message}`);
  if (r.status !== 0) throw new Error(`${cmd} falló:\n${(r.stderr || r.stdout || '').slice(-1500)}`);
  return r.stdout;
}

const ffmpeg = (args, cwd) => ejecutar('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], { cwd });
const duracion = (archivo) =>
  parseFloat(ejecutar('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', archivo]));

function preguntar(texto) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((ok) => rl.question(texto, (r) => { rl.close(); ok(r.trim()); }));
}

const textoPlano = (html) =>
  html.replace(/<figure[\s\S]*?<\/figure>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

// ---------- 1. artículo ----------

async function elegirArticulo(prisma, slugArg) {
  if (slugArg) {
    const post = await prisma.blogPost.findUnique({ where: { slug: slugArg } });
    if (!post) throw new Error(`No existe ningún artículo con el slug «${slugArg}».`);
    return post;
  }
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishDate: 'desc' },
  });
  console.log('\nArtículos disponibles:\n');
  posts.forEach((p, i) => console.log(`  ${String(i + 1).padStart(2)}. ${p.title}`));
  const r = await preguntar('\nEscribe el número del artículo (o pega su slug): ');
  const n = parseInt(r, 10);
  const post = n >= 1 && n <= posts.length ? posts[n - 1] : posts.find((p) => p.slug === r) || (await prisma.blogPost.findUnique({ where: { slug: r } }));
  if (!post) throw new Error('No he encontrado ese artículo.');
  return post;
}

function imagenesDelArticulo(post) {
  const abs = (u) => (u.startsWith('/') ? CONFIG.web + u : u);
  const lista = [];
  if (post.image) lista.push({ url: abs(post.image), pie: `Imagen principal: ${post.title}` });
  for (const m of post.content.matchAll(/<figure>\s*<img src="([^"]+)"[^>]*>\s*<figcaption>([\s\S]*?)<\/figcaption>/g)) {
    const pie = m[2].replace(/<[^>]+>/g, '').trim();
    if (/montaje hecho por fans/i.test(pie)) continue; // nunca presentar como oficial una imagen de fans
    if (!lista.some((x) => x.url === abs(m[1]))) lista.push({ url: abs(m[1]), pie });
  }
  return lista.slice(0, 12);
}

// ---------- 2. guion ----------

const SISTEMA = `Eres guionista de vídeos cortos (TikTok, YouTube Shorts, Reels) para «Sentido Arácnido», una web española sobre Spider-Man.
Escribes en español de España, con frases cortas, ritmo rápido y tono cercano y entusiasta, sin exagerar.
Reglas estrictas:
- Usa SOLO datos que aparezcan en el artículo. No inventes cifras, fechas, nombres ni opiniones que no estén en él.
- Duración: entre 100 y 140 palabras en total (unos 35-55 segundos).
- Entre 5 y 7 escenas. La primera es un gancho de 12 palabras como máximo que haga querer seguir viendo.
- La última escena termina con: «Lo tienes completo en Sentido Arácnido. Enlace en la bio.»
- El texto de voz no lleva emojis, hashtags, comillas raras, paréntesis ni abreviaturas; escribe los números como se leen en voz alta cuando haga falta.
- Cada escena elige una imagen de la lista por su número; varía las imágenes y que tengan relación con lo que se dice.
- «rotulo» es un texto corto en pantalla (máximo 5 palabras) que resume la escena; puede ir vacío.
Responde SOLO con un objeto JSON válido, sin texto antes ni después, con esta forma:
{"titulo": "...", "escenas": [{"voz": "...", "rotulo": "...", "imagen": 0}], "descripcion": "2-3 frases para el texto de la publicación, invitando a leer el artículo", "hashtags": ["#SpiderMan", "..."]}`;

async function pedirGuion(post, imagenes) {
  const clave = process.env.ANTHROPIC_API_KEY;
  if (!clave) {
    throw new Error(
      'Falta ANTHROPIC_API_KEY en el archivo .env.\n' +
      'Créala en https://console.anthropic.com (Settings → API Keys) y añade al .env una línea:\n' +
      'ANTHROPIC_API_KEY=tu_clave'
    );
  }
  const usuario =
    `ARTÍCULO: ${post.title}\n\n${textoPlano(post.content).slice(0, 14000)}\n\n` +
    `IMÁGENES DISPONIBLES:\n${imagenes.map((im, i) => `${i}. ${im.pie}`).join('\n')}`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': clave, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: CONFIG.modelo, max_tokens: 2000, system: SISTEMA, messages: [{ role: 'user', content: usuario }] }),
  });
  const datos = await res.json();
  if (!res.ok) throw new Error(`La API de Claude respondió ${res.status}: ${datos.error?.message || JSON.stringify(datos).slice(0, 300)}`);
  const texto = datos.content.map((c) => c.text || '').join('');
  const json = texto.slice(texto.indexOf('{'), texto.lastIndexOf('}') + 1);
  return JSON.parse(json);
}

function validarGuion(guion, numImagenes) {
  if (!Array.isArray(guion.escenas) || !guion.escenas.length) throw new Error('El guion no tiene escenas.');
  guion.escenas = guion.escenas
    .filter((e) => e.voz && e.voz.trim())
    .map((e, i) => ({
      voz: e.voz.trim(),
      rotulo: (e.rotulo || '').trim(),
      imagen: Number.isInteger(e.imagen) && e.imagen >= 0 && e.imagen < numImagenes ? e.imagen : i % numImagenes,
    }));
  guion.hashtags = Array.isArray(guion.hashtags) ? guion.hashtags : ['#SpiderMan', '#Marvel'];
  return guion;
}

// ---------- 3. voz ----------

function generarVoz(guion, dir) {
  fs.writeFileSync(path.join(dir, 'textos.json'), JSON.stringify(guion.escenas.map((e) => e.voz)), 'utf8');
  try {
    ejecutar('python', [path.join(__dirname, 'tts.py'), 'textos.json', '.', CONFIG.voz, CONFIG.velocidad], { cwd: dir });
  } catch (e) {
    if (/403/.test(e.message)) throw new Error('Microsoft ha cambiado su servicio de voz. Actualiza la librería con:\n  pip install -U edge-tts');
    throw e;
  }
  return JSON.parse(fs.readFileSync(path.join(dir, 'palabras.json'), 'utf8'));
}

// ---------- 4. imágenes y clips ----------

async function descargar(url, destino) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 SentidoAracnido-video' } });
  if (!res.ok) throw new Error(`No se pudo descargar ${url} (${res.status})`);
  fs.writeFileSync(destino, Buffer.from(await res.arrayBuffer()));
}

function crearClip(dir, i, imagen, segundos) {
  const { ancho: W, alto: H, fps } = CONFIG;
  const fotograma = `fondo_${i}.png`;
  // Fondo: la misma imagen ampliada, desenfocada y oscurecida. Encima, la imagen completa algo por arriba del centro.
  ffmpeg([
    '-i', imagen,
    '-filter_complex',
    `[0]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},boxblur=28:2,eq=brightness=-0.28[bg];` +
    // Las imágenes muy apaisadas se recortan por los lados (como mucho a 5:4) para que ocupen más pantalla
    `[0]crop='min(iw,ih*1.25)':ih,scale=${W - 60}:${Math.round(H * 0.62)}:force_original_aspect_ratio=decrease[fg];` +
    `[bg][fg]overlay=(W-w)/2:(H-h)/2-170`,
    '-frames:v', '1', fotograma,
  ], dir);
  const frames = Math.ceil(segundos * fps);
  // Zoom suave: unas escenas acercan y otras alejan
  const z = i % 2 === 0 ? `min(1+0.10*on/${frames},1.10)` : `max(1.10-0.10*on/${frames},1)`;
  ffmpeg([
    '-i', fotograma,
    '-vf', `scale=${W * 2}:${H * 2},zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${W}x${H}:fps=${fps},format=yuv420p`,
    '-frames:v', String(frames), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', `clip_${i}.mp4`,
  ], dir);
}

// ---------- 5. subtítulos (ASS) ----------

const tiempoASS = (s) => {
  const cs = Math.max(0, Math.round(s * 100));
  const h = Math.floor(cs / 360000), m = Math.floor((cs % 360000) / 6000), seg = Math.floor((cs % 6000) / 100);
  return `${h}:${String(m).padStart(2, '0')}:${String(seg).padStart(2, '0')}.${String(cs % 100).padStart(2, '0')}`;
};
const limpiarASS = (t) => t.replace(/[{}\\]/g, '');

// La voz devuelve las palabras sin puntuación: se cruzan con el texto del guion para recuperarla
const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]/g, '');
function conPuntuacion(texto, lista) {
  const tokens = texto.split(/\s+/).filter(Boolean);
  let j = 0;
  return lista.map((p) => {
    const objetivo = normalizar(p.t);
    let k = j;
    while (k < tokens.length && normalizar(tokens[k]) !== objetivo) k++;
    if (k < tokens.length) {
      j = k + 1;
      return { ...p, t: tokens[k].replace(/^[«"“(]+|[»"”)]+$/g, '') };
    }
    return p;
  });
}

function crearSubtitulos(guion, palabras, inicios, duraciones, total) {
  const { ancho: W, alto: H } = CONFIG;
  const lineas = [
    '[Script Info]', 'ScriptType: v4.00+', `PlayResX: ${W}`, `PlayResY: ${H}`, 'WrapStyle: 0', '',
    '[V4+ Styles]',
    'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
    'Style: Sub,Arial Black,84,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,7,2,2,70,70,430,1',
    'Style: Rotulo,Arial Black,62,&H0000E6FF,&H0000E6FF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,3,14,0,8,80,80,190,1',
    'Style: Marca,Arial,36,&H50FFFFFF,&H50FFFFFF,&H64000000,&H00000000,-1,0,0,0,100,100,0,0,1,2,0,2,40,40,110,1',
    '', '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text',
  ];
  const ev = (capa, ini, fin, estilo, texto) => lineas.push(`Dialogue: ${capa},${tiempoASS(ini)},${tiempoASS(fin)},${estilo},,0,0,0,,${texto}`);

  ev(0, 0, total, 'Marca', 'sentidoaracnido.com');
  guion.escenas.forEach((escena, i) => {
    const t0 = inicios[i];
    if (escena.rotulo) ev(1, t0, t0 + duraciones[i], 'Rotulo', limpiarASS(escena.rotulo.toUpperCase()));
    // Grupos de hasta 3 palabras (se corta antes en los signos de puntuación); la palabra que suena va en amarillo
    const lista = conPuntuacion(escena.voz, palabras[i]);
    const grupos = [];
    let actual = [];
    lista.forEach((p) => {
      actual.push(p);
      if (actual.length === 3 || /[.,;:!?…]$/.test(p.t)) { grupos.push(actual); actual = []; }
    });
    if (actual.length) grupos.push(actual);
    grupos.forEach((g, gi) => {
      const finGrupo = gi + 1 < grupos.length ? grupos[gi + 1][0].ini : Math.min(g[g.length - 1].fin + 0.25, duraciones[i]);
      g.forEach((p, pi) => {
        const ini = t0 + p.ini;
        const fin = t0 + (pi + 1 < g.length ? g[pi + 1].ini : finGrupo);
        // En pantalla no se muestran comas ni puntos finales (sí ¿? y ¡!)
        const mostrar = (t) => limpiarASS(t.replace(/[.,;:…]+$/, ''));
        const texto = g.map((x, xi) => (xi === pi ? `{\\c&H0000E6FF&}${mostrar(x.t)}{\\c&H00FFFFFF&}` : mostrar(x.t))).join(' ');
        ev(2, ini, Math.max(fin, ini + 0.05), 'Sub', texto.toUpperCase().replace(/\{\\C&H/g, '{\\c&H'));
      });
    });
  });
  return lineas.join('\n') + '\n';
}

// ---------- 6. montaje ----------

function montar(dir, guion, palabras) {
  const n = guion.escenas.length;
  const durVoz = guion.escenas.map((_, i) => duracion(path.join(dir, `escena_${i}.mp3`)));
  const duraciones = durVoz.map((d) => d + CONFIG.pausa);
  const inicios = duraciones.map((_, i) => duraciones.slice(0, i).reduce((a, b) => a + b, 0));
  const total = duraciones.reduce((a, b) => a + b, 0);

  // Audio: cada escena con su silencio final, todas seguidas
  for (let i = 0; i < n; i++) {
    ffmpeg(['-i', `escena_${i}.mp3`, '-af', `apad=whole_dur=${duraciones[i].toFixed(3)}`, '-ar', '44100', '-ac', '2', `audio_${i}.wav`], dir);
  }
  fs.writeFileSync(path.join(dir, 'audios.txt'), Array.from({ length: n }, (_, i) => `file 'audio_${i}.wav'`).join('\n'));
  ffmpeg(['-f', 'concat', '-safe', '0', '-i', 'audios.txt', '-c', 'copy', 'voz.wav'], dir);

  // Vídeo: clips seguidos
  fs.writeFileSync(path.join(dir, 'clips.txt'), Array.from({ length: n }, (_, i) => `file 'clip_${i}.mp4'`).join('\n'));
  ffmpeg(['-f', 'concat', '-safe', '0', '-i', 'clips.txt', '-c', 'copy', 'imagen.mp4'], dir);

  fs.writeFileSync(path.join(dir, 'subtitulos.ass'), crearSubtitulos(guion, palabras, inicios, duraciones, total), 'utf8');

  const canciones = fs.existsSync(MUSICA) ? fs.readdirSync(MUSICA).filter((f) => /\.mp3$/i.test(f)) : [];
  const args = ['-i', 'imagen.mp4', '-i', 'voz.wav'];
  let filtro = '[0:v]subtitles=subtitulos.ass[v]';
  let audio = '1:a';
  if (canciones.length) {
    const cancion = path.join(MUSICA, canciones[Math.floor(Math.random() * canciones.length)]);
    console.log(`   Música: ${path.basename(cancion)}`);
    args.push('-stream_loop', '-1', '-i', cancion);
    filtro += `;[2:a]volume=${CONFIG.volumenMusica},afade=t=out:st=${Math.max(0, total - 1.5).toFixed(2)}:d=1.5[m];[1:a][m]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[a]`;
    audio = '[a]';
  }
  ffmpeg([
    ...args, '-filter_complex', filtro, '-map', '[v]', '-map', audio,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-t', total.toFixed(3), '-movflags', '+faststart', 'final.mp4',
  ], dir);
  return total;
}

// ---------- principal ----------

(async () => {
  const prisma = new PrismaClient();
  const argumentos = process.argv.slice(2);
  const iGuion = argumentos.indexOf('--guion');
  const guionPropio = iGuion >= 0 ? argumentos[iGuion + 1] : null;
  const slug = argumentos.find((a, i) => !a.startsWith('--') && i !== iGuion + 1);

  console.log('=== Crear vídeo · Sentido Arácnido ===');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sentido-video-'));
  try {
    paso(1, 'Artículo');
    const post = await elegirArticulo(prisma, slug);
    console.log(`   ${post.title}`);
    const imagenes = imagenesDelArticulo(post);
    if (!imagenes.length) throw new Error('El artículo no tiene imágenes.');

    paso(2, guionPropio ? 'Guion (archivo propio)' : 'Guion (API de Claude)');
    const guion = validarGuion(
      guionPropio ? JSON.parse(fs.readFileSync(path.resolve(guionPropio), 'utf8')) : await pedirGuion(post, imagenes),
      imagenes.length
    );
    guion.escenas.forEach((e, i) => console.log(`   ${i + 1}. ${e.voz}`));

    paso(3, 'Voz');
    const palabras = generarVoz(guion, dir);

    paso(4, 'Imágenes');
    const usadas = [...new Set(guion.escenas.map((e) => e.imagen))];
    for (const i of usadas) await descargar(imagenes[i].url, path.join(dir, `img_${i}`));
    guion.escenas.forEach((e, i) => {
      const segundos = duracion(path.join(dir, `escena_${i}.mp3`)) + CONFIG.pausa;
      crearClip(dir, i, `img_${e.imagen}`, segundos);
      process.stdout.write(`   escena ${i + 1}/${guion.escenas.length} lista\r`);
    });
    console.log('');

    paso(5, 'Montaje con subtítulos');
    const total = montar(dir, guion, palabras);

    paso(6, 'Guardando');
    fs.mkdirSync(SALIDA, { recursive: true });
    const base = `${new Date().toISOString().slice(0, 10)}-${post.slug}`.slice(0, 90);
    const mp4 = path.join(SALIDA, `${base}.mp4`);
    fs.copyFileSync(path.join(dir, 'final.mp4'), mp4);
    const enlace = `${CONFIG.web}/blog/${post.slug}`;
    fs.writeFileSync(
      path.join(SALIDA, `${base}.txt`),
      `${guion.titulo || post.title}\n\n${guion.descripcion || ''}\n\n${enlace}\n\n${guion.hashtags.join(' ')}\n\n--- Guion ---\n` +
      guion.escenas.map((e, i) => `${i + 1}. ${e.voz}`).join('\n') + '\n',
      'utf8'
    );
    console.log(`\nListo: ${mp4} (${total.toFixed(0)} s)`);
    console.log(`Texto para la publicación: ${base}.txt`);
    spawn('explorer', [SALIDA], { detached: true, stdio: 'ignore' }).unref();
  } catch (e) {
    console.error(`\nERROR: ${e.message}`);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
    if (!process.exitCode) fs.rmSync(dir, { recursive: true, force: true });
    else console.error(`(Archivos temporales en ${dir})`);
  }
})();
