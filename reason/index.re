type users = [ | `User | `SuperUser | `Administrator]
and variants = [ | `Male | `Female | `NonBinary]
and foo = {bar: string}
and bar = {foo: string};

module User = {
  type t = {email: string};
};

type user('root, 'ctx) = {
  .
  getGender: ('root, ~name: string, 'ctx) => variants,
};

type query('root, 'ctx) = {. user: ('root, 'ctx) => User.t};

let obj:
  user(
    int,
    {
      .
      foo: string,
      bar: int,
    },
  ) = {
  pub getGender = (root, ~name, ctx) => {
    Js.log(ctx#foo);
    Js.log(name);
    `Male;
  }
};

type ctx = {config: string};

let make = () => {};