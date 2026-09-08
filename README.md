# seguridad

Sitio estático desplegable en [Netlify](https://www.netlify.com/). Sin paso de
build, sin dependencias: Netlify publica la carpeta `public/` tal cual.

## Estructura

```
netlify.toml            configuración del deploy + cabeceras de seguridad
public/                 <- esto es lo que se publica
  index.html            portada
  404.html              página de error (Netlify la sirve automáticamente)
  favicon.svg
  robots.txt
  assets/site.css       toda la hoja de estilo
```

## Desplegar

**Desde la interfaz de Netlify** (una sola vez):

1. *Add new site → Import an existing project → GitHub*.
2. Elige el repositorio `selvadentromarketing-vibes/seguridad`.
3. Deja **Build command** vacío y **Publish directory** en `public`.
   Netlify ya lee estos valores de `netlify.toml`, así que no hay que tocar nada.
4. *Deploy*.

A partir de ahí, cada `git push` a la rama de producción vuelve a desplegar.
Las ramas y los pull requests generan *deploy previews* con su propia URL.

**Desde la terminal**, con la [CLI de Netlify](https://docs.netlify.com/cli/get-started/):

```bash
npm install -g netlify-cli
netlify login
netlify init      # enlaza el repo con un sitio de Netlify
netlify deploy --prod
```

## Previsualizar en local

Cualquier servidor estático sirve, porque no hay build:

```bash
python3 -m http.server 8000 --directory public
# http://localhost:8000
```

Para que también se apliquen las cabeceras y redirecciones de `netlify.toml`:

```bash
netlify dev
```

## Cabeceras de seguridad

`netlify.toml` sale con CSP, HSTS, `X-Frame-Options`, `nosniff`,
`Referrer-Policy`, `Permissions-Policy` y `Cross-Origin-Opener-Policy` puestas.
Se comprueban en vivo con:

```bash
curl -sI https://tu-dominio | grep -i -E 'content-security|strict-transport|x-frame|x-content|referrer|permissions|cross-origin'
```

Dos cosas a tener en cuenta al editar el sitio:

- **La CSP es restrictiva a propósito.** Permite recursos propios y Google Fonts,
  nada más. Si añades analítica, un script de terceros, un iframe de YouTube o
  una tipografía de otro proveedor, hay que ampliar la política en `netlify.toml`
  o el navegador lo bloqueará en silencio (el motivo aparece en la consola).
  `script-src 'self'` bloquea también el JavaScript en línea: los scripts van en
  archivos dentro de `public/`.
- **HSTS incluye subdominios durante un año.** `includeSubDomains` obliga a HTTPS
  en todo `tu-dominio` y sus subdominios, y los navegadores lo recuerdan durante
  ese plazo. Si algún subdominio todavía sirve por HTTP, quita
  `includeSubDomains` de la cabecera antes de conectar el dominio.

## Indexación

`public/robots.txt` permite indexar todo. Si el sitio va a estar un tiempo en
construcción con el dominio ya conectado, dentro del archivo están comentadas
las líneas para bloquear los rastreadores mientras tanto.
