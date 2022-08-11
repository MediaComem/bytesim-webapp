export interface Recommandation<T> {
  parameter: string;
  currentValue: T;
  betterValue: T;
  bestValue?: T;
  benefits: { energy: number, co2: number};
}