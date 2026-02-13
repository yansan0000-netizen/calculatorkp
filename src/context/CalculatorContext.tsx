import React, { createContext, useContext, useState, ReactNode } from "react";

interface CalculatorState {
  // Product selections
  selectedProducts: string[];
  toggleProduct: (id: string) => void;

  // Dimensions
  dimensionX: number;
  setDimensionX: (v: number) => void;
  dimensionY: number;
  setDimensionY: (v: number) => void;
  dimensionL: number;
  setDimensionL: (v: number) => void;

  // Options
  roofAngle: number;
  setRoofAngle: (v: number) => void;
  metalCoating: string;
  setMetalCoating: (v: string) => void;
  metalColor: string;
  setMetalColor: (v: string) => void;
  capCollection: string;
  setCapCollection: (v: string) => void;
  designBypass: string;
  setDesignBypass: (v: string) => void;
  roofMaterial: string;
  setRoofMaterial: (v: string) => void;
  comment: string;
  setComment: (v: string) => void;
}

const CalculatorContext = createContext<CalculatorState | null>(null);

export const useCalculator = () => {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculator must be used within CalculatorProvider");
  return ctx;
};

export const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(["austria", "germany", "britain"]);
  const [dimensionX, setDimensionX] = useState(100);
  const [dimensionY, setDimensionY] = useState(200);
  const [dimensionL, setDimensionL] = useState(100);
  const [roofAngle, setRoofAngle] = useState(20);
  const [metalCoating, setMetalCoating] = useState("Стальной бархат");
  const [metalColor, setMetalColor] = useState("RAL 8017");
  const [capCollection, setCapCollection] = useState("ВЕНА");
  const [designBypass, setDesignBypass] = useState("Дрезден");
  const [roofMaterial, setRoofMaterial] = useState("Высокопрофилированное");
  const [comment, setComment] = useState("");

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <CalculatorContext.Provider
      value={{
        selectedProducts, toggleProduct,
        dimensionX, setDimensionX,
        dimensionY, setDimensionY,
        dimensionL, setDimensionL,
        roofAngle, setRoofAngle,
        metalCoating, setMetalCoating,
        metalColor, setMetalColor,
        capCollection, setCapCollection,
        designBypass, setDesignBypass,
        roofMaterial, setRoofMaterial,
        comment, setComment,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};
