import { BetsType } from './bets.type';
import { TitleValue } from '../../../../feature/src/lib/interfaces/title-value.interface';

export type BetsTypeTitle = 'Total' | 'Live' | 'PreMatch' | 'Singles' | 'Multiples' | 'System' | 'Chain';

export interface BetsTypeDTO {
  title: BetsType;
  elements: TitleValue[];
}
