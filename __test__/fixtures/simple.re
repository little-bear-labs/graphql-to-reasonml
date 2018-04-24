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
  "name": (__nameArgs, 'ctx) => string,
  "email": (__emailArgs, 'ctx) => string,
  "gender": (__genderArgs, 'ctx) => Js.nullable(string),
  "listNullable": (__listNullableArgs, 'ctx) => Js.nullable(list(string)),
  "list": (__listArgs, 'ctx) => list(string),
  "getGender": (__getGenderArgs, 'ctx) => string,
  "self": (__selfArgs, 'ctx) => User.t,
}
/* Arguments for name */
and __nameArgs = {.}
/* Arguments for email */
and __emailArgs = {.}
/* Arguments for gender */
and __genderArgs = {.}
/* Arguments for listNullable */
and __listNullableArgs = {.}
/* Arguments for list */
and __listArgs = {.}
/* Arguments for getGender */
and __getGenderArgs = {
  . /* Do the check? */
  "check": Js.nullable(genderInput),
}
/* Arguments for self */
and __selfArgs = {. "check": bool}
and query('ctx) = {. "user": (__userArgs, 'ctx) => Js.nullable(User.t)}
/* Arguments for user */
and __userArgs = {.};
