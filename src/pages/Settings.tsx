import { useCalculator } from "@/context/CalculatorContext";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roofAngles, metalCoatings, metalColors, capCollections, designBypasses, roofMaterials } from "@/data/calculatorData";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
  const {
    dimensionX, setDimensionX,
    dimensionY, setDimensionY,
    dimensionL, setDimensionL,
    roofAngle, setRoofAngle,
    metalCoating, setMetalCoating,
    metalColor, setMetalColor,
    capCollection, setCapCollection,
    designBypass, setDesignBypass,
    roofMaterial, setRoofMaterial,
  } = useCalculator();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="container max-w-3xl py-6">
          <h1 className="text-2xl font-bold text-foreground">Настройки вводных</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Задайте параметры по умолчанию для калькулятора
          </p>
        </div>
      </div>

      <div className="container max-w-3xl py-8">
        <div className="bg-card rounded-lg border border-border p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Размеры трубы</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">X (мм)</label>
              <Input type="number" value={dimensionX} onChange={(e) => setDimensionX(Number(e.target.value))} className="mt-1 bg-muted border-0" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Y (мм)</label>
              <Input type="number" value={dimensionY} onChange={(e) => setDimensionY(Number(e.target.value))} className="mt-1 bg-muted border-0" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">L (мм)</label>
              <Input type="number" value={dimensionL} onChange={(e) => setDimensionL(Number(e.target.value))} className="mt-1 bg-muted border-0" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Угол уклона кровли</label>
              <Select value={String(roofAngle)} onValueChange={(v) => setRoofAngle(Number(v))}>
                <SelectTrigger className="mt-1 bg-muted border-0"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  {roofAngles.map((a) => <SelectItem key={a} value={String(a)}>{a}°</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Покрытие металла</label>
              <Select value={metalCoating} onValueChange={setMetalCoating}>
                <SelectTrigger className="mt-1 bg-muted border-0"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  {metalCoatings.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Цвет металла</label>
              <Select value={metalColor} onValueChange={setMetalColor}>
                <SelectTrigger className="mt-1 bg-muted border-0"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  {metalColors.map((c) => <SelectItem key={c.code} value={c.code}>{c.code} — {c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Коллекция колпаков</label>
              <Select value={capCollection} onValueChange={setCapCollection}>
                <SelectTrigger className="mt-1 bg-muted border-0"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  {capCollections.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Дизайнерские обходы</label>
              <Select value={designBypass} onValueChange={setDesignBypass}>
                <SelectTrigger className="mt-1 bg-muted border-0"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  {designBypasses.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Материал кровли</label>
              <Select value={roofMaterial} onValueChange={setRoofMaterial}>
                <SelectTrigger className="mt-1 bg-muted border-0"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  {roofMaterials.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Link to="/">
            <Button className="bg-success text-success-foreground hover:bg-success/90 px-8 py-5 text-base font-semibold rounded-lg">
              Калькулятор системы PIPE
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
