const JsonToTS = require('json-to-ts')

export interface TypeScript {
  /** Converts a json object into TypeScript interfaces */
  jsonToTypes(obj: object): string[];
  objectToText(obj: Record<string, unknown> | unknown[], quote?: '\'' | '"',
    indent?: '  ' | '    ' | '        ' | '\t'): string;
  jsonToObject(json: string, quote?: '\'' | '"',
    indent?: '  ' | '    ' | '        ' | '\t'): string;
}

const objectToText = (obj: Record<string, unknown> | unknown[], quote: '\'' | '"' = '\'',
  indent: '  ' | '    ' | '        ' | '\t' = '  '): string => {
  return jsToTextWithIndent(obj, 0, quote, indent);
}

export const jsonToObject = (json: string, quote?: '\'' | '"',
  indent?: '  ' | '    ' | '        ' | '\t'): string => {
  return jsToTextWithIndent(JSON.parse(json), 0, quote, indent);
}

function formatIndent(n: number, indentChar: string): string {
  let output = '';
  for (let i = 0; i < n; i++) {
    output += indentChar;
  }
  return output;
}

const jsToTextWithIndent = (obj: Record<string, unknown> | unknown[], indent: number,
  quote: '\'' | '"' = '\'', indentChar: string = ' '): string => {
  if (Array.isArray(obj)) {
    return jsArrayToText(obj, indent, quote, indentChar);
  }
  let output = '{\n';
  for (const key of Object.keys(obj)) {
    output += formatIndent(indent + 1 , indentChar)
    const value = obj[key];
    switch (typeof value) {
      case 'string':
        output += `${key}: ${quote}${value}${quote},\n`;
        break;
      case 'number':
        output += `${key}: ${value},\n`;
        break;
      case 'boolean':
        output += `${key}: ${value ? 'true' : 'false'},\n`;
        break;
      case 'object': {
        if (Array.isArray(value)) {
          output += `${key}: ${jsToTextWithIndent(value, indent + 1, quote, indentChar)},\n`;
        } else if (value === null) {
          output += `${key}: null,\n`;
        } else {
          output += `${key}: ${jsToTextWithIndent(value as Record<string, unknown>, indent + 1, quote, indentChar)},\n`;
        }
        break;
      }
    }
  }
  output += formatIndent(indent, indentChar)
  output += '}';
  return output;
}

function jsArrayToText(obj: unknown[], indent: number, quote: '\'' | '"' = '\'', indentChar: string = ' '): string {
  let output = '[\n';
  for (const value of obj) {
    output += formatIndent(indent + 1 , indentChar)
    switch (typeof value) {
      case 'string':
        output += `${quote}${value}${quote},\n`;
        break;
      case 'number':
          output += `${value},\n`;
          break;
      case 'boolean':
          output += `${value ? 'true' : 'false'},\n`;
          break;
      case 'object': {
        if (Array.isArray(value)) {
          output += `${jsArrayToText(value, indent + 1, quote, indentChar)},\n`;
        } else if (value === null) {
          output += `null,\n`;
        } else {
          output += `${jsToTextWithIndent(value as Record<string, unknown>, indent + 1, quote, indentChar)},\n`;
        }
        break;
      }
    }
  }
  output += formatIndent(indent, indentChar)
  output += ']';
  return output;
}

export const typescript: TypeScript = {
  jsonToTypes: (json: object) => {
    return JsonToTS(json);
  },

  objectToText,
  jsonToObject,
}
