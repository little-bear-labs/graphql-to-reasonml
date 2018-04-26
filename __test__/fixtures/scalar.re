type query('root, 'ctx) = {
  .
  "json": ('root, __jsonArgs, 'ctx) => Js.Json.t,
  "dateTime": ('root, __dateTimeArgs, 'ctx) => float,
}
/* Arguments for json */
and __jsonArgs = {.}
/* Arguments for dateTime */
and __dateTimeArgs = {.};