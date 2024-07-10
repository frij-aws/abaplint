import {Result} from "./result";
import {ISyntaxVisitable} from "../../syntax";

export interface IStatementRunnable extends ISyntaxVisitable {
  run(r: Result[]): Result[];

  railroad(): string;

  toStr(): string;

  getUsing(): string[];

  listKeywords(): string[];

// return first keyword, blank if not applicable
  first(): string[];
}