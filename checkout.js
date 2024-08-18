document.addEventListener('DOMContentLoaded', () => {
  const checkoutItems = JSON.parse(localStorage.getItem('checkoutItems')) || [];
  const checkoutItemsTable = document.getElementById('checkoutItems');
  const addressInput = document.getElementById('address');
  const paymentMethodSelect = document.getElementById('paymentMethod');

  checkoutItems.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <img src="${item.image}" alt="${item.name}" class="img-thumbnail me-2" style="width: 50px; height: 50px;">
        ${item.name}
      </td>
      <td>${item.quantity}</td>
      <td>$${(item.price * item.quantity).toFixed(2)}</td>
    `;
    checkoutItemsTable.appendChild(row);
  });

  document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const address = addressInput.value;
    const paymentMethod = paymentMethodSelect.value;

    if (!address) {
      alert('Please enter your address');
      return;
    }

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // Show success message
    alert('Thank you for your purchase!');
    localStorage.removeItem('checkoutItems');
    window.location.href = 'index.html';
  });
});
