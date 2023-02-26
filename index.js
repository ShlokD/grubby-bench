const { sorter } = require("./lib");
const csv = require("csvtojson");
const fs = require("fs/promises");
const chalk = require("chalk");

const isFlagPresent = (flagString) => {
  return process.argv.indexOf(flagString) !== -1;
};

const getFlagValue = (flagString, defaultValue) => {
  const index = process.argv.indexOf(flagString);
  if (index !== -1) {
    const value = process.argv[index + 1];
    return value;
  }
  return defaultValue;
};

const getFlags = () => {
  const filename = getFlagValue("--fie", "") || getFlagValue("--f", "");
  const key = getFlagValue("--key") || getFlagValue("--k");
  const descending = getFlagValue("--d", false);

  if (!filename) {
    throw new Error("Error! Filename is required");
  }
  const write = isFlagPresent("--write");
  const outputFilename =
    getFlagValue("--output") || getFlagValue("--o", filename);
  const preview = !write;
  const ascending = !descending;

  return {
    inputOpts: {
      filename,
      key: key?.toLowerCase(),
      ascending,
    },
    outputOpts: {
      preview,
      outputFilename,
      overwrite: !isFlagPresent("--output"),
    },
  };
};

const prepareInput = async (inputOpts) => {
  const { filename, key, ascending } = inputOpts;
  const records = await csv()
    .fromFile(filename)
    .preFileLine((line, idx) => (idx === 0 ? line.toLowerCase() : line));
  const keys = Object.keys(records[0]);

  return {
    records,
    options: {
      key: key || keys[0],
      ascending,
    },
  };
};

const getCSV = (output) => {
  const headers = Object.keys(output[0]);
  let csv = headers.join(",") + "\n";
  for (let i = 0; i < output.length; ++i) {
    csv += Object.values(output[i]).join(",") + "\n";
  }

  return csv;
};

const prepareOutput = async ({ output, options }) => {
  const { preview, outputFilename } = options;
  if (options.preview) {
    console.log(chalk.yellow("Showing preview only. No output written"));
    console.table(output.slice(0, output.length < 5 ? output.length : 5));
  } else {
    if (options.overwrite) {
      console.log(chalk.yellow("Overwriting existing file"));
    }
    const outputCSV = getCSV(output);
    await fs.writeFile(outputFilename, outputCSV);
  }
};

const start = async () => {
  const { inputOpts, outputOpts } = getFlags();
  const { records, options } = await prepareInput(inputOpts);
  const sortedData = sorter({ records, options });
  await prepareOutput({ output: sortedData, options: outputOpts });
};

start();
