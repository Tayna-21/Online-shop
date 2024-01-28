'use strict'

import { loadShoppingCart } from './module.js'

const loadOurHistoryPage = () => {
    window.addEventListener('load', () => {
        const dataFromlocalStorage = JSON.parse(localStorage.getItem('arrayOfSelectedItems'));
        const menuBurger = document.querySelector('.adaptive-burger');
        const closeMenuBtn = document.getElementById('close-menu-btn');
        let arrayOfItemsInCart;

        if (dataFromlocalStorage === null) {
            arrayOfItemsInCart = []
        } else {
           arrayOfItemsInCart = dataFromlocalStorage;
        };

        loadShoppingCart(arrayOfItemsInCart);

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
    });
};

document.addEventListener('DOMContentLoaded', loadOurHistoryPage);
