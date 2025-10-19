// Budget Tracker Class
class BudgetTracker {
  constructor() {
    this.transactions = this.loadTransactions();
    this.form = document.getElementById("transactionForm");
    this.transactionList = document.getElementById("transactionList");
    this.balanceElement = document.getElementById("balance");

    this.initEventListeners();
    this.renderTransactions();
    this.updateBalance();
  }

  // Load transactions from localStorage
  loadTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
  }

  // Save transactions to localStorage
  saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
  }

  // Initialize event listeners for the form
  initEventListeners() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.addTransaction();
    });
  }

  // Clear form inputs after submission
  clearForm() {
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
  }

  // Add a new transaction
  addTransaction() {
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    // Validate inputs
    if (!description || isNaN(amount)) {
      alert("Please provide a valid description and amount.");
      return;
    }

    // Create transaction object
    const transaction = {
      id: Date.now(),
      description,
      amount: type === "expense" ? -amount : amount,
      type,
    };

    // Add transaction and update UI
    this.transactions.push(transaction);
    this.saveTransactions();
    this.renderTransactions();
    this.updateBalance();
    this.clearForm();
  }

  // Render all transactions in the list
  renderTransactions() {
    this.transactionList.innerHTML = "";
    
    // Sort transactions by ID (newest first) and render each one
    this.transactions
      .slice()
      .sort((a, b) => b.id - a.id)
      .forEach((transaction) => {
        const transactionDiv = document.createElement("div");
        transactionDiv.classList.add("transaction", transaction.type);
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
    
    // Reattach delete event listeners
    this.attachDeleteEventListeners();
  }

  // Attach event listeners to delete buttons
  attachDeleteEventListeners() {
    this.transactionList.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", () => {
        this.deleteTransaction(Number(button.dataset.id));
      });
    });
  }

  // Delete a transaction by ID
  deleteTransaction(id) {
    this.transactions = this.transactions.filter(
      (transaction) => transaction.id !== id
    );

    // Update storage and UI
    this.saveTransactions();
    this.renderTransactions();
    this.updateBalance();
  }

  // Update the balance display
  updateBalance() {
    // Calculate total balance
    const balance = this.transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    // Update balance text and color
    this.balanceElement.textContent = `Balance: N$${balance.toFixed(2)}`;
    this.balanceElement.style.color = balance >= 0 ? "#2ecc71" : "#e74c3c";
}
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Budget Tracker
  const budgetTracker = new BudgetTracker();
});