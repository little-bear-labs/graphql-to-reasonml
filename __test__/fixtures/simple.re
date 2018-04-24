[@bs.deriving jsConverter]
type userTypes = [
  | [@bs.as "SuperUser"] `SuperUser
  | [@bs.as "Administrator"] `Administrator
  | [@bs.as "Customer"] `Customer
];

/* Gender Constants */
[@bs.deriving jsConverter]
type gender = [
  | [@bs.as "Male"] `Male
  | [@bs.as "Female"] `Female
  | [@bs.as "NonBinary"] `NonBinary
];

type wrapper = {. "foo": Js.nullable(string)}
and genderInput = {
  .
  /* the check */
  "check": bool,
  "another": Js.nullable(string),
  "listOfStrings": list(string),
  "nullableListOfStrings": Js.nullable(list(string)),
  "wrapper": wrapper,
  "gender": Js.nullable(string),
}
and user('ctx) = {
  .
  "name": 'ctx => string,
  "email": 'ctx => string,
  "gender": 'ctx => Js.nullable(string),
  "listNullable": 'ctx => Js.nullable(list(string)),
  "list": 'ctx => list(string),
  "getGender":
    /* Do the check? */
    (~check: Js.nullable(genderInput), 'ctx) =>
    string,
  "self": (~check: bool, 'ctx) => User.t,
}
and query('ctx) = {. "user": 'ctx => Js.nullable(User.t)};
