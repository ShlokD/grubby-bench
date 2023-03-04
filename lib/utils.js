const getCSV = (output) => {
  if (!Array.isArray(output)) {
    return "";
  }
  if (!output.every((record) => typeof record === "object")) {
    return "";
  }
  const headers = Object.keys(output[0]);
  let csv = headers.join(",") + "\n";
  for (let i = 0; i < output.length; ++i) {
    csv += Object.values(output[i]).join(",") + "\n";
  }

  return csv;
};

module.exports = { getCSV };
