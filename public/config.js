/* ============================================================================
   Configuración compartida de los landings — editar aquí, no en cada página
   ============================================================================ */
window.LP_CONFIG = {
  // A dónde va el lead. Se envía a TODOS los de la lista, así que un mismo envío
  // puede disparar dos flujos distintos del CRM. Quitar una línea = dejar de enviarle.
  webhooks: [
    // En uso. Si algún día hay que mandar el mismo lead a dos flujos, se añade otra línea.
    "https://services.leadconnectorhq.com/hooks/crN2IhAuOBAl7D8324yI/webhook-trigger/20cd10a3-274e-4988-adbe-1d7424b28c4e"
    // Fuera de uso, se dejan por si hay que volver a ellos:
    // "https://services.leadconnectorhq.com/hooks/crN2IhAuOBAl7D8324yI/webhook-trigger/e146f5d9-1bd4-456f-99be-cb869fafad5f"
    // "https://services.leadconnectorhq.com/hooks/crN2IhAuOBAl7D8324yI/webhook-trigger/f6b47137-a78e-4db7-aefa-f287e33266d2"
  ],
  waNumber: "529994890828",          // WhatsApp de ventas, sin + ni espacios
  waMessage: "Hola, vi la página de Selvadentro Tulum y quiero recibir precios y plan de pagos.",
  thanks: "¡Listo! Te enviamos la lista de lotes y el plan de pagos en unos minutos.",
  // ---------- Página de gracias ----------
  // Al enviar el formulario, la landing manda al visitante aquí. La dirección
  // va ENTERA (con https:// y dominio) a propósito: estas mismas páginas se
  // pegan como fragmento dentro del CRM, y ahí una ruta suelta como "/gracias/"
  // llevaría al dominio del CRM, que no tiene esa página.
  // Se le pasan por la dirección los utm_*, la landing, la variante y el nombre
  // de pila, para saludar y para que el WhatsApp salga con la campaña puesta.
  // Vaciar las dos líneas = volver al mensaje de "recibido" dentro de la propia
  // landing, sin cambiar de página.
  thankYouUrl:   "https://seguridad.selvadentrotulum.com/gracias/",
  thankYouUrlEn: "https://seguridad.selvadentrotulum.com/en/gracias/",

  // Versiones en inglés de los dos textos que ve el visitante. Las páginas de
  // /en/ leen estas y las de español las de arriba.
  waMessageEn: "Hello, I have seen the Selvadentro Tulum page and would like to receive prices and payment plans.",
  thanksEn: "Thank you. The list of lots and the payment plan will reach you within minutes.",

  // "recorte" = fraccion de alto que ocupa la barra negra quemada en el archivo
  // (essence y short son 1920x1080 con 54px de barra arriba y abajo: 54/1080 = 0.05).
  // La pagina agranda el video lo justo para dejarlas fuera de la caja.
  // OJO CON EL IDIOMA: no existe material narrado en inglés. Las tres "versiones
  // inglesas" son EXACTAMENTE la misma película que la española, con los
  // subtítulos en inglés quemados en el archivo; lo prueban las duraciones:
  //   background-en (2:47.85) == pelicula-es (2:47.85)   -> la película
  //   essence-1080  (1:56.42) == essence-es-1280         -> Essence
  //   short-1080    (0:52.01) == short-es-1280           -> Short
  // Las españolas son ese mismo archivo con la franja de subtítulos recortada.
  // Mientras edición no entregue cortes narrados o doblados al inglés, lo único
  // que distingue a /en/ es el subtítulo. Reparto actual, uno distinto por
  // landing hasta donde alcanza el material (ES · EN):
  //   tulum      reel_selva + pelicula_es   ·  reel_background_en + short_en
  //   lotes      main                       ·  short_en
  //   patrimonio pelicula_es                ·  main_en
  //   selva      reel_background            ·  reel_background_en
  //   cenotes    short + main               ·  main_en + reel_background_en
  //   inversion  reel_descriptivo           ·  main_en
  //   juridica   reel_selva                 ·  short_en
  videos: {
    // OJO: este archivo lleva los subtítulos quemados EN INGLÉS (ya venían así en
    // el material original). Por eso sirve tal cual para /en/, pero en las páginas
    // en español el rótulo promete subtítulos en español y no coinciden. Cuando
    // tengas el corte SLVD_Essence_SubESP, cámbialo solo en "main".
    // Essence. Igual que el Short: el único archivo lleva los subtítulos quemados
    // en inglés, así que la versión española se saca recortando esa franja
    // (crop=1920:860:0:60). Por eso "main" ya no necesita "recorte": el corte se
    // llevó también las barras negras.
    main:    { src: "/video/essence-es-1280.mp4", poster: "/video/essence-es-poster.jpg" },
    main_en: { src: "/video/essence-1080.mp4",    poster: "/video/essence-poster.jpg", recorte: 0.05 },

    // Reels verticales 9:16. Llevan rótulos quemados EN ESPAÑOL ("9 cenotes
    // naturales", "103 hectáreas"), así que sirven para las páginas en español
    // pero no para las de /en/. Solo caben sin recorte en cajas verticales: hoy
    // la única es el panel de seguridadjuridica en escritorio (ratio 0.63).
    reel_descriptivo: { src: "/video/reel-descriptivo.mp4", poster: "/video/reel-descriptivo-poster.jpg" },
    reel_background:  { src: "/video/reel-background.mp4",  poster: "/video/reel-background-poster.jpg" },

    // SLVD_Background con subtítulos en inglés, la película entera (2:47) y
    // horizontal. Va en las cajas verticales de las páginas /en/: como no tiene
    // la misma forma que la caja, el reproductor la muestra completa con franjas
    // en vez de recortarla, y así no se pierde ningún subtítulo.
    reel_background_en: { src: "/video/background-en-720.mp4", poster: "/video/background-en-poster.jpg", encaje: "contain" },

    // La misma película para las páginas en español, con la franja de subtítulos
    // recortada (crop=1920:940:0:0). Queda en 2.04 de proporción, así que solo va
    // en las landings cuyo hueco de video es apaisado: patrimonio (1.98, encaja
    // casi exacta), lotes (1.24) y cenotes (1.19). En las de hueco vertical (0.56)
    // quedaría una banda con el 72% de la caja en negro, y recortarla a vertical
    // parte el master plan y saca de cuadro a quien habla: ahí siguen los reels.
    pelicula_es: { src: "/video/pelicula-es.mp4", poster: "/video/pelicula-es-poster.jpg" },

    // REEL SELVA 1: la entrevista al equipo, vertical 9:16. Está HABLADA EN ESPAÑOL
    // y no lleva subtítulos de ningún tipo, así que en las páginas en inglés no se
    // entiende. Las cajas ya piden "reel_selva_en"; en cuanto edición entregue el
    // corte con subtítulos en inglés, se sube a /video/ y se descomenta la línea.
    reel_selva: { src: "/video/reel-selva.mp4", poster: "/video/reel-selva-poster.jpg" },
    // reel_selva_en: { src: "/video/reel-selva-en.mp4", poster: "/video/reel-selva-poster.jpg" },

    // 4.SELVADENTRO SHORT. El único archivo que hay lleva los subtítulos quemados
    // EN INGLÉS, y el corte en español de Drive sigue restringido. Como los
    // subtítulos ocupan una franja fija al pie del cuadro, la versión española se
    // hace recortando esa franja (crop=1920:860:0:60 sobre el original): queda el
    // mismo video, hablado en español, sin subtítulos. Por eso "short" ya no
    // necesita "recorte": las barras negras se fueron en el mismo corte.
    // Si algún día llega SLVD_Short_SubESP, se cambia el src de "short" y ya.
    short:    { src: "/video/short-es-1280.mp4", poster: "/video/short-es-poster.jpg" },
    short_en: { src: "/video/short-1080.mp4",    poster: "/video/short-poster.jpg", recorte: 0.05 }
  },

  /* --- Medición -------------------------------------------------------------
     Pega aquí los identificadores. Cada herramienta se carga SOLO si su campo
     tiene valor, así que puedes activarlas de una en una. Vacío = apagado.

     ga4        Google Analytics 4. Admin → Flujos de datos → "G-XXXXXXXXXX".
                De ahí salen país/ciudad, dispositivo y tiempo de permanencia.
     clarity    Microsoft Clarity (gratis). Es quien da el MAPA DE CALOR:
                mapas de clic, mapas de scroll y grabaciones de sesión.
                clarity.microsoft.com → Settings → "Clarity project id".
     metaPixel  Píxel de Meta, para atribuir los leads a Facebook/Instagram.
     googleAds  "AW-XXXXXXXXX" y la etiqueta de la conversión de lead, para
                que Google Ads sepa qué clic acabó en formulario enviado.
  ------------------------------------------------------------------------- */
  // ---------- El precio ----------
  // Ninguna cifra de precio vive aquí: están escritas en el HTML de cada landing,
  // porque cada diseño las coloca a su manera. Hay DOS precios distintos:
  //
  //   1) Precio del lote de entrada: 68,200 USD = 1,364,000 MXN (20 pesos por
  //      dólar). Para cambiarlo, buscar "68,200" y "1,364,000" dentro de
  //      public/seguridad<landing>/index.html.
  //
  //   2) Precio por metro cuadrado, hoy 170 USD/m² = 3,400 MXN/m². Vive en tres
  //      sitios del motor de cada página: PPM2 (el año 2026 de la tabla de
  //      proyección), la constante BASE y el divisor de calcValue. Los tres
  //      tienen que llevar el mismo número. Además sale escrito en el rótulo
  //      "Referencia de zona 2026" de tulum, selva y patrimonio, en pesos en la
  //      versión española y en dólares en el atributo data-i18n de la inglesa.
  //
  // El tipo de cambio es la constante TIPO_CAMBIO del motor, en esas mismas
  // páginas. Los pesos solo se muestran en las páginas en español.

  // Chat de LeadConnector. Vacío = no se carga.
  // Fuera de uso: su burbuja se confundía con el botón de WhatsApp.
  // Para volver a encenderlo, pega aquí el id: "6aa84e0ef095905710c94ea1"
  chatWidgetId: "",

  analytics: {
    ga4: "G-7F35BWLHTZ",
    clarity: "xfbmy7v603",
    metaPixel: "680727997874671",
    googleAds: "",
    googleAdsLabel: ""
  }
};

/* ============================================================================
   A partir de aquí no hace falta tocar nada.
   Carga las herramientas activas y añade los eventos de permanencia y scroll.
   ============================================================================ */
(function () {
  'use strict';
  var A = (window.LP_CONFIG && window.LP_CONFIG.analytics) || {};
  var doc = document;

  function script(src, attrs) {
    var s = doc.createElement('script');
    s.async = true; s.src = src;
    if (attrs) Object.keys(attrs).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    (doc.head || doc.documentElement).appendChild(s);
    return s;
  }

  /* ---------- Google Analytics 4 y Google Ads ---------- */
  var idsGoogle = [A.ga4, A.googleAds].filter(Boolean);
  if (idsGoogle.length) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    idsGoogle.forEach(function (id) { gtag('config', id); });
    script('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(idsGoogle[0]));

    // La página llama a gtag('event','lead') al enviar el formulario. Si además
    // hay una conversión de Google Ads configurada, la disparamos con ella.
    if (A.googleAds && A.googleAdsLabel) {
      var gtagOriginal = window.gtag;
      window.gtag = function () {
        var args = arguments;
        gtagOriginal.apply(null, args);
        if (args[0] === 'event' && args[1] === 'lead') {
          gtagOriginal('event', 'conversion', { send_to: A.googleAds + '/' + A.googleAdsLabel });
        }
      };
    }
  } else {
    window.dataLayer = window.dataLayer || [];   // la página empuja aquí igualmente
  }

  /* ---------- Microsoft Clarity: mapas de calor y grabaciones ---------- */
  if (A.clarity) {
    (function (c, l, a, r, i) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      var t = l.createElement(r); t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      var y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, doc, 'clarity', 'script', A.clarity);
  }

  /* ---------- Píxel de Meta ---------- */
  if (A.metaPixel) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, doc, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', A.metaPixel);
    fbq('track', 'PageView');
  }

  /* ---------- Chat de LeadConnector ---------- */
  var idChat = (window.LP_CONFIG || {}).chatWidgetId;
  if (idChat) {
    var w = doc.createElement('script');
    w.src = 'https://widgets.leadconnectorhq.com/loader.js';
    w.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js');
    w.setAttribute('data-widget-id', idChat);
    (doc.head || doc.documentElement).appendChild(w);
  }

  /* ---------- Permanencia y profundidad de scroll ----------
     Responde a "¿cuánto se quedaron?" y "¿hasta dónde bajaron?".
     Se envía a GA4, a Clarity (como etiqueta) y a dataLayer.            */
  var landing = doc.documentElement.getAttribute('data-landing') || '';
  var variante = doc.documentElement.getAttribute('data-variant') || '';

  function evento(nombre, datos) {
    datos = datos || {};
    datos.landing = landing; datos.variant = variante;
    try { if (window.gtag) gtag('event', nombre, datos); } catch (e) {}
    try { if (window.dataLayer) dataLayer.push(Object.assign({ event: nombre }, datos)); } catch (e) {}
    try { if (window.clarity) clarity('set', nombre, String(datos.percent || datos.seconds || 1)); } catch (e) {}
  }

  var inicio = Date.now();
  var hitosTiempo = [15, 30, 60, 120, 180];
  var hitosScroll = [25, 50, 75, 90];
  var maxScroll = 0;

  hitosTiempo.forEach(function (s) {
    setTimeout(function () {
      if (!doc.hidden) evento('tiempo_en_pagina', { seconds: s });
    }, s * 1000);
  });

  function medirScroll() {
    var alto = doc.documentElement.scrollHeight - window.innerHeight;
    if (alto <= 0) return;
    var pct = Math.round(window.scrollY / alto * 100);
    if (pct <= maxScroll) return;
    maxScroll = pct;
    hitosScroll.forEach(function (h) {
      if (pct >= h && !medirScroll['h' + h]) { medirScroll['h' + h] = true; evento('scroll', { percent: h }); }
    });
  }
  window.addEventListener('scroll', medirScroll, { passive: true });

  // al salir: cuánto tiempo estuvo y hasta dónde llegó
  doc.addEventListener('visibilitychange', function () {
    if (doc.hidden) {
      evento('salida', { seconds: Math.round((Date.now() - inicio) / 1000), percent: maxScroll });
    }
  });
})();
