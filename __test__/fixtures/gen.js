function getWrapper() {
  return {
    foo: "sup",
  };
}

function getGenderInput() {
  return {
    check: true,
    another: null,
    listOfStrings: [],
    nullableListOfStrings: null,
    wrapper: {
      foo: "yup"
    },
    gender: "Male"
  }
}

module.exports = {
  getWrapper,
  getGenderInput,
};