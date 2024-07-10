import {Registry, SyntaxGenerator, ISyntaxFactory} from "@abaplint/core";
import * as fs from "fs";

export type Arguments = {
  outFile: string,
  showHelp?: boolean,
};

function displayHelp(): string {
  // follow https://docopt.org conventions,
  return "Usage:\n" +
    "  abapantlr --outFile <file>\n";
}

class AntlrFactory implements ISyntaxFactory {
  private readonly stream: fs.WriteStream;

  public constructor(stream: fs.WriteStream) {
    this.stream = stream;
  }
  public newVisitor(): ISyntaxVisitor {
    return new AntlrVisitor(this.stream);
  }
}

function out(arg: Arguments): string {
  const outFile = fs.createWriteStream(arg.outFile, {
    flags: "w",
  });

  const generator = new SyntaxGenerator(new AntlrFactory(outFile));
  generator.run();
  outFile.close();
  return arg.outFile;
}

export async function run(arg: Arguments) {
  if (arg.showHelp === true) {
    process.stderr.write(displayHelp());
    return "";
  } else {
    process.stderr.write("abaplint " + Registry.abaplintVersion() + "\n");

    return out(arg);
  }
}