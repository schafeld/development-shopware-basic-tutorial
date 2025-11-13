import RumbleButton from './script/rumble-button';
import QuantityFieldPlugin from './script/quantity-field';

// The button only holds the RumbleButton function, we need an element higher up in the DOM that holds more plugins
// window.PluginManager.register('RumbleButton', RumbleButton, '.btn-buy');
// '.buy-widget' has the data attribute for AddToCart plugin

// override AddToCart with RumbleButton
window.PluginManager.override('AddToCart', RumbleButton, '[data-add-to-cart]');

// register QuantityFieldPlugin
window.PluginManager.register('QuantityFieldPlugin', QuantityFieldPlugin, '[data-quantity-field]');

console.info('SwagTemplateAdvanced plugin loaded...');

