"use client";

import { DB } from "@/data/consoles";

export interface FilterState {
  search: string;
  brand: string;
  decade: string;
  type: string;
  status: string;
}

export const initialFilters: FilterState = {
  search: "",
  brand: "all",
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
        <option value="Híbrido">Micro/Híbrido</option>
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
