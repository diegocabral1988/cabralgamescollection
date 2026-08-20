import { GameConsole } from "@/data/consoles";

/** Formato físico do aparelho — decide o desenho usado quando não há foto. */
export type DeviceForm =
  | "slab-disc"
  | "slab-cart"
  | "slab"
  | "tower"
  | "handheld"
  | "clamshell"
  | "tabletop"
  | "addon"
  | "hybrid";

/** Aparelhos cujo formato não sai do tipo — desenho escolhido a dedo. */
const OVERRIDES: Record<string, DeviceForm> = {
  odyssey: "slab",
  pong: "slab",
  vectrex: "tabletop",
  "game-watch": "tabletop",
  virtualboy: "tabletop",
  ps1: "slab-disc",
  psone: "slab-disc",
  ps2: "tower",
  ps2slim: "slab-disc",
  ps3: "slab-disc",
  ps3slim: "slab-disc",
  ps3superslim: "slab-disc",
  ps4: "slab-disc",
  ps4slim: "slab-disc",
  ps4pro: "slab-disc",
  ps5: "tower",
  ps5digital: "tower",
  xbseriesx: "tower",
  xbseriess: "tower",
  wii: "tower",
  wiiu: "slab-disc",
  gamecube: "slab-disc",
  xbox: "slab-disc",
  xboxone: "slab-disc",
  xboxones: "slab-disc",
  xboxonex: "slab-disc",
  x360: "slab-disc",
  x360slim: "slab-disc",
  dreamcast: "slab-disc",
  saturn: "slab-disc",
  segacd: "slab-disc",
  neogeocd: "slab-disc",
  cdi: "slab-disc",
  "3do": "slab-disc",
  cd32: "slab-disc",
  pippin: "slab-disc",
  zeebo: "slab-disc",
  switch: "hybrid",
  switcholed: "hybrid",
  switch2: "hybrid",
  gbasp: "clamshell",
  ds: "clamshell",
  dslite: "clamshell",
  dsi: "clamshell",
  n3ds: "clamshell",
  new3ds: "clamshell",
  n2ds: "handheld",
};

export function deviceForm(c: GameConsole): DeviceForm {
  const o = OVERRIDES[c.id];
  if (o) return o;
  if (c.type === "Add-on") return "addon";
  if (c.type === "Portátil") return "handheld";
  if (c.type === "Híbrido") return "hybrid";
  return "slab-cart";
}
