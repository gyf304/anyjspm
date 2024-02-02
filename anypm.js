#!/usr/bin/env node

const { getPidPath, osSep, which, spawn } = require("./lib.js");

const knownPackageManagers = ["bun", "yarn", "pnpm", "npm"];

async function main() {
	const args = process.argv.slice(2);

	let pm = undefined;

	if (!pm) {
		const candidates = [await getPidPath(process.pid), await getPidPath(process.ppid)];
		for (const candidate of candidates) {
			const cmd = candidate.split(osSep).pop();
			if (knownPackageManagers[cmd]) {
				pm = cmd;
				break;
			}
		}
	}

	pm = process.env.npm_execpath;

	if (!pm) {
		const allPmPaths = await Promise.allSettled(knownPackageManagers.map(which));
		const foundPmPaths = allPmPaths.filter((p) => p.status === "fulfilled").map((p) => p.value);
		if (foundPmPaths.length === 0) {
			console.error("No known package manager found in PATH");
			process.exit(1);
		}
		pm = foundPmPaths[0];
	}

	const code = await spawn(pm, args);

	process.exit(code);
}

main();
