// build-client.js

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Function to run npm commands in a specific directory
const runNpmCommand = (directory, command) => {
    const currentFileUrl = import.meta.url;
    const cwd = path.resolve(new URL(currentFileUrl).pathname, '../../', directory);
    const result = execSync(`npm ${command}`, { cwd, stdio: 'inherit' });
    return result;
};

// Run npm install and npm run build in the client directory
runNpmCommand('client', 'install');
runNpmCommand('client', 'run build');

// Copy the build output to the dist/client directory
const sourceDir = path.resolve(new URL(import.meta.url).pathname, '../../', 'client', 'dist');
const destDir = path.resolve(new URL(import.meta.url).pathname, '../../', 'dist', 'client');

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(sourceDir, destDir);
