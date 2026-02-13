import { useCalculator } from "@/context/CalculatorContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  const {
    products, updateProductPrice,
    metalCoatings, setMetalCoatings,
    metalColors, setMetalColors,
    capCollections, setCapCollections,
    designBypasses, setDesignBypasses,
    roofMaterials, setRoofMaterials,
    coatingMultipliers, setCoatingMultipliers,
  } = useCalculator();

  // Temp inputs for adding new items
  const [newCoating, setNewCoating] = useState("");
  const [newColorCode, setNewColorCode] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [newCap, setNewCap] = useState("");
  const [newBypass, setNewBypass] = useState("");
  const [newRoof, setNewRoof] = useState("");

  const addToList = (
    list: string[],
    setList: (v: string[]) => void,
    value: string,
    clear: () => void
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (list.includes(trimmed)) {
      toast({ title: "Уже существует", variant: "destructive" });
      return;
    }
    setList([...list, trimmed]);
    clear();
  };

  const removeFromList = (list: string[], setList: (v: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="container max-w-4xl py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Настройки вводных</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Управляйте ценами изделий и значениями в списках
            </p>
          </div>
          <Link to="/">
            <Button className="bg-success text-success-foreground hover:bg-success/90">
              Калькулятор <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="container max-w-4xl py-8 space-y-8">
        {/* Product Prices */}
        <section className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Базовые цены изделий</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Базовая цена рассчитана для размеров X=100, Y=200, L=100, угол=20°. Итоговая цена пересчитывается динамически.
          </p>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4">
                <span className="text-sm text-foreground flex-1 min-w-0">
                  <span className="font-medium">{p.name}</span>
                  <span className="text-muted-foreground"> — {p.description}</span>
                </span>
                <Input
                  type="number"
                  value={p.basePrice}
                  onChange={(e) => updateProductPrice(p.id, Number(e.target.value))}
                  className="w-32 bg-muted border-0 text-right"
                />
                <span className="text-xs text-muted-foreground w-8">руб</span>
              </div>
            ))}
          </div>
        </section>

        {/* Coating Multipliers */}
        <section className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Коэффициенты покрытий</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Множитель к цене в зависимости от покрытия металла (1.0 = без наценки)
          </p>
          <div className="space-y-3">
            {metalCoatings.map((coating) => (
              <div key={coating} className="flex items-center gap-4">
                <span className="text-sm text-foreground flex-1">{coating}</span>
                <Input
                  type="number"
                  step="0.05"
                  value={coatingMultipliers[coating] ?? 1}
                  onChange={(e) =>
                    setCoatingMultipliers({ ...coatingMultipliers, [coating]: Number(e.target.value) })
                  }
                  className="w-24 bg-muted border-0 text-right"
                />
                <span className="text-xs text-muted-foreground w-4">×</span>
              </div>
            ))}
          </div>
        </section>

        {/* Editable Lists */}
        <section className="bg-card rounded-lg border border-border p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Значения в списках</h2>

          {/* Metal Coatings */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Покрытия металла</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {metalCoatings.map((c, i) => (
                <span key={c} className="inline-flex items-center gap-1 bg-muted px-3 py-1 rounded-md text-sm text-foreground">
                  {c}
                  <button onClick={() => removeFromList(metalCoatings, setMetalCoatings, i)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Новое покрытие" value={newCoating} onChange={(e) => setNewCoating(e.target.value)} className="bg-muted border-0 max-w-xs" />
              <Button variant="outline" size="sm" onClick={() => addToList(metalCoatings, setMetalCoatings, newCoating, () => setNewCoating(""))}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Metal Colors */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Цвета металла</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {metalColors.map((c, i) => (
                <span key={c.code} className="inline-flex items-center gap-1 bg-muted px-3 py-1 rounded-md text-sm text-foreground">
                  {c.code} — {c.name}
                  <button onClick={() => setMetalColors(metalColors.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input placeholder="RAL код" value={newColorCode} onChange={(e) => setNewColorCode(e.target.value)} className="bg-muted border-0 w-32" />
              <Input placeholder="Название" value={newColorName} onChange={(e) => setNewColorName(e.target.value)} className="bg-muted border-0 flex-1" />
              <Button variant="outline" size="sm" onClick={() => {
                if (!newColorCode.trim() || !newColorName.trim()) return;
                setMetalColors([...metalColors, { code: newColorCode.trim(), name: newColorName.trim() }]);
                setNewColorCode(""); setNewColorName("");
              }}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Cap Collections */}
          <EditableStringList
            title="Коллекции колпаков"
            items={capCollections}
            setItems={setCapCollections}
            newValue={newCap}
            setNewValue={setNewCap}
          />

          <Separator />

          {/* Design Bypasses */}
          <EditableStringList
            title="Дизайнерские обходы"
            items={designBypasses}
            setItems={setDesignBypasses}
            newValue={newBypass}
            setNewValue={setNewBypass}
          />

          <Separator />

          {/* Roof Materials */}
          <EditableStringList
            title="Материалы кровли"
            items={roofMaterials}
            setItems={setRoofMaterials}
            newValue={newRoof}
            setNewValue={setNewRoof}
          />
        </section>
      </div>
    </div>
  );
};

// Reusable component for editable string lists
function EditableStringList({
  title, items, setItems, newValue, setNewValue,
}: {
  title: string;
  items: string[];
  setItems: (v: string[]) => void;
  newValue: string;
  setNewValue: (v: string) => void;
}) {
  const add = () => {
    const trimmed = newValue.trim();
    if (!trimmed || items.includes(trimmed)) return;
    setItems([...items, trimmed]);
    setNewValue("");
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-foreground mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, i) => (
          <span key={item} className="inline-flex items-center gap-1 bg-muted px-3 py-1 rounded-md text-sm text-foreground">
            {item}
            <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input placeholder="Добавить..." value={newValue} onChange={(e) => setNewValue(e.target.value)} className="bg-muted border-0 max-w-xs" />
        <Button variant="outline" size="sm" onClick={add}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default SettingsPage;
