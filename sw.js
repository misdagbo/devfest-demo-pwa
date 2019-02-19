console.log('Hello depuis un service worker !!!');

const cacheName = 'veille-techno-2.0';

// self fait référence à l'instance du service worker
self.addEventListener('install', evt => {
    console.log('install evt : ', evt);
    // créer un cache
    const cachePromise = caches.open(cacheName).then(cache => {
        return cache.addAll([
                'index.html',
                'main.js',
                'style.css',
                'vendors/bootstrap4.min.css',
                'add_techno.html',
                'add_techno.js',
                'contact.html',
                'contact.js',
            ])
            .then(console.log("cache initialisé"))
            .catch(console.error);
    });

    // s'assurer le cache est initialisé | et donc rester dans addEventListerner aussi longtemps que possible pour que le cache soit entièrement initialisé
    evt.waitUntil(cachePromise);
});

self.addEventListener('activate', evt => {
    console.log('activate evt : ', evt);

    let cacheCleanedPromise = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== cacheName) {
                return caches.delete(key);
            }
        });
    });

    evt.waitUntil(cacheCleanedPromise);
});

self.addEventListener('fetch', evt => {

    // si on est pas en ligne=≠

    // if (!navigator.onLine) {
    //     const headers = {
    //         headers: {
    //             'Content-Type': 'text/html;charset=utf-8'
    //         }
    //     };
    //     evt.respondWith(new Response('<h1>Pas de connexion internet</h1><div>Application en mode dégradé. Veuillez vous connecter svp.</div>', headers));
    // }
    // console.log("fetch event sur url : ", evt.request.url);



    // startégie de cache only with network fallback

    // evt.respondWith(
    //     // chercher si dans le cache il y a quelque chose qui correspond la request qui vient d'être intercepter
    //     caches.match(evt.request).then(res => {
    //         //console.log(" res : ", res);
    //         if (res) {
    //             console.log(`url fetchée depuis le cache  ${evt.request.url} :`, res);
    //             return res;
    //         }
    //         // en cas d'echec, faire une vraie requête sur le réseau (fetch)
    //         // recupérer la requête qui a échoué
    //         //fallback
    //         return fetch(evt.request).then(newResponse => {
    //             //console.log(" newResponse : ", newResponse)
    //             console.log(`url recuperée sur le reseau puis mise en cache ${evt.request.url} :`, newResponse);
    //             // Une fois nouvelle reponse obtenue, on met dans le cache à nouveau de sorte que la requête n'éechoue à la prochaine demande
    //             caches.open(cacheName).then(cache => cache.put(evt.request, newResponse));
    //             // On ne pas utiliser une reponse deux fois, donc on la clone pour l'utliser une seule fois
    //             return newResponse.clone();
    //         })
    //     })
    // );


    // stratégie de récupération sur le réseau puis en cache si le reseau est non accessible
    // stratégie de network first with cache fallback

    evt.respondWith(
        fetch(evt.request).then(res => {
            // mettre la reponse dans le cache de sorte à garder la version la plus recente dans le cache
            if (evt.request.url.includes('add_techno')) {
                throw Error('inaccessible');
            }
            console.log(`${evt.request.url} fetchée depuis le reseau`);
            caches.open(cacheName).then(cache => {
                cache.put(evt.request, res);
            });
            // toujours cloner pour ne pas use la reponse à deux reprises
            return res.clone();
        }).catch(err => {
            console.log(`${evt.request.url} fetchée depuis le cache`);
            return caches.match(evt.request);
        })
    );
});


// Notifications persistantes (envoyées depuis le Service Worker)
// L'avantage est pouvoir envoyer une notification même si l'application n'est pas ouverte
// Il permet aussi de gérer les événements

// self.registration.showNotification('Notif depuis le SW', {
//     body: 'Je suis une notification dite "persistante"',
//     actions: [{
//             action: 'accept',
//             title: 'accepter'
//         },
//         {
//             action: 'refuse',
//             title: 'refuser'
//         }
//     ]
// });


// réagir à la fermeture de la notification

// self.addEventListener('notificationclose', evt => {
//     console.log("notification fermée : ", evt);
// });

// self.addEventListener('notificationclick', evt => {
//     if (evt.action === 'acccept') {
//         console.log("notification acceptée");
//     } else if (evt.action === 'refuse') {
//         console.log("notification refusée");
//     } else{
//         console.log("vous avez cliquer sur la notification mais sur un bouton");
//     }
//     evt.notification.close();
// });


self.addEventListener('push', evt => {
    console.log("push event : ", evt);
    console.log("data envoyée par la push notif des dev tools : ", evt.data.text());
    const title = evt.data.text();
    self.registration.showNotification(title, {body : 'ça marche', image : 'images/icons/icon-152x152.png' });
});
