// Projetos de exposição do acervo: a parede dos PlayStation e os quadros
// shadow box (consoles/controles desmontados). Estes dados são estáticos —
// a coleção em si (cotações, compras, acessórios) continua no banco.

export interface WallPanel {
  /** Console correspondente no catálogo (DB.id). */
  consoleId: string;
  /** Rótulo pintado/recortado no painel. */
  label: string;
  /** Ordem na parede, de cima para baixo. */
  order: number;
  size: string;
  note: string;
  /** Forma do console desenhada no painel. */
  shape: "ps1" | "ps2" | "ps3" | "ps4";
}

/** Painéis da parede, de cima para baixo — como na foto de referência. */
export const WALL: WallPanel[] = [
  { consoleId: "ps1", shape: "ps1", label: "PS", order: 1, size: "60 × 30 cm", note: "Logo PlayStation clássico em preto + console cinza e controle digital." },
  { consoleId: "ps2", shape: "ps2", label: "PS2", order: 2, size: "70 × 35 cm", note: "PS2 FAT na vertical com DualShock 2 no suporte inferior." },
  { consoleId: "ps3", shape: "ps3", label: "PS3", order: 3, size: "80 × 40 cm", note: "PS3 Slim deitado — é o painel mais largo da sequência." },
  { consoleId: "ps4", shape: "ps4", label: "PS4", order: 4, size: "80 × 40 cm", note: "PS4 FAT com DualShock 4; deixe folga para passar o cabo HDMI." },
  { consoleId: "ps5", shape: "ps4", label: "PS5", order: 5, size: "90 × 45 cm", note: "Expansão futura da parede — o painel maior, embaixo ou ao lado." },
];

/** Materiais e cuidados comuns a todos os painéis. */
export const WALL_MATERIALS = [
  "MDF branco 15 mm (um painel por console)",
  "Fita de borda branca para os cantos",
  "Vinil recortado / stencil do logo de cada geração",
  "Suporte de parede para console (aço dobrado ou acrílico)",
  "Suporte de controle (gancho em L)",
  "Buchas, parafusos e nível a laser",
  "Canaleta branca para esconder fonte e HDMI",
  "Régua de tomadas atrás do painel de baixo",
];

export interface FrameProject {
  id: string;
  title: string;
  /** Console correspondente no catálogo, quando existir. */
  consoleId?: string;
  subtitle: string;
  frame: string;
  /** Peça que precisa ser comprada — normalmente quebrada/para peças. */
  donor: string;
  /** Faixa de preço realista da peça doadora no mercado brasileiro. */
  budget: string;
  /** Etapas do quadro, do desmonte à moldura. */
  steps: string[];
}

/**
 * Quadros shadow box: a peça é desmontada e cada componente é fixado sobre o
 * fundo impresso com as legendas. Como a peça nunca mais liga, o alvo de compra
 * é sempre uma unidade quebrada / "para retirada de peças" — bem mais barata.
 */
export const FRAMES: FrameProject[] = [
  {
    id: "frame-gbp",
    title: "Game Boy Pocket desmontado",
    consoleId: "gbpocket",
    subtitle: "Carcaça, placa, alto-falante, borrachas e tampa de pilhas separados sobre o fundo técnico.",
    frame: "Moldura preta 30 × 30 cm, profundidade 3 cm",
    donor: "Game Boy Pocket com tela morta ou sem imagem (para peças)",
    budget: "R$ 120 – 250",
    steps: [
      "Comprar unidade quebrada — tela com linhas ou sem vídeo serve, desde que a carcaça esteja inteira",
      "Abrir com chave tri-wing 3.8 mm e separar todas as peças",
      "Lavar carcaça e borrachas com água morna e sabão neutro; secar 24 h",
      "Imprimir o fundo A4/30 cm com as legendas (CPU, main board, battery cover...)",
      "Fixar peças com fita dupla-face 3M VHB fina ou cola quente em ponto único",
      "Deixar o cartucho de Tetris à mostra no canto como assinatura",
    ],
  },
  {
    id: "frame-ps1-ctrl",
    title: "Controle PS1 desmontado",
    consoleId: "ps1",
    subtitle: "Controle digital cinza aberto: shell, botões, borrachas condutivas, placa e Memory Card.",
    frame: "Moldura branca 33 × 33 cm, profundidade 3 cm",
    donor: "Controle PS1 sem funcionar + Memory Card avulso",
    budget: "R$ 60 – 130",
    steps: [
      "Comprar controle com cabo cortado ou botão morto (o mais barato do lote)",
      "Desmontar com Phillips PH00 e separar shell, botões, borrachas e placa",
      "Fundo branco com logo PlayStation colorido e 'INTRODUCED · 1994'",
      "Posicionar L1/L2 e R1/R2 nos cantos superiores, placa embaixo",
      "Memory Card centralizado acima do controle",
    ],
  },
  {
    id: "frame-ps4-ctrl",
    title: "DualShock 4 desmontado",
    consoleId: "ps4",
    subtitle: "Shell preto, analógicos, motores de vibração, touchpad, alto-falante e placa-mãe.",
    frame: "Moldura branca 33 × 33 cm, profundidade 4 cm",
    donor: "DualShock 4 com drift ou bateria estufada (para peças)",
    budget: "R$ 80 – 160",
    steps: [
      "Comprar controle com drift — o defeito mais comum e o mais barato",
      "Retirar e descartar a bateria de lítio com segurança (nunca vai para o quadro)",
      "Separar motores esquerdo/direito, gatilhos, borrachas e touchpad",
      "Fundo com legendas 'VIBRATION MOTOR', 'BODY SHELL', 'MOTHERBOARD'",
      "Profundidade de 4 cm é obrigatória: o shell do DS4 é alto",
    ],
  },
  {
    id: "frame-ps5-ctrl",
    title: "DualSense desmontado",
    consoleId: "ps5",
    subtitle: "Peça mais complexa: duas placas laterais, motores hápticos, gatilhos adaptativos e shell branco.",
    frame: "Moldura preta 35 × 35 cm, profundidade 4 cm",
    donor: "DualSense com drift ou gatilho adaptativo travado",
    budget: "R$ 150 – 300",
    steps: [
      "Comprar DualSense com drift ou L2/R2 travado (defeito clássico)",
      "Separar L board e R board — elas ficam simétricas no topo do quadro",
      "Motores hápticos e engrenagens dos gatilhos viram destaque lateral",
      "Fundo claro com o padrão de símbolos PlayStation em marca d'água",
      "Fecha a sequência ao lado do painel PS5 na parede",
    ],
  },
];

export const framesBudgetLabel = "R$ 410 – 840 no total (peças doadoras)";
