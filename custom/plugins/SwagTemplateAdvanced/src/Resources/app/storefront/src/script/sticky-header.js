import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';
import ViewportDetection from 'src/helper/viewport-detection.helper';

export default class StickyHeader extends Plugin {

    static options = {
        cloneElClass: 'js-header-main-sticky',
        scrollTriggerPosition: 200, // pixels scrolled down before sticky header appears
    }

    init() {
        this.PluginManager = window.PluginManager;

        // let mainNav = document.getElementById('mainNavigation');
        // // Log the plugins bound to the main navigation element
        // // 'FlyoutMenu' leads to vendor/shopware/platform/src/Storefront/Resources/app/storefront/src/plugin/main-menu/flyout-menu.plugin.js
        // console.info(this.PluginManager.getPluginInstancesFromElement(mainNav));

        this.subscribeViewportEvents();

        if (this.pluginShouldBeActive()) {
            this.initializePlugin();
        }
    }

    subscribeViewportEvents() {
        // detect mobile screens; we do not want to load the code to make the desktop sticky header
        document.$emitter.subscribe('Viewport/hasChanged', this.update, {scope: this});
    }

    update() {
        console.info('Viewport/hasChanged detected');

        if (this.pluginShouldBeActive()) {
            if (this.initialized) {
                return;
            }
            this.initializePlugin();
        } else {
            if (!this.initialized) {
                return;
            }
            this.destroy();
        }
    }

    initializePlugin() {
        this.createElement();
        this.addEventListeners();
        this.reinitializePlugin();

        console.info('StickyHeader initialized');

        this.initialized = true;
    }

    destroy() {
        // remove cloned element
        this._navClone.remove();
        this.removeEventListeners();

        console.info('StickyHeader destroyed');

        this.initialized = false;
    }

    pluginShouldBeActive() {
        if(['XS', 'SM', 'MD'].includes(ViewportDetection.getCurrentViewport())) {
            return false;
        }
        return true;
    }

    createElement() {
        // we bound the plugin to the .main-navigation element
        // so this.el is the main navigation element
        this._navClone = this.el.cloneNode(true); // deep clone
        this._navClone.classList.add(this.options.cloneElClass);
        DomAccess.querySelector(this._navClone, '#mainNavigation', false).removeAttribute('id');

        document.body.appendChild(this._navClone);
    }

    addEventListeners() {
        document.addEventListener('scroll', this.onScroll.bind(this));
    }

    removeEventListeners() {
        document.removeEventListener('scroll', this.onScroll.bind(this));
    }

    onScroll() {
        // elegantly match the scroll trigger position with size of main menu elelemnt's height
        // const scrollPosition = window.scrollY || document.documentElement.scrollTop;

        const scrollPosition = document.documentElement.scrollTop;  
        // more crude but editable via dashboard config
        if (scrollPosition > this.options.scrollTriggerPosition) {
        // if (scrollPosition > this.el.offsetHeight) {
            this._navClone.classList.add('is--active');
        } else {
            this._navClone.classList.remove('is--active');
        }
    }

    reinitializePlugin() {
        // Reinitialize any plugins within the cloned navigation
        // i.e.: reactivate the flyout sub-menus, etc.
        this.PluginManager.initializePlugin(
            'FlyoutMenu',
            '[data-flyout-menu="true"]',
            {}
        );
    }
}