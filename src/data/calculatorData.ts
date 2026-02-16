// New pricing data and formulas based on Excel specification

// === Cap Models ===
export type CapModel = "classic_simple" | "classic_slatted" | "modern_simple" | "modern_slatted" | "custom";
export const capModels: { id: CapModel; name: string; description: string }[] = [
  { id: "classic_simple", name: "Классика простой", description: "Традиционный колпак с гладкой отделкой" },
  { id: "classic_slatted", name: "Классика реечный", description: "Классический колпак с реечным оформлением" },
  { id: "modern_simple", name: "Модерн простой", description: "Современный колпак с лаконичным дизайном" },
  { id: "modern_slatted", name: "Модерн реечный", description: "Современный колпак с реечной отделкой" },
  { id: "custom", name: "По эскизу", description: "Индивидуальный проект по вашему эскизу" },
];

// === Box Models ===
export type BoxModel = "smooth" | "lamellar" | "none";
export const boxModels: { id: BoxModel; name: string; description: string }[] = [
  { id: "none", name: "Без короба", description: "Короб не требуется" },
  { id: "smooth", name: "Простой гладкий", description: "Гладкий короб для обхода трубы" },
  { id: "lamellar", name: "Ламельный", description: "Декоративный короб с ламелями" },
];

// === Flashing Models ===
export type FlashingModel = "flat" | "profiled" | "none";
export const flashingModels: { id: FlashingModel; name: string; description: string }[] = [
  { id: "none", name: "Без оклада", description: "Оклад не требуется" },
  { id: "flat", name: "Для плоских покрытий", description: "Оклад для плоских кровельных покрытий" },
  { id: "profiled", name: "Для профилированных покрытий", description: "Оклад для профилированных кровельных покрытий" },
];

// === Additional Options ===
export type AddonId = "mesh" | "heatproof" | "bottom_cap" | "gas_passthrough" | "mount_frame" | "mount_skeleton";
export interface AddonOption {
  id: AddonId;
  name: string;
  description: string;
  appliesTo: "cap" | "box" | "all";
}
export const addonOptions: AddonOption[] = [
  { id: "mesh", name: "Сетка от птиц", description: "Защитная сетка от проникновения птиц", appliesTo: "cap" },
  { id: "heatproof", name: "Жаростойкая вставка", description: "Вставка из нержавеющей стали", appliesTo: "cap" },
  { id: "bottom_cap", name: "Нижняя крышка", description: "Нижняя крышка колпака", appliesTo: "cap" },
  { id: "gas_passthrough", name: "Проходка газового котла", description: "Для классики — 2500 ₽, для модерна — 1800 ₽", appliesTo: "cap" },
  { id: "mount_frame", name: "Установочная рамка", description: "Рамка для монтажа короба", appliesTo: "box" },
  { id: "mount_skeleton", name: "Установочный каркас", description: "Несущий каркас для монтажа короба", appliesTo: "box" },
];

// === Metal Coatings ===
export const defaultCoatings = [
  "без покрытия 0,45",
  "без покрытия 0,65",
  "полиэстер",
  "полиэстер текстура",
  "satin",
  "velur",
  "PUR",
  "PUR mat",
  "бархат",
];

// === Metal Colors ===
export const defaultColors = [
  { code: "цинк", name: "Цинк" },
  { code: "RAL 7024", name: "Графитовый серый" },
  { code: "RAL 8017", name: "Шоколадно-коричневый" },
  { code: "RAL 9005", name: "Чёрный" },
  { code: "RAL 8019", name: "Серо-коричневый" },
  { code: "RAL 6005", name: "Зелёный мох" },
  { code: "RAL 7004", name: "Сигнальный серый" },
  { code: "RAL 5005", name: "Сигнальный синий" },
  { code: "RAL 3011", name: "Коричнево-красный" },
  { code: "RAL 3005", name: "Винно-красный" },
  { code: "RR 32", name: "Тёмно-коричневый" },
  { code: "нержавейка", name: "Нержавеющая сталь" },
];

// === Special material keys in price matrix ===
export const specialMaterials = ["сетка", "нержавейка", "цинк 0,65"] as const;

// === Default metal price (user can edit in settings) ===
export const DEFAULT_METAL_PRICE = 510;

// === Pricing Formulas ===
// X, Y in mm; H in mm; metalPrice = price per unit from matrix

export function calcCapPrice(model: CapModel, X: number, Y: number, metalPrice: number): number {
  switch (model) {
    case "classic_simple":
      return ((X * Y * 0.001 + 1500) + (X + Y) * 0.002 * (0.25 + 0.00075 * X) * metalPrice) * 2;
    case "classic_slatted":
      return ((X * Y * 0.0015 + 1500) + (X + Y) * 0.002 * (0.625 + 0.00075 * X) * metalPrice) * 2;
    case "modern_simple":
      return ((X * Y * 0.001 + 1000) + (X + Y) * 0.002 * (0.25 + 0.00065 * X) * metalPrice) * 2;
    case "modern_slatted":
      return ((X * Y * 0.0015 + 1500) + (X + Y) * 0.002 * (0.625 + 0.00065 * X) * metalPrice) * 2;
    case "custom":
      return 0; // Individual pricing
  }
}

export function calcBoxPrice(model: BoxModel, X: number, Y: number, H: number, metalPrice: number): number {
  switch (model) {
    case "none": return 0;
    case "smooth":
      return ((X * Y * 0.0025 + 2500) + (X + Y) * 0.002 * (H * 0.001) * metalPrice) * 2;
    case "lamellar":
      return ((X * Y * 0.0025 + 2500) * 2 + (X + Y) * 0.002 * 1.6 * (H * 0.001) * metalPrice) * 2.15;
  }
}

export function calcFlashingPrice(model: FlashingModel, X: number, Y: number, metalPrice: number): number {
  switch (model) {
    case "none": return 0;
    case "flat":
      return ((X * Y * 0.002 + 2000) + (X * 0.00125 + Y * 0.00085) * metalPrice) * 2;
    case "profiled":
      return ((X * Y * 0.002 + 3000) + (X * 0.00125 + Y * 0.001) * metalPrice + (X + 0.5) * 500) * 2;
  }
}

export function calcAddonPrice(
  addonId: AddonId,
  capModel: CapModel,
  X: number, Y: number, H: number,
  metalPrice: number,
  meshPrice: number,
  stainlessPrice: number,
  zincPrice065: number
): number {
  switch (addonId) {
    case "mesh":
      return ((X + Y) * 0.0005 * meshPrice * 1.2 + 500) * 2;
    case "heatproof":
      return (X * Y * 0.000001 * 1.2 * stainlessPrice + 500) * 2;
    case "bottom_cap":
      return (X * Y * 0.000001 * 1.2 * metalPrice + 500) * 2;
    case "gas_passthrough":
      return capModel.startsWith("classic") ? 2500 : 1800;
    case "mount_frame":
      return ((X + Y) * 0.0005 * zincPrice065 * 1.2 + 500) * 2;
    case "mount_skeleton":
      return (((X + Y) * 0.001 + (H * 0.001) * 0.004) * zincPrice065 * 1.2 + 2500) * 2;
  }
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " ₽";
