import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; // 引入代码高亮样式（您可以选择其他主题样式）

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
    className="ml-8 mb-2 p-2 pr-3 pl-3 !border-white border-spacing-1 border-1 bg-[#151515] text-white-200 rounded-lg text-start"
      children={content}
      remarkPlugins={[remarkGfm]} // 支持 GitHub 风格的 Markdown
      rehypePlugins={[rehypeHighlight]} // 语法高亮
    />
  );
};

export default MarkdownRenderer;
