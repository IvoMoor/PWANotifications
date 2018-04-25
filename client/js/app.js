'use strict';

$(document).ready(() => {
  const $notifyButton = $('#btn-notify');
  const $pushButton = $('#btn-push');
  const $unsubscribeButton = $('#btn-unsubscribe');
  const $subscribeButton = $('#btn-subscribe');
  const $isSubscribedLabel = $('#lbl-issubscribed');

  let jbiNotification = new JustNotification({
    serverPublicKey: '',
    serverUrl: '',
    serviceWorkerJS: 'sw.js'
  });
  checkSubscription();

  $subscribeButton.on('click', () => {
    jbiNotification.subscribeUser().then(
      () => {
        checkSubscription();
        alert('Succesfully subscribed.');
      },
      error => {
        alert(error);
      }
    );
  });

  $unsubscribeButton.on('click', () => {
    jbiNotification.unsubscribeUser().then(
      () => {
        checkSubscription();
        alert('Succesfully unsubscribed.');
      },
      error => {
        alert(error);
      }
    );
  });

  function checkSubscription() {
    jbiNotification.isSubscribed().then(isSubscribed => {
      let isSubscribedText = isSubscribed ? 'Currently the user is subscribed.' : 'Currently the user is <bold>NOT</bold> subscribed.';
      $isSubscribedLabel.html(isSubscribedText);
    });
  }

  // const app = {
  //   isSubscribed: false,
  //   swRegistration: null;

  //   checkPrerequisites: () => {
  //     return new Promise((resolve, reject) => {
  //       if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
  //         console.info('Notification, service workers and push are supported!');
  //         return resolve();
  //       }
  //       return reject('Browser does not support notifications.');
  //     });
  //   },

  //   registerServiceWorker: () => {
  //     return navigator.serviceWorker.register('sw.js').then((swReg) => {

  //     })
  //   },

  // };

  // let isSubscribed = false;
  // let swRegistration = null;
  // const $notifyButton = $('#btn-notify');
  // const $pushButton = $('#btn-push');

  // app
  //   .checkPrerequisites()
  //   .then(app.registerServiceWorker)
  //   .then(function() {
  //     alert('done');
  //   });

  // let isSubscribed = false;
  // let swRegistration = null;

  // // DOM elements
  // var $messageLabel = $('#lbl-message');

  // // check if notification is supported
  // if (!('Notification' in window)) {
  //   showMessage('This browser does not support notifications!');
  //   return;
  // }

  // // add buttons and event handlers
  // const $notifyButton = $('#btn-notify');
  // $notifyButton.on('click', function() {
  //   //     displayNotification();
  //   alert('clicked on notify');
  // });

  // const $pushButton = $('#btn-push');
  // $pushButton.on('click', function() {
  //   alert('clicked on pusn');
  // });

  // function showMessage(message, color = 'red') {
  //   console.log('test');
  //   $messageLabel.html(message);
  //   $messageLabel.css({ color: color });
  // }
});

// var app = (function() {

//   var isSubscribed = false;
//   var swRegistration = null;

//   var notifyButton = document.querySelector('.js-notify-btn');
//   var pushButton = document.querySelector('.js-push-btn');

//   if (!('Notification' in window)) {
//     console.log('This browser does not support notifications!');
//     return;
//   }

//   Notification.requestPermission(function(status) {
//     console.log('Notification permission status:', status);
//   });

//   function displayNotification() {
//     if (Notification.permission == 'granted') {
//       navigator.serviceWorker.getRegistration().then(function(reg) {
//         var options = {
//           body: 'First notification!',
//           icon: 'images/notification-flat.png',
//           vibrate: [100, 50, 100],
//           data: {
//             dateOfArrival: Date.now(),
//             primaryKey: 1
//           },
//           actions: [
//             {
//               action: 'explore',
//               title: 'Go to the site',
//               icon: 'images/checkmark.png'
//             },
//             {
//               action: 'close',
//               title: 'Close the notification',
//               icon: 'images/xmark.png'
//             }
//           ]

//           // TODO 5.1 - add a tag to the notification
//         };
//         reg.showNotification('Hello world!', options);
//       });
//     }
//   }

//   function initializeUI() {
//     pushButton.addEventListener('click', function() {
//       pushButton.disabled = true;
//       if (isSubscribed) {
//         unsubscribeUser();
//       } else {
//         subscribeUser();
//       }
//     });

//     swRegistration.pushManager.getSubscription().then(function(subscription) {
//       isSubscribed = subscription !== null;

//       updateSubscriptionOnServer(subscription);

//       if (isSubscribed) {
//         console.log('User IS subscribed.');
//       } else {
//         console.log('User is NOT subscribed.');
//       }

//       updateBtn();
//     });
//   }

//   var applicationServerPublicKey = 'BIShs1Nszr58QucqJGCjQaRVVWikd-I3cf1bzu7ZG5ikpplZrQo67cp3NLlV8Pgkr6IHQ_zVGqdqoVnatpYXH0Q';

//   function subscribeUser() {
//     var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
//     swRegistration.pushManager
//       .subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: applicationServerKey
//       })
//       .then(function(subscription) {
//         console.log('User is subscribed:', subscription);

//         updateSubscriptionOnServer(subscription);

//         isSubscribed = true;

//         updateBtn();
//       })
//       .catch(function(err) {
//         if (Notification.permission === 'denied') {
//           console.warn('Permission for notifications was denied');
//         } else {
//           console.error('Failed to subscribe the user: ', err);
//         }
//         updateBtn();
//       });
//   }

//   function unsubscribeUser() {
//     swRegistration.pushManager
//       .getSubscription()
//       .then(function(subscription) {
//         if (subscription) {
//           return subscription.unsubscribe();
//         }
//       })
//       .catch(function(error) {
//         console.log('Error unsubscribing', error);
//       })
//       .then(function() {
//         updateSubscriptionOnServer(null);

//         console.log('User is unsubscribed');
//         isSubscribed = false;

//         updateBtn();
//       });
//   }

//   function updateSubscriptionOnServer(subscription) {
//     // Here's where you would send the subscription to the application server

//     var subscriptionJson = document.querySelector('.js-subscription-json');
//     var endpointURL = document.querySelector('.js-endpoint-url');
//     var subAndEndpoint = document.querySelector('.js-sub-endpoint');

//     if (subscription) {
//       var jsonSubscription = JSON.stringify(subscription);
//       subscriptionJson.textContent = jsonSubscription;
//       endpointURL.textContent = subscription.endpoint;
//       subAndEndpoint.style.display = 'block';

//       var xhr = new XMLHttpRequest();
//       xhr.open('POST', 'https://jbi-bid00.sabaas.nl:51038/subscribe', true);
//       xhr.setRequestHeader('Content-type', 'application/json');
//       xhr.onload = function() {
//         // do something to response
//         console.log(this.responseText);
//       };
//       xhr.send(jsonSubscription);
//     } else {
//       subAndEndpoint.style.display = 'none';
//     }
//   }

//   function updateBtn() {
//     if (Notification.permission === 'denied') {
//       pushButton.textContent = 'Push Messaging Blocked';
//       pushButton.disabled = true;
//       updateSubscriptionOnServer(null);
//       return;
//     }

//     if (isSubscribed) {
//       pushButton.textContent = 'Disable Push Messaging';
//     } else {
//       pushButton.textContent = 'Enable Push Messaging';
//     }

//     pushButton.disabled = false;
//   }

//   function urlB64ToUint8Array(base64String) {
//     var padding = '='.repeat((4 - base64String.length % 4) % 4);
//     var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

//     var rawData = window.atob(base64);
//     var outputArray = new Uint8Array(rawData.length);

//     for (var i = 0; i < rawData.length; ++i) {
//       outputArray[i] = rawData.charCodeAt(i);
//     }
//     return outputArray;
//   }

//   notifyButton.addEventListener('click', function() {
//     displayNotification();
//   });

//   if ('serviceWorker' in navigator && 'PushManager' in window) {
//     console.log('Service Worker and Push is supported');

//     navigator.serviceWorker
//       .register('sw.js')
//       .then(function(swReg) {
//         console.log('Service Worker is registered', swReg);

//         swRegistration = swReg;

//         initializeUI();
//       })
//       .catch(function(error) {
//         console.error('Service Worker Error', error);
//       });
//   } else {
//     console.warn('Push messaging is not supported');
//     pushButton.textContent = 'Push Not Supported';
//   }
// })();
