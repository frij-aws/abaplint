import {Arguments, run} from ".";
import * as minimist from "minimist";

const parsed = minimist(process.argv.slice(2), {string: "outFile"});
console.log(JSON.stringify(parsed));
const arg: Arguments = {
  outFile: parsed["outfile"],
  showHelp: parsed["h"] !== undefined || parsed["help"] !== undefined,
};

run(arg);

