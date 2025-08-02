import { createContext, type ReactNode, useContext, useState } from "react";
import type { Drink } from "../types/drink";

const initialDrinks: Drink[] = [
  { id: 1, name: "콜라", price: 1100, stock: 5, icon: "🥤" },
  { id: 2, name: "물", price: 600, stock: 10, icon: "💧" },
  { id: 3, name: "커피", price: 700, stock: 8, icon: "☕️" },
];

interface DrinksState {
  drinks: Drink[];
  purchasedItems: Drink[];
}

interface DrinksActions {
  updateDrinkStock: (drinkId: number) => void;
  dispenseDrink: (drink: Drink) => void;
  resetDrinks: () => void;
}

interface DrinksContextType extends DrinksState, DrinksActions {}

const DrinksContext = createContext<DrinksContextType | undefined>(undefined);

interface DrinksProviderProps {
  children: ReactNode;
}

export function DrinksProvider({ children }: DrinksProviderProps) {
  const [drinks, setDrinks] = useState(initialDrinks);
  const [purchasedItems, setPurchasedItems] = useState<Drink[]>([]);

  const updateDrinkStock = (drinkId: number) => {
    setDrinks((prevDrinks) => prevDrinks.map((d) => (d.id === drinkId ? { ...d, stock: d.stock - 1 } : d)));
  };

  const dispenseDrink = (drink: Drink) => {
    setPurchasedItems((prev) => [...prev, { ...drink, id: Date.now() }]);
  };

  const resetDrinks = () => {
    setDrinks(initialDrinks);
    setPurchasedItems([]);
  };

  const value: DrinksContextType = {
    drinks,
    purchasedItems,
    updateDrinkStock,
    dispenseDrink,
    resetDrinks,
  };

  return <DrinksContext.Provider value={value}>{children}</DrinksContext.Provider>;
}

export const useDrinks = () => {
  const context = useContext(DrinksContext);
  if (context === undefined) {
    throw new Error("useDrinks must be used within a DrinksProvider");
  }
  return context;
};
