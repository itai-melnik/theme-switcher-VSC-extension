// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Theme Switcher extension is active!');

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.switchTheme', switchTheme)
    );

	// Schedule the theme switch immediately upon activation
    scheduleThemeSwitch();
}



	// Function to switch themes based on time
	export async function switchTheme() {
		const themes = ["Kimbie Dark", "Quiet Light"];
		const currentHour = new Date().getHours();

		const selectedTheme = (currentHour >= 18 || currentHour < 6) ? themes[0] : themes[1]; //add feature to get local sunrise and sunset times

		console.log(`Switching to theme: ${selectedTheme}`);
		await vscode.workspace.getConfiguration('workbench').update(
			'colorTheme',
			selectedTheme,
			vscode.ConfigurationTarget.Global
		);
		vscode.window.showInformationMessage(`Theme switched to: ${selectedTheme}`);
	}


	// Function to calculate the next switch time and schedule it
	function scheduleThemeSwitch() {
		const now = new Date();
		const nextSwitch = new Date();

		// Schedule for the next 6 AM or 6 PM
		if (now.getHours() >= 18) {
			// If it's past 6 PM, schedule for the next 6 AM
			nextSwitch.setHours(6, 0, 0, 0);
			nextSwitch.setDate(now.getDate() + 1);
		} else if (now.getHours() >= 6) {
			// If it's past 6 AM but before 6 PM, schedule for 6 PM
			nextSwitch.setHours(18, 0, 0, 0);
		} else {
			// If it's before 6 AM, schedule for today at 6 AM
			nextSwitch.setHours(6, 0, 0, 0);
		}

		const timeUntilSwitch = nextSwitch.getTime() - now.getTime();
		console.log(`Next theme switch scheduled in ${timeUntilSwitch / 1000} seconds.`);

		const hoursUntilSwitch = (timeUntilSwitch / (1000 * 60 * 60)).toFixed(2);

		vscode.window.showInformationMessage(`Time till next switch: ${hoursUntilSwitch} hours`);
		// Schedule the theme switch at the next 6 AM or 6 PM
		setTimeout(() => {
			switchTheme();
			scheduleThemeSwitch();  // Schedule the next switch after this one
		}, timeUntilSwitch)
	}


// This method is called when your extension is deactivated
export function deactivate() { }
