import { useCalculator } from "@/context/CalculatorContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Trash2, Grid3x3, Building2, Upload, Image, ImagePlus, Lock, Package, BookOpen, ChevronDown, Pencil, Check, X } from "lucide-react";
import { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NumericInput } from "@/components/calculator/DimensionsForm";
import { toast } from "@/hooks/use-toast";
import { capModels, boxModels, flashingModels } from "@/data/calculatorData";
import { defaultCapImages, defaultBoxImages, defaultFlashingImages, getAllModels, getHiddenModels, saveHiddenModels } from "@/components/calculator/ProductSelection";
import { getPassword, setPassword } from "@/components/PasswordGate";
import { FormulaEditor } from "@/components/calculator/FormulaEditor";

interface ProductImageConfig {
  cap: Record<string, string>;
  box: Record<string, string>;
  flashing: Record<string, string>;
}

function getStoredImages(): ProductImageConfig {
  try {
    const saved = localStorage.getItem("pipe_product_images");
    return saved ? JSON.parse(saved) : { cap: {}, box: {}, flashing: {} };
  } catch { return { cap: {}, box: {}, flashing: {} }; }
}

function saveImages(images: ProductImageConfig) {
  localStorage.setItem("pipe_product_images", JSON.stringify(images));
}

// === Custom Models Manager ===
interface CustomModels {
  cap: { id: string; name: string; description: string }[];
  box: { id: string; name: string; description: string }[];
  flashing: { id: string; name: string; description: string }[];
}

function getCustomModels(): CustomModels {
  try {
    const saved = localStorage.getItem("pipe_custom_models");
    return saved ? JSON.parse(saved) : { cap: [], box: [], flashing: [] };
  } catch { return { cap: [], box: [], flashing: [] }; }
}

function saveCustomModels(models: CustomModels) {
  localStorage.setItem("pipe_custom_models", JSON.stringify(models));
}

const CustomModelManager = () => {
  const [models, setModels] = useState<CustomModels>(getCustomModels);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [activeGroup, setActiveGroup] = useState<"cap" | "box" | "flashing">("cap");

  const groupLabels: Record<string, string> = { cap: "Колпаки", box: "Короба", flashing: "Оклады" };

  const addModel = () => {
    if (!newName.trim()) return;
    const id = `custom_${Date.now()}`;
    const updated = {
      ...models,
      [activeGroup]: [...models[activeGroup], { id, name: newName.trim(), description: newDesc.trim() || "Пользовательская модель" }],
    };
    setModels(updated);
    saveCustomModels(updated);
    setNewName("");
    setNewDesc("");
    toast({ title: `Добавлено: ${newName.trim()}` });
  };

  const removeModel = (group: "cap" | "box" | "flashing", id: string) => {
    const updated = { ...models, [group]: models[group].filter(m => m.id !== id) };
    setModels(updated);
    saveCustomModels(updated);
    toast({ title: "Модель удалена" });
  };

  return (
    <section className="card-soft p-8">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Пользовательские модели</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Добавляйте свои модели изделий. Изображения можно загрузить в секции ниже.
      </p>

      {/* Group tabs */}
      <div className="flex gap-2 mb-4">
        {(["cap", "box", "flashing"] as const).map(g => (
          <Button
            key={g}
            variant={activeGroup === g ? "default" : "outline"}
            size="sm"
            className="rounded-xl"
            onClick={() => setActiveGroup(g)}
          >
            {groupLabels[g]}
          </Button>
        ))}
      </div>

      {/* Existing custom models */}
      {models[activeGroup].length > 0 && (
        <div className="space-y-2 mb-4">
          {models[activeGroup].map(m => (
            <div key={m.id} className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{m.name}</p>
                <p className="text-xs text-muted-foreground truncate">{m.description}</p>
              </div>
              <button onClick={() => removeModel(activeGroup, m.id)}
                className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs font-semibold text-foreground">Название</label>
          <Input value={newName} onChange={(e) => setNewName(e.target.value)}
            placeholder="Название модели" className="mt-1 bg-muted border-0 rounded-xl" />
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-foreground">Описание</label>
          <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Краткое описание" className="mt-1 bg-muted border-0 rounded-xl"
            onKeyDown={(e) => { if (e.key === "Enter") addModel(); }} />
        </div>
        <Button onClick={addModel} className="rounded-xl" size="sm">
          <Plus className="w-4 h-4 mr-1" /> Добавить
        </Button>
      </div>
    </section>
  );
};

// === Password Manager ===
const PasswordManager = () => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleChange = () => {
    setError("");
    if (current !== getPassword()) { setError("Неверный текущий пароль"); return; }
    if (newPass.length < 3) { setError("Минимум 3 символа"); return; }
    if (newPass !== confirm) { setError("Пароли не совпадают"); return; }
    setPassword(newPass);
    setCurrent(""); setNewPass(""); setConfirm("");
    toast({ title: "Пароль изменён" });
  };

  return (
    <section className="card-soft p-8">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Смена пароля</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-foreground">Текущий пароль</label>
          <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)}
            className="mt-1 bg-muted border-0 rounded-xl" placeholder="••••" />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground">Новый пароль</label>
          <Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)}
            className="mt-1 bg-muted border-0 rounded-xl" placeholder="••••" />
        </div>
        <div>
          <label className="text-xs font-semibold text-foreground">Подтверждение</label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            className="mt-1 bg-muted border-0 rounded-xl" placeholder="••••"
            onKeyDown={(e) => { if (e.key === "Enter") handleChange(); }} />
        </div>
      </div>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      <Button onClick={handleChange} className="mt-3 rounded-xl" size="sm">Сменить пароль</Button>
    </section>
  );
};

// === Custom Names Manager ===
interface CustomNames {
  cap: Record<string, { name: string; description: string }>;
  box: Record<string, { name: string; description: string }>;
  flashing: Record<string, { name: string; description: string }>;
}

function getCustomNames(): CustomNames {
  try {
    const saved = localStorage.getItem("pipe_custom_names");
    return saved ? JSON.parse(saved) : { cap: {}, box: {}, flashing: {} };
  } catch { return { cap: {}, box: {}, flashing: {} }; }
}

function saveCustomNames(names: CustomNames) {
  localStorage.setItem("pipe_custom_names", JSON.stringify(names));
}

// === Product Image Manager ===
const ProductImageManager = () => {
  const [images, setImages] = useState<ProductImageConfig>(getStoredImages);
  const [customNames, setCustomNames] = useState<CustomNames>(getCustomNames);
  const [hiddenModels, setHiddenModels] = useState(getHiddenModels);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [addingGroup, setAddingGroup] = useState<"cap" | "box" | "flashing" | null>(null);
  const [newModelName, setNewModelName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ group: "cap" | "box" | "flashing"; id: string } | null>(null);

  const defaults: Record<string, Record<string, string>> = {
    cap: defaultCapImages,
    box: defaultBoxImages,
    flashing: defaultFlashingImages,
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;
    if (file.size > 500_000) {
      toast({ title: "Максимум 500 КБ", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const updated = {
        ...images,
        [uploadTarget.group]: { ...images[uploadTarget.group], [uploadTarget.id]: reader.result as string },
      };
      setImages(updated);
      saveImages(updated);
      toast({ title: "Изображение обновлено" });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const resetImage = (group: "cap" | "box" | "flashing", id: string) => {
    const updated = { ...images, [group]: { ...images[group] } };
    delete updated[group][id];
    setImages(updated);
    saveImages(updated);
  };

  const resetName = (group: "cap" | "box" | "flashing", id: string) => {
    const updated = { ...customNames, [group]: { ...customNames[group] } };
    delete updated[group][id];
    setCustomNames(updated);
    saveCustomNames(updated);
  };

  const saveEdit = (group: "cap" | "box" | "flashing", id: string) => {
    if (!editName.trim()) { setEditingId(null); return; }
    const updated = {
      ...customNames,
      [group]: { ...customNames[group], [id]: { name: editName.trim(), description: "" } },
    };
    setCustomNames(updated);
    saveCustomNames(updated);
    setEditingId(null);
    toast({ title: "Название обновлено" });
  };

  const hideModel = (group: "cap" | "box" | "flashing", id: string) => {
    const updated = { ...hiddenModels, [group]: [...hiddenModels[group], id] };
    setHiddenModels(updated);
    saveHiddenModels(updated);
    toast({ title: "Модель скрыта из калькулятора" });
  };

  const showModel = (group: "cap" | "box" | "flashing", id: string) => {
    const updated = { ...hiddenModels, [group]: hiddenModels[group].filter(x => x !== id) };
    setHiddenModels(updated);
    saveHiddenModels(updated);
  };

  const addCustomModel = (group: "cap" | "box" | "flashing") => {
    if (!newModelName.trim()) return;
    const id = `custom_${Date.now()}`;
    // Save to custom models
    const saved = localStorage.getItem("pipe_custom_models");
    const customModels = saved ? JSON.parse(saved) : { cap: [], box: [], flashing: [] };
    customModels[group] = [...customModels[group], { id, name: newModelName.trim(), description: "" }];
    localStorage.setItem("pipe_custom_models", JSON.stringify(customModels));
    setNewModelName("");
    setAddingGroup(null);
    toast({ title: `Добавлено: ${newModelName.trim()}` });
    // force re-render
    setImages({ ...images });
  };

  const removeCustomModel = (group: "cap" | "box" | "flashing", id: string) => {
    const saved = localStorage.getItem("pipe_custom_models");
    const customModels = saved ? JSON.parse(saved) : { cap: [], box: [], flashing: [] };
    customModels[group] = customModels[group].filter((m: any) => m.id !== id);
    localStorage.setItem("pipe_custom_models", JSON.stringify(customModels));
    resetImage(group, id);
    resetName(group, id);
    toast({ title: "Модель удалена" });
    setImages({ ...images });
  };

  // All models including hidden ones (for settings display)
  const allBuiltIn = {
    cap: capModels.filter(m => m.id !== "custom"),
    box: boxModels.filter(m => m.id !== "none"),
    flashing: flashingModels.filter(m => m.id !== "none"),
  };
  const getCustomList = (group: "cap" | "box" | "flashing") => {
    try {
      const saved = localStorage.getItem("pipe_custom_models");
      return saved ? JSON.parse(saved)[group] : [];
    } catch { return []; }
  };

  const groupLabels: Record<string, string> = { cap: "Колпаки", box: "Короба", flashing: "Оклады" };
  const groups = (["cap", "box", "flashing"] as const);

  return (
    <section className="card-soft p-8">
      <div className="flex items-center gap-2 mb-4">
        <ImagePlus className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Изображения изделий</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Управляйте моделями: загружайте изображения, переименовывайте, скрывайте и добавляйте новые.
      </p>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

      {groups.map(groupKey => {
        const builtInItems = allBuiltIn[groupKey];
        const customItems: { id: string; name: string; description: string }[] = getCustomList(groupKey);

        return (
          <div key={groupKey} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground">{groupLabels[groupKey]}</h3>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-7 px-3 text-xs gap-1"
                onClick={() => { setAddingGroup(groupKey); setNewModelName(""); }}
              >
                <Plus className="w-3.5 h-3.5" /> Добавить
              </Button>
            </div>

            {/* Add form */}
            {addingGroup === groupKey && (
              <div className="flex gap-2 mb-3">
                <Input
                  autoFocus
                  placeholder="Название новой модели"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addCustomModel(groupKey); if (e.key === "Escape") setAddingGroup(null); }}
                  className="bg-muted border-0 rounded-xl text-sm"
                />
                <Button size="sm" className="rounded-xl" onClick={() => addCustomModel(groupKey)}>
                  <Check className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="rounded-xl" onClick={() => setAddingGroup(null)}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}

            <div className="space-y-2">
              {/* Built-in models */}
              {builtInItems.map(item => {
                const isHidden = hiddenModels[groupKey].includes(item.id);
                const customImg = images[groupKey]?.[item.id];
                const defaultImg = defaults[groupKey]?.[item.id];
                const currentImg = customImg || defaultImg;
                const customName = customNames[groupKey]?.[item.id];
                const displayName = customName?.name ?? item.name;
                const isEditing = editingId === `${groupKey}_${item.id}`;

                return (
                  <div key={item.id} className={`rounded-xl p-3 border transition-all ${isHidden ? "bg-muted/20 border-dashed border-border/50 opacity-60" : "bg-muted/50 border-transparent"}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                        {currentImg ? (
                          <img src={currentImg} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          <Image className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      {isEditing ? (
                        <Input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(groupKey, item.id); if (e.key === "Escape") setEditingId(null); }}
                          className="flex-1 h-8 text-sm bg-background rounded-lg border-border"
                        />
                      ) : (
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${isHidden ? "line-through text-muted-foreground" : "text-foreground"}`}>{displayName}</p>
                          <p className="text-[10px] text-muted-foreground/60">{isHidden ? "скрыто" : customImg ? "своё фото" : currentImg ? "фото по умолчанию" : "нет фото"}</p>
                        </div>
                      )}
                      <div className="flex gap-1">
                        {isEditing ? (
                          <>
                            <Button variant="default" size="sm" className="rounded-lg h-7 px-2" onClick={() => saveEdit(groupKey, item.id)}><Check className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="sm" className="rounded-lg h-7 px-2" onClick={() => setEditingId(null)}><X className="w-3 h-3" /></Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="rounded-lg h-7 px-2" onClick={() => { setEditingId(`${groupKey}_${item.id}`); setEditName(displayName); }}>
                              <Pencil className="w-3 h-3" />
                            </Button>
                            {!isHidden && (
                              <Button variant="outline" size="sm" className="rounded-lg h-7 px-2" onClick={() => { setUploadTarget({ group: groupKey, id: item.id }); fileRef.current?.click(); }}>
                                <Upload className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant={isHidden ? "outline" : "ghost"}
                              size="sm"
                              className={`rounded-lg h-7 px-2 ${isHidden ? "text-primary" : "text-destructive"}`}
                              onClick={() => isHidden ? showModel(groupKey, item.id) : hideModel(groupKey, item.id)}
                            >
                              {isHidden ? <Plus className="w-3 h-3" /> : <Trash2 className="w-3 h-3" />}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Custom models */}
              {customItems.map((item: { id: string; name: string; description: string }) => {
                const customImg = images[groupKey]?.[item.id];
                const customName = customNames[groupKey]?.[item.id];
                const displayName = customName?.name ?? item.name;
                const isEditing = editingId === `${groupKey}_${item.id}`;

                return (
                  <div key={item.id} className="bg-primary/5 border border-primary/15 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                        {customImg ? (
                          <img src={customImg} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          <Image className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      {isEditing ? (
                        <Input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(groupKey, item.id); if (e.key === "Escape") setEditingId(null); }}
                          className="flex-1 h-8 text-sm bg-background rounded-lg border-border"
                        />
                      ) : (
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                          <p className="text-[10px] text-primary/60">пользовательская</p>
                        </div>
                      )}
                      <div className="flex gap-1">
                        {isEditing ? (
                          <>
                            <Button variant="default" size="sm" className="rounded-lg h-7 px-2" onClick={() => saveEdit(groupKey, item.id)}><Check className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="sm" className="rounded-lg h-7 px-2" onClick={() => setEditingId(null)}><X className="w-3 h-3" /></Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" className="rounded-lg h-7 px-2" onClick={() => { setEditingId(`${groupKey}_${item.id}`); setEditName(displayName); }}>
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-lg h-7 px-2" onClick={() => { setUploadTarget({ group: groupKey, id: item.id }); fileRef.current?.click(); }}>
                              <Upload className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-lg h-7 px-2 text-destructive" onClick={() => removeCustomModel(groupKey, item.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
};










// === Documentation Section ===
const docSections = [
  {
    title: "Как устроено приложение",
    content: `Это приложение помогает быстро рассчитать стоимость дымоходной системы и сформировать коммерческое предложение (КП) для клиента в виде PDF-файла.

**В приложении 3 раздела:**
• **Калькулятор** — главная страница, где вы вводите размеры трубы, выбираете изделия и получаете итоговую цену
• **Настройки** — здесь можно изменить цены на материалы, реквизиты вашей компании, загрузить логотип и фото изделий
• **История** — список всех ранее сформированных КП, из которого можно заново скачать любой документ`,
  },
  {
    title: "Как пользоваться калькулятором",
    content: `**Шаг 1.** Введите размеры трубы клиента:
• X — ширина трубы в миллиметрах
• Y — глубина трубы в миллиметрах
• H — высота трубы над крышей в миллиметрах
• Угол — наклон крыши в градусах

**Шаг 2.** Выберите покрытие и цвет металла — цена подставится автоматически из таблицы цен (если она заполнена в настройках).

**Шаг 3.** Выберите нужные изделия: колпак, короб, оклад.

**Шаг 4.** При необходимости добавьте доп. опции: сетку от птиц, жаростойкую вставку и т.д.

**Шаг 5.** Задайте скидки (если нужно) и заполните данные клиента.

**Шаг 6.** Нажмите «Скачать КП» — PDF сохранится на ваш компьютер.`,
  },
  {
    title: "Что влияет на цену",
    content: `Цена каждого изделия зависит от двух вещей:

**1. Размеры трубы** — чем больше труба, тем больше материала нужно, тем выше цена.

**2. Цена металла** — стоимость листа металла за единицу. Зависит от выбранного покрытия и цвета.

Каждая модель изделия имеет свою формулу расчёта. Модели типа «Реечный» и «Ламельный» стоят дороже, потому что требуют больше материала и работы.

**Дополнительные опции** (сетка, вставка, рамка) рассчитываются отдельно и зависят от своих материалов: цены сетки, нержавейки или цинка.`,
  },
  {
    title: "Цены на материалы",
    content: `В калькуляторе используются 4 цены на материалы:

• **Цена металла** — главная цена, влияет на стоимость колпаков, коробов и окладов
• **Цена сетки** — влияет только на опцию «Сетка от птиц»
• **Цена нержавейки** — влияет только на опцию «Жаростойкая вставка»
• **Цена цинка 0,65** — влияет на «Установочную рамку» и «Установочный каркас»

Эти цены можно изменить вручную на главной странице или в настройках.`,
  },
  {
    title: "Таблица цен (матрица)",
    content: `В настройках есть таблица, где можно заранее указать цену металла для каждой комбинации покрытия и цвета.

**Как это работает:**
Когда вы в калькуляторе выбираете, например, покрытие «полиэстер» и цвет «RAL 7024» — программа сама найдёт цену в таблице и подставит её в поле «Цена металла».

Это удобно: вместо того чтобы каждый раз вручную вводить цену, достаточно один раз заполнить таблицу.

Если ячейка в таблице пустая — цена не подставится, и нужно будет ввести её вручную.`,
  },
  {
    title: "Как работают скидки",
    content: `Скидки можно задавать двумя способами:

**1. Скидка на отдельное изделие** — у каждой позиции (колпак, короб, оклад, каждая опция) есть своё поле для скидки в процентах. Например, скидка 10% на колпак уменьшит только его стоимость.

**2. Общая скидка** — применяется ко всей сумме целиком, уже после индивидуальных скидок.

**Пример:**
Колпак стоит 10 000 ₽, скидка на колпак 10% → 9 000 ₽
Короб стоит 5 000 ₽, без скидки → 5 000 ₽
Сумма = 14 000 ₽
Общая скидка 5% → Итого: 13 300 ₽`,
  },
  {
    title: "Коммерческое предложение (PDF)",
    content: `При нажатии кнопки «Скачать КП» формируется PDF-документ, который содержит:

• Логотип и реквизиты вашей компании (берутся из настроек — заполните их заранее)
• Данные клиента (название компании, контактное лицо, телефон, email — заполняются на главной странице)
• Список выбранных изделий с ценами и скидками
• Итоговую стоимость

Каждое сформированное КП автоматически сохраняется в раздел «История».`,
  },
  {
    title: "Свои модели изделий",
    content: `Если стандартных моделей не хватает, вы можете добавить свои:

**1.** Перейдите в Настройки → «Пользовательские модели»
**2.** Выберите категорию (колпаки, короба или оклады)
**3.** Введите название и описание
**4.** Нажмите «Добавить»

Новая модель появится в калькуляторе. Для неё можно загрузить фотографию в секции «Изображения изделий».

Обратите внимание: для пользовательских моделей цена не рассчитывается автоматически — она будет отображаться как «по эскизу».`,
  },
  {
    title: "Реквизиты компании",
    content: `В настройках можно указать данные вашей компании:
• Название, ИНН, адрес
• Телефон, email, сайт
• Логотип (загрузите картинку до 500 КБ)

Эти данные будут автоматически появляться в шапке каждого PDF-документа. Заполните их один раз — и больше не нужно вводить при каждом расчёте.`,
  },
  {
    title: "Где хранятся данные",
    content: `Все ваши настройки сохраняются прямо в браузере на вашем компьютере:
• Цены и таблица цен
• Реквизиты компании и логотип
• Фотографии изделий
• История расчётов
• Пользовательские модели
• Пароль для входа

⚠️ **Важно:** если вы очистите данные браузера (кэш, куки) или откроете приложение в другом браузере — все настройки придётся вводить заново. Рекомендуем пользоваться одним браузером.`,
  },
  {
    title: "❓ Часто задаваемые вопросы (FAQ)",
    content: `**Почему цена изменилась сама?**
Скорее всего, вы сменили покрытие или цвет металла — и цена подставилась из таблицы цен в настройках. Это нормальное поведение.

**Почему у изделия цена «—» или 0?**
Это значит, что выбрана модель «По эскизу» или пользовательская модель, для которой автоматический расчёт не предусмотрен. Цену нужно согласовать отдельно.

**Можно ли открыть калькулятор на телефоне?**
Да, приложение адаптировано для мобильных устройств. Откройте ссылку в браузере телефона.

**Я сменил браузер и все настройки пропали — что делать?**
Все данные хранятся в конкретном браузере. При переходе на другой браузер нужно заново заполнить настройки. Рекомендуем всегда использовать один и тот же браузер.

**Как изменить пароль для входа?**
Перейдите в Настройки → «Смена пароля». Введите текущий пароль, затем новый, и подтвердите.

**Как добавить свою модель изделия?**
Настройки → «Пользовательские модели» → выберите категорию → введите название → нажмите «Добавить». После этого загрузите фото в секции «Изображения изделий».

**PDF не скачивается — что делать?**
Убедитесь, что браузер не блокирует скачивание файлов. Попробуйте другой браузер. Если не помогло — очистите кэш и перезагрузите страницу.

**Как найти ранее созданное КП?**
Нажмите «История» в верхнем меню калькулятора. Там хранятся все ранее сформированные документы.

**Скидки применяются к PDF?**
Да, все скидки (и индивидуальные, и общая) отображаются в PDF-документе с указанием процентов и итоговой цены.`,
  },
  {
    title: "💻 Как установить калькулятор на свой компьютер",
    content: `Вы можете запустить калькулятор локально на своём компьютере — без сервера и хостинга. Интернет нужен **только один раз** для скачивания, потом всё работает офлайн.

**Что нужно установить (один раз):**
1. Скачайте и установите Node.js с официального сайта: https://nodejs.org (нажмите кнопку LTS — это стабильная версия).
2. Перезагрузите компьютер после установки.

**Как запустить:**
Откройте терминал (на Windows: нажмите Win+R, введите \`cmd\`, нажмите Enter) и вставьте эти команды по очереди:

[CODE]
git clone https://github.com/yansan0000-netizen/calculatorkp.git
cd calculatorkp
npm install
npm run dev
[/CODE]

После этого откройте браузер и перейдите по адресу: **http://localhost:5173**

**Что нужно знать:**
- Команда \`npm install\` скачивает все нужные файлы — это занимает 1–3 минуты и требует интернета.
- После установки команда \`npm run dev\` запускает калькулятор — интернет уже не нужен.
- Чтобы остановить — нажмите Ctrl+C в терминале.
- Чтобы запустить снова — откройте терминал, перейдите в папку (\`cd calculatorkp\`) и выполните \`npm run dev\`.
- Все настройки хранятся в браузере — при первом запуске нужно будет заполнить данные заново.

⚠️ **Если у вас нет Git:** скачайте проект вручную — зайдите на https://github.com/yansan0000-netizen/calculatorkp, нажмите зелёную кнопку **Code → Download ZIP**, распакуйте папку, откройте терминал в этой папке и выполните \`npm install\`, затем \`npm run dev\`.`,
  },
];

const renderInline = (text: string): React.ReactNode[] => {
  return text.split(/(`[^`]+`)/).flatMap((part, j) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return [<code key={j} className="bg-muted text-foreground px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>];
    }
    return part.split(/(\*\*[^*]+\*\*)/).flatMap((sub, k) => {
      if (sub.startsWith("**") && sub.endsWith("**")) {
        return [<strong key={`${j}-${k}`} className="text-foreground font-semibold">{sub.slice(2, -2)}</strong>];
      }
      // Handle URLs
      return sub.split(/(https?:\/\/[^\s,)]+)/).map((frag, f) =>
        frag.match(/^https?:\/\//) ? (
          <a key={`${j}-${k}-${f}`} href={frag} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 break-all">{frag}</a>
        ) : <span key={`${j}-${k}-${f}`}>{frag}</span>
      );
    });
  });
};

const DocumentationSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="card-soft p-8">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Документация</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Описание логики расчёта, формул ценообразования и работы приложения.
      </p>
      <div className="space-y-2">
        {docSections.map((section, i) => (
          <div key={i} className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm font-bold text-foreground">{section.title}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 border-t border-border">
                <div className="text-sm text-muted-foreground mt-3 leading-relaxed space-y-3">
                  {section.content.split(/\[CODE\]([\s\S]*?)\[\/CODE\]/).map((block, bi) => {
                    if (bi % 2 === 1) {
                      return (
                        <pre key={bi} className="bg-muted/80 border border-border rounded-lg p-4 overflow-x-auto">
                          <code className="text-xs font-mono text-foreground leading-6">
                            {block.trim().split("\n").map((line, li) => (
                              <span key={li} className="block">{line}</span>
                            ))}
                          </code>
                        </pre>
                      );
                    }
                    return block.split(/\n\n+/).filter(Boolean).map((para, pi) => {
                      if (para.trim().startsWith("⚠️")) {
                        return (
                          <div key={`${bi}-${pi}`} className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm">
                            {renderInline(para.trim())}
                          </div>
                        );
                      }
                      const lines = para.split("\n").filter(Boolean);
                      const isList = lines.every(l => /^(\d+\.|-)/.test(l.trim()));
                      if (isList) {
                        const isOrdered = /^\d+\./.test(lines[0].trim());
                        const Tag = isOrdered ? "ol" : "ul";
                        return (
                          <Tag key={`${bi}-${pi}`} className={`space-y-1.5 pl-5 ${isOrdered ? "list-decimal" : "list-disc"}`}>
                            {lines.map((l, li) => (
                              <li key={li} className="text-sm text-muted-foreground">
                                {renderInline(l.replace(/^(\d+\.|-)\s*/, ""))}
                              </li>
                            ))}
                          </Tag>
                        );
                      }
                      return <p key={`${bi}-${pi}`}>{renderInline(para.trim())}</p>;
                    });
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

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
  const [addingColor, setAddingColor] = useState(false);
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
            <p className="text-sm text-primary-foreground/60 mt-1">Цены, модели, изображения, реквизиты</p>
          </div>
          <Link to="/">
            <Button className="gradient-accent text-accent-foreground hover:opacity-90 rounded-full font-bold px-6">
              Калькулятор <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="container max-w-5xl py-8 space-y-6">

        {/* Password */}
        <PasswordManager />

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
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Загрузить логотип
                </Button>
                {companyDefaults.logoDataUrl && (
                  <Button variant="ghost" size="sm" className="ml-2 text-destructive" onClick={() => updateField("logoDataUrl", "")}>
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

        {/* Custom Models */}
        <CustomModelManager />

        {/* Product Images */}
        <ProductImageManager />

        {/* Formula Editor */}
        <FormulaEditor />


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

        {/* Price Matrix — unified with coating/color management */}
        <section className="card-soft p-8">
          <div className="flex items-center gap-2 mb-2">
            <Grid3x3 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Матрица цен на металл</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Покрытие × Цвет → цена (руб). Добавляйте строки и столбцы прямо здесь. Заполненные ячейки подставляют цену металла автоматически.
          </p>
          <ScrollArea className="w-full">
            <div className="min-w-[500px]">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 bg-muted rounded-tl-lg font-bold text-foreground sticky left-0 z-10 min-w-[150px]">
                      Покрытие \ Цвет
                    </th>
                    {colors.map((c, ci) => (
                      <th key={c.code} className="p-1 bg-muted text-center min-w-[75px]">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="font-semibold text-foreground whitespace-nowrap">{c.code}</span>
                          <button
                            onClick={() => setColors(colors.filter((_, i) => i !== ci))}
                            className="text-muted-foreground/50 hover:text-destructive transition-colors"
                            title="Удалить цвет"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </th>
                    ))}
                    {/* Add color column header */}
                    <th className="p-1 bg-muted min-w-[90px]">
                      {addingColor ? (
                        <div className="flex flex-col gap-1 p-1">
                          <Input
                            autoFocus
                            placeholder="RAL 0000"
                            value={newColorCode}
                            onChange={(e) => setNewColorCode(e.target.value)}
                            className="h-6 text-[10px] px-1 bg-background border-border rounded text-center"
                          />
                          <Input
                            placeholder="Название"
                            value={newColorName}
                            onChange={(e) => setNewColorName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && newColorCode.trim()) {
                                setColors([...colors, { code: newColorCode.trim(), name: newColorName.trim() || newColorCode.trim() }]);
                                setNewColorCode(""); setNewColorName(""); setAddingColor(false);
                              }
                              if (e.key === "Escape") { setNewColorCode(""); setNewColorName(""); setAddingColor(false); }
                            }}
                            className="h-6 text-[10px] px-1 bg-background border-border rounded text-center"
                          />
                          <div className="flex gap-1 justify-center">
                            <button
                              className="text-primary hover:text-primary/80"
                              onClick={() => {
                                if (newColorCode.trim()) {
                                  setColors([...colors, { code: newColorCode.trim(), name: newColorName.trim() || newColorCode.trim() }]);
                                  setNewColorCode(""); setNewColorName(""); setAddingColor(false);
                                }
                              }}
                            ><Check className="w-3 h-3" /></button>
                            <button className="text-muted-foreground hover:text-destructive" onClick={() => { setNewColorCode(""); setNewColorName(""); setAddingColor(false); }}>
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingColor(true)}
                          className="flex items-center gap-1 mx-auto text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-primary/10"
                        >
                          <Plus className="w-3 h-3" />
                          <span className="text-[10px] font-medium">Цвет</span>
                        </button>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {coatings.map((coating, ri) => (
                    <tr key={coating} className={ri % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                      <td className="p-2 sticky left-0 z-10 bg-inherit min-w-[150px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground whitespace-nowrap flex-1">{coating}</span>
                          <button
                            onClick={() => setCoatings(coatings.filter((_, i) => i !== ri))}
                            className="text-muted-foreground/40 hover:text-destructive transition-colors flex-shrink-0"
                            title="Удалить покрытие"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
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
                      <td />
                    </tr>
                  ))}
                  {/* Add coating row */}
                  <tr className="border-t border-dashed border-border">
                    <td className="p-2 sticky left-0 bg-card z-10" colSpan={colors.length + 2}>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="+ Добавить покрытие (Enter)"
                          value={newCoating}
                          onChange={(e) => setNewCoating(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newCoating.trim()) {
                              setCoatings([...coatings, newCoating.trim()]);
                              setNewCoating("");
                            }
                          }}
                          className="h-7 text-xs bg-transparent border-0 border-b border-dashed border-border rounded-none focus-visible:ring-0 focus-visible:border-primary max-w-xs text-muted-foreground placeholder:text-muted-foreground/50"
                        />
                        {newCoating.trim() && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-primary"
                            onClick={() => { setCoatings([...coatings, newCoating.trim()]); setNewCoating(""); }}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </section>


        {/* Documentation */}
        <DocumentationSection />
      </div>
    </div>
  );
};

export default SettingsPage;
