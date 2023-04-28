// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { exec } = require('child_process');
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function runJar(context) {
	const activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) {
		vscode.window.showInformationMessage('Aucun fichier ouvert dans l\'éditeur');
		return;
	}

	const filePath = activeEditor.document.uri.fsPath;
	if (path.extname(filePath) !== '.xml') {
		vscode.window.showInformationMessage('Le fichier doit être un fichier XML');
		return;
	}

	const fileName = path.parse(filePath).name;
	const fileDir = path.parse(filePath).dir;
	const extPath = context.extensionPath;

	exec('java -jar "' + extPath + '\\jars\\xsd-gen-fat-0.2.4.jar" "' + fileDir + '\\' + fileName + '.xml" > "' + fileDir + '\\' + fileName + '.xsd"', (error, stdout, stderr) => {
		if (error) {
			console.error('Erreur: ' + error.message);
			vscode.window.showErrorMessage('Erreur lors de la génération du fichier XSD: ' + error.message);
			return;
		}

		console.log('stdout: ' + stdout);
		vscode.window.showInformationMessage('Fichier XSD généré avec succès : ' + fileName + '.xsd');
	});
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	console.log('Congratulations, your extension "xsd-gen" is now active!');

	let disposable = vscode.commands.registerCommand('xsd-gen.generateXsd', function () {
		runJar(context)
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
