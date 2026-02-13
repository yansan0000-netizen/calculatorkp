// Pricing and product data for the pipe system calculator

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: "main" | "addon";
}

export const products: Product[] = [
  { id: "austria", name: "АВСТРИЯ", description: "дизайнерский колпак", basePrice: 14137, category: "main" },
  { id: "moze", name: "МОЗЕ Норвегия", description: 'защитная сетка от птиц "AL"', basePrice: 3200, category: "addon" },
  { id: "wade", name: "ВАДЕ Норвегия", description: 'жаропрочная вставка "AISI"', basePrice: 4500, category: "addon" },
  { id: "germany", name: "ГЕРМАНИЯ", description: "коллекционный обход трубы", basePrice: 19583, category: "main" },
  { id: "kristo", name: "КРИСТО Норвегия", description: "утепление выше кровли", basePrice: 5600, category: "addon" },
  { id: "britain", name: "БРИТАНИЯ", description: "надежное примыкание кровли", basePrice: 14097, category: "main" },
  { id: "timo", name: "ТИМО Норвегия", description: "утепление стыка", basePrice: 2800, category: "addon" },
  { id: "soni", name: "СОНИ Норвегия", description: "гидроизоляционная юбка", basePrice: 3100, category: "addon" },
  { id: "molde", name: "МОЛДЕ Норвегия", description: "пожаростойкая разделка", basePrice: 4200, category: "addon" },
  { id: "oslo", name: "ОСЛО Норвегия", description: "установочный короб", basePrice: 6800, category: "addon" },
  { id: "larvik", name: "ЛАРВИК Норвегия", description: "элемент направления потока", basePrice: 2400, category: "addon" },
];

export const roofAngles = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

export const metalCoatings = [
  "Стальной бархат",
  "Полиэстер",
  "Пурал",
  "Пластизол",
  "PVDF",
];

export const metalColors = [
  { code: "RAL 8017", name: "Шоколадно-коричневый" },
  { code: "RAL 9005", name: "Чёрный" },
  { code: "RAL 7024", name: "Графитовый серый" },
  { code: "RAL 6005", name: "Зелёный мох" },
  { code: "RAL 3005", name: "Винно-красный" },
  { code: "RAL 5005", name: "Сигнальный синий" },
  { code: "RAL 1015", name: "Светлая слоновая кость" },
  { code: "RAL 9003", name: "Белый" },
];

export const capCollections = ["ВЕНА", "ПРАГА", "БЕРЛИН", "МАДРИД"];

export const designBypasses = ["Дрезден", "Мюнхен", "Гамбург"];

export const roofMaterials = [
  "Высокопрофилированное",
  "Низкопрофилированное",
  "Плоская кровля",
  "Фальцевая кровля",
  "Мягкая черепица",
];
