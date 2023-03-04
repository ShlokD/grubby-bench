# Grubby Bench

CSV Sorter CLI Tool


Usage: node-cli-sorter <command> [options]

Commands:
  node-cli-sorter f  filename
  node-cli-sorter k  Key to sort by. Default: first header in csv list
  node-cli-sorter d  Sort descending. Default: false
  node-cli-sorter w  Write to output file. Default: false
  node-cli-sorter o  Output file name. Default: Input filename

Options:
      --version  Show version number                                   [boolean]
  -f, --file     Load a file                                          [required]
  -k, --key      Key to sort by. Default: first header in csv list
  -d             Sort descending. Default: false
  -o, --output   Output file name. Default: Input filename
  -h, --help     Show help                                             [boolean]

Examples:
  node-cli-sorter -f foo.csv  csv filename to sort by
  node-cli-sorter -k foo      key to sort by
  node-cli-sorter -d          Sort descending. Default: false
  node-cli-sorter -w          Write to output file. Default: false
  node-cli-sorter -o          Output file name. Default: Input filename