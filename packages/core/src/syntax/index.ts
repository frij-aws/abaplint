import {SyntaxGenerator} from "./syntax_generator";

export interface ISyntaxVisitor {
  visitToken(text: string): void;

  visitSequence(list: ISyntaxVisitable[]): void;

  visitOptional(visitable: ISyntaxVisitable): void;

  addComment(comment: string): void;

  visitZeroOrMore(visitable: ISyntaxVisitable): void;

  visitOneOrMore(visitable: ISyntaxVisitable): void;

  visitMultipleChoice(defaultChoice: number, list: ISyntaxVisitable[]): void;

  visitChoice(defaultChoice: number, list: ISyntaxVisitable[]): void;

  visitNonTerminalExpression(text: string): void;

  visitNonTerminalStructure(text: string): void;

  visitTerminalStatement(text: string): void;

  visitTerminalStructure(text: string): void;

  visitRegex(r: RegExp): void;

  startEntry(): void;

  endEntry(): void;

  visitFailStar(visitable: ISyntaxVisitable): void;
}

export interface ISyntaxVisitable {
  acceptSyntaxVisitor(visitor: ISyntaxVisitor): void;
}


export interface ISyntaxFactory {
  newVisitor(name: string, type: String): ISyntaxVisitor;
}

export {SyntaxGenerator};