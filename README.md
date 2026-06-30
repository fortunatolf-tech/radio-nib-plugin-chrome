# 🎧 Rádio NIB — Mini Player para Chrome

> Extensão leve, em **preto e amarelo**, para ouvir a **Rádio NIB** (Nerds in Black) direto do navegador — com play/pause, mudo, volume e o **nome da música ao vivo**.

![Manifest V3](https://img.shields.io/badge/Manifest-V3-FFD400?style=flat-square&labelColor=0c0c0d)
![Licença MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-FFD400?style=flat-square&labelColor=0c0c0d)
![Feito para Chrome](https://img.shields.io/badge/Chrome-116%2B-FFD400?style=flat-square&labelColor=0c0c0d)

<p align="center">
  <img src="docs/preview.png" alt="Prévia do mini player" width="320">
</p>

---

## ✨ O que ela faz

- ▶️ **Play / Pause** do stream ao vivo
- 🔇 **Mudo** (e religa o som sozinho ao subir o volume)
- 🎚️ **Volume** de 0% a 100%
- 🎵 **Nome da música** que está tocando, atualizado automaticamente
- 🔁 **Continua tocando** mesmo com a janelinha fechada
- 💾 **Lembra** o volume e o mudo entre sessões
- 🌐 **Reconecta sozinho** se a internet oscilar

---

## 🚀 Começar agora

**Nunca mexeu com extensões?** Sem problema — o guia abaixo é feito para iniciantes, passo a passo:

➡️ **[Como instalar (guia para iniciantes)](docs/INSTALACAO.md)**

Resumão para quem já tem prática:

1. Baixe este projeto (botão verde **Code → Download ZIP**) e descompacte.
2. No Chrome, abra `chrome://extensions`.
3. Ligue o **Modo do desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactação** e selecione a pasta do projeto.
5. Fixe o ícone na barra e clique para abrir o player. 🎉

---

## 📚 Documentação

| Guia | Para quê |
|------|----------|
| 📥 [Instalação](docs/INSTALACAO.md) | Instalar a extensão do zero, sem saber programar. |
| 🧠 [Como funciona](docs/COMO-FUNCIONA.md) | Entender as "peças" da extensão em linguagem simples. |
| 🛠️ [Adicionar funcionalidades](docs/ADICIONAR-FUNCIONALIDADES.md) | Tutoriais prontos: capa do álbum, atalhos, histórico e mais. |
| 🎨 [Personalizar](docs/PERSONALIZAR.md) | Trocar cores, ícones, nome e até a estação de rádio. |
| 🩺 [Solução de problemas](docs/SOLUCAO-DE-PROBLEMAS.md) | "Não toca", "nome não aparece" e outros perrengues. |
| 🌍 [Publicar e compartilhar](docs/PUBLICAR.md) | Como distribuir para outras pessoas. |

---

## 🗂️ Estrutura do projeto

```
radio-nib-plugin-chrome/
├── manifest.json        # "Identidade" da extensão (nome, permissões, ícones)
├── background.js        # Cérebro: controla o áudio e guarda as configurações
├── offscreen.html/.js   # Toca o áudio em segundo plano (continua com a janela fechada)
├── popup.html/.css/.js  # A janelinha que você vê e clica
├── icons/               # Ícones nos tamanhos 16, 32, 48 e 128 px
└── docs/                # Toda a documentação (você está aqui!)
```

Quer entender o que cada peça faz? Veja **[Como funciona](docs/COMO-FUNCIONA.md)**.

---

## 🤝 Quer contribuir?

Toda ajuda é bem-vinda — desde corrigir um texto até criar um botão novo.
Comece pelo guia **[Adicionar funcionalidades](docs/ADICIONAR-FUNCIONALIDADES.md)**, que ensina a mexer no código com exemplos copiáveis.

1. Faça um *fork* (cópia) do repositório.
2. Crie uma branch: `git checkout -b minha-novidade`.
3. Faça suas mudanças e teste no Chrome.
4. Abra um *Pull Request* descrevendo o que mudou.

---

## 📻 Sobre a rádio

- Página oficial: <https://radio.nerdsinblack.com.br/public/radionib>
- Tecnologia do servidor: [AzuraCast](https://azuracast.com/) (de onde vêm o áudio e o nome das músicas)

## 📄 Licença

Distribuído sob a licença **MIT** — você pode usar, copiar, modificar e compartilhar à vontade. Veja [LICENSE](LICENSE).

> Feito com 💛 para a comunidade **Nerds in Black**.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
