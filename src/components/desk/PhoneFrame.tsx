/**
 * Reusable iPhone-style device mockup.
 *
 * A pure CSS/HTML shell — no image asset, no Apple artwork — so screenshots can
 * be dropped in unedited and stay perfectly clipped by the screen's corners.
 * Every dimension derives from `--pw` (the device width) so the whole device
 * scales as one unit; the caller only chooses how wide it is allowed to get.
 *
 * Geometry follows a modern 6.1" iPhone: 19.5:9 screen, ~2.8% bezel, corner
 * radius ~14.5% of the device width (≈40px at the 280px default).
 */
export function PhoneFrame({
  children,
  maxWidth = "17.5rem",
  className = "",
  ...rest
}: {
  children: React.ReactNode
  /** Upper bound on the device width; it also shrinks to fit short viewports. */
  maxWidth?: string
  className?: string
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  return (
    <div
      className={`relative mx-auto max-w-full ${className}`}
      style={
        {
          // capped by: the caller's max, viewport height (short laptops), and
          // viewport width (so it clears the modal's ✕ on a phone)
          "--pw": `min(${maxWidth}, 32dvh, 62vw)`,
          width: "var(--pw)",
        } as React.CSSProperties
      }
      {...rest}
    >
      {/* Side buttons — drawn first so the shell paints over their inner edge */}
      <Button side="left" top="14.6%" height="3.4%" />
      <Button side="left" top="21.0%" height="5.6%" />
      <Button side="left" top="28.0%" height="5.6%" />
      <Button side="right" top="22.6%" height="8.6%" />

      {/* Shell — the near-black band, with a hairline polished-metal edge */}
      <div
        className="relative"
        style={{
          padding: "calc(var(--pw) * 0.028)",
          borderRadius: "calc(var(--pw) * 0.145)",
          background: "linear-gradient(150deg, #3a3a40 0%, #17171a 22%, #101013 52%, #1d1d21 78%, #45454c 100%)",
          boxShadow: [
            "inset 0 0 0 1px rgba(255,255,255,0.14)",
            "0 30px 60px -26px rgba(28,20,8,0.55)",
            "0 12px 26px -14px rgba(28,20,8,0.35)",
          ].join(", "),
        }}
      >
        {/* Screen — everything inside is clipped to the concentric radius */}
        <div
          className="relative overflow-hidden bg-black"
          style={{
            aspectRatio: "1170 / 2532",
            borderRadius: "calc(var(--pw) * 0.117)",
          }}
        >
          {children}

          {/* Dynamic Island */}
          <div
            className="pointer-events-none absolute left-1/2 z-10 flex -translate-x-1/2 items-center justify-end bg-black"
            style={{
              top: "calc(var(--pw) * 0.028)",
              width: "calc(var(--pw) * 0.30)",
              height: "calc(var(--pw) * 0.085)",
              borderRadius: "999px",
              paddingRight: "calc(var(--pw) * 0.022)",
            }}
          >
            {/* camera lens */}
            <span
              className="rounded-full"
              style={{
                width: "calc(var(--pw) * 0.032)",
                height: "calc(var(--pw) * 0.032)",
                background: "radial-gradient(circle at 35% 30%, #33343c 0%, #14151a 60%, #0a0a0c 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Button({ side, top, height }: { side: "left" | "right"; top: string; height: string }) {
  return (
    <span
      aria-hidden
      className="absolute"
      style={{
        top,
        height,
        width: "calc(var(--pw) * 0.013)",
        [side]: "calc(var(--pw) * -0.009)",
        background: "linear-gradient(to bottom, #3a3a41, #1c1c20 45%, #303036)",
        borderRadius: side === "left" ? "2px 0 0 2px" : "0 2px 2px 0",
      }}
    />
  )
}
