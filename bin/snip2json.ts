#!/usr/bin/env -S deno run -A

import { parse } from "https://deno.land/std@0.171.0/flags/mod.ts";
import { join } from "https://deno.land/std@0.171.0/path/mod.ts";

interface snippet {
  prefix: string;
  body: string[];
  description?: string;
}

const parseSnippet = async (filepath: string): Promise<string> => {
  const snippets: { [name: string]: snippet } = {};
  let snippet: snippet = { prefix: "", body: [] };
  let in_body = false;
  const lines = (await Deno.readTextFile(filepath)).split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === "endsnippet") {
      if (snippet.body.length === 0) {
        return Promise.reject(`Syntax error (no body): L${i + 1}`);
      }
      in_body = false;
      snippets[snippet.prefix] = snippet;
    } else if (in_body) {
      snippet.body.push(line);
    } else if (line.startsWith("snippet")) {
      const quote = line.match(/^snippet\s+([^A-Za-z])/)?.[1];
      const trigger_regexp = quote ? `${quote}(.+?)${quote}` : "(\\S+)";
      const matched = line.match(
        new RegExp(`^snippet\\s+${trigger_regexp}(?:\\s+"(.*)")?`),
      );
      if (!matched || matched.length < 2) {
        return Promise.reject(`Syntax error (no trigger): L${i + 1}`);
      }
      snippet = { prefix: matched[1], body: [], description: matched[2] };
      in_body = true;
    }
  }
  return JSON.stringify(snippets, null, 2);
};

const dirExists = async (filepath: string): Promise<boolean> => {
  try {
    const stat = await Deno.stat(filepath);
    return stat.isDirectory;
  } catch {
    return false;
  }
};

const main = async (): Promise<void> => {
  const parsedArgs = parse(Deno.args);

  const src = parsedArgs.src || parsedArgs.s;
  if (!src) {
    return Promise.reject("Required flag `--src (-s)` is not set.");
  }
  if (!dirExists(src)) {
    return Promise.reject(`No such directory: ${src}`);
  }

  const target = parsedArgs.target || parsedArgs.t || "json";
  await Deno.mkdir(target, { recursive: true });

  try {
    for await (const entry of Deno.readDir(src)) {
      if (entry.isFile) {
        const json_string = await parseSnippet(join(src, entry.name));
        await Deno.writeTextFile(
          join(target, entry.name).replace(/\.[^/.]+$/, "") + ".json",
          json_string,
        );
      }
    }
  } catch (e) {
    return Promise.reject(e);
  }
};

main()
  .catch((e) => {
    console.log(e);
    Deno.exit(1);
  });
