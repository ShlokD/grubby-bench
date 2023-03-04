const sorter = ({ records, options }) => {
  if (!(options && records) || records.length === 0) {
    return records;
  }
  const { key, ascending = true } = options;
  const containsKey = records.every((record) => record.hasOwnProperty(key));
  if (!containsKey) {
    throw new Error("All Records do not contain sorting key");
  }

  const sorted = records.slice().sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA < valB) {
      return ascending ? -1 : 1;
    }
    if (valB < valA) {
      return ascending ? 1 : -1;
    }
    return 0;
  });

  return sorted;
};

module.exports = { sorter };
