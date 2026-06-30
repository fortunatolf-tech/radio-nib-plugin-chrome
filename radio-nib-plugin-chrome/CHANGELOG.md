# Histórico de versões

Este projeto segue, de forma simples, o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/)
e o [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] — 2026-06-30

### Adicionado
- ▶️ Botão de play/pause do stream ao vivo.
- 🔇 Botão de mudo (com auto-religar ao subir o volume).
- 🎚️ Controle de volume de 0% a 100%.
- 🎵 Exibição do nome da música ao vivo (atualização a cada 15s com o popup aberto).
- 🔁 Reprodução contínua em segundo plano via Offscreen API (continua com o popup fechado).
- 💾 Persistência de volume e mudo entre sessões (`chrome.storage`).
- 🌐 Reconexão automática do stream com backoff progressivo.
- 🎨 Tema visual preto e amarelo; ícones nos tamanhos 16/32/48/128 px.
- 📚 Documentação completa para iniciantes em `docs/`.
