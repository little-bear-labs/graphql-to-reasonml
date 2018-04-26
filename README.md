# GraphQL to ReasonML

The purpose of this project is to transform a graphql schema into a reason file with type interfaces that when implemented constitute a graphql server.

## Returning non primitive types

Built in types are automatically converted into reason types for example `Float` becomes `float`.

More complex types can be returned and enforced but some additional details need to be annotated via a special decorator.

```graphql
type Cake @bsType(type: "CakeModule.t") {
  name: String!
}

type Query {
  cake: Cake!
}
```

Compiling the above will result in something like the following.

```re
type cake('ctx) = {. "name": (CakeModule.t, __nameArgs, 'ctx) => string}
/* Arguments for name */
and __nameArgs = {.}
and query('root, 'ctx) = {
  .
  "cake": ('root, __cakeArgs, 'ctx) => CakeModule.t,
}
/* Arguments for cake */
and __cakeArgs = {.};
```

### Usage

As the repository handles more and more usecases additional documentation will be added. For now take a look at [the tests](./__test__/fixtures/executable_test.js)

## Limitations

* GraphQL types must start with uppercase letter.
