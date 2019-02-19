console.log('hello depuis main, MIS DAGBO');
const technosDiv = document.querySelector('#technos');

//live-server --port=3000

function loadTechnologies() {
    fetch('http://localhost:3001/technos')
        .then(response => {
            response.json()
                .then(technos => {
                    const allTechnos = technos.map(t => `<div><b>${t.name}</b> ${t.description}  <a href="${t.url}">site de ${t.name}</a> </div>`)
                        .join('');

                    technosDiv.innerHTML = allTechnos;
                });
        })
        .catch(console.error);
}

loadTechnologies();

// if("serviceWorker" in navigator){
// }

if (navigator.serviceWorker) {
    navigator.serviceWorker.register('sw.js')
        .catch(err => console.error);
}


// Creation de caches
// if(window.caches){
//     caches.open('veille-techno-1.0');
//     caches.open('other-1.0');
//     // keys return une promesse et renvoie la liste des caches
//     caches.keys().then(console.log);
// }


//Mise en cache
// if (window.caches) {
//     caches.open('veille-techno-1.0').then(
//         cache => {
//             cache.addAll([
//                 'index.html',
//                 'main.js',
//                 'vendors/bootstrap4.min.css'
//             ]);
//         }
//     )
// }


// Notifications non persistantes (depuis main.js)

// if (window.Notification && window.Notification !== 'denied') {
//     Notification.requestPermission(perm => {
//         if (perm === 'granted') {
//             const options = {
//                 body : "Geek Tech Consulting",
//                 icon : "images/icons/icon-72x72.png"
//             }
//             const notif = new Notification("MIS DAGBO", options);
//         } else {
//             console.log("autorisation de recevoir les notifications réfusée");
//         }
//     })
// }