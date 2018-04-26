type query('root, 'ctx) = {
  .
  "foo": ('root, __fooArgs, 'ctx) => Js.nullable(string),
}
/* Arguments for foo */
and __fooArgs = {.};