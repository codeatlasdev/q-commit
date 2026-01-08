export function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

export function extractCommitMessage(output: string): string | null {
  const match = stripAnsi(output).match(/<commit>(.*?)<\/commit>/s);
  return match?.[1]?.trim() || null;
}
