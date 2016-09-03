import File from "./file";
import { Statement } from "./statements/statement";
import {RootNode, StructureNode} from "./node";
import * as Statements from "./statements/";

export default class Nesting {

  public static run2(file: File): RootNode {
    let root = new RootNode(file.getFilename());

    let current = root;
    for (let statement of file.getStatements()) {

// check if bubbling is needed
      if (current instanceof StructureNode
          && !statement.isValidParent((current as StructureNode).getStart())) {
        current = current.getParent();
      }

      if (statement.isStructure()) {
        let struc = new StructureNode(statement);
        current.addChild(struc);
        current = struc;
      } else if (statement.isEnd() && current instanceof StructureNode) {
// input ABAP code might be malformed
        (current as StructureNode).setEnd(statement);
        current = current.getParent();
      } else {
        current.addChild(statement.getRoot());
      }
    }

    return root;
  }


// todo, below will be obsolete after run2() is implemented
  public static run(file: File): Array<Statement> {

// todo: save END statement references?
// todo: try-catch

    let result = [];
    let stack: Array<Statement> = [];

    for (let statement of file.getStatements()) {

      let top = stack[stack.length - 1];

// todo, refactor
      if (statement instanceof Statements.Endform
          || statement instanceof Statements.Endmethod
          || statement instanceof Statements.EndModule
          || statement instanceof Statements.Enddo
          || statement instanceof Statements.Endwhile
          || statement instanceof Statements.Enddefine
          || statement instanceof Statements.Endinterface
          || statement instanceof Statements.Endif
          || statement instanceof Statements.Endat
          || statement instanceof Statements.Endloop) {
        stack.pop();
        continue;
      } else if (statement instanceof Statements.Endcase) {
        if (top instanceof Statements.When) {
          stack.pop();
        }
        stack.pop();
        continue;
      } else if (statement instanceof Statements.Endclass) {
        if (top instanceof Statements.Private
            || top instanceof Statements.Protected
            || top instanceof Statements.Public) {
          stack.pop();
        }
        stack.pop();
        continue;
      } else if (statement instanceof Statements.Endtry) {
        if (top instanceof Statements.Catch) {
          stack.pop();
        }
        stack.pop();
        continue;
      } else if ((statement instanceof Statements.Else
          || statement instanceof Statements.Elseif)
          && (top instanceof Statements.If
          || top instanceof Statements.Elseif)) {
        stack.pop();
      } else if (top instanceof Statements.When
          && statement instanceof Statements.When) {
        stack.pop();
      } else if ((top instanceof Statements.Private
          || top instanceof Statements.Protected
          || top instanceof Statements.Public)
          && (statement instanceof Statements.Private
          || statement instanceof Statements.Protected
          || statement instanceof Statements.Public)) {
        stack.pop();
      } else if ((top instanceof Statements.AtSelectionScreen
          || top instanceof Statements.Initialization
          || top instanceof Statements.Start)
          && (statement instanceof Statements.AtSelectionScreen
          || statement instanceof Statements.Initialization
          || statement instanceof Statements.Class
          || statement instanceof Statements.Start
          || statement instanceof Statements.Module
          || statement instanceof Statements.Form)) {
        stack.pop();
      }

      top = stack[stack.length - 1];

      if (statement instanceof Statements.Catch
          && top instanceof Statements.Catch) {
        stack.pop();
        top = stack[stack.length - 1];
      }

      if (stack.length > 0) {
        top.addChild(statement);
        statement.setParent(top);
      } else {
        result.push(statement);
      }

      if (statement instanceof Statements.If
          || statement instanceof Statements.Form
          || statement instanceof Statements.Module
          || (statement instanceof Statements.Class
          && /DEFINITION DEFERRED/.test(statement.concatTokens().toUpperCase()) === false
          && /DEFINITION LOAD/.test(statement.concatTokens().toUpperCase()) === false
          && /DEFINITION LOCAL/.test(statement.concatTokens().toUpperCase()) === false)
          || statement instanceof Statements.Interface
          || statement instanceof Statements.Method
          || statement instanceof Statements.Case
          || statement instanceof Statements.Do
          || statement instanceof Statements.While
          || statement instanceof Statements.When
          || statement instanceof Statements.Else
          || statement instanceof Statements.Elseif
          || statement instanceof Statements.Private
          || statement instanceof Statements.Protected
          || statement instanceof Statements.Public
          || statement instanceof Statements.At
          || statement instanceof Statements.AtSelectionScreen
          || statement instanceof Statements.Initialization
          || statement instanceof Statements.Define
          || statement instanceof Statements.Loop
          || statement instanceof Statements.Start
          || statement instanceof Statements.Try
          || statement instanceof Statements.Catch
          ) {
        stack.push(statement);
      }
    }

    return result;
  }

}