# cabralgamescollection
## Fotos dos consoles

O catálogo aceita uma foto por console em `public/consoles/<id>.jpg`, registrada
em `src/data/photos.json` com autor e licença. Para baixá-las do Wikimedia
Commons:

```
node --experimental-strip-types scripts/fetch-photos.ts
```

Enquanto uma foto não existe, o card desenha o formato físico do aparelho na cor
do fabricante. Veja `public/consoles/README.md` para detalhes de licença.
