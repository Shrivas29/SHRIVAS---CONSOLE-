"use client";

// The beige CRT computer the whole site lives inside. The desk fills the
// viewport (clay); the monitor is centred; children render on the glass.
export default function Monitor({ children }: { children: React.ReactNode }) {
  return (
    <div className="desk">
      <div className="monitor">
        <div className="monitor-screen">{children}</div>
        <div aria-hidden="true" className="monitor-chin">
          <span className="monitor-brand font-segment">SHRIVAS PS</span>
          <span className="monitor-vents" />
          <span className="monitor-led" />
        </div>
      </div>
    </div>
  );
}
