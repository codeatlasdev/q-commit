import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import { COMMIT_MESSAGE_PROMPT } from './prompts';
import { stripAnsi, extractCommitMessage } from './utils';

const execAsync = promisify(exec);
let outputChannel: vscode.OutputChannel;

async function generateCommitMessage(repoPath: string): Promise<string> {
  const { stdout, stderr } = await execAsync(
    `q chat --no-interactive --trust-tools=fs_read,execute_bash "${COMMIT_MESSAGE_PROMPT.replace(/"/g, '\\"')}"`,
    { cwd: repoPath, maxBuffer: 10 * 1024 * 1024 }
  );

  if (stderr) {
    outputChannel.appendLine('[STDERR] ' + stripAnsi(stderr));
  }

  outputChannel.appendLine('[STDOUT] Raw output:');
  outputChannel.appendLine(stripAnsi(stdout));

  const message = extractCommitMessage(stdout);
  
  if (!message) {
    throw new Error('Could not extract commit message from output');
  }

  outputChannel.appendLine(`[INFO] Extracted message: "${message}"`);
  return message;
}

async function handleGenerateCommand() {
  outputChannel.clear();
  outputChannel.show();
  outputChannel.appendLine('[Q Commit] Starting...');
  
  const gitExtension = vscode.extensions.getExtension('vscode.git');
  if (!gitExtension) {
    outputChannel.appendLine('[ERROR] Git extension not found');
    vscode.window.showErrorMessage('Git extension not found');
    return;
  }

  const git = gitExtension.exports.getAPI(1);
  
  if (git.repositories.length === 0) {
    outputChannel.appendLine('[ERROR] No git repository found');
    vscode.window.showErrorMessage('No git repository found');
    return;
  }

  const repo = git.repositories[0];
  outputChannel.appendLine(`[INFO] Repository: ${repo.rootUri.fsPath}`);
  
  if (repo.state.indexChanges.length === 0) {
    outputChannel.appendLine('[WARN] No staged changes');
    vscode.window.showWarningMessage('No staged changes');
    return;
  }

  outputChannel.appendLine(`[INFO] Staged changes: ${repo.state.indexChanges.length} files`);

  await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Generating commit message...',
    cancellable: false
  }, async () => {
    try {
      outputChannel.appendLine('[INFO] Executing Q CLI...');
      const message = await generateCommitMessage(repo.rootUri.fsPath);
      
      repo.inputBox.value = message;
      outputChannel.appendLine('[SUCCESS] Commit message generated!');
      vscode.window.showInformationMessage('Commit message generated!');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      outputChannel.appendLine('[ERROR] ' + errorMsg);
      if (error instanceof Error && error.stack) {
        outputChannel.appendLine('[STACK] ' + error.stack);
      }
      vscode.window.showErrorMessage(`Error: ${errorMsg}`);
    }
  });
}

export function activate(context: vscode.ExtensionContext) {
  outputChannel = vscode.window.createOutputChannel('Q Commit');
  
  const disposable = vscode.commands.registerCommand(
    'q-commit.generate',
    handleGenerateCommand
  );

  context.subscriptions.push(disposable, outputChannel);
}

export function deactivate() {
  if (outputChannel) {
    outputChannel.dispose();
  }
}
