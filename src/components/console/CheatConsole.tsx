"use client";

import { useEffect, useRef, useState } from "react";
import { useOS, WIDGET_IDS, type WidgetId } from "@/store/os";
import { playSound } from "@/lib/sound";

type CheatConsoleProps = {
  onClose: () => void;
  onDegauss: () => void;
  onVoid: () => void;
};

const OPENABLE = new Set<string>(WIDGET_IDS);

export default function CheatConsole({ onClose, onDegauss, onVoid }: CheatConsoleProps) {
  const [log, setLog] = useState<string[]>([
    "SHRIVAS PS SHELL — type HELP",
  ]);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const { openWindow, closeAllWindows, config } = useOS();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight);
  }, [log]);

  const say = (...lines: string[]) => setLog((l) => [...l, ...lines]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    say(`> ${raw.trim()}`);
    playSound("click", config.audio);

    if (cmd === "help") {
      say(
        "COMMANDS: STORY · ENTO · MUSIC · STATS · CONTACT",
        "ALSO: HIRE · EJECT · DEGAUSS · VOID · CLEAR · EXIT",
        "SOME COMMANDS ARE NOT LISTED. OBVIOUSLY.",
      );
    } else if (OPENABLE.has(cmd)) {
      openWindow(cmd as WidgetId);
      say(`INSERTING ${cmd.toUpperCase()} CARTRIDGE…`);
    } else if (cmd === "hire" || cmd === "hire me" || cmd === "contact me") {
      openWindow("contact");
      say("SMART MOVE. OPENING LINK CABLES…");
    } else if (cmd === "eject") {
      closeAllWindows();
      say("ALL CARTRIDGES EJECTED. RUDE, BUT OKAY.");
    } else if (cmd === "degauss") {
      onDegauss();
      say("DEGAUSSING…");
    } else if (cmd === "void") {
      onVoid();
      say("OPENING THE VOID. DON'T STAY LONG.");
    } else if (cmd === "clear") {
      setLog([]);
    } else if (cmd === "exit" || cmd === "quit") {
      onClose();
    } else if (cmd.startsWith("sudo")) {
      say("NICE TRY. THIS MACHINE HAS ONE OWNER.");
    } else if (cmd === "konami") {
      say("UP UP DOWN DOWN… YOU KNOW THE REST. ON THE DESKTOP, NOT HERE.");
    } else if (cmd === "shrivas") {
      say("THAT'S THE WHOLE CONSOLE. TRY STORY.");
    } else {
      say(`UNKNOWN CARTRIDGE: "${cmd.toUpperCase()}". TYPE HELP.`);
    }
  };

  return (
    <div
      role="dialog"
      aria-label="System shell"
      className="fixed inset-x-0 bottom-[5.75rem] z-[35] border-t-2 border-phosphor bg-black/95"
    >
      <div ref={logRef} className="max-h-40 overflow-y-auto px-4 pt-3">
        {log.map((line, idx) => (
          <p
            key={idx}
            className={`font-dot text-xs leading-relaxed tracking-[0.15em] ${line.startsWith(">") ? "text-ink" : "text-phosphor"}`}
          >
            {line}
          </p>
        ))}
      </div>
      <div className="flex items-center gap-2 px-4 pb-3 pt-1">
        <span aria-hidden="true" className="font-dot text-xs text-phosphor">
          &gt;
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") {
              run(value);
              setValue("");
            } else if (e.key === "Escape") {
              onClose();
            }
          }}
          aria-label="Shell command"
          autoComplete="off"
          spellCheck={false}
          className="font-dot w-full bg-transparent text-sm tracking-[0.15em] text-ink
            caret-[oklch(0.82_0.14_200)] outline-none placeholder:text-phosphor-dim"
          placeholder="type a command…"
        />
      </div>
    </div>
  );
}
