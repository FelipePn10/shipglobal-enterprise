// import { NextResponse } from 'next/server';
// import { logToMongo } from '../lib/mongo/logs';

// type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

// export async function auditMiddleware(
//   request: Request,
//   userId?: number
// ) {
//   try {
//     const clonedRequest = request.clone();
//     let params: unknown = undefined;

//     if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
//       try {
//         params = await clonedRequest.json();
//       } catch (error) {
//         console.error('Failed to parse request body:', error);
//       }
//     }

//     await logToMongo({
//       level: 'info',
//       message: `API Request: ${request.method} ${request.url}`,
//       context: {
//         userId,
//         route: request.url,
//         method: request.method as HttpMethod,
//         params: typeof params === 'object' && params !== null ? params as Record<string, string | number | boolean | null> : undefined
//       }
//     });
//   } catch (error) {
//     console.error('Audit logging failed:', error);
//   }
  
//   return NextResponse.next();
// }