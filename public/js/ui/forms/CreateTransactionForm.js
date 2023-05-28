/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(User.current(), (err, response) => {
      if(response.success === true){
        response.data.forEach(item => {
          let option = document.createElement("option");
          option.value = item.id;
          option.textContent = item.name;
          this.element.querySelector(".accounts-select").append(option);
        })
      }
      
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) =>{
      if(response.success === true) {
        App.update();
        this.element.reset();
        new Modal(this.element.closest(".modal")).close();
      }
    })
  }
}