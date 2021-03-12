export interface IStripeCard {
  id?: string;
  customer: string;
  number: string;
  brand: string;
  country: string;
  expMonth: number;
  expYear: number;
  cvc: string;
}