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
and user = {
  .
  "name": unit => string,
  "email": unit => string,
  "gender": unit => Js.nullable(string),
  "listNullable": unit => Js.nullable(list(string)),
  "list": unit => list(string),
  "getGender":
    /* Do the check? */
    (~check: Js.nullable(genderInput)) =>
    string,
  "self": (~check: bool) => User.t,
}
and query = {. "user": unit => Js.nullable(user)};
