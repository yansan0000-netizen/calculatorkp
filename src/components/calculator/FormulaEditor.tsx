import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  defaultCoefficients,
  getStoredCoefficients,
  saveCoefficients,
  FormulaCoefficients,
} from "@/data/calculatorData";
import { FunctionSquare, RotateCcw, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type CoeffKey = keyof FormulaCoefficients;

interface FieldDef {
  key: string;
  label: string;
  hint: string;
}

interface ModelDef {
  id: CoeffKey;
  title: string;
  formula: string;
  fields: FieldDef[];
}

const CAP_FIELDS: FieldDef[] = [
  { key: "c1", label: "c1 — доля площади", hint: "Умножается на X×Y" },
  { key: "c2", label: "c2 — фиксированная стоимость", hint: "Прибавляется к площадной части (₽)" },
  { key: "c3", label: "c3 — базовый периметр", hint: "Базовый коэф. периметра" },
  { key: "c4", label: "c4 — коэф. X по периметру", hint: "Умножается на X в периметрной части" },
];

const models: ModelDef[] = [
  {
    id: "cap_classic_simple",
    title: "Колпак: Классика простой",
    formula: "((X×Y×c1 + c2) + (X+Y)×0.002×(c3 + c4×X)×цена) × 2",
    fields: CAP_FIELDS,
  },
  {
    id: "cap_classic_slatted",
    title: "Колпак: Классика реечный",
    formula: "((X×Y×c1 + c2) + (X+Y)×0.002×(c3 + c4×X)×цена) × 2",
    fields: CAP_FIELDS,
  },
  {
    id: "cap_modern_simple",
    title: "Колпак: Модерн простой",
    formula: "((X×Y×c1 + c2) + (X+Y)×0.002×(c3 + c4×X)×цена) × 2",
    fields: CAP_FIELDS,
  },
  {
    id: "cap_modern_slatted",
    title: "Колпак: Модерн реечный",
    formula: "((X×Y×c1 + c2) + (X+Y)×0.002×(c3 + c4×X)×цена) × 2",
    fields: CAP_FIELDS,
  },
  {
    id: "box_smooth",
    title: "Короб: Простой гладкий",
    formula: "((X×Y×c1 + c2) + (X+Y)×0.002×(H×0.001)×цена) × 2",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "Умножается на X×Y" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
  },
  {
    id: "box_lamellar",
    title: "Короб: Ламельный",
    formula: "((X×Y×c1 + c2)×2 + (X+Y)×0.002×c3×(H×0.001)×цена) × c4",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "Умножается на X×Y" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
      { key: "c3", label: "c3 — высотный коэф.", hint: "Множитель высоты" },
      { key: "c4", label: "c4 — итоговый множитель", hint: "На что умножается всё выражение" },
    ],
  },
  {
    id: "flashing_flat",
    title: "Оклад: Для плоских покрытий",
    formula: "((X×Y×c1 + c2) + (X×c3 + Y×c4)×цена) × 2",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "Умножается на X×Y" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
      { key: "c3", label: "c3 — коэф. X по металлу", hint: "" },
      { key: "c4", label: "c4 — коэф. Y по металлу", hint: "" },
    ],
  },
  {
    id: "flashing_profiled",
    title: "Оклад: Для профилированных покрытий",
    formula: "((X×Y×c1 + c2) + (X×c3 + Y×c4)×цена + (X+0.5)×c5) × 2",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
      { key: "c3", label: "c3 — коэф. X по металлу", hint: "" },
      { key: "c4", label: "c4 — коэф. Y по металлу", hint: "" },
      { key: "c5", label: "c5 — стоимость кромки", hint: "₽ за единицу (X+0.5)" },
    ],
  },
  {
    id: "addon_mesh",
    title: "Доп. опция: Сетка от птиц",
    formula: "((X+Y)×c1×цена_сетки×1.2 + c2) × 2",
    fields: [
      { key: "c1", label: "c1 — периметрный коэф.", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
  },
  {
    id: "addon_heatproof",
    title: "Доп. опция: Жаростойкая вставка",
    formula: "(X×Y×c1×1.2×цена_нерж. + c2) × 2",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
  },
  {
    id: "addon_bottom_cap",
    title: "Доп. опция: Нижняя крышка",
    formula: "(X×Y×c1×1.2×цена_металла + c2) × 2",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
  },
  {
    id: "addon_mount_frame",
    title: "Доп. опция: Установочная рамка",
    formula: "((X+Y)×c1×цена_цинка×1.2 + c2) × 2",
    fields: [
      { key: "c1", label: "c1 — периметрный коэф.", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
  },
  {
    id: "addon_mount_skeleton",
    title: "Доп. опция: Установочный каркас",
    formula: "((X+Y)×c1 + H×0.001×c2)×цена_цинка×1.2 + c3) × 2",
    fields: [
      { key: "c1", label: "c1 — периметрный коэф.", hint: "" },
      { key: "c2", label: "c2 — высотный коэф.", hint: "" },
      { key: "c3", label: "c3 — фиксированная стоимость", hint: "₽" },
    ],
  },
];

export const FormulaEditor = () => {
  const [coeffs, setCoeffs] = useState<FormulaCoefficients>(getStoredCoefficients);
  const [openId, setOpenId] = useState<CoeffKey | null>(null);

  const handleChange = (modelId: CoeffKey, field: string, raw: string) => {
    const val = parseFloat(raw);
    if (isNaN(val)) return;
    setCoeffs(prev => ({
      ...prev,
      [modelId]: { ...(prev[modelId] as Record<string, number>), [field]: val },
    }));
  };

  const handleSave = () => {
    saveCoefficients(coeffs);
    toast({ title: "Формулы сохранены" });
  };

  const handleReset = (modelId: CoeffKey) => {
    setCoeffs(prev => ({ ...prev, [modelId]: defaultCoefficients[modelId] }));
    toast({ title: "Коэффициенты сброшены к значениям по умолчанию" });
  };

  return (
    <section className="card-soft p-8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FunctionSquare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Формулы расчёта</h2>
        </div>
        <Button onClick={handleSave} size="sm" className="rounded-xl gap-2">
          <Save className="w-4 h-4" /> Сохранить изменения
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Настройте коэффициенты формул для каждой модели. Нажмите на модель чтобы развернуть.
      </p>

      <div className="space-y-2">
        {models.map((m) => {
          const isOpen = openId === m.id;
          const modelCoeffs = coeffs[m.id] as Record<string, number>;
          const defCoeffs = defaultCoefficients[m.id] as Record<string, number>;
          const hasChanges = m.fields.some(f => modelCoeffs[f.key] !== defCoeffs[f.key]);

          return (
            <div key={m.id} className="border border-border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 transition-colors text-left"
                onClick={() => setOpenId(isOpen ? null : m.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{m.title}</span>
                  {hasChanges && (
                    <span className="text-[10px] bg-primary/15 text-primary font-bold px-2 py-0.5 rounded-full">изменено</span>
                  )}
                </div>
                <span className="text-muted-foreground text-xs">{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-3 space-y-3">
                  <div className="text-xs font-mono bg-muted/60 text-muted-foreground rounded-lg px-3 py-2 border border-border/50">
                    {m.formula}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {m.fields.map(f => (
                      <div key={f.key}>
                        <label className="text-xs font-semibold text-foreground">{f.label}</label>
                        {f.hint && <span className="text-[10px] text-muted-foreground ml-1">— {f.hint}</span>}
                        <Input
                          type="number"
                          step="any"
                          value={modelCoeffs[f.key]}
                          onChange={(e) => handleChange(m.id, f.key, e.target.value)}
                          className="mt-1 bg-muted border-0 rounded-xl text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-muted-foreground gap-1.5"
                      onClick={() => handleReset(m.id)}
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Сбросить
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
