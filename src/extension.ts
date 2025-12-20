import * as vscode from 'vscode';

interface WebviewMessage {
  type: string;
  [key: string]: any;
}

interface DailyHydrationRecord {
  date: string; // YYYY-MM-DD
  targetMl: number;
  consumedMl: number;
}

interface HydrationHistory {
  records: DailyHydrationRecord[];
}

export function activate(context: vscode.ExtensionContext) {
	console.log('CodeSprout is now active!');
	
	// Register the webview view provider
	const provider = new CodeSproutViewProvider(context.extensionUri, context);
	
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(CodeSproutViewProvider.viewType, provider)
	);

	// Initialize the reminder system
	initializeReminderSystem(context);
}

export function deactivate() {
	// Clean up when extension is deactivated
	console.log('CodeSprout deactivated');
}

class CodeSproutViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'codeSprout-view';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
		private readonly _extensionContext: vscode.ExtensionContext
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		// Send initial hydration state to webview
		const today = new Date().toISOString().split('T')[0];
		
		// Get hydration history
		const hydrationHistory: HydrationHistory = this._extensionContext.globalState.get<HydrationHistory>('codeSprout.hydrationHistory', { records: [] });
		
		// Find today's record
		let todayRecord = hydrationHistory.records.find(record => record.date === today);
		if (!todayRecord) {
			todayRecord = {
				date: today,
				targetMl: 0,
				consumedMl: 0
			};
		}
		
		const config = vscode.workspace.getConfiguration('codeSprout');
		const dailyTarget = this._calculateDailyWaterTarget(config);
		todayRecord.targetMl = dailyTarget;
		
		const progress = dailyTarget > 0 ? Math.min(100, Math.round((todayRecord.consumedMl / dailyTarget) * 100)) : 0;
		const streak = this._calculateStreak(hydrationHistory);
		
		webviewView.webview.postMessage({
			type: 'updateStats',
			streak: streak,
			consumed: todayRecord.consumedMl,
			progress: progress,
			dailyTarget: dailyTarget
		});

		webviewView.webview.onDidReceiveMessage((data: WebviewMessage) => {
			switch (data.type) {
				case 'waterPlant':
					{
						// Handle watering the plant
						vscode.window.showInformationMessage('Your plant feels refreshed! 💧');
						
						// Get current date in YYYY-MM-DD format
						const today = new Date().toISOString().split('T')[0];
						
						// Get daily target
						const config = vscode.workspace.getConfiguration('codeSprout');
						const dailyTarget = this._calculateDailyWaterTarget(config);
						
						// Get current hydration history
						let hydrationHistory: HydrationHistory = this._extensionContext.globalState.get<HydrationHistory>('codeSprout.hydrationHistory', { records: [] });
						
						// Find today's record or create a new one
						let todayRecord = hydrationHistory.records.find(record => record.date === today);
						if (!todayRecord) {
							todayRecord = {
								date: today,
								targetMl: dailyTarget,
								consumedMl: 0
							};
							hydrationHistory.records.push(todayRecord);
						}
						
						// Add 250ml per drink (standard glass)
						todayRecord.consumedMl += 250;
						todayRecord.targetMl = dailyTarget; // Update target in case it changed
						
						// Save updated history
						this._extensionContext.globalState.update('codeSprout.hydrationHistory', hydrationHistory);
						
						// Calculate streak
						const streak = this._calculateStreak(hydrationHistory);
						this._extensionContext.globalState.update('codeSprout.streak', streak);
						
						// Calculate progress percentage
						const progress = Math.min(100, Math.round((todayRecord.consumedMl / dailyTarget) * 100));
						
						// Send updated stats to webview
						webviewView.webview.postMessage({
							type: 'updateStats',
							streak: streak,
							consumed: todayRecord.consumedMl,
							progress: progress,
							dailyTarget: dailyTarget
						});
						break;
					}
				case 'openSettings':
					{
						// Open VS Code settings for CodeSprout
						vscode.commands.executeCommand('workbench.action.openSettings', 'codeSprout');
						break;
					}
				case 'requestHistory':
					{
						// Send hydration history to webview
						const hydrationHistory: HydrationHistory = this._extensionContext.globalState.get<HydrationHistory>('codeSprout.hydrationHistory', { records: [] });
						webviewView.webview.postMessage({
							type: 'historyData',
							history: hydrationHistory
						});
						break;
					}
			}
		});
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to scripts and css
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
		const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));

		// Use a nonce to whitelist which scripts can be run
		const nonce = getNonce();

		// Get user's height and weight from settings
		const config = vscode.workspace.getConfiguration('codeSprout');
		const height = config.get<number>('height', 170);
		const weight = config.get<number>('weight', 65);
		const recommendedWater = this._calculateDailyWaterTarget(config);

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleUri}" rel="stylesheet">
				<title>CodeSprout</title>
			</head>
			<body>
				<div class="container">
					<h1>🌱 My Garden</h1>
					<div class="plant-container">
						<div class="plant happy">🌿</div>
					</div>
					<div class="stats">
						<h3>💧 Daily Goal: <span id="recommended">${recommendedWater}</span> ml</h3>
						<p>Drank Today: <span id="consumed">0</span> ml</p>
						<p>Progress: <span id="progress">0</span>%</p>
						<p>Streak: <span id="streak">0</span> days</p>
						<p>Height: <span id="height">${height}</span> cm</p>
						<p>Weight: <span id="weight">${weight}</span> kg</p>
					</div>
					<div class="report-section">
						<h3>📊 Weekly Summary</h3>
						<div id="chart-container">
							<canvas id="hydrationChart" width="280" height="150"></canvas>
						</div>
						<button id="refreshChart">🔄 Refresh</button>
					</div>
					<button id="waterButton">💧 Water Plant</button>
					<button id="settingsButton">⚙️ Settings</button>
				</div>
				
				<script nonce="${nonce}" src="${scriptUri}"></script>
				<script nonce="${nonce}">
					const vscode = acquireVsCodeApi();
				</script>
			</body>
			</html>`;
	}

	private _calculateDailyWaterTarget(config: vscode.WorkspaceConfiguration): number {
		const manualTarget = config.get<number>('dailyWaterTarget', 0);

		if (manualTarget && manualTarget > 0) {
			return manualTarget;
		}

		const weight = config.get<number>('weight', 65);
		return this._calculateWaterIntake(weight);
	}

	private _calculateWaterIntake(weightKg: number): number {
		// Calculate water intake using the formula: body weight (kg) * 35 ml
		return Math.round(weightKg * 35);
	}

	private _calculateStreak(hydrationHistory: HydrationHistory): number {
		if (hydrationHistory.records.length === 0) {
			return 0;
		}

		// Sort records by date descending
		const sortedRecords = [...hydrationHistory.records].sort((a, b) => 
			new Date(b.date).getTime() - new Date(a.date).getTime()
		);

		let streak = 0;
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		for (let i = 0; i < sortedRecords.length; i++) {
			const recordDate = new Date(sortedRecords[i].date);
			recordDate.setHours(0, 0, 0, 0);

			// Calculate days difference
			const timeDiff = today.getTime() - recordDate.getTime();
			const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

			// If this record is from today or consecutive previous days
			if (daysDiff === i) {
				// Check if target was met (at least 90%)
				if (sortedRecords[i].consumedMl >= sortedRecords[i].targetMl * 0.9) {
					streak++;
				} else {
					break; // Streak broken
				}
			} else {
				break; // Gap in dates
			}
		}

		return streak;
	}
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function initializeReminderSystem(context: vscode.ExtensionContext) {
	// Get the interval from settings (default to 45 minutes)
	const config = vscode.workspace.getConfiguration('codeSprout');
	const intervalMinutes = config.get<number>('interval', 45);
	
	// Convert to milliseconds
	const intervalMs = intervalMinutes * 60 * 1000;
	
	// Set up the interval to check for reminders
	setInterval(() => {
		showReminder();
	}, intervalMs);
	
	// Show a reminder when the extension first activates
	showReminder();
}

function showReminder() {
	// Show an information message with options
	vscode.window.showInformationMessage(
		'Your Sprout looks thirsty! Take a sip?',
		'I Drank',
		'Snooze 10m'
	).then((selection: string | undefined) => {
		if (selection === 'I Drank') {
			vscode.window.showInformationMessage('Good job staying hydrated! 💧');
		} else if (selection === 'Snooze 10m') {
			// Implement snooze functionality
			vscode.window.showInformationMessage('Reminder snoozed for 10 minutes.');
		}
	});
}