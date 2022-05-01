/* exported init */

const Self = imports.misc.extensionUtils.getCurrentExtension()
const extensionUtils = imports.misc.extensionUtils

class Extension {
    constructor() {
        this.available_mods = Self.imports.src.modsList.get()
    }

    _refresh_mod(name) {
        if (!this.available_mods[name]) return

        if (this.settings.get_boolean(name)) { // enable
            if (this.mods[name]) return

            const mod = new this.available_mods[name]()
            mod.enable()
            this.mods[name] = mod
        } else if (this.mods[name]) { //disable
            this.mods[name].disable()
            delete this.mods[name]
        }
    }

    enable() {
        this.mods = {}

        this.settings = extensionUtils.getSettings()

        Object.keys(this.available_mods).forEach(name => {
            this.settings.connect('changed::' + name, () => {
                this._refresh_mod(name)
            });
            this._refresh_mod(name)
        })
    }

    disable() {
        for (const key in this.mods) {
            if (!this.mods.hasOwnProperty(key)) continue;
            this.mods[key].disable()
        }

        delete this.mods
        delete this.settings
    }
}

function init() {
    return new Extension();
}
