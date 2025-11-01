export function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

export function extractCommitMessage(output: string): string | null {
  const cleanOutput = stripAnsi(output);
  const commitMatch = cleanOutput.match(/<commit>(.*?)<\/commit>/s);

  if (commitMatch && commitMatch[1]) {
    return commitMatch[1].trim();
  }

  // Fallback: extract after last tool output
  const lines = cleanOutput.split('\n');
  let lastToolIndex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if (line.includes('🛠️') || line.includes('●') || line.includes('↳') || line.includes('>')) {
      lastToolIndex = i;
      break;
    }
  }

  const message = lines
    .slice(lastToolIndex + 1)
    .join('\n')
    .trim();
  return message || null;
}
