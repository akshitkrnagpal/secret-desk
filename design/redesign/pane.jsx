// pane.jsx — Direction 3: "Pane" (chosen direction)
// Chromeless modern Electron. Three-pane layout. Single warm accent (configurable).

const paneTheme = (dark, accent = '#C05037') => {
  // Convert hex to rgba for soft variants
  const hex = accent.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const accentSoft = dark ? `rgba(${r},${g},${b},0.16)` : `rgba(${r},${g},${b},0.10)`;
  const accentLine = dark ? `rgba(${r},${g},${b},0.32)` : `rgba(${r},${g},${b},0.24)`;

  return {
    font: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    display: '"Inter Tight", "Inter", -apple-system, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',

    bg:        dark ? '#101014' : '#FCFCFA',
    panel:     dark ? '#16161B' : '#FFFFFF',
    panel2:    dark ? '#1B1B22' : '#F6F5F2',
    sidebar:   dark ? '#0C0C10' : '#F2F0EC',
    border:    dark ? 'rgba(255,255,255,0.07)' : 'rgba(20,15,10,0.08)',
    borderSoft:dark ? 'rgba(255,255,255,0.04)' : 'rgba(20,15,10,0.04)',
    fg:        dark ? '#EDEAE3' : '#15130F',
    fgMuted:   dark ? 'rgba(237,234,227,0.60)' : 'rgba(21,19,15,0.58)',
    fgFaint:   dark ? 'rgba(237,234,227,0.36)' : 'rgba(21,19,15,0.36)',
    selected:  dark ? `rgba(${r},${g},${b},0.10)` : `rgba(${r},${g},${b},0.06)`,
    inputBg:   dark ? '#0C0C10' : '#FAF9F6',
    accent, accentSoft, accentLine,
    ok:        dark ? '#88C29C' : '#4F7A5F',
    warn:      dark ? '#E5C77A' : '#9A7A1F',
    danger:    dark ? '#E07A6E' : '#A8443A',
  };
};

// Density-aware spacing
const dens = (density) => {
  if (density === 'compact') return { row: 6, gap: 6, side: 24, card: 7 };
  if (density === 'comfy') return { row: 12, gap: 12, side: 36, card: 14 };
  return { row: 9, gap: 9, side: 32, card: 12 };
};

// ─── primitives ──────────────────────────────────────────────────────
function paneIconBtn(t) {
  return {
    background: 'transparent', border: 'none', color: t.fgMuted,
    cursor: 'pointer', padding: 5, borderRadius: 4, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  };
}
function paneBtn(t, kind = 'ghost') {
  if (kind === 'primary') {
    return {
      background: t.accent, color: '#fff',
      border: 'none', padding: '7px 13px', borderRadius: 6,
      fontFamily: t.font, fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 5,
    };
  }
  if (kind === 'danger') {
    return {
      background: t.danger, color: '#fff',
      border: 'none', padding: '7px 13px', borderRadius: 6,
      fontFamily: t.font, fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
    };
  }
  return {
    background: 'transparent', color: t.fg,
    border: `1px solid ${t.border}`, padding: '7px 13px', borderRadius: 6,
    fontFamily: t.font, fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
  };
}
function paneInput(t) {
  return {
    width: '100%', padding: '8px 11px', borderRadius: 6,
    background: t.inputBg, border: `1px solid ${t.border}`,
    fontFamily: t.mono, fontSize: 12, color: t.fg, outline: 'none',
  };
}
function PaneIcon({ size = 56, dark = false, accent = '#C05037', variant = 'A' }) {
  if (variant === 'B') return <PaneIconB size={size} dark={dark} accent={accent} />;
  if (variant === 'C') return <PaneIconC size={size} dark={dark} accent={accent} />;
  return <PaneIconA size={size} dark={dark} accent={accent} />;
}

// ─── chrome pieces ───────────────────────────────────────────────────
function PaneSidebar({ t, dark, density, sidebarVisible = true, iconVariant = 'A' }) {
  if (!sidebarVisible) return null;
  return (
    <div style={{
      width: 200, background: t.sidebar,
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      borderRight: `1px solid ${t.border}`,
    }}>
      <div style={{ height: 40, padding: '12px 14px 0' }}>
        <TrafficLights size={11} />
      </div>

      <div style={{ padding: '14px 14px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
          <PaneIcon size={22} dark={dark} accent={t.accent} variant={iconVariant} />
          <div style={{ fontFamily: t.display, fontSize: 14, color: t.fg, fontWeight: 600, letterSpacing: '-0.01em' }}>
            SecretDesk
          </div>
        </div>

        <button style={{
          width: '100%', padding: '7px 9px', borderRadius: 7,
          background: t.panel, border: `1px solid ${t.border}`,
          fontFamily: t.font, fontSize: 12, color: t.fg, fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          textAlign: 'left', cursor: 'pointer',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.ok }} />
            <span style={{ fontFamily: t.mono, fontSize: 11.5 }}>dev-local</span>
          </span>
          <IconChevronDown w={11} s={1.5} />
        </button>
      </div>

      <div style={{ padding: '0 8px', flex: 1, overflow: 'hidden' }}>
        <div style={{
          padding: '8px 8px 6px', fontFamily: t.font, fontSize: 10,
          fontWeight: 600, color: t.fgFaint,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Namespaces</div>
        {SAMPLE_NAMESPACES.map((ns, i) => {
          const active = i === 0;
          return (
            <div key={ns.name} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: density === 'compact' ? '4px 8px' : '6px 8px',
              borderRadius: 6, marginBottom: 1,
              background: active ? t.selected : 'transparent',
              fontFamily: t.font, fontSize: 12.5, color: t.fg,
              fontWeight: active ? 500 : 400, cursor: 'pointer',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 5, height: 5, borderRadius: 1.5,
                  background: active ? t.accent : t.fgFaint,
                }} />
                {ns.name}
              </span>
              <span style={{ fontFamily: t.mono, fontSize: 10.5, color: t.fgFaint }}>{ns.count}</span>
            </div>
          );
        })}
      </div>

      <div style={{
        padding: '12px 14px', borderTop: `1px solid ${t.borderSoft}`,
        fontFamily: t.font, fontSize: 11, color: t.fgFaint,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span style={{ color: t.ok }}>● online</span>
        <span style={{ fontFamily: t.mono }}>1.0.0</span>
      </div>
    </div>
  );
}

function PaneSecretList({ t, dark, density, layout = 'card', activeIndex = 0 }) {
  const d = dens(density);
  return (
    <div style={{
      width: 264, background: t.panel2,
      borderRight: `1px solid ${t.border}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      <div style={{ padding: '14px 14px 12px', borderBottom: `1px solid ${t.borderSoft}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontFamily: t.display, fontSize: 14, fontWeight: 600, color: t.fg }}>default</div>
          <button style={{
            width: 22, height: 22, borderRadius: 5,
            background: t.accent, border: 'none', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}><IconPlus w={12} s={2}/></button>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '6px 9px', borderRadius: 6,
          background: t.inputBg, border: `1px solid ${t.border}`,
        }}>
          <IconSearch w={11} s={1.7} />
          <span style={{ fontFamily: t.font, fontSize: 11.5, color: t.fgFaint, flex: 1 }}>Filter…</span>
          <span style={{
            fontFamily: t.mono, fontSize: 10, color: t.fgFaint,
            padding: '1px 5px', border: `1px solid ${t.border}`, borderRadius: 3,
          }}>⌘K</span>
        </div>
      </div>

      <div style={{ overflow: 'auto', padding: '6px 8px' }}>
        {SAMPLE_SECRETS.map((s, i) => {
          const active = i === activeIndex;
          const typeShort = s.type === 'Opaque' ? 'opaque' :
                           s.type.includes('tls') ? 'tls' :
                           s.type.includes('docker') ? 'docker' : s.type;
          return (
            <div key={s.name} style={{
              padding: density === 'compact' ? '6px 10px' : '9px 10px',
              borderRadius: 7, marginBottom: 2,
              background: active ? t.panel : 'transparent',
              border: `1px solid ${active ? t.border : 'transparent'}`,
              boxShadow: active ? (dark ? '0 1px 0 rgba(255,255,255,0.04) inset' : '0 1px 2px rgba(20,15,10,0.04)') : 'none',
              cursor: 'pointer',
            }}>
              <div style={{
                fontFamily: t.mono, fontSize: 12, fontWeight: 500, color: t.fg,
                marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{s.name}</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: t.font, fontSize: 10.5, color: t.fgMuted,
              }}>
                <span style={{
                  padding: '1px 6px', borderRadius: 3,
                  background: active ? t.accentSoft : (dark ? 'rgba(255,255,255,0.05)' : 'rgba(20,15,10,0.05)'),
                  color: active ? t.accent : t.fgMuted, fontFamily: t.mono, fontSize: 10,
                }}>{typeShort}</span>
                <span>{s.keys} keys</span>
                <span style={{ marginLeft: 'auto', color: t.fgFaint }}>{s.age}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// KV — card or row layout
function PaneKVCard({ t, row, i, isShown, onToggle, isBinary = false, edited = false }) {
  const masked = '•'.repeat(Math.min(row.v.length, 28));
  return (
    <div style={{
      background: t.panel,
      border: `1px solid ${edited ? t.accentLine : t.border}`,
      borderRadius: 9, padding: '12px 14px', marginBottom: 8,
      position: 'relative',
    }}>
      {edited && <div style={{
        position: 'absolute', left: -1, top: 12, bottom: 12,
        width: 2, background: t.accent, borderRadius: 1,
      }}/>}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 7,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ fontFamily: t.mono, fontSize: 11.5, color: t.fg, fontWeight: 600 }}>{row.k}</div>
          {edited && <span style={{
            fontFamily: t.mono, fontSize: 9.5, color: t.accent,
            padding: '1px 6px', borderRadius: 3, background: t.accentSoft, fontWeight: 500,
          }}>EDITED</span>}
          {isBinary && <span style={{
            fontFamily: t.mono, fontSize: 9.5, color: t.fgMuted,
            padding: '1px 6px', borderRadius: 3,
            background: 'rgba(128,128,128,0.12)', fontWeight: 500,
          }}>BINARY</span>}
        </div>
        <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
          <span style={{ fontFamily: t.mono, fontSize: 10, color: t.fgFaint, marginRight: 8 }}>
            {row.v.length}b
          </span>
          {!isBinary && (
            <button onClick={onToggle} style={paneIconBtn(t)}>
              {isShown ? <IconEyeOff w={12} s={1.6}/> : <IconEye w={12} s={1.6}/>}
            </button>
          )}
          <button style={paneIconBtn(t)}><IconCopy w={11} s={1.6}/></button>
          <button style={paneIconBtn(t)}><IconTrash w={11} s={1.6}/></button>
        </div>
      </div>
      <div style={{
        fontFamily: t.mono, fontSize: 12, color: t.fg,
        padding: '7px 10px', background: t.inputBg, borderRadius: 6,
        border: `1px solid ${t.borderSoft}`,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {isBinary ? <span style={{ color: t.fgMuted, fontStyle: 'italic' }}>[Binary data · 1.2 KB · cannot edit inline]</span> :
         isShown ? row.v : <span style={{ color: t.fgFaint }}>{masked}</span>}
      </div>
    </div>
  );
}

function PaneKVRow({ t, row, i, isShown, onToggle }) {
  const masked = '•'.repeat(Math.min(row.v.length, 28));
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1.6fr auto',
      gap: 8, alignItems: 'center', marginBottom: 6,
    }}>
      <div style={{
        background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 6,
        padding: '7px 11px', fontFamily: t.mono, fontSize: 12, color: t.fg,
      }}>{row.k}</div>
      <div style={{
        background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 6,
        padding: '7px 11px', fontFamily: t.mono, fontSize: 12,
        color: t.fg, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{isShown ? row.v : masked}</div>
      <div style={{ display: 'flex', gap: 0 }}>
        <button onClick={onToggle} style={paneIconBtn(t)}>
          {isShown ? <IconEyeOff w={12} s={1.6}/> : <IconEye w={12} s={1.6}/>}
        </button>
        <button style={paneIconBtn(t)}><IconCopy w={11} s={1.6}/></button>
        <button style={paneIconBtn(t)}><IconTrash w={11} s={1.6}/></button>
      </div>
    </div>
  );
}

// ─── main editor ────────────────────────────────────────────────────
function PaneEditor({
  dark = false, accent = '#C05037', density = 'regular',
  sidebarVisible = true, layout = 'card', mode = 'editor',
  iconVariant = 'A', overlay = null,
}) {
  const t = paneTheme(dark, accent);
  const d = dens(density);
  const [revealed, setRevealed] = React.useState({});

  // For diff mode, mark a couple rows as edited
  const editedIdx = mode === 'diff' ? { 3: true, 5: true } : {};
  // For binary mode, last row is binary
  const rows = mode === 'binary'
    ? [...SAMPLE_KV.slice(0, 5), { k: 'TLS_KEYSTORE_P12', v: '0x4d534654...binary...', show: false }]
    : SAMPLE_KV;
  const binaryIdx = mode === 'binary' ? 5 : -1;

  const Editor = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.bg, minWidth: 0 }}>
      <div style={{
        height: 40, padding: '0 18px', display: 'flex', alignItems: 'center',
        justifyContent: 'flex-end', gap: 8,
        borderBottom: `1px solid ${t.borderSoft}`,
      }}>
        <button style={paneIconBtn(t)}>{dark ? <IconMoon w={13} s={1.6}/> : <IconSun w={13} s={1.6}/>}</button>
      </div>

      <div style={{ padding: `24px ${d.side}px 18px`, borderBottom: `1px solid ${t.borderSoft}` }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: t.mono, fontSize: 11, color: t.fgMuted, marginBottom: 6,
        }}>
          <span>default</span>
          <span style={{ color: t.fgFaint }}>/</span>
          <span style={{
            padding: '1px 7px', borderRadius: 3,
            background: t.accentSoft, color: t.accent, fontWeight: 500,
          }}>opaque</span>
        </div>
        <div style={{
          fontFamily: t.display, fontSize: 26, color: t.fg, fontWeight: 600,
          letterSpacing: '-0.018em', marginBottom: 8,
        }}>database-credentials</div>
        <div style={{
          fontFamily: t.font, fontSize: 12, color: t.fgMuted,
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <IconClock w={11} s={1.6}/> 14d
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: t.mono, fontSize: 11 }}>
            rv·84720193
          </span>
          <span>{rows.length} keys · 312 bytes</span>
        </div>
      </div>

      {mode === 'conflict' && (
        <div style={{
          margin: `14px ${d.side}px 0`, padding: '11px 14px', borderRadius: 8,
          background: dark ? 'rgba(232,118,90,0.10)' : 'rgba(192,80,55,0.06)',
          border: `1px solid ${dark ? 'rgba(232,118,90,0.30)' : 'rgba(192,80,55,0.20)'}`,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ color: t.accent, marginTop: 1 }}><IconAlert w={14} s={1.7}/></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: t.font, fontSize: 12.5, fontWeight: 600, color: t.fg, marginBottom: 2 }}>
              Cluster has newer changes
            </div>
            <div style={{ fontFamily: t.font, fontSize: 11.5, color: t.fgMuted }}>
              Reload to merge or force-overwrite to keep yours.
            </div>
          </div>
          <button style={paneBtn(t, 'ghost')}>Reload</button>
          <button style={paneBtn(t, 'primary')}>Overwrite</button>
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto', padding: `18px ${d.side}px 14px` }}>
        {rows.map((row, i) => layout === 'row'
          ? <PaneKVRow key={i} t={t} row={row} i={i}
              isShown={revealed[i]}
              onToggle={() => setRevealed({ ...revealed, [i]: !revealed[i] })} />
          : <PaneKVCard key={i} t={t} row={row} i={i}
              isShown={revealed[i]}
              onToggle={() => setRevealed({ ...revealed, [i]: !revealed[i] })}
              isBinary={i === binaryIdx}
              edited={!!editedIdx[i]} />)}

        <button style={{
          width: '100%', background: 'transparent',
          border: `1px dashed ${t.border}`, borderRadius: 9,
          padding: '11px 12px', fontFamily: t.font, fontSize: 12,
          color: t.fgMuted, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}>
          <IconPlus w={13} s={1.7}/> Add key
        </button>
      </div>

      <div style={{
        height: 44, borderTop: `1px solid ${t.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `0 ${d.side}px`, flexShrink: 0,
        fontFamily: t.font, fontSize: 11.5, color: t.fgMuted,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.accent }} />
          {mode === 'diff' ? '2 keys edited' : '2 unsaved changes'}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={paneBtn(t, 'ghost')}>Discard</button>
          <button style={paneBtn(t, 'primary')}>
            Save <span style={{ fontFamily: t.mono, fontSize: 10, opacity: 0.7, marginLeft: 4 }}>⌘S</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <AppWindow width={1100} height={720} radius={11}
      shadow={dark ? '0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.08)' : '0 30px 80px -20px rgba(20,15,10,0.20), 0 0 0 0.5px rgba(20,15,10,0.10)'}>
      <div style={{ flex: 1, display: 'flex', background: t.bg, position: 'relative' }}>
        <PaneSidebar t={t} dark={dark} density={density} sidebarVisible={sidebarVisible} iconVariant={iconVariant} />
        <PaneSecretList t={t} dark={dark} density={density} layout={layout} />
        {Editor}
        {overlay}
      </div>
    </AppWindow>
  );
}

Object.assign(window, {
  PaneEditor, PaneIcon, paneTheme, paneBtn, paneInput, paneIconBtn, dens,
  PaneSidebar, PaneSecretList, PaneKVCard, PaneKVRow,
});
