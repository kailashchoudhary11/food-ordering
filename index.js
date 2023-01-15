import { menuArray } from "./data.js";

const menu = document.getElementById('menu');
const checkoutForm = document.getElementById('checkout-form');
const checkout = document.getElementById('checkout');
const order = document.getElementById('order');
const yourOrder = {};
let totalPrice = 0;

checkoutForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(checkoutForm);
    const name = formData.get('name');
    checkout.style.display = 'none';
    for (const prop of Object.getOwnPropertyNames(yourOrder)) {
        delete yourOrder[prop];
    }
    checkoutForm.reset();
    render();
    order.innerHTML = `
        <div>
            Thanks, ${name}! Your order is on its way!
        </div>
    `;
})

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
    console.log(itemName);
    delete yourOrder[itemName];
    render();
}

function handleCompleteOrder(buttonId) {
    checkout.style.display = 'block';
    document.getElementById('complete-order').disabled = true;
}

function getMenuHtml() {
    let menuHtml = '';
    menuArray.forEach(menu => {
        menuHtml += `
            <div class="item">
                <span>${menu.emoji}</span>
                <div>
                    <span>${menu.name}</span>
                    <span>${menu.ingredients}</span>
                    <span>${menu.price}</span>
                </div>
                <button class="add-btn" data-add="${menu.id}">+</button>
            </div>
        `;
    });
    return menuHtml;
}

function getOrderHtml() {
    let orderHtml = Object.keys(yourOrder).length > 0 ? '<h3>Your Order</h3>' : '';
    for (const key in yourOrder) {
        orderHtml += `
            <div>
                <span>${key}</span>
                <button data-remove="${key}">Remove</button>
                <span>$${yourOrder[key]}</span>
            </div>
        `
    }
    orderHtml += Object.keys(yourOrder).length > 0 ? `
        <hr>
        <div>
            <span>Total Price: </span>
            <span>$${totalPrice}</span>
        </div>
        <button id="complete-order">Complete order</button>
    ` : '';

    return orderHtml;
}

function render() {
    menu.innerHTML = getMenuHtml();
    order.innerHTML = getOrderHtml();
}

render();