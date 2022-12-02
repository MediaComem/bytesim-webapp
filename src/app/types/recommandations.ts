import React from "react";

export interface Recommandation<T> {
  id: string;
  type: RecommandationType;
  zone_id: string;
  parameter: string;
  bestPracticeMessage?: string | React.ReactNode;
  message?: string;
  currentValue?: T;
  betterValue?: T;
  bestValue?: T;
  benefitsBetter?: Benefits;
  benefitsBest?: Benefits;
  selectedValue?:RecommandationOption;
}

export enum RecommandationTypes {
  BETTER_VALUE = 'betterValue',
  TIP = 'tip',
  WARNING = 'warning'
}

export type Benefits = { energy: number, co2: number};
export type RecommandationOption = 'current' | 'better' | 'optimal';
export type RecommandationType = RecommandationTypes.BETTER_VALUE | RecommandationTypes.TIP | RecommandationTypes.WARNING;

export interface RecommandationWithZone<T> extends Recommandation<T> {
  zoneId: string;
  zoneName: string;
}

export interface BestPracticeMessage {
  title?: string;
  body: string;
  link?: string;
}