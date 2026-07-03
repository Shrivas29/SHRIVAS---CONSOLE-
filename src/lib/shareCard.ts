// Render the visitor's run as a phosphor-styled "save file" image
// (1080×1920, Instagram-story sized) and hand it to share/download.
import { ACHIEVEMENTS, type AchievementId } from "@/store/achievements";

type SaveData = {
  playedCount: number;
  totalCartridges: number;
  unlocked: Partial<Record<AchievementId, boolean>>;
};

const CYAN = "#63e7f0";
const CYAN_DIM = "#3d7a85";
const YELLOW = "#f2d94e";
const BG = "#0b1013";

export async function exportSaveCard(data: SaveData): Promise<void> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // make sure the display faces are ready before drawing
  await Promise.all([
    document.fonts.load('90px "Segment"'),
    document.fonts.load('34px "DotGothic16"'),
  ]).catch(() => {});

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // frame
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 6;
  ctx.strokeRect(48, 48, W - 96, H - 96);

  ctx.fillStyle = CYAN_DIM;
  ctx.font = '30px "DotGothic16", monospace';
  ctx.fillText("シュリヴァスPS SAVE FILE", 110, 190);

  ctx.fillStyle = CYAN;
  ctx.font = '104px "Segment", monospace';
  ctx.fillText("SHRIVAS PS", 104, 310);

  // divider
  ctx.fillStyle = CYAN_DIM;
  ctx.fillRect(110, 380, W - 220, 3);

  // stats
  ctx.font = '34px "DotGothic16", monospace';
  ctx.fillStyle = CYAN;
  ctx.fillText("CARTRIDGES EXPLORED", 110, 490);
  ctx.fillStyle = "#ffffff";
  ctx.font = '150px "Segment", monospace';
  ctx.fillText(`${data.playedCount}/${data.totalCartridges}`, 110, 660);

  // achievements
  ctx.font = '34px "DotGothic16", monospace';
  ctx.fillStyle = CYAN;
  ctx.fillText("ACHIEVEMENTS", 110, 800);
  let y = 880;
  for (const [id, label] of Object.entries(ACHIEVEMENTS)) {
    const got = !!data.unlocked[id as AchievementId];
    ctx.fillStyle = got ? YELLOW : CYAN_DIM;
    ctx.font = '40px "DotGothic16", monospace';
    ctx.fillText(`${got ? "★" : "・"} ${got ? label : "????????"}`, 110, y);
    y += 78;
  }

  // timestamp + handle
  const stamp = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  ctx.fillStyle = CYAN_DIM;
  ctx.font = '30px "DotGothic16", monospace';
  ctx.fillText(`SAVED ${stamp.toUpperCase()}`, 110, 1600);
  ctx.fillStyle = YELLOW;
  ctx.font = '40px "DotGothic16", monospace';
  ctx.fillText("PLAY IT → @shrivas_66", 110, 1680);

  // scanlines
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  for (let sy = 0; sy < H; sy += 4) ctx.fillRect(0, sy, W, 2);

  const blob: Blob | null = await new Promise((res) =>
    canvas.toBlob(res, "image/png"),
  );
  if (!blob) return;
  const file = new File([blob], "shrivas-ps-save.png", { type: "image/png" });

  // native share sheet where it exists (mobile); download elsewhere
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "SHRIVAS PS save file" });
      return;
    } catch {
      /* fall through to download */
    }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "shrivas-ps-save.png";
  a.click();
  URL.revokeObjectURL(a.href);
}
