import { NextResponse } from 'next/server';
import { logToMongo } from '../lib/mongo/logs';

export async function auditMiddleware(
  request: Request,
  userId?: number
) {
  try {
    await logToMongo({
      level: 'info',
      message: `API Request: ${request.method} ${request.url}`,
      context: {
        userId,
        route: request.url,
        method: request.method,
        params: request.body ? await request.json() : undefined
      }
    });
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
  
  return NextResponse.next();
}