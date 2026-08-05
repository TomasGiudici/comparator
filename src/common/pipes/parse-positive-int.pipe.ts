import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    if (!/^[1-9]\d*$/.test(value)) {
      throw new BadRequestException(
        'El identificador debe ser un entero positivo.',
      );
    }

    const parsedValue = Number(value);
    if (!Number.isSafeInteger(parsedValue)) {
      throw new BadRequestException('El identificador está fuera de rango.');
    }

    return parsedValue;
  }
}
