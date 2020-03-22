interface Props {
  css: string;
  js: string;
  title: string;
  styles: string;
  body: string;
  csrf: string;
  reduxState: string;
  apolloState: string;
}

export default ({
  css,
  js,
  title,
  styles,
  body,
  csrf,
  reduxState,
  apolloState,
}: Props) => {
  const cssStr = css && `<link rel="stylesheet" href="${css}">`;
  const jsStr =
    js &&
    (process.env.NODE_ENV === 'production'
      ? `<script src="${js}" defer></script>`
      : `<script src="${js}" defer crossorigin></script>`);
  const csrfStr =
    csrf && `<script charSet="utf-8">window.__CSRF_TOKEN__ = ${csrf}</script>`;
  const reduxStr =
    reduxState &&
    `<script charSet="utf-8">window.__PRELOADED_STATE__ = ${reduxState}</script>`;
  const apolloStr =
    apolloState &&
    `<script charSet="utf-8">window.__APOLLO_STATE__ = ${apolloState}</script>`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta charSet='utf-8'>
        <title>${title || ''}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${styles || ''}
        ${cssStr || ''}
        ${jsStr || ''}
      </head>
      <body>
        <div id="root">${body || ''}</div>
        ${csrfStr || ''}
        ${reduxStr || ''}
        ${apolloStr || ''}
      </body>
    </html>
  `;
};
