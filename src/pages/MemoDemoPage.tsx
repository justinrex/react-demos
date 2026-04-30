import { useState } from "react";

const initialItems = [
  "Render list",
  "Type in search",
  "Toggle highlight",
  "Observe updates"
];

export function MemoDemoPage() {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(false);

  const filteredItems = initialItems.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section className="page">
      <div className="page-header">
        <p className="eyebrow">Memo Demo</p>
        <h2>Use this page for render and filtering experiments.</h2>
      </div>

      <div className="control-row">
        <label className="field">
          Search
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={highlight}
            onChange={() => setHighlight((value) => !value)}
          />
          Highlight results
        </label>
      </div>

      <ul className="list">
        {filteredItems.map((item) => (
          <li key={item} className={highlight ? "list-item list-item-highlight" : "list-item"}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
