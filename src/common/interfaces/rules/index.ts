export interface IRuleDefinition {
  propertyName: string;
  operator: IRuleDefinitionOperator;
  value: any;
}

export interface IRule {
  ruleName: string;
  rules: IRuleDefinition[];
}

export enum IRuleDefinitionOperator {
  EQUAL = 'EQUAL',
}
