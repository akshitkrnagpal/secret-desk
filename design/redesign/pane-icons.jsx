// pane-icons.jsx — three icon variants for the Pane direction
// All are flat, scale to 32px, work on light + dark, and ride the active accent.

function PaneIconA({ size = 56, dark = false, accent = '#C05037' }) {
  // "Stacked panes" — two offset rounded rectangles suggesting key/value
  const tileBg = dark ? '#16161B' : '#FCFCFA';
  const muted = dark ? 'rgba(237,234,227,0.55)' : 'rgba(21,19,15,0.55)';
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: tileBg,
      border: `0.5px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(20,15,10,0.10)'}`,
      boxShadow: dark ? 'inset 0 0.5px 0 rgba(255,255,255,0.04)' : '0 1px 2px rgba(20,15,10,0.06), 0 0.5px 0 rgba(255,255,255,0.6) inset',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 32 32" fill="none">
        <rect x="3" y="7" width="18" height="6" rx="1.5" stroke={muted} strokeWidth="1.4"/>
        <rect x="11" y="19" width="18" height="6" rx="1.5" fill={accent}/>
        <circle cx="6.5" cy="10" r="1.1" fill={muted}/>
        <circle cx="14.5" cy="22" r="1.1" fill="#fff"/>
      </svg>
    </div>
  );
}

function PaneIconB({ size = 56, dark = false, accent = '#C05037' }) {
  // "Asterisk-as-key" — bold mono asterisk, a single redacted dot
  const tileBg = dark ? '#16161B' : '#FCFCFA';
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: tileBg, position: 'relative',
      border: `0.5px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(20,15,10,0.10)'}`,
      boxShadow: dark ? 'inset 0 0.5px 0 rgba(255,255,255,0.04)' : '0 1px 2px rgba(20,15,10,0.06), 0 0.5px 0 rgba(255,255,255,0.6) inset',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: '"JetBrains Mono", ui-monospace, Menlo, monospace',
        fontSize: size * 0.62, color: accent, fontWeight: 700,
        lineHeight: 1, marginTop: -size * 0.06,
      }}>∗</div>
      <div style={{
        position: 'absolute', right: size * 0.18, bottom: size * 0.18,
        width: size * 0.10, height: size * 0.10, borderRadius: '50%',
        background: dark ? 'rgba(237,234,227,0.45)' : 'rgba(21,19,15,0.40)',
      }} />
    </div>
  );
}

function PaneIconC({ size = 56, dark = false, accent = '#C05037' }) {
  // "Side-pane" — a tile divided into a thin sidebar + content area;
  // an underscore cursor sits in the content. Architectural and on-message.
  const tileBg = dark ? '#16161B' : '#FCFCFA';
  const muted = dark ? 'rgba(237,234,227,0.18)' : 'rgba(21,19,15,0.10)';
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: tileBg, position: 'relative', overflow: 'hidden',
      border: `0.5px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(20,15,10,0.10)'}`,
      boxShadow: dark ? 'inset 0 0.5px 0 rgba(255,255,255,0.04)' : '0 1px 2px rgba(20,15,10,0.06), 0 0.5px 0 rgba(255,255,255,0.6) inset',
    }}>
      {/* sidebar strip */}
      <div style={{
        position: 'absolute', top: size * 0.16, bottom: size * 0.16,
        left: size * 0.16, width: size * 0.18, borderRadius: size * 0.04,
        background: muted,
      }} />
      {/* one highlighted row in sidebar */}
      <div style={{
        position: 'absolute', top: size * 0.22, left: size * 0.18,
        width: size * 0.14, height: size * 0.06, borderRadius: size * 0.02,
        background: accent,
      }} />
      {/* content area underline cursor */}
      <div style={{
        position: 'absolute', bottom: size * 0.30, left: size * 0.40,
        width: size * 0.18, height: size * 0.06, borderRadius: size * 0.015,
        background: accent,
      }} />
      {/* content area top line (placeholder) */}
      <div style={{
        position: 'absolute', top: size * 0.24, left: size * 0.40,
        width: size * 0.36, height: size * 0.05, borderRadius: size * 0.015,
        background: muted,
      }} />
      <div style={{
        position: 'absolute', top: size * 0.38, left: size * 0.40,
        width: size * 0.26, height: size * 0.05, borderRadius: size * 0.015,
        background: muted,
      }} />
    </div>
  );
}

Object.assign(window, { PaneIconA, PaneIconB, PaneIconC });
