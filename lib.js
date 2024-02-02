const nodeExecFile = require("child_process").execFile;
const nodeSpawn = require("child_process").spawn;

const osSep = process.platform === "win32" ? "\\" : "/";

function exec(command, args) {
	return new Promise((resolve, reject) => {
		nodeExecFile(command, args, (error, stdout, stderr) => {
			if (error) {
				reject(error);
			} else {
				resolve(stdout);
			}
		});
	});
}

async function getPidPath(pid) {
	let ret;
	switch (process.platform) {
		case "win32":
			ret = await exec("PowerShell", ["Get-Process", "-Id", pid.toString(), "|", "foreach", "{ $_.Path }"]);
			break;
		default:
			ret = await exec("ps", ["-p", pid.toString(), "-o", "exe="]);
			break;
	}
	return ret.trim();
}

async function which(command) {
	let ret;
	switch (process.platform) {
		case "win32":
			ret = await exec("where.exe", [command]).then((o) => o.split("\n")[0]);
			break;
		default:
			ret = await exec("which", [command]);
			break;
	}
	return ret.trim();
}

async function spawn(command, args) {
	return new Promise((resolve) => {
		let spawned;
		if (process.platform === "win32") {
			spawned = nodeSpawn(
				"cmd.exe",
				["/c", command, ...args],
				{ stdio: "inherit" },
			);
		} else {
			spawned = nodeSpawn(command, args, { stdio: "inherit" });
		}
		spawned.on("close", (code) => {
			resolve(code);
		});
	});
}

module.exports = {
	getPidPath,
	osSep,
	which,
	spawn
};
