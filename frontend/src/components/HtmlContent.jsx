import React, { useEffect, useRef } from 'react';

function executeScripts(element) {
  element.querySelectorAll('script').forEach((original) => {
    const script = document.createElement('script');

    script.textContent = original.textContent;

    Array.from(original.attributes).forEach((attribute) => {
      script.setAttribute(attribute.name, attribute.value);
    });

    original.replaceWith(script);
  });
}

export default function HtmlContent({ className = '', html }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      executeScripts(ref.current);
    }
  }, [html]);

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html || '' }}
    />
  );
}
