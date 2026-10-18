const nodes = [
  { cx: 120, cy: 150, r: 9 },
  { cx: 330, cy: 92, r: 7 },
  { cx: 410, cy: 270, r: 10 },
  { cx: 300, cy: 420, r: 8 },
  { cx: 110, cy: 360, r: 7 },
  { cx: 250, cy: 250, r: 14 },
]

export function HeroVisual() {
  const center = nodes[nodes.length - 1]
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[30rem]" aria-hidden="true">
      <div className="absolute inset-[6%] rounded-full bg-sage-soft" />
      <svg viewBox="0 0 500 500" className="relative size-full" fill="none">
        <circle cx="250" cy="250" r="225" stroke="#a9b9ac" strokeWidth="1" />
        <circle cx="250" cy="250" r="170" stroke="#1a2b48" strokeOpacity="0.14" strokeWidth="1" />
        <circle cx="250" cy="250" r="105" stroke="#1a2b48" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 6" />

        <g className="animate-drift">
          <circle cx="205" cy="250" r="92" stroke="#1a2b48" strokeWidth="1.5" />
          <circle cx="295" cy="250" r="92" stroke="#3e5245" strokeWidth="1.5" />
        </g>

        {nodes.slice(0, -1).map((node) => (
          <line
            key={`${node.cx}-${node.cy}`}
            x1={center.cx}
            y1={center.cy}
            x2={node.cx}
            y2={node.cy}
            stroke="#1a2b48"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
        ))}
        <path
          d="M120 150 Q 220 60 330 92 T 410 270 T 300 420 T 110 360 T 120 150"
          stroke="#a9b9ac"
          strokeWidth="1.2"
          fill="none"
        />

        {nodes.map((node, index) => (
          <g key={`node-${node.cx}`}>
            <circle
              cx={node.cx}
              cy={node.cy}
              r={node.r + 10}
              fill="#a9b9ac"
              className="animate-soft-pulse"
              style={{ animationDelay: `${index * 0.8}s` }}
            />
            <circle cx={node.cx} cy={node.cy} r={node.r} fill={index === nodes.length - 1 ? '#1a2b48' : '#ffffff'} stroke="#1a2b48" strokeWidth="1.5" />
          </g>
        ))}
      </svg>
    </div>
  )
}
