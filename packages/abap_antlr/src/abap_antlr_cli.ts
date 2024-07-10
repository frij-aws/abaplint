import {Arguments, run} from ".";
import * as minimist from "minimist";

const parsed = minimist(process.argv.slice(2), {string: "outfile"});

const arg: Arguments = {
  outFile: parsed["outfile"],
  showHelp: parsed["h"] !== undefined || parsed["help"] !== undefined,
};

run(arg);

