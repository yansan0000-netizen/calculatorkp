import { useCalculator } from "@/context/CalculatorContext";
import { products } from "@/data/calculatorData";
import { Checkbox } from "@/components/ui/checkbox";

const ProductSelection = () => {
  const { selectedProducts, toggleProduct } = useCalculator();

  const mainProducts = [
    { id: "austria", label: "Австрия - колпак" },
    { id: "germany", label: "Германия - кожух" },
    { id: "britain", label: "Британия - оклад" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Выберите изделие</h3>
      <div className="space-y-3">
        {mainProducts.map((product) => (
          <label
            key={product.id}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Checkbox
              checked={selectedProducts.includes(product.id)}
              onCheckedChange={() => toggleProduct(product.id)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className="text-base text-foreground group-hover:text-primary transition-colors">
              {product.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ProductSelection;
