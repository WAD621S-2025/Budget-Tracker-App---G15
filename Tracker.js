

class BudgetTracker {
  constructor() {
    this.transactions = this.loadTransactions();
    this.form = document.getElementById("transactionForm");
    this.transactionList = document.getElementById("transactionList");
    this.balanceElement = document.getElementById("balance");

  // Initialize event listeners and render existing data
    this.initEventListeners();
    this.renderTransactions();
    this.renderChart();
    this.updateBalance();
  }

  loadTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
  }
//saves current transactions
  saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }
//handles user input
  initEventListeners() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTransaction();
    });
  }
//allows for new inputs
  clearForm() {
  // Resets the dropdown
  const typeSelect = document.getElementById("type");
  typeSelect.value = "";

  // Resets the dropdown
  const descriptionSelect = document.getElementById("description");
  descriptionSelect.innerHTML =
    '<option value="" disabled selected>Select a category</option>';
  descriptionSelect.disabled = true;

  // Clear the amount field
  document.getElementById("amount").value = "";
}

//allows you to add new transactions
  addTransaction() {
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
//validates user input
    if (!description || isNaN(amount)) {
      alert("Please provide a valid description and amount.");
      return;
    }
//creates transaction object
    const transaction = {
      id: Date.now(),
      description,
      amount: type === "expense" ? -amount : amount,
      type,
    };
//adds transaction to list and updates display
    this.transactions.push(transaction);
    this.saveTransactions();
    this.renderTransactions();
    this.updateBalance();
    this.renderChart();
    this.clearForm();
  }
//renders transactions on page
  renderTransactions() {
    //to avoid duplicates(clears list first)
    this.transactionList.innerHTML = "";
    //sorts transactions oldset to newest
    this.transactions
      .slice()
      .sort((a, b) => b.id - a.id)
      .forEach((transaction) => {
        const transactionDiv = document.createElement("div");
        transactionDiv.classList.add("transaction", transaction.type);
        //display, amount and delete button
        transactionDiv.innerHTML = `
            <span>${transaction.description}</span>
            <span class="transaction-amount-container"
              >$${Math.abs(transaction.amount).toFixed(
                2
              )} <button class="delete-btn" data-id="${
          transaction.id
        }">Delete</button></span
            >
        `;
        this.transactionList.appendChild(transactionDiv);
      });
    this.attachDeleteEventListeners();
  }

  attachDeleteEventListeners() {
    this.transactionList.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", () => {
        this.deleteTransaction(Number(button.dataset.id));
      });
    });
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter(
      (transaction) => transaction.id !== id
    );

    this.saveTransactions();
    this.renderTransactions();
    this.renderChart();
    this.updateBalance();
  }
//calculates balance after each transaction
  updateBalance() {
    const balance = this.transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    this.balanceElement.textContent = `Balance: N$${balance.toFixed(2)}`;
    //if income, green else red
    this.balanceElement.style.color = balance >= 0 ? "#2ecc71" : "#e74c3c";
  }

  //shows chart of income vs expenses
   renderChart() {
    const ctx = document.getElementById("myChart").getContext("2d");
//calculates total income and expenses
    const totalIncome = this.transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = this.transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
//chart data
    const data = {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          label: "Transactions",
          data: [totalIncome, totalExpenses],
          backgroundColor: ["#2ecc71", "#e74c3c"],
          hoverOffset: 4,
        },
      ],
    };
// prevent duplicate charts
    if (this.chart) {
      this.chart.destroy(); 
    }
//create new chart
    this.chart = new Chart(ctx, {
      type: "pie",
      data: data,
    });
  }
}
const budgetTracker = new BudgetTracker();

