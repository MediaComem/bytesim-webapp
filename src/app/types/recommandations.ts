export interface Recommandation<T> {
  id: string;
  parameter: string;
  currentValue: T;
  betterValue: T;
  bestValue?: T;
  benefits: { energy: number, co2: number};
}