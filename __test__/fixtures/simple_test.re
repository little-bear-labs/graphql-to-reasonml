open Jest;

[@bs.module "./gen"] external getWrapper : unit => Simple.wrapper = "";
[@bs.module "./gen"] external getGenderInput: unit => Simple.genderInput = "";

let myUser: Simple.user = {
  "name": () => "foo",
  "email": () => "foo",
  "gender": () => Js.Nullable.return("foo"),
  "listNullable": () => Js.Nullable.return(["foo"]),
  "list": () => ["foo"],
  /* "getGender": (~check: Js.nullable(Simple.genderInput) = ?) => "foo", */
  "getGender":
    /* Do the check? */
    (~check) => "foo",
  "self": (~check) => User.Foo,
};

describe("construct types", () => {
  open Expect;
    describe("Wrapper", () =>
      test("object construction", () => {
        let wrapper = getWrapper();
        expect(Js.Nullable.toOption(wrapper##foo)) |> toEqual(Some("sup"));
      })
    );

    describe("GenderInput", () => {
      test("object construction", () => {
        open Js.Nullable;
        open Simple;
        let genderInput = getGenderInput();
        let gender = switch(toOption(genderInput##gender)) {
        | Some(gender) => Simple.genderFromJs(gender)
        | None => None
        };
        expect(genderInput##check) |> toBe(true);
        expect(toOption(genderInput##wrapper##foo)) |> toEqual(Some("yup"));
        expect(gender) |> toEqual(Some(`Male))
      });
    });

    test("implement types", () => {
      expect(1) |> toBe(1);
    });
  });