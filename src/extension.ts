import * as vscode from 'vscode';
import { exec, ChildProcess } from 'child_process';
import { promisify } from 'util';
import { stripAnsi, extractCommitMessage } from './utils';

const execAsync = promisify(exec);
let outputChannel: vscode.OutputChannel;
let currentProcess: ChildProcess | null = null;

function getConfig() {
  const config = vscode.workspace.getConfiguration('q-commit');
  return {
    model: config.get<string>('model', 'claude-haiku-4.5'),
    showOutput: config.get<boolean>('showOutput', false),
    prompt: config.get<string>(
      'prompt',
      'Run git diff --cached and reply with ONLY a conventional commit message wrapped in <commit></commit> tags. Example: <commit>feat: add login</commit>'
    ),
  };
}

async function checkCliInstalled(): Promise<boolean> {
  try {
    await execAsync('kiro-cli --version');
    return true;
  } catch {
    return false;
  }
}

async function generateCommitMessage(
  repoPath: string,
  token: vscode.CancellationToken
): Promise<string> {
  const { model, prompt } = getConfig();

  return new Promise((resolve, reject) => {
    const cmd = `kiro-cli chat --no-interactive --model ${model} --trust-tools=execute_bash "${prompt.replace(/"/g, '\\"')}"`;

    currentProcess = exec(
      cmd,
      { cwd: repoPath, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        currentProcess = null;

        if (token.isCancellationRequested) {
          reject(new Error('Cancelled'));
          return;
        }

        if (error) {
          reject(error);
          return;
        }

        if (stderr) outputChannel.appendLine('[STDERR] ' + stripAnsi(stderr));
        outputChannel.appendLine('[STDOUT] ' + stripAnsi(stdout));

        const message = extractCommitMessage(stdout);
        if (!message) {
          reject(new Error('Could not extract commit message from output'));
          return;
        }

        outputChannel.appendLine(`[INFO] Extracted: "${message}"`);
        resolve(message);
      }
    );

    token.onCancellationRequested(() => {
      if (currentProcess) {
        currentProcess.kill();
        currentProcess = null;
      }
    });
  });
}

async function handleGenerateCommand() {
  if (currentProcess) {
    vscode.window.showWarningMessage('Already generating a commit message...');
    return;
  }

  const { showOutput } = getConfig();
  outputChannel.clear();
  if (showOutput) outputChannel.show();

  if (!(await checkCliInstalled())) {
    vscode.window.showErrorMessage('Kiro CLI not found. Please install it first: https://kiro.dev');
    return;
  }

  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (!gitExtension) {
    vscode.window.showErrorMessage('Git extension not found');
    return;
  }

  const git = gitExtension.exports.getAPI(1);
  if (git.repositories.length === 0) {
    vscode.window.showErrorMessage('No git repository found');
    return;
  }

  let repo = git.repositories[0];
  if (git.repositories.length > 1) {
    type RepoItem = vscode.QuickPickItem & { repo: typeof repo };
    const items: RepoItem[] = git.repositories.map((r: { rootUri: vscode.Uri }) => ({
      label: r.rootUri.fsPath.split('/').pop() || '',
      description: r.rootUri.fsPath,
      repo: r,
    }));
    const selected = await vscode.window.showQuickPick(items, { placeHolder: 'Select repository' });
    if (!selected) return;
    repo = selected.repo;
  }

  if (repo.state.indexChanges.length === 0) {
    vscode.window.showWarningMessage('No staged changes');
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Generating commit message...',
      cancellable: true,
    },
    async (_, token) => {
      try {
        const message = await generateCommitMessage(repo.rootUri.fsPath, token);
        repo.inputBox.value = message;
        vscode.window.showInformationMessage('Commit message generated!');
      } catch (error) {
        if (error instanceof Error && error.message === 'Cancelled') return;
        const msg = error instanceof Error ? error.message : 'Unknown error';
        outputChannel.appendLine('[ERROR] ' + msg);
        outputChannel.show();
        vscode.window.showErrorMessage(`Error: ${msg}`);
      }
    }
  );
}

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel('Q Commit');
  context.subscriptions.push(
    vscode.commands.registerCommand('q-commit.generate', handleGenerateCommand),
    outputChannel
  );
}

export function deactivate() {
  if (currentProcess) currentProcess.kill();
  outputChannel?.dispose();
}
