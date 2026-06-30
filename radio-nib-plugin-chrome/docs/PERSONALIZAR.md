# 🎨 Personalizar

Deixe o player com a sua cara. Nenhuma destas mudanças exige saber programar de verdade — é mais "trocar valores".

> Depois de qualquer mudança: salve → `chrome://extensions` → **recarregar** 🔄.

---

## Cores

**Arquivo:** `popup.css`, bloco `:root` no topo. Cada cor é um código hexadecimal (`#RRGGBB`).

```css
:root {
  --bg: #0c0c0d;        /* fundo (quase preto)        */
  --yellow: #ffd400;    /* cor de destaque (amarelo)  */
  --text: #f5f5f5;      /* cor do texto               */
  --danger: #ff5252;    /* cor do "mudo" ativo        */
}
```

Não sabe qual código usar? Use um seletor de cores como o do [Google](https://www.google.com/search?q=color+picker) e cole o valor `#...`.

---

## Ícones

A extensão usa 4 tamanhos: `icons/icon16.png`, `32`, `48` e `128`.

**Opção A — Trocar pelas suas imagens:** substitua os 4 arquivos por imagens **quadradas** (PNG) com os mesmos nomes e tamanhos.

**Opção B — Gerar de novo com o script:** se você mudou a cor de destaque e quer os ícones combinando, edite as cores no topo de `tools/gerar-icones.py` e rode:

```bash
python3 tools/gerar-icones.py
```

(É preciso ter Python e a biblioteca Pillow: `pip install pillow`.)

---

## Nome e textos

- **Nome da extensão:** `manifest.json`, campos `"name"` e `"short_name"`.
- **Título da janelinha e textos visíveis:** `popup.html` (ex.: "Rádio NIB", "Tocando agora", "Abrir página da rádio").

---

## Tamanho da janelinha

**Arquivo:** `popup.css`, na regra `.player`:

```css
.player {
  width: 300px;      /* deixe maior ou menor */
  min-width: 260px;
}
```

---

## Usar com OUTRA estação de rádio

Esta extensão funciona com qualquer rádio que use **AzuraCast** (o mesmo sistema da Rádio NIB). Para apontar para outra estação, troque os endereços em **3 arquivos**:

| Arquivo | O que procurar |
|--------|----------------|
| `background.js` | objeto `STATION` (`nowPlaying`, `fallbackStream`, `page`) |
| `offscreen.js` | objeto `STATION` (`nowPlaying`, `fallbackStream`) |
| `popup.js` | constante `NOWPLAYING_URL` e o link em `popup.html` |

O padrão dos endereços do AzuraCast é:

```
https://SEU-SERVIDOR/api/nowplaying/SUA-ESTACAO     ← nome da música
https://SEU-SERVIDOR/listen/SUA-ESTACAO/radio.mp3   ← áudio (fallback)
```

> Também ajuste `host_permissions` no `manifest.json` para o novo domínio, senão a leitura do nome da música é bloqueada. Veja o porquê em [Como funciona](COMO-FUNCIONA.md).

---

## Intervalo de atualização do nome da música

**Arquivo:** `popup.js` → `const POLL_MS = 15000;` (em milissegundos). Veja o tutorial em [Adicionar funcionalidades](ADICIONAR-FUNCIONALIDADES.md#3-mudar-a-frequência-de-atualização-do-nome-da-música).
