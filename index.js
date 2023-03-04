#!/usr/bin/env node

const { sorter } = require("./lib");
const { getCSV } = require("./lib/utils");
const csv = require("csvtojson");
const fs = require("fs/promises");
const chalk = require("chalk");

const argv = require("yargs/yargs")(process.argv.slice(2))
  .scriptName("grubby-bench")
  .usage("Usage: grubby-bench <command> [options]")
  .command("f", "filename")
  .example("grubby-bench -f foo.csv", "csv filename to sort by")
  .alias("f", "file")
  .nargs("f", 1)
  .describe("f", "Load a file")
  .command("k", "Key to sort by. Default: first header in csv list")
  .example("grubby-bench -k foo", "key to sort by")
  .alias("k", "key")
  .nargs("k", 1)
  .describe("k", "Key to sort by. Default: first header in csv list")
  .command("d", "Sort descending. Default: false")
  .example("grubby-bench -d", "Sort descending. Default: false")
  .nargs("d", 0)
  .describe("d", "Sort descending. Default: false")
  .command("w", "Write to output file. Default: false")
  .example("grubby-bench -w", "Write to output file. Default: false")
  .alias("w", "write")
  .nargs("w", 0)
  .describe("o", "Output file name. Default: Input filename")
  .command("o", "Output file name. Default: Input filename")
  .example("grubby-bench -o", "Output file name. Default: Input filename")
  .alias("o", "output")
  .nargs("o", 1)
  .describe("o", "Output file name. Default: Input filename")
  .demandOption(["f"])
  .help("h")
  .alias("h", "help").argv;

const getFlags = () => {
  const filename = argv.f;
  const key = argv.k;
  const descending = argv.d;

  if (!filename) {
    throw new Error("Error! Filename is required");
  }
  const write = argv.w;
  const outputFilename = argv.o;
  const preview = !write && !outputFilename;
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
      overwrite: !outputFilename,
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
    console.log(chalk.green(`Results written to ${outputFilename}`));
  }
};

const start = async () => {
  const { inputOpts, outputOpts } = getFlags();
  const { records, options } = await prepareInput(inputOpts);
  const sortedData = sorter({ records, options });
  await prepareOutput({ output: sortedData, options: outputOpts });
};

start();
