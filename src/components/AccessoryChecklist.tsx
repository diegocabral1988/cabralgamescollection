"use client";

import { CollectionState, GameConsole } from "@/data/consoles";
import { ownedSet } from "@/lib/collection";

export default function AccessoryChecklist({
  c,
  state,
  onToggle,
}: {
  c: GameConsole;
  state: CollectionState;
  onToggle: (index: number, owned: boolean) => void;
}) {
  const owned = ownedSet(state, c.id);
  const done = c.acc.filter((_, x) => owned.has(x)).length;
  const pct = Math.round((done / c.acc.length) * 100);

  return (
    <div className="msec">
      <span className="ml">
        <span className="n">03</span> Checklist de acessórios
      </span>
      <div className="pbar">
        <i style={{ width: `${pct}%` }} />
      </div>
      <p className="ptext">
        {pct}% — {done}/{c.acc.length}
      </p>
      <ul className="acclist">
        {c.acc.map((a, x) => {
          const chk = owned.has(x);
          const id = `acc_${c.id}_${x}`;
          return (
            <li key={x} className={chk ? "checked" : ""}>
              <input
                type="checkbox"
                id={id}
                checked={chk}
                onChange={(e) => onToggle(x, e.target.checked)}
              />
              <label htmlFor={id}>{a}</label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
