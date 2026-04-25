# Specification And Visitor

Use this reference when creating reusable business predicates, selection specs, mutation specs, composite specs, visitor-based SQL/API translation, or when repository methods are starting to grow `findBy...` variants.

## Specification Rule

A specification is a named business predicate or mutation intent. It should be reusable, composable, testable, and expressed in domain language.

Use a specification when:

- the same rule gates multiple use cases;
- the rule must be composed with `and`, `or`, or `not`;
- the rule must run in memory and be translated by adapters;
- the repository would otherwise need business-specific `findBy...` methods.

Avoid a specification when the rule is a one-off branch inside one application service or belongs directly inside an aggregate method.

## When Not To Use A Specification

Do not introduce a specification just because:

- a repository needs one more filter;
- a request DTO has many optional fields;
- the codebase already has a spec interface;
- the real decision about aggregate ownership is unclear.

Prefer another construct when:

- the invariant belongs directly in an aggregate method;
- the behavior coordinates multiple repositories or external systems;
- the object mostly describes paging, sorting, includes, caching, or transport concerns;
- the rule is too ad-hoc to deserve a named domain concept.

## Composite Specs

Prefer composable specs and named presets over repository business methods.

```ts
export interface UserSelectionSpec {
  isSatisfiedBy(candidate: User): boolean;
  accept<TResult>(visitor: UserSelectionSpecVisitor<TResult>): TResult;

  and(other: UserSelectionSpec): UserSelectionSpec;
  or(other: UserSelectionSpec): UserSelectionSpec;
  not(): UserSelectionSpec;
}

export class UserNameSpec extends BaseUserSelectionSpec {
  private constructor(public readonly name: UserName) {
    super();
  }

  static create(name: UserName): UserNameSpec {
    return new UserNameSpec(name);
  }

  isSatisfiedBy(candidate: User): boolean {
    return candidate.toState().name.equals(this.name);
  }

  accept<TResult>(visitor: UserSelectionSpecVisitor<TResult>): TResult {
    return visitor.visitUserName(this);
  }
}

export class UserEmailSpec extends BaseUserSelectionSpec {
  private constructor(public readonly email: UserEmail) {
    super();
  }

  static create(email: UserEmail): UserEmailSpec {
    return new UserEmailSpec(email);
  }

  isSatisfiedBy(candidate: User): boolean {
    return candidate.toState().email.equals(this.email);
  }

  accept<TResult>(visitor: UserSelectionSpecVisitor<TResult>): TResult {
    return visitor.visitUserEmail(this);
  }
}

export class UserLookupSpec {
  static byNameOrEmail(name: UserName, email: UserEmail): UserSelectionSpec {
    return UserNameSpec.create(name).or(UserEmailSpec.create(email));
  }
}
```

This keeps business language in the domain/application boundary:

```ts
const user = await users.findOne(context, UserLookupSpec.byNameOrEmail(name, email));
```

Avoid:

```ts
users.findByUserNameOrEmail(name.value, email.value);
```

The repository should not need to understand that "name or email" is a business lookup rule. It should translate the spec it receives.

## Builder With Explicit Grouping

When a spec tree becomes non-trivial, use a builder or preset factory so grouping is impossible to misread.

```ts
const spec = UserSpecs.create()
  .inOrganization(organizationId)
  .andGroup((group) =>
    group
      .withStatus(UserStatus.active())
      .or()
      .withStatus(UserStatus.invited()),
  )
  .not((group) => group.withRole(UserRole.suspended()))
  .build();
```

The intent is:

- organization matches;
- and status is active or invited;
- and role is not suspended.

Avoid mixing raw `and` and `or` calls where precedence is unclear.

## Visitor As Translation IoC

The visitor pattern inverts translation control:

- the domain owns the list of meaningful spec cases;
- the adapter implements how each case becomes SQL, search DSL, API filters, or test matching;
- the domain never imports the database/query-builder package.

```ts
export interface UserSelectionSpecVisitor<TResult> {
  visitUserName(spec: UserNameSpec): TResult;
  visitUserEmail(spec: UserEmailSpec): TResult;
  visitAnd(spec: AndUserSpec): TResult;
  visitOr(spec: OrUserSpec): TResult;
  visitNot(spec: NotUserSpec): TResult;
}
```

For SQL builders, let the visitor return a predicate rather than mutating domain state:

```ts
type SqlPredicate = (builder: ExpressionBuilder<Database, "users">) => Expression<boolean>;

class KyselyUserSelectionVisitor implements UserSelectionSpecVisitor<SqlPredicate> {
  visitUserName(spec: UserNameSpec): SqlPredicate {
    return (eb) => eb("name", "=", spec.name.value);
  }

  visitUserEmail(spec: UserEmailSpec): SqlPredicate {
    return (eb) => eb("email", "=", spec.email.value);
  }

  visitOr(spec: OrUserSpec): SqlPredicate {
    return (eb) => eb.or([spec.left.accept(this)(eb), spec.right.accept(this)(eb)]);
  }

  visitAnd(spec: AndUserSpec): SqlPredicate {
    return (eb) => eb.and([spec.left.accept(this)(eb), spec.right.accept(this)(eb)]);
  }

  visitNot(spec: NotUserSpec): SqlPredicate {
    return (eb) => eb.not(spec.inner.accept(this)(eb));
  }
}
```

The repository applies the translated predicate:

```ts
const predicate = spec.accept(new KyselyUserSelectionVisitor());
const row = await db.selectFrom("users").selectAll().where(predicate).executeTakeFirst();
```

## Mutation Specs

Use separate mutation specs when persistence needs explicit update/upsert translation.

```ts
export interface UserMutationSpecVisitor<TResult> {
  visitUpsertUser(spec: UpsertUserSpec): TResult;
}

export class UpsertUserSpec {
  private constructor(public readonly state: UserState) {}

  static fromUser(user: User): UpsertUserSpec {
    return new UpsertUserSpec(user.toState());
  }

  accept<TResult>(visitor: UserMutationSpecVisitor<TResult>): TResult {
    return visitor.visitUpsertUser(this);
  }
}
```

The aggregate still decides whether the mutation is valid. The mutation spec only tells the adapter how to persist an already-decided state.

## Mutation-Aware Specs

Mutation-aware specs are advanced. Use them only when one object must consistently support in-memory mutation and adapter-side translation of the same deterministic change.

```ts
interface MutationAwareSpec<TAggregate, TVisitor> {
  isSatisfiedBy(candidate: TAggregate): boolean;
  mutate(candidate: TAggregate): Result<TAggregate, DomainError>;
  accept<TResult>(visitor: TVisitor): TResult;
}

class NormalizeUserEmailSpec implements MutationAwareSpec<User, UserMutationSpecVisitor> {
  constructor(private readonly rawEmail: string) {}

  isSatisfiedBy(user: User): boolean {
    return user.toState().email.value !== this.rawEmail.trim().toLowerCase();
  }

  mutate(user: User): Result<User, DomainError> {
    const email = UserEmail.create(this.rawEmail);
    if (email.isErr()) return err(email.error);
    return user.changeEmail(email.value);
  }

  accept<TResult>(visitor: UserMutationSpecVisitor<TResult>): TResult {
    return visitor.visitNormalizeUserEmail(this);
  }
}
```

Do not use mutation-aware specs for workflows that need permissions, multiple repositories, external APIs, or branching orchestration. Those belong in application services.

## Exhaustiveness

When adding a new spec:

- update the visitor interface;
- update every adapter visitor;
- update in-memory/test visitors;
- add tests proving both `isSatisfiedBy` and adapter translation;
- avoid default visitor branches that silently ignore unknown specs.

## Anti-Patterns

- Fat god spec: one object with many optional fields, modes, and caller-specific behavior.
- Spec as DTO: `{ field, op, value }` with domain names painted on top.
- Infrastructure inside spec: database, cache, HTTP, filesystem, or provider calls.
- Aggregate invariant extracted into a spec with no reuse or translation need.
- Silent visitor drift: new spec type added but one adapter visitor is not updated.
- Repository owns business policy: repository decides whether the spec is valid instead of translating it.
