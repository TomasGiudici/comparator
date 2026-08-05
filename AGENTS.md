# AGENTS.md

## Purpose

This file defines the mandatory engineering conventions for the Comparator backend.

Codex must read and follow these instructions before inspecting, creating, modifying, or deleting project files. Existing project conventions take precedence when they are more specific than this document.

## Project Context

- Application: price comparison backend.
- Framework: NestJS 11.
- Language: TypeScript with strict typing.
- ORM: Prisma 7.
- Database: PostgreSQL.
- Database schema owned by this service: `comparator`.
- The service may consume the Catalog API over HTTP to obtain product information.
- The service must not query Catalog database tables directly.
- Public API fields use `camelCase`.
- Prisma models and database columns may remain in introspected `snake_case`.

## Core Architecture

Every business resource must follow this dependency flow:

```text
Controller
  -> Service
    -> Repository interface
      -> Concrete Prisma repository
        -> PrismaService
```

Never invert or skip these layers for convenience.

The standard module structure is:

```text
src/<resource>/
├── dto/
│   ├── create-<resource>.dto.ts
│   ├── update-<resource>.dto.ts
│   └── <resource>-response.dto.ts
├── entity/
│   └── <resource>.entity.ts
├── mapper/
│   └── <resource>.mapper.ts
├── repository/
│   ├── <resource>.repository.interface.ts
│   └── prisma-<resource>.repository.ts
├── <resource>.controller.ts
├── <resource>.service.ts
└── <resource>.module.ts
```

Do not create additional layers, abstractions, base repositories, generic CRUD services, utility wrappers, or architectural patterns unless the task clearly requires them and they match the existing codebase.

## Separation of Responsibilities

### Controllers

Controllers must:

- Define routes and HTTP verbs.
- Receive and validate route parameters, query parameters, and request bodies.
- Delegate application behavior to services.
- Return response DTOs.
- Use NestJS pipes for route parameter parsing.
- Use `@HttpCode(HttpStatus.NO_CONTENT)` for successful delete endpoints.

Controllers must not:

- Import Prisma.
- Inject repositories.
- Contain business rules.
- Query the database.
- Map Prisma records.
- Catch persistence errors.
- Construct complex response objects when a mapper should do it.

Controllers should remain thin.

### Services

Services must:

- Implement application and business rules.
- Depend only on repository interfaces or other application services.
- Throw NestJS HTTP exceptions such as:
  - `NotFoundException`
  - `ConflictException`
  - `BadRequestException`
- Use mappers to create response DTOs.
- Coordinate multiple repositories or API clients when a use case requires it.

Services must not:

- Import `Prisma`, `PrismaClient`, generated Prisma models, or `PrismaService`.
- Know Prisma error codes such as `P2002`, `P2003`, or `P2025`.
- Use database column names such as `created_at` or `branch_id`.
- Return raw persistence objects.
- Contain direct HTTP client configuration.

### Repository Interfaces

Repository interfaces are application contracts.

Each repository interface file must:

- Export a stable injection token.
- Export data contracts for create and update operations.
- Export an interface describing persistence operations.
- Use domain or application entities, not Prisma-generated types.
- Use English names in `camelCase`.

Example:

```ts
export const SUPERMARKET_REPOSITORY = 'supermarketRepository';

export interface CreateSupermarketData {
  name: string;
  active?: boolean;
}

export interface ISupermarketRepository {
  create(data: CreateSupermarketData): Promise<SupermarketEntity>;
  findAll(): Promise<SupermarketEntity[]>;
  findById(id: number): Promise<SupermarketEntity | null>;
  update(
    id: number,
    data: UpdateSupermarketData,
  ): Promise<SupermarketEntity | null>;
  delete(id: number): Promise<boolean>;
}
```

Do not expose Prisma input types, generated models, `Decimal`, or Prisma exceptions through repository interfaces.

### Concrete Prisma Repositories

Concrete Prisma repositories are the only resource-layer classes allowed to know Prisma.

They must:

- Inject `PrismaService`.
- Implement the repository interface.
- Translate application field names to Prisma/database field names.
- Map Prisma records to application entities.
- Catch known Prisma persistence errors.
- Translate Prisma errors into repository-level errors.
- Return `null` or `false` for expected not-found outcomes according to the interface.
- Set `updated_at: new Date()` when updating models whose Prisma schema does not use `@updatedAt`.

They must not:

- Throw NestJS HTTP exceptions.
- Return Prisma-generated models to services.
- Contain HTTP concerns.
- Contain business rules that belong in services.
- Be imported directly by controllers or services.

Prisma error handling convention:

- `P2002`: translate to `RepositoryUniqueConstraintError`.
- `P2003`: translate to `RepositoryForeignKeyConstraintError`.
- `P2025`: return `null` for update/find behavior or `false` for delete behavior, according to the repository contract.
- Re-throw unknown errors unchanged.

Repository-level errors belong in:

```text
src/common/errors/
```

### Entities

Entities represent data as the application understands it.

They must:

- Use English property names.
- Use `camelCase`.
- Avoid Prisma-generated types.
- Preserve precise runtime types such as `bigint`, `Date`, and string monetary values where appropriate.
- Represent nullable database values explicitly with `null`.

Example:

```ts
export interface BranchEntity {
  id: number;
  supermarketId: number;
  city: string | null;
  address: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### DTOs

Create a separate DTO for each input and output purpose:

- `Create<Resource>Dto`
- `Update<Resource>Dto`
- `<Resource>ResponseDto`

DTO rules:

- Use `class-validator`.
- Use `class-transformer` only when input transformation is required.
- Request and response fields must use English `camelCase`.
- Required create fields must not be optional.
- Update fields must be optional.
- Respect database length and format constraints.
- Validate positive numeric identifiers.
- Validate EAN-13 as exactly 13 digits when the field represents an EAN-13 code.
- Never expose Prisma objects directly as API responses.
- Do not use `any`.

The project uses a global `ValidationPipe` with:

```ts
new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
});
```

DTOs must be compatible with this configuration.

### Mappers

Mappers must:

- Be stateless classes with static methods.
- Convert application entities into response DTOs.
- Convert `Date` to ISO-8601 strings.
- Convert `bigint` identifiers to strings.
- Preserve decimal monetary values as strings.
- Keep response construction outside controllers and repositories.

Example method name:

```ts
static toResponse(entity: SupermarketEntity): SupermarketResponseDto
```

Do not inject dependencies into mappers unless an existing feature already requires it.

### Modules

Each feature module must:

- Register its controller.
- Register its service.
- Bind the repository injection token to the concrete Prisma repository using `useClass`.
- Export only dependencies required by other modules.

Example:

```ts
@Module({
  controllers: [SupermarketsController],
  providers: [
    SupermarketsService,
    {
      provide: SUPERMARKET_REPOSITORY,
      useClass: PrismaSupermarketRepository,
    },
  ],
  exports: [SupermarketsService, SUPERMARKET_REPOSITORY],
})
export class SupermarketsModule {}
```

Import every completed feature module into `AppModule`.

## Naming Conventions

All code identifiers must be in English:

- Variables
- Methods
- Classes
- Interfaces
- DTO properties
- Entity properties
- File and directory names
- Injection tokens
- Error classes

Use:

- `camelCase` for variables, methods, fields, and object properties.
- `PascalCase` for classes, interfaces, DTOs, entities, and modules.
- `kebab-case` for filenames and feature directories.
- Descriptive names instead of abbreviations.

Examples:

```ts
supermarketId
productBranchId
findById()
findAll()
create()
update()
remove()
```

Do not introduce Spanish identifiers into source code. User-facing exception messages may be written in Spanish because the API currently communicates errors in Spanish.

## Prisma Rules

Prisma may only be imported in:

- `src/prisma/`
- Concrete Prisma repository implementations.
- Infrastructure code that genuinely requires Prisma.

The generated client location is expected to be:

```text
src/generated/prisma/
```

The Prisma generator configuration is expected to include:

```prisma
generator client {
  provider        = "prisma-client"
  output          = "../src/generated/prisma"
  moduleFormat    = "cjs"
  previewFeatures = ["partialIndexes"]
}
```

Do not manually edit generated Prisma Client files.

Do not run destructive database commands unless the user explicitly requests them.

Without explicit approval, do not run:

```text
prisma db push
prisma migrate reset
prisma db execute
DROP
TRUNCATE
DELETE without a specific application use case
```

The current database was introspected. Preserve existing table names, constraints, indexes, foreign keys, check constraints, schemas, and row-level security behavior.

Before changing `schema.prisma`, inspect the existing schema and explain why the change is necessary.

## PostgreSQL and Serialization Rules

### BigInt

JavaScript JSON cannot serialize `bigint` directly.

Therefore:

- Keep `bigint` internally for Prisma and entities.
- Accept route `BigInt` identifiers through a dedicated parsing pipe.
- Return `BigInt` identifiers as decimal strings in response DTOs.

Do not cast `bigint` to `number`, because it may lose precision.

### Decimal and Money

Prices use PostgreSQL `Decimal(12, 2)`.

Therefore:

- Accept prices as strings.
- Validate their decimal format.
- Construct Prisma decimal values only inside concrete Prisma repositories.
- Return prices as strings.
- Never convert monetary values to JavaScript floating-point numbers unless the task explicitly requires an approximate calculation.

### Dates

- Keep dates as `Date` inside entities.
- Return dates as ISO-8601 strings in response DTOs.
- Use UTC-safe serialization through `toISOString()`.

## HTTP API Conventions

The application uses the global prefix:

```text
/comparator
```

Basic CRUD endpoints follow:

```text
POST   /comparator/<resources>
GET    /comparator/<resources>
GET    /comparator/<resources>/:id
PATCH  /comparator/<resources>/:id
DELETE /comparator/<resources>/:id
```

Expected status behavior:

- Successful create: `201 Created`.
- Successful read/update: `200 OK`.
- Successful delete: `204 No Content`.
- Missing resource: `404 Not Found`.
- Unique conflict: `409 Conflict`.
- Invalid relation or malformed input: `400 Bad Request`.
- Delete blocked by relations: `409 Conflict`.

Use plural route names matching existing project conventions.

## External Catalog API

Product descriptive data belongs to the Catalog API.

When a use case requires product information:

- Create or use a dedicated Catalog API client/service.
- Read the base URL from `CATALOG_API_BASE_URL`.
- Keep Axios and HTTP-specific behavior inside the integration layer.
- Do not access Catalog database tables through Prisma.
- Do not persist duplicated Catalog product data unless the task explicitly requires it.
- Handle upstream timeouts, unavailable services, malformed responses, and not-found responses deliberately.
- Define response contracts instead of using `any`.

The comparison service may combine:

1. Product information from the Catalog API.
2. Branch and price data from the `comparator` database schema.

This orchestration belongs in an application service, not in a controller or repository.

## Update and Delete Semantics

Use `PATCH` for partial updates.

Current CRUD endpoints use physical deletes unless a task explicitly changes the behavior.

Before implementing a delete:

- Inspect foreign-key behavior.
- Translate blocked deletes into a meaningful `409 Conflict`.
- Respect cascade behavior defined by the database.

For historical data such as `price_history`, prefer append-only behavior in new business use cases. Do not update or delete historical prices unless the requested feature explicitly requires full administrative CRUD.

## Code Quality Rules

- Use strict TypeScript.
- Never use `any`.
- Prefer explicit return types on public methods.
- Keep methods focused and reasonably small.
- Avoid duplicated mapping and validation logic.
- Avoid premature abstraction.
- Do not create generic repositories or generic CRUD controllers.
- Do not add dependencies when the existing stack can solve the task.
- Do not add comments that merely restate the code.
- Add comments only when they explain a non-obvious decision or constraint.
- Preserve existing formatting and lint rules.
- Do not rewrite unrelated files.
- Do not rename public routes or response fields without explicit instruction.
- Do not silently change behavior outside the requested scope.

## Testing Expectations

For every implementation task:

1. Inspect the relevant existing files first.
2. Make the smallest coherent change.
3. Run Prisma generation only when the Prisma schema or generated client requires it.
4. Run:

```powershell
npm run build
```

5. Run relevant tests when they exist:

```powershell
npm run test
npm run test:e2e
```

6. Run lint only when it will not obscure unrelated pre-existing issues:

```powershell
npm run lint
```

7. Report:
   - Files created.
   - Files modified.
   - Commands executed.
   - Build/test results.
   - Remaining risks or assumptions.

Do not claim that code works unless the relevant command was actually executed successfully.

## Workflow Before Editing

Before writing code, Codex must:

1. Read this `AGENTS.md`.
2. Inspect `package.json`.
3. Inspect `prisma/schema.prisma` when persistence is involved.
4. Inspect the closest existing feature module and follow its conventions.
5. Inspect `AppModule`, `PrismaService`, and global application configuration when relevant.
6. Identify whether the task changes API contracts or database behavior.
7. Prefer the existing architecture over inventing a new one.

For broad or ambiguous tasks, first produce a brief implementation plan and list the files expected to change. For small, well-defined tasks, implement directly.

## Git Safety

- Check `git status` before modifying files.
- Do not discard unrelated local changes.
- Do not use `git reset --hard`.
- Do not use `git clean -fd`.
- Do not force-push.
- Do not commit or push unless explicitly requested.
- Do not edit `.env`.
- Never expose or print secrets from `.env`.
- Update `.env.template` only when adding a new required environment variable.

## Definition of Done

A task is complete only when:

- The requested behavior is implemented.
- Architecture boundaries are respected.
- DTO validation is present.
- Prisma is isolated to infrastructure/repositories.
- Application responses use the expected naming and serialization.
- Feature modules are registered correctly.
- The project builds successfully.
- Relevant tests pass, or missing tests are clearly disclosed.
- No unrelated code was modified.
- The final summary states exactly what changed.
