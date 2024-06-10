import { TitleValue } from '../../../../feature/src/lib/interfaces/title-value.interface';

export interface PaymentDTO {
  value: number;
  providers: TitleValue[];
}

export interface PaymentSystemsDTO {
  deposit: PaymentDTO;
  withdrawal: PaymentDTO;
}
