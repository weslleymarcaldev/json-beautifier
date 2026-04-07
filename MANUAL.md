# Manual Completo - JSON Beautifier & Converter

## 1. O que este plugin faz

O **JSON Beautifier & Converter** e uma extensao para VS Code focada em produtividade ao trabalhar com JSON.

Ele oferece 3 funcoes principais:

- Formatar JSON (pretty print com indentacao de 2 espacos)
- Minificar JSON (remove espacos e quebras de linha)
- Converter JSON para YAML (conversao simples, sem dependencias externas)

## 2. Para que serve

Use este plugin quando voce precisar:

- Organizar JSON para leitura humana
- Reduzir JSON para envio em APIs ou armazenamento
- Migrar rapidamente conteudo JSON para um formato YAML basico

## 3. Requisitos

- VS Code **1.110.0** ou superior
- Um arquivo/texto JSON valido para os comandos funcionarem

## 4. Instalacao

### 4.1 Instalacao pelo Marketplace (recomendado)

1. Abra o VS Code.
2. Va em **Extensions** (`Ctrl+Shift+X`).
3. Pesquise por **json-beautifier** (publisher: `weslleymarcal`).
4. Clique em **Install**.

### 4.2 Instalacao local por codigo-fonte (desenvolvedores)

1. Clone ou baixe este projeto.
1. Abra a pasta no VS Code.
1. Rode no terminal:

```bash
npm install
npm run compile
```

1. Pressione `F5` para abrir uma janela de desenvolvimento da extensao (Extension Development Host).
1. Nessa nova janela, execute os comandos da extensao.

### 4.3 Instalacao por pacote VSIX (opcional)

Se quiser distribuir sem Marketplace:

1. Instale a ferramenta de empacotamento:

```bash
npm install -g @vscode/vsce
```

1. Gere o pacote:

```bash
vsce package
```

1. No VS Code, abra **Extensions** e use **Install from VSIX...**.

## 5. Como usar

O plugin funciona de duas formas:

- Com texto selecionado: altera somente a selecao
- Sem selecao: altera o conteudo inteiro do editor ativo

### 5.1 Via Command Palette

1. Abra o arquivo JSON.
2. (Opcional) Selecione apenas o trecho que deseja transformar.
3. Pressione `Ctrl+Shift+P`.
4. Execute um dos comandos:
   - `JSON: Format (Pretty Print)`
   - `JSON: Minify`
   - `JSON: Convert to YAML`

### 5.2 Atalho

- `Ctrl+Shift+F` (Windows/Linux) ou `Cmd+Shift+F` (macOS): executa `JSON: Format (Pretty Print)` no editor ativo.

> Observacao: esse atalho pode conflitar com atalhos padrao/usuarios. Se necessario, ajuste em **Keyboard Shortcuts**.

## 6. Comportamento dos comandos

### 6.1 JSON: Format (Pretty Print)

- Faz parse do JSON e reescreve com indentacao de 2 espacos.
- Mantem a estrutura dos dados (objetos/arrays/valores).

### 6.2 JSON: Minify

- Faz parse do JSON e remove espacos em branco desnecessarios.
- Retorna o JSON em uma linha (ou no formato minimo equivalente).

### 6.3 JSON: Convert to YAML

- Faz parse do JSON e converte para YAML simples.
- Nao usa biblioteca externa.
- Bom para casos basicos de objetos/arrays.

## 7. Mensagens e erros

- Sucesso: `JSON Beautifier: done!`
- Falha: `JSON invalido: ...`

Se houver erro, verifique:

- Virgulas sobrando
- Aspas ausentes em chaves de JSON
- Comentarios no JSON (JSON puro nao permite comentarios)

## 8. Limitacoes atuais

- Os comandos exigem JSON valido.
- A conversao para YAML e simples e pode nao cobrir todos os casos avancados de serializacao YAML.
- O plugin atua no editor ativo; nao faz processamento em lote de multiplos arquivos.

## 9. Exemplos rapidos

### 9.1 Formatar

Entrada:

```json
{"name":"Ana","age":27,"skills":["js","ts"]}
```

Saida:

```json
{
  "name": "Ana",
  "age": 27,
  "skills": [
    "js",
    "ts"
  ]
}
```

### 9.2 Minificar

Entrada:

```json
{
  "name": "Ana",
  "active": true
}
```

Saida:

```json
{"name":"Ana","active":true}
```

### 9.3 Converter para YAML

Entrada:

```json
{
  "name": "Ana",
  "skills": ["js", "ts"],
  "active": true
}
```

Saida esperada (YAML simples):

```yaml
name: Ana
skills:
  - js
  - ts
active: true
```

## 10. Desenvolvimento e manutencao

Comandos uteis do projeto:

```bash
npm run compile   # Compila TypeScript
npm run watch     # Compilacao em modo watch
npm run lint      # Executa lint
npm test          # Executa testes da extensao
```

Estrutura principal:

- `src/extension.ts`: comandos da extensao e logica de transformacao
- `package.json`: manifesto da extensao (comandos, atalhos, scripts)

## 11. FAQ rapido

**Posso usar em apenas parte do arquivo?**
Sim. Basta selecionar o trecho antes de executar o comando.

**Funciona com JSON invalido?**
Nao. Primeiro corrija o JSON.

**A conversao para YAML e completa?**
Ela cobre cenarios comuns, mas e uma conversao simples.

**Preciso instalar dependencias extras para usar no dia a dia?**
Nao. A extensao funciona sem dependencias de runtime externas.
