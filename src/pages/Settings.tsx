import { useCalculator } from "@/context/CalculatorContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Trash2, Grid3x3 } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const SettingsPage = () => {
  const {
    coatings, setCoatings,
    colors, setColors,
    metalPrice, setMetalPrice,
    meshPrice, setMeshPrice,
    stainlessPrice, setStainlessPrice,
    zincPrice065, setZincPrice065,
    priceMatrix, updateMatrixPrice,
  } = useCalculator();

  const [newCoating, setNewCoating] = useState("");
  const [newColorCode, setNewColorCode] = useState("");
  const [newColorName, setNewColorName] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-header">
        <div className="container max-w-5xl py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-primary-foreground">Настройки</h1>
            <p className="text-sm text-primary-foreground/70 mt-1">Цены материалов, матрица цен и списки</p>
          </div>
          <Link to="/">
            <Button className="gradient-accent text-accent-foreground hover:opacity-90 rounded-full font-bold px-6">
              Калькулятор <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="container max-w-5xl py-8 space-y-6">
        {/* Material Prices */}
        <section className="card-soft p-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Базовые цены материалов (руб)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Цена металла", value: metalPrice, set: setMetalPrice },
              { label: "Цена сетки", value: meshPrice, set: setMeshPrice },
              { label: "Цена нержавейки", value: stainlessPrice, set: setStainlessPrice },
              { label: "Цена цинка 0,65", value: zincPrice065, set: setZincPrice065 },
            ].map(f => (
              <div key={f.label}>
                <label className="text-sm font-bold text-foreground">{f.label}</label>
                <Input type="number" value={f.value} onChange={(e) => f.set(Number(e.target.value))}
                  className="mt-1 bg-muted border-0 rounded-xl" />
              </div>
            ))}
          </div>
        </section>

        {/* Price Matrix */}
        <section className="card-soft p-8">
          <div className="flex items-center gap-2 mb-2">
            <Grid3x3 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Матрица цен на металл</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Покрытие × Цвет → цена (руб). Заполненные ячейки автоматически подставляют цену металла при выборе в калькуляторе.
          </p>

          <ScrollArea className="w-full">
            <div className="min-w-[600px]">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 bg-muted rounded-tl-lg font-bold text-foreground sticky left-0 z-10 bg-muted min-w-[140px]">
                      Покрытие \ Цвет
                    </th>
                    {colors.map(c => (
                      <th key={c.code} className="p-2 bg-muted text-center font-semibold text-foreground min-w-[70px] whitespace-nowrap">
                        {c.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coatings.map((coating, ri) => (
                    <tr key={coating} className={ri % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                      <td className="p-2 font-semibold text-foreground sticky left-0 z-10 bg-inherit min-w-[140px] whitespace-nowrap">
                        {coating}
                      </td>
                      {colors.map(color => {
                        const val = priceMatrix[coating]?.[color.code] || "";
                        return (
                          <td key={color.code} className="p-1">
                            <Input
                              type="number"
                              value={val}
                              placeholder="—"
                              onChange={(e) => updateMatrixPrice(coating, color.code, Number(e.target.value))}
                              className="h-7 w-full text-xs text-center bg-transparent border border-border/50 rounded-md p-1 focus:border-primary"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </section>

        {/* Coatings */}
        <section className="card-soft p-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Покрытия металла</h2>
          <div className="space-y-2 mb-4">
            {coatings.map((c, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2">
                <span className="text-sm text-foreground flex-1">{c}</span>
                <button onClick={() => setCoatings(coatings.filter((_, idx) => idx !== i))}
                  className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Новое покрытие" value={newCoating} onChange={(e) => setNewCoating(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && newCoating.trim()) { setCoatings([...coatings, newCoating.trim()]); setNewCoating(""); } }}
              className="bg-muted border-0 rounded-xl max-w-xs" />
            <Button variant="outline" size="sm" onClick={() => { if (newCoating.trim()) { setCoatings([...coatings, newCoating.trim()]); setNewCoating(""); } }}
              className="rounded-xl"><Plus className="w-4 h-4" /></Button>
          </div>
        </section>

        {/* Colors */}
        <section className="card-soft p-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Цвета металла</h2>
          <div className="space-y-2 mb-4">
            {colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2">
                <span className="text-sm font-bold text-foreground w-24">{c.code}</span>
                <span className="text-sm text-muted-foreground flex-1">{c.name}</span>
                <button onClick={() => setColors(colors.filter((_, idx) => idx !== i))}
                  className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Код (RAL ...)" value={newColorCode} onChange={(e) => setNewColorCode(e.target.value)}
              className="bg-muted border-0 rounded-xl w-32" />
            <Input placeholder="Название" value={newColorName} onChange={(e) => setNewColorName(e.target.value)}
              className="bg-muted border-0 rounded-xl flex-1" />
            <Button variant="outline" size="sm" onClick={() => {
              if (newColorCode.trim() && newColorName.trim()) {
                setColors([...colors, { code: newColorCode.trim(), name: newColorName.trim() }]);
                setNewColorCode(""); setNewColorName("");
              }
            }} className="rounded-xl"><Plus className="w-4 h-4" /></Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
