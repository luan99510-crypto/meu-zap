import helmet from 'helmet';

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'"], // evitar inline em produção
      "style-src": ["'self'", "'unsafe-inline'"], // remover unsafe-inline após mover CSS para arquivos
      "img-src": ["'self'", "data:"],
      "connect-src": ["'self'", "wss:"],
      "frame-ancestors": ["'none'"],
      "base-uri": ["'self'"],
    },
  },
  referrerPolicy: { policy: 'no-referrer' },
  xContentTypeOptions: true,
  xXssProtection: true,
  xFrameOptions: 'DENY',
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});
