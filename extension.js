/* exported init */

const Self = imports.misc.extensionUtils.getCurrentExtension()
const Convenience = Self.imports.src.convenience
const {modHideSearchInput, modScaleThumbnails, modRestoreThumbnailsBackground, modFirefoxPipInOverview} = Self.imports.src

class Extension {
    constructor() {}

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

        let mod = null;
        switch (name) {
            case 'hide-search':
                mod = new modHideSearchInput.Mod()
                break

            case 'increase-thumbnails-size':
                mod = new modScaleThumbnails.Mod()
                break

            case 'restore-thumbnails-background':
                mod = new modRestoreThumbnailsBackground.Mod()
                break

            case 'overview-firefox-pip':
                mod = new modFirefoxPipInOverview.Mod()
                break

            default:
                return
        }

        mod.enable()
        this.mods[name] = mod
    }

    enable() {
        this.mods = {}
        this.available_mods = ['hide-search', 'increase-thumbnails-size', 'restore-thumbnails-background', 'overview-firefox-pip']

        const settings = Convenience.getSettings()

        const toggle = (name) => {
            if (settings.get_boolean(name)) {
                this.enable_mod(name)
            } else {
                this.disable_mod(name)
            }
        }

        this.available_mods.forEach(name => {
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
