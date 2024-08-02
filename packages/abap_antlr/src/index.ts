import {ISyntaxFactory, ISyntaxVisitable, ISyntaxVisitor, Registry, SyntaxGenerator} from "@abaplint/core";
import * as fs from "fs";
import {KeywordManager} from "./keyword_manager";
import {OPENING_BOILERPLATE, REGEXP_MAPPING} from "./constants";

export type Arguments = {
  outFile: string,
  showHelp?: boolean,
};

function displayHelp(): string {
  // follow https://docopt.org conventions,
  return "Usage:\n" +
    "  abapantlr --outFile <file>\n";
}

let braceCount = 0;

export class AntlrVisitor implements ISyntaxVisitor {
  private readonly factory: AntlrFactory;
  private static clauseCount = 0;
  protected result: string;
  private readonly name: string;
  private readonly type: string;
  private readonly TAB = "  ";
  private readonly LINE_MAXLEN = 80;

  public constructor(name: string, type: string, factory: AntlrFactory) {
    this.factory = factory;
    this.result = "";
    this.name = name;
    this.type = type;
  }

  private write(text: string): void {
    this.result += text;
  }

  private writeLine(text: string): void {
    // remove any newlines from the text, then add our own
    this.result += text.replace(/(\r\n|\n|\r)/gm, "");
    this.write("\n");
  }

  private writeStanza(text: string): void {
    this.writeLine("");
    const lines = text.split("\n");
    for (const line of lines) {
      this.writeLine(this.TAB + line);
    }
  }

  private writeStanzaMaybe(text: string): void {
    if (text.includes("\n")) {
      this.writeStanza(text);
    } else {
      this.write(text);
    }
  }

  private invokeChildVisitor(visitable: ISyntaxVisitable): void {
    const visitor = new AntlrVisitor(this.name, this.type, this.factory);
    visitable.acceptSyntaxVisitor(visitor);
    this.writeStanzaMaybe(visitor.result);
  }

  private processSequence(list: ISyntaxVisitable[], delimited: boolean): void {
    let length = 0;
    let delimiterCount = 0;
    for (const item of list) {
      const delimiter = (delimiterCount === 0 ? "" :
        (delimited ? " | " : " "));
      const visitor = new AntlrVisitor(this.name, this.type, this.factory);

      this.write(delimiter);
      delimiterCount++;
      item.acceptSyntaxVisitor(visitor);
      if (visitor.result.includes("\n")) {
        // if the result is multi-line, write it on its own line
        this.writeStanza(visitor.result);
        length = 0;
      } else {
        length += visitor.result.length + 1;
        if (length > this.LINE_MAXLEN) {
          // if adding this item makes the line too long, start a new line
          this.write("\n");
          length = 0;
        }
        this.write(visitor.result);
      }
    }
  }
  private getClauseCount(): number {
    return AntlrVisitor.clauseCount++;
  }
  public addComment(comment: string): void {
    this.write(`// ${comment}\n`);
  }

  /*
  Conditionals and optionals
   */
  public visitOptional(visitable: ISyntaxVisitable): void {
    this.write("(");
    this.invokeChildVisitor(visitable);
    this.writeLine(")?");
  }

  public visitZeroOrMore(visitable: ISyntaxVisitable): void {
    this.write("(");
    this.invokeChildVisitor(visitable);
    this.writeLine(")*");
  }

  public visitOneOrMore(visitable: ISyntaxVisitable): void {
    console.log(this.getClauseCount());
    this.write("(");
    this.invokeChildVisitor(visitable);
    this.writeLine(")+");
  }

  /*
  Sequences
  */


  public visitSequence(list: ISyntaxVisitable[]): void {
    this.processSequence(list, false);
  }

  // AKA permutation
  public visitMultipleChoice(defaultChoice: number, list: ISyntaxVisitable[]): void {
    // TODO figure out what to do with defaultChoice
    console.log(`multiplechoice(${defaultChoice})-... `);
    this.write("(");
    this.processSequence(list, true);
    /*
    let j = 0;
    for (const item of list) {
      this.visitOptional(item); // TODO known bug, this will be zero or more choices, but I think we must choose at least one
      j++;
    }
     */
    this.write(")+");
  }

  public visitChoice(defaultChoice: number, list: ISyntaxVisitable[]): void {
    const b = braceCount++;
    // TODO figure out what to do with defaultChoice
    console.log(`choice${b}(${defaultChoice})... `);
    this.write(`(`);
    this.processSequence(list, true);
    this.write(`)`);
  }

  /*
  Tokens
   */

  // token might have spaces like SET LOCKS OF
  private processToken(text: string): void {
    this.write(this.factory.keywordManager.getOrAddIdentifier(text));
  }

  public visitToken(text: string): void {
    // these tokens must be predefined in constants.ts
    console.log("visitToken(" + text + ")");
    this.processToken(text);
  }

  public visitTerminalStatement(text: string): void {
    console.log("visitTerminalStatement(" + text + ")");
    /*
    if ( text === "MacroCall" || text === "NativeSQL" || text === "MacroContent" ) {
      console.log(`Skipping incomplete statement ${text}`);  // these are wrong in abapgit
    }
    else {

     */
    this.write(`${this.getIdentifier(text, "statement").toLowerCase()}`);
    /*
    }
     */
  }

  public visitTerminalStructure(text: string): void {
    console.log("visitTerminalStructure(" + text + ")");
    this.write(`${this.getIdentifier(text, "structure").toLowerCase()}`);
  }


  public visitNonTerminalExpression(text: string): void {
    console.log("NonTerminalExpression(" + text + ")");
    this.write(`${this.getIdentifier(text, "expression").toLowerCase()}`);
  }

  public visitNonTerminalStructure(text: string): void {
    console.log("visitNonTerminalStructure(" + text + ")");
    this.write(`${this.getIdentifier(text, "structure").toLowerCase()}`);
  }


  public visitRegex(r: RegExp): void {
    const token = REGEXP_MAPPING.get(r);
    this.write(token);
  }

  public visitFailStar(visitable: ISyntaxVisitable): void {
    console.log(`visitFailStar(${JSON.stringify(visitable)})`);
    // TODO figure out what to do with this
  }

  public visitFailCombinator(visitable: ISyntaxVisitable): void {
    console.log(`visitFailCombinator(${JSON.stringify(visitable)})`);
    // TODO figure out what to do with this
  }

  public startEntry(): void {
    this.write(`${this.getIdentifier(this.name, this.type)} : `);
  }

  public endEntry(): void {
    if (this.type === "statement") {
      this.write(" PERIOD"); // end statements with a period
    }
    this.factory.stream.write(this.result.replace(/\n\s*\n/g, "\n") + ";\n\n");
  }

  private getIdentifier(name: string, type: string): string {
    if (type === "expression") {
      return name.toLowerCase();
    } else { // append the type to statements and structures
      return `${name}_${type}`.toLowerCase();
    }
  }
}


class AntlrFactory implements ISyntaxFactory {
  public readonly stream: fs.WriteStream;
  public readonly keywordManager: KeywordManager;

  public constructor(filename: string) {
    this.stream = fs.createWriteStream(filename, {
      flags: "w",
    });

    this.stream.write(OPENING_BOILERPLATE);
    this.keywordManager = new KeywordManager();
  }

  public newVisitor(name: string, type: string): ISyntaxVisitor {
    return new AntlrVisitor(name, type, this);
  }

  public close() {
    this.keywordManager.write(this.stream);
    this.stream.close();
  }
}

function out(arg: Arguments): string {
  const factory = new AntlrFactory(arg.outFile);
  const generator = new SyntaxGenerator(factory);
  generator.run();
  factory.close();
  return arg.outFile;
}

export async function run(arg: Arguments) {
  if (arg.showHelp === true) {
    process.stderr.write(displayHelp());
    return "";
  } else {
    process.stderr.write("abaplint " + Registry.abaplintVersion() + "\n");
    process.stderr.write(`Args: ${JSON.stringify(arg)}\n`);

    return out(arg);
  }
}