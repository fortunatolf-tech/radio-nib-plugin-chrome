# 🌍 Publicar e compartilhar

Você não precisa pagar nada para outras pessoas usarem a extensão. Aqui estão as formas, da mais simples à mais "oficial".

---

## Opção 1 — Compartilhar pelo GitHub (grátis, recomendado) 🆓

É o jeito mais fácil e é exatamente o que este repositório faz.

1. Deixe os arquivos no repositório do GitHub (já estão!).
2. Mande o link do repositório para as pessoas.
3. Elas seguem o guia de **[Instalação](INSTALACAO.md)**: baixam o ZIP e usam o **Modo do desenvolvedor**.

**Dica: crie uma "Release" para facilitar o download.**

1. No GitHub, vá em **Releases → Create a new release**.
2. Em *Tag*, escreva `v1.0.0`.
3. Anexe o arquivo `radio-nib-plugin-chrome.zip` (você pode gerar pelo **Code → Download ZIP** ou compactando a pasta).
4. Publique. Agora há um link de download limpo para todo mundo.

> ⚠️ A pessoa precisa **manter a pasta** no computador; se apagar, a extensão para. É a troca por não usar a loja.

---

## Opção 2 — Empacotar um `.crx` 📦

O Chrome consegue gerar um pacote `.crx` (um único arquivo da extensão):

1. Em `chrome://extensions`, clique em **Compactar extensão** (Pack extension).
2. Em *Diretório raiz*, aponte para a pasta da extensão.
3. Clique em **Compactar**. Ele cria um `.crx` e uma chave `.pem`.

> ⚠️ **Guarde bem o arquivo `.pem`** — ele é a "assinatura" da sua extensão e é necessário para gerar atualizações. Versões recentes do Chrome dificultam instalar `.crx` de fora da loja, então a **Opção 1 costuma ser mais prática**.

---

## Opção 3 — Chrome Web Store (oficial, mas paga) 🏪

Publicar na loja deixa a instalação com 1 clique e atualizações automáticas. Porém exige uma **taxa única de US$ 5** (cobre até 20 extensões, vale para sempre) e ativar a **verificação em duas etapas** na conta Google.

Passo a passo resumido:

1. Acesse o **[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)** e registre-se (pague os US$ 5).
2. **Add new item** → envie o `.zip` da extensão.
3. Preencha a **ficha**: descrição, categoria (sugestão: *Entertainment*), ícone 128px e ao menos 1 captura de tela.
4. Na aba **Privacy**, declare o propósito único e que **não há coleta de dados**.
5. **Submit for review**. A análise leva de algumas horas a poucos dias.

Detalhes oficiais: <https://developer.chrome.com/docs/webstore/publish>.

---

## Qual escolher?

| Situação | Melhor opção |
|----------|--------------|
| Quero compartilhar com amigos/comunidade, sem gastar | **Opção 1 (GitHub)** |
| Quero um único arquivo para distribuir internamente | Opção 2 (.crx) |
| Quero presença oficial e instalação em 1 clique | Opção 3 (Web Store) |

Para a maioria dos casos da Rádio NIB, a **Opção 1** já resolve muito bem. 💛
