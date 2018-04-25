class JustNotification {
  constructor(options) {
    this._swRegistration = null;
    this.serverPublicKey = options.serverPublicKey;
    this.serverUrl = options.serverUrl;
    this.serviceWorkerJS = options.serviceWorkerJS;
  }

  checkAvailability() {
    return new Promise((resolve, reject) => {
      if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
        return resolve();
      }
      return reject('Feature not supported in this browser.');
    });
  }

  isSubscribed() {
    return new Promise((resolve, reject) => {
      this._getServiceWorkerRegistration().then(swRegistration => {
        swRegistration.pushManager.getSubscription().then(function(subscription) {
          resolve(subscription !== null);
        }, reject);
      }, reject);
    });
  }

  subscribeUser() {
    return new Promise((resolve, reject) => {
      this.checkAvailability().then(() => {
        this.isSubscribed().then(isSubscribed => {
          if (isSubscribed) {
            return resolve();
          }

          const applicationServerKey = this._urlB64ToUint8Array(this.serverPublicKey);

          this._getServiceWorkerRegistration().then(swRegistration => {
            swRegistration.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
              })
              .then(subscription => {
                this._updateSubscriptionOnServer(subscription).then(resolve, reject);
              })
              .catch(error => {
                if (Notification.permission === 'denied') {
                  return reject('Permission for notifications was denied');
                } else {
                  return reject('Failed to subscribe the user: ', error);
                }
              });
          });
        });
      }, reject);
    });
  }

  unsubscribeUser() {
    return new Promise((resolve, reject) => {
      this._getServiceWorkerRegistration().then(swRegistration => {
        if (!swRegistration.pushManager) {
          return reject('Feature not supported in this browser.');
        }

        swRegistration.pushManager
          .getSubscription()
          .then(subscription => {
            if (subscription) {
              return subscription.unsubscribe();
            }
          })
          .catch(error => {
            return reject('Error unsubscribing', error);
          })
          .then(() => {
            this._updateSubscriptionOnServer(null).then(resolve);
          });
      }, reject);
    });
  }

  _getServiceWorkerRegistration() {
    return new Promise((resolve, reject) => {
      if (this._swRegistration) {
        return resolve(this._swRegistration);
      }
      this._registerServiceWorker().then(resolve, reject);
    });
  }

  _registerServiceWorker() {
    return new Promise((resolve, reject) => {
      navigator.serviceWorker.register(this.serviceWorkerJS).then(swReg => {
        this._swRegistration = swReg;
        return resolve(swReg);
      }, reject);
    });
  }

  _updateSubscriptionOnServer(subscription) {
    return new Promise((resolve, reject) => {
      if (subscription) {
        return $.ajax({
          type: 'POST',
          url: this.serverUrl,
          data: JSON.stringify(subscription),
          contentType: 'application/text; charset=utf-8',
          dataType: 'text',
          success: resolve,
          failure: reject
        });
      } else {
        resolve();
      }
    });
  }

  _urlB64ToUint8Array(base64String) {
    let padding = '='.repeat((4 - base64String.length % 4) % 4);
    let base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    let rawData = window.atob(base64);
    let outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
