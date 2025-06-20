import React, { FC, lazy, Suspense, useMemo } from 'react';

import { Copy, CopyCheck, ExternalLink } from 'lucide-react';
import { Components, Options } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card.tsx';
import { VinesHighlighter } from '@/components/ui/highlighter';
import { FALLBACK_LANG } from '@/components/ui/highlighter/useHighlight.ts';
import { isSingleLine } from '@/components/ui/highlighter/utils.ts';
import { Label } from '@/components/ui/label.tsx';
import { IVinesMarkdownProps } from '@/components/ui/markdown/index.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useCopy } from '@/hooks/use-copy.ts';
import { cn } from '@/utils';

const MemoizedReactMarkdownCore = lazy(() => import('./memoized-lazy.tsx'));

const MemoizedReactMarkdown: FC<Options> = (props) => {
  return (
    <Suspense fallback={<Skeleton className="size-full min-h-12" />}>
      <MemoizedReactMarkdownCore {...props} />
    </Suspense>
  );
};

const VinesMarkdown: React.FC<IVinesMarkdownProps> = ({ allowHtml, className, children }) => {
  const components: Components = useMemo(
    () => ({
      a: ({ href, children }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              className="inline-flex items-center gap-0.5 align-sub underline hover:decoration-2 [&>*]:cursor-pointer"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={14} className="-mb-1 ml-0.5" />
              <Label>{children}</Label>
            </a>
          </TooltipTrigger>
          <TooltipContent align="start">点击将跳转到外部网站，请注意安全</TooltipContent>
        </Tooltip>
      ),
      img: ({ src, alt }) => (
        <Avatar className="size-auto max-w-full select-none rounded">
          <AvatarImage className="aspect-auto w-auto rounded" src={src} alt={alt} />
          <AvatarFallback className="rounded-none p-2 text-xs">{alt}</AvatarFallback>
        </Avatar>
      ),
      pre: (props: any) => {
        const codeProps = props?.children?.props;
        const language = codeProps?.className?.replace('language-', '') || FALLBACK_LANG;
        const codeChild = codeProps?.children;

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { copy, copied } = useCopy();

        const code = (Array.isArray(codeChild) ? (codeChild[0] as string) : codeChild)?.trim() ?? '';
        const showLanguage = !isSingleLine(code) && language;

        return (
          <Card className="group/codeblock relative my-2 px-3">
            <VinesHighlighter className="px-2 [&>pre]:my-2 [&>pre]:text-start [&_*]:!text-sm" language={language}>
              {code}
            </VinesHighlighter>
            <Button
              icon={copied ? <CopyCheck /> : <Copy />}
              variant="outline"
              size="small"
              className="absolute right-1 top-1 !p-1 opacity-0 group-hover/codeblock:opacity-75 [&_svg]:!size-3"
              onClick={() => copy(code)}
            />
            {showLanguage && (
              <Label className="pointer-events-none absolute bottom-2 right-2 text-xs opacity-0 transition-opacity group-hover/codeblock:opacity-70">
                {language}
              </Label>
            )}
          </Card>
        );
      },
    }),
    [],
  );

  const rehypePlugins = useMemo(() => [allowHtml && rehypeRaw, rehypeKatex].filter(Boolean) as any, [allowHtml]);
  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath, remarkBreaks], []);

  return (
    <MemoizedReactMarkdown
      className={cn(
        'prose prose-sm dark:prose-invert prose-h1:text-sm prose-h2:text-sm prose-h3:text-sm prose-h4:text-sm prose-p:leading-relaxed prose-pre:p-0 break-words',
        className,
      )}
      components={components}
      rehypePlugins={rehypePlugins}
      remarkPlugins={remarkPlugins}
    >
      {children}
    </MemoizedReactMarkdown>
  );
};

export default VinesMarkdown;
