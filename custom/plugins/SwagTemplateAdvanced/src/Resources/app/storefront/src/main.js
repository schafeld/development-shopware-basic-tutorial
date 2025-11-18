import RumbleButton from './script/rumble-button';
import QuantityField from './script/quantity-field';
import StickyHeader from './script/sticky-header';

// The button only holds the RumbleButton function, we need an element higher up in the DOM that holds more plugins
// window.PluginManager.register('RumbleButton', RumbleButton, '.btn-buy');
// '.buy-widget' has the data attribute for AddToCart plugin

// override AddToCart with RumbleButton
window.PluginManager.override('AddToCart', RumbleButton, '[data-add-to-cart]');

// register QuantityField)
window.PluginManager.register('QuantityField', QuantityField, '[data-quantity-field]');

console.info('SwagTemplateAdvanced plugin loaded...');

window.PluginManager.register('StickyHeader', StickyHeader, '[data-sticky-header="true"]', {
    scrollTriggerPosition: 400, // pixels scrolled down before sticky header appears, overides options in sticky-header.js
});