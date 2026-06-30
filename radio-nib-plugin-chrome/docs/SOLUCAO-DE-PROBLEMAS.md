# 🩺 Solução de problemas

Achou um perrengue? Procure ele aqui. Para a maioria dos casos, a primeira coisa a tentar é **recarregar a extensão** (`chrome://extensions` → 🔄).

---

## 🔧 Como ver os erros (vale para tudo)

1. Vá em `chrome://extensions`.
2. No cartão da extensão, se aparecer um botão vermelho **Erros**, clique nele.
3. Para ver o "console" dos bastidores, clique em **Inspecionar visualizações → service worker**.
4. Para ver o console da janelinha, **abra o popup**, clique nele com o botão direito e escolha **Inspecionar**.

Mensagens em **vermelho** são erros. Copie o texto — ele costuma dizer exatamente o arquivo e a linha.

---

## A extensão não carrega / "Manifest is not valid"

- Você selecionou a **pasta certa**? Tem que ser a pasta que contém o `manifest.json` (não a pasta de cima, nem o arquivo).
- Se você editou o `manifest.json`, provavelmente é **vírgula faltando ou sobrando**. JSON é chato com isso. Cole o conteúdo em <https://jsonlint.com> para achar o erro.

---

## Cliquei em Play e não sai som 🔇

1. **A internet está ok?** Abra a [página da rádio](https://radio.nerdsinblack.com.br/public/radionib) no navegador e veja se toca lá.
2. **O volume não está em 0%?** E o botão de **mudo** não está ativo (vermelho)?
3. **O som do computador / aba** não está mudo?
4. Abra o console do **service worker** (veja acima) e procure erros como `audio_error`. Se aparecer, o endereço do stream pode ter mudado — confira em [Personalizar → outra estação](PERSONALIZAR.md#usar-com-outra-estação-de-rádio).
5. Recarregue a extensão e tente de novo.

> A extensão tenta **reconectar sozinha** quando o stream cai. Às vezes basta esperar alguns segundos.

---

## O nome da música não aparece ou não atualiza 🎵

- O nome só atualiza com a **janelinha aberta** (isso é de propósito, para economizar recursos). Ao reabrir, ele busca de novo na hora.
- Confirme que o `host_permissions` no `manifest.json` aponta para `https://radio.nerdsinblack.com.br/*`. Sem isso, o Chrome bloqueia a leitura do nome (erro de "CORS" no console).
- Pode ser que a faixa atual simplesmente não tenha nome cadastrado na rádio — nesse caso aparece "Rádio NIB".

---

## "Service worker (inactive)" — isso é erro?

**Não.** É normal e até bom. O Chrome "adormece" o cérebro da extensão quando não há nada acontecendo, para poupar memória. Ele acorda sozinho quando você clica em algo. 😴

---

## A música para quando eu fecho a janelinha

Não deveria — ela usa um tocador escondido (offscreen) para continuar.

- Confirme que a permissão `offscreen` está no `manifest.json`.
- Use um Chrome **atualizado** (versão 116 ou mais nova). Em versões muito antigas a Offscreen API não existe.

---

## O volume/mudo não é lembrado

- Confirme que a permissão `storage` está no `manifest.json`.
- Se você **remover e reinstalar** a extensão, as configurações são zeradas (isso é esperado).

---

## A rádio não volta a tocar quando abro o Chrome

Isso é o comportamento padrão (não tocar som sem você pedir). Se você **quer** que volte sozinha, veja o tutorial [Tocar sozinho quando o Chrome abrir](ADICIONAR-FUNCIONALIDADES.md#2-tocar-sozinho-quando-o-chrome-abrir).

---

## Não achei meu problema aqui

Abra uma *Issue* no GitHub descrevendo:

1. O que você fez,
2. O que esperava que acontecesse,
3. O que aconteceu (com o texto do erro, se houver),
4. Sua versão do Chrome (veja em `chrome://version`).

Quanto mais detalhes, mais fácil ajudar. 🙏
