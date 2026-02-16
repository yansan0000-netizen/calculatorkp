import { useCalculator } from "@/context/CalculatorContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Trash2, Grid3x3, Building2, Upload, Image } from "lucide-react";
import { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NumericInput } from "@/components/calculator/DimensionsForm";
import { toast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const {
    coatings, setCoatings,
    colors, setColors,
    metalPrice, setMetalPrice,
    meshPrice, setMeshPrice,
    stainlessPrice, setStainlessPrice,
    zincPrice065, setZincPrice065,
    priceMatrix, updateMatrixPrice,
    companyDefaults, setCompanyDefaults,
  } = useCalculator();

  const [newCoating, setNewCoating] = useState("");
  const [newColorCode, setNewColorCode] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) {
      toast({ title: "Файл слишком большой", description: "Максимум 500 КБ", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setCompanyDefaults({ ...companyDefaults, logoDataUrl: reader.result as string });
      toast({ title: "Логотип загружен" });
    };
    reader.readAsDataURL(file);
  };

  const updateField = (field: string, value: string) => {
    setCompanyDefaults({ ...companyDefaults, [field]: value });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-header">
        <div className="container max-w-5xl py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">Настройки</h1>
            <p className="text-sm text-primary-foreground/60 mt-1">Цены, матрица, реквизиты компании</p>
          </div>
          <Link to="/">
            <Button className="gradient-accent text-accent-foreground hover:opacity-90 rounded-full font-bold px-6">
              Калькулятор <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="container max-w-5xl py-8 space-y-6">

        {/* Company Defaults */}
        <section className="card-soft p-8">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Реквизиты компании (для PDF)</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Эти данные будут автоматически подставляться в коммерческое предложение.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Logo */}
            <div className="md:col-span-2 flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-muted/50"
                onClick={() => fileInputRef.current?.click()}
              >
                {companyDefaults.logoDataUrl ? (
                  <img src={companyDefaults.logoDataUrl} className="w-full h-full object-contain" alt="Логотип" />
                ) : (
                  <Image className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Загрузить логотип
                </Button>
                {companyDefaults.logoDataUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 text-destructive"
                    onClick={() => updateField("logoDataUrl", "")}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Удалить
                  </Button>
                )}
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG до 500 КБ. Отображается в шапке PDF.</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground">Название компании</label>
              <Input value={companyDefaults.companyName} onChange={(e) => updateField("companyName", e.target.value)}
                className="mt-1 bg-muted border-0 rounded-xl" placeholder='ООО "Компания"' />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">ИНН</label>
              <Input value={companyDefaults.inn} onChange={(e) => updateField("inn", e.target.value)}
                className="mt-1 bg-muted border-0 rounded-xl" placeholder="1234567890" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-foreground">Адрес</label>
              <Input value={companyDefaults.address} onChange={(e) => updateField("address", e.target.value)}
                className="mt-1 bg-muted border-0 rounded-xl" placeholder="г. Москва, ул. Примерная, д. 1" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Телефон</label>
              <Input value={companyDefaults.phone} onChange={(e) => updateField("phone", e.target.value)}
                className="mt-1 bg-muted border-0 rounded-xl" placeholder="+7 (999) 123-45-67" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Email</label>
              <Input value={companyDefaults.email} onChange={(e) => updateField("email", e.target.value)}
                className="mt-1 bg-muted border-0 rounded-xl" placeholder="info@company.ru" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Сайт</label>
              <Input value={companyDefaults.website} onChange={(e) => updateField("website", e.target.value)}
                className="mt-1 bg-muted border-0 rounded-xl" placeholder="www.company.ru" />
            </div>
          </div>
        </section>

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
                <label className="text-sm font-semibold text-foreground">{f.label}</label>
                <NumericInput value={f.value} onChange={f.set} unit="₽"
                  className="mt-1 bg-muted border-0 rounded-xl pr-8" />
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
            Покрытие × Цвет → цена (руб). Заполненные ячейки автоматически подставляют цену металла.
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
