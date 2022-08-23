/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

 class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (element === undefined) {
      throw new Error('Element is empty');
    } else {
      this.element = element;
      this.update();
      this.registerEvents();

    }
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.onclick = (event) => {
      const target = event.target;
      if (target.classList.contains('create-account')) {
        App.getModal('createAccount').open();
      }
      if (target.closest('.account')) {
        this.onSelectAccount(target.closest('.account'));
      }
    }

    // const createAccount = this.element.querySelector('.create-account');
    // createAccount.onclick = () => {
    //   App.getModal('createAccount').open();
    // }
    // const accounts = document.querySelectorAll('.account');

    // accounts.forEach(el => {el.addEventListener('click', event => {
    //   this.onSelectAccount(el);
    // })})
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list(JSON.stringify(User.current()), (err, response)=> {
        if (err === null) {
          this.clear();
          response.data.forEach(el => {
            this.renderItem(el);
          });
        }
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const accounts = this.element.querySelectorAll('.account');
    accounts.forEach(el => el.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element){
    const activeElem = this.element.querySelector('.active');
    if (activeElem) {
      activeElem.classList.remove('active');
    }
    element.classList.add('active');
    const account_id = element.getAttribute('data-id');
    App.showPage('transactions', {'account_id': account_id});
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const el = `<li class="account" data-id=` + String(item.id) +`>` +
        `<a href="#">
        <span>` + item.name + `</span> 
        <span>` + item.sum + `₽</span>
      </a>
    </li>`
    return el;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    const panel = document.querySelector('.accounts-panel');
    const html = this.getAccountHTML(data);
    panel.insertAdjacentHTML('beforeend', html);
    this.registerEvents();
  }
}
