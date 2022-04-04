let db;
const request = indexedDB.open('TUM', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('pending', { autoIncrement: true });
  };
  
// upon a successful 
request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
      checkDb();
    }
  };
  
request.onerror = function(event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['pending'], 'readwrite');
  
    const store = transaction.objectStore('pending');
  
    store.add(record);
  }

function checkDb() {
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
        fetch('/api/transaction/bulk', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(serverResponse => {
            if (serverResponse.message) {
                throw new Error(serverResponse);
            }
            const transaction = db.transaction(['pending'], 'readwrite');
            const store = transaction.objectStore('pending');
            store.clear();

            alert('All saved budget has been submitted!');
            })
            .catch(err => {
            console.log(err);
            });
        }
    };
}

// listen for app coming back online
window.addEventListener('online', checkDb);