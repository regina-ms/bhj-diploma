/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = "/user";
  
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.removeItem("user");
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    if(localStorage.length !== 0) {
      let item = localStorage.getItem("user");
      return JSON.parse(item);
    }
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    callback = (err, response) => {
      if(response.success === true) {
        let user = response.user;
        for(let key in user) {
          this.setCurrent(key);
        }
      } else {
        this.unsetCurrent();
      }
      return response;
    }
    createRequest({
      url: this.URL + "/current",
      method: "GET",
      callback,
    })
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    callback = (err, response) => {
      if(response.success === true) {
        let user = response.user;
        this.setCurrent(user);
      }
    }
    createRequest({
      url: this.URL + "/register",
      method: "POST",
      data,
      callback,
    })
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    callback = this.unsetCurrent();
    createRequest({
      url: this.URL + "/logout",
      method: "POST",
      callback,
    })
  }
}
