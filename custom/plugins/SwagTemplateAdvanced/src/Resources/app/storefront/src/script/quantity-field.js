import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class QuantityFieldPlugin extends Plugin {
    init() {
        this.minusButton = DomAccess.querySelector(this.el, '.decrease');
        this.plusButton = DomAccess.querySelector(this.el, '.increase');
        this.inputField = DomAccess.querySelector(this.el, 'input[type="number"]');

        this._registerEvents();
    }

    _registerEvents() {
        if (this.minusButton) {
            this.minusButton.addEventListener('click', () => {
                // console.log('Minus button clicked');
                this._decreaseQuantity();
            });
        }

        if (this.plusButton) {
            this.plusButton.addEventListener('click', () => {
                // console.log('Plus button clicked');
                this._increaseQuantity();
            });
        }

        if (this.inputField) {
            this.inputField.addEventListener('input', () => {
                // console.log('Input field changed');
            });
        }
    }

    _decreaseQuantity() {
        console.log('Decreasing quantity');
        let currentValue = parseInt(this.inputField.value, 10) || 0;
        if (currentValue > 1) {
            this.inputField.value = currentValue - 1;
        }
    }

    _increaseQuantity() {
        console.log('Increasing quantity');
        let currentValue = parseInt(this.inputField.value, 10) || 0;
        this.inputField.value = currentValue + 1;
    }
}
