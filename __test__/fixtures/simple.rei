type userTypes = [ | `SuperUser | `Administrator | `Customer]
/* Gender Constants */
and gender = [ | `Male | `Female | `NonBinary]
and wrapper = {foo: option(string)}
and genderInput = {
  /* the check */
  check: bool,
  another: option(string),
  listOfStrings: array(string),
  nullableListOfStrings: option(array(string)),
  wrapper,
  gender: option(gender),
}
and user = {
  name: string,
  email: string,
  gender: option(gender),
  listNullable: option(array(string)),
  list: array(string),
  getGender:
    /* Do the check? */
    (~check: option(genderInput)=?, unit) =>
    gender,
  self: (~check: bool, unit) => User.t,
}
and query = {user: option(user)};
