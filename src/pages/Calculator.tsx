import { useState } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ProductSelection from "@/components/calculator/ProductSelection";
import DimensionsForm from "@/components/calculator/DimensionsForm";
import AdditionalOptions from "@/components/calculator/AdditionalOptions";
import CostSummary from "@/components/calculator/CostSummary";
import { Link } from "react-router-dom";
import { Settings, FileDown, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { generateCommercialPdf } from "@/utils/generatePdf";
import { toast } from "@/hooks/use-toast";

import type { CompanyInfo } from "@/utils/generatePdf";

const Calculator = () => {
  const calc = useCalculator();
  const { comment, setComment } = calc;
  const [pdfLoading, setPdfLoading] = useState(false);
  const [company, setCompany] = useState<CompanyInfo>({
    companyName: "",
    contactPerson: "",
    phone: "",
    email: "",
  });

  const handleExportPdf = async () => {
    setPdfLoading(true);
    try {
      await generateCommercialPdf({
        products: calc.products,
        selectedProducts: calc.selectedProducts,
        dimensionX: calc.dimensionX,
        dimensionY: calc.dimensionY,
        dimensionL: calc.dimensionL,
        roofAngle: calc.roofAngle,
        metalCoating: calc.metalCoating,
        metalColor: calc.metalColor,
        capCollection: calc.capCollection,
        designBypass: calc.designBypass,
        roofMaterial: calc.roofMaterial,
        coatingMultiplier: calc.coatingMultipliers[calc.metalCoating] ?? 1,
        comment: calc.comment,
        company,
      });
      toast({ title: "PDF сохранён" });
    } catch {
      toast({ title: "Ошибка генерации PDF", variant: "destructive" });
    } finally {
      setPdfLoading(false);
    }
  };

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

        {/* Company Info for PDF */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Данные для КП</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Название компании"
              value={company.companyName}
              onChange={(e) => setCompany((c) => ({ ...c, companyName: e.target.value }))}
              className="bg-muted border-0"
            />
            <Input
              placeholder="Контактное лицо"
              value={company.contactPerson}
              onChange={(e) => setCompany((c) => ({ ...c, contactPerson: e.target.value }))}
              className="bg-muted border-0"
            />
            <Input
              placeholder="Телефон"
              type="tel"
              value={company.phone}
              onChange={(e) => setCompany((c) => ({ ...c, phone: e.target.value }))}
              className="bg-muted border-0"
            />
            <Input
              placeholder="Email"
              type="email"
              value={company.email}
              onChange={(e) => setCompany((c) => ({ ...c, email: e.target.value }))}
              className="bg-muted border-0"
            />
          </div>
        </div>

        {/* PDF Export */}
        <div className="flex justify-center">
          <Button
            onClick={handleExportPdf}
            disabled={pdfLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 py-6 px-8 text-lg font-semibold rounded-lg"
          >
            <FileDown className="w-5 h-5 mr-2" />
            {pdfLoading ? "Генерация..." : "СКАЧАТЬ КП (PDF)"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
