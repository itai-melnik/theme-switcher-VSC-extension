import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
    try {
        // The path to the extension's root directory
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // The path to the test suite
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        // Launch the tests inside VS Code
        await runTests({ extensionDevelopmentPath, extensionTestsPath });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();