type query('root, 'ctx) = {
  .
  "hello": ('root, __helloArgs, 'ctx) => Js.nullable(string),
  "test": ('root, __testArgs, 'ctx) => Js.nullable(string),
}
/* Arguments for hello */
and __helloArgs = {.}
/* Arguments for test */
and __testArgs = {.};
