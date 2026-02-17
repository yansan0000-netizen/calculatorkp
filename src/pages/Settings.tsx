import { useCalculator } from "@/context/CalculatorContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Trash2, Grid3x3, Building2, Upload, Image, ImagePlus, Lock, Package, BookOpen, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NumericInput } from "@/components/calculator/DimensionsForm";
import { toast } from "@/hooks/use-toast";
import { capModels, boxModels, flashingModels } from "@/data/calculatorData";
import { defaultCapImages, defaultBoxImages, defaultFlashingImages, getAllModels } from "@/components/calculator/ProductSelection";
import { getPassword, setPassword } from "@/components/PasswordGate";

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

// === Product Image Manager ===
const ProductImageManager = () => {
  const [images, setImages] = useState<ProductImageConfig>(getStoredImages);
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
    toast({ title: "Изображение сброшено" });
  };

  const groups: { key: "cap" | "box" | "flashing"; title: string; items: { id: string; name: string }[] }[] = [
    { key: "cap", title: "Колпаки", items: getAllModels("cap").filter(m => m.id !== "custom") },
    { key: "box", title: "Короба", items: getAllModels("box").filter(m => m.id !== "none") },
    { key: "flashing", title: "Оклады", items: getAllModels("flashing").filter(m => m.id !== "none") },
  ];

  return (
    <section className="card-soft p-8">
      <div className="flex items-center gap-2 mb-4">
        <ImagePlus className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Изображения изделий</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Загрузите свои изображения для отображения в калькуляторе. PNG/JPG до 500 КБ.
      </p>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

      {groups.map(group => (
        <div key={group.key} className="mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3">{group.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {group.items.map(item => {
              const customImg = images[group.key]?.[item.id];
              const defaultImg = defaults[group.key]?.[item.id];
              const currentImg = customImg || defaultImg;
              return (
                <div key={item.id} className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                  <div className="w-14 h-14 rounded-lg bg-card border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                    {currentImg ? (
                      <img src={currentImg} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Image className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{customImg ? "Пользовательское" : currentImg ? "По умолчанию" : "Нет изображения"}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-lg h-8 px-2"
                      onClick={() => {
                        setUploadTarget({ group: group.key, id: item.id });
                        fileRef.current?.click();
                      }}
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </Button>
                    {customImg && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-lg h-8 px-2 text-destructive"
                        onClick={() => resetImage(group.key, item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
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
];

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
                <div className="text-sm text-muted-foreground mt-3 whitespace-pre-line leading-relaxed">
                  {section.content.split(/(`[^`]+`)/).map((part, j) =>
                    part.startsWith("`") && part.endsWith("`") ? (
                      <code key={j} className="bg-muted text-foreground px-1.5 py-0.5 rounded text-xs font-mono">
                        {part.slice(1, -1)}
                      </code>
                    ) : part.split(/(\*\*[^*]+\*\*)/).map((sub, k) =>
                      sub.startsWith("**") && sub.endsWith("**") ? (
                        <strong key={`${j}-${k}`} className="text-foreground font-bold">{sub.slice(2, -2)}</strong>
                      ) : (
                        <span key={`${j}-${k}`}>{sub}</span>
                      )
                    )
                  )}
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

        {/* Documentation */}
        <DocumentationSection />
      </div>
    </div>
  );
};

export default SettingsPage;
