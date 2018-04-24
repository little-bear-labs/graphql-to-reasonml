open Jest;

[@bs.module "./gen"] external getWrapper : unit => Simple.wrapper = "";

[@bs.module "./gen"] external getGenderInput : unit => Simple.genderInput = "";

type ctxType = {foo: string};

let user: Simple.user(ctxType) = {
  "name": (user, args, ctx) => "foo",
  "email": (user, args, ctx) => "foo",
  "gender": (user, args, ctx) => Js.Nullable.return("foo"),
  "listNullable": (user, args, ctx) => Js.Nullable.return([ctx.foo]),
  "list": (user, args, ctx) => ["foo"],
  /* Do the check? */
  "getGender": (user, args, ctx) => {
    let str = "true?: " ++ Js.String.make(args##check);
    Js.log("sup");
    "foo" ++ ctx.foo;
  },
  "self": (user, args, ctx) => User.Foo,
};

type none;

let query: Simple.query(none, ctxType) = {
  "user": (_, args, ctx) => Js.Nullable.return(User.Foo),
};

let resolvers = {"User": user, "Query": query};

describe("construct types", () => {
  open Expect;
  describe("Wrapper", () =>
    test("object construction", () => {
      let wrapper = getWrapper();
      expect(Js.Nullable.toOption(wrapper##foo)) |> toEqual(Some("sup"));
    })
  );
  describe("GenderInput", () =>
    test("object construction", () => {
      open Js.Nullable;
      open Simple;
      let genderInput = getGenderInput();
      let gender =
        switch (toOption(genderInput##gender)) {
        | Some(gender) => Simple.genderFromJs(gender)
        | None => None
        };
      expect(genderInput##check) |> toBe(true);
      expect(toOption(genderInput##wrapper##foo)) |> toEqual(Some("yup"));
      expect(gender) |> toEqual(Some(`Male));
    })
  );
});