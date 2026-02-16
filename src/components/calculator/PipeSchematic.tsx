import { motion } from "framer-motion";

const PipeSchematic = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center justify-center"
    >
      <svg
        viewBox="0 0 320 280"
        className="w-full max-w-[280px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Roof surface */}
        <path
          d="M20 220 L160 140 L300 220"
          stroke="hsl(220, 30%, 60%)"
          strokeWidth="3"
          fill="hsl(220, 20%, 94%)"
          opacity="0.5"
        />

        {/* Chimney body */}
        <rect
          x="115"
          y="60"
          width="90"
          height="160"
          rx="2"
          fill="hsl(220, 16%, 93%)"
          stroke="hsl(220, 65%, 38%)"
          strokeWidth="2"
        />

        {/* Chimney cap */}
        <path
          d="M105 60 L160 35 L215 60"
          fill="hsl(220, 20%, 88%)"
          stroke="hsl(220, 65%, 38%)"
          strokeWidth="2"
        />

        {/* X dimension arrow (width) */}
        <line x1="115" y1="245" x2="205" y2="245" stroke="hsl(38, 75%, 50%)" strokeWidth="2" markerEnd="url(#arrowR)" markerStart="url(#arrowL)" />
        <text x="160" y="262" textAnchor="middle" fill="hsl(38, 75%, 45%)" fontSize="14" fontWeight="800" fontFamily="Nunito, sans-serif">X</text>

        {/* Y dimension arrow (depth - shown as perspective) */}
        <line x1="205" y1="60" x2="240" y2="80" stroke="hsl(0, 72%, 51%)" strokeWidth="2" strokeDasharray="4 2" />
        <text x="248" y="78" textAnchor="start" fill="hsl(0, 72%, 51%)" fontSize="14" fontWeight="800" fontFamily="Nunito, sans-serif">Y</text>

        {/* H dimension arrow (height above roof) */}
        <line x1="90" y1="170" x2="90" y2="60" stroke="hsl(155, 55%, 38%)" strokeWidth="2" markerEnd="url(#arrowU)" markerStart="url(#arrowD)" />
        <text x="78" y="118" textAnchor="end" fill="hsl(155, 55%, 38%)" fontSize="14" fontWeight="800" fontFamily="Nunito, sans-serif">H</text>

        {/* Alpha angle arc */}
        <path
          d="M220 220 Q 200 200, 210 185"
          stroke="hsl(280, 60%, 50%)"
          strokeWidth="2"
          fill="none"
        />
        <text x="228" y="200" textAnchor="start" fill="hsl(280, 60%, 50%)" fontSize="14" fontWeight="800" fontFamily="Nunito, sans-serif">α</text>

        {/* Roof line at chimney intersection */}
        <line x1="115" y1="170" x2="205" y2="170" stroke="hsl(220, 65%, 38%)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Arrow markers */}
        <defs>
          <marker id="arrowR" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" fill="hsl(38, 75%, 50%)" />
          </marker>
          <marker id="arrowL" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto">
            <path d="M8 0 L0 4 L8 8 Z" fill="hsl(38, 75%, 50%)" />
          </marker>
          <marker id="arrowU" markerWidth="8" markerHeight="8" refX="4" refY="2" orient="auto">
            <path d="M0 8 L4 0 L8 8 Z" fill="hsl(155, 55%, 38%)" />
          </marker>
          <marker id="arrowD" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
            <path d="M0 0 L4 8 L8 0 Z" fill="hsl(155, 55%, 38%)" />
          </marker>
        </defs>
      </svg>
    </motion.div>
  );
};

export default PipeSchematic;
