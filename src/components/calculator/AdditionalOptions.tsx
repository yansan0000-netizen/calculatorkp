import { useCalculator } from "@/context/CalculatorContext";
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
      <div>
        <label className="text-sm font-medium text-foreground">Коллекция колпаков для труб (FAQ)</label>
        <Select value={capCollection} onValueChange={setCapCollection}>
          <SelectTrigger className="mt-1 bg-muted border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {capCollections.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Дизайнерские обходы <span className="text-primary">(FAQ)</span></label>
        <Select value={designBypass} onValueChange={setDesignBypass}>
          <SelectTrigger className="mt-1 bg-muted border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {designBypasses.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Материал кровли (FAQ)</label>
        <Select value={roofMaterial} onValueChange={setRoofMaterial}>
          <SelectTrigger className="mt-1 bg-muted border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {roofMaterials.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AdditionalOptions;
