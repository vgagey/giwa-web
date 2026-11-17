/* Portal GIWA Demo Telegram.
   Visitante: public.demo_portal (clave publicable, sin login).
   Solapa GIWA: login con Google + public.demo_admin (sólo cuentas @giwa-ia.com confirmadas; lo valida la base). */
(function () {
  var CFG = {
    url: 'https://ofhiogczijhzkuqdjwvz.supabase.co',
    key: 'sb_publishable_sHdrgf8l6HwnKgK38gWnFQ_fEEVgG4f',   // publicable: va en el navegador a propósito
    bot: 'GiwaDemoBot'
  };
  var $ = function (id) { return document.getElementById(id); };
  var GUARDA = 'giwa-demo-tg';

  function guardar(v) { try { v ? localStorage.setItem(GUARDA, JSON.stringify(v)) : localStorage.removeItem(GUARDA); } catch (e) {} }
  function leer() { try { return JSON.parse(localStorage.getItem(GUARDA) || 'null'); } catch (e) { return null; } }

  function nodo(tag, clase, texto) {
    var el = document.createElement(tag);
    if (clase) el.className = clase;
    if (texto != null) el.textContent = texto;
    return el;
  }
  function dosD(n) { return (n < 10 ? '0' : '') + n; }
  function fechaHora(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return dosD(d.getDate()) + '/' + dosD(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + dosD(d.getHours()) + ':' + dosD(d.getMinutes());
  }
  function aviso(el, texto, ok) { el.textContent = texto || ''; el.classList.toggle('ok', !!ok); el.hidden = !texto; }
  function conNum(t) { return t.replace(/(\d(?:[\d.,]*\d)?)/g, '<span class="num">$1</span>'); }

  /* ── Íconos de línea y logos oficiales ────────────────────── */
  var ICO = {
    maletin: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
    salud: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M9 11h2l1-2 1.5 4 1-2H16"/>',
    llave: '<path d="M15 4a5 5 0 0 0-4.6 6.9L4 17.3V20h2.7l6.4-6.4A5 5 0 0 0 20 9l-3 1-2-2 1-3z"/>',
    trofeo: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    casa: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',
    botones: '<rect x="3" y="4" width="18" height="9" rx="2"/><rect x="3" y="15" width="8" height="5" rx="1.5"/><rect x="13" y="15" width="8" height="5" rx="1.5"/>',
    grilla: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    comando: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M14 8l-4 8"/>',
    recargar: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
    campana: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
    clip: '<path d="M20 11l-8.5 8.5a5 5 0 0 1-7-7L13 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L14 7"/>',
    usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    texto: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
    paleta: '<path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.5 0-1.2-1-1.5-1-2.5s.8-1.5 2-1.5H17a4 4 0 0 0 4-4c0-4.7-4-8.5-9-8.5z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    enlace: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    ventana: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
    candado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    silencio: '<path d="M6 16v-5a6 6 0 0 1 9.5-4.9M18 11v5l2 2H8M10 21h4M4 4l16 16"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    grupo: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    abajo: '<path d="M6 9l6 6 6-6"/>',
    abrir: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    moneda: '<circle cx="12" cy="12" r="9"/><path d="M15 9.5a3 3 0 0 0-3-1.5c-1.7 0-3 .9-3 2.1 0 2.9 6 1.5 6 4.5 0 1.2-1.3 2.1-3 2.1a3 3 0 0 1-3-1.5M12 6.5V8M12 16.7v1.3"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    doc: '<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    alcance: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    escudo: '<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z"/>'
  };
  var LOGO = {
    tg: '<svg class="logo-pl" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="var(--marca-tg)"/><path fill="#fff" d="M5.4 11.8l11.4-4.4c.5-.2 1 .1.8.9l-1.9 9.1c-.1.6-.5.8-1.1.5l-3-2.2-1.4 1.4c-.2.2-.3.3-.6.3l.2-3.1 5.6-5.1c.2-.2 0-.3-.4-.1l-6.9 4.4-3-.9c-.6-.2-.7-.6.3-.8z"/></svg>',
    wa: '<svg class="logo-pl" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="var(--marca-wa)"/><path fill="none" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" d="M12 5.2a6.8 6.8 0 0 0-5.9 10.2l-1 3.5 3.6-1a6.8 6.8 0 1 0 3.3-12.7z"/><path fill="#fff" d="M9.6 8.7c.2-.3.3-.3.5-.3h.4c.1 0 .3 0 .4.3l.6 1.4c.1.2 0 .3-.1.5l-.4.5c-.1.1-.2.3 0 .5.5.9 1.2 1.6 2.2 2.1.2.1.3.1.5-.1l.5-.6c.1-.2.3-.2.5-.1l1.3.6c.2.1.3.2.3.4 0 .5-.2 1-.6 1.3-.6.4-1.4.5-2.4.1-1.7-.6-3.1-2-3.8-3.7-.4-1-.3-1.8.1-2.4z"/></svg>'
  };
  function ico(n) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + (ICO[n] || '') + '</svg>'; }
  function pintarIconos(raiz) {
    raiz.querySelectorAll('i[data-ico]').forEach(function (i) { i.outerHTML = ico(i.dataset.ico).replace('class="ico"', 'class="ico ' + i.className + '"'); });
    raiz.querySelectorAll('i[data-logo]').forEach(function (i) { i.outerHTML = LOGO[i.dataset.logo] || ''; });
  }

  function portal(accion, datos) {
    return fetch(CFG.url + '/rest/v1/rpc/demo_portal', {
      method: 'POST',
      headers: { apikey: CFG.key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: accion, datos: datos || {} })
    }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }

  /* ── Pestañas ─────────────────────────────────────────────── */
  var TABS = ['demos', 'comparar', 'telegram', 'giwa'];
  function irTab(t) {
    if (TABS.indexOf(t) < 0) t = 'demos';
    document.querySelectorAll('.ptab').forEach(function (b) { b.classList.toggle('on', b.dataset.tab === t); b.setAttribute('aria-selected', b.dataset.tab === t); });
    TABS.forEach(function (x) { $('tab-' + x).hidden = x !== t; });
    if (t === 'giwa') admin.abrir();
  }
  document.querySelectorAll('.ptab').forEach(function (b) {
    b.addEventListener('click', function () { history.replaceState(null, '', '#' + b.dataset.tab); irTab(b.dataset.tab); });
  });

  /* ── Rubros ───────────────────────────────────────────────── */
  var RUBROS = [
    { id: 'oficina', ico: 'maletin', nombre: 'Oficina y tareas', desc: 'Tareas, responsables, comentarios con menciones, alertas y agenda de un equipo de cinco personas. Un Kanban dentro del chat.', activa: true,
      empresa: 'Estudio Norte', quien: '<b>Laura Ríos</b>, coordinadora de un estudio de arquitectura ficticio con cinco personas',
      lead: 'Vas a ser Laura Ríos, coordinadora de Estudio Norte, un estudio de arquitectura ficticio. Dejanos tus datos y conectá tu Telegram.' },
    { id: 'consultorio', ico: 'salud', nombre: 'Consultorio clínico', desc: 'Pacientes, médicos y especialidades. Turnos con confirmación, reprogramación y recordatorio al paciente. Obras sociales y coberturas.', activa: false,   // se activa cuando corre el instalador (T-0098)
      empresa: 'Clínica SaludTotal', quien: '<b>Sofía</b>, recepcionista de un consultorio ficticio con cinco médicos',
      lead: 'Vas a ser Sofía, recepcionista de Clínica SaludTotal, un consultorio ficticio. Dejanos tus datos y conectá tu Telegram.' },
    { id: 'talleres', ico: 'llave', nombre: 'Talleres', desc: 'Turnos de service, estado del vehículo y avisos de retiro.' },
    { id: 'deportes', ico: 'trofeo', nombre: 'Deportes', desc: 'Torneos, fixture, carga de resultados y recordatorios de partidos.' },
    { id: 'eventos', ico: 'calendario', nombre: 'Organización de eventos', desc: 'Planificación, gastos, proveedores y seguimiento.' },
    { id: 'hogar', ico: 'casa', nombre: 'Organización del hogar', desc: 'Tareas de la casa, compras, gastos y agenda familiar.' }
  ];
  // Por rubro: [texto, aclaración, qué lo tilda: lo que el visitante tocó en Telegram]
  var PRUEBAS = {};
  PRUEBAS.consultorio = [
    ['Tocá <b>Buscar paciente</b> y escribí <b>Ramos</b>.', 'Hay dos: elegí uno y mirá su ficha.', /^cp\|/],
    ['En la ficha, tocá <b>Cobertura</b>.', 'Lo que cubre su plan y el copago por especialidad.', /^cc\|/],
    ['Tocá <b>Disponibilidad</b> y elegí una especialidad.', 'Los horarios libres de cada médico.', /^de\|/],
    ['Tocá <b>Pedir turno</b>: paciente, especialidad, médico y horario.', '', /^cs\|/],
    ['<b>Confirmá</b> el turno.', 'El mismo mensaje se actualiza.', /^cok\|/],
    ['En <b>Turnos</b>, <b>reprogramá</b> uno.', 'El horario anterior queda libre.', /^crs\|/],
    ['<b>Cancelá</b> otro turno.', '', /^cx\|/],
    ['En un turno, tocá <b>Recordatorio en 1 minuto</b>.', 'Te llega como lo recibe el paciente, con botones para confirmar.', /^crec\|/]
  ];
  PRUEBAS.oficina = [
    ['Tocá <b>Mis tareas</b> y abrí la #2.', 'Es una tarea compartida con Martín.', /^t\|/],
    ['Tocá <b>Tablero</b>.', 'El equipo por columnas, como un Kanban.', /^(tablero|kanban|\/tablero|tab)$/],
    ['Cambiá el estado de una tarea con <b>Empezar</b> o <b>Finalizar</b>.', 'El mismo mensaje se actualiza.', /^est\|/],
    ['Tocá <b>Comentar</b> y escribí un comentario con <b>@Martín</b>.', 'La mención le avisa.', /^com\|/],
    ['Creá una tarea con <b>Nueva tarea</b> y asignala a dos personas.', '', /^npok/],
    ['Abrí <b>Alertas</b>.', 'Vencidas, las que vencen hoy y quién te mencionó.', /^\/?alertas$/],
    ['En una tarea, tocá <b>Recordarme</b> y elegí <b>En 1 minuto</b>.', 'Te llega el aviso sin costo por mensaje.', /^rr\|/],
    ['Mirá la <b>Agenda</b> de la semana y tocá <b>Equipo</b>.', '', /^(\/?equipo|eq)$/]
  ];
  function pruebas() { return PRUEBAS[(sesion && sesion.rubro) || 'oficina'] || PRUEBAS.oficina; }
  function pintarPruebas() {
    var ol = $('pruebas'); ol.textContent = '';
    pruebas().forEach(function (p) {
      var li = document.createElement('li');
      li.innerHTML = ico('check') + '<div>' + p[0] + (p[1] ? ' <span>' + p[1] + '</span>' : '') + '</div>';
      ol.appendChild(li);
    });
  }
  // Tarifas del Simulador Costos Meta (octubre 2026)
  var META = { gratis: 1000, usd: 0.026, personas: 100 };
  var vivo = null;
  function plata(n) { return n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function entero(n) { return n.toLocaleString('es-AR'); }
  function pintarUso(u) {
    if (!u) return;
    var hechos = u.hechos || [];
    document.querySelectorAll('#pruebas li').forEach(function (li, i) {
      var ok = hechos.some(function (d) { return pruebas()[i][2].test(d); });
      li.classList.toggle('hecho', ok);
    });
    var bot = u.nuevos + u.reescritos, mes = bot * META.personas, usd = Math.max(0, mes - META.gratis) * META.usd;
    $('uso-bot').textContent = entero(bot);
    $('uso-re').textContent = entero(u.reescritos);
    $('uso-tuyos').textContent = entero(u.tuyos);
    $('uso-mes').textContent = entero(mes);
    $('uso-usd').textContent = 'USD ' + plata(usd);
  }

  var rubro = null, sesion = leer(), sondeo = null;

  RUBROS.forEach(function (r) {
    var c = nodo('article', 'rubro' + (r.activa ? ' activa' : ''));
    var cab = nodo('div', 'rubro-cab');
    cab.innerHTML = ico(r.ico);
    cab.appendChild(nodo('h2', '', r.nombre));
    c.appendChild(cab);
    c.appendChild(nodo('p', '', r.desc));
    var pie = nodo('div', 'pie-rubro');
    if (r.activa) {
      var b = nodo('button', 'btn bp', 'Probar');
      b.type = 'button';
      b.addEventListener('click', function () { elegir(r); });
      pie.appendChild(b);
    } else {
      pie.appendChild(nodo('span', 'prox', 'Próximamente'));
    }
    c.appendChild(pie);
    $('rubros').appendChild(c);
  });


  function paso(id) {
    ['paso-rubros', 'paso-datos', 'paso-telegram', 'paso-listo'].forEach(function (x) { $(x).hidden = x !== id; });
    if (id !== 'paso-telegram' && sondeo) { clearInterval(sondeo); sondeo = null; }
    if (id !== 'paso-listo' && vivo) { clearInterval(vivo); vivo = null; }
    window.scrollTo(0, 0);
  }

  function elegir(r) {
    rubro = r;
    if (sesion && sesion.rubro === r.id) return seguir();
    $('rubro-titulo').textContent = r.nombre;
    $('rubro-lead').textContent = r.lead;
    aviso($('e-datos'), '');
    paso('paso-datos');
    $('nombre').focus();
  }

  document.querySelectorAll('[data-volver]').forEach(function (b) { b.addEventListener('click', function () { paso('paso-rubros'); }); });

  $('f-datos').addEventListener('submit', function (e) {
    e.preventDefault();
    var boton = e.target.querySelector('[type=submit]');
    boton.disabled = true;
    aviso($('e-datos'), '');
    portal('crear', { rubro: rubro.id, nombre: $('nombre').value, mail: $('mail').value, consiente: $('consiente').checked })
      .then(function (r) {
        if (!r.ok) return aviso($('e-datos'), r.error);
        sesion = { token: r.token, rubro: rubro.id, vence: r.vence };
        guardar(sesion);
        esperar();
      })
      .catch(function () { aviso($('e-datos'), 'No pudimos conectarnos. Probá de nuevo en un rato.'); })
      .finally(function () { boton.disabled = false; });
  });

  function enlace() { return 'https://t.me/' + CFG.bot + '?start=' + sesion.token; }

  function esperar() {
    $('abrir-tg').href = enlace();
    $('enlace-tg').textContent = enlace();
    paso('paso-telegram');
    sondeo = setInterval(revisar, 3000);
  }

  function revisar() {
    return portal('estado', { token: sesion.token }).then(function (r) {
      if (!r.ok || !r.activa) { sesion = null; guardar(null); paso('paso-rubros'); return; }
      sesion.vence = r.vence;
      if (r.vinculado) listo(r);
    }).catch(function () {});
  }

  function listo(r) {
    var ru = RUBROS.filter(function (x) { return x.id === sesion.rubro; })[0] || RUBROS[0];
    $('listo-t').textContent = 'Ya estás en ' + ru.empresa;
    $('listo-quien').innerHTML = ru.quien;
    if (!$('pruebas').children.length || $('pruebas').dataset.rubro !== ru.id) { pintarPruebas(); $('pruebas').dataset.rubro = ru.id; }
    $('tg-nombre').textContent = r.tg_nombre || 'tu Telegram';
    $('vence').textContent = fechaHora(sesion.vence);
    $('abrir-tg-2').href = 'https://t.me/' + CFG.bot;
    aviso($('e-listo'), '');
    if ($('paso-listo').hidden) paso('paso-listo');
    pintarUso(r.uso);
    // Panel en vivo: se actualiza mientras la persona prueba en Telegram
    if (!vivo) vivo = setInterval(function () {
      portal('estado', { token: sesion.token }).then(function (x) { if (x.ok && x.activa) pintarUso(x.uso); }).catch(function () {});
    }, 5000);
  }

  // Volver a la demo que ya estaba abierta en este navegador
  function seguir() {
    portal('estado', { token: sesion.token }).then(function (r) {
      if (!r.ok || !r.activa) { sesion = null; guardar(null); if (rubro) elegir(rubro); return; }
      sesion.vence = r.vence;
      r.vinculado ? listo(r) : esperar();
    }).catch(function () { paso('paso-rubros'); });
  }

  $('reiniciar').addEventListener('click', function () {
    var b = this;
    b.disabled = true;
    portal('reiniciar', { token: sesion.token })
      .then(function (r) { aviso($('e-listo'), r.ok ? 'Listo: los datos volvieron al inicio. Te avisamos en Telegram.' : r.error, r.ok); })
      .catch(function () { aviso($('e-listo'), 'No pudimos reiniciar. Probá de nuevo.'); })
      .finally(function () { b.disabled = false; });
  });

  /* ── WhatsApp vs. Telegram ────────────────────────────────── */
  var COMPARA = [
    ['Costo por mensaje', 'Meta cobra por mensaje: 1.000 de servicio gratis por mes y USD 0,026 por cada uno que exceda y por cada plantilla.', 'Sin costo por mensaje, sin importar el volumen.', 'tg'],
    ['Ventana de conversación', 'Pasadas 24 horas desde el último mensaje del cliente, sólo se puede escribir con plantillas pagas.', 'Sin ventana: el bot escribe cuando hace falta, mientras la persona no lo bloquee.', 'tg'],
    ['Plantillas', 'Cada mensaje fuera de la ventana necesita una plantilla aprobada por Meta.', 'No existen: cualquier texto, en cualquier momento.', 'tg'],
    ['Alta del canal', 'Cuenta de Meta Business, verificación de la empresa y un número de teléfono dedicado.', 'Un token de @BotFather en minutos, sin número de teléfono.', 'tg'],
    ['Botones', 'Hasta 3 botones de respuesta o una lista de hasta 10 opciones.', 'Menús con muchos botones en filas, que cambian al tocarlos.', 'tg'],
    ['Mensajes que se actualizan', 'Lo enviado queda como está: cada cambio es un mensaje nuevo.', 'El bot reescribe el mismo mensaje: una lista se convierte en ficha y vuelve.', 'tg'],
    ['Apps dentro del chat', 'WhatsApp Flows: formularios paso a paso.', 'Mini Apps: una web completa dentro de Telegram.', 'tg'],
    ['Grupos y canales', 'El uso de bots en grupos es acotado.', 'Bots en grupos de hasta 200.000 personas y canales sin límite.', 'tg'],
    ['Primer contacto', 'La empresa puede escribir primero a un número, con una plantilla aprobada y consentimiento.', 'La persona tiene que abrir el bot y tocar Iniciar: no se le puede escribir a un teléfono.', 'wa'],
    ['Alcance', 'Lo usa casi toda la población.', 'Menos difundido: hay que invitar a abrirlo.', 'wa'],
    ['Empresa verificada', 'Insignia de negocio verificado.', 'No hay una insignia de empresa estándar: el bot se identifica por su @usuario.', 'wa'],
    ['Servidor, automatización e IA', 'Se pagan aparte.', 'Se pagan igual.', 'igual']
  ];
  var GANA = { tg: ['g-tg', 'Telegram'], wa: ['g-wa', 'WhatsApp'], igual: ['g-igual', 'Igual'] };
  COMPARA.forEach(function (f) {
    var tr = document.createElement('tr');
    tr.appendChild(nodo('td', '', f[0]));
    var wa = nodo('td'); wa.innerHTML = conNum(f[1]); tr.appendChild(wa);
    var tg = nodo('td'); tg.innerHTML = conNum(f[2]); tr.appendChild(tg);
    var g = nodo('td'); g.appendChild(nodo('span', 'gana ' + GANA[f[3]][0], GANA[f[3]][1])); tr.appendChild(g);
    $('comparativa').appendChild(tr);
  });

  // Las tres diferencias que más pesan, arriba de todo
  var CLAVES = [
    ['moneda', 'Costo por mensaje', 'USD 0,026 por cada plantilla y por cada mensaje de servicio que exceda los 1.000 gratis del mes.', 'USD 0,00, sin importar el volumen.'],
    ['reloj', 'Ventana de 24 horas', 'Pasadas 24 horas, sólo se puede escribir con plantillas pagas.', 'Sin ventana: el bot escribe cuando hace falta.'],
    ['doc', 'Plantillas', 'Cada mensaje fuera de la ventana necesita una plantilla aprobada por Meta.', 'No existen: cualquier texto, en cualquier momento.']
  ];
  CLAVES.forEach(function (k) {
    var c = nodo('div', 'clave');
    c.innerHTML = '<div class="clave-t">' + ico(k[0]) + k[1] + '</div>' +
      '<div class="clave-f wa">' + LOGO.wa + '<span>' + conNum(k[2]) + '</span></div>' +
      '<div class="clave-f tg">' + LOGO.tg + '<span>' + conNum(k[3]) + '</span></div>';
    $('claves').appendChild(c);
  });

  function puntos(id, icono, lista) {
    lista.forEach(function (p) {
      var li = document.createElement('li');
      li.innerHTML = ico(icono) + '<span><b>' + p[0] + '</b>' + conNum(p[1]) + '</span>';
      $(id).appendChild(li);
    });
  }
  puntos('gana-tg', 'check', [
    ['Operación diaria del equipo', 'Tareas, avisos y aprobaciones sin pagar por mensaje.'],
    ['Clientes recurrentes', 'Turnos, recordatorios y seguimiento sin ventana de 24 horas.'],
    ['Mucho volumen', 'El costo no crece con la cantidad de mensajes.'],
    ['Pantallas más ricas', 'Menús con muchos botones y mensajes que se actualizan solos.']
  ]);
  puntos('falta-tg', 'flecha', [
    ['Primer contacto', 'El bot no puede escribirle a un teléfono. Se resuelve con un enlace o un código QR en la web, el mail o el ticket.'],
    ['Alcance', 'Menos gente lo tiene instalado. Se resuelve captando por la web o WhatsApp y operando por Telegram.'],
    ['Confianza', 'No hay una insignia de empresa verificada. Se resuelve con un nombre y una foto claros y el enlace publicado en tus canales oficiales.']
  ]);
  $('falta-tg').classList.add('falta');

  /* ── Telegram ─────────────────────────────────────────────── */
  var TG = {
    'tg-claves': [
      ['botones', 'Botones bajo cada mensaje', 'Acciones de un toque: confirmar, cambiar estado, elegir fecha.'],
      ['grilla', 'Menú fijo', 'Un teclado propio debajo del chat con las opciones principales.'],
      ['comando', 'Comandos', 'Atajos como /ayuda o /reiniciar, con su lista a mano.'],
      ['recargar', 'Mensajes que se reescriben', 'Una lista pasa a ficha y vuelve, sin llenar el chat.'],
      ['campana', 'Avisos y recordatorios', 'El bot escribe cuando hace falta, sin costo por mensaje.'],
      ['clip', 'Archivos, fotos y ubicación', 'Documentos, imágenes, audios y ubicaciones en el mismo chat.']
    ],
    'tg-perso': [
      ['usuario', 'Nombre, foto y descripción', 'El bot se presenta con la marca de la empresa.'],
      ['info', 'Presentación antes de empezar', 'Un texto que se ve antes de tocar Iniciar.'],
      ['menu', 'Botón de menú', 'Puede abrir la lista de comandos o una web propia.'],
      ['texto', 'Formato del texto', 'Negrita, cursiva, citas, enlaces y texto oculto.'],
      ['paleta', 'Colores', 'El chat respeta los colores que eligió cada persona. Una Mini App sí usa los colores de la marca y se adapta al modo claro u oscuro.']
    ],
    'tg-oculto': [
      ['enlace', 'Enlaces con contexto', 'Un enlace puede abrir el bot ya ubicado en una demo, un turno o un pedido. Así funciona este portal.'],
      ['ventana', 'Mini Apps', 'Pantallas completas, como un tablero o un formulario, sin salir de Telegram.'],
      ['candado', 'Sin compartir el teléfono', 'La persona no expone su número. Si hace falta, el bot lo pide con un botón.'],
      ['silencio', 'Avisos silenciosos', 'Mensajes que llegan sin sonido, para lo que no es urgente.'],
      ['check', 'Respuestas al toque', 'Un cartelito confirma la acción sin sumar mensajes al chat.'],
      ['maletin', 'Telegram Business', 'Un bot puede responder desde la cuenta personal de la empresa (requiere Premium).'],
      ['grupo', 'Bots en grupos', 'El mismo bot puede trabajar en un grupo de equipo o en uno por cliente.']
    ]
  };
  Object.keys(TG).forEach(function (id) {
    TG[id].forEach(function (x) {
      var it = nodo('div', 'item');
      it.innerHTML = ico(x[0]);
      var tx = nodo('div');
      tx.appendChild(nodo('div', 'item-t', x[1]));
      tx.appendChild(nodo('div', 'item-d', x[2]));
      it.appendChild(tx);
      $(id).appendChild(it);
    });
  });

  /* ── Solapa GIWA ──────────────────────────────────────────── */
  var admin = (function () {
    var sb = null, cargado = false;
    function cliente() {
      if (!sb && window.supabase) sb = window.supabase.createClient(CFG.url, CFG.key, { auth: { persistSession: true, detectSessionInUrl: true } });
      return sb;
    }
    function llamar(accion, datos) {
      return cliente().rpc('demo_admin', { accion: accion, datos: datos || {} }).then(function (r) {
        if (r.error) throw r.error;
        return r.data;
      });
    }
    function vista(id) { ['adm-entrar', 'adm-negado', 'adm-panel'].forEach(function (x) { $(x).hidden = x !== id; }); }

    function abrir() {
      if (!cliente()) { vista('adm-entrar'); aviso($('e-adm'), 'No se pudo cargar el inicio de sesión.'); return; }
      cliente().auth.getSession().then(function (s) {
        // Volviendo de Google: con la sesión ya leída, se saca el ?giwa para que recargar no fuerce esta solapa
        if (/[?&]giwa\b/.test(location.search)) history.replaceState(null, '', location.pathname + '#giwa');
        if (!s.data.session) return vista('adm-entrar');
        $('adm-quien').textContent = s.data.session.user.email;
        estado();
      });
    }

    function estado() {
      llamar('estado').then(function (r) {
        if (!r.ok) { vista('adm-negado'); return; }
        vista('adm-panel');
        var hay = r.configurado != null ? r.configurado : r.bot_token,
            st = r.bot ? ['st-ok', 'Conectado a ' + r.bot]
              : r.bot_error ? ['st-error', 'El token no funciona: ' + r.bot_error]
              : hay ? ['st-ok', 'Token cargado'] : ['st-falta', 'Falta el token del bot'];
        $('st-bot').className = 'estado-bot ' + st[0];
        $('st-bot').textContent = st[1];
        var ul = $('st-errores'); ul.textContent = '';
        (r.errores || []).forEach(function (e) {
          var li = nodo('li');
          li.appendChild(nodo('span', 'num', fechaHora(e.creado) + ' · ' + (e.status || '?')));
          li.appendChild(document.createTextNode(' ' + e.metodo + ': ' + (e.detalle || '')));
          ul.appendChild(li);
        });
        if (!ul.children.length) ul.appendChild(nodo('li', '', 'Sin errores recientes.'));
        if (!cargado) leads();
      }).catch(function () { vista('adm-negado'); });
    }

    function leads() {
      llamar('leads').then(function (r) {
        if (!r.ok) return;
        cargado = true;
        var tb = $('leads'); tb.textContent = '';
        $('leads-n').textContent = r.leads.length;
        r.leads.forEach(function (l) {
          var tr = document.createElement('tr');
          tr.appendChild(nodo('td', 'num', fechaHora(l.creado)));
          tr.appendChild(nodo('td', '', l.nombre));
          tr.appendChild(nodo('td', '', l.mail));
          tr.appendChild(nodo('td', '', l.rubro));
          tr.appendChild(nodo('td', '', l.tg_nombre ? l.tg_nombre + (l.tg_usuario ? ' (@' + l.tg_usuario + ')' : '') : 'Sin conectar'));
          tr.appendChild(nodo('td', 'num', l.tg_id || ''));
          tb.appendChild(tr);
        });
        if (!r.leads.length) { var tr = document.createElement('tr'); var td = nodo('td', '', 'Todavía no hay leads.'); td.colSpan = 6; tr.appendChild(td); tb.appendChild(tr); }
      });
    }

    $('adm-google').addEventListener('click', function () {
      cliente().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname + '?giwa' } });
    });
    $('adm-salir').addEventListener('click', function () { cliente().auth.signOut().then(function () { cargado = false; vista('adm-entrar'); }); });
    $('adm-salir-2').addEventListener('click', function () { cliente().auth.signOut().then(function () { vista('adm-entrar'); }); });
    $('adm-recargar').addEventListener('click', function () { cargado = false; estado(); });
    $('f-token').addEventListener('submit', function (e) {
      e.preventDefault();
      var campo = $('bot_token'), boton = e.target.querySelector('button');
      boton.disabled = true;
      llamar('guardar', { clave: 'bot_token', valor: campo.value })
        .then(function (r) { aviso($('e-config'), r.ok ? 'Token guardado.' : r.error, r.ok); if (r.ok) { campo.value = ''; estado(); } })
        .catch(function () { aviso($('e-config'), 'No se pudo guardar.'); })
        .finally(function () { boton.disabled = false; });
    });
    $('adm-conectar').addEventListener('click', function () {
      var b = this; b.disabled = true;
      llamar('conectar')
        .then(function (r) { aviso($('e-config'), r.ok ? 'Listo: el bot quedó conectado. Revisá los errores en unos segundos.' : r.error, r.ok); setTimeout(estado, 4000); })
        .catch(function () { aviso($('e-config'), 'No se pudo conectar.'); })
        .finally(function () { b.disabled = false; });
    });

    return { abrir: abrir };
  })();

  /* ── Arranque ─────────────────────────────────────────────── */
  pintarIconos(document);
  window.addEventListener('hashchange', function () { irTab(location.hash.slice(1)); });
  var vuelveGoogle = /[?&]giwa\b/.test(location.search);
  irTab(vuelveGoogle ? 'giwa' : (location.hash || '#demos').slice(1));
  if (sesion && !vuelveGoogle && location.hash !== '#giwa') {
    rubro = RUBROS.filter(function (r) { return r.id === sesion.rubro; })[0] || null;
    if (rubro) seguir();
  }
})();
