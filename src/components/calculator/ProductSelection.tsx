import { useCalculator } from "@/context/CalculatorContext";
import { capModels, boxModels, flashingModels, CapModel, BoxModel, FlashingModel } from "@/data/calculatorData";
import { Crown, Box, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import capClassicImg from "@/assets/cap-classic.jpg";
import capModernImg from "@/assets/cap-modern.jpg";
import boxSmoothImg from "@/assets/box-smooth.jpg";
import flashingImg from "@/assets/flashing.jpg";

const capImages: Record<string, string> = {
  classic_simple: capClassicImg,
  classic_slatted: capClassicImg,
  modern_simple: capModernImg,
  modern_slatted: capModernImg,
};

const boxImages: Record<string, string> = {
  smooth: boxSmoothImg,
  lamellar: boxSmoothImg,
};

type Section<T extends string> = {
  title: string;
  icon: React.ReactNode;
  items: { id: T; name: string; description: string }[];
  value: T;
  onChange: (v: T) => void;
  images?: Record<string, string>;
};

function SelectionGroup<T extends string>({ title, icon, items, value, onChange, images }: Section<T>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => {
          const selected = value === item.id;
          const img = images?.[item.id];
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(item.id)}
              className={`text-left p-3 rounded-xl border-2 transition-all duration-200 ${
                selected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-muted hover:border-primary/30"
              }`}
            >
              <div className="flex gap-3 items-center">
                {img && (
                  <img src={img} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${selected ? "text-primary" : "text-foreground"}`}>
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                  selected ? "border-primary bg-primary" : "border-muted-foreground/30"
                }`}>
                  <AnimatePresence>
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="w-full h-full rounded-full bg-primary"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

const ProductSelection = () => {
  const { capModel, setCapModel, boxModel, setBoxModel, flashingModel, setFlashingModel } = useCalculator();

  return (
    <div className="space-y-8">
      <SelectionGroup<CapModel>
        title="Модель колпака"
        icon={<Crown className="w-5 h-5 text-primary" />}
        items={capModels}
        value={capModel}
        onChange={setCapModel}
        images={capImages}
      />
      <SelectionGroup<BoxModel>
        title="Модель короба"
        icon={<Box className="w-5 h-5 text-primary" />}
        items={boxModels}
        value={boxModel}
        onChange={setBoxModel}
        images={boxImages}
      />
      <SelectionGroup<FlashingModel>
        title="Тип оклада"
        icon={<Layers className="w-5 h-5 text-primary" />}
        items={flashingModels}
        value={flashingModel}
        onChange={setFlashingModel}
        images={{ flat: flashingImg, profiled: flashingImg }}
      />
    </div>
  );
};

export default ProductSelection;
