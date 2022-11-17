export interface Recommandation<T> {
  id: string;
  type: RecommandationType;
  zone_id: string;
  parameter: string;
  bestPracticeMessage?: string;
  tipsMessage?: string;
  warningMessage?: string;
  currentValue?: T;
  betterValue?: T;
  bestValue?: T;
  benefitsBetter?: Benefits;
  benefitsBest?: Benefits;
  selectedValue?:RecommandationOption;
}

export type Benefits = { energy: number, co2: number};
export type RecommandationOption = 'current' | 'better' | 'optimal';
export type RecommandationType = 'betterValue' | 'tip' | 'warning';

export interface RecommandationWithZone<T> extends Recommandation<T> {
  zoneId: string;
  zoneName: string;
}