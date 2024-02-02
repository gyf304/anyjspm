#!/usr/bin/env node

const { getPidPath, spawn } = require("./lib.js");

async function main() {
	const args = process.argv.slice(2);
	const interpreter = await getPidPath(process.pid);
	const code = await spawn(interpreter, args);
	process.exit(code);
}

main();
