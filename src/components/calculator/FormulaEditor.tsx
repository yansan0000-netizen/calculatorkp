import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultCoefficients,
  getStoredCoefficients,
  saveCoefficients,
  FormulaCoefficients,
  defaultFormulaStrings,
  getStoredFormulaStrings,
  saveFormulaStrings,
  FormulaStrings,
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
  formulaKey: keyof FormulaStrings;
  title: string;
  fields: FieldDef[];
  formulaVars: string; // hint for available variables
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
    formulaKey: "cap_classic_simple",
    title: "Колпак: Классика простой",
    fields: CAP_FIELDS,
    formulaVars: "X, Y, metalPrice, c1, c2, c3, c4",
  },
  {
    id: "cap_classic_slatted",
    formulaKey: "cap_classic_slatted",
    title: "Колпак: Классика реечный",
    fields: CAP_FIELDS,
    formulaVars: "X, Y, metalPrice, c1, c2, c3, c4",
  },
  {
    id: "cap_modern_simple",
    formulaKey: "cap_modern_simple",
    title: "Колпак: Модерн простой",
    fields: CAP_FIELDS,
    formulaVars: "X, Y, metalPrice, c1, c2, c3, c4",
  },
  {
    id: "cap_modern_slatted",
    formulaKey: "cap_modern_slatted",
    title: "Колпак: Модерн реечный",
    fields: CAP_FIELDS,
    formulaVars: "X, Y, metalPrice, c1, c2, c3, c4",
  },
  {
    id: "box_smooth",
    formulaKey: "box_smooth",
    title: "Короб: Простой гладкий",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "Умножается на X×Y" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
    formulaVars: "X, Y, H, metalPrice, c1, c2",
  },
  {
    id: "box_lamellar",
    formulaKey: "box_lamellar",
    title: "Короб: Ламельный",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "Умножается на X×Y" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
      { key: "c3", label: "c3 — высотный коэф.", hint: "Множитель высоты" },
      { key: "c4", label: "c4 — итоговый множитель", hint: "На что умножается всё выражение" },
    ],
    formulaVars: "X, Y, H, metalPrice, c1, c2, c3, c4",
  },
  {
    id: "flashing_flat",
    formulaKey: "flashing_flat",
    title: "Оклад: Для плоских покрытий",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "Умножается на X×Y" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
      { key: "c3", label: "c3 — коэф. X по металлу", hint: "" },
      { key: "c4", label: "c4 — коэф. Y по металлу", hint: "" },
    ],
    formulaVars: "X, Y, metalPrice, c1, c2, c3, c4",
  },
  {
    id: "flashing_profiled",
    formulaKey: "flashing_profiled",
    title: "Оклад: Для профилированных покрытий",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
      { key: "c3", label: "c3 — коэф. X по металлу", hint: "" },
      { key: "c4", label: "c4 — коэф. Y по металлу", hint: "" },
      { key: "c5", label: "c5 — стоимость кромки", hint: "₽ за единицу (X+0.5)" },
    ],
    formulaVars: "X, Y, metalPrice, c1, c2, c3, c4, c5",
  },
  {
    id: "addon_mesh",
    formulaKey: "addon_mesh",
    title: "Доп. опция: Сетка от птиц",
    fields: [
      { key: "c1", label: "c1 — периметрный коэф.", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
    formulaVars: "X, Y, meshPrice, c1, c2",
  },
  {
    id: "addon_heatproof",
    formulaKey: "addon_heatproof",
    title: "Доп. опция: Жаростойкая вставка",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
    formulaVars: "X, Y, stainlessPrice, c1, c2",
  },
  {
    id: "addon_bottom_cap",
    formulaKey: "addon_bottom_cap",
    title: "Доп. опция: Нижняя крышка",
    fields: [
      { key: "c1", label: "c1 — доля площади", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
    formulaVars: "X, Y, metalPrice, c1, c2",
  },
  {
    id: "addon_mount_frame",
    formulaKey: "addon_mount_frame",
    title: "Доп. опция: Установочная рамка",
    fields: [
      { key: "c1", label: "c1 — периметрный коэф.", hint: "" },
      { key: "c2", label: "c2 — фиксированная стоимость", hint: "₽" },
    ],
    formulaVars: "X, Y, zincPrice065, c1, c2",
  },
  {
    id: "addon_mount_skeleton",
    formulaKey: "addon_mount_skeleton",
    title: "Доп. опция: Установочный каркас",
    fields: [
      { key: "c1", label: "c1 — периметрный коэф.", hint: "" },
      { key: "c2", label: "c2 — высотный коэф.", hint: "" },
      { key: "c3", label: "c3 — фиксированная стоимость", hint: "₽" },
    ],
    formulaVars: "X, Y, H, zincPrice065, c1, c2, c3",
  },
];

export const FormulaEditor = () => {
  const [coeffs, setCoeffs] = useState<FormulaCoefficients>(getStoredCoefficients);
  const [formulas, setFormulas] = useState<FormulaStrings>(getStoredFormulaStrings);
  const [openId, setOpenId] = useState<CoeffKey | null>(null);

  const handleChange = (modelId: CoeffKey, field: string, raw: string) => {
    const val = parseFloat(raw);
    if (isNaN(val)) return;
    setCoeffs(prev => ({
      ...prev,
      [modelId]: { ...(prev[modelId] as Record<string, number>), [field]: val },
    }));
  };

  const handleFormulaChange = (key: keyof FormulaStrings, value: string) => {
    setFormulas(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    saveCoefficients(coeffs);
    saveFormulaStrings(formulas);
    toast({ title: "Формулы сохранены" });
  };

  const handleReset = (modelId: CoeffKey, formulaKey: keyof FormulaStrings) => {
    setCoeffs(prev => ({ ...prev, [modelId]: defaultCoefficients[modelId] }));
    setFormulas(prev => ({ ...prev, [formulaKey]: defaultFormulaStrings[formulaKey] }));
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
        Настройте коэффициенты и сами формулы для каждой модели. Нажмите на модель чтобы развернуть.
      </p>

      <div className="space-y-2">
        {models.map((m) => {
          const isOpen = openId === m.id;
          const modelCoeffs = coeffs[m.id] as Record<string, number>;
          const defCoeffs = defaultCoefficients[m.id] as Record<string, number>;
          const formulaChanged = formulas[m.formulaKey] !== defaultFormulaStrings[m.formulaKey];
          const hasChanges = formulaChanged || m.fields.some(f => modelCoeffs[f.key] !== defCoeffs[f.key]);

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
                <div className="px-4 pb-4 pt-3 space-y-4">
                  {/* Formula editor */}
                  <div>
                    <label className="text-xs font-semibold text-foreground">Формула (JS-выражение)</label>
                    <div className="text-[10px] text-muted-foreground mt-0.5 mb-1.5">
                      Доступные переменные: <span className="font-mono text-primary">{m.formulaVars}</span>
                    </div>
                    <Textarea
                      value={formulas[m.formulaKey]}
                      onChange={(e) => handleFormulaChange(m.formulaKey, e.target.value)}
                      className="font-mono text-sm bg-muted border border-border/70 rounded-xl resize-none"
                      rows={2}
                      spellCheck={false}
                    />
                    {formulaChanged && (
                      <div className="text-[10px] text-primary mt-1">⚠ Формула изменена относительно значения по умолчанию</div>
                    )}
                  </div>

                  {/* Coefficients */}
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
                      onClick={() => handleReset(m.id, m.formulaKey)}
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
