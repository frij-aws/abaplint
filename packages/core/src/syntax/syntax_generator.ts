import {ArtifactsABAP} from "../abap/artifacts";
import {ISyntaxFactory, ISyntaxVisitable} from ".";

interface Resource {
  key: string;
  name: string;
  type: string;
  using: string[];
  runnable: ISyntaxVisitable;
  complex: boolean;
  inScope: boolean;
}

interface Syntax {
  [key: string]: Resource;
}

export class SyntaxGenerator {
  private syntax: Syntax = {};
  private readonly factory: ISyntaxFactory;

  public constructor(factory: ISyntaxFactory) {
    this.factory = factory;
  }

  private addToScope(res: Resource) {
    if (res.inScope) {
      return; // already in scope
    }
    res.inScope = true;
    for (const childName of res.using) {
      const child = this.syntax[childName];
      if (child === undefined) {
        console.log(`ERROR ${childName} not found`);
      }
      else {
        this.addToScope(child);  // recursive
      }
    }
  }

  private addResource(name: string, type: string, runnable: ISyntaxVisitable, using: string[], complex: boolean) {
    const key = `${type}/${name}`;
    // console.log(`Adding resource ${key} to ${Object.keys(this.syntax)}`);
    this.syntax[key] = {
      key: key,
      name: name,
      type: type,
      runnable: runnable,
      using: using,
      complex: complex,
      inScope: false,
    };
  }
  private writeInScopeResource() {
    for (const res of Object.values(this.syntax)) {
      if (!res.inScope) {
        // continue;
      }
      const visitor = this.factory.newVisitor(res.name, res.type);
      visitor.startEntry();
      console.log(`Processing top level ${res.key}`);
      res.runnable.acceptSyntaxVisitor(visitor);
      visitor.endEntry();
    }
  }


  public run() {
    for (const expr of ArtifactsABAP.getExpressions()) {
      const instance = new expr();
      const runnable = new expr().getRunnable();
      //console.log(`Expression: ${expr} ${JSON.stringify(expr, null, 2)}\nrunnable: ${JSON.stringify(runnable)}`);
      console.log(`adding Expression: ${expr.constructor.name}`);
      this.addResource(instance.constructor.name, "expression", runnable, instance.getUsing(), true);
    }

    for (const stat of ArtifactsABAP.getStatements()) {
      const runnable = stat.getMatcher();
      console.log(`adding Statement: ${stat.constructor.name}`);
      this.addResource(stat.constructor.name, "statement", runnable, runnable.getUsing(), false);
    }

    for (const stru of ArtifactsABAP.getStructures()) {
      const runnable = stru.getMatcher();
      console.log(`adding Structure: ${stru.constructor.name}`);
      this.addResource(stru.constructor.name, "structure", runnable, runnable.getUsing(), true);
    }

    this.addToScope(this.syntax["statement/MethodImplementation"]);
    this.writeInScopeResource();
  }
}
