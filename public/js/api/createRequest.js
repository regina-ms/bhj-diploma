
/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    
    let xhr = new XMLHttpRequest;
    let formData = new FormData;
    let address = options.url;
    xhr.responseType = "json";
    let response;
    let err;


    if(options.method === "GET") {
        formData = null;
        if(options.data) {
            let param = "";
            for(let key in options.data) {
                param += key + "=" + options.data[key] + "&";
            }
            param = param.substring(0, param.length-1);
            address = address + "?" + param;    
        }
    } else {
        if(options.data) {
            for(let key in options.data) {
            formData.append(key, options.data[key]);
            }
        }
    }
    
    try {
        xhr.open(options.method, address);
        xhr.send(formData); 
    } catch (e) {
        console.log(e)
    }

    xhr.onerror = () => {
        err = xhr.response;
        options.callback(err);
    }

    xhr.onload = () => {
        err = null;
        options.callback(err, xhr.response);
        }
    }


