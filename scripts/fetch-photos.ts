// Baixa uma foto por console do Wikimedia Commons e registra crédito e licença.
//
// Uso: node --experimental-strip-types scripts/fetch-photos.ts
//
// As imagens vão para public/consoles/<id>.jpg|png e os créditos para
// src/data/photos.json, que o catálogo lê para preencher `photo` e
// `photoCredit` de cada console. Só entram arquivos com licença livre
// (domínio público, CC0, CC BY ou CC BY-SA); qualquer outra é recusada e
// listada como pendente no fim da execução.
//
// Requer acesso de rede a commons.wikimedia.org e upload.wikimedia.org.

import { mkdir, writeFile } from "node:fs/promises";

/** Arquivo do Commons escolhido para cada console do catálogo. */
const SOURCES: Record<string, string> = {
  odyssey: "Magnavox-Odyssey-Console-Set.jpg",
  pong: "Atari-Pong-Console.jpg",
  channelf: "Fairchild-Channel-F-Console-Set.jpg",
  atari2600: "Atari-2600-Wood-4Sw-Set.jpg",
  odyssey2: "Magnavox-Odyssey-2-Console-Set.jpg",
  intellivision: "Intellivision-Console-Set.jpg",
  "game-watch": "Game-and-Watch-Octopus.jpg",
  colecovision: "ColecoVision-wController-L.jpg",
  vectrex: "Vectrex-Console-Set.jpg",
  atari5200: "Atari-5200-4-Port-wController-L.jpg",
  sg1000: "Sega-SG-1000-Console-Set.jpg",
  famicom: "Nintendo-Famicom-Console-Set-FL.jpg",
  nes: "NES-Console-Set.jpg",
  fds: "Nintendo-Famicom-Disk-System.jpg",
  nestop: "NES-101-Console-Set.jpg",
  ms1: "Sega-Master-System-Set.jpg",
  ms2: "Sega-Master-System-II-Set.jpg",
  atari7800: "Atari-7800-Console-Set.jpg",
  turbografx: "TurboGrafx16-Console-Set.jpg",
  md1: "Sega-Genesis-Mk1-6button.jpg",
  md2: "Sega-Genesis-Mod2-Set.jpg",
  gameboy: "Game-Boy-FL.jpg",
  lynx: "Atari-Lynx-I-Handheld.jpg",
  snes: "SNES-Mod1-Console-Set.jpg",
  gamegear: "Sega-Game-Gear-WB.jpg",
  neogeo: "Neo-Geo-AES-Console-Set.jpg",
  nomad: "Sega-Nomad-Handheld.jpg",
  segacd: "Sega-CD-Model1-Set.jpg",
  cdi: "Philips-CDi-450-Console-Set.jpg",
  "3do": "3DO-FZ1-Console-Set.jpg",
  jaguar: "Atari-Jaguar-Console-Set.jpg",
  cd32: "Amiga-CD32-Console-Set.jpg",
  "32x": "Sega-32X-Set.jpg",
  saturn: "Sega-Saturn-Console-Set.jpg",
  neogeocd: "Neo-Geo-CD-Console-Set.jpg",
  ps1: "PSX-Console-wController.jpg",
  psone: "PSone-Console-Set.jpg",
  virtualboy: "Virtual-Boy-Set.jpg",
  n64: "N64-Console-Set.jpg",
  n64dd: "Nintendo-64DD.jpg",
  jaguarcd: "Atari-Jaguar-CD-Attached.jpg",
  gbpocket: "Game-Boy-Pocket.jpg",
  pippin: "Apple-Bandai-Pippin-Console-Set.jpg",
  gbcolor: "Game-Boy-Color.jpg",
  gblight: "Game-Boy-Light.jpg",
  dreamcast: "Dreamcast-Console-Set.jpg",
  ngpc: "Neo-Geo-Pocket-Color.jpg",
  wonderswan: "WonderSwan-Color.jpg",
  ps2: "PS2-Fat-Console-Set.jpg",
  ps2slim: "PS2-Slim-Console-Set.jpg",
  gba: "Nintendo-Game-Boy-Advance-Purple-FL.jpg",
  gamecube: "GameCube-Console-Set.jpg",
  xbox: "Xbox-Console-Set.jpg",
  gbasp: "Nintendo-Game-Boy-Advance-SP-Mk1.jpg",
  ngage: "Nokia-NGage-LL.jpg",
  ds: "Nintendo-DS-Fat-Blue.jpg",
  psp: "PSP-1000.jpg",
  gbmicro: "Nintendo-Game-Boy-Micro.jpg",
  x360: "Xbox-360-Pro-wController.jpg",
  wii: "Wii-Console.png",
  dslite: "Nintendo-DS-Lite-Black.jpg",
  ps3: "Sony-PlayStation-3-CECHA01.jpg",
  dsi: "Nintendo-DSi-Black.jpg",
  pspgo: "Sony-PSP-Go.jpg",
  ps3slim: "Sony-PlayStation-3-Slim.jpg",
  zeebo: "Zeebo-Console.jpg",
  msevolution: "Master-System-Evolution.jpg",
  x360slim: "Xbox-360-S-Console-Set.jpg",
  n3ds: "Nintendo-3DS-AquaOpen.jpg",
  psvita: "PlayStation-Vita-1101-FL.jpg",
  wiiu: "Wii-U-Console-and-Gamepad.png",
  ps3superslim: "Sony-PlayStation-3-Super-Slim.jpg",
  ps4: "PS4-Console-Set.jpg",
  n2ds: "Nintendo-2DS.jpg",
  xboxone: "Xbox-One-Console-Set.jpg",
  new3ds: "New-Nintendo-3DS.jpg",
  ps4slim: "PS4-Slim-Console.jpg",
  ps4pro: "PS4-Pro-Console.jpg",
  xboxones: "Xbox-One-S-Console-Set.jpg",
  switch: "Nintendo-Switch-Console-Docked.jpg",
  xboxonex: "Xbox-One-X-Console.jpg",
  switchlite: "Nintendo-Switch-Lite-Yellow.jpg",
  ps5: "PlayStation-5-Console.jpg",
  ps5digital: "PlayStation-5-Digital-Edition.jpg",
  xbseriesx: "Xbox-Series-X-Console.jpg",
  xbseriess: "Xbox-Series-S-Console.jpg",
  switcholed: "Nintendo-Switch-OLED.jpg",
  md3: "Mega-Drive-3-Tectoy.jpg",
  ms3: "Master-System-III-Compact.jpg",
  switch2: "Nintendo-Switch-2.jpg",
};

const FREE = [/public domain/i, /^cc0/i, /^cc[ -]by/i];

const api = "https://commons.wikimedia.org/w/api.php";
const out: Record<string, { photo: string; photoCredit: string }> = {};
const pending: string[] = [];

await mkdir("public/consoles", { recursive: true });

for (const [id, file] of Object.entries(SOURCES)) {
  const url =
    `${api}?action=query&prop=imageinfo&titles=${encodeURIComponent(`File:${file}`)}` +
    `&iiprop=url|extmetadata&iiurlwidth=800&format=json`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "CabralGamesCollection/1.0" } });
    const json = (await res.json()) as {
      query?: { pages?: Record<string, { imageinfo?: Record<string, unknown>[] }> };
    };
    const page = Object.values(json.query?.pages ?? {})[0];
    const info = page?.imageinfo?.[0] as
      | { url: string; thumburl?: string; extmetadata?: Record<string, { value?: string }> }
      | undefined;
    if (!info) {
      pending.push(`${id}: arquivo não encontrado no Commons (${file})`);
      continue;
    }
    const license = info.extmetadata?.LicenseShortName?.value ?? "desconhecida";
    if (!FREE.some((re) => re.test(license))) {
      pending.push(`${id}: licença não aceita (${license})`);
      continue;
    }
    const artist = (info.extmetadata?.Artist?.value ?? "autor não identificado")
      .replace(/<[^>]+>/g, "")
      .trim();
    const src = info.thumburl ?? info.url;
    const img = await fetch(src);
    if (!img.ok) {
      pending.push(`${id}: falha ao baixar (HTTP ${img.status})`);
      continue;
    }
    const ext = src.toLowerCase().endsWith(".png") ? "png" : "jpg";
    await writeFile(`public/consoles/${id}.${ext}`, Buffer.from(await img.arrayBuffer()));
    out[id] = {
      photo: `/consoles/${id}.${ext}`,
      photoCredit: `Foto: ${artist} · ${license} · Wikimedia Commons`,
    };
    console.log(`ok  ${id} — ${license}`);
  } catch (e) {
    pending.push(`${id}: ${e instanceof Error ? e.message : String(e)}`);
  }
}

await writeFile("src/data/photos.json", JSON.stringify(out, null, 2) + "\n");
console.log(`\n${Object.keys(out).length} fotos salvas em public/consoles.`);
if (pending.length) {
  console.log(`\n${pending.length} pendentes — ajuste o nome do arquivo em SOURCES:`);
  pending.forEach((m) => console.log(`  - ${m}`));
}
