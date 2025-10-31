import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('q-commit.generate', async () => {
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

    const repo = git.repositories[0];
    
    if (repo.state.indexChanges.length === 0) {
      vscode.window.showWarningMessage('No staged changes');
      return;
    }

    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'Generating commit message...',
      cancellable: false
    }, async () => {
      try {
        const { stdout: diff } = await execAsync('git diff --cached', { 
          cwd: repo.rootUri.fsPath 
        });

        const prompt = `Generate a concise git commit message for these changes. Return ONLY the commit message:\n\n${diff}`;
        const { stdout } = await execAsync(`q chat "${prompt.replace(/"/g, '\\"')}"`, { 
          cwd: repo.rootUri.fsPath 
        });

        repo.inputBox.value = stdout.trim();
        vscode.window.showInformationMessage('Commit message generated!');
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
