/* ============================================================================
   Configuración compartida de los landings — editar aquí, no en cada página
   ============================================================================ */
window.LP_CONFIG = {
  webhook: "https://services.leadconnectorhq.com/hooks/crN2IhAuOBAl7D8324yI/webhook-trigger/f6b47137-a78e-4db7-aefa-f287e33266d2",
  waNumber: "529994890828",          // WhatsApp de ventas, sin + ni espacios
  waMessage: "Hola, vi la página de Selvadentro Tulum y quiero recibir precios y plan de pagos.",
  thanks: "¡Listo! Te enviamos la lista de lotes y el plan de pagos en unos minutos.",
  thankYouUrl: "",                   // opcional: redirigir a una página de gracias

  videos: {
    main: { src: "/video/essence-1080.mp4", poster: "/video/essence-poster.jpg" }
    // t1: { src: "/video/testimonial-ricardo.mp4" }, t2: {...}, t3: {...}
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
  analytics: {
    ga4: "",
    clarity: "",
    metaPixel: "",
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
