export class RepositoryUniqueConstraintError extends Error {
  constructor() {
    super('A unique constraint was violated.');
    this.name = RepositoryUniqueConstraintError.name;
  }
}

export class RepositoryForeignKeyConstraintError extends Error {
  constructor() {
    super('A foreign key constraint was violated.');
    this.name = RepositoryForeignKeyConstraintError.name;
  }
}
