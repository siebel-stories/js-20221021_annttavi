export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig=headerConfig;
    this.data=data;
    this.sortMap=new Map();
    this.sortedData=data;
    this.render();
  }
  sort (fieldValue, orderValue) {  
    //console.log("sorting "+ this.sortMap[fieldValue]);
    let arrItems = new Array();//Массив, у которого 0 элемент это содержимое сортируемой колонки, а 1 элемент вся строка
    for (const item of this.data) { 
      arrItems.push(new Array(item[fieldValue],item));
    }
    //console.log(arrItems);
    let sortedArr=[];//Тот же массив отсортированный
    switch (this.sortMap[fieldValue]) { //string/number
      case "string":
        sortedArr=this.sortStrings(arrItems,orderValue); //вызов сортировки для строк
        break;
      case "number":
        sortedArr=this.sortNumbers(arrItems,orderValue); //вызов сортировки для чисел, хорошо бы это все тоже сделать ассоциативным массивом
        break;
      default:
        alert( "Нет таких значений" );
    }
    //console.log("sortedArr: ");
    //console.log(sortedArr);
    this.sortedData=[]; //превращаем отсортированный двумерный в простой массив
    for (const item of sortedArr) {
      this.sortedData.push(item[1]); 
    }
    //console.log("sortedData:");
    //console.log(this.sortedData);
    this.render(); //оформляем
  }
  sortNumbers (arr,param = 'asc' ) {
    function compare(a,b){
      return (a[0] - b[0]);
    }
    return [...arr].sort(
      function compareFn(p1, p2){
        if (param==="asc") {
          return compare(p1, p2);
        }
        if (param==="desc") {
          return compare(p2, p1);
        }
        else {
          return NaN
        }
      });
    

  }
  sortStrings(arr, param = 'asc') {
    function compare(a,b){
      //return a.localeCompare(b, ['ru','en'], {caseFirst:'upper'}); //тоже работает
      return Intl.Collator(['ru','en'],{ caseFirst: 'upper' }).compare(a[0], b[0]);
    }
    return [...arr].sort(
      function compareFn(p1, p2){
        if (param==="asc") {
          return compare(p1, p2);
        }
        if (param==="desc") {
          return compare(p2, p1);
        }
        else {
          return NaN
        }
      });
     }
  render() {
      const element = document.createElement("div");
      element.innerHTML = this.getTemplate();
      this.element = element.firstElementChild;
      
    }
  getTemplate() {
    return `<div data-element="productsContainer" class="products-list__container">
    <div class="sortable-table"><div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.getHeader()}
    </div><div data-element="body" class="sortable-table__body">
      ${this.getColumnBody()}
    </div></div></div>`;
    
  }
  getPoductRowHtml(item = {}){
    return `<a href="/products/${item.id}" class="sortable-table__row">
    <div class="sortable-table__cell" data-element="${item.id}">
      <img class="sortable-table-image" alt="${item.title}" src="public/cat.jpg"></div>
    <div class="sortable-table__cell" >${item.title}</div>
    <div class="sortable-table__cell">${item.quantity}</div>
    <div class="sortable-table__cell">${item.price}</div>
    <div class="sortable-table__cell">${item.sales}</div>
  </a>`;
  }

  getHeader (){ 
    function getCaptionTemplate(item) {
      return `<div class="sortable-table__cell" data-id="${item.title}" data-sortable="false" data-order="asc"><span>${item.title}</span></div>`;
    }
    
    let arr=[];
    for (const item of this.headerConfig) { 
      arr.push(getCaptionTemplate(item)); //оформление caption для таблицы
      this.sortMap[item.id]=item.sortType; //мап со сведениями о сортировке для разных колонок
    }
    //console.log(this.sortMap);
    return arr.join(""); 
  }
  getColumnBody() {
    let arr=[];
    //console.log(this.sortedData);
    for (const item of this.sortedData) {
        arr.push(this.getPoductRowHtml(item));// [Image, Name, Quantity, Price, Sales]
    }
    if (arr.length==0) {
        arr.push('Нет данных');
    }
    return arr.join("");      
  }
  remove () {
    if (this.element) {
      this.element.remove();
    }
  }
  destroy() {
    if (this.element) {
      this.remove();
      this.element=null;
    }
  }
}
