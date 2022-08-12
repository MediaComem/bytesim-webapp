export interface Recommandation<T> {
  id: string;
  parameter: string;
  currentValue: T;
  betterValue: T;
  bestValue?: T;
  benefits: Benefits;
}

export type Benefits = { energy: number, co2: number};

export interface RecommandationWithZone<T> extends Recommandation<T> {
  zoneId: string;
  zoneName: string;
}