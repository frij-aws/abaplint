import { Statement } from "./statement";
import Registry from "../registry";
import * as Combi from "../combi";
import Reuse from "./reuse";

let str = Combi.str;
let seq = Combi.seq;

export class Define extends Statement {

  public static get_matcher(): Combi.IRunnable {
    let ret = seq(str("DEFINE"), Reuse.field());
    return ret;
  }

  public constructor(tokens, root) {
    super(tokens, root);

    Registry.addMacro(tokens[1].getStr());
  }

  public isStructure() {
    return true;
  }

}