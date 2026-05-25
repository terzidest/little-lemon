// export {} makes this a module so the declare module below augments
// firebase/auth rather than replacing it as an ambient module.
// getReactNativePersistence ships in the React Native firebase/auth bundle
// but is absent from the standard TypeScript declarations.
export {};

declare module 'firebase/auth' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function getReactNativePersistence(storage: any): any;
}
