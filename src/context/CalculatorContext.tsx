import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  CapModel, BoxModel, FlashingModel, AddonId,
  defaultCoatings, defaultColors, DEFAULT_METAL_PRICE,
} from "@/data/calculatorData";

interface MetalColor { code: string; name: string; }

// Price matrix: priceMatrix[coating][colorCode] = price
export type PriceMatrix = Record<string, Record<string, number>>;

const defaultPriceMatrix: PriceMatrix = {
  "полиэстер": { "RAL 7024": 510 },
};

interface CalculatorState {
  // Dimensions
  dimensionX: number; setDimensionX: (v: number) => void;
  dimensionY: number; setDimensionY: (v: number) => void;
  dimensionH: number; setDimensionH: (v: number) => void;
  roofAngle: number; setRoofAngle: (v: number) => void;

  // Metal
  metalCoating: string; setMetalCoating: (v: string) => void;
  metalColor: string; setMetalColor: (v: string) => void;
  metalPrice: number; setMetalPrice: (v: number) => void;
  meshPrice: number; setMeshPrice: (v: number) => void;
  stainlessPrice: number; setStainlessPrice: (v: number) => void;
  zincPrice065: number; setZincPrice065: (v: number) => void;

  // Price matrix
  priceMatrix: PriceMatrix; setPriceMatrix: (v: PriceMatrix) => void;
  updateMatrixPrice: (coating: string, color: string, price: number) => void;

  // Products
  capModel: CapModel; setCapModel: (v: CapModel) => void;
  boxModel: BoxModel; setBoxModel: (v: BoxModel) => void;
  flashingModel: FlashingModel; setFlashingModel: (v: FlashingModel) => void;

  // Addons
  selectedAddons: AddonId[]; toggleAddon: (id: AddonId) => void;

  // Discount
  discount: number; setDiscount: (v: number) => void;

  // Lists
  coatings: string[]; setCoatings: (v: string[]) => void;
  colors: MetalColor[]; setColors: (v: MetalColor[]) => void;

  // Comment
  comment: string; setComment: (v: string) => void;
}

const CalculatorContext = createContext<CalculatorState | null>(null);

export const useCalculator = () => {
  const ctx = useContext(CalculatorContext);
  if (!ctx) throw new Error("useCalculator must be used within CalculatorProvider");
  return ctx;
};

export const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  const [dimensionX, setDimensionX] = useState(380);
  const [dimensionY, setDimensionY] = useState(380);
  const [dimensionH, setDimensionH] = useState(500);
  const [roofAngle, setRoofAngle] = useState(30);

  const [metalCoating, setMetalCoating] = useState("полиэстер");
  const [metalColor, setMetalColor] = useState("RAL 7024");
  const [metalPrice, setMetalPrice] = useState(DEFAULT_METAL_PRICE);
  const [meshPrice, setMeshPrice] = useState(350);
  const [stainlessPrice, setStainlessPrice] = useState(800);
  const [zincPrice065, setZincPrice065] = useState(420);

  const [priceMatrix, setPriceMatrix] = useState<PriceMatrix>(() => {
    try {
      const saved = localStorage.getItem("pipe_price_matrix");
      return saved ? JSON.parse(saved) : defaultPriceMatrix;
    } catch { return defaultPriceMatrix; }
  });

  const [capModel, setCapModel] = useState<CapModel>("classic_simple");
  const [boxModel, setBoxModel] = useState<BoxModel>("none");
  const [flashingModel, setFlashingModel] = useState<FlashingModel>("none");
  const [selectedAddons, setSelectedAddons] = useState<AddonId[]>([]);
  const [discount, setDiscount] = useState(0);

  const [coatings, setCoatings] = useState(defaultCoatings);
  const [colors, setColors] = useState(defaultColors);
  const [comment, setComment] = useState("");

  // Auto-lookup metal price from matrix when coating/color changes
  useEffect(() => {
    const price = priceMatrix[metalCoating]?.[metalColor];
    if (price && price > 0) {
      setMetalPrice(price);
    }
  }, [metalCoating, metalColor, priceMatrix]);

  // Persist price matrix
  useEffect(() => {
    localStorage.setItem("pipe_price_matrix", JSON.stringify(priceMatrix));
  }, [priceMatrix]);

  const updateMatrixPrice = (coating: string, color: string, price: number) => {
    setPriceMatrix(prev => ({
      ...prev,
      [coating]: { ...(prev[coating] || {}), [color]: price },
    }));
  };

  const toggleAddon = (id: AddonId) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <CalculatorContext.Provider value={{
      dimensionX, setDimensionX, dimensionY, setDimensionY,
      dimensionH, setDimensionH, roofAngle, setRoofAngle,
      metalCoating, setMetalCoating, metalColor, setMetalColor,
      metalPrice, setMetalPrice, meshPrice, setMeshPrice,
      stainlessPrice, setStainlessPrice, zincPrice065, setZincPrice065,
      priceMatrix, setPriceMatrix, updateMatrixPrice,
      capModel, setCapModel, boxModel, setBoxModel,
      flashingModel, setFlashingModel,
      selectedAddons, toggleAddon,
      discount, setDiscount,
      coatings, setCoatings, colors, setColors,
      comment, setComment,
    }}>
      {children}
    </CalculatorContext.Provider>
  );
};
