
/**
 * Encapsulates a single endpoint in your backend.
 */
export class Endpoint {
  path: string;
  verb: string;
  auth: string[];
  description: string;
  type: string;
  input: any;
}
  