const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript', ts: 'typescript', jsx: 'jsx', tsx: 'tsx',
  json: 'json', xml: 'xml', html: 'html', css: 'css',
  py: 'python', java: 'java', c: 'c', cpp: 'cpp',
  cs: 'csharp', php: 'php', rb: 'ruby', go: 'go',
  rs: 'rust', swift: 'swift', kt: 'kotlin', sql: 'sql',
  yaml: 'yaml', yml: 'yaml', md: 'markdown', sh: 'bash',
  bash: 'bash', zsh: 'bash', ps1: 'powershell',
};

export function getLanguageFromExtension(ext: string): string | null {
  return EXTENSION_LANGUAGE_MAP[ext.toLowerCase()] ?? null;
}

function addLineNumbers(html: string, lineCount: number, isDark: boolean): string {
  const gutterBg = isDark ? '#181825' : '#f1f5f9';
  const gutterColor = isDark ? '#6c7086' : '#94a3b8';
  const lineNums = Array.from({ length: lineCount }, (_, i) =>
    `<span class="ln" style="color:${gutterColor};user-select:none;display:block;line-height:1.6;text-align:right;padding-right:12px;font-size:12px">${i + 1}</span>`
  ).join('');

  return html.replace(
    '<body>',
    `<body><div class="gutter" style="position:absolute;left:0;top:0;bottom:0;width:48px;background:${gutterBg};border-right:1px solid ${isDark ? '#313244' : '#e2e8f0'};overflow:hidden;padding-top:20px;z-index:1">${lineNums}</div><div class="content" style="padding-left:60px">`
  ).replace('</body>', '</div></body>');
}

function wrapWithDocument(html: string, isDark: boolean, wordWrap: boolean): string {
  const bg = isDark ? '#1e1e2e' : '#fafafa';
  const text = isDark ? '#cdd6f4' : '#1e1e2e';
  const whiteSpace = wordWrap ? 'pre-wrap' : 'pre';
  const overflowX = wordWrap ? 'visible' : 'auto';
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0;box-sizing:border-box}body{background:${bg};color:${text};font-family:'Cascadia Code','Fira Code','JetBrains Mono',monospace;font-size:14px;line-height:1.6;padding:20px;padding-left:68px;white-space:${whiteSpace};word-wrap:${wordWrap ? 'break-word' : 'normal'};overflow-x:${overflowX};position:relative}pre{margin:0}.kw{color:${isDark ? '#cba6f7' : '#7c3aed'};font-weight:600}.str{color:${isDark ? '#a6e3a1' : '#059669'}}.cmt{color:${isDark ? '#6c7086' : '#94a3b8'};font-style:italic}.num{color:${isDark ? '#fab387' : '#d97706'}}.fn{color:${isDark ? '#89b4fa' : '#2563eb'}}.op{color:${isDark ? '#89dceb' : '#0891b2'}}.type{color:${isDark ? '#f9e2af' : '#b45309'}}</style></head><body><pre>${html}</pre></body></html>`;
}

export function getHighlightedHtml(code: string, language: string, isDark: boolean, options?: { wordWrap?: boolean; showLineNumbers?: boolean }): string {
  const wordWrap = options?.wordWrap ?? true;
  const showLineNumbers = options?.showLineNumbers ?? false;

  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const keywords = /\b(function|const|let|var|if|else|for|while|do|return|import|export|from|class|interface|type|extends|implements|new|try|catch|finally|throw|async|await|switch|case|default|break|continue|def|int|float|bool|true|false|null|undefined|void|self|struct|enum|pub|fn|mut|impl|trait|use|mod|crate|super|where|async|move|ref|match|loop|for|in|as|typeof|instanceof|yield|delete|in|of|static|final|abstract|synchronized|native|volatile|transient|assert|package|import|throws|extends|implements|this|super|new|return|if|else|switch|case|default|break|continue|throw|try|catch|finally|do|while|for|class|interface|enum|struct|union|typedef|sizeof|goto|extern|register|auto|signed|unsigned|long|short|char|double|float|int|void|const|static|volatile|restrict|inline|_Bool|_Complex|_Imaginary|complex|imaginary|generic|noreturn|static_assert|thread_local|alignas|alignof|atomic|noreturn|nullptr|static_assert|thread_local|concept|requires|co_await|co_return|co_yield|consteval|constexpr|constinit|co_await|co_return|co_yield)$/g;

  const highlighted = escaped
    .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g,
      `<span class="str">$1</span>`)
    .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$|--.*$)/gm,
      `<span class="cmt">$1</span>`)
    .replace(/\b(\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g,
      `<span class="num">$1</span>`)
    .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g,
      `<span class="fn">$1</span>`)
    .replace(keywords,
      `<span class="kw">$&</span>`);

  const lineCount = code.split('\n').length;
  let result = wrapWithDocument(highlighted, isDark, wordWrap);

  if (showLineNumbers) {
    result = addLineNumbers(result, lineCount, isDark);
  }

  return result;
}

export function getPlainTextHtml(text: string, isDark: boolean, options?: { wordWrap?: boolean; showLineNumbers?: boolean }): string {
  const wordWrap = options?.wordWrap ?? true;
  const showLineNumbers = options?.showLineNumbers ?? false;
  const bg = isDark ? '#1c1c1e' : '#ffffff';
  const textColor = isDark ? '#f5f5f7' : '#1c1c1e';
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const whiteSpace = wordWrap ? 'pre-wrap' : 'pre';
  const overflowX = wordWrap ? 'visible' : 'auto';
  let html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0;box-sizing:border-box}body{background:${bg};color:${textColor};font-family:-apple-system,system-ui,sans-serif;font-size:16px;line-height:1.6;padding:20px;padding-left:68px;white-space:${whiteSpace};word-wrap:${wordWrap ? 'break-word' : 'normal'};overflow-x:${overflowX};position:relative}</style></head><body><pre>${escaped}</pre></body></html>`;

  if (showLineNumbers) {
    const lineCount = text.split('\n').length;
    html = addLineNumbers(html, lineCount, isDark);
  }

  return html;
}

export function getMarkdownHtml(md: string, isDark: boolean, options?: { wordWrap?: boolean; showLineNumbers?: boolean }): string {
  const wordWrap = options?.wordWrap ?? true;
  const bg = isDark ? '#1c1c1e' : '#ffffff';
  const text = isDark ? '#f5f5f7' : '#1c1c1e';

  const lines = md.split('\n');
  let inCodeBlock = false;
  const processed = lines.map((line) => {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return inCodeBlock ? '<pre><code>' : '</code></pre>';
    }
    if (inCodeBlock) return line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:' + (isDark ? '#2c2c2e' : '#f0f0f0') + ';padding:2px 6px;border-radius:4px;font-size:0.9em">$1</code>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^\[(.+)\]\((.+)\)$/gm, '<a href="$2" style="color:#0a84ff">$1</a>');
  }).join('\n');

  const wrapped = processed.replace(/(<li>[\s\S]*?<\/li>)/gs, (match) => {
    if (!match.startsWith('<ul>')) return `<ul>${match}</ul>`;
    return match;
  });

  const whiteSpace = wordWrap ? 'pre-wrap' : 'pre';
  const overflowX = wordWrap ? 'visible' : 'auto';

  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0;box-sizing:border-box}body{background:${bg};color:${text};font-family:Georgia,serif;font-size:18px;line-height:1.8;padding:24px;padding-left:72px;max-width:700px;margin:0 auto;white-space:${whiteSpace};word-wrap:${wordWrap ? 'break-word' : 'normal'};overflow-x:${overflowX};position:relative}h1,h2,h3{margin:20px 0 10px}h1{font-size:32px}h2{font-size:26px}h3{font-size:22px}p,li{margin:8px 0}ul{padding-left:24px}code{font-family:monospace;font-size:0.9em}pre{background:${isDark ? '#2c2c2e' : '#f0f0f0'};padding:16px;border-radius:8px;overflow-x:auto;font-size:14px;line-height:1.4}pre code{background:transparent;padding:0}</style></head><body>${wrapped}</body></html>`;
}
