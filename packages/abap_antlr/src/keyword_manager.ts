import * as fs from "fs";
import {PREDEFINED_BOILERPLATE, PREDEFINED_SYMBOLS, StringMap} from "./constants";

/*
for anything that gets represented as pure text with no rules:
* abaplint will give us some text like "START-OF-SELECTION"
* we map that into an identifier like "K_START_OF_SELECTION"
*   always start with K_ to avoid identifiers starting with an underscore and avoid reserved words like SKIP
*   except for special cases DIGIT_0... and letters which are just A B C D...
* we map to a representation, which will be a sequence of identifiers such as START DASH OF DASH SELECTION
 */
// maps from text to a keyword
// in our map the key always starts with K_ to avoid keys
export class KeywordManager {
  private readonly representation: StringMap = {}; // maps from identifier to reresentation
  private readonly identifiers: StringMap = {}; // maps from text to identifier

  public constructor() {
    for (const predefinedCharacter in PREDEFINED_SYMBOLS) {
      const identifier = PREDEFINED_SYMBOLS[predefinedCharacter];
      this.representation[identifier] = `'${predefinedCharacter}'`;
      this.identifiers[predefinedCharacter] = identifier;
    }
    // add the alphabet, case insensitive
    for (const l of "abcdefghijklmnopqrstuvwxyz".split("")) {
      const L = l.toUpperCase();
      this.representation[L] = L; // special case for uppercase and lowercase will be handled later
      this.identifiers[L] = L;

      this.representation[`K_${L}`] = L;
    }
    // add digits 0-9
    for (let j = 0; j <= 9; j++) {
      const identifier = `N_${j}`;
      this.representation[identifier] = `'${j}'`;
      this.identifiers[`${j}`] = identifier;
    }
  }

  /*
  We treat text with spaces ("FOR HDB") as one keyword
  if the text is something like 0, %, && etc...we look up the existing identifier
  otherwise we synthesize a identifier by changing unsafe symbols to underscores
  Finally, if the keyword is unknown, we add it
   */
  public getOrAddIdentifier(text: string): string {
    if (this.identifiers[text] !== undefined) {
      // text is already known, with an identifier
      return this.identifiers[text];
    }
    const identifier = "K_" + text.toUpperCase().replace(/[^A-Z0-9]/g, "_");
    this.add(identifier, text);
    return identifier;
  }

  // multikeyword might have spaces, being separate words
  // multikeyword might have a dash, like START-OF-SELECTION
  public add(identifier: string, text: string): void {
    const tokens: string[] = [];
    // go through each character of the keyword...  C L A S S
    for (const L of text.toUpperCase().split("")) {
      const letterIdentifier = this.identifiers[L];
      tokens.push(letterIdentifier);
    }
    this.representation[identifier] = tokens.join(" ");
    this.identifiers[text] = identifier;
    console.log(`add: ${text}  => ${identifier} with representation ${this.representation[identifier]}`);
  }

  public getTokens(text: string): string | undefined {
    const identifier = this.getOrAddIdentifier(text);
    return this.representation[identifier];
  }

  private writePredefinedKeywords(stream: fs.WriteStream) {
    stream.write(PREDEFINED_BOILERPLATE);
  }

  public write(stream: fs.WriteStream): void {
    // write keywords
    stream.write(`// keywords\n`);
    for (const identifier of Object.keys(this.representation).sort()) {
      const T = this.representation[identifier];
      if (T === undefined) {
        throw new Error(`Undefined keyword: ${identifier}`);
      }
      const t = T.toLowerCase();
      // special case for letters
      if (identifier.length === 1 && identifier.match(/[A-Z]/)) {
        stream.write(`fragment ${identifier}:('${t}'|'${T}');\n`);
      } else {
        // it's not a symbol so write out the tokens
        stream.write(`${identifier}: ${T};\n`);
      }
    }
    this.writePredefinedKeywords(stream);
  }
}