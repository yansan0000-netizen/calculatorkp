import { useCalculator } from "@/context/CalculatorContext";
import { calculatePrice } from "@/data/calculatorData";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator } from "lucide-react";

const CostSummary = () => {
  const {
    selectedProducts, toggleProduct, products,
    dimensionX, dimensionY, dimensionL, roofAngle,
    metalCoating, coatingMultipliers,
  } = useCalculator();

  const coatMult = coatingMultipliers[metalCoating] ?? 1;

  const getPrice = (productId: string) => {
    if (!selectedProducts.includes(productId)) return 0;
    const product = products.find((p) => p.id === productId);
    if (!product) return 0;
    return calculatePrice(product, dimensionX, dimensionY, dimensionL, roofAngle, coatMult);
  };

  const totalPrice = products.reduce((sum, p) => sum + getPrice(p.id), 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("ru-RU").format(price) + " ₽";

  return (
    <div className="card-soft overflow-hidden">
      {/* Total header */}
      <div className="gradient-header px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-primary-foreground" />
          <h2 className="text-xl font-extrabold text-primary-foreground">СТОИМОСТЬ КОМПЛЕКТА</h2>
        </div>
        <span className="text-2xl font-extrabold text-primary-foreground">{formatPrice(totalPrice)}</span>
      </div>

      {/* Product list */}
      <div className="divide-y divide-border">
        {products.map((product) => {
          const isSelected = selectedProducts.includes(product.id);
          const price = getPrice(product.id);
          const isMain = product.category === "main";

          return (
            <div
              key={product.id}
              className={`flex items-center justify-between px-8 py-4 transition-colors ${
                isSelected ? "bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleProduct(product.id)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md"
                />
                <span className={`text-sm ${isMain && isSelected ? "font-bold" : "font-medium"} text-foreground`}>
                  {product.name}
                  <span className="text-muted-foreground font-normal ml-1">({product.description})</span>
                </span>
              </label>
              <span className={`text-sm font-bold min-w-[100px] text-right ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                {formatPrice(price)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CostSummary;
