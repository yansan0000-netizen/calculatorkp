import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Product,
  defaultProducts,
  defaultRoofAngles,
  defaultMetalCoatings,
  defaultMetalColors,
  defaultCapCollections,
  defaultDesignBypasses,
  defaultRoofMaterials,
  defaultCoatingMultipliers,
} from "@/data/calculatorData";

interface MetalColor {
  code: string;
  name: string;
}

interface CalculatorState {
  // Product selections
  selectedProducts: string[];
  toggleProduct: (id: string) => void;

  // Editable product list & prices
  products: Product[];
  setProducts: (p: Product[]) => void;
  updateProductPrice: (id: string, price: number) => void;

  // Editable dropdown lists
  roofAngles: number[];
  setRoofAngles: (v: number[]) => void;
  metalCoatings: string[];
  setMetalCoatings: (v: string[]) => void;
  metalColors: MetalColor[];
  setMetalColors: (v: MetalColor[]) => void;
  capCollections: string[];
  setCapCollections: (v: string[]) => void;
  designBypasses: string[];
  setDesignBypasses: (v: string[]) => void;
  roofMaterials: string[];
  setRoofMaterials: (v: string[]) => void;
  coatingMultipliers: Record<string, number>;
  setCoatingMultipliers: (v: Record<string, number>) => void;

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
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [roofAnglesState, setRoofAngles] = useState(defaultRoofAngles);
  const [metalCoatingsState, setMetalCoatings] = useState(defaultMetalCoatings);
  const [metalColorsState, setMetalColors] = useState(defaultMetalColors);
  const [capCollectionsState, setCapCollections] = useState(defaultCapCollections);
  const [designBypassesState, setDesignBypasses] = useState(defaultDesignBypasses);
  const [roofMaterialsState, setRoofMaterials] = useState(defaultRoofMaterials);
  const [coatingMultipliers, setCoatingMultipliers] = useState(defaultCoatingMultipliers);

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

  const updateProductPrice = (id: string, price: number) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, basePrice: price } : p)));
  };

  return (
    <CalculatorContext.Provider
      value={{
        selectedProducts, toggleProduct,
        products, setProducts, updateProductPrice,
        roofAngles: roofAnglesState, setRoofAngles,
        metalCoatings: metalCoatingsState, setMetalCoatings,
        metalColors: metalColorsState, setMetalColors,
        capCollections: capCollectionsState, setCapCollections,
        designBypasses: designBypassesState, setDesignBypasses,
        roofMaterials: roofMaterialsState, setRoofMaterials,
        coatingMultipliers, setCoatingMultipliers,
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
