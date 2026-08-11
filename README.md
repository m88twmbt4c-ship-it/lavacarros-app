# Lavacarros a domicilio — cómo ponerlo a funcionar

## 1. Crear la base de datos (Supabase, gratis)
1. Ve a https://supabase.com y crea una cuenta gratis.
2. Crea un nuevo proyecto.
3. En el menú izquierdo, entra a "SQL Editor".
4. Abre el archivo `supabase/schema.sql` de este proyecto, copia todo su contenido, pégalo ahí y dale "Run".
5. En el menú izquierdo, entra a "Project Settings" > "API". Ahí vas a ver dos datos que necesitas:
   - "Project URL"
   - "anon public" key

## 2. Conectar la app con la base de datos
1. Dentro de esta carpeta, copia el archivo `.env.example` y renómbralo a `.env.local`.
2. Pega ahí tu "Project URL" y tu "anon public" key (los que sacaste en el paso anterior).

## 3. Probarlo en tu computadora (opcional, antes de publicarlo)
Necesitas tener Node.js instalado (descárgalo gratis de https://nodejs.org).
Luego, abre una terminal dentro de esta carpeta y corre:
```
npm install
npm run dev
```
Abre http://localhost:3000 en tu navegador para verlo funcionando.

## 4. Publicarlo gratis (Vercel)
1. Sube esta carpeta a un repositorio de GitHub (gratis, en https://github.com).
2. Ve a https://vercel.com, crea una cuenta gratis, y conecta tu cuenta de GitHub.
3. Importa el repositorio que acabas de subir.
4. Cuando te pida las variables de entorno, agrega las mismas dos que pusiste en `.env.local`
   (NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY).
5. Dale "Deploy". En un par de minutos tu app estará publicada con una URL gratis.

## Páginas de la app
- `/` — página principal, donde el cliente busca lavacarros cerca de su ubicación.
- `/registro` — donde un lavacarros independiente se da de alta.
- `/perfil/[id]` — perfil de cada lavacarros, con reseñas y el botón "ya lo usé".
- `/admin` — donde apruebas o rechazas los registros nuevos.

## Importante — pendiente de resolver antes de publicarlo
- **La página `/admin` no tiene contraseña todavía.** Ahorita cualquiera que sepa la dirección
  podría aprobar o rechazar negocios. Antes de publicar la app de verdad, hay que agregarle
  un login (Supabase ya trae autenticación lista para esto — lo podemos armar en la siguiente sesión).
- La búsqueda de direcciones usa un servicio gratuito (Nominatim) que tiene un límite de uso
  razonable — funciona bien para empezar, pero si la app crece mucho puede necesitar ajustes.
