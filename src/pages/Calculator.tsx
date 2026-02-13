import { useState } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ProductSelection from "@/components/calculator/ProductSelection";
import DimensionsForm from "@/components/calculator/DimensionsForm";
import AdditionalOptions from "@/components/calculator/AdditionalOptions";
import CostSummary from "@/components/calculator/CostSummary";
import { Link } from "react-router-dom";
import { Settings, FileDown, Building2, MessageSquare, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { generateCommercialPdf } from "@/utils/generatePdf";
import { toast } from "@/hooks/use-toast";
import { saveToHistory } from "@/pages/History";
import { calculatePrice } from "@/data/calculatorData";

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
      const pdfData = {
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
      };
      await generateCommercialPdf(pdfData);

      // Save to history
      const selected = calc.products.filter((p) => calc.selectedProducts.includes(p.id));
      const total = selected.reduce(
        (s, p) =>
          s +
          calculatePrice(p, calc.dimensionX, calc.dimensionY, calc.dimensionL, calc.roofAngle, pdfData.coatingMultiplier),
        0
      );
      saveToHistory({
        id: Date.now().toString(),
        date: new Date().toLocaleString("ru-RU"),
        companyName: company.companyName,
        contactPerson: company.contactPerson,
        totalPrice: total,
        selectedProductNames: selected.map((p) => p.name),
        pdfData,
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
      <div className="gradient-header">
        <div className="container max-w-5xl py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary-foreground">
              КАЛЬКУЛЯТОР СИСТЕМЫ PIPE
            </h1>
            <div className="flex items-center gap-2">
              <Link
                to="/history"
                className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors bg-white/10 rounded-full px-4 py-2"
              >
                <History className="w-4 h-4" />
                История
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors bg-white/10 rounded-full px-4 py-2"
              >
                <Settings className="w-4 h-4" />
                Настройки
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl py-8 space-y-6">
        {/* Top Section: Product Selection + Dimensions */}
        <div className="card-soft p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProductSelection />
            <DimensionsForm />
          </div>
        </div>

        {/* Additional Options */}
        <div className="card-soft p-8">
          <AdditionalOptions />
        </div>

        {/* Comment */}
        <div className="card-soft p-8 space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <label className="text-sm font-bold text-foreground">
              Комментарий к заказу
            </label>
          </div>
          <Textarea
            placeholder="Введите комментарий сюда"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-muted border-0 resize-none rounded-xl"
            rows={3}
          />
        </div>

        {/* Cost Summary */}
        <CostSummary />

        {/* Company Info for PDF */}
        <div className="card-soft p-8 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Данные для КП</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Название компании"
              value={company.companyName}
              onChange={(e) => setCompany((c) => ({ ...c, companyName: e.target.value }))}
              className="bg-muted border-0 rounded-xl"
            />
            <Input
              placeholder="Контактное лицо"
              value={company.contactPerson}
              onChange={(e) => setCompany((c) => ({ ...c, contactPerson: e.target.value }))}
              className="bg-muted border-0 rounded-xl"
            />
            <Input
              placeholder="Телефон"
              type="tel"
              value={company.phone}
              onChange={(e) => setCompany((c) => ({ ...c, phone: e.target.value }))}
              className="bg-muted border-0 rounded-xl"
            />
            <Input
              placeholder="Email"
              type="email"
              value={company.email}
              onChange={(e) => setCompany((c) => ({ ...c, email: e.target.value }))}
              className="bg-muted border-0 rounded-xl"
            />
          </div>
        </div>

        {/* PDF Export */}
        <div className="flex justify-center pb-8">
          <Button
            onClick={handleExportPdf}
            disabled={pdfLoading}
            className="gradient-accent text-accent-foreground hover:opacity-90 py-7 px-10 text-lg font-extrabold rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
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
