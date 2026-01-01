let transactions = []
let date = new Date()
let income = document.querySelector('.income').children[2]
let expense = document.querySelector('.expense').children[2]
let balance = document.querySelector('.balance').children[2]
function setincome() {
    let salary;
    do {
        salary = prompt('enter your salary');
        if (salary === null) return null; // User cancelled
        salary = salary.trim();
    } while (isNaN(salary) || salary === '');
    localStorage.setItem('salary', salary);
    return salary;
}

if (date.getMonth() != localStorage.getItem('month') || !localStorage.getItem('month')) {
    localStorage.setItem('month', date.getMonth())
    let yes = confirm('your want update your salary')
    if (yes) {
        localStorage.removeItem('salary')
    }

}
// if (!localStorage.getItem('salary') || localStorage.getItem('salary') === 'null') setincome()



function updateTotals() {
    let totalExpense = 0;
    let salary = localStorage.getItem('salary');
    if (!salary || salary === 'null') {
        salary = setincome();
    }
    let totalIncome = parseInt(salary) || 0;
    transactions.forEach(t => {
        if (t.type === 'expense') totalExpense += t.amount;
        else if (t.type === 'income') totalIncome += t.amount;
    });

    expense.textContent = totalExpense + '₹';
    income.textContent = totalIncome + '₹';
    balance.textContent = (totalIncome - totalExpense) + '₹';

}


let input = document.querySelector('.input')
document.querySelector('.add-butt').addEventListener('click', () => {
    input.classList.remove('hide-input')
})
document.querySelector('.submit').addEventListener('click', () => {
    input.classList.add('hide-input');
    add()
})
document.addEventListener('click', (e) => {
    if (input.classList.contains('hide-input')) return;
    if (e.target.closest('.input') || e.target.closest('.add-butt')) return;
    input.classList.add('hide-input');
});

function add() {
    const transaction = {
        id: Date.now(),
        name: input.children[0].value.trim(),
        amount: Number(input.children[1].value),
        category: input.children[2].children[0].value,
        type: input.children[2].children[1].value,
        date: new Date().toISOString()
    };

    // Basic validation
    if (!transaction.name || transaction.amount <= 0) {
        alert("Please enter valid data");
        return;
    }

    // Get existing transactions
    transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // Add new one at the beginning (latest first)
    transactions.unshift(transaction);

    // Save back to localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions));

    // Clear inputs
    input.children[0].value = "";
    input.children[1].value = "";
    updateTotals();
    renderTransactions();
}

function renderTransactions() {
    const list = document.querySelector('.expense-list');
    list.innerHTML = ''; // Clear existing
    transactions.forEach(t => {
        const expDiv = document.createElement('div');
        expDiv.className = 'exp';
        expDiv.innerHTML = `
            <div class="exp-part1">
                <div class="exp-name">${t.name[0].toUpperCase() + t.name.slice(1)}</div>
                <div class="exp-info">
                    <span class="exp-cat">${t.category}</span>
                    <span class="mid"></span>
                    <span class="exp-date">${new Date(t.date).toLocaleDateString()}</span>
                    <span class="mid"></span>
                    <span class="exp-time">${new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
            <div class="exp-part2">
                <div class="exp-money">${t.type === 'expense' ? '-' : '+'}${t.amount}₹</div>
                <span class="material-symbols-outlined exp-delete" data-id="${t.id}">delete</span>
            </div>
        `;
        list.appendChild(expDiv);
    });
}
// document.querySelectorAll('.expense').children[2].style
document.querySelector('.expense-list').addEventListener('click', (e) => {
    if (e.target.classList.contains('exp-delete')) {
        const id = e.target.dataset.id;
        transactions = transactions.filter(t => t.id != id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        renderTransactions();
        updateTotals();
    }
});

transactions = JSON.parse(localStorage.getItem('transactions')) || [];
renderTransactions();
updateTotals();





