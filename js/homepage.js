"use strict"

import { loadShoppingCart } from './module.js';

const loadHomePage = () => {
    window.addEventListener('load', () => {
        const menuBurger = document.querySelector('.adaptive-burger');
        const closeMenuBtn = document.getElementById('close-menu-btn');
        const dataFromlocalStorage = JSON.parse(localStorage.getItem('arrayOfSelectedItems'));
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

        const validateForm = () => {
            const form = document.getElementById('form-subscription');
            const input = document.getElementById('email');
            const regex = /^[a-zA-Z0-9.!_]+@[a-zA-Z]+[.]+([a-zA-Z]+)*$/;

            form.setAttribute('novalidate', true);
            document.querySelector('.form-container').insertAdjacentHTML('beforeend', `<span class="error-message invisible"></span>`);

            const errorMessage = document.querySelector('.error-message');

            const setError = (message) => {
                errorMessage.innerHTML = `${message}`;
                errorMessage.classList.remove('invisible');
            }

            const removeError = () => {
                errorMessage.classList.add('invisible');
            }

            input && input.addEventListener('input', () => {
                removeError();
            })

            form && form.addEventListener('submit', (event) => {
                event.preventDefault()

                if (input.value != '' && input.value.match(regex)) {
                  form.submit();
                } else if (input.value === ''){
                  setError('field can not be empty');
                  return;
                } else {
                  setError('wrong input');
                  return;
                }
            });
        };

        validateForm();
    });
};

document.addEventListener('DOMContentLoaded', loadHomePage);
