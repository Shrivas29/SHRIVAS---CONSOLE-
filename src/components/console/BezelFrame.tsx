"use client";

// The physical SHRIVAS PS console shell — a warm-plastic bezel wrapping the
// whole viewport (AWGE TV energy). Pure decoration; pointer-events: none.
export default function BezelFrame() {
  return (
    <div aria-hidden="true" className="bezel-frame">
      <span className="bezel-logo font-segment hidden sm:block">SHRIVAS PS</span>
      <span className="bezel-led" />
    </div>
  );
}
