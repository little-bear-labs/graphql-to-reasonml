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
  "listOfStrings": array(string),
  "nullableListOfStrings": Js.nullable(array(string)),
  "wrapper": wrapper,
  "gender": Js.nullable(gender),
}
and user = {
  .
  "name": string,
  "email": string,
  "gender": Js.nullable(gender),
  "listNullable": Js.nullable(array(string)),
  "list": array(string),
  "getGender":
    /* Do the check? */
    (~check: Js.nullable(genderInput)=?, unit) =>
    gender,
  "self": (~check: bool, unit) => User.t,
}
and query = {. "user": Js.nullable(user)};
