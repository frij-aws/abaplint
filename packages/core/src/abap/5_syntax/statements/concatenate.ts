import * as Expressions from "../../2_statements/expressions";
import {StatementNode} from "../../nodes";
import {CurrentScope} from "../_current_scope";
import {Source} from "../expressions/source";
import {Target} from "../expressions/target";
import {StringType, TableType, UnknownType, VoidType, XStringType} from "../../types/basic";
import {InlineData} from "../expressions/inline_data";
import {StatementSyntax} from "../_statement_syntax";
import {TypeUtils} from "../_type_utils";

export class Concatenate implements StatementSyntax {
  public runSyntax(node: StatementNode, scope: CurrentScope, filename: string): void {
    const byteMode = node.findDirectTokenByText("BYTE") !== undefined;
    const linesMode = node.findDirectTokenByText("LINES") !== undefined;

    const target = node.findFirstExpression(Expressions.Target);
    const inline = target?.findDirectExpression(Expressions.InlineData);
    if (inline) {
      if (byteMode) {
        new InlineData().runSyntax(inline, scope, filename, new XStringType());
      } else {
        new InlineData().runSyntax(inline, scope, filename, StringType.get());
      }
    } else if (target) {
      const type = new Target().runSyntax(target, scope, filename);
      const compatible = byteMode ? new TypeUtils(scope).isHexLike(type) : new TypeUtils(scope).isCharLikeStrict(type);
      if (compatible === false) {
        throw new Error("Target type not compatible");
      }
    }

    if (linesMode) {
      for (const s of node.findDirectExpressions(Expressions.Source)) {
        const type = new Source().runSyntax(s, scope, filename);
        if (!(type instanceof UnknownType) && !(type instanceof VoidType) && !(type instanceof TableType)) {
          throw new Error("Source must be an internal table");
        }
      }
    } else {
      for (const s of node.findDirectExpressions(Expressions.SimpleSource3)) {
        const type = new Source().runSyntax(s, scope, filename);
        const compatible = byteMode ? new TypeUtils(scope).isHexLike(type) : new TypeUtils(scope).isCharLikeStrict(type);
        if (compatible === false) {
          throw new Error("Source type not compatible");
        }
      }
    }

  }
}