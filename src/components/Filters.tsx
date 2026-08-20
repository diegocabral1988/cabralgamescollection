"use client";

import { DB } from "@/data/consoles";

export interface FilterState {
  search: string;
  brand: string;
  family: string;
  decade: string;
  type: string;
  status: string;
}

export const initialFilters: FilterState = {
  search: "",
  brand: "all",
  family: "all",
  decade: "all",
  type: "all",
  status: "all",
};

export default function Filters({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}) {
  const brands = [...new Set(DB.map((c) => c.brand))].sort();
  // só famílias com mais de um modelo — as linhagens que se dividem em variantes
  const counts = new Map<string, number>();
  DB.forEach((c) => c.family && counts.set(c.family, (counts.get(c.family) ?? 0) + 1));
  const families = [...counts.entries()].filter(([, n]) => n > 1).map(([f]) => f).sort();
  const set = (k: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...filters, [k]: e.target.value });

  return (
    <div className="filters">
      <input
        type="search"
        placeholder="BUSCAR CONSOLE"
        aria-label="Buscar console"
        value={filters.search}
        onChange={set("search")}
      />
      <select aria-label="Marca" value={filters.brand} onChange={set("brand")}>
        <option value="all">Todas as marcas</option>
        {brands.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <select aria-label="Família" value={filters.family} onChange={set("family")}>
        <option value="all">Todas as famílias</option>
        {families.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      <select aria-label="Década" value={filters.decade} onChange={set("decade")}>
        <option value="all">Todas as décadas</option>
        <option value="1970">Anos 1970</option>
        <option value="1980">Anos 1980</option>
        <option value="1990">Anos 1990</option>
        <option value="2000">Anos 2000</option>
        <option value="2010">Anos 2010</option>
        <option value="2020">Anos 2020</option>
      </select>
      <select aria-label="Tipo" value={filters.type} onChange={set("type")}>
        <option value="all">Todos os tipos</option>
        <option value="Mesa">Console de mesa</option>
        <option value="Portátil">Portátil</option>
        <option value="Add-on">Add-on / Periférico</option>
        <option value="Híbrido">Híbrido (mesa + portátil)</option>
      </select>
      <select aria-label="Status" value={filters.status} onChange={set("status")}>
        <option value="all">Qualquer status</option>
        <option value="owned">Com compras</option>
        <option value="quoted">Cotados</option>
        <option value="none">Sem cotação</option>
        <option value="fav">Favoritos do Cabral</option>
        <option value="wall">Projeto parede PlayStation</option>
      </select>
    </div>
  );
}
