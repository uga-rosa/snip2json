# snip2json

Convert simple syntax snippets to LSP format json.

# Usage

Place `snip2json` under bin in a location with a path.
Non-linux users should build it by themselves.

```
snip2json <option>
```

Convert all files in the input directory.

## options

-s=, --snipDir=  
  Set the input directory. Default: snip

-j=, --jsonDir=  
  Set the output directory. Default: json

-h, --help  
  help message

# How to write snippet

Write the `prefix` after the `snippet`. The body is from the line after `snippet` to the before `endsnippet`

```
snippet test
hello! $1
endsnippet
```

Convert as following.
```
{
  "test": {
    "prefix": [
      "test"
    ],
    "body": [
      "hello! $1"
    ]
  }
}
```

See also `./example`.
