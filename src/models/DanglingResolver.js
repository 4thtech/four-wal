/**
 * Helper class to manage resolving fake-async requests using browser messaging
 */
export default class DanglingResolver {
  constructor(_id, _resolve, _reject) {
    this.id = _id;
    this.resolve = _resolve;
    this.reject = _reject;
  }
}
