# snip2json

Convert ultisnips syntax snippets to LSP format json.

# Usage

You need to install Deno runtime.
Add "path/to/snip2json/bin" to the user PATH.

```
snip2json.ts <option>
```

Convert all files in the input directory.

## options

-s, --src  
  Set the input directory. Required.

-t, --target
  Set the output directory. Default: json

## runnable example

In this repository, there are example can be convert.

```
snip2json.ts -s ./example/snip -t ./example/json
```
