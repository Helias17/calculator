'use strict'

const prevOperand = document.querySelector('[data-previous-operand]');
const currOperand = document.querySelector('[data-current-operand]');
const clearBtn = document.querySelector('[data-all-clear]');
const delBtn = document.querySelector('[data-delete]');
const radicBtn = document.querySelector('[data-radic]');
const exponentBtn = document.querySelector('[data-exponent]');
const numBtns = Array.from( document.querySelectorAll('[data-number]') );
const operationBtns = Array.from( document.querySelectorAll('[data-operation]') );
const equalBtn = document.querySelector('[data-equals]');
const dotBtn = document.querySelector('[data-dot]');
const plusMinusBtn = document.querySelector('[data-plus-minus]');

let isCalculated = false; // флаг который после нажатия равно кнопки (=) равен true




class Calculator {

  constructor (prevOperand,currOperand) {
    this.prevOperand = prevOperand;
    this.prevValue = 0;
    this.currOperand = currOperand;
    this.operation = '';
  }

  enterNums(digit) {

    // если при вводе цифр изначально в поле стоит 0, то его меняем на введенную цифру
    if ( this.currOperand.innerText == '0' || isCalculated === true ) {
      this.currOperand.innerText = digit;
      isCalculated = false; // ставим false, чтобы можно было вводить цифры
    } else {
      this.currOperand.innerText += digit;
    }

  }

  enterDot() {
    if ( !this.currOperand.innerText.includes('.') && this.currOperand.innerText.length > 0 ) {
      this.currOperand.innerText += '.';
    } else if ( !this.currOperand.innerText.includes('.') && this.currOperand.innerText.length == 0 ) {
      this.currOperand.innerText = '0.';
    }
  }

  backspace() {
    let currStr = this.currOperand.innerText;

    // если ровно 1 символ, то обнуляем
    if ( currStr.length === 1 ) {
      this.currOperand.innerText = 0;
      return;
    }

    // если больше одной цифры, то удаляем последнюю
    if (currStr.length > 1) {
      currStr = currStr.slice(0, currStr.length-1);
      this.currOperand.innerText = currStr;
    } else return;

  }


  plusMinus() {

    let currOperand = this.currOperand.innerText;
    const positiveRegex = /^\d*\.?\d*$/g; // регулярка для положительного числа целого или дробного
    const negativeRegex = /^-\d*\.?\d*$/g; // регулярка для отрицательного числа целого или дробного

    if ( positiveRegex.test(currOperand) && currOperand !== '0' ) {
      this.currOperand.innerText = '-' + this.currOperand.innerText;
      return;
    }

    if ( negativeRegex.test(currOperand) ) {
      this.currOperand.innerText = currOperand.replace('-','');
    }

  }

  clear() {
    this.currOperand.innerText = 0;
    this.prevOperand.innerText = '';
    this.prevValue = 0;
    this.operation = '';
    isCalculated = false;

  }

  radical() {

    if ( this.currOperand.innerText < 0 ) {
      this.prevOperand.innerText = 'Enter positive number';
      this.currOperand.innerText = 0;
      return;
    }

    if ( this.currOperand.innerText !== '' || this.currOperand.innerText !== 0 ) {
      this.currOperand.innerText = Math.sqrt( this.currOperand.innerText );
    }
  }


  operate(operator) {

    // если какая-то операция уже ожидает вычисления и есть 2 операнда, то вычисляем ее
    // если есть this.currOperand, то по любому есть и this.prevOperand
    if ( this.operation.length == 1 && this.currOperand.innerText.length > 0 ) {
      myCalc.equal();
    }

    // Устанавливаем значения операндов и оператора после нажатия на любой оператор

    this.operation = operator;

    if ( this.currOperand.innerText.length > 0 ) {
      this.prevValue = this.currOperand.innerText;
      this.prevOperand.innerText = this.prevValue + this.operation;
      this.currOperand.innerText = '';
    } else {
      // если был нажат оператор,  а второй операнд еще не введен или оператор нажат несколько раз
      this.prevOperand.innerText = this.prevValue + this.operation;
    }
  }


  equal() {

    let multiplier = 1; // множитель для превращения дробных чисел в целые

    // если любой из операндов дробный, устаналиваем множитель, чтобы сделать операнды целыми
    if (isNumberHasDecimal( this.currOperand.innerText ) || isNumberHasDecimal( this.prevValue ) ) {
      multiplier = 1000000000;
    }

    // если пользователь не ввел второй операнд, то он равен первому операнду
    if (this.currOperand.innerText.length == 0) {
     this.currOperand.innerText = this.prevValue;
    }

    switch(this.operation) {

      case '-':
        this.currOperand.innerText = (this.prevValue * multiplier - this.currOperand.innerText * multiplier) / multiplier;
        break;

      case '+':
        this.currOperand.innerText = ( (+this.prevValue) * multiplier + (+this.currOperand.innerText) * multiplier ) / multiplier;
        break;

      case '*':
        this.currOperand.innerText = ((this.prevValue * multiplier) * (this.currOperand.innerText * multiplier)) / (multiplier * multiplier);
        break;

      case '÷':
        this.currOperand.innerText = ( (this.prevValue * multiplier) / (this.currOperand.innerText * multiplier) );
        break;

      case '^':
        this.currOperand.innerText = Math.pow(this.prevValue,this.currOperand.innerText);
        break;
    }

    if (this.operation.length > 0) {

      this.operation = '';
      this.prevValue = 0;
      this.prevOperand.innerText = '';
      isCalculated = true;
    }


  }




}

let myCalc = new Calculator(prevOperand,currOperand);


for (let num of numBtns) {
  num.addEventListener('click', () => {
    myCalc.enterNums(num.innerHTML);
  })
}

dotBtn.addEventListener('click', () => {
  myCalc.enterDot();
})

delBtn.addEventListener('click', () => {
  myCalc.backspace();
})

plusMinusBtn.addEventListener('click', () => {
  myCalc.plusMinus();
})

clearBtn.addEventListener('click', () => {
  myCalc.clear();
})

radicBtn.addEventListener('click', () => {
  myCalc.radical();
})

equalBtn.addEventListener('click', () => {
  myCalc.equal();
})


for (let operation of operationBtns) {
  operation.addEventListener('click', () => {
    myCalc.operate(operation.dataset.operation);
    isCalculated = false; // сбрасываем флаг в false, значит, что мы выбрали какой-то оператор
  })
}


function isNumberHasDecimal(num){
   return (num - Math.floor(num)) !== 0;
}



const helpBtn = document.querySelector('.help__btn');
const helpBlock = document.querySelector('.help');
const showHelpBtn = document.querySelector('.show-help');

helpBtn.addEventListener('click', () => {
  helpBlock.classList.add('help_hidden');
})

helpBlock.addEventListener('animationend', () => {
  showHelpBtn.classList.add('show-help_visible');
})

showHelpBtn.addEventListener('click', () => {
  showHelpBtn.classList.remove('show-help_visible');
  helpBlock.classList.remove('help_hidden');
})




