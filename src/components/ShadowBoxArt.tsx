"use client";

/**
 * Pré-visualização dos quadros shadow box: a peça aberta sobre o fundo técnico,
 * com linhas de chamada e legendas — a mesma leitura das referências do projeto.
 * Cada quadro é um SVG próprio, sem imagem externa.
 */

interface PartProps {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  /** Ponto onde a legenda é escrita. */
  lx: number;
  ly: number;
  /** Cotovelo da linha de chamada. */
  mx?: number;
  my?: number;
  kind?: "shell" | "board" | "rubber" | "metal" | "dark";
  round?: boolean;
}

function Part({ x, y, w, h, label, lx, ly, mx, my, kind = "dark", round }: PartProps) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const elbowX = mx ?? lx;
  const elbowY = my ?? cy;
  const anchor = lx > 170 ? "end" : "start";
  return (
    <g className={`sb-part sb-${kind}`}>
      {round ? (
        <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} className="sb-fill" />
      ) : (
        <rect x={x} y={y} width={w} height={h} className="sb-fill" />
      )}
      <polyline points={`${cx},${cy} ${elbowX},${elbowY} ${lx},${ly}`} className="sb-lead" />
      <text x={lx} y={ly - 3} className="sb-label" textAnchor={anchor}>
        {label}
      </text>
    </g>
  );
}

/** Marca d'água de símbolos PlayStation ao fundo do quadro. */
function SymbolField() {
  return (
    <g className="sb-symbols" aria-hidden="true">
      {Array.from({ length: 7 }).map((_, row) =>
        Array.from({ length: 7 }).map((_, col) => {
          const x = 14 + col * 44;
          const y = 20 + row * 42;
          const i = (row + col) % 4;
          if (i === 0) return <circle key={`${row}-${col}`} cx={x} cy={y} r={5} />;
          if (i === 1) return <rect key={`${row}-${col}`} x={x - 4} y={y - 4} width={8} height={8} />;
          if (i === 2)
            return <polygon key={`${row}-${col}`} points={`${x},${y - 5} ${x + 5},${y + 4} ${x - 5},${y + 4}`} />;
          return (
            <g key={`${row}-${col}`}>
              <line x1={x - 4} y1={y - 4} x2={x + 4} y2={y + 4} />
              <line x1={x + 4} y1={y - 4} x2={x - 4} y2={y + 4} />
            </g>
          );
        })
      )}
    </g>
  );
}

function Board({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <svg viewBox="0 0 320 320" className={`sbox${dark ? " sbox-dark" : ""}`} role="img">
      <rect x="0" y="0" width="320" height="320" className="sb-frame" />
      <rect x="14" y="14" width="292" height="292" className="sb-board" />
      <SymbolField />
      {children}
    </svg>
  );
}

function GameBoyBox() {
  return (
    <Board dark>
      <text x="160" y="44" className="sb-title" textAnchor="middle">
        GAME BOY pocket
      </text>
      {/* carcaça frontal com tela */}
      <g className="sb-part sb-shell">
        <rect x="118" y="60" width="84" height="128" className="sb-fill" />
        <rect x="132" y="76" width="56" height="46" className="sb-screen" />
        <rect x="134" y="140" width="8" height="22" className="sb-fill-dark" />
        <rect x="126" y="147" width="24" height="8" className="sb-fill-dark" />
        <circle cx="178" cy="146" r="7" className="sb-fill-dark" />
        <circle cx="194" cy="140" r="7" className="sb-fill-dark" />
      </g>
      <Part x={36} y={70} w={22} h={22} label="D-PAD" lx={26} ly={108} kind="rubber" />
      <Part x={34} y={130} w={30} h={16} label="BORRACHAS" lx={24} ly={164} kind="rubber" />
      <Part x={40} y={190} w={46} h={26} label="TAMPA DE PILHAS" lx={24} ly={238} kind="shell" />
      <Part x={228} y={72} w={62} h={86} label="MAIN BOARD" lx={296} ly={60} kind="board" />
      <Part x={236} y={182} w={20} h={20} label="ALTO-FALANTE" lx={296} ly={228} kind="metal" round />
      <Part x={128} y={212} w={72} h={52} label="CARCAÇA TRASEIRA" lx={112} ly={288} kind="shell" />
      <Part x={270} y={196} w={14} h={14} label="CPU" lx={296} ly={248} kind="dark" />
    </Board>
  );
}

function Ps1PadBox() {
  return (
    <Board>
      <text x="160" y="44" className="sb-title" textAnchor="middle">
        PlayStation · 1994
      </text>
      {/* corpo do controle digital */}
      <g className="sb-part sb-shell">
        <rect x="96" y="150" width="128" height="42" className="sb-fill" />
        <rect x="84" y="176" width="34" height="62" className="sb-fill" />
        <rect x="202" y="176" width="34" height="62" className="sb-fill" />
        <rect x="118" y="176" width="84" height="26" className="sb-fill" />
        <rect x="118" y="160" width="22" height="22" className="sb-fill-dark" />
        <circle cx="192" cy="164" r="5" className="sb-fill-dark" />
        <circle cx="206" cy="176" r="5" className="sb-fill-dark" />
      </g>
      <Part x={40} y={86} w={40} h={16} label="L1 · L2" lx={30} ly={76} kind="dark" />
      <Part x={240} y={86} w={40} h={16} label="R1 · R2" lx={296} ly={76} kind="dark" />
      <Part x={40} y={140} w={30} h={30} label="DIRECIONAL" lx={26} ly={196} kind="rubber" />
      <Part x={140} y={92} w={34} h={28} label="MEMORY CARD" lx={196} ly={106} kind="shell" />
      <Part x={252} y={140} w={26} h={20} label="BORRACHAS" lx={296} ly={196} kind="rubber" />
      <Part x={104} y={248} w={112} h={30} label="PLACA-MÃE" lx={96} ly={300} kind="board" />
      <Part x={248} y={204} w={24} h={24} label="BOTÕES" lx={296} ly={252} kind="rubber" round />
    </Board>
  );
}

function Ds4Box() {
  return (
    <Board>
      <text x="160" y="44" className="sb-title" textAnchor="middle">
        PS4 · 2013
      </text>
      <g className="sb-part sb-dark">
        <rect x="92" y="150" width="136" height="46" className="sb-fill" />
        <rect x="78" y="180" width="38" height="66" className="sb-fill" />
        <rect x="204" y="180" width="38" height="66" className="sb-fill" />
        <rect x="116" y="180" width="88" height="28" className="sb-fill" />
        <rect x="134" y="156" width="52" height="20" className="sb-touch" />
      </g>
      <Part x={120} y={88} w={18} h={18} label="ANALÓGICO E" lx={96} ly={76} kind="dark" round />
      <Part x={182} y={88} w={18} h={18} label="ANALÓGICO D" lx={262} ly={72} kind="dark" round />
      <Part x={40} y={118} w={30} h={30} label="DIRECIONAL" lx={26} ly={170} kind="rubber" />
      <Part x={250} y={118} w={30} h={30} label="BOTÕES" lx={296} ly={170} kind="rubber" />
      <Part x={44} y={204} w={26} h={26} label="MOTOR ESQ." lx={26} ly={252} kind="metal" round />
      <Part x={250} y={204} w={26} h={26} label="MOTOR DIR." lx={296} ly={252} kind="metal" round />
      <Part x={118} y={256} w={84} h={30} label="PLACA-MÃE" lx={112} ly={304} kind="board" />
      <Part x={150} y={112} w={20} h={12} label="ALTO-FALANTE" lx={150} ly={132} kind="shell" />
    </Board>
  );
}

function DualSenseBox() {
  return (
    <Board dark>
      <text x="160" y="42" className="sb-title" textAnchor="middle">
        SONY
      </text>
      <text x="160" y="300" className="sb-title sb-title-sm" textAnchor="middle">
        PS5 · DUALSENSE
      </text>
      <g className="sb-part sb-shell">
        <rect x="92" y="176" width="136" height="48" className="sb-fill" />
        <rect x="78" y="206" width="38" height="62" className="sb-fill" />
        <rect x="204" y="206" width="38" height="62" className="sb-fill" />
        <rect x="116" y="206" width="88" height="28" className="sb-fill" />
        <rect x="140" y="182" width="40" height="16" className="sb-touch" />
      </g>
      <Part x={132} y={64} w={56} h={40} label="PLACA PRINCIPAL" lx={118} ly={58} kind="board" />
      <Part x={60} y={92} w={30} h={24} label="L BOARD" lx={42} ly={136} kind="board" />
      <Part x={230} y={92} w={30} h={24} label="R BOARD" lx={288} ly={136} kind="board" />
      <Part x={44} y={52} w={26} h={12} label="L1 · L2" lx={30} ly={44} kind="dark" />
      <Part x={250} y={52} w={26} h={12} label="R1 · R2" lx={296} ly={44} kind="dark" />
      <Part x={46} y={156} w={28} h={28} label="DIRECIONAL" lx={28} ly={204} kind="rubber" />
      <Part x={246} y={156} w={28} h={28} label="BOTÕES" lx={296} ly={204} kind="rubber" />
      <Part x={46} y={230} w={26} h={26} label="MOTOR HÁPTICO" lx={26} ly={278} kind="metal" round />
      <Part x={248} y={230} w={26} h={26} label="MOTOR HÁPTICO" lx={296} ly={278} kind="metal" round />
      <Part x={136} y={128} w={48} h={26} label="TOUCHPAD" lx={126} ly={122} kind="board" />
    </Board>
  );
}

export default function ShadowBoxArt({ id }: { id: string }) {
  if (id === "frame-gbp") return <GameBoyBox />;
  if (id === "frame-ps1-ctrl") return <Ps1PadBox />;
  if (id === "frame-ps4-ctrl") return <Ds4Box />;
  return <DualSenseBox />;
}
