const { sorter } = require("../lib");
const teamX = {
  team: "X",
  points: 12,
  win: 2,
  loss: 1,
  draw: 0,
};

const teamA = {
  team: "A",
  points: 9,
  win: 1,
  loss: 1,
  draw: 1,
};

const teamP = {
  team: "P",
  points: 9,
  win: 0,
  loss: 0,
  draw: 3,
};
const records = [teamX, teamA, teamP];

describe("Sorting module", () => {
  it("should return passed records when no options are passed", () => {
    expect(sorter({ records })).toBe(records);
  });

  it("should throw an error if all records do not have sorting key", () => {
    const options = { key: "foo" };
    expect(() => sorter({ records, options })).toThrow();
  });

  it("should return empty array if records are empty", () => {
    const options = { key: "team" };
    expect(sorter({ records: [], options })).toEqual([]);
  });

  it("should sort ascending by string", () => {
    const options = { key: "team" };
    expect(sorter({ records, options })).toEqual([teamA, teamP, teamX]);
  });

  it("should sort ascending by numerical", () => {
    const options = { key: "draw" };
    expect(sorter({ records, options })).toEqual([teamX, teamA, teamP]);
  });

  it("should sort descending", () => {
    const options = { key: "team", ascending: false };
    expect(sorter({ records, options })).toEqual([teamX, teamP, teamA]);
  });

  it("should sort descending by numerical", () => {
    const options = { key: "draw", ascending: false };
    expect(sorter({ records, options })).toEqual([teamP, teamA, teamX]);
  });
});
