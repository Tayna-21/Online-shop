"use strict"

import shopMockupDataJson from './data.json' assert {type: 'json'};

const initListOfShopItems = () => {
    const arrayOfShopItems = shopMockupDataJson;
    const itemsLength = document.querySelector('.shop-items');
    const itemsInLocalStorage = 'arrayOfSelectedItems';
    const itemsInCart = localStorage.getItem(itemsInLocalStorage);
    const allFoxesBtn = document.getElementById('all-items-btn');
    const input = document.getElementById('search-field');
    const searchBtn = document.getElementById('search-btn');
    const listOfCategories = document.querySelector('.categories');
    const arrayOfCategories = [];
    let arrayOfSelectedItems;
    const inputRange = document.getElementById('price-range');
    const rangeMaxValue = inputRange.getAttribute('value');
    const outputRange = document.getElementById('price');
    const shoppingCartPage = document.querySelector('.shopping-cart-page');
    const cartListOfItems = document.querySelector('.list-of-items');
    const openBtn = document.getElementById('shopping-cart');
    const closeBtn = document.getElementById('close-shopping-cart');
    const payBtn = document.getElementById('payment');
    const menuBurger = document.querySelector('.adaptive-burger');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    let selectedCategory = 'All';

    const renderShopItem = (item) => {
        const itemTemplate = `
            <li id="${item.id}">
              <img src="${item.img}" alt="image ${item.title} ${item.category}">
              <button class="add-to-cart" type="button" data-id="${item.id}"><i class="fa-sharp fa-solid fa-plus"></i>Add</button>
              <div class="description">
                <p>${item.title} <span>$${item.price}</span></p>
                  <div class="rate">
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                    <i class="fa-solid fa-star"></i>
                  </div>
                <span class="category">${item.category}</span>
              </div>
            </li>
            `;

        return itemTemplate;
    };

    arrayOfShopItems.forEach((item) => {
        itemsLength.insertAdjacentHTML('beforeend', renderShopItem(item));
        const length = itemsLength.childElementCount;

        if (length > 6) {
          const collection = itemsLength.children;

          for (let i = 0; i < collection.length; i++) {
            if (i > 5) {
              collection[i].classList.add('hidden-list');
            }
          }
        }
    });

    allFoxesBtn && allFoxesBtn.addEventListener('click', () => {
        const hiddenItems = document.querySelectorAll('.hidden-list');

        hiddenItems.forEach((item) => {
          item.classList.remove('hidden-list');
        })
    });

    menuBurger && menuBurger.addEventListener('click', () => {
        const adaptiveMenu = document.querySelectorAll('.adaptive-menu');

        adaptiveMenu.forEach((item) => {
            item.classList.add('adaptive-menu-visible')
        });
    })

    closeMenuBtn && closeMenuBtn.addEventListener('click', () => {
        const adaptiveMenuVisible = document.querySelectorAll('.adaptive-menu-visible');

        adaptiveMenuVisible.forEach((item) => {
            item.classList.remove('adaptive-menu-visible')
        });
    })

    if (itemsInCart === null) {
        arrayOfSelectedItems = [];
    } else {
        arrayOfSelectedItems = JSON.parse(itemsInCart);
    };

    openBtn && openBtn.addEventListener('click', () => {
        shoppingCartPage.classList.remove('invisible');

        if (arrayOfSelectedItems === null || arrayOfSelectedItems.length === 0) {
            document.querySelector('.empty-cart-message').classList.remove('invisible')
        } else if (arrayOfSelectedItems.length > 0) {
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
                <img src="${item.img}" alt="image ${item.title} ${item.category}">
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

    arrayOfSelectedItems.forEach((item) => {
       cartListOfItems.insertAdjacentHTML('beforeend', renderShoppingCart(item));
    });

    payBtn && payBtn.addEventListener('click', (event) => {
        if (arrayOfSelectedItems.length === 0) {
            return;
        } else {
            event.target.innerText = `Thanks for your order!`;
            arrayOfSelectedItems.length = 0;
            document.querySelector('.empty-cart-message').classList.remove('invisible');
            localStorage.removeItem('arrayOfSelectedItems');
            cartListOfItems.innerHTML = '';

            countTotalPrice(arrayOfSelectedItems);
            showCountIcon(arrayOfSelectedItems);
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
            const itemToReduce = arrayOfSelectedItems.find(item => item.id === itemId);
            const less = event.target.nextElementSibling;

            itemToReduce.quantity--;
            less.innerHTML = `${itemToReduce.quantity}`;
            localStorage.setItem('arrayOfSelectedItems', JSON.stringify(arrayOfSelectedItems));

            countTotalPrice(arrayOfSelectedItems);

            if (arrayOfSelectedItems.length > 1 && itemToReduce.quantity === 0) {
                const indexOfItemToReduce = arrayOfSelectedItems.findIndex(item => item.id === itemToReduce.id);

                arrayOfSelectedItems.splice(indexOfItemToReduce, 1);
                localStorage.setItem('arrayOfSelectedItems', JSON.stringify(arrayOfSelectedItems));

                cartListOfItems.innerHTML = '';

                arrayOfSelectedItems.forEach((item) => {
                    cartListOfItems.insertAdjacentHTML('beforeend', renderShoppingCart(item));
                });

                countTotalPrice(arrayOfSelectedItems);
                showCountIcon(arrayOfSelectedItems);
            } else if (arrayOfSelectedItems.length === 1 && itemToReduce.quantity === 0) {
                localStorage.removeItem('arrayOfSelectedItems');
                arrayOfSelectedItems.length = 0;
                cartListOfItems.innerHTML = '';
                document.querySelector('.empty-cart-message').classList.remove('invisible');

                showCountIcon(arrayOfSelectedItems)
                countTotalPrice(arrayOfSelectedItems);
            };
        };

        if (action === 'increase') {
            const itemToIncrease = arrayOfSelectedItems.find(item => item.id === itemId);
            const more = event.target.previousElementSibling;

            itemToIncrease.quantity++;
            more.innerHTML = `${itemToIncrease.quantity}`;
            localStorage.setItem('arrayOfSelectedItems', JSON.stringify(arrayOfSelectedItems));

            countTotalPrice(arrayOfSelectedItems);
        };

        if (action === 'remove') {
            const itemToRemove = arrayOfSelectedItems.find(item => item.id === itemId);
            const indexOfItemToRemove = arrayOfSelectedItems.findIndex(item => item.id === itemToRemove.id);

            arrayOfSelectedItems.splice(indexOfItemToRemove, 1);

            if (arrayOfSelectedItems.length === 0) {
                localStorage.removeItem('arrayOfSelectedItems');
                cartListOfItems.innerHTML = '';
                document.querySelector('.empty-cart-message').classList.remove('invisible');

                showCountIcon(arrayOfSelectedItems);
                countTotalPrice(arrayOfSelectedItems);
            } else {
                localStorage.setItem('arrayOfSelectedItems', JSON.stringify(arrayOfSelectedItems));

                cartListOfItems.innerHTML = '';

                arrayOfSelectedItems.forEach((item) => {
                    cartListOfItems.insertAdjacentHTML('beforeend', renderShoppingCart(item));
                });

                countTotalPrice(arrayOfSelectedItems);
                showCountIcon(arrayOfSelectedItems);
            };
        };
    });

    const addToCart = () => {
        const buttons = itemsLength.querySelectorAll('.add-to-cart');

        buttons.forEach((item) => {
            item.addEventListener('click', (event) => {
                const selectedItemId = event.target.dataset.id;
                const selectedItem = arrayOfShopItems.find(item => item.id == selectedItemId);
                const addedItem = arrayOfSelectedItems.find(item => item.id == selectedItemId);

                if (!!addedItem) {
                    addedItem.quantity++;
                } else {
                    selectedItem.quantity = 1;
                    arrayOfSelectedItems.push(selectedItem);
                };
                localStorage.setItem('arrayOfSelectedItems', JSON.stringify(arrayOfSelectedItems));

                cartListOfItems.innerHTML = '';

                arrayOfSelectedItems.forEach((item) => {
                    cartListOfItems.insertAdjacentHTML('beforeend', renderShoppingCart(item));
                });

                showCountIcon(arrayOfSelectedItems);
                countTotalPrice(arrayOfSelectedItems);
            });
        });
    };

    //Filters
    const toFilter = () => {
        const liveSearchText = input.value.toLowerCase().trim();
        const itemTitle = input.value.toLowerCase().trim();
        const itemCategory = selectedCategory.toLowerCase();
        const itemPrice = inputRange.value;

        itemsLength.innerHTML = '';

        if (itemCategory === 'all') {
            arrayOfShopItems
                .filter((item) => {
                    return (item.title.toLowerCase().search(liveSearchText) >= 0 && item.title.toLowerCase().includes(itemTitle) && parseInt(item.price) <= parseInt(itemPrice));
                })
                .forEach((item) => {
                    itemsLength.insertAdjacentHTML('beforeend', renderShopItem(item));
                });
        } else if (itemCategory !== 'all') {
            arrayOfShopItems
                .filter((item) => {
                    return (item.title.toLowerCase().search(liveSearchText) >= 0 && item.title.toLowerCase().includes(itemTitle) && item.category.toLowerCase() === itemCategory && parseInt(item.price) <= parseInt(itemPrice));
                })
                .forEach((item) => {
                    itemsLength.insertAdjacentHTML('beforeend', renderShopItem(item));
                });
        };

        addToCart();
    };

    input && input.addEventListener('input', () => {
        toFilter();

        if (input.hasAttribute('invalid')) {
            input.removeAttribute('invalid');
        };
    });

    input && input.addEventListener('focus', () => {
        if (!!itemsLength.previousElementSibling && itemsLength.previousElementSibling.classList.contains('no-item')) {
            itemsLength.previousElementSibling.remove();
        };
    });

    searchBtn && searchBtn.addEventListener('click', (event) => {
        const searchText = input.value.toLowerCase().trim();
        const index = arrayOfShopItems.findIndex(item => item.title.toLowerCase().includes(searchText));

        if (input.value === '' || !input.value.match(/[A-Za-z\s,-.]+[A-Za-z]/) || input.value.length < 2) {
            input.setAttribute('invalid', true);
            return;
        };

        if (index === -1) {
            itemsLength.innerHTML = '';

            itemsLength.insertAdjacentHTML('beforebegin', `<span class="no-item">No such item</span>`);
        } else {
            toFilter();
        };
    });

    arrayOfShopItems.map((item) => arrayOfCategories.push(item.category));

    const arrayOfUniqueCategories = [...new Set(arrayOfCategories)];

    for (let i = 0; i < arrayOfUniqueCategories.length; i++) {
        listOfCategories.insertAdjacentHTML('beforeend', `<li>${arrayOfUniqueCategories[i]}</li>`);
    };

    listOfCategories.insertAdjacentHTML('afterbegin', `<li class="active">All</li>`);

    listOfCategories && listOfCategories.addEventListener('click', (event) => {
        selectedCategory = event.target.innerText;
        const childrenOfList = document.querySelectorAll('.categories li');

        childrenOfList.forEach((child) => {
            child.classList.contains('active');
            child.classList.remove('active');
        });

        event.target.classList.add('active');

        toFilter();

        if (!!itemsLength.previousElementSibling && itemsLength.previousElementSibling.classList.contains('no-item')) {
            itemsLength.previousElementSibling.remove();
        };
    });

    inputRange && inputRange.addEventListener('input', () => {
        const onePercentValueRange = parseInt(rangeMaxValue) / 100;
        const percentage = (parseInt(inputRange.value) / onePercentValueRange).toFixed(2);
        outputRange.innerHTML = (`Value: $${inputRange.value}`);

        toFilter();

        inputRange.style.background = `linear-gradient(to right, #cc5520 0%, #cc5520 ${percentage}%, #efefef ${percentage}%, #efefef 100%)`;
    });

    addToCart();
    showCountIcon(arrayOfSelectedItems);
    countTotalPrice(arrayOfSelectedItems);
};

document.addEventListener('DOMContentLoaded', initListOfShopItems);
