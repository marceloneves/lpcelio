/* ============================================================
   CONFIG — ajustar quando a data/hora forem confirmadas
   ============================================================ */
const LIVE_AT = '2026-08-27T19:00:00-03:00'; // PENDENTE: confirmar com Brian

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

/* ============ VÍDEO DO HERO (autoplay mudo + botão de som) ============ */
const videoPlay = document.getElementById('videoPlay');

if (videoPlay) {
  const videoId = videoPlay.dataset.yt;
  const videoTitle = 'Célio Gomes explica por que esta aula existe';

  const buildSrc = muted => {
    const params = new URLSearchParams({
      autoplay: '1',
      mute: muted ? '1' : '0',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      enablejsapi: '1'
    });
    if (location.protocol.startsWith('http')) params.set('origin', location.origin);
    return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
  };

  const mountPlayer = ({ muted }) => {
    const frame = document.createElement('div');
    frame.className = 'video-card__frame';

    const iframe = document.createElement('iframe');
    iframe.src = buildSrc(muted);
    iframe.title = videoTitle;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);

    // Botão de som: o autoplay só é permitido mudo, então o áudio depende de um clique.
    if (muted) {
      const sound = document.createElement('button');
      sound.type = 'button';
      sound.className = 'video-card__sound';
      sound.innerHTML = '<span class="video-card__sound-icon" aria-hidden="true"></span> Clique para ativar o som';

      sound.addEventListener('click', () => {
        ['unMute', 'playVideo'].forEach(func => {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func, args: [] }),
            'https://www.youtube-nocookie.com'
          );
        });
        sound.remove();
      });

      frame.appendChild(sound);
    }

    videoPlay.replaceWith(frame);
    return frame;
  };

  // Clique na capa antes do player montar = som ligado direto (é um gesto do usuário).
  videoPlay.addEventListener('click', () => mountPlayer({ muted: false }));

  // Autoplay mudo assim que o vídeo entra na tela (evita carregar fora de vista).
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      obs.disconnect();
      if (videoPlay.isConnected) mountPlayer({ muted: true });
    }, { threshold: 0.35 });
    observer.observe(videoPlay);
  } else {
    mountPlayer({ muted: true });
  }
}

/* ============ FAQ: ACCORDION EXCLUSIVO ============ */
const faqItems = document.querySelectorAll('.faq__item');
faqItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqItems.forEach(other => { if (other !== item) other.open = false; });
  });
});

/* ============ ANO NO RODAPÉ ============ */
document.getElementById('year').textContent = new Date().getFullYear();
