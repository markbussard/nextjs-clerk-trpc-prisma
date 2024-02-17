export * from '@clerk/nextjs';

declare global {
  /**
   * If you want to provide custom types for the getAuth().sessionClaims object,
   * simply redeclare this interface in the global namespace and provide your own custom keys.
   */
  export interface CustomJwtSessionClaims {
    primaryEmail: string;
  }
}
