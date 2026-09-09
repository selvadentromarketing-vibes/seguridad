/* Configuración compartida de los landings — editar aquí, no en cada página */
window.LP_CONFIG = {
  webhook: "https://services.leadconnectorhq.com/hooks/crN2IhAuOBAl7D8324yI/webhook-trigger/f6b47137-a78e-4db7-aefa-f287e33266d2",                     // URL del Inbound Webhook de Propy AI (Automation → Workflows)
  waNumber: "529994890828",          // WhatsApp de ventas, sin + ni espacios
  waMessage: "Hola, vi la página de Selvadentro Tulum y quiero recibir precios y plan de pagos.",
  thanks: "¡Listo! Te enviamos la lista de lotes y el plan de pagos en unos minutos.",
  thankYouUrl: "",                   // opcional: redirigir a una página de gracias
  videos: {
    main: { src: "/video/essence-720.mp4", poster: "/video/essence-poster.jpg" }
    // t1: { src: "/video/testimonial-ricardo.mp4" }, t2: {...}, t3: {...}
  }
};
