// Select elements
const sortSelect = document.querySelector('.options');
const [allBtn, incomeBtn, expenseBtn] = document.querySelectorAll('.sort-btn');
const nameInput = document.querySelector('.name-input');
const numberInput = document.querySelector('.number-input');
const submitBtn = document.querySelector('.submit-btn');
const sortBtn = document.querySelector('.sort-btn-2');
const movementsContainer = document.querySelector('.movements');
const balanceNumber = document.querySelector('.balance-number');
const incomeNumber = document.querySelector('.income-number');
const expenseNumber = document.querySelector('.expense-number');

const movements = [
  // { key: 'Sam', val: 200 },
  // { key: 'Thom', val: 250 },
  // { key: 'Laura', val: -150 },
];

let sorted = false;

/////////////////////////////////////////////////////////////////////////////////////////////////
// Functions

// Create movement elements based on filtered lists
const createMovements = function (movement) {
  movement.map(mov => {
    // 1. Create a movement div, add classlist and append to container
    const movement = document.createElement('div');
    movement.classList.add('movement');
    movementsContainer.append(movement);

    // 2. Create a p tag, enter formatted text content and append to div (1)
    const movementInfo = document.createElement('p');
    movementInfo.textContent = `${
      mov.key[0].toUpperCase() + mov.key.slice(1)
    }: ${moneyFormatter.format(mov.val)}`;
    movement.append(movementInfo);

    // 3. Create a button, add classlist and append to div (1)
    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    movement.append(deleteBtn);
  });
};

// Set font sizes of balances#
const setBalanceFontSize = function (el, em, vw) {
  el.style.fontSize = `calc((${em}em + ${vw}vw) / (${balanceNumber.textContent.length} / 2))`;
};

// Update UI
const updateUI = function (movement, sort) {
  movementsContainer.innerHTML = '';

  const movs = sort
    ? movement.sort(movements.slice().sort((a, b) => b.val - a.val))
    : movement;

  // Decide which list is shown using filters
  if (incomeBtn.classList.contains('sort-btn-active')) {
    const incomeFilter = movs.filter(mov => mov.val > 0);
    createMovements(incomeFilter);
  } else if (expenseBtn.classList.contains('sort-btn-active')) {
    const expenseFilter = movs.filter(mov => mov.val < 0);
    createMovements(expenseFilter);
  } else {
    createMovements(movs);
  }

  // FIXME This can be refactored into functions - lots of repetition!
  let count = 0;
  movements.map(cur => {
    count += cur.val;
  });
  balanceNumber.textContent = moneyFormatter.format(count);
  setBalanceFontSize(balanceNumber, 7.5, 15);

  incomeNumber.textContent = moneyFormatter.format(
    movements.filter(mov => mov.val > 0).reduce((acc, cur) => acc + cur.val, 0)
  );
  setBalanceFontSize(incomeNumber, 5, 10);

  expenseNumber.textContent = moneyFormatter.format(
    movements.filter(mov => mov.val < 0).reduce((acc, cur) => acc + cur.val, 0)
  );
  setBalanceFontSize(expenseNumber, 5, 10);
};

const moneyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

const saveMovement = function (val = 1) {
  movements.push({
    key: `${nameInput.value.toLowerCase().trim()}`,
    val: Math.abs(`${numberInput.value}`) * val,
  });
};

function hasNumber(str) {
  return /\d/.test(str);
}

updateUI(movements);

/////////////////////////////////////////////////////////////////////////////////////////////////
// Event listeners

// Highlight sort type

sortSelect.addEventListener('click', e => {
  const clicked = e.target.closest('.sort-btn');

  // Guard clause
  if (!clicked) return;

  // Remove class
  [allBtn, incomeBtn, expenseBtn].forEach(btn =>
    btn.classList.remove('sort-btn-active')
  );

  // Add class
  clicked.classList.add('sort-btn-active');

  // Filter by which button is clicked
  updateUI(movements);
});

// Inputting a number

submitBtn.addEventListener('click', function (e) {
  // 1. Prevent default form submission
  e.preventDefault();

  const nameCheck = hasNumber(nameInput.value);

  // 2. Decide on income/expense + push movement to array in key value pairs
  // 2a. Stop user inputting empty strings/numbers
  if (
    nameInput.value !== '' &&
    nameCheck === false &&
    numberInput.value !== '' &&
    numberInput.value != 0
  ) {
    if (incomeBtn.classList.contains('sort-btn-active')) {
      saveMovement();
    } else if (expenseBtn.classList.contains('sort-btn-active')) {
      saveMovement(-1);
    } else {
      setTimeout(function () {
        movementsContainer.prepend('Please choose income/expense.');
      }, 100);
    }
  } else {
    alert('Please enter valid information');
  }

  // 3. Update UI
  updateUI(movements);

  // 4. Reset name and number inputs
  nameInput.value = '';
  numberInput.value = '';
});

// Delete button using event delegation
63;
movementsContainer.addEventListener('click', function (e) {
  // Define delete button elements
  const clicked = e.target.closest('.delete-btn');

  // Guard clause - stops elements without a close 'delete-btn' from triggering
  if (!clicked) return;

  // 1. Remove movement from array
  // 1a. extract key name and value from the text content of the sibling element.
  let movementSplit = clicked.previousElementSibling.textContent
    .toLowerCase()
    .split(':');
  let movementKeyName = movementSplit[0];
  let movementValue = Number(movementSplit[1].trim().replace(/,|£/g, ''));
  // 1b. Search the array for the movement that matches the key and value
  movements.forEach(function (mov, i) {
    if (mov.key === movementKeyName && mov.val === movementValue) {
      movements.splice(i, 1);
    }
  });

  // 2. Delete the parent element of the pressed button
  // clicked.parentElement.remove();

  // 3. Update UI
  updateUI(movements);
});

sortBtn.addEventListener('click', function (e) {
  if (!sorted) {
    sorted = true;
    updateUI(movements.slice().sort((a, b) => b.val - a.val));
  } else {
    sorted = false;
    updateUI(movements);
  }
});
