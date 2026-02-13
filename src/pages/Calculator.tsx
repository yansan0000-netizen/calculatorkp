import { useCalculator } from "@/context/CalculatorContext";
import { Textarea } from "@/components/ui/textarea";
import ProductSelection from "@/components/calculator/ProductSelection";
import DimensionsForm from "@/components/calculator/DimensionsForm";
import AdditionalOptions from "@/components/calculator/AdditionalOptions";
import CostSummary from "@/components/calculator/CostSummary";
import InvoiceForm from "@/components/calculator/InvoiceForm";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const Calculator = () => {
  const { comment, setComment } = useCalculator();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container max-w-5xl py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                FOR SYSTEM PIPE ЕВРОПА 2024
              </h1>
              <p className="text-sm text-warning mt-1 italic">
                обратите внимание: некоторые металлы могут быть недоступны
              </p>
            </div>
            <Link
              to="/settings"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-4 h-4" />
              Настройки
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl py-8 space-y-8">
        {/* Top Section: Product Selection + Dimensions */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProductSelection />
            <DimensionsForm />
          </div>
        </div>

        {/* Additional Options */}
        <div className="bg-card rounded-lg border border-border p-6">
          <AdditionalOptions />
        </div>

        {/* Comment */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-3">
          <label className="text-sm font-medium text-foreground">
            Необходим комментарий? Вот сюда, пожалуйста:
          </label>
          <Textarea
            placeholder="Введите комментарий сюда"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-muted border-0 resize-none"
            rows={3}
          />
        </div>

        {/* Cost Summary */}
        <CostSummary />

        {/* Invoice Form - hidden, PDF export planned */}
        {/* <div className="bg-card rounded-lg border border-border p-6">
          <InvoiceForm />
        </div> */}
      </div>
    </div>
  );
};

export default Calculator;
