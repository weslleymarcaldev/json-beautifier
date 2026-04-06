import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	// FREE: Formatar JSON
	const formatCmd = vscode.commands.registerCommand(
		'json-beautifier.format',
		() => processSelection(text => JSON.stringify(JSON.parse(text), null, 2))
	);

	// FREE: Minificar JSON
	const minifyCmd = vscode.commands.registerCommand(
		'json-beautifier.minify',
		() => processSelection(text => JSON.stringify(JSON.parse(text)))
	);

	// FREE: Validar JSON
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

	// PRO: Mostrar aviso ao tentar usar feature paga
	const proFeatures = ['sortKeys', 'toYaml', 'toCsv'];
	const proCmds = proFeatures.map(feat =>
		vscode.commands.registerCommand(`json-beautifier.${feat}`, () => {
			vscode.window.showWarningMessage(
				'⭐ Este recurso é exclusivo da versão Pro.',
				'Obter Pro'
			).then(action => {
				if (action === 'Obter Pro') {
					vscode.env.openExternal(vscode.Uri.parse('https://gumroad.com/l/json-beautifier-pro'));
				}
			});
		})
	);

	context.subscriptions.push(formatCmd, minifyCmd, validateCmd, ...proCmds);
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