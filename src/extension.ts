import * as vscode from 'vscode';

// Converte JSON para YAML simples (sem dependência externa)
function jsonToYaml(obj: any, indent = 0): string {
	const pad = '  '.repeat(indent);
	if (Array.isArray(obj)) {
		return obj.map(item => `${pad}- ${typeof item === 'object' ? '\n' + jsonToYaml(item, indent + 1) : item}`).join('\n');
	}
	if (typeof obj === 'object' && obj !== null) {
		return Object.entries(obj).map(([k, v]) => {
			if (typeof v === 'object')
				return `${pad}${k}:\n${jsonToYaml(v, indent + 1)}`;
			return `${pad}${k}: ${v}`;
		}).join('\n');
	}
	return `${pad}${obj}`;
}

export function activate(context: vscode.ExtensionContext) {

	// Comando 1: Formatar JSON (pretty print)
	const formatCmd = vscode.commands.registerCommand(
		'json-beautifier.format',
		() => processSelection(text => {
			const parsed = JSON.parse(text);
			return JSON.stringify(parsed, null, 2);
		})
	);

	// Comando 2: Minificar JSON
	const minifyCmd = vscode.commands.registerCommand(
		'json-beautifier.minify',
		() => processSelection(text => {
			const parsed = JSON.parse(text);
			return JSON.stringify(parsed);
		})
	);

	// Comando 3: Converter JSON → YAML
	const yamlCmd = vscode.commands.registerCommand(
		'json-beautifier.toYaml',
		() => processSelection(text => {
			const parsed = JSON.parse(text);
			return jsonToYaml(parsed);
		})
	);

	context.subscriptions.push(formatCmd, minifyCmd, yamlCmd);
}

// Pega o texto selecionado (ou arquivo inteiro), processa e substitui
async function processSelection(transform: (s: string) => string) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) { return; }

	const selection = editor.selection;
	const text = selection.isEmpty
		? editor.document.getText()
		: editor.document.getText(selection);

	try {
		const result = transform(text);
		const range = selection.isEmpty
			? new vscode.Range(
				editor.document.positionAt(0),
				editor.document.positionAt(editor.document.getText().length)
			)
			: selection;
		await editor.edit(eb => eb.replace(range, result));
		vscode.window.showInformationMessage('✅ JSON Beautifier: done!');
	} catch (e) {
		vscode.window.showErrorMessage(`❌ JSON inválido: ${e}`);
	}
}

export function deactivate() { }