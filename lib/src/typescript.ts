const JsonToTS = require('json-to-ts')

export interface TypeScript {
  /** Converts a json object into TypeScript interfaces */
  jsonToTypes(obj: object): string[];
}

export const typescript: TypeScript = {
  jsonToTypes: (json: object) => {
    return JsonToTS(json);
  },
}
