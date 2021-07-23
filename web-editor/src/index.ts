import * as lib from '../../lib/src/index';
import * as monaco from 'monaco-editor'

import fullIndex from '../../lib/dist/indexout.dec';


type LogEntry = {
  type: 'log';
  text: string;
} | {
  type: 'log-end';
  runtime: number;
};

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

function toString(value: any): string {
  if (typeof value === 'object') {
    return JSON.stringify(value, getCircularReplacer(), 2);
  }
  return `${value}`;
}

const consoleLog = console.log;

class Logger {
  history: LogEntry[] = [];
  div: HTMLDivElement;

  constructor() {
    this.div = document.getElementById('output')! as HTMLDivElement;

    (document.getElementById('clear-button')! as HTMLButtonElement).addEventListener('click', ev => {
      this.clear();
    });
  }

  clear() {
    this.history = [];
    this.update();
  }

  println(message?: any, ...optionalParams: any[]) {
    lib.println(message, ...optionalParams);

    const formattedText = [message, ...optionalParams]
      .map(it => toString(it))
      .join(', ');

    this.history.push({ type: 'log', text: formattedText });
    this.update();
  }

  logEnd(runtime: number) {
    this.history.push({ type: 'log-end', runtime });
    this.update();
  }

  private update() {
    while (this.div.childNodes.length > 0) {
      this.div.removeChild(this.div.childNodes[0])
    }
    for (const line of this.history) {
      switch (line.type) {
        case 'log': {
          const lineDiv = document.createElement('div');
          lineDiv.className = 'log-line';

          const prompt = document.createElement('pre');
          prompt.textContent = '> ';
          prompt.style.margin = '1px 0px 1px 0px';
          prompt.style.userSelect = 'none';

          const logDiv = document.createElement('pre');
          logDiv.style.whiteSpace = 'pre-wrap';
          logDiv.textContent = `${line.text}`;
          logDiv.style.margin = '1px 0px 1px 0px';

          lineDiv.append(prompt);
          lineDiv.append(logDiv);
          this.div.append(lineDiv);
          break;
        }
        case 'log-end': {
          const divider = document.createElement('hr') as HTMLHRElement;

          const lineDiv = document.createElement('pre');
          lineDiv.style.color = 'grey';
          lineDiv.style.margin = '0px';
          lineDiv.textContent = `Runtime: ${line.runtime}ms`;
          lineDiv.style.userSelect = 'none';

          divider.style.borderTop = '1px dashed grey';
          divider.style.borderBottom = '0px';
          divider.style.opacity = '0.2';
          divider.style.margin = '4px 0px 4px 0px';

          this.div.append(lineDiv);
          this.div.append(divider);
          break;
        }
      }
    }
  }
}

const logger = new Logger();

const customLog = (message?: any, ...optionalParams: any[]) => logger.println(message, ...optionalParams);

function evalCode(src: string) {
  const tb = lib.tb;
  const println = customLog;

  const start = Date.now();
  // eslint-disable-next-line no-eval
  eval(`${src}`);

  logger.logEnd(Date.now() - start);
}

async function runCode(client: monaco.languages.typescript.TypeScriptWorker) {
  const model = monaco.editor.getModels()[0];
  const uri = model.uri;
  const result = await client.getEmitOutput(uri.toString());
  const output = result.outputFiles[0]?.text;
  if (!output) {
    return;
  }
  try {
    evalCode(output);
  } catch (e) {
    console.error(e);
  }
}

const work = async () => {
  const files: Record<string, string> = {
    'lib': fullIndex,
  };

  for (const fileName in files) {
    //const fakePath = `file:///node_modules/@types/${fileName}`;
    const fakePath = `inmemory:${fileName}`;

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      files[fileName],
      fakePath
    );
  }

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  })

  const model = monaco.editor.createModel(`
const base64 = tb.encoding.base64;
const bytes = tb.encoding.bytes;

const base64Encoded =  base64.encode(bytes.fromString('base64message'))
println(base64Encoded)
const result  = bytes.toString(base64.decode(base64Encoded))
println(result);

const hex = tb.encoding.hex;
println(hex.encode(bytes.fromString('hexdata')))

const sha1 = tb.hashing.sha1;
println(sha1.digestToHex('hashdata'))
println(hex.encode(sha1.digest('hashdata')))

const zlib = tb.zlib;
const zipped = zlib.deflate('testzip')
println(zlib.inflateToString(zipped))
println(bytes.toString(zlib.inflate(zipped)))

println(tb.random.id())
`,
    "typescript",
    monaco.Uri.parse("file:///main.tsx"),
  );

  const editorDiv = document.getElementById('monaco-editor-embed')!;

  const workerPromise = await monaco.languages.typescript.getTypeScriptWorker();
  const client = await workerPromise();

  editorDiv.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter' || !ev.ctrlKey) {
      return;
    }
    runCode(client)

    ev.stopImmediatePropagation();
  })

  monaco.editor.create(editorDiv, {
    model,
    language: 'typescript',
    theme: 'vs-dark',
    minimap: {
      enabled: false,
    },
  });

  document.getElementById('loader')?.parentNode?.removeChild(document.getElementById('loader')!)
  editorDiv.removeAttribute('hidden');

  console.log = customLog;
  console.error = customLog;
  console.info = customLog;
  console.debug = customLog;
};
work();
