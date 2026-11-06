(function () {
  var quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Intro: una vez por sesión.
  var intro = document.getElementById('intro');
  if (intro && !intro.hidden) {
    var video = intro.querySelector('video');
    var cerrar = function () {
      if (intro.classList.contains('fuera')) return;
      intro.classList.add('fuera');
      document.body.classList.remove('sin-scroll');
      try { sessionStorage.setItem('giwaIntro', '1'); } catch (e) {}
      setTimeout(function () { intro.remove(); }, 800);
    };
    document.body.classList.add('sin-scroll');
    video.muted = true;
    video.src = video.dataset.src;
    video.addEventListener('ended', cerrar);
    video.addEventListener('error', cerrar);
    intro.addEventListener('click', cerrar);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrar(); });
    var reproduccion = video.play();
    if (reproduccion) reproduccion.catch(cerrar);
    setTimeout(cerrar, 10000); // si el video no arranca, la web no queda tapada
  }

  if (quieto) {
    document.querySelectorAll('video[autoplay]').forEach(function (v) { v.pause(); });
    return;
  }
  if (!('IntersectionObserver' in window)) return;

  // Los títulos, textos y tarjetas aparecen al llegar a ellos.
  var aparece = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('on');
      aparece.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.sec-w > *, .dos > *, .grid3 > *, .valor, .banda-txt').forEach(function (el) {
    if (el.querySelector && el.querySelector('.grid3')) return;
    el.classList.add('rv');
    aparece.observe(el);
  });

  // El video de la banda se baja y corre sólo cuando está a la vista.
  document.querySelectorAll('video[data-src]:not(#intro video)').forEach(function (v) {
    new IntersectionObserver(function (entradas) {
      if (entradas[0].isIntersecting) {
        if (!v.src) v.src = v.dataset.src;
        v.play().catch(function () {});
      } else {
        v.pause();
      }
    }, { rootMargin: '200px' }).observe(v);
  });
})();
