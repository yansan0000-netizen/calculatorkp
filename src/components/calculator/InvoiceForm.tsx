import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

const InvoiceForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    if (!name || !email || !phone) {
      toast({ title: "Заполните все поля", variant: "destructive" });
      return;
    }
    if (!agreed) {
      toast({ title: "Необходимо согласие на обработку данных", variant: "destructive" });
      return;
    }
    toast({ title: "Запрос отправлен!", description: "Мы свяжемся с вами в ближайшее время." });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground text-center">
        Хотите получить счет? Необходимо немного информации.
      </h3>

      <div className="space-y-3">
        <Input
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-muted border-0"
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-muted border-0"
        />
        <Input
          placeholder="Телефон"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-muted border-0"
        />
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-lg font-semibold rounded-lg"
      >
        ХОЧУ СЧЕТ
      </Button>

      <label className="flex items-center gap-2 cursor-pointer">
        <Checkbox
          checked={agreed}
          onCheckedChange={(v) => setAgreed(v === true)}
        />
        <span className="text-sm text-muted-foreground">
          Соглашаюсь на <span className="text-primary cursor-pointer">обработку персональных данных</span>
        </span>
      </label>

      <Button
        onClick={handlePrint}
        variant="secondary"
        className="bg-primary text-primary-foreground hover:bg-primary/90 py-4 text-base font-semibold rounded-lg"
      >
        РАСПЕЧАТАТЬ КАЛЬКУЛЯТОР
      </Button>
    </div>
  );
};

export default InvoiceForm;
