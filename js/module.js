'use strict'

const loadShoppingCart = (array) => {
    const shoppingCartPage = document.querySelector('.shopping-cart-page');
    const cartListOfItems = document.querySelector('.list-of-items');
    const openBtn = document.getElementById('shopping-cart');
    const closeBtn = document.getElementById('close-shopping-cart');
    const payBtn = document.getElementById('payment');

    openBtn && openBtn.addEventListener('click', () => {
        shoppingCartPage.classList.remove('invisible');

        if (array === null || array.length === 0) {
            document.querySelector('.empty-cart-message').classList.remove('invisible')
        } else if (array.length > 0) {
            document.querySelector('.empty-cart-message').classList.add('invisible');
        };
    });

    closeBtn && closeBtn.addEventListener('click', () => {
        payBtn.innerText = `Checkout`;
        shoppingCartPage.classList.add('invisible');

        if (!document.querySelector('.empty-cart-message').classList.contains('invisible')) {
            document.querySelector('.empty-cart-message').classList.add('invisible');
        };
    });

    const showCountIcon = (array) => {
        const countIcon = document.querySelector('.in-cart');

        if (array.length > 0) {
            const number = array.length;

            countIcon.parentElement.classList.remove('invisible');
            countIcon.innerHTML = `${number}`;
        } else if (array.length === 0 && !countIcon.parentElement.classList.contains('invisible')) {
            countIcon.parentElement.classList.add('invisible');
        };
    };

    const renderShoppingCart = (item) => {
        const itemTemplate = `
            <li>
              <div class="selected-item">
                <img src="${item.img}" alt="image">
                <p>${item.title}<span>$${item.price}</span></p>
              </div>
              <div class="quantity">
                <button type="button" data-id="${item.id}" data-action="reduce">-</button>
                <div class="number" data-id="${item.id}">${item.quantity}</div>
                <button type="button" data-id="${item.id}" data-action="increase">+</button>
              </div>
              <button type="button" data-id="${item.id}" data-action="remove">Remove<i class="fa-solid fa-circle-xmark"></i></button>
            </li>
              `;

        return itemTemplate;
    };

    cartListOfItems.innerHTML = '';

    array.forEach((item) => {
        cartListOfItems.insertAdjacentHTML('beforeend', renderShoppingCart(item));
    });

    payBtn && payBtn.addEventListener('click', (event) => {
        if (array.length === 0) {
            return;
        } else {
            event.target.innerText = `Thanks for your order!`;
            array.length = 0;
            cartListOfItems.insertAdjacentHTML('beforebegin', `<span class="empty-cart-message">Your bag is empty</span>`);
            localStorage.removeItem('arrayOfSelectedItems');
            cartListOfItems.innerHTML = '';

            countTotalPrice(array);
            showCountIcon(array);
        };
    });

    const countTotalPrice = (array) => {
        const totalPriceTitle = document.getElementById('total-price');
        const totalPrice = array
                            .map((item) => item.quantity * item.price)
                            .reduce((a, b) => a + b, 0);
        const totalPriceString = totalPrice.toFixed(2);
        totalPriceTitle.innerHTML = `${totalPriceString}`;
    };

    cartListOfItems && cartListOfItems.addEventListener('click', (event) => {
        const action = event.target.dataset.action;
        const itemId = event.target.dataset.id;

        if (action === 'reduce') {
            const itemToReduce = array.find(item => item.id === itemId);
            const less = event.target.nextElementSibling;

            itemToReduce.quantity--;
            less.innerHTML = `${itemToReduce.quantity}`;
            localStorage.setItem('arrayOfSelectedItems', JSON.stringify(array));

            countTotalPrice(array);

            if (array.length > 1 && itemToReduce.quantity === 0) {
                const indexOfItemToReduce = array.findIndex(item => item.id === itemToReduce.id);

                array.splice(indexOfItemToReduce, 1);
                localStorage.setItem('arrayOfSelectedItems', JSON.stringify(array));

                cartListOfItems.innerHTML = '';

                array.forEach((item) => {
                    cartListOfItems.insertAdjacentHTML('beforeend', renderShoppingCart(item));
                });

                countTotalPrice(array);
                showCountIcon(array);
            } else if (array.length === 1 && itemToReduce.quantity === 0) {
                localStorage.removeItem('arrayOfSelectedItems');
                array.length = 0;
                cartListOfItems.innerHTML = '';
                cartListOfItems.insertAdjacentHTML('beforebegin', `<span class="empty-cart-message">Your bag is empty</span>`);

                showCountIcon(array)
                countTotalPrice(array);
            };
        };

        if (action === 'increase') {
            const itemToIncrease = array.find(item => item.id === itemId);
            const more = event.target.previousElementSibling;

            itemToIncrease.quantity++;
            more.innerHTML = `${itemToIncrease.quantity}`;
            localStorage.setItem('arrayOfSelectedItems', JSON.stringify(array));

            countTotalPrice(array);
        };

        if (action === 'remove') {
            const itemToRemove = array.find(item => item.id === itemId);
            const indexOfItemToRemove = array.findIndex(item => item.id === itemToRemove.id);

            array.splice(indexOfItemToRemove, 1);

            if (array.length === 0) {
                localStorage.removeItem('arrayOfSelectedItems');
                cartListOfItems.innerHTML = '';
                cartListOfItems.insertAdjacentHTML('beforebegin', `<span class="empty-cart-message">Your bag is empty</span>`);

                showCountIcon(array);
                countTotalPrice(array);
            } else {
                localStorage.setItem('arrayOfSelectedItems', JSON.stringify(array));

                cartListOfItems.innerHTML = '';

                array.forEach((item) => {
                    cartListOfItems.insertAdjacentHTML('beforeend', renderShoppingCart(item));
                });

                countTotalPrice(array);
                showCountIcon(array);
            };
        };
    });

    countTotalPrice(array);
    showCountIcon(array);
};

export { loadShoppingCart }
