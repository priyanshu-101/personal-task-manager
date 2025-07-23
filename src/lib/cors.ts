import { NextResponse } from 'next/server';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://192.168.19.169:3001',
  'https://personal-task-manager-b5aw.vercel.app',
  // Add other domains you want to allow
];

export function corsHeaders(origin?: string) {
  const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };
}

export function handleCors(response: NextResponse, origin?: string) {
  const headers = corsHeaders(origin);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export function createCorsResponse(data?: unknown, status = 200, origin?: string) {
  const response = NextResponse.json(data, { status });
  return handleCors(response, origin);
}

export function optionsResponse(origin?: string) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}
