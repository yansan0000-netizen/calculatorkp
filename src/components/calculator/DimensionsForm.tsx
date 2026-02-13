import { useCalculator } from "@/context/CalculatorContext";
import { Input } from "@/components/ui/input";
import { Ruler } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DimensionsForm = () => {
  const {
    dimensionX, setDimensionX,
    dimensionY, setDimensionY,
    dimensionL, setDimensionL,
    roofAngle, setRoofAngle,
    metalCoating, setMetalCoating,
    metalColor, setMetalColor,
    roofAngles, metalCoatings, metalColors,
  } = useCalculator();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Ruler className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Размеры трубы</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-bold text-foreground">X <span className="text-muted-foreground font-normal">(мм)</span></label>
          <Input
            type="number"
            value={dimensionX}
            onChange={(e) => setDimensionX(Number(e.target.value))}
            className="mt-1 bg-muted border-0 rounded-xl"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-foreground">Y <span className="text-muted-foreground font-normal">(мм)</span></label>
          <Input
            type="number"
            value={dimensionY}
            onChange={(e) => setDimensionY(Number(e.target.value))}
            className="mt-1 bg-muted border-0 rounded-xl"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-foreground">Размер L <span className="text-muted-foreground font-normal">(мм)</span></label>
          <Input
            type="number"
            value={dimensionL}
            onChange={(e) => setDimensionL(Number(e.target.value))}
            className="mt-1 bg-muted border-0 rounded-xl"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-foreground">Угол уклона кровли</label>
          <Select value={String(roofAngle)} onValueChange={(v) => setRoofAngle(Number(v))}>
            <SelectTrigger className="mt-1 bg-muted border-0 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card rounded-xl">
              {roofAngles.map((angle) => (
                <SelectItem key={angle} value={String(angle)}>{angle}°</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-bold text-foreground">Покрытие металла</label>
          <Select value={metalCoating} onValueChange={setMetalCoating}>
            <SelectTrigger className="mt-1 bg-muted border-0 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card rounded-xl">
              {metalCoatings.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-bold text-foreground">Цвет металла</label>
          <Select value={metalColor} onValueChange={setMetalColor}>
            <SelectTrigger className="mt-1 bg-muted border-0 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card rounded-xl">
              {metalColors.map((c) => (
                <SelectItem key={c.code} value={c.code}>{c.code} — {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DimensionsForm;
