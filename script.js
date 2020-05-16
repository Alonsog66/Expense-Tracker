const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const dummyTransactions = [
  { id: 1, text: 'Trump Money', amount: 1200 },
  { id: 2, text: 'Pinche Renta', amount: -700 },
  { id: 3, text: 'Groceries', amount: -400 },
  { id: 4, text: 'Unemployment', amount: 2000 },
];

window.localStorage.clear();

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null
    ? localStorageTransactions
    : dummyTransactions;

// Add Transaction
function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '') {
    alert('Please add text and amount');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: Number(amount.value),
    };
    transactions.push(transaction);
    addTransactionsToDOM(transaction);
    updateValues();
    updateLocalStorage();
    text.value = '';
    amount.value = '';
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 10000000);
}

// Add transactions to DOM list
const addTransactionsToDOM = function (transaction) {
  //Get Sign
  const sign = transaction.amount > 0 ? '+' : '-';
  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount > 0 ? 'plus' : 'minus');
  item.innerHTML = `
  ${transaction.text} <span>${sign}$${numberWithCommas(
    Math.abs(transaction.amount).toFixed(2)
  )}</span>
  <button class="delete-btn" onclick='removeTransaction(${
    transaction.id
  })'>x</button>
  `;
  list.appendChild(item);
};

//Update the balance, income, and expense
const updateValues = function () {
  let total = transactions
    .reduce((acc, transaction) => transaction.amount + acc, 0)
    .toFixed(2);
  const totalSign = total >= 0 ? '+' : '-';
  total = Math.abs(total).toFixed(2);
  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2);

  const expense = Math.abs(
    transactions
      .filter((transaction) => transaction.amount < 0)
      .reduce((acc, transaction) => acc + transaction.amount, 0)
  ).toFixed(2);

  balance.innerHTML = `${totalSign}$${numberWithCommas(total)}`;
  money_plus.innerHTML = '+$' + numberWithCommas(income);
  money_minus.innerHTML = '-$' + numberWithCommas(expense);
};

// Remove Transaction By ID
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  init();
  updateLocalStorage();
}

// Update Local Storage Transaction
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Numbers With Commas
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Initialize app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionsToDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
