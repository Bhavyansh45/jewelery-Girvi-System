import { differenceInDays, parseISO } from 'date-fns';

export type CompoundingType = 'annually' | 'monthly' | 'quarterly' | 'daily';

export interface InterestCalculationParams {
  principal: number;
  rate: number; // Annual rate as percentage
  startDate: string;
  endDate: string;
  compoundingType: CompoundingType;
}

export interface SimpleInterestParams {
  principal: number;
  rate: number; // Annual rate as percentage
  startDate: string;
  endDate: string;
}

// Calculate compound interest
export function calculateCompoundInterest({
  principal,
  rate,
  startDate,
  endDate,
  compoundingType
}: InterestCalculationParams): number {
  const days = differenceInDays(parseISO(endDate), parseISO(startDate));
  const annualRate = rate / 100;
  
  let periodsPerYear: number;
  let timeInYears: number;
  
  switch (compoundingType) {
    case 'daily':
      periodsPerYear = 365;
      timeInYears = days / 365;
      break;
    case 'monthly':
      periodsPerYear = 12;
      timeInYears = days / 365;
      break;
    case 'quarterly':
      periodsPerYear = 4;
      timeInYears = days / 365;
      break;
    case 'annually':
      periodsPerYear = 1;
      timeInYears = days / 365;
      break;
    default:
      periodsPerYear = 12;
      timeInYears = days / 365;
  }
  
  const ratePerPeriod = annualRate / periodsPerYear;
  const numberOfPeriods = timeInYears * periodsPerYear;
  
  const amount = principal * Math.pow(1 + ratePerPeriod, numberOfPeriods);
  return amount - principal;
}

// Calculate simple interest
export function calculateSimpleInterest({
  principal,
  rate,
  startDate,
  endDate
}: SimpleInterestParams): number {
  const days = differenceInDays(parseISO(endDate), parseISO(startDate));
  const annualRate = rate / 100;
  
  return principal * annualRate * (days / 365);
}

// Calculate total amount (principal + interest)
export function calculateTotalAmount(principal: number, interest: number): number {
  return principal + interest;
}

// Calculate remaining principal after payment
export function calculateRemainingPrincipal(
  originalPrincipal: number,
  paidPrincipal: number
): number {
  return Math.max(0, originalPrincipal - paidPrincipal);
}

// Calculate remaining interest after payment
export function calculateRemainingInterest(
  totalInterest: number,
  paidInterest: number
): number {
  return Math.max(0, totalInterest - paidInterest);
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format weight
export function formatWeight(weight: number): string {
  return `${weight.toFixed(2)} grams`;
}

// Calculate percentage
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) return 0;
  return (part / total) * 100;
}

// Validate jewelry ID format
export function validateJewelryId(id: string): boolean {
  // Custom validation logic for jewelry ID
  return /^[A-Z0-9]{6,10}$/.test(id);
}

// Generate unique jewelry ID
export function generateJewelryId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `JG${timestamp}${random}`.toUpperCase();
}

// Calculate days between dates
export function calculateDays(startDate: string, endDate: string): number {
  return differenceInDays(parseISO(endDate), parseISO(startDate));
}

// Get current date in ISO format
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Parse date safely
export function parseDate(dateString: string): Date {
  return parseISO(dateString);
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = parseDate(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format date and time for display
export function formatDateTime(dateString: string): string {
  const date = parseDate(dateString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
} 