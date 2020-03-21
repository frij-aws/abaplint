import {str, Expression} from "../combi";
import {IStatementRunnable} from "../statement_runnable";

export class Language extends Expression {
  public getRunnable(): IStatementRunnable {
    return str("LANGUAGE SQLSCRIPT");
  }
}