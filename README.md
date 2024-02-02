# anyjspm

AnyJSPM is a simple shim that runs the correct package manager or
JS interpreter in package.json scripts.

For example if you have a package.json file with the following scripts:

```json
{
	"scripts": {
		"build": "tsc",
		"start": "npm run build && node dist/index.js"
	}
}
```

This works if you are using `npm` and `node`, but if you are using an
alternative package manager like yarn, or an alternative JS interpreter
like bun, then this will not work.

One workaround is to use the envionment variable `npm_execpath` and
`npm_node_execpath` to run the correct package manager or JS interpreter.
However, referencing environment variable in package.json scripts is
not portable across different OSes. So script entries like
`$npm_execpath run build` will not work on Windows.

AnyJSPM solves this problem by running the correct package manager or
JS interpreter for you. So instead of using `npm` or `node` in your
scripts, you can use `anypm` and `anyjs` instead.

```json
{
	"scripts": {
		"build": "tsc",
		"start": "anypm build && anyjs dist/index.js"
	}
}
```
