import { menuArray } from "./data.js";

const menu = document.getElementById('menu');
const checkoutForm = document.getElementById('checkout-form');
const order = document.getElementById('order');
const modal = document.getElementById('modal');
const yourOrder = {};
let totalPrice = 0;

document.addEventListener('click', (event) => {
    if (event.target.dataset.add) {
        handleAddClick(event.target.dataset.add);
    } else if (event.target.dataset.remove) {
        handleRemoveClick(event.target.dataset.remove);
    } else if (event.target.id === 'complete-order') {
        handleCompleteOrder(event.target.id);
    }
});

function handleAddClick(itemId) {
    const item = menuArray.filter(item => item.id == itemId)[0];
    totalPrice += item.price;
    if (yourOrder.hasOwnProperty(item.name)) {
        yourOrder[item.name] += item.price;
    } else {
        yourOrder[item.name] = item.price;
    }
    render();
}

function handleRemoveClick(itemName) {
    totalPrice -= yourOrder[itemName];
    delete yourOrder[itemName];
    render();
}

function handleCompleteOrder(buttonId) {
    modal.style.display = 'block';
}

checkoutForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(checkoutForm);
    const name = formData.get('name');

    for (const prop of Object.getOwnPropertyNames(yourOrder)) {
        delete yourOrder[prop];
    }

    checkoutForm.reset();
    render();
    modal.style.display = "none";
    totalPrice = 0;
    order.innerHTML = `
        <div class="thanks">
            Thanks, ${name}! Your order is on its way!
        </div>
    `;
})

function getMenuHtml() {
    let menuHtml = '';
    menuArray.forEach(menu => {
        menuHtml += `
            <div class="item">
                <div class="item-img">${menu.emoji}</div>
                <div class="item-details">
                    <div class="item-name">${menu.name}</div>
                    <div class="item-ingredients">${menu.ingredients}</div>
                    <div class="item-price">$${menu.price}</div>
                </div>
                <button class="item-add-btn" data-add="${menu.id}">+</button>
            </div>
            <hr class="item-end">
        `;
    });
    return menuHtml;
}

function getOrderHtml() {
    let orderHtml = Object.keys(yourOrder).length > 0 ? '<h3 class="order-title">Your Order</h3>' : '';
    for (const key in yourOrder) {
        orderHtml += `
            <div class="order-item">
                <div class="order-name">${key}</div>
                <button class="item-remove-btn" data-remove="${key}">Remove</button>
                <div class="order-price">$${yourOrder[key]}</div>
            </div>
        `
    }
    orderHtml += Object.keys(yourOrder).length > 0 ? `
        <hr class="order-total-line">
        <div class="order-total">
            <div class="total-text">Total Price: </div>
            <div class="total-price">$${totalPrice}</div>
        </div>
        <button id="complete-order" class="checkout-btn">Complete order</button>
    ` : '';

    return orderHtml;
}

function render() {
    menu.innerHTML = getMenuHtml();
    order.innerHTML = getOrderHtml();
}

render();