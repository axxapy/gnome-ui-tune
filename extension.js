/* exported init */

const Self = imports.misc.extensionUtils.getCurrentExtension()
const Convenience = Self.imports.src.convenience
const {
    modHideSearchInput,
    modScaleThumbnails,
    modRestoreThumbnailsBackground,
    modFirefoxPipInOverview
} = Self.imports.src

class Extension {
    constructor() {
        this.available_mods = {
            'hide-search': modHideSearchInput.Mod,
            'increase-thumbnails-size': modScaleThumbnails.Mod,
            'restore-thumbnails-background': modRestoreThumbnailsBackground.Mod,
            'overview-firefox-pip': modFirefoxPipInOverview.Mod,
        }
    }

    disable_mod(name) {
        if (!this.mods || !this.mods[name]) {
            return
        }

        this.mods[name].disable()
        delete(this.mods[name])
    }

    enable_mod(name) {
        if (this.mods && this.mods[name]) {
            return
        }

        if (!this.available_mods || !this.available_mods[name]) {
            return
        }

        const mod = new this.available_mods[name]()

        mod.enable()
        this.mods[name] = mod
    }

    enable() {
        this.mods = {}

        const settings = Convenience.getSettings()

        const toggle = (name) => {
            if (settings.get_boolean(name)) {
                this.enable_mod(name)
            } else {
                this.disable_mod(name)
            }
        }

        Object.keys(this.available_mods).forEach(name => {
            settings.connect('changed::' + name, () => {
                toggle(name)
            });
            toggle(name)
        })
    }

    disable() {
        for (const key in this.mods) {
            if (!this.mods.hasOwnProperty(key)) continue;
            this.mods[key].disable()
        }

        delete(this.mods)
    }
}

function init() {
    return new Extension();
}
