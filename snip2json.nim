# Copyright (c) 2015,2016,2017,2018,2019,2020,2021 Charles L. Blake.

import os, strutils, sequtils, json

proc scanDir(path: string): seq[string] =
  toSeq(walkDir(path))
    .filterIt(contains([pcFile, pcLinkToFile], it.kind))
    .mapIt(it.path)

proc readfile(filename: string): seq[string] =
  toSeq(filename.lines)

proc parseSnippet(lines: seq[string]): string =
  const
    snippetStart = "snippet"
    snippetEnd = "endsnippet"
  var
    prefix: string
    body: seq[string]
    snippets = %* {}

  for line in lines:
    if line.startsWith(snippetStart):
      prefix = line.split(' ')[1]
      snippets.add(prefix, %* {"prefix": [prefix]})
    elif line == snippetEnd:
      snippets[prefix].add("body", %* body)
      prefix = ""
      body = @[]
    elif prefix != "":
      body.add(line)

  snippets.pretty()

proc snip2json(snipDir = "snip", jsonDir = "json"): int =
  let snipDirPath = snipDir.absolutePath
  let jsonDirPath = jsonDir.absolutePath
  jsonDirPath.createDir
  var files: seq[string]

  try:
    files = snipDirPath.scanDir
  except OSError:
    echo "No such directory: ", snipDirPath
    return 1

  for file in files:
    let name = file.splitPath[1].changeFileExt("json")
    let snippet = file.readfile.parseSnippet
    joinPath(jsonDirPath, name).open(fmWrite).write(snippet)

  0

when isMainModule:
  import cligen
  dispatch(snip2json, help = {
    "snipDir": "Set the input directory. Default: snip",
    "jsonDir": "Set the output directory. Default: json"
  })
