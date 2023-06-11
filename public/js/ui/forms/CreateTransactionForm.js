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
    console.log(this.element.querySelector(".accounts-select"))
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    
    Account.list(User.current(), (err, response) => {
      if(response.success === true){
        let options = response.data.reduce((html, item) => {
          html += `<option value = "${item.id}">${item.name}</option>`;
          return html;
        }, "")
        this.element.querySelector(".accounts-select").innerHTML = options;
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