# Landing Seguridad · Selvadentro Tulum

Siete variantes A/B de una landing de captación, una por cada dominio
comprado en GoDaddy. Sitio estático, sin paso de build ni dependencias:
Netlify publica la carpeta `public/` tal cual.

## Estructura

```
netlify.toml               deploy + cabeceras de seguridad + caché
public/
  index.html               índice interno (noindex) con las 7 variantes
  404.html                 página de error, con la marca
  config.js                webhook del CRM, WhatsApp, textos y videos
  robots.txt               Disallow: / (ver "Indexación")
  .htaccess                solo para Apache; Netlify lo ignora
  assets/                  21 fotos y los dos logos
  video/                   essence-720.mp4 + su poster
  seguridadtulum/          variante 7a — foto continua (la más completa)
  seguridadlotes/          variante 8a — calculadora de plusvalía
  seguridadjuridica/       variante 3b — dossier de certeza jurídica
  seguridadselva/          variante 3a — cinematográfico
  seguridadinversion/      variante 4a — UrbanNest
  seguridadcenotes/        variante 5a — editorial clara
  seguridadpatrimonio/     variante 6a — Sonder House
```

Cada landing es un HTML autocontenido: lleva su CSS y su JS embebidos. Lo
único compartido es `config.js`, los assets y el video.

## Lo que se edita a diario: `config.js`

Ahí viven el webhook, el WhatsApp y los textos — no hay que tocar las
páginas para cambiarlos:

| Clave | Para qué sirve |
|---|---|
| `webhook` | URL del Inbound Webhook del CRM donde entran los leads |
| `waNumber` | WhatsApp de ventas, sin `+` ni espacios |
| `waMessage` | Mensaje con el que se abre WhatsApp |
| `thanks` | Texto de confirmación tras enviar el formulario |
| `thankYouUrl` | Opcional: redirigir a una página de gracias |
| `videos.main` | Video de la portada (`src` + `poster`) |

`config.js` se sirve con `Cache-Control: no-cache`, así que los cambios se
ven al instante sin esperar caché.

Cada lead llega al CRM con el nombre de la variante en `landing_name` y
`landing_variant`, más los UTMs, `gclid`, `fbclid` y `ttclid` que se
capturan de la URL y se guardan en `sessionStorage`. Eso es lo que permite
comparar variantes.

## Desplegar

**Desde la interfaz de Netlify** (una sola vez):

1. *Add new site → Import an existing project → GitHub*.
2. Elige `selvadentromarketing-vibes/seguridad`.
3. Deja **Build command** vacío y **Publish directory** en `public`.
   `netlify.toml` ya declara ambos, no hay que rellenar nada.
4. *Deploy*.

Cada `git push` a la rama de producción vuelve a desplegar. Las ramas y los
pull requests generan *deploy previews* con su propia URL, útiles para
revisar una variante antes de publicarla.

**Dominios.** Las landings usan rutas absolutas (`/assets/…`, `/config.js`),
así que el sitio tiene que servirse desde la raíz del dominio. En Netlify:
*Site configuration → Domain management*. Se pueden apuntar los varios
dominios de GoDaddy al mismo sitio; el certificado TLS se emite solo.
Los `<link rel="canonical">` de las páginas apuntan hoy a
`seguridad.selvadentrotulum.com`: si el dominio principal acaba siendo
otro, hay que actualizarlos en cada `index.html`.

## Previsualizar en local

```bash
python3 -m http.server 8000 --directory public
# http://localhost:8000
```

Para que además se apliquen las cabeceras de `netlify.toml`:

```bash
netlify dev
```

## Indexación

`public/robots.txt` trae `Disallow: /` y el índice interno lleva
`noindex,nofollow`. Es lo correcto para landings de tráfico pagado: son
siete páginas muy parecidas y no conviene que compitan entre sí ni con el
sitio principal en búsqueda orgánica. Si algún día una de estas landings
tiene que posicionar en Google, hay que quitar el `Disallow` y dejar solo
esa página indexable.

## Cabeceras de seguridad

`netlify.toml` aplica CSP, HSTS, `X-Frame-Options`, `nosniff`,
`Referrer-Policy`, `Permissions-Policy` y `Cross-Origin-Opener-Policy`.
Comprobarlas en vivo:

```bash
curl -sI https://tu-dominio | grep -i -E 'content-security|strict-transport|x-frame|referrer'
```

Tres cosas que conviene saber:

- **La CSP permite `'unsafe-inline'`** en scripts y estilos, porque las
  landings llevan el CSS y el JS embebidos en el HTML. No es lo ideal en
  abstracto, pero es lo que estas páginas necesitan para funcionar. Aun
  así la política sigue sirviendo: bloquea scripts de dominios ajenos y
  `connect-src` limita a dónde pueden salir los datos de los leads.
- **Al instalar píxeles hay que ampliar la CSP.** El JS ya llama a `gtag`,
  `fbq` y `dataLayer` si existen, pero la CSP actual bloquea sus scripts.
  En `netlify.toml` está comentada la línea completa con los dominios de
  Google y Meta ya incluidos: se sustituye una por la otra. Si un píxel no
  reporta, la consola del navegador dice qué directiva lo bloqueó.
- **HSTS va sin `includeSubDomains`** a propósito, porque son varios
  dominios y alguno podría tener subdominios sirviendo por HTTP. Se puede
  añadir cuando se confirme que todos van por HTTPS.

## Pendientes conocidos

- **Videos de testimonio.** Las páginas tienen huecos `data-video` para
  `t1`/`t2`/`t3`, pero los archivos no existen todavía; el JS simplemente
  se los salta, así que no rompen nada. Cuando estén, se añaden a
  `videos` en `config.js`.
- **Playfair Display se carga y no se usa.** Las páginas la piden a Google
  Fonts pero ninguna regla CSS la aplica: las tipografías reales son
  Quicksand, Lora y Poppins. Quitarla de la URL de fuentes en los siete
  `index.html` ahorra una descarga.
- **El video pesa 16 MB** y vive en el repositorio. Funciona, pero cada
  versión nueva del archivo hace crecer el historial de git de forma
  permanente. Si se va a cambiar a menudo, conviene Git LFS o servirlo
  desde fuera.
