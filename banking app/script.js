'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2024-05-23T14:11:59.604Z',
    '2024-05-28T17:01:17.194Z',
    '2024-05-29T23:36:17.929Z',
    '2024-05-30T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2024-05-23T14:11:59.604Z',
    '2024-05-28T17:01:17.194Z',
    '2024-05-29T23:36:17.929Z',
    '2024-05-30T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2024-05-23T14:11:59.604Z',
    '2024-05-28T17:01:17.194Z',
    '2024-05-29T23:36:17.929Z',
    '2024-05-30T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2024-05-23T14:11:59.604Z',
    '2024-05-28T17:01:17.194Z',
    '2024-05-29T23:36:17.929Z',
    '2024-05-30T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//1. Create user name
//2. Chose the current user & Log in
//3. Calcualte the movements
//4. format dates
//5. format numbers
//6. Sort the movements
//7. Display Balance
//8. transfer money
//9. Update UI
//10. request Loan
//11. close account
//12. Add the timer

let currentUser, timer;

//--------- Create UserName -------------//
accounts.forEach(val => {
  return (val.userName = val.owner
    .toLowerCase()
    .split(' ')
    .map(val => val[0])
    .join(''));
});

//--------- Current User & Log in-------------//
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentUser = accounts.find(acc => acc.userName === inputLoginUsername.value);

  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // 1. Update the welcome message
    labelWelcome.textContent = `Welcome Back, ${
      currentUser.owner.split(' ')[0]
    }`;

    //2. show the UI
    containerApp.style.opacity = 100;

    //3.Display Movements
    displayMovement(currentUser);

    //4.Display the date
    const date = new Date();
    const newDate = formatMovementDate(date, currentUser.locale);
    labelDate.textContent = newDate;

    //5.calling the timeout
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    //6.update the UI
    updatUI(currentUser);

    //clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  }
});

//--------- Calculate the movements-------------//
const displayMovement = function (account, sort = false) {
  containerMovements.innerHTML = ' ';

  const sortedMov = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  sortedMov.forEach((val, i) => {
    const type = val > 0 ? 'deposit' : 'withdrawal';

    //creating the date
    const date = new Date(account.movementsDates[i]);
    const newDate = formatMovementDate(date, account.locale);

    //formatting numbers
    const newMov = formatNumbers(account.currency, account.locale, val);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${newDate}</div>
      <div class="movements__value">${newMov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//---------Format dates-------------//
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => {
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const dayPassed = calcDaysPassed(new Date(), date);

  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

//---------Format numbers-------------//
const formatNumbers = function (currency, locale, value) {
  const option = {
    style: 'currency',
    currency: currency,
  };

  return new Intl.NumberFormat(locale, option).format(value);
};

//---------display Balance------------//
const displayBalance = function (account) {
  const total = account.movements.reduce((acc, mov) => mov + acc, 0);
  const newTotal = formatNumbers(account.currency, account.locale, total);
  labelBalance.textContent = newTotal;
};

//---------display Summary------------//
const displaySummary = function (account) {
  //1.display deposits
  const deposits = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatNumbers(
    account.currency,
    account.locale,
    deposits
  );

  //2.display withdrawls
  const withdrawal = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatNumbers(
    account.currency,
    account.locale,
    Math.abs(withdrawal)
  );

  //3.display interset//
  const interest =
    (account.movements.reduce((acc, mov) => acc + mov, 0) *
      account.interestRate) /
    100;
  const newInterst = formatNumbers(account.currency, account.locale, interest);
  labelSumInterest.textContent = newInterst;
};

//---------update UI------------//
const updatUI = function (account) {
  displayBalance(account);
  displayMovement(account);
  displaySummary(account);
};

//---------Sort Movements------------//
let sort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentUser, !sort);
  sort = !sort;
});

//---------transfer money------------//
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount.value);
  const transferAccount = accounts.find(
    mov => inputTransferTo.value === mov.userName
  );

  if (
    transferAccount &&
    transferAccount?.userName !== currentUser.userName &&
    transferAmount > 0
  ) {
    //1.doing the transfer
    currentUser.movements.push(-transferAmount);
    transferAccount.movements.push(transferAmount);

    //2.uploading transfer time
    currentUser.movementsDates.push(new Date().toISOString());
    transferAccount.movementsDates.push(new Date().toISOString());

    //3.update the UI
    updatUI(currentUser);

    //4. reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();

    //clear
    inputTransferAmount.value = inputTransferTo.value = '';
  }
});

//---------request Loan------------//
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentUser.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    setTimeout(function () {
      //add the loan amount
      currentUser.movements.push(loanAmount);

      //add the loan date
      currentUser.movementsDates.push(new Date().toISOString());

      //update UI
      updatUI(currentUser);

      //4. reset the timer
      clearInterval(timer);
      timer = startLogOutTimer();

      //clear
      inputLoanAmount.value = '';
    }, 2500);
  }
});

//---------close account------------//
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentUser.userName &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === currentUser.userName
    );

    //delete the account
    accounts.splice(index, 1);

    //hideUI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//---------start the logout timer------------//
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(Math.trunc(time % 60)).padStart(2, 0);

    // 3.in each call, Print the remaining time to UI
    labelTimer.textContent = `${min}:${second}`;

    //when 0 seconds, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Time Out, Login to get Started';
    }

    //decrease time 1s
    time--;
  };

  // 1.set timer to 5 mins
  let time = 10;

  // 2.call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
