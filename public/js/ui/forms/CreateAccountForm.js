/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, response) => {
      if(response.success === true) {
        let modalAccount = new Modal(document.querySelector("#new-account-form").closest(".modal"));
        let form = modalAccount.element.querySelector("form");
        form.reset();
        modalAccount.close();
        App.update();
      }
    })
  }
}