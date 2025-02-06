import { NextRequest } from 'next/server';

export type RouteContext<T = { [key: string]: string }> = {
  params: T;
};
