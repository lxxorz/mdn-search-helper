export class Store{
  constructor(storage) {
    this.storage = storage;
  }
  getItem(key) {
    return storage.get(key);
  }
  setItem(key, value) {
    return this.storage.set(key, value);
  }
}