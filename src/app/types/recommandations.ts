export interface Recommandation<T> {
  id: string;
  zone_id: string;
  parameter: string;
  tips?: string;
  currentValue: T;
  betterValue: T;
  bestValue?: T;
  benefitsBetter: Benefits;
  benefitsBest?: Benefits;
  selectedValue?:RecommandationOption;
}

export type Benefits = { energy: number, co2: number};
export type RecommandationOption = 'current' | 'better' | 'optimal';

export interface RecommandationWithZone<T> extends Recommandation<T> {
  zoneId: string;
  zoneName: string;
}