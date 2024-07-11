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
  private syntax: Syntax = {
    baz: {
      key: "baz",
      name: "baz",
      type: "type",
      runnable: undefined,
      using: ["a", "b"],
      complex: false,
      inScope: false,
    },
    foo: {
      key: "foo",
      name: "foo",
      type: "type",
      runnable: undefined,
      using: [],
      complex: false,
      inScope: false,
    },
  };
  private readonly factory: ISyntaxFactory;

  public constructor(factory: ISyntaxFactory) {
    this.factory = factory;
  }

  private addToScope(res: Resource) {
    console.log("addToScope");
    console.log(JSON.stringify(res, null, 2));
    if (res.inScope) {
      return; // already in scope
    }
    res.inScope = true;
    console.log(`using: ${res.using}`);
    for (const childName of res.using) {
      console.log(`recursive addToScope on: ${childName}`);
      const child = this.syntax[childName];
      if (child === undefined) {
        console.log(`${childName} not found in ${this.syntax}`, null, 2);
      }
      this.addToScope(child);  // recursive
    }
  }

  private addResource(name: string, type: string, runnable: ISyntaxVisitable, using: string[], complex: boolean) {
    const key = `${type}/${name}`;
    console.log(`Adding resource ${key} to ${this.syntax}`);
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


  public run() {
    for (const expr of ArtifactsABAP.getExpressions()) {
      const runnable = new expr().getRunnable();
      this.addResource(expr.constructor.name, "expression", runnable, runnable.getUsing(), true);
    }

    for (const stat of ArtifactsABAP.getStatements()) {
      const runnable = stat.getMatcher();
      this.addResource(stat.constructor.name, "statement", runnable, runnable.getUsing(), false);
    }

    for (const stru of ArtifactsABAP.getStructures()) {
      const runnable = stru.getMatcher();
      this.addResource(stru.constructor.name, "structure", runnable, runnable.getUsing(), true);
    }

    this.addToScope(this.syntax["statement/ClassDefinition"]);
    for (const res of Object.values(this.syntax)) {
      if (!res.inScope) {
        continue;
      }
      const visitor = this.factory.newVisitor();
      res.runnable.acceptSyntaxVisitor(visitor);
    }
  }
}
