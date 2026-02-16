import { useCalculator } from "@/context/CalculatorContext";
import { Input } from "@/components/ui/input";
import { Ruler } from "lucide-react";
import { motion } from "framer-motion";

const fields = [
  { key: "dimensionX" as const, label: "X", unit: "мм", desc: "ширина трубы" },
  { key: "dimensionY" as const, label: "Y", unit: "мм", desc: "глубина трубы" },
  { key: "dimensionH" as const, label: "H", unit: "мм", desc: "высота над кровлей" },
  { key: "roofAngle" as const, label: "α", unit: "°", desc: "угол наклона кровли" },
];

const setters = {
  dimensionX: "setDimensionX",
  dimensionY: "setDimensionY",
  dimensionH: "setDimensionH",
  roofAngle: "setRoofAngle",
} as const;

const DimensionsForm = () => {
  const calc = useCalculator();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <div className="flex items-center gap-2">
        <Ruler className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Размеры трубы</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {fields.map((f, i) => (
          <motion.div
            key={f.key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
          >
            <label className="text-sm font-bold text-foreground">
              {f.label} <span className="text-muted-foreground font-normal">({f.desc})</span>
            </label>
            <div className="relative mt-1">
              <Input
                type="number"
                value={calc[f.key]}
                onChange={(e) => (calc as any)[setters[f.key]](Number(e.target.value))}
                className="bg-muted border-0 rounded-xl pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {f.unit}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DimensionsForm;
