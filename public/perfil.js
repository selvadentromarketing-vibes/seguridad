/* ============================================================================
   Presupuesto y plazo en todos los formularios de las landings (23-oct-2026)
   ----------------------------------------------------------------------------
   Las landings solo pedían nombre, email y teléfono, así que los leads de
   seguridad llegaban al CRM sin presupuesto ni plazo y el reporte de Calidad de
   Leads no podía calificarlos por perfil. Este archivo agrega dos campos
   obligatorios a cada formulario de la página (los de la página y el del modal),
   con el mismo estilo que el campo de al lado:

     budget_range  →  "Budget Range" del CRM
     timeline      →  "Horizonte de inversión" del CRM

   Los VALORES que se mandan son idénticos a las opciones del CRM y a los del
   formulario squeeze de lotes.selvadentrotulum.com: si cambia uno, cambian los
   tres. Ojo con los guiones: "$100K – $150K" y "$150K – $200K" llevan guion
   largo (–); todos los demás, guion corto (-). Español muestra los rangos en
   pesos y inglés en dólares, igual que lotes. En el plazo solo se traduce lo que
   se ve de "Immediately"; el valor que se manda es siempre el mismo.

   La página manda lo que haya en sus campos con name (collect/validate leen
   input y select) y payload() añade budget_range y timeline al lead.
   ============================================================================ */
(function () {
  'use strict';

  var BUDGET = {
    es: ['$1M - $2M', '$2M - $3M', '$3M - $5M', '+$5M'],
    en: ['$75K - $100K', '$100K – $150K', '$150K – $200K', '$200K +']
  };
  var TIMELINE = ['Immediately', '0-3 meses', '3-6 meses', '6-12 meses', '12+ meses'];
  var TXT = {
    es: { budget_range: 'Presupuesto (MXN)', timeline: 'Plazo de inversión',
          ph_budget_range: 'Selecciona un rango', ph_timeline: 'Selecciona un plazo', Immediately: 'Inmediatamente' },
    en: { budget_range: 'Budget range (USD)', timeline: 'Investment timeline',
          ph_budget_range: 'Select a range', ph_timeline: 'Select a timeline', Immediately: 'Immediately' }
  };
  var CAMPOS = ['budget_range', 'timeline'];

  function idioma() {
    var lg = document.documentElement.getAttribute('data-lang');
    if (lg) return lg === 'en' ? 'en' : 'es';
    return /^\/en(\/|$)/.test(location.pathname) ? 'en' : 'es';
  }

  // Opciones del campo en el idioma actual. Si lo elegido ya no existe (el presupuesto
  // cambia de pesos a dólares al cambiar de idioma), se vuelve a pedir.
  function llenar(sel, lg) {
    var campo = sel.name, valores = campo === 'budget_range' ? BUDGET[lg] : TIMELINE, antes = sel.value;
    sel.innerHTML = '';
    var ph = document.createElement('option');
    ph.value = ''; ph.disabled = true; ph.textContent = TXT[lg]['ph_' + campo];
    sel.appendChild(ph);
    valores.forEach(function (v) {
      var o = document.createElement('option');
      o.value = v; o.textContent = (campo === 'timeline' && TXT[lg][v]) || v;
      sel.appendChild(o);
    });
    sel.value = valores.indexOf(antes) >= 0 ? antes : '';
    sel.classList.toggle('lp-vacio', !sel.value);
  }

  function rotular(el, campo, lg) { if (el) el.textContent = TXT[lg][campo]; }

  // El select toma la clase y el estilo del input de referencia para verse igual.
  function nuevoSelect(ref, campo) {
    var s = document.createElement('select');
    s.name = campo; s.required = true;
    if (ref.className) s.className = ref.className;
    var st = ref.getAttribute('style');
    if (st) s.setAttribute('style', st);
    s.setAttribute('data-perfil', campo);
    s.addEventListener('change', function () { s.classList.toggle('lp-vacio', !s.value); s.classList.remove('lp-err'); });
    return s;
  }

  // Copia de un elemento sin los atributos de traducción de la página: si los llevara,
  // el cambio de idioma de la landing le pondría el texto del campo original.
  function clonar(el) {
    var c = el.cloneNode(true);
    [c].concat([].slice.call(c.querySelectorAll('*'))).forEach(function (n) {
      n.removeAttribute('data-i18n'); n.removeAttribute('data-i18n-a'); n.removeAttribute('id'); n.removeAttribute('for');
    });
    return c;
  }

  // Cada campo de la página es "etiqueta + input", suelto o dentro de una envoltura
  // propia (una celda de la rejilla). Se repite ese mismo patrón detrás del último campo.
  function inyectar(scope) {
    if (scope.querySelector('select[data-perfil]')) return;
    var inputs = [].slice.call(scope.querySelectorAll('input[name]')).filter(function (i) { return i.type !== 'hidden'; });
    var ultimo = inputs[inputs.length - 1];
    if (!ultimo) return;
    var lg = idioma(), p = ultimo.parentElement;
    var envuelto = p && p !== scope && p.querySelectorAll('input').length === 1 && p.children.length <= 3;
    var ancla = envuelto ? p : ultimo, contenedor = ancla.parentElement;
    CAMPOS.forEach(function (campo) {
      var sel = nuevoSelect(ultimo, campo), bloque;
      if (envuelto) {
        bloque = clonar(p);
        var inp = bloque.querySelector('input');
        var etq = [].filter.call(bloque.children, function (n) { return n !== inp; })[0];
        inp.parentNode.replaceChild(sel, inp);
        rotular(etq, campo, lg);
        etq && etq.setAttribute('data-perfil-label', campo);
        ancla.parentNode.insertBefore(bloque, ancla.nextSibling);
        ancla = bloque;
      } else {
        var lab = ultimo.previousElementSibling;
        if (lab && !/^(INPUT|SELECT|BUTTON)$/.test(lab.tagName)) {
          var etq2 = clonar(lab);
          rotular(etq2, campo, lg); etq2.setAttribute('data-perfil-label', campo);
          ancla.parentNode.insertBefore(etq2, ancla.nextSibling); ancla = etq2;
        }
        ancla.parentNode.insertBefore(sel, ancla.nextSibling); ancla = sel;
      }
      llenar(sel, lg);
    });
    // Rejillas de 4 columnas (3 campos + botón, o 4 campos): con 2 campos más se pasan
    // a 3 columnas para que queden dos filas parejas en vez de un campo suelto. En las de
    // 2 columnas (celular) los campos nuevos van a lo ancho: a media columna el texto
    // "Selecciona un rango" no cabe junto a la flecha.
    if (envuelto && contenedor) {
      var cs = getComputedStyle(contenedor);
      var cols = cs.display === 'grid' ? cs.gridTemplateColumns.split(' ').length : 0;
      if (cols >= 4) contenedor.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
      else if (cols === 2) [].forEach.call(contenedor.querySelectorAll('select[data-perfil]'), function (s) {
        var celda = s; while (celda.parentElement && celda.parentElement !== contenedor) celda = celda.parentElement;
        celda.style.gridColumn = '1 / -1';
      });
    }
  }

  function traducir() {
    var lg = idioma();
    [].forEach.call(document.querySelectorAll('select[data-perfil]'), function (s) { llenar(s, lg); });
    [].forEach.call(document.querySelectorAll('[data-perfil-label]'), function (e) { rotular(e, e.getAttribute('data-perfil-label'), lg); });
  }

  function todo() {
    [].forEach.call(document.querySelectorAll('[data-lead-form], .lp-modal form'), inyectar);
  }

  var css = document.createElement('style');
  css.textContent =
    'select[data-perfil]{appearance:none;-webkit-appearance:none;cursor:pointer;border-radius:inherit;' +
      'background-image:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'%23999\'><path d=\'M5.2 7.2a.75.75 0 011.1 0L10 11l3.7-3.8a.75.75 0 111.1 1L10.5 12.6a.75.75 0 01-1.1 0L5.2 8.3a.75.75 0 010-1.1z\'/></svg>") !important;' +
      'background-repeat:no-repeat !important;background-position:right 2px center !important;background-size:16px !important;padding-right:22px !important}' +
    'select[data-perfil].lp-vacio{opacity:.75}' +
    'select[data-perfil] option{color:#1C2717;background:#FFFDF8}' +
    '.lp-modal select[data-perfil]{display:block;width:100%;box-sizing:border-box;background-color:transparent;border:0;border-bottom:1px solid rgba(243,239,228,.3);color:#F3EFE4;font:400 15px Quicksand,sans-serif;padding:6px 0 10px;outline:none}' +
    '.lp-modal select[data-perfil]:focus{border-color:#CF8543}' +
    'select[data-perfil].lp-err{border-color:#e0674a !important}';
  document.head.appendChild(css);

  function arrancar() {
    todo();
    // La landing cambia de idioma sin recargar (botón ES · EN): se vuelven a escribir
    // las etiquetas y las opciones.
    new MutationObserver(traducir).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    // Formularios que aparezcan después (plantillas que se pintan al vuelo).
    var pend = false;
    new MutationObserver(function () {
      if (pend) return; pend = true;
      setTimeout(function () { pend = false; todo(); }, 50);
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
