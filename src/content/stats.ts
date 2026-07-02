export type Stat = { label: string; value: string; meter?: number };

export const character = {
  name: "SHRIVAS VM",
  className: "FOUNDER / DESIGNER / DEV",
  level: "LVL 17",
  stats: [
    { label: "SHIPPING", value: "██████████", meter: 10 },
    { label: "TYPOGRAPHY", value: "████████──", meter: 8 },
    { label: "SLEEP SCHEDULE", value: "███───────", meter: 3 },
    { label: "TEMPLATE RESISTANCE", value: "██████████", meter: 10 },
  ] satisfies Stat[],
  inventory: ["1 studio (ENTØ)", "1 one-way ticket (NL)", "∞ browser tabs"],
  saveFile: "COIMBATORE → AMSTERDAM",
};
