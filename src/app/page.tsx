import Console from "@/components/console/Console";

export default function Home() {
  return (
    <>
      <Console />
      {/* SEO / no-JS floor: server-rendered identity for crawlers and lynx die-hards */}
      <noscript>
        <div style={{ padding: "2rem", maxWidth: "40rem" }}>
          <h1>Shrivas VM</h1>
          <p>
            Founder, designer, developer. Runs ENTØ Studios. Coimbatore →
            Netherlands. This site is a playable console — turn JavaScript on
            to boot it.
          </p>
          <p>
            <a href="https://entostudios.com">entostudios.com</a> ·{" "}
            <a href="mailto:shrivasvm@gmail.com">shrivasvm@gmail.com</a>
          </p>
        </div>
      </noscript>
    </>
  );
}
