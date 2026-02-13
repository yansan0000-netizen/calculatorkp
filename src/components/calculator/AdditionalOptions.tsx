import { useCalculator } from "@/context/CalculatorContext";
import { Sliders } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdditionalOptions = () => {
  const {
    capCollection, setCapCollection,
    designBypass, setDesignBypass,
    roofMaterial, setRoofMaterial,
    capCollections, designBypasses, roofMaterials,
  } = useCalculator();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sliders className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Дополнительные параметры</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-bold text-foreground">Коллекция колпаков</label>
          <Select value={capCollection} onValueChange={setCapCollection}>
            <SelectTrigger className="mt-1 bg-muted border-0 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card rounded-xl">
              {capCollections.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-bold text-foreground">Дизайнерские обходы</label>
          <Select value={designBypass} onValueChange={setDesignBypass}>
            <SelectTrigger className="mt-1 bg-muted border-0 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card rounded-xl">
              {designBypasses.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-bold text-foreground">Материал кровли</label>
          <Select value={roofMaterial} onValueChange={setRoofMaterial}>
            <SelectTrigger className="mt-1 bg-muted border-0 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card rounded-xl">
              {roofMaterials.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AdditionalOptions;
