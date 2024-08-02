export const OPENING_BOILERPLATE = `
grammar ABAP2;

/* DEFINITION SECTION */

`;
export const PREDEFINED_BOILERPLATE = `
// Predefined Keywords
/* KEYWORDS */

// Tokens
LETTERS: LETTER+;
LETTER: [a-zA-Z];
DIGITS: [0-9]+;
INTEGER : (PLUS | DASH)? DIGITS;
SIMPLENAME : (LETTERS | [_0-9])+;

NAME_REGEX : ('/'(LETTERS | '_' | INTEGER)+'/')?(LETTERS | '_' | INTEGER)+;
CLASSNAME_REGEX: NAME_REGEX;
METHODNAME_REGEX: NAME_REGEX;
COMPONENTNAME_REGEX: NAME_REGEX;
BEHAVIORNAME_REGEX: NAME_REGEX;
ATTRIBUTENAME_REGEX: NAME_REGEX;
DBCONAME_REGEX: NAME_REGEX;
TABNAME_REGEX: NAME_REGEX;
ENTASSOCNAME_REGEX: NAME_REGEX;
EVENTNAME_REGEX: NAME_REGEX;
DASHFIELDSUB_REGEX: NAME_REGEX;
FIELDSUB_REGEX: NAME_REGEX;
DASHFIELDSYMBOL_REGEX: NAME_REGEX;
DEFINITIONNAME_REGEX: NAME_REGEX;
ALTFIELDSYMBOL_REGEX: NAME_REGEX;
FORMNAME_REGEX: NAME_REGEX;
INCLUDENAME_REGEX: NAME_REGEX;
MACRONAME_REGEX: NAME_REGEX;
MESSAGENUMBER_REGEX: NAME_REGEX;
PREFPARAM_REGEX: NAME_REGEX;
METHODPARAMNAME_REGEX: NAME_REGEX;
OLEEXPORTING_REGEX: NAME_REGEX;
BLOCKNAME_REGEX: NAME_REGEX;
TYPENAME_REGEX: NAME_REGEX;
WRITEOFFSETLENGTH_REGEX: NAME_REGEX;
WRITEOFFSETLENGTH2_REGEX: NAME_REGEX;
WRITEOFFSETLENGTH3_REGEX: NAME_REGEX;
SYSTEMCALL_REGEX: NAME_REGEX;
CLUSTER_REGEX: NAME_REGEX;
TABLEFUNCTION_REGEX: NAME_REGEX;
ASSOCIATIONNAME_REGEX: NAME_REGEX;
SQL_FIELD_NAME_REGEX: NAME_REGEX;
FIELDSYMBOL_REGEX : LEFTARROW NAME_REGEX RIGHTARROW
            | LEFTARROW NAME_REGEX DASH NAME_REGEX RIGHTARROW
            ;

Z1: NAME_REGEX;
Z2: NAME_REGEX;
Z3: NAME_REGEX;
Z4: NAME_REGEX;
Z5: NAME_REGEX;
Z6: NAME_REGEX;
Z7: NAME_REGEX;
Z8: NAME_REGEX;
Z9: NAME_REGEX;
Z10: NAME_REGEX;
Z11: NAME_REGEX;
Z12: NAME_REGEX;
Z13: NAME_REGEX;
Z14: NAME_REGEX;
Z15: NAME_REGEX;
Z16: NAME_REGEX;
Z17: NAME_REGEX;
Z18: NAME_REGEX;
Z19: NAME_REGEX;
Z20: NAME_REGEX;
Z21: NAME_REGEX;
Z22: NAME_REGEX;
Z23: NAME_REGEX;
Z24: NAME_REGEX;
Z25: NAME_REGEX;

K_A: A;

// Ignored
COMMENT_REGEX : ([\\n] '*' ~[\\r\\n]*| '"' ~[\\r\\n]*) -> skip;
WS : [ \\t\\n]+ -> skip;
PRAGMA : '##' ~[.\\r\\n]* -> skip;

// these defs added for backwards compatibility with the hand-crafted g4
defsection : classdefinition_structure
           | interface_structure
           ;
classfile: defsection classimplementation_structure?
           ;
 
 // these defs hide deficiencies in the abaplint grammar
macrocall_statement: MACROCALL_DUMMY;
nativesql_statement: NATIVESQL_DUMMY;
macrocontent_statement: MACRODEF_DUMMY;
MACROCALL_DUMMY: 'NEVEREVERHAPPENING1';
NATIVESQL_DUMMY: 'NEVEREVERHAPPENING2';
MACRODEF_DUMMY: 'NEVEREVERHAPPENING3';          
`;

/*
old stuff

CLASSMETHODS: CLASS DASH METHODS;
EXCLAIMNAME: EXCLAIM NAME;
STATICMETHODREF: EQ RIGHTARROW;
INSTANCEMETHODREF: DASH RIGHTARROW;
INSTANCEARROW: INSTANCEMETHODREF;
STATICARROW: STATICMETHODREF;
READONLY: READ DASH ONLY;
STRINGDELIM: '\'' | '|';
QUESTIONEQ: QUES EQ;
DEREFERENCE: INSTANCEMETHODREF ASTERISK;
PARAMETERTABLE: PARAMETER DASH TABLE;
EXCEPTIONTABLE: EXCEPTION DASH TABLE;
CALLMETHOD: CALL WS METHOD;
CALLTRANSFORMATION: CALL WS TRANSFORMATION;
NONDASHUNIQUE: NON DASH UNIQUE;


FIELDNAME: (AMPER | '_' | EXCLAIM)? NAME ((DASH) NAME)*;
METHODLEFTPAREN: '(' WS;
METHODRIGHTPAREN: WS ')';
METHODEMPTYPAREN: '( )';
TABLEBRACKETLEFT: LEFTBRACKET WS;
TABLEBRACKETRIGHT: WS RIGHTBRACKET;
LEFTRIGHTARROWS: LEFTARROW RIGHTARROW;
RIGHTLEFTARROWS: RIGHTARROW LEFTARROW;
LEFTARROWEQ: LEFTARROW EQ;
RIGHTARROWEQ: RIGHTARROW EQ;
EQLEFTARROW: EQ LEFTARROW;
BITXOR: 'BIT-XOR';
BITAND: 'BIT-AND';
BITOR: 'BIT-OR';
DIV: 'DIV';
MOD: 'MOD';
CONCATENATEDCONSTANT: CONSTANTSTRING (WS)? (AMPER | DOUBLEAMPER) (WS)? CONSTANTSTRING;
CONSTANTSTRING: STRINGDELIM (~['\n\r] | '\'\'' | '"')* STRINGDELIM;

 */
export interface StringMap {
  [key: string]: string;
}


export const PREDEFINED_SYMBOLS: StringMap = {
  "!": "EXCLAIM",
  "&": "AMPER",
  "%":  "PERCENT",
  "&&": "DOUBLEAMPER",
  "&&=": "ANDANDEQ",
  "*": "ASTERISK",
  "**": "DOUBLEASTERISK",
  "+": "PLUS",
  "-": "DASH",
  ".": "PERIOD",
  "/": "DIVIDE",
  ":": "COLON",
  ";": "SEMICOLON",
  "<": "LEFTARROW",
  ">": "RIGHTARROW",
  "<<": "LEFTLEFTARROW",
  ">>": "RIGHTRIGHTARROW",
  "<>": "LEFTRIGHTARROWS",
  "><": "RIGHTLEFTARROWS",
  "?": "QUES",
  "#": "HASHTAG",
  "~": "TILDE",
  "(": "LEFTPAREN",
  ")": "RIGHTPAREN",
  "[": "LEFTBRACKET",
  "]": "RIGHTBRACKET",
  "{": "LEFTBRACE",
  "}": "RIGHTBRACE",
  "\\'": "SINGLEQUOTE",
  '"': "DOUBLEQUOTE",
  "`": "BACKQUOTE",
  " ": "SPACE",
  "\\t": "TAB",
  "\\n": "NEWLINE",
  "\\r": "CARRIAGERETURN",
  "\\\\": "BACKSLASH",
  "_": "UNDERSCORE",
  "$": "DOLLAR",
  ",": "COMMA",
  "=": "EQ",
  "|": "PIPE",
};

// TODO figure out how to translate javascript regex into ANTLR regex
export class RegExpMapping {
  private regexMap: StringMap = {};

  public constructor() {
    this.put(/^((\w*\/\w+\/)|(\w*\/\w+\/)?[\w\*$%]+)$/, "BEHAVIORNAME_REGEX");
    this.put(/^\w*(\/\w{3,}\/)?\w+$/, "CLASSNAME_REGEX"); // ClassName
    this.put(/^\\_[\w]+$/, "ASSOCIATIONNAME_REGEX");  // AssociationName
    this.put(/^(\/\w+\/)?[\w\d_\*\~%]+$/, "ATTRIBUTENAME_REGEX"); // AttributeName
    this.put(/^(\/\w+\/)?[\w\d_%$\*\~]+$/, "METHODNAME_REGEX"); // ComponentName
    this.put(/[\w\/]+/, "DBCONAME_REGEX"); // Database Connection
    this.put(/^\*?(\/\w+\/)?\w+$/, "TABNAME_REGEX"); // DB table name
    this.put(/^[\w]+\\_[\w]+$/, "ENTASSOCNAME_REGEX"); // Entity Association
    this.put(/^[&_!]?\*?\w*(\/\w+\/)?\d*[a-zA-Z_%\$][\w\*%\$\?#]*(~\w+)?$/, "EVENTNAME_REGEX"); // Event Name
    this.put(/^\d+$/, "DIGITS");
    this.put(/^[\w%$\$\*]+$/, "DASHFIELDSUB_REGEX"); // FieldSub
    this.put(/^\*?!?(\/\w+\/)?[a-zA-Z_%$][\w%$\$\*]*$/, "FIELDSUB_REGEX");
    this.put(/^<[\w\/%$\*]+>$/, "FIELDSYMBOL_REGEX");
    this.put(/^<[\w\/%$\*]+$/, "ALTFIELDSYMBOL_REGEX");
    this.put(/^[\w\/%$\*]+>$/, "DASHFIELDSYMBOL_REGEX"); // after the dash
    this.put(/^[\w%$\*\/\?]+$/, "FORMNAME_REGEX");
    this.put(/^\w+$/, "SIMPLENAME");
    this.put(/^<?(\/\w+\/)?[\w%]+(~\w+)?>?$/, "INCLUDENAME_REGEX");
    this.put(/^(\/\w+\/)?[\w\*%\?$&]+>?$/, "MACRONAME_REGEX");
    this.put(/^\d\d\d$/i, "MESSAGENUMBER_REGEX");
    this.put(/^!?(\/\w+\/)?\w+$/, "PREFPARAM_REGEX");

    this.put(/^(\/\w+\/)?\w+(~\w+)?$/, "METHODNAME_REGEX");
    this.put(/^!?\w*(\/\w+\/)?\w+$/, "METHODPARAMNAME_REGEX");
    this.put(/^[&_!#\*]?[\w\d\*%\$\?#]+$/, "OLEEXPORTING_REGEX"); // OLE exporting
    this.put(/^[\w$%]+$/, "SIMPLENAME");
    this.put(/^BOOLC$/i, "B O O L C");
    this.put(/^XSDBOOL$/i, "X S D B O O L");
    this.put(/^[\w%\$\*]+$/, "BLOCKNAME_REGEX");
    this.put(/^[\w~\/%$]+$/, "TYPENAME_REGEX");
    this.put(/^[\d]+$/, "WRITEOFFSETLENGTH_REGEX"); // WriteOffsetLength
    this.put(/^\*$/, "WRITEOFFSETLENGTH2_REGEX");
    this.put(/^\/?[\w\d]+$/, "WRITEOFFSETLENGTH3_REGEX");
    this.put(/^.+$/, "SYSTEMCALL_REGEX");
    this.put(/^[\w$%\^]{2}$/, "CLUSTER_REGEX");  // import and export clusters
    this.put(/^\w+?$/, "TABLEFUNCTION_REGEX");
    this.put(/^`.*`$/, "Z1");

    this.put(/^'.*'$/, "Z1");
    this.put(/^'.*'$/, "Z2");
    this.put(/^('.*')|(`.*`)$/, "Z3");
    this.put(/^&?\*?(\/\w+\/)?[\w\*\$]+(~\w+)?$/, "Z4");
    this.put(/^[\w$&\*%\/]+$/, "Z5");
    this.put(/^[\w$&\*%\/]+$/, "Z6");
    this.put(/^>?(\/\w+\/)?\w+#?@?\/?!?&?>?\$?$/, "Z7");
    this.put(/^[iweaxs]\d\d\d$/i, "Z8");
    this.put(/^[\w\*]{1,3}$/, "Z9");
    this.put(/^[&_!]?\*?\w*(\/\w+\/)?\d*[a-zA-Z_%\$][\w\*%\$\?]*(~\w+)?$/, "Z10");
    this.put(/^[\w\d%]+$/, "Z11");
    this.put(/^[\w/$%]+$/, "Z12");
    this.put(/^(\/\w+\/)?\w+~\w+$/, "Z13");
    this.put(/^[&_!]?\*?\w*(\/\w+\/)?\d*[a-zA-Z_%\$][\w\*%\$\?]*(~\w+)?$/, "Z14");
    this.put(/^[&_!]?\*?\w*(\/\w+\/)?\d*[a-zA-Z_%\$][\w\*%\$\?]*(~\w+)?$/, "Z15");
//    this.put(/^\(?!\(?/, "Z16"); // TODO fix typo
    this.put(/\\_\w+/, "Z17");
    this.put(/\w+/, "Z18");
    this.put(/^\w{3}$/, "Z19");
    this.put(/^('.*')|(`.*`)$/, "Z20");
    this.put(/[\w~]+/, "Z21");
    this.put(/^\/?[\d\w]+$/, "Z22");
    this.put(/^(0?[1-9]|[1234567][0-9]|8[0-3])$/, "Z23");
    this.put(/^\/?[\d\w]+$/, "Z24");
    this.put(/^\/?[\d\w]+$/, "Z25");

    this.put(/^(?!(?:SINGLE|INTO|DISTINCT|AS|WHERE|FOR|HAVING|APPENDING|UP|FROM)$)(\/\w+\/)?(\w+~(\w+|\*)|\w+)$/, "SQL_FIELD_NAME_REGEX");

  }


  private put(r: RegExp, keyword: string) {
    this.regexMap[r.source] = keyword;
  }


  public get(r: RegExp): string {
    const keyword = this.regexMap[r.source];
    if (keyword === undefined) {
      console.log("ERROR Unknown regex: " + r);
    }
    return keyword;
  }
}

export const REGEXP_MAPPING = new RegExpMapping();
