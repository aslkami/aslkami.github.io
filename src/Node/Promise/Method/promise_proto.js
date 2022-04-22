import Promise from './promise';

class P extends Promise {
  catch(errCallback) {
    return this.then(null, errCallback);
  }

  finally(finalCallback) {
    return this.then(
      (data) => {
        return Promise.resolve(finalCallback()).then(() => data);
      },
      (err) => {
        return Promise.resolve(finalCallback()).then(() => {
          throw err;
        });
      },
    );
  }
}
