const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const ENV_FILE = path.resolve(__dirname, '..', '.env');
const TMP_ENV_FILE = `${ENV_FILE}.tmp`;
const GIT_ENV_KEYS = new Set(['REACT_APP_GIT_BRANCH', 'REACT_APP_GIT_SHA']);

function readExistingEnv() {
    if (!fs.existsSync(ENV_FILE)) return new Map();

    const env = new Map();
    const contents = fs.readFileSync(ENV_FILE, 'utf8');

    for (const line of contents.split(/\r?\n/)) {
        if (!line.trim() || line.trimStart().startsWith('#')) continue;

        const separator = line.indexOf('=');
        if (separator === -1) continue;

        const key = line.slice(0, separator).trim();
        let value = line.slice(separator + 1).trim();

        if (GIT_ENV_KEYS.has(key)) continue;
        if (
            (value.startsWith("'") && value.endsWith("'")) ||
            (value.startsWith('"') && value.endsWith('"'))
        ) {
            value = value.slice(1, -1);
        }

        env.set(key, value);
    }

    return env;
}

function getGitValue(command) {
    try {
        return childProcess.execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch (error) {
        return '';
    }
}

function formatEnvLine(key, value) {
    const safeValue = String(value).replace(/\r?\n/g, '').replace(/'/g, "\\'");
    return `${key}='${safeValue}'`;
}

const env = readExistingEnv();
const branch = getGitValue('git rev-parse --abbrev-ref HEAD');
const sha = getGitValue('git rev-parse --short HEAD');

if (branch) env.set('REACT_APP_GIT_BRANCH', branch);
if (sha) env.set('REACT_APP_GIT_SHA', sha);

const output = Array.from(env.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => formatEnvLine(key, value))
    .join('\n');

fs.writeFileSync(TMP_ENV_FILE, output ? `${output}\n` : '');
fs.renameSync(TMP_ENV_FILE, ENV_FILE);
