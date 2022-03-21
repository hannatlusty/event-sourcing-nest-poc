import cuid from 'cuid';

export class Product {
  constructor(
    readonly name: string,
    readonly price: number,
    readonly id = cuid(),
  ) {}
}
