/*
 * Rádio NIB — Mini Player
 * Service worker (Manifest V3).
 *
 * Responsabilidades:
 *  - Criar/gerir o documento offscreen que toca o áudio (reprodução contínua).
 *  - Persistir o estado (volume, mudo, tocando) em chrome.storage.local.
 *  - Servir de ponte entre o popup e o áudio.
 */

const STATION = {
  shortcode: "radionib",
  nowPlaying: "https://radio.nerdsinblack.com.br/api/nowplaying/radionib",
  fallbackStream: "https://radio.nerdsinblack.com.br/listen/radionib/radio.mp3",
  page: "https://radio.nerdsinblack.com.br/public/radionib",
};

// Retomar a reprodução automaticamente ao reiniciar o Chrome?
// Mantido como `false` por padrão para respeitar a política de autoplay dos
// navegadores e não tocar áudio sem uma ação do usuário ao abrir o navegador.
// O volume e o mudo são sempre restaurados; apenas o "dar play" exige um clique.
const AUTO_RESUME_ON_STARTUP = false;

const DEFAULT_STATE = {
  playing: false,
  volume: 0.8, // 0..1
  muted: false,
  song: "Rádio NIB",
};

async function getState() {
  const stored = await chrome.storage.local.get(DEFAULT_STATE);
  return { ...DEFAULT_STATE, ...stored };
}

async function setState(patch) {
  await chrome.storage.local.set(patch);
  return patch;
}

/* ---------- Ciclo de vida do documento offscreen ---------- */

let creating = null; // trava para evitar criação dupla

async function hasOffscreen() {
  const contexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
  });
  return contexts.length > 0;
}

async function ensureOffscreen() {
  if (await hasOffscreen()) return;
  if (!creating) {
    creating = chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Reprodução contínua do stream de áudio da Rádio NIB.",
    });
  }
  try {
    await creating;
  } catch (e) {
    // Se já existir por uma corrida, seguimos em frente.
  } finally {
    creating = null;
  }
}

function toOffscreen(message) {
  return chrome.runtime
    .sendMessage({ target: "offscreen", ...message })
    .catch(() => {});
}

function broadcastToPopup(message) {
  // Ignora o erro silenciosamente quando o popup está fechado.
  chrome.runtime
    .sendMessage({ target: "popup", ...message })
    .catch(() => {});
}

/* ---------- Comandos ---------- */

async function play() {
  const state = await getState();
  await ensureOffscreen();
  await toOffscreen({ type: "PLAY", volume: state.volume, muted: state.muted });
  await setState({ playing: true });
  broadcastToPopup({ type: "STATE", state: { ...state, playing: true } });
}

async function pause() {
  if (await hasOffscreen()) await toOffscreen({ type: "PAUSE" });
  await setState({ playing: false });
  const state = await getState();
  broadcastToPopup({ type: "STATE", state });
}

async function setVolume(value) {
  const v = Math.min(1, Math.max(0, Number(value) || 0));
  await setState({ volume: v });
  if (await hasOffscreen()) await toOffscreen({ type: "SET_VOLUME", value: v });
}

async function setMuted(muted) {
  const m = !!muted;
  await setState({ muted: m });
  if (await hasOffscreen()) await toOffscreen({ type: "SET_MUTED", value: m });
}

/* ---------- Roteamento de mensagens ---------- */

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || msg.target !== "background") return; // não é para nós

  (async () => {
    switch (msg.type) {
      case "GET_STATE":
        sendResponse(await getState());
        break;
      case "PLAY":
        await play();
        sendResponse({ ok: true });
        break;
      case "PAUSE":
        await pause();
        sendResponse({ ok: true });
        break;
      case "TOGGLE": {
        const s = await getState();
        if (s.playing) await pause();
        else await play();
        sendResponse({ ok: true });
        break;
      }
      case "SET_VOLUME":
        await setVolume(msg.value);
        sendResponse({ ok: true });
        break;
      case "SET_MUTED":
        await setMuted(msg.value);
        sendResponse({ ok: true });
        break;
      case "PLAYBACK_EVENT":
        await handlePlaybackEvent(msg);
        sendResponse({ ok: true });
        break;
      default:
        sendResponse({ ok: false, error: "unknown_type" });
    }
  })();

  return true; // resposta assíncrona
});

async function handlePlaybackEvent(msg) {
  // Eventos vindos do offscreen: playing | pause | waiting | error | stalled
  let patch = null;
  if (msg.event === "playing") patch = { playing: true };
  else if (msg.event === "pause") patch = { playing: false };
  if (patch) await setState(patch);
  const state = await getState();
  broadcastToPopup({ type: "STATE", state, event: msg.event });
}

/* ---------- Padrões e inicialização ---------- */

chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.local.get(Object.keys(DEFAULT_STATE));
  const patch = {};
  for (const [k, v] of Object.entries(DEFAULT_STATE)) {
    if (current[k] === undefined) patch[k] = v;
  }
  patch.playing = false; // nunca começa tocando após instalar/atualizar
  await chrome.storage.local.set(patch);
});

chrome.runtime.onStartup.addListener(async () => {
  const state = await getState();
  if (AUTO_RESUME_ON_STARTUP && state.playing) {
    await play();
  } else if (state.playing) {
    // Lembra que estava tocando, mas não inicia áudio sem ação do usuário.
    await setState({ playing: false });
  }
});
