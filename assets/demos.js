(function () {
  var API = 'https://script.google.com/macros/s/AKfycbyz5Ls8V82rhw46viY9YZrwL_v59tiiOGmshU9_WG4bFDjFfUGld1JFIpC7RHL-FxscJg/exec';
  var demoElegida = null;
  var $ = function (id) { return document.getElementById(id); };

  function nodo(tag, clase, texto) {
    var el = document.createElement(tag);
    if (clase) el.className = clase;
    if (texto) el.textContent = texto;
    return el;
  }

  function abrir(mo) { cerrar(); mo.hidden = false; var c = mo.querySelector('input'); if (c) c.focus(); }
  function cerrar() { document.querySelectorAll('.mo').forEach(function (m) { m.hidden = true; }); }

  function aviso(el, texto, ok) {
    el.textContent = texto;
    el.classList.toggle('ok', !!ok);
    el.hidden = !texto;
  }

  function enviar(datos) {
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(datos) })
      .then(function (r) { return r.json(); });
  }

  function tarjeta(d) {
    var card = nodo('article', 'card demo');
    if (d.preview) {
      var img = nodo('img', 'demo-prev');
      img.src = /^https:\/\//.test(d.preview) ? d.preview : '../assets/img/' + d.preview;
      img.alt = 'Vista previa de ' + d.titulo;
      img.loading = 'lazy';
      card.appendChild(img);
    }
    var cuerpo = nodo('div', 'demo-cuerpo');
    cuerpo.appendChild(nodo('h2', '', d.titulo));
    cuerpo.appendChild(nodo('p', 'nota', d.tipo));
    cuerpo.appendChild(nodo('p', '', d.descripcion));
    var tags = nodo('p', 'tags');
    d.stack.split(' · ').forEach(function (t, i) { tags.appendChild(nodo('span', 'tag ' + (i % 2 ? 'vi' : 'az'), t)); });
    cuerpo.appendChild(tags);
    var acc = nodo('div', 'demo-acc');
    if (d.activa) {
      var b = nodo('button', 'btn bp', 'Ingresar con código');
      b.type = 'button';
      b.addEventListener('click', function () {
        demoElegida = d;
        $('tCodigo').textContent = d.titulo;
        aviso($('eCodigo'), '');
        abrir($('moCodigo'));
      });
      acc.appendChild(b);
    } else {
      acc.appendChild(nodo('span', 'est', 'Próximamente'));
    }
    cuerpo.appendChild(acc);
    card.appendChild(cuerpo);
    return card;
  }

  fetch(API + '?action=demos')
    .then(function (r) { return r.json(); })
    .then(function (res) {
      if (!res.ok) throw new Error(res.error);
      res.demos.forEach(function (d) {
        $('demos').appendChild(tarjeta(d));
        var op = nodo('option', '', d.titulo);
        $('interes').appendChild(op);
      });
      $('estado').hidden = true;
    })
    .catch(function () {
      $('estado').textContent = 'No pudimos cargar las demos. Probá de nuevo en un rato.';
    });

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-pedir]')) { aviso($('ePedir'), ''); abrir($('moPedir')); return; }
    if (e.target.closest('[data-cerrar]') || e.target.classList.contains('mo')) cerrar();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });

  $('fCodigo').addEventListener('submit', function (e) {
    e.preventDefault();
    var boton = e.target.querySelector('[type=submit]');
    // Se abre antes de esperar la respuesta para que el navegador no la bloquee como pop-up.
    var ventana = window.open('', '_blank');
    boton.disabled = true;
    aviso($('eCodigo'), '');
    enviar({ action: 'ingresar', codigo: $('codigo').value, demo: demoElegida.id })
      .then(function (res) {
        if (!res.ok) { if (ventana) ventana.close(); aviso($('eCodigo'), res.error); return; }
        if (ventana) { ventana.opener = null; ventana.location = res.url; } else { location.href = res.url; }
        aviso($('eCodigo'), 'Listo. Te quedan ' + res.restantes + ' ingresos.', true);
      })
      .catch(function () {
        if (ventana) ventana.close();
        aviso($('eCodigo'), 'No pudimos validar el código. Probá de nuevo.');
      })
      .finally(function () { boton.disabled = false; });
  });

  $('fPedir').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target, boton = f.querySelector('[type=submit]');
    boton.disabled = true;
    aviso($('ePedir'), '');
    enviar({
      action: 'solicitar', nombre: f.nombre.value, empresa: f.empresa.value, email: f.email.value,
      telefono: f.telefono.value, interes: f.interes.value, mensaje: f.mensaje.value,
      sitio: f.sitio.value, acepta: f.acepta.checked
    })
      .then(function (res) {
        if (!res.ok) { aviso($('ePedir'), res.error); return; }
        f.reset();
        aviso($('ePedir'), 'Recibimos tu solicitud. Si la aprobamos, te llega el código por mail.', true);
      })
      .catch(function () { aviso($('ePedir'), 'No pudimos enviarla. Probá de nuevo en un rato.'); })
      .finally(function () { boton.disabled = false; });
  });
})();
