// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getLocation, getSunTimes } from './apiService';

// Global variables to store sunrise and sunset times
let sunriseTime: string | undefined;
let sunsetTime: string | undefined;

// This method is called when your extension is activated
export async function activate(context: vscode.ExtensionContext) {
    console.log('Theme Switcher extension is active!');

    // Fetch and store sunrise and sunset times
    await initializeSunTimes();

    // Register the theme switch command
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.switchTheme', switchTheme)
    );

    // Immediately switch the theme upon activation
    await switchTheme();
    scheduleThemeSwitch();
}

// Function to initialize sunrise and sunset times
async function initializeSunTimes() {
    try {
        const location = await getLocation();
        if (!location) {
            vscode.window.showErrorMessage('Failed to retrieve location.');
            return;
        }

        const { lat, lon } = location;
        const sunTimes = await getSunTimes(lat, lon);
        if (!sunTimes) {
            vscode.window.showErrorMessage('Failed to retrieve sun times.');
            return;
        }

        sunriseTime = sunTimes.sunrise;
        sunsetTime = sunTimes.sunset;

        console.log(`Sunrise: ${sunriseTime}, Sunset: ${sunsetTime}`);
    } catch (error) {
        console.error('Error initializing sun times:', error);
        vscode.window.showErrorMessage('An error occurred while retrieving sun times.');
    }
}



// Function to switch the theme based on the time of day
export async function switchTheme() {
    if (!sunriseTime || !sunsetTime) {
        vscode.window.showErrorMessage('Sunrise and sunset times are not initialized.');
        return;
    }

    const currentTime = new Date().toISOString();
    const isDay = currentTime >= sunriseTime && currentTime < sunsetTime;

    const themes = ['Quiet Light', 'Kimbie Dark'];
    const selectedTheme = isDay ? themes[0] : themes[1];

    console.log(`Switching to theme: ${selectedTheme}`);
    await vscode.workspace.getConfiguration('workbench').update(
        'colorTheme',
        selectedTheme,
        vscode.ConfigurationTarget.Global
    );

    vscode.window.showInformationMessage(`Theme switched to: ${selectedTheme}`);
}




// Function to calculate the next switch time based on sunrise/sunset and schedule it
function scheduleThemeSwitch() {
    if (!sunriseTime || !sunsetTime) {
        vscode.window.showErrorMessage('Sunrise and sunset times are not initialized.');
        return;
    }

    const now = new Date();
    const sunrise = new Date(sunriseTime);
    const sunset = new Date(sunsetTime);

    let nextSwitch: Date;

    // Determine the next switch time
    if (now < sunrise) {
        nextSwitch = sunrise; // Switch at the next sunrise
    } else if (now < sunset) {
        nextSwitch = sunset; // Switch at the next sunset
    } else {
        nextSwitch = new Date(sunrise.getTime() + 24 * 60 * 60 * 1000); // Next day's sunrise
    }

    const timeUntilSwitch = nextSwitch.getTime() - now.getTime();
    console.log(`Next theme switch scheduled in ${timeUntilSwitch / 1000} seconds.`);

    const hoursUntilSwitch = (timeUntilSwitch / (1000 * 60 * 60)).toFixed(2);
    vscode.window.showInformationMessage(`Time till next switch: ${hoursUntilSwitch} hours`);

    // Schedule the theme switch for the next sunrise or sunset
    setTimeout(async () => {
        await switchTheme();
        scheduleThemeSwitch(); // Schedule the next switch
    }, timeUntilSwitch);
}


// This method is called when your extension is deactivated
export function deactivate() { }
