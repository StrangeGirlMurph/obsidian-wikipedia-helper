import { readFileSync, writeFileSync } from "fs";

const targetVersion = process.env.npm_package_version;

// Ensure docs/changelog.md has an Unreleased header before proceeding
let changelog = readFileSync("docs/changelog.md", "utf8");
if (!changelog.includes("## [Unreleased]") && !changelog.includes("## Unreleased")) {
	console.error(
		"Error: Could not find '## [Unreleased]' header in docs/changelog.md. Please add changelog notes under '## [Unreleased]' before bumping version."
	);
	process.exit(1);
}

// read minAppVersion from manifest.json and bump version to target version
let manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t"));

// update versions.json with target version and minAppVersion from manifest.json
let versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t"));

// update version string in src/utils/toolsAPI.ts
let toolsAPI = readFileSync("src/utils/toolsAPI.ts", "utf8");
toolsAPI = toolsAPI.replace(
	/Obsidian-Wikipedia-Helper\/\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?/g,
	`Obsidian-Wikipedia-Helper/${targetVersion}`
);
writeFileSync("src/utils/toolsAPI.ts", toolsAPI);

// update docs/changelog.md
const today = new Date();
const dd = String(today.getDate()).padStart(2, "0");
const mm = String(today.getMonth() + 1).padStart(2, "0");
const yyyy = today.getFullYear();
const dateStr = `${dd}.${mm}.${yyyy}`;

const newHeader = `## [${targetVersion}](https://github.com/StrangeGirlMurph/obsidian-wikipedia-helper/releases/tag/${targetVersion}) (${dateStr})`;
changelog = changelog.replace(/## \[\??Unreleased\]?/i, newHeader);
writeFileSync("docs/changelog.md", changelog);
