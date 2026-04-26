// pane-states.jsx — extended states for the Pane direction
// Onboarding, cluster picker, create-secret with typed forms, delete confirm,
// settings, ⌘K command/search, paste-from-env.

// ─── Onboarding (first run, no kubeconfig or 0 contexts) ────────────
function PaneOnboarding({ dark = false, accent = '#C05037', iconVariant = 'A' }) {
  const t = paneTheme(dark, accent);
  return (
    <AppWindow width={1100} height={720} radius={11}
      shadow={dark ? '0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.08)' : '0 30px 80px -20px rgba(20,15,10,0.20), 0 0 0 0.5px rgba(20,15,10,0.10)'}>
      <div style={{ flex: 1, background: t.bg, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 40, padding: '12px 18px 0' }}><TrafficLights size={11} /></div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <div style={{ width: 480, textAlign: 'center' }}>
            <PaneIcon size={72} dark={dark} accent={t.accent} variant={iconVariant} />
            <div style={{
              fontFamily: t.display, fontSize: 28, color: t.fg, fontWeight: 600,
              letterSpacing: '-0.02em', marginTop: 22, marginBottom: 10,
            }}>Welcome to SecretDesk</div>
            <div style={{
              fontFamily: t.font, fontSize: 14, color: t.fgMuted, lineHeight: 1.55, marginBottom: 28,
            }}>
              A clean editor for Kubernetes secrets. To get started, point us at a kubeconfig with at least one cluster.
            </div>

            {/* steps */}
            <div style={{
              background: t.panel, border: `1px solid ${t.border}`, borderRadius: 12,
              padding: 4, textAlign: 'left',
            }}>
              {[
                { n: '1', title: 'Locate kubeconfig', sub: 'Default: ~/.kube/config', cta: 'Use default', state: 'active' },
                { n: '2', title: 'Select a context', sub: 'We found 3 clusters', state: 'next' },
                { n: '3', title: 'Pick a starting namespace', sub: 'You can switch anytime', state: 'next' },
              ].map((s, i, arr) => (
                <div key={s.n} style={{
                  padding: '14px 16px',
                  borderBottom: i < arr.length - 1 ? `1px solid ${t.borderSoft}` : 'none',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 14,
                    background: s.state === 'active' ? t.accent : 'transparent',
                    border: s.state === 'active' ? 'none' : `1px solid ${t.border}`,
                    color: s.state === 'active' ? '#fff' : t.fgFaint,
                    fontFamily: t.mono, fontSize: 12, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{s.n}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: t.font, fontSize: 13, color: t.fg, fontWeight: 500 }}>
                      {s.title}
                    </div>
                    <div style={{ fontFamily: t.font, fontSize: 11.5, color: t.fgMuted, marginTop: 2 }}>
                      {s.sub}
                    </div>
                  </div>
                  {s.state === 'active' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={paneBtn(t, 'ghost')}>Locate…</button>
                      <button style={paneBtn(t, 'primary')}>{s.cta}</button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 18, fontFamily: t.mono, fontSize: 11, color: t.fgFaint,
            }}>
              SecretDesk runs locally — credentials never leave your machine.
            </div>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

// ─── Multi-cluster context picker ────────────────────────────────────
function PaneClusterPicker({ dark = false, accent = '#C05037', iconVariant = 'A' }) {
  const t = paneTheme(dark, accent);
  const clusters = [
    { name: 'dev-local', server: 'https://kubernetes.docker.internal:6443', user: 'docker-desktop', online: true, env: 'dev', secrets: 41 },
    { name: 'staging-aws', server: 'https://staging-eks.us-west-2.amazonaws.com', user: 'iam-user/akshit', online: true, env: 'staging', secrets: 128 },
    { name: 'prod-eks', server: 'https://prod-eks.us-east-1.amazonaws.com', user: 'iam-role/sre', online: true, env: 'prod', secrets: 372 },
    { name: 'experimental-gke', server: 'https://gke-experimental.europe-west1.gcp', user: 'akshit@google', online: false, env: 'dev', secrets: 12 },
    { name: 'minikube', server: 'https://192.168.49.2:8443', user: 'minikube', online: false, env: 'dev', secrets: 8 },
  ];
  return (
    <AppWindow width={1100} height={720} radius={11}
      shadow={dark ? '0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.08)' : '0 30px 80px -20px rgba(20,15,10,0.20), 0 0 0 0.5px rgba(20,15,10,0.10)'}>
      <div style={{ flex: 1, background: t.bg, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 40, padding: '12px 18px 0' }}><TrafficLights size={11} /></div>
        <div style={{ padding: '24px 40px 16px' }}>
          <div style={{
            fontFamily: t.mono, fontSize: 11, color: t.fgFaint,
            letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4,
          }}>~/.kube/config · 5 clusters</div>
          <div style={{
            fontFamily: t.display, fontSize: 26, color: t.fg, fontWeight: 600,
            letterSpacing: '-0.018em',
          }}>Choose a cluster</div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          margin: '0 40px 16px', padding: '8px 11px', borderRadius: 8,
          background: t.panel, border: `1px solid ${t.border}`,
        }}>
          <IconSearch w={12} s={1.7} />
          <span style={{ fontFamily: t.font, fontSize: 12.5, color: t.fgFaint, flex: 1 }}>Search clusters or namespaces…</span>
          <span style={{
            fontFamily: t.mono, fontSize: 10, color: t.fgFaint,
            padding: '1px 5px', border: `1px solid ${t.border}`, borderRadius: 3,
          }}>⌘K</span>
        </div>

        <div style={{ padding: '0 40px 24px', overflow: 'auto', flex: 1 }}>
          {clusters.map((c, i) => {
            const envColor = c.env === 'prod' ? t.danger : c.env === 'staging' ? t.warn : t.ok;
            return (
              <div key={c.name} style={{
                background: t.panel, border: `1px solid ${i === 0 ? t.accentLine : t.border}`,
                borderRadius: 9, padding: '14px 16px', marginBottom: 8,
                display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 16,
                alignItems: 'center', cursor: 'pointer',
                boxShadow: i === 0 ? `0 0 0 3px ${t.accentSoft}` : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: c.online ? t.accentSoft : (dark ? 'rgba(255,255,255,0.04)' : 'rgba(20,15,10,0.04)'),
                  color: c.online ? t.accent : t.fgFaint,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IconBox w={16} s={1.7} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontFamily: t.mono, fontSize: 13, color: t.fg, fontWeight: 600 }}>
                      {c.name}
                    </span>
                    <span style={{
                      fontFamily: t.mono, fontSize: 9.5, color: envColor,
                      padding: '1px 6px', borderRadius: 3, fontWeight: 600,
                      background: dark ? `${envColor}22` : `${envColor}15`,
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                    }}>{c.env}</span>
                    {!c.online && <span style={{
                      fontFamily: t.font, fontSize: 10.5, color: t.fgFaint,
                    }}>· offline</span>}
                  </div>
                  <div style={{ fontFamily: t.mono, fontSize: 10.5, color: t.fgMuted }}>
                    {c.server}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: t.font, fontSize: 11.5, color: t.fgMuted }}>
                    user
                  </div>
                  <div style={{ fontFamily: t.mono, fontSize: 11, color: t.fg, marginTop: 2 }}>
                    {c.user}
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 70 }}>
                  <div style={{ fontFamily: t.display, fontSize: 16, color: t.fg, fontWeight: 600 }}>
                    {c.secrets}
                  </div>
                  <div style={{ fontFamily: t.font, fontSize: 10.5, color: t.fgFaint, marginTop: 1 }}>
                    secrets
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppWindow>
  );
}

// ─── Create-secret modal with typed fields ──────────────────────────
function PaneCreateModal({ dark = false, accent = '#C05037', type = 'opaque', iconVariant = 'A' }) {
  const t = paneTheme(dark, accent);
  const types = [
    { id: 'opaque', label: 'Opaque', sub: 'Generic key/value' },
    { id: 'tls', label: 'TLS', sub: 'kubernetes.io/tls' },
    { id: 'docker', label: 'Docker', sub: 'kubernetes.io/dockerconfigjson' },
    { id: 'basic', label: 'Basic auth', sub: 'kubernetes.io/basic-auth' },
  ];

  const FieldsByType = () => {
    if (type === 'tls') return (
      <>
        <FieldP t={t} label="tls.crt" sub="PEM-encoded certificate">
          <textarea rows={3} placeholder="-----BEGIN CERTIFICATE-----&#10;MIIDXTCCAkWgAwIBAgIJAKlQF9YN..." style={{ ...paneInput(t), resize: 'none', height: 64 }} />
        </FieldP>
        <FieldP t={t} label="tls.key" sub="PEM-encoded private key">
          <textarea rows={3} placeholder="-----BEGIN PRIVATE KEY-----&#10;MIIEvQIBADANBgkqhkiG9w0BA..." style={{ ...paneInput(t), resize: 'none', height: 64 }} />
        </FieldP>
      </>
    );
    if (type === 'docker') return (
      <>
        <FieldP t={t} label="Registry" sub="e.g. ghcr.io, docker.io">
          <input defaultValue="ghcr.io" style={paneInput(t)} />
        </FieldP>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <FieldP t={t} label="Username">
            <input defaultValue="akshitkrnagpal" style={paneInput(t)} />
          </FieldP>
          <FieldP t={t} label="Password / token">
            <input type="password" defaultValue="ghp_xxxxxxxxxxxxxxx" style={paneInput(t)} />
          </FieldP>
        </div>
        <FieldP t={t} label="Email">
          <input defaultValue="akshit@example.com" style={paneInput(t)} />
        </FieldP>
      </>
    );
    if (type === 'basic') return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <FieldP t={t} label="username"><input defaultValue="admin" style={paneInput(t)} /></FieldP>
        <FieldP t={t} label="password"><input type="password" defaultValue="••••••••••" style={paneInput(t)} /></FieldP>
      </div>
    );
    return (
      <>
        <FieldP t={t} label="First key">
          <input defaultValue="WEBHOOK_SECRET" style={paneInput(t)} />
        </FieldP>
        <FieldP t={t} label="Value">
          <input placeholder="paste secret value…" style={paneInput(t)} />
        </FieldP>
        <button style={{
          background: 'transparent', border: `1px dashed ${t.border}`, borderRadius: 7,
          padding: '8px 12px', fontFamily: t.font, fontSize: 12, color: t.fgMuted,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginTop: -4,
        }}>
          <IconPlus w={12} s={1.7}/> Add another key
        </button>
      </>
    );
  };

  return (
    <AppWindow width={1100} height={720} radius={11}
      shadow={dark ? '0 30px 80px -20px rgba(0,0,0,0.6)' : '0 30px 80px -20px rgba(20,15,10,0.20)'}>
      <div style={{ flex: 1, position: 'relative', background: t.bg, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.45, filter: 'blur(2px)', pointerEvents: 'none' }}>
          <PaneEditor dark={dark} accent={accent} iconVariant={iconVariant} />
        </div>
        <div style={{
          position: 'absolute', inset: 0, background: dark ? 'rgba(8,8,12,0.55)' : 'rgba(252,252,250,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 600, background: t.panel, borderRadius: 12,
            border: `1px solid ${t.border}`,
            boxShadow: dark ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(20,15,10,0.22)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 22px 16px', borderBottom: `1px solid ${t.borderSoft}` }}>
              <div style={{
                fontFamily: t.mono, fontSize: 10.5, color: t.fgFaint, letterSpacing: '0.06em',
                textTransform: 'uppercase', marginBottom: 4,
              }}>New secret · default</div>
              <div style={{ fontFamily: t.display, fontSize: 22, color: t.fg, fontWeight: 600, letterSpacing: '-0.015em' }}>
                Create secret
              </div>
            </div>
            <div style={{ padding: '18px 22px' }}>
              <FieldP t={t} label="Type">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {types.map(tp => {
                    const sel = tp.id === type;
                    return (
                      <div key={tp.id} style={{
                        padding: '8px 10px', borderRadius: 7,
                        border: `1px solid ${sel ? t.accent : t.border}`,
                        background: sel ? t.accentSoft : 'transparent',
                        cursor: 'pointer',
                      }}>
                        <div style={{
                          fontFamily: t.font, fontSize: 12, fontWeight: 600,
                          color: sel ? t.accent : t.fg,
                        }}>{tp.label}</div>
                        <div style={{
                          fontFamily: t.mono, fontSize: 10, color: t.fgFaint, marginTop: 2,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{tp.sub}</div>
                      </div>
                    );
                  })}
                </div>
              </FieldP>

              <FieldP t={t} label="Name" hint="lowercase letters, numbers, dashes">
                <input defaultValue={
                  type === 'tls' ? 'wildcard-cert' :
                  type === 'docker' ? 'ghcr-pull-secret' :
                  type === 'basic' ? 'grafana-admin' : 'stripe-webhook'
                } style={paneInput(t)} />
              </FieldP>

              <FieldsByType />
            </div>
            <div style={{
              padding: '12px 22px', borderTop: `1px solid ${t.borderSoft}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(20,15,10,0.02)',
            }}>
              <div style={{ fontFamily: t.mono, fontSize: 10.5, color: t.fgFaint }}>
                will be created in <span style={{ color: t.fg }}>default</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={paneBtn(t, 'ghost')}>Cancel</button>
                <button style={paneBtn(t, 'primary')}>Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

// ─── Delete confirmation ─────────────────────────────────────────────
function PaneDeleteModal({ dark = false, accent = '#C05037', iconVariant = 'A' }) {
  const t = paneTheme(dark, accent);
  return (
    <AppWindow width={1100} height={720} radius={11}
      shadow={dark ? '0 30px 80px -20px rgba(0,0,0,0.6)' : '0 30px 80px -20px rgba(20,15,10,0.20)'}>
      <div style={{ flex: 1, position: 'relative', background: t.bg, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.45, filter: 'blur(2px)', pointerEvents: 'none' }}>
          <PaneEditor dark={dark} accent={accent} iconVariant={iconVariant} />
        </div>
        <div style={{
          position: 'absolute', inset: 0, background: dark ? 'rgba(8,8,12,0.6)' : 'rgba(252,252,250,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 440, background: t.panel, borderRadius: 12,
            border: `1px solid ${t.border}`,
            boxShadow: dark ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(20,15,10,0.22)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '24px 24px 18px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                background: dark ? 'rgba(224,122,110,0.12)' : 'rgba(168,68,58,0.08)',
                color: t.danger, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconAlert w={16} s={1.8} />
              </div>
              <div>
                <div style={{ fontFamily: t.display, fontSize: 17, color: t.fg, fontWeight: 600, marginBottom: 4 }}>
                  Delete this secret?
                </div>
                <div style={{ fontFamily: t.font, fontSize: 12.5, color: t.fgMuted, lineHeight: 1.5 }}>
                  <code style={{ fontFamily: t.mono, fontSize: 11.5, padding: '1px 5px', borderRadius: 3, background: t.panel2 }}>
                    database-credentials
                  </code> will be removed from <code style={{ fontFamily: t.mono, fontSize: 11.5, padding: '1px 5px', borderRadius: 3, background: t.panel2 }}>default</code> on
                  cluster <code style={{ fontFamily: t.mono, fontSize: 11.5, padding: '1px 5px', borderRadius: 3, background: t.panel2 }}>dev-local</code>.
                  This cannot be undone.
                </div>
              </div>
            </div>
            <div style={{ padding: '0 24px 18px' }}>
              <div style={{
                fontFamily: t.font, fontSize: 11.5, color: t.fgMuted, marginBottom: 6,
              }}>Type the name to confirm:</div>
              <input placeholder="database-credentials" style={paneInput(t)} />
            </div>
            <div style={{
              padding: '12px 24px', borderTop: `1px solid ${t.borderSoft}`,
              display: 'flex', justifyContent: 'flex-end', gap: 6,
              background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(20,15,10,0.02)',
            }}>
              <button style={paneBtn(t, 'ghost')}>Cancel</button>
              <button style={paneBtn(t, 'danger')}>Delete secret</button>
            </div>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

// ─── Settings ────────────────────────────────────────────────────────
function PaneSettings({ dark = false, accent = '#C05037', iconVariant = 'A' }) {
  const t = paneTheme(dark, accent);
  const sections = [
    { id: 'general', label: 'General', icon: <IconBox w={13} s={1.7}/>, active: true },
    { id: 'appearance', label: 'Appearance', icon: <IconLayers w={13} s={1.7}/> },
    { id: 'kube', label: 'Kubernetes', icon: <IconShield w={13} s={1.7}/> },
    { id: 'shortcuts', label: 'Shortcuts', icon: <IconCommand w={13} s={1.7}/> },
    { id: 'about', label: 'About', icon: <IconAsterisk w={13} s={1.7}/> },
  ];
  return (
    <AppWindow width={1100} height={720} radius={11}
      shadow={dark ? '0 30px 80px -20px rgba(0,0,0,0.6)' : '0 30px 80px -20px rgba(20,15,10,0.20)'}>
      <div style={{ flex: 1, background: t.bg, display: 'flex' }}>
        {/* settings sidebar */}
        <div style={{ width: 220, background: t.sidebar, borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 40, padding: '12px 14px 0' }}><TrafficLights size={11} /></div>
          <div style={{ padding: '14px 14px 8px', fontFamily: t.display, fontSize: 14, fontWeight: 600, color: t.fg }}>
            Settings
          </div>
          <div style={{ padding: '0 8px' }}>
            {sections.map(s => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '7px 10px', borderRadius: 6, marginBottom: 1,
                background: s.active ? t.selected : 'transparent',
                fontFamily: t.font, fontSize: 12.5, color: t.fg,
                fontWeight: s.active ? 500 : 400, cursor: 'pointer',
              }}>
                <span style={{ color: s.active ? t.accent : t.fgFaint }}>{s.icon}</span>
                {s.label}
              </div>
            ))}
          </div>
        </div>

        {/* settings content */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 40, borderBottom: `1px solid ${t.borderSoft}` }} />
          <div style={{ padding: '28px 36px', maxWidth: 640 }}>
            <div style={{
              fontFamily: t.display, fontSize: 22, color: t.fg, fontWeight: 600,
              letterSpacing: '-0.015em', marginBottom: 6,
            }}>Appearance</div>
            <div style={{ fontFamily: t.font, fontSize: 12.5, color: t.fgMuted, marginBottom: 24 }}>
              How SecretDesk looks. These don't affect any cluster.
            </div>

            <SettingsRow t={t} label="Theme" sub="Follows system preference by default">
              <div style={{ display: 'flex', gap: 4, padding: 3, background: t.panel2, borderRadius: 8 }}>
                {['Light', 'Dark', 'System'].map((opt, i) => (
                  <div key={opt} style={{
                    padding: '5px 12px', borderRadius: 6, fontFamily: t.font, fontSize: 12,
                    color: i === 2 ? t.fg : t.fgMuted, fontWeight: i === 2 ? 500 : 400,
                    background: i === 2 ? t.panel : 'transparent',
                    boxShadow: i === 2 ? (dark ? '0 1px 0 rgba(255,255,255,0.05) inset' : '0 1px 2px rgba(0,0,0,0.06)') : 'none',
                    cursor: 'pointer',
                  }}>{opt}</div>
                ))}
              </div>
            </SettingsRow>

            <SettingsRow t={t} label="Accent color" sub="Used for highlights, primary buttons, focus">
              <div style={{ display: 'flex', gap: 8 }}>
                {['#C05037', '#3D6AA3', '#2E7848', '#7C5BC4', '#1F1F1F'].map((c, i) => (
                  <div key={c} style={{
                    width: 22, height: 22, borderRadius: 6, background: c,
                    border: `2px solid ${c === t.accent ? t.fg : 'transparent'}`,
                    boxShadow: c === t.accent ? `0 0 0 1px ${t.bg} inset` : 'none',
                    cursor: 'pointer',
                  }} />
                ))}
              </div>
            </SettingsRow>

            <SettingsRow t={t} label="Density" sub="More breathing room, or pack more in">
              <div style={{ display: 'flex', gap: 4, padding: 3, background: t.panel2, borderRadius: 8 }}>
                {['Compact', 'Regular', 'Comfy'].map((opt, i) => (
                  <div key={opt} style={{
                    padding: '5px 12px', borderRadius: 6, fontFamily: t.font, fontSize: 12,
                    color: i === 1 ? t.fg : t.fgMuted, fontWeight: i === 1 ? 500 : 400,
                    background: i === 1 ? t.panel : 'transparent',
                    boxShadow: i === 1 ? (dark ? '0 1px 0 rgba(255,255,255,0.05) inset' : '0 1px 2px rgba(0,0,0,0.06)') : 'none',
                    cursor: 'pointer',
                  }}>{opt}</div>
                ))}
              </div>
            </SettingsRow>

            <SettingsToggle t={t} label="Mask values by default" sub="Click the eye to reveal" on={true} />
            <SettingsToggle t={t} label="Confirm before deleting" sub="Require typing the secret name" on={true} />
            <SettingsToggle t={t} label="Send anonymous usage data" sub="Helps us prioritize what to build" on={false} />

            <div style={{ height: 24 }} />
            <div style={{ fontFamily: t.display, fontSize: 18, color: t.fg, fontWeight: 600, marginBottom: 14, marginTop: 12 }}>
              Kubernetes
            </div>
            <SettingsRow t={t} label="Kubeconfig path" sub="Where we read context and credentials from">
              <div style={{
                fontFamily: t.mono, fontSize: 11.5, color: t.fg,
                padding: '6px 10px', background: t.inputBg, borderRadius: 6,
                border: `1px solid ${t.border}`,
              }}>~/.kube/config</div>
            </SettingsRow>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

function SettingsRow({ t, label, sub, children }) {
  return (
    <div style={{
      padding: '14px 0', borderBottom: `1px solid ${t.borderSoft}`,
      display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center',
    }}>
      <div>
        <div style={{ fontFamily: t.font, fontSize: 13, color: t.fg, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontFamily: t.font, fontSize: 11.5, color: t.fgMuted, marginTop: 2 }}>{sub}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
function SettingsToggle({ t, label, sub, on }) {
  return (
    <SettingsRow t={t} label={label} sub={sub}>
      <div style={{
        width: 30, height: 18, borderRadius: 10, background: on ? t.accent : (t.fgFaint),
        position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: on ? 14 : 2,
          width: 14, height: 14, borderRadius: 7, background: '#fff',
          transition: 'left 0.2s',
        }} />
      </div>
    </SettingsRow>
  );
}

// ─── ⌘K command palette / global search ─────────────────────────────
function PaneCommandK({ dark = false, accent = '#C05037', iconVariant = 'A' }) {
  const t = paneTheme(dark, accent);
  const groups = [
    {
      label: 'Secrets in default',
      items: [
        { name: 'database-credentials', meta: 'opaque · 6 keys', match: 'data', highlight: true },
        { name: 'datadog-api-key', meta: 'opaque · 1 key', match: 'data' },
      ],
    },
    {
      label: 'Other namespaces',
      items: [
        { name: 'data-pipeline-config', meta: 'monitoring · opaque', match: 'data' },
        { name: 'database-replica-creds', meta: 'payments · opaque', match: 'data' },
      ],
    },
    {
      label: 'Commands',
      items: [
        { name: 'New secret', meta: '⌘N', icon: <IconPlus w={11} s={1.7}/> },
        { name: 'Switch context', meta: '⌘⇧P', icon: <IconBox w={11} s={1.7}/> },
        { name: 'Reload from cluster', meta: '⌘R', icon: <IconArrowLeft w={11} s={1.7}/> },
      ],
    },
  ];
  return (
    <AppWindow width={1100} height={720} radius={11}
      shadow={dark ? '0 30px 80px -20px rgba(0,0,0,0.6)' : '0 30px 80px -20px rgba(20,15,10,0.20)'}>
      <div style={{ flex: 1, position: 'relative', background: t.bg, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, filter: 'blur(2px)', pointerEvents: 'none' }}>
          <PaneEditor dark={dark} accent={accent} iconVariant={iconVariant} />
        </div>
        <div style={{
          position: 'absolute', inset: 0, background: dark ? 'rgba(8,8,12,0.55)' : 'rgba(252,252,250,0.55)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 110,
        }}>
          <div style={{
            width: 560, background: t.panel, borderRadius: 12,
            border: `1px solid ${t.border}`,
            boxShadow: dark ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(20,15,10,0.22)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 16px', borderBottom: `1px solid ${t.border}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <IconSearch w={14} s={1.7} />
              <input defaultValue="data" style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontFamily: t.font, fontSize: 14, color: t.fg,
              }} />
              <span style={{
                fontFamily: t.mono, fontSize: 10.5, color: t.fgFaint,
                padding: '2px 6px', border: `1px solid ${t.border}`, borderRadius: 4,
              }}>esc</span>
            </div>
            <div style={{ maxHeight: 420, overflow: 'auto', padding: '6px 0' }}>
              {groups.map((g, gi) => (
                <div key={g.label}>
                  <div style={{
                    padding: '10px 16px 6px', fontFamily: t.font, fontSize: 10.5,
                    color: t.fgFaint, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600,
                  }}>{g.label}</div>
                  {g.items.map((it, i) => {
                    const sel = gi === 0 && i === 0;
                    return (
                      <div key={it.name} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px',
                        background: sel ? t.selected : 'transparent',
                        borderLeft: sel ? `2px solid ${t.accent}` : '2px solid transparent',
                        cursor: 'pointer',
                      }}>
                        <span style={{
                          color: sel ? t.accent : t.fgMuted, width: 14,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{it.icon || <IconKey w={11} s={1.7}/>}</span>
                        <span style={{ fontFamily: t.mono, fontSize: 12.5, color: t.fg, flex: 1 }}>
                          {it.match ? (
                            <>{it.name.split(it.match).map((p, j, arr) => (
                              <React.Fragment key={j}>{p}{j < arr.length - 1 && (
                                <span style={{ background: t.accentSoft, color: t.accent, borderRadius: 2, padding: '0 1px' }}>{it.match}</span>
                              )}</React.Fragment>
                            ))}</>
                          ) : it.name}
                        </span>
                        <span style={{ fontFamily: t.mono, fontSize: 10.5, color: t.fgFaint }}>
                          {it.meta}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div style={{
              padding: '8px 16px', borderTop: `1px solid ${t.border}`,
              fontFamily: t.font, fontSize: 11, color: t.fgFaint,
              display: 'flex', gap: 14,
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Kbd t={t}>↑↓</Kbd> navigate
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Kbd t={t}>↵</Kbd> open
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Kbd t={t}>⌘↵</Kbd> open in new tab
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

function Kbd({ t, children }) {
  return (
    <span style={{
      fontFamily: t.mono, fontSize: 10, color: t.fgMuted,
      padding: '1px 5px', border: `1px solid ${t.border}`, borderRadius: 3,
      background: t.panel2,
    }}>{children}</span>
  );
}

// ─── Paste-from-.env modal ──────────────────────────────────────────
function PanePasteEnv({ dark = false, accent = '#C05037', iconVariant = 'A' }) {
  const t = paneTheme(dark, accent);
  const sample = `# paste your .env content
DATABASE_URL=postgresql://user:Pg_K9aLm2!Vx7@db:5432/orders
REDIS_URL=redis://default:r3d!sP4ss@cache:6379
STRIPE_KEY=sk_live_51HxJ8XK...
SENTRY_DSN=https://abc@o12345.ingest.sentry.io/789
JWT_SIGNING_SECRET=eyJhbGciOiJIUzI1NiJ9...
NODE_ENV=production`;
  const parsed = [
    { k: 'DATABASE_URL', v: 'postgresql://user:Pg_K9aLm2!Vx7@db:5432/orders', new: true },
    { k: 'REDIS_URL', v: 'redis://default:r3d!sP4ss@cache:6379', new: true },
    { k: 'STRIPE_KEY', v: 'sk_live_51HxJ8XK...', new: true },
    { k: 'SENTRY_DSN', v: 'https://abc@o12345.ingest.sentry.io/789', new: true },
    { k: 'JWT_SIGNING_SECRET', v: 'eyJhbGciOiJIUzI1NiJ9...', new: false, conflict: true },
    { k: 'NODE_ENV', v: 'production', new: true },
  ];

  return (
    <AppWindow width={1100} height={720} radius={11}
      shadow={dark ? '0 30px 80px -20px rgba(0,0,0,0.6)' : '0 30px 80px -20px rgba(20,15,10,0.20)'}>
      <div style={{ flex: 1, position: 'relative', background: t.bg, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, filter: 'blur(2px)', pointerEvents: 'none' }}>
          <PaneEditor dark={dark} accent={accent} iconVariant={iconVariant} />
        </div>
        <div style={{
          position: 'absolute', inset: 0, background: dark ? 'rgba(8,8,12,0.55)' : 'rgba(252,252,250,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 720, maxHeight: 600, background: t.panel, borderRadius: 12,
            border: `1px solid ${t.border}`,
            boxShadow: dark ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(20,15,10,0.22)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 22px 14px', borderBottom: `1px solid ${t.borderSoft}` }}>
              <div style={{ fontFamily: t.display, fontSize: 19, color: t.fg, fontWeight: 600, letterSpacing: '-0.015em' }}>
                Paste from .env
              </div>
              <div style={{ fontFamily: t.font, fontSize: 12, color: t.fgMuted, marginTop: 3 }}>
                We'll parse <code style={{ fontFamily: t.mono, fontSize: 11 }}>KEY=value</code> pairs and merge them in. Comments and blank lines are skipped.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, minHeight: 0 }}>
              <div style={{
                padding: '14px 18px', borderRight: `1px solid ${t.borderSoft}`,
                display: 'flex', flexDirection: 'column', minHeight: 0,
              }}>
                <div style={{
                  fontFamily: t.font, fontSize: 10.5, fontWeight: 600, color: t.fgFaint,
                  letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8,
                }}>Paste</div>
                <textarea defaultValue={sample} style={{
                  flex: 1, fontFamily: t.mono, fontSize: 11.5, color: t.fg,
                  background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 7,
                  padding: 12, resize: 'none', outline: 'none', lineHeight: 1.5,
                }} />
              </div>
              <div style={{
                padding: '14px 18px', display: 'flex', flexDirection: 'column', minHeight: 0,
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8,
                }}>
                  <span style={{
                    fontFamily: t.font, fontSize: 10.5, fontWeight: 600, color: t.fgFaint,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>Preview · {parsed.length} keys</span>
                  <span style={{ fontFamily: t.font, fontSize: 11, color: t.warn }}>
                    1 conflict
                  </span>
                </div>
                <div style={{ flex: 1, overflow: 'auto' }}>
                  {parsed.map((p, i) => (
                    <div key={p.k} style={{
                      padding: '8px 10px', borderRadius: 6, marginBottom: 4,
                      background: p.conflict ? (dark ? 'rgba(229,199,122,0.10)' : 'rgba(154,122,31,0.06)') :
                                  p.new ? t.accentSoft : (dark ? 'rgba(255,255,255,0.03)' : 'rgba(20,15,10,0.025)'),
                      border: `1px solid ${p.conflict ? (dark ? 'rgba(229,199,122,0.30)' : 'rgba(154,122,31,0.20)') : 'transparent'}`,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontFamily: t.mono, fontSize: 11.5, color: t.fg, fontWeight: 600 }}>{p.k}</span>
                        <span style={{
                          fontFamily: t.mono, fontSize: 9.5, fontWeight: 600,
                          color: p.conflict ? t.warn : p.new ? t.accent : t.fgFaint,
                        }}>{p.conflict ? 'OVERWRITE' : p.new ? 'NEW' : 'SAME'}</span>
                      </div>
                      <div style={{
                        fontFamily: t.mono, fontSize: 10.5, color: t.fgMuted,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{p.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              padding: '12px 22px', borderTop: `1px solid ${t.borderSoft}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(20,15,10,0.02)',
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                <span style={{
                  width: 14, height: 14, borderRadius: 4,
                  background: t.accent, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><IconCheck w={9} s={2.4}/></span>
                <span style={{ fontFamily: t.font, fontSize: 12, color: t.fg }}>
                  Overwrite existing keys
                </span>
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={paneBtn(t, 'ghost')}>Cancel</button>
                <button style={paneBtn(t, 'primary')}>Merge 6 keys</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

function FieldP({ t, label, sub, hint, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6,
        gap: 12,
      }}>
        <span style={{
          fontFamily: t.font, fontSize: 11, fontWeight: 600, color: t.fgMuted,
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>{label}</span>
        {sub && <span style={{ fontFamily: t.mono, fontSize: 10.5, color: t.fgFaint, whiteSpace: 'nowrap' }}>{sub}</span>}
      </div>
      {children}
      {hint && <div style={{
        fontFamily: t.font, fontSize: 11, color: t.fgFaint, marginTop: 5,
      }}>{hint}</div>}
    </div>
  );
}

Object.assign(window, {
  PaneOnboarding, PaneClusterPicker, PaneCreateModal, PaneDeleteModal,
  PaneSettings, PaneCommandK, PanePasteEnv,
});
