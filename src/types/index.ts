// Core business types
export * from './drink';
export * from './payment';
export * from './debug';
export * from './machine';

// Component types
export {DrinksProviderProps} from "src/contexts/DrinksContext";

// Common utility types
export type PaymentMethod = "cash" | "card";