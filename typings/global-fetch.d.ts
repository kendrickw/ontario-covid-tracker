/**
 * Workaround for
 * ERROR in node_modules/apollo-link-http-common/lib/index.d.ts(38,13):
 *   TS2304: Cannot find name 'GlobalFetch'.
 * See: https://github.com/apollographql/apollo-link/issues/1131
 **/

declare type GlobalFetch = WindowOrWorkerGlobalScope;
