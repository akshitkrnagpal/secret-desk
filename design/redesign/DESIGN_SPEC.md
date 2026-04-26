# SecretDesk · Pane redesign — handoff spec

> Direction: **Pane** (chromeless three-pane). Locked decisions:
> **Dark mode · Ink accent · Comfy density · Row KV layout · Icon C (Side-pane)**

This spec is the source of truth for implementing the redesign. The HTML mockup at `SecretDesk Redesign.html` is reference; values here override anything that drifted in the prototype.

---

## 1 · Design tokens

### Color (dark mode — primary)
| Token | Value | Use |
|---|---|---|
| `bg` | `#101014` | App background |
| `panel` | `#16161B` | Cards, editor pane |
| `panel2` | `#1B1B22` | Secret list pane, raised surfaces |
| `sidebar` | `#0C0C10` | Left sidebar background |
| `border` | `rgba(255,255,255,0.07)` | Default 1px borders |
| `borderSoft` | `rgba(255,255,255,0.04)` | Inner dividers |
| `fg` | `#EDEAE3` | Primary text |
| `fgMuted` | `rgba(237,234,227,0.60)` | Secondary text |
| `fgFaint` | `rgba(237,234,227,0.36)` | Tertiary, metadata |
| `inputBg` | `#0C0C10` | Inputs, code blocks |
| `ok` | `#88C29C` | Online, success |
| `warn` | `#E5C77A` | Conflicts, warnings |
| `danger` | `#E07A6E` | Destructive |

### Color (light mode — secondary)
| Token | Value |
|---|---|
| `bg` | `#FCFCFA` |
| `panel` | `#FFFFFF` |
| `panel2` | `#F6F5F2` |
| `sidebar` | `#F2F0EC` |
| `border` | `rgba(20,15,10,0.08)` |
| `fg` | `#15130F` |

### Accent — **Ink** (locked)
- Light mode: `#1F1F1F`
- Dark mode: ⚠️ **swap to `#EDEAE3`** so primary buttons read on dark surfaces. (See §6 caveat.)
- `accentSoft` (selection / chip bg): `rgba(accent, 0.16)` dark · `rgba(accent, 0.10)` light
- `accentLine` (subtle borders): `rgba(accent, 0.32)` dark · `rgba(accent, 0.24)` light

### Type
| Role | Family | Notes |
|---|---|---|
| UI | `Inter` | 400 / 500 / 600 |
| Display (titles) | `Inter Tight` | 600, letter-spacing −0.015em to −0.02em |
| Mono | `JetBrains Mono` | Keys, values, kbd, metadata |

Sizes (comfy density):
- Display L: 26px / 600
- Display M: 19–22px / 600
- Body: 12.5–13px / 400
- Small: 11–11.5px / 400
- Micro / metadata: 10–10.5px (mono)

### Spacing — **Comfy** (locked)
- Section side padding: **36px**
- Row vertical: **12px**
- KV gap: **12px**
- Card inner padding: **14px**

### Radius
- Window: 11px
- Cards / modals: 9–12px
- Inputs / buttons: 6–7px
- Chips / tags: 3px

### Shadow
- Window (dark): `0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.08)`
- Window (light): `0 30px 80px -20px rgba(20,15,10,0.20), 0 0 0 0.5px rgba(20,15,10,0.10)`
- Modal (dark): `0 20px 60px rgba(0,0,0,0.6)`

---

## 2 · App icon — **Variant C: Side-pane** (locked)

Architectural mark — a tile divided into a thin sidebar + content area, with one highlighted sidebar row (accent) and an underscore cursor in the content (accent). Two muted placeholder lines.

Generate at: 16, 32, 48, 64, 128, 256, 512, 1024 px. Tile background flat (no gradient): `#FCFCFA` light tile / `#16161B` dark tile, `0.5px` outer border, `22%` corner radius.

Mac `.icns`: build all sizes incl. @2x. Linux: 512 PNG. Windows: `.ico` w/ 16/32/48/256.

---

## 3 · Layout — **Row KV layout** (locked)

The editor pane uses a 3-column grid for each key/value:
```
[ key input  1fr ] [ value input  1.6fr ] [ icon row  auto ]
```
- Both inputs: `inputBg` background, 1px `border`, 6px radius, 7×11 padding, mono 12px.
- Icon row: eye-toggle, copy, trash — each 5px padding, 4px radius, transparent bg, `fgMuted` color.
- Row gap: 6px (not 8 — comfy still wants tight rows when in row layout).

Card layout exists for users who switch in settings; ship row as default.

---

## 4 · Screens to build (priority order)

1. **Editor** (primary) — sidebar (200px) · secret list (264px) · editor (flex). Top bar 40px with traffic lights left, theme toggle right. Footer 44px with unsaved-state + Save/Discard.
2. **Onboarding** — 3-step card, "Use default kubeconfig" / "Locate…".
3. **Cluster picker** — env-tagged rows (prod/staging/dev colors), online/offline state, cluster-level secret counts.
4. **Create-secret modal** — type segmented control (Opaque / TLS / Docker / Basic). Form swaps based on type.
5. **⌘K palette** — grouped results: secrets in current ns, other ns, commands. Highlight match span with `accentSoft` chip.
6. **Paste-from-.env** — split modal: paste textarea left, parsed preview right. Tag rows NEW / OVERWRITE / SAME.
7. **Diff state** — edited rows get `accentLine` border + 2px left bar in accent + tiny "EDITED" chip.
8. **409 Conflict banner** — top-of-editor strip, warn-tinted, Reload + Overwrite buttons.
9. **Binary row** — italic placeholder text, BINARY chip, eye toggle hidden.
10. **Delete confirm** — type-the-name input gate, danger button.
11. **Settings** — 5 sections (General / Appearance / Kubernetes / Shortcuts / About). Theme + Accent + Density + toggles.

---

## 5 · Component contracts (key ones)

### `<KVRow value, onChange, isMasked, onToggleMask, onCopy, onDelete />`
- Mono. Mask defaults true. Eye-toggle reveals.
- Show `Nb` byte count in `fgFaint` mono next to action buttons.

### `<SecretListItem secret, active />`
- Mono name. Type chip uses short label (`opaque` / `tls` / `docker`). When active: chip bg = `accentSoft`, chip fg = `accent`.

### `<ContextSwitcher current />`
- Pill with green dot + mono context name + chevron. Sits in sidebar header.

### `<TypeChip type, env? />`
- Env color: prod → `danger`, staging → `warn`, dev → `ok`. Bg `${color}22` dark / `${color}15` light.

### `<Kbd>⌘K</Kbd>`
- Mono 10px, 1px border, 3px radius, `panel2` bg.

---

## 6 · Caveats / things to decide

- **Ink accent + dark mode** — `#1F1F1F` near-black disappears on `#16161B` panel. Recommended: invert to `#EDEAE3` (the `fg` value) for accent in dark mode so buttons / selection / "EDITED" chip stay readable. The HTML mockup currently doesn't auto-invert; production should.
- **Sidebar collapse** — Tweak panel exposes it; ship behind a hotkey (⌘\) like Linear.
- **Keyboard map** — palette ⌘K, save ⌘S, new ⌘N, switch ctx ⌘⇧P, reload ⌘R. Not yet wired in mockup.
- **Density vs row layout** — comfy + row is breathy. If users dislike, the natural fallback is comfy + card.

---

## 7 · Files in this project

- `SecretDesk Redesign.html` — the canvas (interactive, all states)
- `pane.jsx` — primary editor + theme function
- `pane-states.jsx` — modal / onboarding / picker / settings / palette / paste-env
- `pane-icons.jsx` — three icon variants (ship variant **C**)
- `shared.jsx` — sample data, base icons, AppWindow chrome
- **`globals.css`** — drop-in replacement for `src/renderer/styles/globals.css` with locked Ink-accent tokens (auto-inverts in dark mode). Claude Code's previous version used coral; replace it with this one.

