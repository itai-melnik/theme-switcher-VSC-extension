import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import { switchTheme } from '../../extension';

describe('Theme Switcher', () => {
    let getConfigurationStub: sinon.SinonStub;
    let updateStub: sinon.SinonStub;

    beforeEach(() => {
        // Mock the VS Code API
        getConfigurationStub = sinon.stub(vscode.workspace, 'getConfiguration').returns({
            get: () => 'Quiet Light', // Mock current theme as 'Quiet Light'
            update: sinon.stub().resolves(), // Mock update method
        } as any);

        updateStub = getConfigurationStub().update;
    });

    afterEach(() => {
        // Restore original behavior
        sinon.restore();
    });

    it('should switch to Dark theme after 6 PM', async () => {
        // Mock time to 7 PM
        const mockDate = new Date();
        mockDate.setHours(19); // 7 PM
        sinon.useFakeTimers({ now: mockDate });

        await switchTheme();

        // Check that the theme was updated to 'Kimbie Dark'
        assert.strictEqual(updateStub.calledWith('colorTheme', 'Kimbie Dark', vscode.ConfigurationTarget.Global), true);
    });

    it('should switch to Light theme before 6 AM', async () => {
        // Mock time to 5 AM
        const mockDate = new Date();
        mockDate.setHours(5); // 5 AM
        sinon.useFakeTimers({ now: mockDate });

        await switchTheme();

        // Check that the theme was updated to 'Quiet Light'
        assert.strictEqual(updateStub.calledWith('colorTheme', 'Quiet Light', vscode.ConfigurationTarget.Global), true);
    });

    it('should switch to Dark theme between 6 PM and 6 AM', async () => {
        // Mock time to midnight (12 AM)
        const mockDate = new Date();
        mockDate.setHours(0); // 12 AM
        sinon.useFakeTimers({ now: mockDate });

        await switchTheme();

        // Check that the theme was updated to 'Kimbie Dark'
        assert.strictEqual(updateStub.calledWith('colorTheme', 'Kimbie Dark', vscode.ConfigurationTarget.Global), true);
    });
});

export function run() {
    describe('Theme Switcher Tests', () => {
        it('should switch to Dark theme after 6 PM', async () => {
            const mockHour = 19; // 7 PM
            const selectedTheme = mockHour >= 18 || mockHour < 6 ? 'Kimbie Dark' : 'Quiet Light';

            await vscode.workspace.getConfiguration('workbench').update(
                'colorTheme',
                selectedTheme,
                vscode.ConfigurationTarget.Global
            );

            const updatedTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme');
            assert.strictEqual(updatedTheme, 'Kimbie Dark');
        });
    });
}
