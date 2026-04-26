// SecretDesk mark — variant C "side-pane" from the canvas.
// Architectural tile: thin sidebar strip with one accent row, content
// area with a placeholder line and an underline cursor.

export function IconMark({ size = 22 }: { size?: number }) {
  return (
    <div
      className="relative shrink-0 overflow-hidden bg-panel"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        border: "0.5px solid var(--color-border)",
      }}
    >
      <span
        className="absolute bg-faint"
        style={{
          top: size * 0.16,
          bottom: size * 0.16,
          left: size * 0.16,
          width: size * 0.18,
          borderRadius: size * 0.04,
        }}
      />
      <span
        className="absolute bg-accent"
        style={{
          top: size * 0.22,
          left: size * 0.18,
          width: size * 0.14,
          height: size * 0.06,
          borderRadius: size * 0.02,
        }}
      />
      <span
        className="absolute bg-faint"
        style={{
          top: size * 0.24,
          left: size * 0.40,
          width: size * 0.36,
          height: size * 0.05,
          borderRadius: size * 0.015,
        }}
      />
      <span
        className="absolute bg-faint"
        style={{
          top: size * 0.38,
          left: size * 0.40,
          width: size * 0.26,
          height: size * 0.05,
          borderRadius: size * 0.015,
        }}
      />
      <span
        className="absolute bg-accent"
        style={{
          bottom: size * 0.30,
          left: size * 0.40,
          width: size * 0.18,
          height: size * 0.06,
          borderRadius: size * 0.015,
        }}
      />
    </div>
  );
}
