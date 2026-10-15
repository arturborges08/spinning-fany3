# HEB Academy — site v3 (identidade "marca-texto")

Página única, fundo preto, folhas brancas e um amarelo marca-texto que só aparece como grifo. O logo novo é H + três traços de marca-texto (o E) + B. Um livro 3D da HEB acompanha o scroll: aparece na frente do logo gigante, gira ao lado do manifesto, sai de cena enquanto você lê e volta para pousar na pilha no final. Ele nunca fica atrás de um texto (testado em 6 tamanhos de tela).

## Rodar no computador

```bash
cd heb-academy
python -m http.server 8080      # ou: npx serve .
```

Abra http://localhost:8080 (módulos ES não abrem direto do arquivo).

## Publicar

Pasta estática, sem build: Netlify (arraste em app.netlify.com/drop), Vercel (`npx vercel`, Framework "Other", saída `.`) ou cPanel/FTP (`public_html`). Ative gzip/brotli para `.js` e cache longo em `vendor/` e `assets/`.

## Estrutura

```
index.html                       conteúdo, SEO e todos os links de compra
DESIGN.md                        sistema de design (cores, tipografia, componentes, regras)
PRODUCT.md                       fatos do produto que guiam o design
assets/brand/                    logo (SVG) e favicon
assets/fonts/archivo-var.woff    fonte Archivo (licença OFL), hospedada junto
assets/css/site.css              tokens no topo (:root), layout, celular, movimento reduzido
assets/js/main.js                menu, grifos, revelações, carrossel, botões magnéticos, livro 3D
assets/js/scene/choreography.js  poses do livro por seção (âncoras de layout)
assets/js/scene/covers.js        capa, lombada e contracapa do livro HEB
assets/img/                      capas reais, foto do autor, imagens de reserva e og.jpg
assets/models/                   livro.glb e pilha.glb (+ cópias .glb.json)
```

## Ajustes comuns

- **Onde o livro fica em cada tela:** os elementos com `data-book-anchor` e `data-stack-anchor` reservam o espaço; mude o tamanho deles no CSS e o livro se ajusta sozinho.
- **Trocar capa:** substitua o arquivo em `assets/img/capas/` mantendo o nome.
- **Notas de margem do carrossel:** atributo `data-note` de cada `.flow__item` no HTML.
- **Cores:** `:root` em `site.css` e `assets/js/scene/brand.js`.

## Garantias

- Scroll nativo; o canvas não recebe cliques; render pausa fora da tela.
- Movimento reduzido: sem coreografia, livro parado no topo e pilha no final, grifos já marcados.
- Sem WebGL: imagens estáticas do livro e da pilha; site 100% utilizável.

## Créditos

- "Pilha de livros" por Alice GameDev (Sketchfab), CC BY 4.0, cores adaptadas (crédito no rodapé, manter).
- Fonte Archivo, SIL Open Font License. three.js (MIT). GSAP (licença padrão GreenSock).
