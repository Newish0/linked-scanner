// utils.js

import path from "path";
import { execSync } from "child_process";

/**
 * Run npm commands in a specific directory
 * 
 * @param {string} directory 
 * @param {string} command 
 * @returns 
 */
export const runNpmCommand = (directory, command) => {
    const currentFileUrl = import.meta.url;
    const cwd = path.resolve(new URL(currentFileUrl).pathname, '../../', directory);
    const result = execSync(`npm ${command}`, { cwd, stdio: 'inherit' });
    return result;
};