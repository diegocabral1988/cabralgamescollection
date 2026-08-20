# Fotos dos consoles

As fotos ficam aqui, uma por console, com o nome igual ao id do catálogo
(`ms1.jpg`, `ps2.jpg`, `switch.jpg`...). Elas entram no site por
`src/data/photos.json`, que guarda o caminho e o crédito de cada imagem.

## Como baixar

```
node --experimental-strip-types scripts/fetch-photos.ts
```

O script busca cada console no Wikimedia Commons, aceita apenas imagens de
domínio público, CC0 ou CC BY/CC BY-SA, salva a versão de 800 px aqui e grava
autor e licença em `src/data/photos.json`. No fim ele lista o que não conseguiu
baixar, para você ajustar o nome do arquivo no mapa `SOURCES`.

Sem fotos, o catálogo desenha o formato de cada aparelho — de mesa, portátil,
de concha, torre, add-on — na cor do fabricante. Nada quebra enquanto as fotos
não chegam.

## Crédito é obrigatório

As licenças CC BY e CC BY-SA exigem crédito ao autor. O site mostra a linha de
crédito abaixo da foto na ficha do console; não remova esse campo ao editar
`photos.json` à mão.
