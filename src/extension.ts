import * as vscode from 'vscode';

// Converte JSON para YAML simples
function jsonToYaml(obj: any, indent = 0): string {
	const pad = '  '.repeat(indent);
	if (Array.isArray(obj)) {
		return obj.map(item =>
			typeof item === 'object'
				? `${pad}-\n${jsonToYaml(item, indent + 1)}`
				: `${pad}- ${item}`
		).join('\n');
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

// Ordena chaves recursivamente
function sortKeys(obj: any): any {
	if (Array.isArray(obj)) return obj.map(sortKeys);
	if (typeof obj === 'object' && obj !== null) {
		return Object.keys(obj).sort().reduce((acc: any, key) => {
			acc[key] = sortKeys(obj[key]);
			return acc;
		}, {});
	}
	return obj;
}

// Converte JSON para CSV
function jsonToCsv(obj: any): string {
	const arr = Array.isArray(obj) ? obj : [obj];
	if (arr.length === 0) return '';
	const headers = Object.keys(arr[0]);
	const rows = arr.map(row =>
		headers.map(h => {
			const val = row[h] ?? '';
			const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
			return str.includes(',') || str.includes('"') || str.includes('\n')
				? `"${str.replace(/"/g, '""')}"` : str;
		}).join(',')
	);
	return [headers.join(','), ...rows].join('\n');
}

export function activate(context: vscode.ExtensionContext) {

	// Comando 1: Formatar JSON
	const formatCmd = vscode.commands.registerCommand(
		'json-beautifier.format',
		() => processSelection(text => JSON.stringify(JSON.parse(text), null, 2))
	);

	// Comando 2: Minificar JSON
	const minifyCmd = vscode.commands.registerCommand(
		'json-beautifier.minify',
		() => processSelection(text => JSON.stringify(JSON.parse(text)))
	);

	// Comando 3: Converter JSON → YAML
	const yamlCmd = vscode.commands.registerCommand(
		'json-beautifier.toYaml',
		() => processSelection(text => jsonToYaml(JSON.parse(text)))
	);

	// Comando 4: Ordenar chaves do JSON
	const sortCmd = vscode.commands.registerCommand(
		'json-beautifier.sortKeys',
		() => processSelection(text => JSON.stringify(sortKeys(JSON.parse(text)), null, 2))
	);

	// Comando 5: Validar JSON
	const validateCmd = vscode.commands.registerCommand(
		'json-beautifier.validate',
		() => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) return;
			const text = editor.document.getText();
			try {
				JSON.parse(text);
				vscode.window.showInformationMessage('✅ JSON válido!');
			} catch (e: any) {
				// Tenta extrair linha do erro
				const match = e.message.match(/position (\d+)/);
				if (match) {
					const pos = parseInt(match[1]);
					const position = editor.document.positionAt(pos);
					const range = new vscode.Range(position, position);
					editor.selection = new vscode.Selection(range.start, range.end);
					editor.revealRange(range);
				}
				vscode.window.showErrorMessage(`❌ JSON inválido: ${e.message}`);
			}
		}
	);

	// Comando 6: Converter JSON → CSV
	const csvCmd = vscode.commands.registerCommand(
		'json-beautifier.toCsv',
		() => processSelection(text => jsonToCsv(JSON.parse(text)))
	);

	context.subscriptions.push(formatCmd, minifyCmd, yamlCmd, sortCmd, validateCmd, csvCmd);
}

async function processSelection(transform: (s: string) => string) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return;

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