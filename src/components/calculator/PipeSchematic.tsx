import { motion } from "framer-motion";
import { useCalculator } from "@/context/CalculatorContext";
import { useMemo } from "react";

const PipeSchematic = () => {
  const { dimensionX, dimensionY, dimensionH, roofAngle } = useCalculator();

  // Normalize dimensions to fit SVG proportionally
  const dims = useMemo(() => {
    const maxDim = Math.max(dimensionX || 380, dimensionY || 380, dimensionH || 500, 100);
    const scale = 140 / maxDim;

    const w = Math.max((dimensionX || 380) * scale, 30);
    const h = Math.max((dimensionH || 500) * scale, 30);
    const d = Math.max((dimensionY || 380) * scale * 0.35, 10); // perspective depth
    const angle = Math.max(5, Math.min(60, roofAngle || 30));

    // Center chimney in viewport
    const cx = 160;
    const baseY = 220;
    const topY = baseY - h;

    const left = cx - w / 2;
    const right = cx + w / 2;

    // Roof slope from angle
    const roofDrop = Math.tan((angle * Math.PI) / 180) * 140;

    return { w, h, d, cx, baseY, topY, left, right, angle, roofDrop };
  }, [dimensionX, dimensionY, dimensionH, roofAngle]);

  const { w, h, d, cx, baseY, topY, left, right, angle, roofDrop } = dims;

  // Roof intersection Y at chimney edges
  const roofLeftY = baseY;
  const roofRightY = baseY;
  const roofFarLeftY = baseY + roofDrop * 0.6;
  const roofFarRightY = baseY + roofDrop * 0.6;

  // Cap peak
  const capPeakY = topY - 25;

  const spring = { type: "spring" as const, stiffness: 120, damping: 18, mass: 0.8 };

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
        <motion.path
          animate={{ d: `M20 ${baseY + roofDrop * 0.3} L${cx} ${baseY - roofDrop * 0.15} L300 ${baseY + roofDrop * 0.3}` }}
          transition={spring}
          stroke="hsl(220, 30%, 60%)"
          strokeWidth="3"
          fill="hsl(220, 20%, 94%)"
          opacity="0.5"
        />

        {/* Chimney body */}
        <motion.rect
          animate={{ x: left, y: topY, width: w, height: h }}
          transition={spring}
          rx="2"
          fill="hsl(220, 16%, 93%)"
          stroke="hsl(220, 65%, 38%)"
          strokeWidth="2"
        />

        {/* Chimney cap */}
        <motion.path
          animate={{ d: `M${left - 10} ${topY} L${cx} ${capPeakY} L${right + 10} ${topY}` }}
          transition={spring}
          fill="hsl(220, 20%, 88%)"
          stroke="hsl(220, 65%, 38%)"
          strokeWidth="2"
        />

        {/* X dimension arrow (width) */}
        <motion.line
          animate={{ x1: left, x2: right }}
          transition={spring}
          y1="252" y2="252"
          stroke="hsl(38, 75%, 50%)" strokeWidth="2"
          markerEnd="url(#arrowR)" markerStart="url(#arrowL)"
        />
        <motion.text
          animate={{ x: cx }}
          transition={spring}
          y="268" textAnchor="middle" fill="hsl(38, 75%, 45%)"
          fontSize="14" fontWeight="800" fontFamily="Nunito, sans-serif"
        >X</motion.text>

        {/* Y dimension arrow (depth - perspective) */}
        <motion.line
          animate={{ x1: right, y1: topY, x2: right + d, y2: topY + d * 0.6 }}
          transition={spring}
          stroke="hsl(0, 72%, 51%)" strokeWidth="2" strokeDasharray="4 2"
        />
        <motion.text
          animate={{ x: right + d + 8, y: topY + d * 0.5 }}
          transition={spring}
          textAnchor="start" fill="hsl(0, 72%, 51%)"
          fontSize="14" fontWeight="800" fontFamily="Nunito, sans-serif"
        >Y</motion.text>

        {/* H dimension arrow (height) */}
        <motion.line
          animate={{ x1: left - 25, y1: baseY, x2: left - 25, y2: topY }}
          transition={spring}
          stroke="hsl(155, 55%, 38%)" strokeWidth="2"
          markerEnd="url(#arrowU)" markerStart="url(#arrowD)"
        />
        <motion.text
          animate={{ x: left - 37, y: (baseY + topY) / 2 + 5 }}
          transition={spring}
          textAnchor="end" fill="hsl(155, 55%, 38%)"
          fontSize="14" fontWeight="800" fontFamily="Nunito, sans-serif"
        >H</motion.text>

        {/* Alpha angle arc */}
        <motion.path
          animate={{
            d: `M${right + 20} ${baseY} Q ${right + 5} ${baseY - 15}, ${right + 10} ${baseY - 30}`
          }}
          transition={spring}
          stroke="hsl(280, 60%, 50%)"
          strokeWidth="2"
          fill="none"
        />
        <motion.text
          animate={{ x: right + 28, y: baseY - 10 }}
          transition={spring}
          textAnchor="start" fill="hsl(280, 60%, 50%)"
          fontSize="14" fontWeight="800" fontFamily="Nunito, sans-serif"
        >α</motion.text>

        {/* Roof line at chimney intersection */}
        <motion.line
          animate={{ x1: left, x2: right, y1: baseY, y2: baseY }}
          transition={spring}
          stroke="hsl(220, 65%, 38%)" strokeWidth="1" strokeDasharray="3 3"
        />

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
