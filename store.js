export class Store{

  constructor(storage) {
    this.storage = storage;
  }

  getItem(key) {
    return new Promise(resolve => {
      this.storage.get(key, (result) => {
        resolve(result[key]);
      })
    })
  }

  setItem(key, value) {
    return this.storage.set({[key]: value});
  }
}