/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SPARQL_ENDPOINT?: string;
    readonly VITE_THEME?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
