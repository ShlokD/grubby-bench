const { getCSV } = require("../lib/utils");

describe("getCSV", () => {
  it("converts json to csv", () => {
    const data = [
      { foo: "1", bar: "2" },
      { foo: "x", bar: "z" },
    ];
    expect(getCSV(data)).toEqual("foo,bar\n1,2\nx,z\n");
  });

  it("returns empty string if input is not an array", () => {
    expect(getCSV({})).toEqual("");
  });

  it("returns empty string if input is not a json array", () => {
    expect(getCSV([1, 2, 3])).toEqual("");
  });
});
