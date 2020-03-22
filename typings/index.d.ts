declare module '*.svg' {
  const content: any;
  export default content;
}

declare module 'config' {
  const content: any;
  export default content;
}

declare module 'serialize-javascript' {
  const content: any;
  export default content;
}

declare module 'cleave.js/react' {
  const content: any;
  export default content;
}

declare module '@lifeomic/axios-fetch' {
  import { AxiosStatic } from 'axios';

  const content: {
    buildAxiosFetch: (axios: AxiosStatic) => GlobalFetch['fetch'];
  };
  export default content;
}
