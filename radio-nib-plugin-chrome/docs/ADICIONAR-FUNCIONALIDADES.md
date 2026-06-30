# 🛠️ Adicionar funcionalidades (tutoriais práticos)

Aqui você aprende a mexer no código com **exemplos prontos para copiar e colar**. Cada tutorial diz **qual arquivo abrir**, **o que mudar** e **como testar**.

## Antes de começar: o ciclo de edição

Toda vez que você mudar um arquivo:

1. Salve o arquivo.
2. Vá em `chrome://extensions`.
3. No cartão da extensão, clique no ícone **recarregar** 🔄.
4. Abra o popup de novo para ver o resultado.

> 🧰 **Dica:** abra os arquivos com um editor de código gratuito como o [VS Code](https://code.visualstudio.com/). Ele colore o código e ajuda a achar erros.

> 🐞 Travou? Em `chrome://extensions`, clique em **Erros** no cartão da extensão, ou em **Inspecionar visualizações** para abrir o console. Veja o guia de [Solução de problemas](SOLUCAO-DE-PROBLEMAS.md).

---

## Nível fácil 🟢

### 1. Trocar a cor de destaque (amarelo → outra)

**Arquivo:** `popup.css` — lá no topo, no bloco `:root`.

Troque o valor do amarelo:

```css
:root {
  --yellow: #00e0a4;       /* exemplo: verde-água */
  --yellow-dim: #00b384;   /* uma versão mais escura da mesma cor */
}
```

Recarregue a extensão. Pronto, todo o player muda de cor. 🎨
(Quer mudar os ícones também? Veja [Personalizar](PERSONALIZAR.md).)

---

### 2. Tocar sozinho quando o Chrome abrir

**Arquivo:** `background.js` — perto do topo.

Troque `false` por `true`:

```js
const AUTO_RESUME_ON_STARTUP = true;
```

Agora, se você estava ouvindo quando fechou o Chrome, a rádio volta a tocar ao abrir.
(Por padrão deixamos desligado para não tocar som "do nada" e respeitar as regras dos navegadores.)

---

### 3. Mudar a frequência de atualização do nome da música

**Arquivo:** `popup.js` — perto do topo.

O valor está em **milissegundos** (15000 = 15 segundos):

```js
const POLL_MS = 10000; // agora atualiza a cada 10 segundos
```

> ⚠️ Não exagere para valores muito baixos (ex.: 1000). Atualizar rápido demais gasta rede à toa e não melhora a experiência. Entre 10 e 20 segundos é o ideal.

---

## Nível médio 🟡

### 4. Mostrar a capa do álbum 🖼️

Os metadados da rádio já trazem a imagem da capa. Vamos exibi-la. São 3 arquivos.

**4.1 — `popup.html`:** dentro da seção `<section class="now" ...>`, adicione uma imagem antes do texto:

```html
<section class="now" aria-live="polite">
  <img class="now-art" id="nowArt" alt="" hidden />
  <span class="now-label">Tocando agora</span>
  <p class="now-text" id="nowText" title="">—</p>
</section>
```

**4.2 — `popup.css`:** adicione no final do arquivo:

```css
.now-art {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;
  display: block;
}
```

**4.3 — `popup.js`:** dentro da função `fetchNowPlaying()`, depois de calcular o `text`, adicione:

```js
const art = document.getElementById("nowArt");
const artUrl = song.art; // os metadados da AzuraCast já trazem isso
if (artUrl) {
  art.src = artUrl;
  art.hidden = false;
} else {
  art.hidden = true;
}
```

Recarregue e abra o popup tocando uma música. A capa aparece! 🎉

---

### 5. Mostrar as músicas que tocaram antes 🕓

A resposta da rádio inclui um histórico (`song_history`). Vamos listar as 3 últimas.

**5.1 — `popup.html`:** antes do `<footer ...>`, adicione:

```html
<section class="history">
  <span class="now-label">Tocou antes</span>
  <ul id="historyList" class="history-list"></ul>
</section>
```

**5.2 — `popup.css`:** no final:

```css
.history-list { list-style: none; margin-top: 4px; }
.history-list li {
  font-size: 11px;
  color: var(--text-dim);
  padding: 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**5.3 — `popup.js`:** dentro de `fetchNowPlaying()`, depois do `const data = await res.json();`, adicione:

```js
const history = (data && data.song_history) || [];
const ul = document.getElementById("historyList");
ul.innerHTML = "";
history.slice(0, 3).forEach((item) => {
  const li = document.createElement("li");
  li.textContent = (item.song && item.song.text) || "—";
  ul.appendChild(li);
});
```

---

## Nível avançado 🔴

### 6. Atalho de teclado para Play/Pause ⌨️

Dá para tocar/pausar sem abrir a janelinha, usando um atalho global.

**6.1 — `manifest.json`:** adicione o bloco `"commands"` (cuidado com as vírgulas do JSON):

```json
  "commands": {
    "toggle-play": {
      "suggested_key": { "default": "Ctrl+Shift+P" },
      "description": "Tocar ou pausar a Rádio NIB"
    }
  },
```

**6.2 — `background.js`:** adicione no final do arquivo:

```js
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-play") {
    const s = await getState();
    if (s.playing) await pause();
    else await play();
  }
});
```

Recarregue a extensão. Agora `Ctrl+Shift+P` liga/desliga a rádio. 🎚️
(Você pode mudar a tecla em `chrome://extensions/shortcuts`.)

---

## Como testar bem o que você criou ✅

- Recarregue a extensão **sempre** após editar.
- Teste **abrindo e fechando** o popup (o áudio deve continuar).
- Veja o **console** (em "Inspecionar visualizações") para checar se não apareceu erro vermelho.
- Se mexeu no `manifest.json`, confira as **vírgulas** — JSON é exigente com isso.

Boa! Quando estiver feliz com a mudança, considere abrir um *Pull Request* para compartilhar com a comunidade (veja o [README](../README.md#-quer-contribuir)). 💛
