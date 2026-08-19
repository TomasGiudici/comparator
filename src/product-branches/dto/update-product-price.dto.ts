import { IsString, Matches } from 'class-validator';

export class UpdateProductPriceDto {
  @IsString()
  @Matches(/^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/, {
    message: 'El precio debe ser un número positivo con hasta dos decimales.',
  })
  price!: string;
}
