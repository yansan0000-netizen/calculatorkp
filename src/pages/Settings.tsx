import { useCalculator } from "@/context/CalculatorContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/data/calculatorData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SettingsPage = () => {
  const {
    products, setProducts, updateProductPrice,
    metalCoatings, setMetalCoatings,
    metalColors, setMetalColors,
    capCollections, setCapCollections,
    designBypasses, setDesignBypasses,
    roofMaterials, setRoofMaterials,
    coatingMultipliers, setCoatingMultipliers,
  } = useCalculator();

  // New product form
  const [newProduct, setNewProduct] = useState({ name: "", description: "", basePrice: 0, category: "addon" as "main" | "addon", priceType: "perimeter" as Product["priceType"] });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState({ name: "", description: "" });

  // New coating
  const [newCoatingName, setNewCoatingName] = useState("");
  const [newCoatingMult, setNewCoatingMult] = useState(1);
  const [editingCoating, setEditingCoating] = useState<string | null>(null);
  const [editCoatingName, setEditCoatingName] = useState("");

  // Lists
  const [newColorCode, setNewColorCode] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [newCap, setNewCap] = useState("");
  const [newBypass, setNewBypass] = useState("");
  const [newRoof, setNewRoof] = useState("");

  const addProduct = () => {
    if (!newProduct.name.trim()) { toast({ title: "Введите название", variant: "destructive" }); return; }
    const id = newProduct.name.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();
    setProducts([...products, { id, ...newProduct, name: newProduct.name.trim(), description: newProduct.description.trim() }]);
    setNewProduct({ name: "", description: "", basePrice: 0, category: "addon", priceType: "perimeter" });
    toast({ title: "Изделие добавлено" });
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast({ title: "Изделие удалено" });
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setEditProduct({ name: p.name, description: p.description });
  };

  const saveEditProduct = () => {
    if (!editingProductId) return;
    setProducts(products.map((p) => p.id === editingProductId ? { ...p, name: editProduct.name, description: editProduct.description } : p));
    setEditingProductId(null);
    toast({ title: "Изделие обновлено" });
  };

  const addCoating = () => {
    const name = newCoatingName.trim();
    if (!name) return;
    if (metalCoatings.includes(name)) { toast({ title: "Уже существует", variant: "destructive" }); return; }
    setMetalCoatings([...metalCoatings, name]);
    setCoatingMultipliers({ ...coatingMultipliers, [name]: newCoatingMult });
    setNewCoatingName("");
    setNewCoatingMult(1);
  };

  const removeCoating = (coating: string) => {
    setMetalCoatings(metalCoatings.filter((c) => c !== coating));
    const newMults = { ...coatingMultipliers };
    delete newMults[coating];
    setCoatingMultipliers(newMults);
  };

  const startEditCoating = (coating: string) => {
    setEditingCoating(coating);
    setEditCoatingName(coating);
  };

  const saveEditCoating = () => {
    if (!editingCoating) return;
    const newName = editCoatingName.trim();
    if (!newName || (newName !== editingCoating && metalCoatings.includes(newName))) return;
    setMetalCoatings(metalCoatings.map((c) => c === editingCoating ? newName : c));
    if (newName !== editingCoating) {
      const newMults = { ...coatingMultipliers };
      newMults[newName] = newMults[editingCoating] ?? 1;
      delete newMults[editingCoating];
      setCoatingMultipliers(newMults);
    }
    setEditingCoating(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-header">
        <div className="container max-w-4xl py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-primary-foreground">Настройки</h1>
            <p className="text-sm text-primary-foreground/70 mt-1">
              Управляйте ценами, коэффициентами и списками
            </p>
          </div>
          <Link to="/">
            <Button className="gradient-accent text-accent-foreground hover:opacity-90 rounded-full font-bold px-6">
              Калькулятор <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="container max-w-4xl py-8 space-y-6">
        {/* Product Prices */}
        <section className="card-soft p-8">
          <h2 className="text-lg font-bold text-foreground mb-1">Базовые цены изделий</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Базовая цена для X=100, Y=200, L=100, угол=20°. Итоговая цена пересчитывается динамически.
          </p>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
                {editingProductId === p.id ? (
                  <>
                    <Input value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} className="bg-card border-0 rounded-xl font-bold flex-1" />
                    <Input value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} className="bg-card border-0 rounded-xl flex-1" />
                    <button onClick={saveEditProduct} className="text-success hover:text-success/80"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setEditingProductId(null)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-foreground flex-1 min-w-0">
                      <span className="font-bold">{p.name}</span>
                      <span className="text-muted-foreground"> — {p.description}</span>
                    </span>
                    <Input
                      type="number"
                      value={p.basePrice}
                      onChange={(e) => updateProductPrice(p.id, Number(e.target.value))}
                      className="w-28 bg-card border-0 text-right rounded-xl font-bold"
                    />
                    <span className="text-xs text-muted-foreground">руб</span>
                    <button onClick={() => startEditProduct(p)} className="text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => removeProduct(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </>
                )}
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Add new product */}
          <h3 className="text-sm font-bold text-foreground mb-3">Добавить изделие</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <Input placeholder="Название" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="bg-muted border-0 rounded-xl" />
            <Input placeholder="Описание" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="bg-muted border-0 rounded-xl" />
            <Input type="number" placeholder="Базовая цена" value={newProduct.basePrice || ""} onChange={(e) => setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })} className="bg-muted border-0 rounded-xl" />
            <div className="flex gap-2">
              <Select value={newProduct.category} onValueChange={(v) => setNewProduct({ ...newProduct, category: v as "main" | "addon" })}>
                <SelectTrigger className="bg-muted border-0 rounded-xl flex-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card rounded-xl">
                  <SelectItem value="main">Основное</SelectItem>
                  <SelectItem value="addon">Дополнение</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newProduct.priceType} onValueChange={(v) => setNewProduct({ ...newProduct, priceType: v as Product["priceType"] })}>
                <SelectTrigger className="bg-muted border-0 rounded-xl flex-1"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card rounded-xl">
                  <SelectItem value="perimeter">Периметр</SelectItem>
                  <SelectItem value="area">Площадь</SelectItem>
                  <SelectItem value="length">Длина</SelectItem>
                  <SelectItem value="fixed">Фикс</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addProduct} className="bg-primary text-primary-foreground rounded-xl font-bold">
            <Plus className="w-4 h-4 mr-1" /> Добавить изделие
          </Button>
        </section>

        {/* Coating Multipliers */}
        <section className="card-soft p-8">
          <h2 className="text-lg font-bold text-foreground mb-1">Коэффициенты покрытий</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Множитель к цене (1.0 = без наценки)
          </p>
          <div className="space-y-3">
            {metalCoatings.map((coating) => (
              <div key={coating} className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
                {editingCoating === coating ? (
                  <>
                    <Input value={editCoatingName} onChange={(e) => setEditCoatingName(e.target.value)} className="bg-card border-0 rounded-xl flex-1 font-bold" />
                    <button onClick={saveEditCoating} className="text-success hover:text-success/80"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setEditingCoating(null)} className="text-muted-foreground hover:text-destructive"><X className="w-4 h-4" /></button>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold text-foreground flex-1">{coating}</span>
                    <Input
                      type="number"
                      step="0.05"
                      value={coatingMultipliers[coating] ?? 1}
                      onChange={(e) => setCoatingMultipliers({ ...coatingMultipliers, [coating]: Number(e.target.value) })}
                      className="w-24 bg-card border-0 text-right rounded-xl font-bold"
                    />
                    <span className="text-xs text-muted-foreground">×</span>
                    <button onClick={() => startEditCoating(coating)} className="text-muted-foreground hover:text-primary"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => removeCoating(coating)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </>
                )}
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <h3 className="text-sm font-bold text-foreground mb-3">Добавить покрытие</h3>
          <div className="flex gap-2">
            <Input placeholder="Название покрытия" value={newCoatingName} onChange={(e) => setNewCoatingName(e.target.value)} className="bg-muted border-0 rounded-xl flex-1" />
            <Input type="number" step="0.05" placeholder="Коэфф." value={newCoatingMult || ""} onChange={(e) => setNewCoatingMult(Number(e.target.value))} className="bg-muted border-0 rounded-xl w-24" />
            <Button onClick={addCoating} variant="outline" className="rounded-xl"><Plus className="w-4 h-4" /></Button>
          </div>
        </section>

        {/* Editable Lists */}
        <section className="card-soft p-8 space-y-6">
          <h2 className="text-lg font-bold text-foreground">Значения в списках</h2>

          {/* Metal Colors */}
          <EditableColorList
            title="Цвета металла"
            items={metalColors}
            setItems={setMetalColors}
            newCode={newColorCode}
            setNewCode={setNewColorCode}
            newName={newColorName}
            setNewName={setNewColorName}
          />

          <Separator />

          <EditableStringList title="Коллекции колпаков" items={capCollections} setItems={setCapCollections} newValue={newCap} setNewValue={setNewCap} />
          <Separator />
          <EditableStringList title="Дизайнерские обходы" items={designBypasses} setItems={setDesignBypasses} newValue={newBypass} setNewValue={setNewBypass} />
          <Separator />
          <EditableStringList title="Материалы кровли" items={roofMaterials} setItems={setRoofMaterials} newValue={newRoof} setNewValue={setNewRoof} />
        </section>
      </div>
    </div>
  );
};

// Editable string list with inline edit
function EditableStringList({ title, items, setItems, newValue, setNewValue }: {
  title: string; items: string[]; setItems: (v: string[]) => void; newValue: string; setNewValue: (v: string) => void;
}) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editVal, setEditVal] = useState("");

  const add = () => {
    const trimmed = newValue.trim();
    if (!trimmed || items.includes(trimmed)) return;
    setItems([...items, trimmed]);
    setNewValue("");
  };

  const startEdit = (i: number) => { setEditingIdx(i); setEditVal(items[i]); };
  const saveEdit = () => {
    if (editingIdx === null) return;
    const trimmed = editVal.trim();
    if (!trimmed) return;
    setItems(items.map((item, i) => i === editingIdx ? trimmed : item));
    setEditingIdx(null);
  };

  return (
    <div>
      <h3 className="text-sm font-bold text-foreground mb-3">{title}</h3>
      <div className="space-y-2 mb-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2">
            {editingIdx === i ? (
              <>
                <Input value={editVal} onChange={(e) => setEditVal(e.target.value)} className="bg-card border-0 rounded-xl flex-1 h-8 text-sm" />
                <button onClick={saveEdit} className="text-success"><Check className="w-4 h-4" /></button>
                <button onClick={() => setEditingIdx(null)} className="text-muted-foreground"><X className="w-4 h-4" /></button>
              </>
            ) : (
              <>
                <span className="text-sm text-foreground flex-1">{item}</span>
                <button onClick={() => startEdit(i)} className="text-muted-foreground hover:text-primary"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input placeholder="Добавить..." value={newValue} onChange={(e) => setNewValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} className="bg-muted border-0 rounded-xl max-w-xs" />
        <Button variant="outline" size="sm" onClick={add} className="rounded-xl"><Plus className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}

// Editable color list with code + name
function EditableColorList({ title, items, setItems, newCode, setNewCode, newName, setNewName }: {
  title: string; items: { code: string; name: string }[]; setItems: (v: { code: string; name: string }[]) => void;
  newCode: string; setNewCode: (v: string) => void; newName: string; setNewName: (v: string) => void;
}) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editName, setEditName] = useState("");

  const add = () => {
    if (!newCode.trim() || !newName.trim()) return;
    setItems([...items, { code: newCode.trim(), name: newName.trim() }]);
    setNewCode(""); setNewName("");
  };

  const startEdit = (i: number) => { setEditingIdx(i); setEditCode(items[i].code); setEditName(items[i].name); };
  const saveEdit = () => {
    if (editingIdx === null) return;
    setItems(items.map((item, i) => i === editingIdx ? { code: editCode.trim(), name: editName.trim() } : item));
    setEditingIdx(null);
  };

  return (
    <div>
      <h3 className="text-sm font-bold text-foreground mb-3">{title}</h3>
      <div className="space-y-2 mb-3">
        {items.map((c, i) => (
          <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-2">
            {editingIdx === i ? (
              <>
                <Input value={editCode} onChange={(e) => setEditCode(e.target.value)} className="bg-card border-0 rounded-xl w-28 h-8 text-sm" />
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-card border-0 rounded-xl flex-1 h-8 text-sm" />
                <button onClick={saveEdit} className="text-success"><Check className="w-4 h-4" /></button>
                <button onClick={() => setEditingIdx(null)} className="text-muted-foreground"><X className="w-4 h-4" /></button>
              </>
            ) : (
              <>
                <span className="text-sm text-foreground flex-1"><span className="font-bold">{c.code}</span> — {c.name}</span>
                <button onClick={() => startEdit(i)} className="text-muted-foreground hover:text-primary"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input placeholder="RAL код" value={newCode} onChange={(e) => setNewCode(e.target.value)} className="bg-muted border-0 rounded-xl w-28" />
        <Input placeholder="Название цвета" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-muted border-0 rounded-xl flex-1" />
        <Button variant="outline" size="sm" onClick={add} className="rounded-xl"><Plus className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}

export default SettingsPage;
