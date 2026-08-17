/* ============================================================
   CONFIG — ajustar quando a data/hora forem confirmadas
   ============================================================ */
const LIVE_AT = '2026-08-27T19:00:00-03:00'; // PENDENTE: confirmar com Brian
const LEAD_ENDPOINT = '';                    // PENDENTE: URL do webhook/CRM
const CHECKOUT_URL  = '';                    // PENDENTE: link de pagamento da aula (R$ 17)

/* ============ HEADER STICKY ============ */
const header = document.getElementById('header');
const stickyCta = document.getElementById('stickyCta');

const onScroll = () => {
  header.classList.toggle('is-stuck', window.scrollY > 12);
  stickyCta.classList.toggle('is-visible', window.scrollY > 600);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ============ MOBILE NAV ============ */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

const closeNav = () => {
  nav.classList.remove('is-open');
  burger.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
};

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

/* ============ DATA DA LIVE (rótulos) ============ */
const liveDate = new Date(LIVE_AT);

const formatWhen = () => {
  const long = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
  }).format(liveDate);

  const short = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit',
    timeZone: 'America/Sao_Paulo'
  }).format(liveDate);

  const label = long.charAt(0).toUpperCase() + long.slice(1);
  document.getElementById('liveWhen').textContent = `${label} (horário de Brasília) · ao vivo e online`;
  document.getElementById('ctaWhen').textContent = `${short} (Brasília)`;
};
formatWhen();

/* ============ COUNTDOWN ============ */
const countdown = document.getElementById('countdown');
const cdFields = {
  d: countdown.querySelector('[data-cd="d"]'),
  h: countdown.querySelector('[data-cd="h"]'),
  m: countdown.querySelector('[data-cd="m"]'),
  s: countdown.querySelector('[data-cd="s"]')
};

const pad = n => String(n).padStart(2, '0');

const tickCountdown = () => {
  const diff = liveDate.getTime() - Date.now();

  if (diff <= 0) {
    countdown.classList.add('is-over');
    Object.values(cdFields).forEach(el => { el.textContent = '00'; });
    clearInterval(countdownTimer);
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  cdFields.d.textContent = pad(Math.floor(totalSeconds / 86400));
  cdFields.h.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
  cdFields.m.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
  cdFields.s.textContent = pad(totalSeconds % 60);
};

tickCountdown();
const countdownTimer = setInterval(tickCountdown, 1000);

/* ============ FAQ: ACCORDION EXCLUSIVO ============ */
const faqItems = document.querySelectorAll('.faq__item');
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach(other => { if (other !== item) other.open = false; });
  });
});

/* ============ MÁSCARA DE TELEFONE ============ */
const phone = document.getElementById('tel');
phone.addEventListener('input', () => {
  const digits = phone.value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) {
    phone.value = digits ? `(${digits}` : '';
    return;
  }

  const rest = digits.slice(2);
  const split = digits.length > 10 ? 5 : 4;
  let masked = `(${digits.slice(0, 2)}) ${rest.slice(0, split)}`;
  if (rest.length > split) masked += `-${rest.slice(split)}`;
  phone.value = masked;
});

/* ============ FORMULÁRIO DE INSCRIÇÃO ============ */
const form = document.getElementById('form');
const formOk = document.getElementById('formOk');

form.addEventListener('submit', async event => {
  event.preventDefault();

  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const ok = field.checkValidity() && field.value.trim() !== '';
    field.classList.toggle('is-error', !ok);
    if (!ok && valid) field.focus();
    valid = valid && ok;
  });

  if (!valid) return;

  const payload = Object.fromEntries(new FormData(form).entries());

  if (LEAD_ENDPOINT) {
    try {
      await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Falha ao enviar inscrição:', error);
    }
  } else {
    console.info('LEAD_ENDPOINT não configurado. Payload:', payload);
  }

  formOk.hidden = false;
  form.reset();

  if (CHECKOUT_URL) {
    window.location.href = CHECKOUT_URL;
    return;
  }

  setTimeout(() => { formOk.hidden = true; }, 7000);
});

/* ============ ANO NO RODAPÉ ============ */
document.getElementById('year').textContent = new Date().getFullYear();
