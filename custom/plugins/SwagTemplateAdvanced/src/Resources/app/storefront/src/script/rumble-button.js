// import Plugin from 'src/plugin-system/plugin.class';
import AddToCart from 'src/plugin/add-to-cart/add-to-cart.plugin';

// export default class RumbleButton extends Plugin {
export default class RumbleButton extends AddToCart {
    init() {
        // For finding the functions bound to this element
        // console.info(window.PluginManager.getPluginInstancesFromElement(this.el));

        // keep the original AddToCart init functionality
        super.init();

        this.el.addEventListener('click', () => {
            const productNameInput = this.el.parentElement.querySelector('input[name="product-name"]');
            const productName = productNameInput ? productNameInput.value.trim() : 'Unknown Product';
            console.info(`Rumble Button for "${productName}" clicked! Let's add some rumble to the shopping experience!`);
        });
    }
}