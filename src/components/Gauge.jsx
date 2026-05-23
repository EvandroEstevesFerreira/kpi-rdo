// Gauge semicircular de conformidade (0–100)
export default function Gauge({ valor = 0, label = 'Conformidade' }) {
  const v = Math.max(0, Math.min(100, valor));
  const cor   = v >= 85 ? '#16a34a' : v >= 70 ? '#d97706' : '#cf2927';
  const status = v >= 85 ? 'Saudável' : v >= 70 ? 'Atenção' : 'Crítico';
  const bg    = v >= 85 ? '#dcfce7' : v >= 70 ? '#fef3c7' : '#fee2e2';

  // Semicircle path: raio 80, centro (100, 100)
  const R = 80;
  const CX = 100, CY = 100;
  const angle = Math.PI * (1 - v / 100); // 180° -> 0°
  const x2 = CX + R * Math.cos(angle);
  const y2 = CY - R * Math.sin(angle);
  const largeArc = v > 50 ? 1 : 0;

  return (
    <div className="gauge">
      <svg viewBox="0 0 200 120">
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke="#e3e3e8"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {v > 0 && (
          <path
            d={`M ${CX - R} ${CY} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`}
            fill="none"
            stroke={cor}
            strokeWidth="16"
            strokeLinecap="round"
          />
        )}
        <text
          x="20"  y="118" fontSize="10" fill="#6b6b6b"
          fontFamily="Barlow, sans-serif">0</text>
        <text
          x="100" y="118" fontSize="10" fill="#6b6b6b" textAnchor="middle"
          fontFamily="Barlow, sans-serif">50</text>
        <text
          x="180" y="118" fontSize="10" fill="#6b6b6b" textAnchor="end"
          fontFamily="Barlow, sans-serif">100</text>
      </svg>
      <span className="gauge-value" style={{ color: cor }}>
        {v}<span style={{ fontSize: 22 }}>%</span>
      </span>
      <span className="gauge-status" style={{ background: bg, color: cor }}>
        {label} — {status}
      </span>
    </div>
  );
}
