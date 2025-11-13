import Plugin from 'src/plugin-system/plugin.class';

export default class RumbleButton extends Plugin {
    init() {
        console.info(window.PluginManager.getPluginInstancesFromElement(this.el));
    }
}