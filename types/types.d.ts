declare namespace NodeJS {
    interface ProcessEnv {
      RUNTIME_ENV?: 'node' | 'edge';
    }
  }