import {Issue} from "../issue";
import {BasicRuleConfig} from "./_basic_rule_config";
import {Registry} from "../registry";
import {IRule} from "./_irule";
import {IObject} from "../objects/_iobject";
import {Class} from "../objects";
import {Visibility} from "../abap/types";
import {Scope} from "../abap/syntax/_scope";

// todo, add unit tests for this class

/** Checks that classes don't contain any public attributes */
export class NoPublicAttributesConf extends BasicRuleConfig {
  // todo,  public allowReadOnly: boolean = false;
}

export class NoPublicAttributes implements IRule {
  private conf = new NoPublicAttributesConf();

  public getKey(): string {
    return "no_public_attributes";
  }

  private getDescription(name: string): string {
    return "Public attributes are not allowed, attribute \"" + name + "\"";
  }

  public getConfig() {
    return this.conf;
  }

  public setConfig(conf: NoPublicAttributesConf) {
    this.conf = conf;
  }

  public run(obj: IObject, reg: Registry): Issue[] {
    const issues: Issue[] = [];

// todo: also implement for interfaces and local classes
    if (!(obj instanceof Class)) {
      return [];
    }

    const def = obj.getClassDefinition();
    if (def === undefined || def.isException()) {
      return [];
    }

    const attrs = def.getAttributes(Scope.buildDefault(reg));

    if (attrs === undefined) {
      return [];
    }

    for (const attr of attrs.getInstance().concat(attrs.getStatic())) {
      if (attr.getVisibility() === Visibility.Public) {
        const message = this.getDescription(attr.getName());
        const issue = Issue.atIdentifier(attr, message, this.getKey());
        issues.push(issue);
      }
    }

    return issues;
  }
}