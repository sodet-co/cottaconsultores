/* ==========================================================================
   DATOS DE CONTACTO — completar aquí. Lo que quede vacío no se muestra.
   ========================================================================== */
const CONTACTO = {
  whatsapp: '',   // solo números con indicativo, ej: '573001234567'
  email: '',      // ej: 'contacto@cottaconsultores.com.co'
  direccion: '',  // ej: 'Calle 00 # 00-00, Oficina 000, Ciudad'
  instagram: 'https://www.instagram.com/cottaconsultores_sas/'
};

(function () {
  'use strict';

  // ---------- Año del footer ----------
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---------- Header con sombra al hacer scroll ----------
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Menú móvil ----------
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('menu');
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // ---------- Animación de entrada ----------
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // ---------- Datos de contacto ----------
  const formatPhone = (n) => {
    const m = n.match(/^57(\d{3})(\d{3})(\d{4})$/);
    return m ? `+57 ${m[1]} ${m[2]} ${m[3]}` : `+${n}`;
  };
  const show = (key, fill) => {
    const li = document.querySelector(`[data-contact="${key}"]`);
    if (!li || !CONTACTO[key]) return;
    fill(li);
    li.hidden = false;
  };
  show('whatsapp', (li) => {
    const a = li.querySelector('[data-contact-link]');
    a.href = `https://wa.me/${CONTACTO.whatsapp}`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = formatPhone(CONTACTO.whatsapp);
  });
  show('email', (li) => {
    const a = li.querySelector('[data-contact-link]');
    a.href = `mailto:${CONTACTO.email}`;
    a.textContent = CONTACTO.email;
  });
  show('direccion', (li) => {
    li.querySelector('[data-contact-text]').textContent = CONTACTO.direccion;
  });

  // ---------- Formulario ----------
  // Sin backend: arma el mensaje y lo envía por WhatsApp, o por correo si no hay WhatsApp.
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const setStatus = (msg, isError) => {
    status.textContent = msg;
    status.classList.toggle('error', Boolean(isError));
  };

  form.addEventListener('input', (e) => e.target.classList.remove('invalid'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const required = [form.nombre, form.mensaje];
    const missing = required.filter((f) => !f.value.trim());
    required.forEach((f) => f.classList.toggle('invalid', missing.includes(f)));
    if (missing.length) {
      setStatus('Por favor complete su nombre y el mensaje.', true);
      missing[0].focus();
      return;
    }

    const empresa = form.empresa.value.trim();
    const texto = [
      `Hola, soy ${form.nombre.value.trim()}${empresa ? ` de ${empresa}` : ''}.`,
      `Servicio de interés: ${form.servicio.value}.`,
      form.mensaje.value.trim()
    ].join('\n');

    if (CONTACTO.whatsapp) {
      window.open(`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
      setStatus('Abrimos WhatsApp con su mensaje listo para enviar.');
    } else if (CONTACTO.email) {
      const asunto = `Solicitud de asesoría: ${form.servicio.value}`;
      window.location.href = `mailto:${CONTACTO.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(texto)}`;
      setStatus('Abrimos su correo con el mensaje listo para enviar.');
    } else {
      // Mientras no haya WhatsApp ni correo configurados, se usa Instagram.
      try {
        await navigator.clipboard.writeText(texto);
        setStatus('Copiamos su mensaje. Péguelo en nuestro chat de Instagram.');
      } catch (err) {
        setStatus('Escríbanos por Instagram y con gusto le atendemos.');
      }
      window.open(CONTACTO.instagram, '_blank', 'noopener');
    }
  });
})();
