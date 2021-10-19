import { GetServerSidePropsContext, NextPageContext } from 'next';

const NEXT_INTERNAL_URL = '/_next/data/';

export function isNextJSRouteChange(ctx: NextPageContext | GetServerSidePropsContext): boolean {
  const url = 'pathname' in ctx ? ctx.pathname : ctx.resolvedUrl;

  const response = ctx.req?.url?.startsWith(NEXT_INTERNAL_URL) && ctx.req?.url !== url;

  return !!response;
}
