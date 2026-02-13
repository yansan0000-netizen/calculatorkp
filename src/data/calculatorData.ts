// Pricing and product data for the pipe system calculator

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: "main" | "addon";
  // Price multiplier type: how dimensions affect price
  priceType: "perimeter" | "area" | "length" | "fixed";
}

export const defaultProducts: Product[] = [
  { id: "austria", name: "АВСТРИЯ", description: "дизайнерский колпак", basePrice: 14137, category: "main", priceType: "perimeter" },
  { id: "moze", name: "МОЗЕ Норвегия", description: 'защитная сетка от птиц "AL"', basePrice: 3200, category: "addon", priceType: "perimeter" },
  { id: "wade", name: "ВАДЕ Норвегия", description: 'жаропрочная вставка "AISI"', basePrice: 4500, category: "addon", priceType: "area" },
  { id: "germany", name: "ГЕРМАНИЯ", description: "коллекционный обход трубы", basePrice: 19583, category: "main", priceType: "perimeter" },
  { id: "kristo", name: "КРИСТО Норвегия", description: "утепление выше кровли", basePrice: 5600, category: "addon", priceType: "length" },
  { id: "britain", name: "БРИТАНИЯ", description: "надежное примыкание кровли", basePrice: 14097, category: "main", priceType: "perimeter" },
  { id: "timo", name: "ТИМО Норвегия", description: "утепление стыка", basePrice: 2800, category: "addon", priceType: "perimeter" },
  { id: "soni", name: "СОНИ Норвегия", description: "гидроизоляционная юбка", basePrice: 3100, category: "addon", priceType: "perimeter" },
  { id: "molde", name: "МОЛДЕ Норвегия", description: "пожаростойкая разделка", basePrice: 4200, category: "addon", priceType: "area" },
  { id: "oslo", name: "ОСЛО Норвегия", description: "установочный короб", basePrice: 6800, category: "addon", priceType: "area" },
  { id: "larvik", name: "ЛАРВИК Норвегия", description: "элемент направления потока", basePrice: 2400, category: "addon", priceType: "fixed" },
];

export const defaultRoofAngles = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export const defaultMetalCoatings = [
  "Стальной бархат",
  "Полиэстер",
  "Пурал",
  "Пластизол",
  "PVDF",
];

export const defaultMetalColors = [
  { code: "RAL 8017", name: "Шоколадно-коричневый" },
  { code: "RAL 9005", name: "Чёрный" },
  { code: "RAL 7024", name: "Графитовый серый" },
  { code: "RAL 6005", name: "Зелёный мох" },
  { code: "RAL 3005", name: "Винно-красный" },
  { code: "RAL 5005", name: "Сигнальный синий" },
  { code: "RAL 1015", name: "Светлая слоновая кость" },
  { code: "RAL 9003", name: "Белый" },
];

export const defaultCapCollections = ["ВЕНА", "ПРАГА", "БЕРЛИН", "МАДРИД"];
export const defaultDesignBypasses = ["Дрезден", "Мюнхен", "Гамбург"];
export const defaultRoofMaterials = [
  "Высокопрофилированное",
  "Низкопрофилированное",
  "Плоская кровля",
  "Фальцевая кровля",
  "Мягкая черепица",
];

// Coating price multipliers
export const defaultCoatingMultipliers: Record<string, number> = {
  "Стальной бархат": 1.0,
  "Полиэстер": 0.85,
  "Пурал": 1.15,
  "Пластизол": 1.1,
  "PVDF": 1.25,
};

/**
 * Calculate dynamic price for a product based on dimensions and roof angle.
 * Base price is calibrated for X=100, Y=200, L=100, angle=20.
 */
export function calculatePrice(
  product: Product,
  x: number,
  y: number,
  l: number,
  angle: number,
  coatingMultiplier: number
): number {
  const refPerimeter = 2 * (100 + 200); // 600
  const refArea = 100 * 200; // 20000
  const refLength = 100;
  const refAngle = 20;

  const perimeter = 2 * (x + y);
  const area = x * y;

  // Angle factor: steeper = more material
  const angleFactor = 1 + (angle - refAngle) * 0.008;

  let sizeFactor = 1;
  switch (product.priceType) {
    case "perimeter":
      sizeFactor = perimeter / refPerimeter;
      break;
    case "area":
      sizeFactor = area / refArea;
      break;
    case "length":
      sizeFactor = l / refLength;
      break;
    case "fixed":
      sizeFactor = 1;
      break;
  }

  return Math.round(product.basePrice * sizeFactor * angleFactor * coatingMultiplier);
}
