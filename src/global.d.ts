// declaring types for .env
declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string;
  }
}