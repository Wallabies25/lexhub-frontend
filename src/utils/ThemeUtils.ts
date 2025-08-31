import { useEffect } from 'react';

/**
 * A hook that can be used inside modal components to ensure they inherit the current theme
 * Particularly useful for modals that are portaled outside of the main React tree
 */
export const useModalTheme = (modalRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (modalRef.current) {
      const isDarkMode = document.documentElement.classList.contains('dark');
      if (isDarkMode) {
        modalRef.current.classList.add('dark');
        modalRef.current.classList.remove('light');
      } else {
        modalRef.current.classList.remove('dark');
        modalRef.current.classList.add('light');
      }
    }
  }, [modalRef]);
};

/**
 * A function to apply the current theme to a modal or dialog element
 * Can be used in vanilla JS contexts where hooks aren't available
 */
export const applyThemeToModal = (element: HTMLElement | null) => {
  if (!element) return;
  
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  if (isDarkMode) {
    element.classList.add('dark');
    element.classList.remove('light');
  } else {
    element.classList.remove('dark');
    element.classList.add('light');
  }
};

// Apply dark mode to specific elements that might not get Tailwind classes
export const applyDarkModeToElements = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  // Apply to all modal dialogs, popups, and dropdown menus
  const modals = document.querySelectorAll('.modal, [role="dialog"], .dialog, .popup, .dropdown, .menu, .popover, .tooltip');
  modals.forEach(modal => {
    if (isDarkMode) {
      modal.classList.add('dark-mode');
      modal.classList.add('bg-gray-800');
      modal.classList.add('text-white');
    } else {
      modal.classList.remove('dark-mode');
      modal.classList.remove('bg-gray-800');
      modal.classList.remove('text-white');
    }
  });
  
  // Apply to iframes
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        if (isDarkMode) {
          iframeDoc.documentElement.classList.add('dark');
        } else {
          iframeDoc.documentElement.classList.remove('dark');
        }
      }
    } catch (e) {
      // Cross-origin iframes can't be accessed
      console.log('Could not access iframe content');
    }
  });
  
  // Apply to third-party widgets
  const widgets = document.querySelectorAll('[data-widget]');
  widgets.forEach(widget => {
    if (isDarkMode) {
      widget.setAttribute('data-theme', 'dark');
    } else {
      widget.setAttribute('data-theme', 'light');
    }
  });
  
  // Apply to tables that might not have Tailwind classes
  const tables = document.querySelectorAll('table:not([class*="dark:"])');
  tables.forEach(table => {
    if (isDarkMode) {
      table.classList.add('dark-table');
      (table as HTMLElement).style.backgroundColor = '#1f2937'; // gray-800
      (table as HTMLElement).style.color = '#f9fafb'; // gray-50
      
      // Process table headers
      const headers = table.querySelectorAll('th');
      headers.forEach(header => {
        (header as HTMLElement).style.backgroundColor = '#111827'; // gray-900
        (header as HTMLElement).style.color = '#e5e7eb'; // gray-200
        (header as HTMLElement).style.borderColor = '#374151'; // gray-700
      });
      
      // Process table rows
      const rows = table.querySelectorAll('tr');
      rows.forEach((row, index) => {
        if (index % 2 === 0) {
          (row as HTMLElement).style.backgroundColor = '#1f2937'; // gray-800
        } else {
          (row as HTMLElement).style.backgroundColor = '#374151'; // gray-700
        }
        (row as HTMLElement).style.borderColor = '#4b5563'; // gray-600
      });
      
      // Process table cells
      const cells = table.querySelectorAll('td');
      cells.forEach(cell => {
        (cell as HTMLElement).style.borderColor = '#4b5563'; // gray-600
      });
    } else {
      table.classList.remove('dark-table');
      (table as HTMLElement).style.backgroundColor = '';
      (table as HTMLElement).style.color = '';
      
      const headers = table.querySelectorAll('th');
      headers.forEach(header => {
        (header as HTMLElement).style.backgroundColor = '';
        (header as HTMLElement).style.color = '';
        (header as HTMLElement).style.borderColor = '';
      });
      
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        (row as HTMLElement).style.backgroundColor = '';
        (row as HTMLElement).style.borderColor = '';
      });
      
      const cells = table.querySelectorAll('td');
      cells.forEach(cell => {
        (cell as HTMLElement).style.borderColor = '';
      });
    }
  });
  
  // Apply to cards that might not have proper Tailwind classes
  const cards = document.querySelectorAll('.card, .box, [role="region"]:not([class*="dark:"])');
  cards.forEach(card => {
    if (isDarkMode) {
      card.classList.add('dark-card');
      (card as HTMLElement).style.backgroundColor = '#1f2937'; // gray-800
      (card as HTMLElement).style.borderColor = '#374151'; // gray-700
      (card as HTMLElement).style.color = '#f9fafb'; // gray-50
    } else {
      card.classList.remove('dark-card');
      (card as HTMLElement).style.backgroundColor = '';
      (card as HTMLElement).style.borderColor = '';
      (card as HTMLElement).style.color = '';
    }
  });
  
  // Apply to any custom components
  const customComponents = document.querySelectorAll('.custom-component');
  customComponents.forEach(component => {
    if (isDarkMode) {
      component.classList.add('dark-theme');
    } else {
      component.classList.remove('dark-theme');
    }
  });
  
  // Apply to dynamically loaded content
  const dynamicContent = document.querySelectorAll('.dynamic-content, [data-dynamic="true"]');
  dynamicContent.forEach(content => {
    if (isDarkMode) {
      content.classList.add('dark-mode');
    } else {
      content.classList.remove('dark-mode');
    }
  });
  
  // Handle special cases for embedded content
  const embeds = document.querySelectorAll('embed, object, video, audio');
  embeds.forEach(embed => {
    if (isDarkMode) {
      embed.classList.add('dark-embedded');
      // Add a dark overlay for videos and other media that can't be styled directly
      if (!embed.nextElementSibling?.classList.contains('dark-overlay')) {
        const overlay = document.createElement('div');
        overlay.classList.add('dark-overlay');
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '1';
        if (embed.parentElement) {
          embed.parentElement.style.position = 'relative';
          embed.parentElement.appendChild(overlay);
        }
      }
    } else {
      embed.classList.remove('dark-embedded');
      // Remove dark overlay
      const overlay = embed.parentElement?.querySelector('.dark-overlay');
      if (overlay) {
        overlay.remove();
      }
    }
  });

  // Apply to code editors and blocks
  const codeBlocks = document.querySelectorAll('pre, code, .code-editor, [data-code-block], .editor-container');
  codeBlocks.forEach(block => {
    if (isDarkMode) {
      block.classList.add('dark-code');
      if (!block.classList.contains('hljs') && !block.classList.contains('prism')) {
        // Only apply direct styling if not using a syntax highlighter
        (block as HTMLElement).style.backgroundColor = '#1e293b'; // slate-800
        (block as HTMLElement).style.color = '#e2e8f0'; // slate-200
        (block as HTMLElement).style.borderColor = '#334155'; // slate-700
      }
    } else {
      block.classList.remove('dark-code');
      if (!block.classList.contains('hljs') && !block.classList.contains('prism')) {
        (block as HTMLElement).style.backgroundColor = '';
        (block as HTMLElement).style.color = '';
        (block as HTMLElement).style.borderColor = '';
      }
    }
  });

  // Apply to rich text editors (like TinyMCE, CKEditor, etc.)
  const richEditors = document.querySelectorAll('.rich-text-editor, .wysiwyg-editor, [contenteditable="true"]');
  richEditors.forEach(editor => {
    if (isDarkMode) {
      editor.classList.add('dark-editor');
      (editor as HTMLElement).style.backgroundColor = '#1f2937'; // gray-800
      (editor as HTMLElement).style.color = '#f9fafb'; // gray-50
      
      // Try to find the toolbar if it exists
      const toolbar = editor.closest('.editor-container')?.querySelector('.editor-toolbar, .toolbar');
      if (toolbar) {
        (toolbar as HTMLElement).style.backgroundColor = '#374151'; // gray-700
        (toolbar as HTMLElement).style.borderColor = '#4b5563'; // gray-600
      }
    } else {
      editor.classList.remove('dark-editor');
      (editor as HTMLElement).style.backgroundColor = '';
      (editor as HTMLElement).style.color = '';
      
      const toolbar = editor.closest('.editor-container')?.querySelector('.editor-toolbar, .toolbar');
      if (toolbar) {
        (toolbar as HTMLElement).style.backgroundColor = '';
        (toolbar as HTMLElement).style.borderColor = '';
      }
    }
  });

  // Apply to date pickers, calendars, and time selectors
  const datePickers = document.querySelectorAll('.date-picker, .calendar, .time-picker, [data-date-picker]');
  datePickers.forEach(picker => {
    if (isDarkMode) {
      picker.classList.add('dark-date-picker');
      (picker as HTMLElement).style.backgroundColor = '#1f2937'; // gray-800
      (picker as HTMLElement).style.color = '#f9fafb'; // gray-50
      (picker as HTMLElement).style.borderColor = '#374151'; // gray-700
      
      // Style calendar cells if they exist
      const cells = picker.querySelectorAll('.calendar-day, .day, [data-day]');
      cells.forEach(cell => {
        (cell as HTMLElement).style.backgroundColor = '#374151'; // gray-700
        (cell as HTMLElement).style.color = '#f9fafb'; // gray-50
        
        // If it's a selected day
        if (cell.classList.contains('selected') || cell.getAttribute('aria-selected') === 'true') {
          (cell as HTMLElement).style.backgroundColor = '#2563eb'; // blue-600
          (cell as HTMLElement).style.color = 'white';
        }
      });
    } else {
      picker.classList.remove('dark-date-picker');
      (picker as HTMLElement).style.backgroundColor = '';
      (picker as HTMLElement).style.color = '';
      (picker as HTMLElement).style.borderColor = '';
      
      const cells = picker.querySelectorAll('.calendar-day, .day, [data-day]');
      cells.forEach(cell => {
        (cell as HTMLElement).style.backgroundColor = '';
        (cell as HTMLElement).style.color = '';
      });
    }
  });
  
  // Apply to form elements with more specific styling
  const formElements = document.querySelectorAll('input[type="range"], input[type="color"], progress, meter');
  formElements.forEach(element => {
    if (isDarkMode) {
      element.classList.add('dark-form-control');
      
      if (element instanceof HTMLInputElement && element.type === 'range') {
        element.style.accentColor = '#3b82f6'; // blue-500
        element.style.backgroundColor = '#374151'; // gray-700
      } else if (element instanceof HTMLInputElement && element.type === 'color') {
        element.style.borderColor = '#4b5563'; // gray-600
      } else if (element instanceof HTMLProgressElement || element instanceof HTMLMeterElement) {
        element.style.accentColor = '#3b82f6'; // blue-500
        element.style.backgroundColor = '#374151'; // gray-700
      }
    } else {
      element.classList.remove('dark-form-control');
      
      if (element instanceof HTMLInputElement && 
          (element.type === 'range' || element.type === 'color')) {
        element.style.accentColor = '';
        element.style.backgroundColor = '';
        element.style.borderColor = '';
      } else if (element instanceof HTMLProgressElement || element instanceof HTMLMeterElement) {
        element.style.accentColor = '';
        element.style.backgroundColor = '';
      }
    }
  });
};

/**
 * Apply theme to external libraries and components that don't automatically inherit dark mode
 * @param theme The current theme ('light' or 'dark')
 */
export const applyThemeToExternalLibraries = (theme: 'light' | 'dark') => {
  // Libraries often expose theme options via data attributes or global variables
  
  // Chart.js
  const chartCanvases = document.querySelectorAll('canvas[data-chart-type]');
  chartCanvases.forEach(canvas => {
    canvas.setAttribute('data-theme', theme);
  });
  
  // CodeMirror editors
  const codeMirrors = document.querySelectorAll('.CodeMirror');
  codeMirrors.forEach(cm => {
    if (theme === 'dark') {
      cm.classList.add('cm-dark-theme');
    } else {
      cm.classList.remove('cm-dark-theme');
    }
  });
  
  // Any React/Monaco editor instances
  const monacoEditors = document.querySelectorAll('.monaco-editor, .monaco-editor-background');
  monacoEditors.forEach(editor => {
    if (theme === 'dark') {
      editor.classList.add('vs-dark');
      editor.classList.remove('vs');
    } else {
      editor.classList.add('vs');
      editor.classList.remove('vs-dark');
    }
  });
    // For embedded iframes with editors like JSFiddle, CodePen, etc.
  const editorIframes = document.querySelectorAll('iframe[data-editor="true"]');
  editorIframes.forEach(iframe => {
    try {
      const htmlIframe = iframe as HTMLIFrameElement;
      const iframeDocument = htmlIframe.contentDocument || htmlIframe.contentWindow?.document;
      if (iframeDocument) {
        if (theme === 'dark') {
          iframeDocument.body.classList.add('dark-theme');
          iframeDocument.body.classList.remove('light-theme');
        } else {
          iframeDocument.body.classList.add('light-theme');
          iframeDocument.body.classList.remove('dark-theme');
        }
      }
    } catch (e) {
      // Cross-origin iframes can't be accessed
      console.log('Could not access iframe content due to same-origin policy');
    }
  });
  
  // Syntax highlighter libraries
  const syntaxHighlighters = document.querySelectorAll('pre[class*="language-"], code[class*="language-"]');
  syntaxHighlighters.forEach(block => {
    if (theme === 'dark') {
      block.classList.add('prism-dark', 'hljs-dark');
      block.classList.remove('prism-light', 'hljs-light');
    } else {
      block.classList.add('prism-light', 'hljs-light');
      block.classList.remove('prism-dark', 'hljs-dark');
    }
  });
  
  // PDF viewers
  const pdfViewers = document.querySelectorAll('.pdf-viewer, [data-pdf-viewer]');
  pdfViewers.forEach(viewer => {
    viewer.setAttribute('data-theme', theme);
  });
};

// Listen for theme changes and apply styles
export const setupThemeChangeListener = () => {
  // Initial application
  applyDarkModeToElements();
  
  // Set up a mutation observer to watch for class changes on the html element
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        applyDarkModeToElements();
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  
  return () => observer.disconnect();
};

// Debug helper to check dark mode classes
export const checkDarkModeConsistency = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const issues: string[] = [];
  
  // Check various elements for proper dark mode classes
  const elementsToCheck = [
    { selector: 'body', darkClass: 'dark:bg-gray-900' },
    { selector: '.card, .container, .box', darkClass: 'dark:bg-gray-800' },
    { selector: 'input, textarea, select', darkClass: 'dark:bg-gray-800' },
    { selector: 'button', darkClass: 'transition-colors' },
    { selector: 'a', darkClass: 'transition-colors' },
  ];
  
  elementsToCheck.forEach(({ selector, darkClass }) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      const classes = element.className;
      if (!classes.includes(darkClass) && !classes.includes('dark:')) {
        issues.push(`Element ${selector} missing dark mode classes: ${element.outerHTML.slice(0, 100)}...`);
      }
    });
  });
  
  console.log('Dark mode active:', isDarkMode);
  if (issues.length > 0) {
    console.warn('Dark mode inconsistencies found:', issues);
  } else {
    console.log('Dark mode appears consistent across checked elements');
  }
  
  return { isDarkMode, issues };
};
