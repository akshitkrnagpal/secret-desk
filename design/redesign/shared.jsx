// shared.jsx — common primitives: window chrome, icons, sample data
// Loaded after react/react-dom/babel.

const SAMPLE_NAMESPACES = [
  { name: 'default', count: 12 },
  { name: 'api-gateway', count: 6 },
  { name: 'auth-service', count: 4 },
  { name: 'monitoring', count: 9 },
  { name: 'payments', count: 7 },
  { name: 'web-frontend', count: 3 },
];

const SAMPLE_SECRETS = [
  { name: 'database-credentials', type: 'Opaque', keys: 6, age: '14d' },
  { name: 'api-tokens', type: 'Opaque', keys: 4, age: '3d' },
  { name: 'tls-cert', type: 'kubernetes.io/tls', keys: 2, age: '62d' },
  { name: 'docker-registry', type: 'kubernetes.io/dockerconfigjson', keys: 1, age: '120d' },
  { name: 'oauth-client', type: 'Opaque', keys: 3, age: '7d' },
  { name: 'redis-auth', type: 'Opaque', keys: 2, age: '28d' },
];

const SAMPLE_KV = [
  { k: 'DB_HOST', v: 'postgres-primary.prod.internal.cluster.local', show: false },
  { k: 'DB_PORT', v: '5432', show: false },
  { k: 'DB_USER', v: 'service_account', show: false },
  { k: 'DB_PASSWORD', v: 'Pg_K9aLm2!Vx7$qZbR', show: false },
  { k: 'DB_NAME', v: 'orders_production', show: false },
  { k: 'CONNECTION_STRING', v: 'postgresql://service_account:Pg_K9aLm2!Vx7$qZbR@postgres-primary:5432/orders_production', show: false },
];

// ─── window chrome ───────────────────────────────────────────────────
function TrafficLights({ size = 12 }) {
  const dot = (bg) => (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg }} />
  );
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      {dot('#ff5f57')}{dot('#febc2e')}{dot('#28c840')}
    </div>
  );
}

// Generic chromeless window — caller provides everything inside, including bg.
function AppWindow({ width = 1100, height = 720, radius = 12, children, shadow, border }) {
  return (
    <div style={{
      width, height, borderRadius: radius, overflow: 'hidden',
      boxShadow: shadow || '0 24px 60px -12px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.15)',
      border: border || 'none',
      position: 'relative', display: 'flex', flexDirection: 'column',
    }}>
      {children}
    </div>
  );
}

// ─── icons (lucide-ish, monoline) ────────────────────────────────────
const I = ({ d, s = 1.6, w = 14, fill = 'none', stroke = 'currentColor', viewBox = '0 0 24 24', children, ...rest }) => (
  <svg width={w} height={w} viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {d ? <path d={d} /> : children}
  </svg>
);
const IconEye = (p) => <I {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></I>;
const IconEyeOff = (p) => <I {...p}><path d="m3 3 18 18"/><path d="M10.6 6.1A10 10 0 0 1 22 12s-1.3 2.6-3.8 4.7"/><path d="M6.1 6.1C3.5 7.7 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1"/><path d="M9.5 9.5a3 3 0 0 0 4.2 4.2"/></I>;
const IconTrash = (p) => <I {...p}><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6 18 20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></I>;
const IconCopy = (p) => <I {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></I>;
const IconPlus = (p) => <I {...p} d="M12 5v14M5 12h14"/>;
const IconChevron = (p) => <I {...p} d="m6 9 6 6 6-6"/>;
const IconArrowLeft = (p) => <I {...p} d="m15 18-6-6 6-6"/>;
const IconFolder = (p) => <I {...p} d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/>;
const IconKey = (p) => <I {...p}><circle cx="8" cy="15" r="4"/><path d="m10.8 12.2 8.2-8.2"/><path d="m18 5 3 3"/><path d="m15 8 3 3"/></I>;
const IconLock = (p) => <I {...p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></I>;
const IconShield = (p) => <I {...p} d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3Z"/>;
const IconSearch = (p) => <I {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></I>;
const IconCommand = (p) => <I {...p} d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3Z"/>;
const IconCheck = (p) => <I {...p} d="m5 13 4 4L19 7"/>;
const IconX = (p) => <I {...p} d="M18 6 6 18M6 6l12 12"/>;
const IconAlert = (p) => <I {...p}><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></I>;
const IconWifi = (p) => <I {...p}><path d="M5 12.55a11 11 0 0 1 14 0"/><path d="M2 8.82a16 16 0 0 1 20 0"/><path d="M8.5 16.43a6 6 0 0 1 7 0"/><path d="M12 20h.01"/></I>;
const IconSun = (p) => <I {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></I>;
const IconMoon = (p) => <I {...p} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>;
const IconCircle = (p) => <I {...p}><circle cx="12" cy="12" r="9"/></I>;
const IconDot = (p) => <I {...p} fill="currentColor" stroke="none"><circle cx="12" cy="12" r="3"/></I>;
const IconAsterisk = (p) => <I {...p} d="M12 6v12M7.76 8.24l8.48 8.48M6 12h12M7.76 15.76l8.48-8.48"/>;
const IconLayers = (p) => <I {...p}><path d="m12 2 10 6-10 6L2 8l10-6Z"/><path d="m2 16 10 6 10-6"/><path d="m2 12 10 6 10-6"/></I>;
const IconChevronDown = (p) => <I {...p} d="m6 9 6 6 6-6"/>;
const IconHash = (p) => <I {...p} d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>;
const IconClock = (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></I>;
const IconBox = (p) => <I {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.27 6.96 8.73 5.05 8.73-5.05"/><path d="M12 22.08V12"/></I>;
const IconUser = (p) => <I {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></I>;

Object.assign(window, {
  SAMPLE_NAMESPACES, SAMPLE_SECRETS, SAMPLE_KV,
  TrafficLights, AppWindow,
  IconEye, IconEyeOff, IconTrash, IconCopy, IconPlus, IconChevron, IconArrowLeft,
  IconFolder, IconKey, IconLock, IconShield, IconSearch, IconCommand,
  IconCheck, IconX, IconAlert, IconWifi, IconSun, IconMoon, IconCircle, IconDot,
  IconAsterisk, IconLayers, IconChevronDown, IconHash, IconClock, IconBox, IconUser,
});
