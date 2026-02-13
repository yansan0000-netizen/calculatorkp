import { useCalculator } from "@/context/CalculatorContext";
import { calculatePrice } from "@/data/calculatorData";
import { Checkbox } from "@/components/ui/checkbox";

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
    new Intl.NumberFormat("ru-RU").format(price) + " руб";

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">ОБЩАЯ СТОИМОСТЬ КОМПЛЕКТА</h2>
        <span className="text-xl font-bold text-foreground">{formatPrice(totalPrice)}</span>
      </div>

      <div className="divide-y divide-border">
        {products.map((product) => {
          const isSelected = selectedProducts.includes(product.id);
          const price = getPrice(product.id);
          const isMain = product.category === "main";

          return (
            <div key={product.id} className="flex items-center justify-between py-3">
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleProduct(product.id)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className={`text-sm ${isMain && isSelected ? "font-semibold" : ""} text-foreground`}>
                  {product.name} ({product.description})
                </span>
              </label>
              <span className="text-sm font-medium min-w-[100px] text-right text-primary">
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
