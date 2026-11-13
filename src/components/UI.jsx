import React from 'react';

export function Title({ tag, title, children }) {
  return <div className="page-title"><div><p className="eyebrow">{tag}</p><h1>{title}</h1></div>{children}</div>;
}
export function Stat({ label, value, detail }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>;
}
export function Empty({ children }) {
  return <div className="empty">{children}</div>;
}
export function Field({ label, ...props }) {
  return <label>{label}<input {...props} /></label>;
}
export function Locked({ go, children }) {
  return <div className="locked-panel"><div><b>🔒 Conteúdo reservado</b><p>{children}</p></div><button className="outline" onClick={() => go('planos')}>Ver planos</button></div>;
}
export function Chart({ rows }) {
  const sorted = [...rows].sort((a, b) => a.measured_at.localeCompare(b.measured_at));
  if (sorted.length < 2) return <Empty>Registe pelo menos duas medidas para visualizar a sua evolução.</Empty>;
  const values = sorted.map((x) => Number(x.weight));
  const min = Math.min(...values) - 1;
  const max = Math.max(...values) + 1;
  const pts = values.map((v, i) => `${20 + i * 600 / (values.length - 1)},${180 - (v - min) / (max - min) * 150}`).join(' ');
  return <figure className="chart-figure"><svg viewBox="0 0 640 210" role="img" aria-label={`Peso: ${values[0]} para ${values.at(-1)} kg`}><line x1="20" y1="185" x2="620" y2="185" stroke="#444"/><polyline points={pts} fill="none" stroke="#d6a84f" strokeWidth="3"/>{values.map((v, i) => <circle key={i} cx={20 + i * 600 / (values.length - 1)} cy={180 - (v - min) / (max - min) * 150} r="4" fill="#d6a84f" />)}</svg><figcaption>{sorted[0].measured_at}: {values[0]} kg → {sorted.at(-1).measured_at}: {values.at(-1)} kg</figcaption></figure>;
}
export function LeoMascot({ size = 64, className = '', label = 'Leo, mascote do JL Trainer' }) {
  return (
    <svg className={`leo-mascot ${className}`.trim()} width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="109" rx="29" ry="6" fill="rgba(0,0,0,.18)" />
      <g className="leo-tail"><path d="M84 88 C103 88 110 101 101 108 C95 113 87 108 90 102" fill="none" stroke="#A95D25" strokeWidth="7" strokeLinecap="round"/><path d="M98 101 C105 96 113 99 113 105 C113 111 106 114 100 109Z" fill="#D98A35" /></g>
      <path d="M60 7 C69 4 76 10 81 14 C91 12 99 19 99 29 C108 36 108 46 103 54 C110 64 105 74 98 80 C99 91 90 99 80 98 C73 108 64 111 56 106 C47 111 37 106 32 98 C21 99 14 91 17 80 C8 73 8 62 14 54 C8 45 11 35 20 29 C20 18 30 12 40 15 C46 7 53 4 60 7Z" fill="#B9682B" stroke="#87451F" strokeWidth="2" />
      <path d="M35 32 C40 23 50 19 60 20 C73 19 84 26 88 37 C94 50 91 70 83 80 C76 89 68 93 60 93 C49 93 39 86 33 76 C26 63 27 44 35 32Z" fill="#F3C36D" stroke="#A95D25" strokeWidth="2" />
      <path d="M34 37 C25 31 27 23 34 21 C41 20 45 27 43 34Z" fill="#E5A44D" stroke="#87451F" strokeWidth="2" />
      <path d="M77 34 C75 26 80 20 87 22 C94 25 93 33 85 38Z" fill="#E5A44D" stroke="#87451F" strokeWidth="2" />
      <path d="M42 48 C46 44 52 44 55 48 M65 48 C69 44 75 44 78 48" fill="none" stroke="#75401F" strokeWidth="3" strokeLinecap="round" />
      <ellipse className="leo-eye" cx="49" cy="54" rx="3.8" ry="5" fill="#2D211C" />
      <ellipse className="leo-eye" cx="71" cy="54" rx="3.8" ry="5" fill="#2D211C" />
      <ellipse cx="60" cy="70" rx="18" ry="13" fill="#FFE2A7" />
      <path d="M54 66 Q60 61 66 66 Q65 73 60 73 Q55 73 54 66Z" fill="#61351F" />
      <path d="M60 73 C58 80 51 80 48 76 M60 73 C62 80 69 80 72 76" fill="none" stroke="#61351F" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="40" cy="68" r="4" fill="#E98D69" opacity=".55" />
      <circle cx="80" cy="68" r="4" fill="#E98D69" opacity=".55" />
      <path d="M42 94 C45 87 53 84 60 85 C67 84 75 87 78 94 L82 106 L38 106Z" fill="#D99A38" stroke="#87451F" strokeWidth="2" />
      <path d="M49 95 L60 103 L71 95" fill="none" stroke="#F9E1A8" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 103 L60 109" stroke="#87451F" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
