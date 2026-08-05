import { BadRequestException } from '@nestjs/common';
import { ParseBigIntPipe } from './parse-bigint.pipe';
import { ParsePositiveIntPipe } from './parse-positive-int.pipe';

describe('ParseBigIntPipe', () => {
  const pipe = new ParseBigIntPipe();

  it('parses a positive integer without losing precision', () => {
    expect(pipe.transform('9007199254740993')).toBe(9007199254740993n);
  });

  it.each(['0', '-1', '1.5', 'abc'])(
    'rejects invalid identifier %s',
    (value) => {
      expect(() => pipe.transform(value)).toThrow(BadRequestException);
    },
  );
});

describe('ParsePositiveIntPipe', () => {
  const pipe = new ParsePositiveIntPipe();

  it('parses a positive safe integer', () => {
    expect(pipe.transform('42')).toBe(42);
  });

  it.each(['0', '-1', '1.5', '9007199254740992'])(
    'rejects invalid identifier %s',
    (value) => {
      expect(() => pipe.transform(value)).toThrow(BadRequestException);
    },
  );
});
