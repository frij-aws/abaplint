import {SyntaxGenerator} from "./syntax_generator";

export interface ISyntaxVisitor {
  visitToken(text: string): void;

  visitSequence(...list: ISyntaxVisitable[]): void;

  visitSequence(list: ISyntaxVisitable[]): void;

  visitComment(text: string): void;

  visitOptional(visitable: ISyntaxVisitable): void;

  addComment(comment: string): void;

  visitZeroOrMore(visitable: ISyntaxVisitable): void;

  visitOneOrMore(visitable: ISyntaxVisitable): void;

  visitMultipleChoice(defaultChoice: number, list: ISyntaxVisitable[]): void;

  visitChoice(defaultChoice: number, list: ISyntaxVisitable[]): void;

  visitNonTerminalExpression(text: string): void;

  visitNonTerminalStructure(name: string): void;

  visitTerminalStatement(text: string): void;

  visitTerminalStructure(name: string): void;
}

export interface ISyntaxVisitable {
  acceptSyntaxVisitor(visitor: ISyntaxVisitor): void;
}


export interface ISyntaxFactory {
  newVisitor(): ISyntaxVisitor;
}

export {SyntaxGenerator};