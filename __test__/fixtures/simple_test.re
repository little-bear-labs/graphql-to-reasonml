open Jest;

[@bs.module "./gen"] external getWrapper : unit => Simple.wrapper = "";

[@bs.module "./gen"] external getGenderInput : unit => Simple.genderInput = "";

type ctxType = {foo: string};

let myUser: Simple.user(ctxType) = {
  "name": (args, ctx) => "foo",
  "email": (args, ctx) => "foo",
  "gender": (args, ctx) => Js.Nullable.return("foo"),
  "listNullable": (args, ctx) => Js.Nullable.return([ctx.foo]),
  "list": (args, ctx) => ["foo"],
  /* Do the check? */
  "getGender": (args, ctx) => {
    let str = "true?: " ++ Js.String.make(args##check);
    Js.log("sup");
    "foo" ++ ctx.foo;
  },
  "self": (args, ctx) => User.Foo,
};

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