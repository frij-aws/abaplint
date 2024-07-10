import * as fs from "fs";
import {ISyntaxVisitable, ISyntaxVisitor} from "@abaplint/core";


export class AntlrVisitor implements ISyntaxVisitor {
  private readonly stream: fs.WriteStream;

  public constructor(stream: fs.WriteStream) {
    this.stream = stream;
  }

  public visitSequence(runnables: ISyntaxVisitable[]): void {
    throw new Error("Method not implemented.");
  }

  public visitComment(text: string): void {
    this.stream.write(`//${text}\n`);
  }

  public visitOptional(runnable: ISyntaxVisitable): void {
    this.stream.write("(");
    runnable.acceptSyntaxVisitor(this);
    this.stream.write(")?\n");
  }

  public addComment(comment: string): void {
    throw new Error("Method not implemented.");
  }

  public visitZeroOrMore(sta: ISyntaxVisitable): void {
    throw new Error("Method not implemented.");
  }
}
