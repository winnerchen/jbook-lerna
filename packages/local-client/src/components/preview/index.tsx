import './preview.css';
import { useRef, useEffect } from 'react';

interface PreviewProps {
  code: string;
  err: Error | undefined;
}

const html = `
    <html >
      <head>
        <style>html {background-color: white}</style>
      </head>
      <body>
        <div id="root"></div>
        <script>
        const handleError = (err) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
          console.error(err);
        };

        window.addEventListener('error', (event) => {
          event.preventDefault();
          handleError(event.error);
        });
        window.addEventListener('message', (event) => {
          if (event.data.err) {
            handleError(event.data.err);
            return;
          }
          try {
            // clear the iframe error message if there is any
            const root = document.querySelector('#root');
            // root.innerHTML = '';
            eval(event.data.code);
          } catch (err) {
            handleError(err);
          }
        }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    //iframe.current.contentWindow.postMessage({ code, err }, '*');
    setTimeout(() => {
      iframe.current.contentWindow.postMessage({ code, err }, '*');
    }, 100);
  }, [code, err]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
        width="100%"
      />
    </div>
  );
};

export default Preview;
