
/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    
    let xhr = new XMLHttpRequest;
    xhr.responseType = "json";

    if(options.method === "GET") {
        let adress = options.url;
        if(options.data) {
            let param = "";
            for(let key in options.data) {
                param += key + "=" + options.data[key] + "&";
            }
            param = param.substring(0, param.length-1);
            adress = adress + "?" + param;    
        }    

        try{
            xhr.open(options.method, adress);
            xhr.send();
        } catch (e) {
            console.log(e)
        }
    } else {
        let formData = new FormData;
        
        if(options.data) {
            for(let key in options.data) {
            formData.append(key, options.data[key]);
        }
    }
        try {
            xhr.open(options.method, options.url);
            xhr.send(formData); 
        } catch (e) {
            console.log(e)
        }
    }

    xhr.onload = () => {
        if(xhr.status !== 200){
            let err = xhr.response;
            options.callback(err);
        } else {
            let err = null;
            options.callback(err, xhr.response)
        }
    }
};


