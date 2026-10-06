import React, { useEffect, useRef } from 'react';

interface AdsterraSlotProps {
  htmlCode: string;
  enabled: boolean;
  className?: string;
  isGlobalScript?: boolean;
}

/**
 * 100% Real Adsterra Execution Engine:
 * Supports both synchronous `atOptions` + `invoke.js` (which use `document.write` inside an isolated iframe)
 * AND asynchronous Native Banner (`container-...`), Social Bar, and Popunder scripts injected into the live DOM.
 */
export const AdsterraSlot: React.FC<AdsterraSlotProps> = React.memo(
  ({ htmlCode, enabled, className = '', isGlobalScript = false }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      container.innerHTML = '';

      const trimmed = (htmlCode || '').trim();
      if (!enabled || !trimmed) {
        return;
      }

      // Case 1: Adsterra Standard Banner using `atOptions` (requires isolated document context for document.write)
      const usesAtOptions = /atOptions/i.test(trimmed);

      if (usesAtOptions && !isGlobalScript) {
        const widthMatch = trimmed.match(/['"]?width['"]?\s*:\s*(\d+)/i);
        const heightMatch = trimmed.match(/['"]?height['"]?\s*:\s*(\d+)/i);
        const adWidth = widthMatch ? parseInt(widthMatch[1], 10) : 728;
        const adHeight = heightMatch ? parseInt(heightMatch[1], 10) : 90;

        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = `${adHeight + 12}px`;
        iframe.style.maxWidth = `${adWidth + 16}px`;
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.style.background = 'transparent';
        iframe.scrolling = 'no';
        iframe.setAttribute('title', 'Sponsor Advertisement');

        container.appendChild(iframe);

        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
  </style>
</head>
<body>
  ${trimmed}
</body>
</html>`);
          iframeDoc.close();
        }
        return;
      }

      // Case 2: Async Native Banner (<div id="container-..."> + invoke.js), Social Bar, or Popunder Script
      try {
        const range = document.createRange();
        range.selectNode(container);
        const fragment = range.createContextualFragment(trimmed);
        container.appendChild(fragment);
      } catch (_err) {
        const temp = document.createElement('div');
        temp.innerHTML = trimmed;
        Array.from(temp.childNodes).forEach((node) => {
          if (node.nodeName.toLowerCase() === 'script') {
            const oldScript = node as HTMLScriptElement;
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach((attr) => {
              newScript.setAttribute(attr.name, attr.value);
            });
            if (oldScript.textContent) {
              newScript.textContent = oldScript.textContent;
            }
            container.appendChild(newScript);
          } else {
            container.appendChild(node.cloneNode(true));
          }
        });
      }
    }, [htmlCode, enabled, isGlobalScript]);

    if (!enabled || !htmlCode || !htmlCode.trim()) return null;

    return (
      <div
        ref={containerRef}
        className={`w-full overflow-hidden flex items-center justify-center ${className}`}
      />
    );
  }
);
