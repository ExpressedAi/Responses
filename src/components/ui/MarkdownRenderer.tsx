"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Brain, Drama, Code2, AlertTriangle, Lightbulb, FileText } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

type AdmonitionType = 'inner-monologue' | 'stage-directions' | 'code-block' | 'note' | 'warning' | 'tip';

const AdmonitionBlock = ({ type, children }: { type: string; children: React.ReactNode }) => {
  const styles = {
    'inner-monologue': 'border-l-4 border-blue-300 bg-blue-50/50 text-blue-900 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-100',
    'stage-directions': 'border-l-4 border-purple-300 bg-purple-50/50 text-purple-900 dark:border-purple-400 dark:bg-purple-900/20 dark:text-purple-100',
    'code-block': 'border-l-4 border-green-300 bg-green-50/50 text-green-900 dark:border-green-400 dark:bg-green-900/20 dark:text-green-100',
    'note': 'border-l-4 border-gray-300 bg-gray-50/50 text-gray-900 dark:border-gray-400 dark:bg-gray-900/20 dark:text-gray-100',
    'warning': 'border-l-4 border-orange-300 bg-orange-50/50 text-orange-900 dark:border-orange-400 dark:bg-orange-900/20 dark:text-orange-100',
    'tip': 'border-l-4 border-emerald-300 bg-emerald-50/50 text-emerald-900 dark:border-emerald-400 dark:bg-emerald-900/20 dark:text-emerald-100'
  };

  const icons = {
    'inner-monologue': <Brain className="h-4 w-4" />,
    'stage-directions': <Drama className="h-4 w-4" />,
    'code-block': <Code2 className="h-4 w-4" />,
    'note': <FileText className="h-4 w-4" />,
    'warning': <AlertTriangle className="h-4 w-4" />,
    'tip': <Lightbulb className="h-4 w-4" />
  };

  const titles = {
    'inner-monologue': 'Inner Monologue',
    'stage-directions': 'Stage Directions',
    'code-block': 'Code',
    'note': 'Note',
    'warning': 'Warning',
    'tip': 'Tip'
  };

  return (
    <div className={`my-4 rounded-lg p-4 ${styles[type as AdmonitionType] || styles.note}`}>
      <div className="flex items-center gap-2 mb-2 font-medium text-sm">
        {icons[type as AdmonitionType] || icons.note}
        <span>{titles[type as AdmonitionType] || 'Note'}</span>
      </div>
      <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
};

const CodeBlock = ({ children, className, ...props }: any) => {
  const [copied, setCopied] = React.useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (language) {
    return (
      <div className="relative group">
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 z-10 p-2 rounded-md bg-gray-800/80 text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            background: '#1a1b26',
          }}
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
      {children}
    </code>
  );
};

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Process admonitions with proper parsing
  const processedContent = content
    // Handle multi-line admonitions with proper content capture
    .replace(/:::(inner-monologue|stage-directions|code-block|note|warning|tip)\n([\s\S]*?)\n:::/g, (match, type, innerContent) => {
      return `<div data-admonition="${type}">${innerContent.trim()}</div>`;
    })
    // Handle single-line admonitions
    .replace(/:::(inner-monologue|stage-directions|code-block|note|warning|tip)\s+(.+)/g, (match, type, innerContent) => {
      return `<div data-admonition="${type}">${innerContent.trim()}</div>`;
    });

  return (
    <div className={`prose prose-gray dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          div: ({ node, children, ...props }) => {
            const type = (props as any)['data-admonition'] as string;
            if (type) {
              return <AdmonitionBlock type={type}>{children}</AdmonitionBlock>;
            }
            return <div {...props}>{children}</div>;
          },
          code: CodeBlock,
          pre: ({ children }: any) => <div>{children}</div>,
          blockquote: ({ children, ...props }) => {
            // Check if this is a GitHub-style alert
            const childText = React.Children.toArray(children).join('');
            const alertMatch = childText.match(/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/);
            
            if (alertMatch) {
              const type = alertMatch[1].toLowerCase();
              const content = childText.replace(/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/, '');
              return <AdmonitionBlock type={type}>{content}</AdmonitionBlock>;
            }
            
            return (
              <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-600 dark:text-gray-400" {...props}>
                {children}
              </blockquote>
            );
          },
          h1: ({ children, ...props }) => (
            <h1 className="text-2xl font-bold mt-8 mb-4 text-foreground" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-lg font-medium mt-4 mb-2 text-foreground" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="mb-4 leading-7 text-foreground" {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 text-foreground" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground" {...props}>
              {children}
            </ol>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-foreground" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-foreground" {...props}>
              {children}
            </em>
          ),
          a: ({ children, href, ...props }) => (
            <a 
              href={href} 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline" 
              target="_blank" 
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}