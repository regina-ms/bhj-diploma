/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(!element) {
      throw new Error("Ошибка!");
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.querySelector(".remove-account").onclick = () => {
      this.removeAccount();      
    }
    
    this.element.addEventListener("click", (e) => {
      if(e.target.closest(".transaction__remove")){
        this.removeTransaction(e.target.closest(".transaction__remove").dataset.id);
      }
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(!this.lastOptions) {
      return;
    }
    Account.remove(this.lastOptions, (err, response) => {
      console.log(response)
    })
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    Transaction.remove({account_id: id}, (err, response) => {
      console.log(response);
    })
    
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(!options){
      return;
    }
    this.lastOptions = options;
    
    Account.get(options.account_id, (err,response)=> {
      if(response){
        this.renderTitle(response.data.name);
      }
    })

    Transaction.list(options, (err,response) => {
      this.renderTransactions(response.data);
    })
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.element.querySelector(".content-title").textContent = "Название счёта";
    this.lastOptions = null;

  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    this.element.querySelector(".content-title").textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    let month = [
    "января", "февраля", "марта", "апреля", "мая", "июня", "июля", 
    "августа", "сентября", "октября", "ноября", "декабря"
  ]
    let time = new Date(date);
    let minutes = time.getMinutes();
    if(String(minutes).length < 2) {
      minutes = "0" + minutes;
    }

    let string = "" + time.getDate() + " " + month[time.getMonth()] + " " + 
    time.getFullYear() + " г. в " + time.getHours() + ":" + minutes;
    return string;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){    
      let date = this.formatDate(item.created_at);
      let sum = item.sum;
      let id = item.id;
      let type = item.type;
      let name = item.name;

      let transaction = document.createElement("div");
      transaction.classList.add("transaction", "transaction_" + type, "row");

      transaction.innerHTML = `<div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">Новый будильник</h4>
          
          <div class="transaction__date">10 марта 2019 г. в 03:20</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      <!--  сумма -->
          200 <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id="12">
            <i class="fa fa-trash"></i>  
        </button>
    </div>`

    transaction.querySelector(".transaction__title").textContent = name;
    transaction.querySelector(".transaction__date").textContent = date;
    transaction.querySelector(".transaction__remove").dataset.id = id;
    transaction.querySelector(".transaction__summ").innerHTML = `${sum} <span class="currency">₽</span>`
    this.element.querySelector(".content").append(transaction)
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    data.forEach(item => {
      this.getTransactionHTML(item);
    })
  }
}