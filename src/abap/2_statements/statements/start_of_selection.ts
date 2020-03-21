import {IStatement} from "./_statement";
import {verNot, str} from "../combi";
import {Version} from "../../../version";
import {IStatementRunnable} from "../statement_runnable";

export class StartOfSelection implements IStatement {

  public getMatcher(): IStatementRunnable {
    return verNot(Version.Cloud, str("START-OF-SELECTION"));
  }

}