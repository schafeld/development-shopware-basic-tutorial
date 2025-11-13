import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class QuantityFieldPlugin extends Plugin {
    init() {
        this.minusButton = DomAccess.querySelector(this.el, '.decrease');
        this.plusButton = DomAccess.querySelector(this.el, '.increase');
        this.inputField = DomAccess.querySelector(this.el, 'input[type="number"]');

        // Get min, max, and step from input attributes
        this.minPurchase = parseInt(this.inputField.getAttribute('min'), 10) || 1;
        this.maxPurchase = parseInt(this.inputField.getAttribute('max'), 10) || null;
        this.purchaseSteps = parseInt(this.inputField.getAttribute('step'), 10) || 1;

        this._registerEvents();
    }

    _registerEvents() {
        if (this.minusButton) {
            this.minusButton.addEventListener('click', () => {
                this._decreaseQuantity();
            });
        }

        if (this.plusButton) {
            this.plusButton.addEventListener('click', () => {
                this._increaseQuantity();
            });
        }

        if (this.inputField) {
            this.inputField.addEventListener('input', () => {
                this._validateQuantity();
            });
        }
    }

    _decreaseQuantity() {
        let currentValue = parseInt(this.inputField.value, 10) || this.minPurchase;
        let newValue = currentValue - this.purchaseSteps;
        
        if (newValue >= this.minPurchase) {
            this.inputField.value = newValue;
        }
    }

    _increaseQuantity() {
        let currentValue = parseInt(this.inputField.value, 10) || this.minPurchase;
        let newValue = currentValue + this.purchaseSteps;
        
        if (this.maxPurchase === null || newValue <= this.maxPurchase) {
            this.inputField.value = newValue;
        }
    }

    _validateQuantity() {
        let currentValue = parseInt(this.inputField.value, 10);
        
        // Ensure value is within bounds
        if (currentValue < this.minPurchase) {
            this.inputField.value = this.minPurchase;
        } else if (this.maxPurchase !== null && currentValue > this.maxPurchase) {
            this.inputField.value = this.maxPurchase;
        }
    }
}
