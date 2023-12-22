// build-client.js

import { runNpmCommand } from "./utils"



// Run npm install and npm run build in the client directory
runNpmCommand('client', 'install');
runNpmCommand('client', 'run build');

// // Copy the build output to the dist/client directory
// const sourceDir = path.resolve(new URL(import.meta.url).pathname, '../../', 'client', 'dist');
// const destDir = path.resolve(new URL(import.meta.url).pathname, '../../', 'dist', 'client');

// fs.mkdirSync(destDir, { recursive: true });
// fs.copyFileSync(sourceDir, destDir);
