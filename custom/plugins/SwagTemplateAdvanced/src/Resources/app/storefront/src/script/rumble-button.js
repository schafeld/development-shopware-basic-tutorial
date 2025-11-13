import AddToCart from 'src/plugin/add-to-cart/add-to-cart.plugin';
import DomAccess from 'src/helper/dom-access.helper';
import HTTPClient from 'src/service/http-client.service';

export default class RumbleButton extends AddToCart {
    init() {
        this._client = new HTTPClient(window.accessKey, window.contextToken);
        this.cartEl = DomAccess.querySelector(document, '.header-cart');
        this.PluginManager = window.PluginManager;

        // keep the original AddToCart init functionality
        super.init();

        this.el.addEventListener('click', () => {
            const productNameInput = this.el.parentElement.querySelector('input[name="product-name"]');
            const productName = productNameInput ? productNameInput.value.trim() : 'Unknown Product';
            console.info(`Rumble Button for "${productName}" clicked! Let's add some rumble to the shopping experience!`);
        });
    }

    _openOffCanvasCart(instance, requestUrl, formData) {
        // // call the original AddToCart functionality
        // super._openOffCanvasCarts(instance, requestUrl, formData);

        this._client.post(requestUrl, formData, this._afterAddToCart.bind(this));
    }

    _afterAddToCart() {
        this._refreshCartValue();

        // add rumble effect to the cart icon
        this._rumbleButton();        
    }

    _refreshCartValue() {
        const cardWidgetEl = DomAccess.querySelector(this.cartEl, '[data-cart-widget]');
        const cartWidgetInstance = this.PluginManager.getPluginInstanceFromElement(cardWidgetEl, 'CartWidget');

        // if (cartWidgetInstance) {
        //     cartWidgetInstance.refresh();
        // }
        cartWidgetInstance.fetch();
    }

    _rumbleButton() {
        this.cartEl.classList.add('rumble');

        window.setTimeout(() => {
            this.cartEl.classList.remove('rumble');
        }, 1000);
    }
}