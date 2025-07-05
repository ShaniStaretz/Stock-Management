import { PORTFOLIO_CONFIG } from "../components/portfolioColumns";

export const validateQuantity = (value: number): boolean => {
  return value >= PORTFOLIO_CONFIG.MIN_QUANTITY;
};

export const validateSymbol = (symbol: string): boolean => {
  return PORTFOLIO_CONFIG.SYMBOL_REGEX.test(symbol);
};

export const isPortfolioFormValid = (
  symbol: string,
  name: string,
  quantity: number
): boolean => {
  return (
    !!symbol &&
    validateSymbol(symbol) &&
    !!name &&
    !!quantity &&
    validateQuantity(quantity)
  );
}; 