# snip2json

Convert simple syntax snippets to LSP format json.

I will consider distributing binaries upon request.

# Usage

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

Like ultisnip.

from
```
snippet test
hello! $1
endsnippet
```

to
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
