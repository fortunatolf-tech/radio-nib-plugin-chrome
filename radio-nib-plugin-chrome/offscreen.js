/*
 * Rádio NIB — Mini Player
 * Documento offscreen: hospeda o <audio> que toca o stream e mantém a
 * reprodução contínua e estável, com reconexão automática em caso de falha.
 */

const STATION = {
  nowPlaying: "https://radio.nerdsinblack.com.br/api/nowplaying/radionib",
  fallbackStream: "https://radio.nerdsinblack.com.br/listen/radionib/radio.mp3",
};

const audio = document.getElementById("player");

let shouldPlay = false; // intenção do usuário (tocar/parar)
let reconnectTimer = null;
let reconnectDelay = 2000;
const MAX_RECONNECT_DELAY = 30000;

function clamp01(n) {
  return Math.min(1, Math.max(0, Number(n) || 0));
}

function report(event, extra = {}) {
  chrome.runtime
    .sendMessage({ target: "background", type: "PLAYBACK_EVENT", event, ...extra })
    .catch(() => {});
}

// Lê a URL real do stream a partir dos metadados da AzuraCast.
// Se falhar, usa o mount padrão como fallback.
async function resolveStreamUrl() {
  try {
    const res = await fetch(STATION.nowPlaying, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const url = data && data.station && data.station.listen_url;
      if (url) return url;
    }
  } catch (e) {
    /* usa fallback */
  }
  return STATION.fallbackStream;
}

async function startPlayback({ volume, muted } = {}) {
  shouldPlay = true;
  if (typeof volume === "number") audio.volume = clamp01(volume);
  if (typeof muted === "boolean") audio.muted = muted;

  const url = await resolveStreamUrl();
  // Recarrega para conectar na "borda ao vivo" do stream (evita buffer antigo).
  audio.src = url;
  audio.load();
  try {
    await audio.play();
  } catch (err) {
    report("error", { message: String((err && err.message) || err) });
    scheduleReconnect();
  }
}

function stopPlayback() {
  shouldPlay = false;
  clearReconnect();
  audio.pause();
  // Libera a conexão de rede do stream.
  audio.removeAttribute("src");
  audio.load();
}

function clearReconnect() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
}

function scheduleReconnect() {
  if (!shouldPlay || reconnectTimer) return;
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    if (!shouldPlay) return;
    const url = await resolveStreamUrl();
    audio.src = url;
    audio.load();
    try {
      await audio.play();
    } catch (e) {
      reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_DELAY);
      scheduleReconnect();
    }
  }, reconnectDelay);
}

/* Eventos do elemento de áudio */
audio.addEventListener("playing", () => {
  reconnectDelay = 2000; // reseta o backoff ao tocar com sucesso
  clearReconnect();
  report("playing");
});
audio.addEventListener("pause", () => {
  if (!shouldPlay) report("pause");
});
audio.addEventListener("waiting", () => report("waiting"));
audio.addEventListener("stalled", () => {
  if (shouldPlay) scheduleReconnect();
});
audio.addEventListener("error", () => {
  if (shouldPlay) scheduleReconnect();
  report("error", { message: "audio_error" });
});
audio.addEventListener("ended", () => {
  // Um stream ao vivo não deveria "terminar"; se terminar, reconecta.
  if (shouldPlay) scheduleReconnect();
});

/* Mensagens vindas do service worker */
chrome.runtime.onMessage.addListener((msg) => {
  if (!msg || msg.target !== "offscreen") return;
  switch (msg.type) {
    case "PLAY":
      startPlayback({ volume: msg.volume, muted: msg.muted });
      break;
    case "PAUSE":
    case "STOP":
      stopPlayback();
      break;
    case "SET_VOLUME":
      audio.volume = clamp01(msg.value);
      break;
    case "SET_MUTED":
      audio.muted = !!msg.value;
      break;
  }
});
