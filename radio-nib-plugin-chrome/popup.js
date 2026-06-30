/*
 * Rádio NIB — Mini Player (popup / interface)
 * Controla a UI, conversa com o service worker e consulta os metadados
 * (nome da música) periodicamente enquanto o popup está aberto.
 */

const NOWPLAYING_URL = "https://radio.nerdsinblack.com.br/api/nowplaying/radionib";
const POLL_MS = 15000; // intervalo de atualização do nome da música

const ICONS = {
  play: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
  volOn: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12z"/></svg>',
  volOff: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 10v4h4l5 5V5L7 10H3zm16.5 2 2.3-2.3-1.4-1.4L18 10.6l-2.3-2.3-1.4 1.4L16.6 12l-2.3 2.3 1.4 1.4L18 13.4l2.3 2.3 1.4-1.4z"/></svg>',
};

const els = {
  player: document.getElementById("player"),
  playBtn: document.getElementById("playBtn"),
  muteBtn: document.getElementById("muteBtn"),
  volume: document.getElementById("volume"),
  volumeVal: document.getElementById("volumeVal"),
  nowText: document.getElementById("nowText"),
  status: document.getElementById("status"),
  liveBadge: document.getElementById("liveBadge"),
};

let state = { playing: false, volume: 0.8, muted: false, song: "Rádio NIB" };
let pollTimer = null;

function send(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ target: "background", ...message }, (res) => {
      void chrome.runtime.lastError; // evita ruído quando não há resposta
      resolve(res);
    });
  });
}

/* ---------- Render ---------- */

function renderPlay() {
  els.playBtn.innerHTML = state.playing ? ICONS.pause : ICONS.play;
  els.playBtn.setAttribute("aria-label", state.playing ? "Pausar" : "Tocar");
  els.playBtn.setAttribute("aria-pressed", String(state.playing));
  els.player.classList.toggle("is-playing", state.playing);
  if (!state.song || state.song === "Rádio NIB") {
    els.status.textContent = state.playing ? "Conectando…" : "Pronto para tocar";
  } else {
    els.status.textContent = state.playing ? "No ar" : "Pausado";
  }
}

function renderMute() {
  els.muteBtn.innerHTML = state.muted ? ICONS.volOff : ICONS.volOn;
  els.muteBtn.classList.toggle("is-muted", state.muted);
  els.muteBtn.setAttribute("aria-label", state.muted ? "Reativar som" : "Silenciar");
  els.muteBtn.setAttribute("aria-pressed", String(state.muted));
}

function renderVolume() {
  const pct = Math.round(state.volume * 100);
  els.volume.value = String(pct);
  els.volumeVal.textContent = pct + "%";
  els.volume.style.setProperty("--vol", pct + "%");
}

function renderNow() {
  const text = state.song || "Rádio NIB";
  els.nowText.textContent = text;
  els.nowText.title = text;
}

function renderAll() {
  renderPlay();
  renderMute();
  renderVolume();
  renderNow();
}

/* ---------- Metadados (nome da música) ---------- */

async function fetchNowPlaying() {
  try {
    const res = await fetch(NOWPLAYING_URL, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    const song = (data && data.now_playing && data.now_playing.song) || {};
    const text =
      song.text ||
      [song.artist, song.title].filter(Boolean).join(" - ") ||
      "Rádio NIB";
    const isLive = !!(data && data.live && data.live.is_live);
    const streamer = data && data.live && data.live.streamer_name;

    state.song = text;
    renderNow();
    if (state.playing) {
      els.status.textContent = isLive && streamer ? "Ao vivo: " + streamer : "No ar";
    }
    els.liveBadge.hidden = !isLive;

    chrome.storage.local.set({ song: text }); // mostra o último valor ao reabrir
  } catch (e) {
    /* mantém o último valor exibido */
  }
}

function startPolling() {
  fetchNowPlaying();
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(fetchNowPlaying, POLL_MS);
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

/* ---------- Eventos da UI ---------- */

els.playBtn.addEventListener("click", async () => {
  const desired = !state.playing;
  state.playing = desired; // atualização otimista
  renderPlay();
  await send({ type: desired ? "PLAY" : "PAUSE" });
});

els.muteBtn.addEventListener("click", async () => {
  state.muted = !state.muted;
  renderMute();
  await send({ type: "SET_MUTED", value: state.muted });
});

let lastVolSend = 0;
els.volume.addEventListener("input", () => {
  const pct = Number(els.volume.value);
  state.volume = pct / 100;
  els.volumeVal.textContent = pct + "%";
  els.volume.style.setProperty("--vol", pct + "%");

  // Subir o volume reativa o som automaticamente.
  if (state.muted && pct > 0) {
    state.muted = false;
    renderMute();
    send({ type: "SET_MUTED", value: false });
  }

  // Throttle: no máximo ~1 mensagem a cada 80ms durante o arraste.
  const now = Date.now();
  if (now - lastVolSend > 80) {
    lastVolSend = now;
    send({ type: "SET_VOLUME", value: state.volume });
  }
});
els.volume.addEventListener("change", () => {
  // Garante que o valor final seja aplicado e persistido.
  send({ type: "SET_VOLUME", value: state.volume });
});

/* ---------- Atualizações vindas do service worker ---------- */

chrome.runtime.onMessage.addListener((msg) => {
  if (!msg || msg.target !== "popup") return;
  if (msg.type === "STATE" && msg.state) {
    state = { ...state, ...msg.state };
    renderAll();
  }
});

/* ---------- Inicialização ---------- */

async function init() {
  renderAll(); // mostra os padrões imediatamente
  const s = await send({ type: "GET_STATE" });
  if (s) state = { ...state, ...s };
  renderAll();
  startPolling();
}

window.addEventListener("unload", stopPolling);
init();
