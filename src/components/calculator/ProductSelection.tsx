import { useCalculator } from "@/context/CalculatorContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Package } from "lucide-react";

const ProductSelection = () => {
  const { selectedProducts, toggleProduct } = useCalculator();

  const mainProducts = [
    { id: "austria", label: "Австрия - колпак" },
    { id: "germany", label: "Германия - кожух" },
    { id: "britain", label: "Британия - оклад" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Package className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Выберите изделие</h3>
      </div>
      <div className="space-y-3">
        {mainProducts.map((product) => (
          <label
            key={product.id}
            className="flex items-center gap-3 cursor-pointer group bg-muted rounded-xl px-4 py-3 hover:bg-primary/5 transition-colors"
          >
            <Checkbox
              checked={selectedProducts.includes(product.id)}
              onCheckedChange={() => toggleProduct(product.id)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md"
            />
            <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
              {product.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ProductSelection;
