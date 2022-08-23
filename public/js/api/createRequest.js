/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

const createRequest = (options = {}) => {  
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    let url = options.url;
    console.log(options);
    const method = options.method; 
try {
    if (method == 'GET') {
        for (key in options.data) {
            url += `?${key}=${options.data[key]}`;
        }
    xhr.open(method, url);
    xhr.send();
    } else {
        let formData = new FormData();
        for (key in options.data) {
            formData.append(key, options.data[key]);
        }
        xhr.open(method, url);
        xhr.send(formData);
    }
} catch (e) {
    options.callback('error');
}

xhr.onload = () => {
    options.callback(null, xhr.response);
}

};

// const createRequest = (options = {}) => {
//   const xhr = new XMLHttpRequest();
//   xhr.responseType = "json";
//   options.method === "GET";
//   let address = `${options.url}` + "?";
//   for (let i in options.data) {
//     address += `${i}=${options.data[i]}&`;
//   }

//   var callback = options.callback
//     ? options.callback
//     : function (f) {
//         return f;
//       };

//   const formData = new FormData();
//   for (let i in options.data) {
//     formData.append(i, options.data[i]);
//   }

//   try {
//     xhr.open(options.method, address);
//     xhr.send(formData);
//   } catch (err) {
//     callback(err);
//     console.log(err);
//   }

//   xhr.onload = () => {
//     if (xhr.status === 200) {
//       callback(xhr.err, xhr.response);
//       console.log(xhr.response);
//     }
//   };

//   xhr.onerror = () => {
//     callback(xhr.response.error, xhr.response);
//     console.log(xhr.response);
//   };
// };
