const mod = imports.misc.extensionUtils.getCurrentExtension().imports.src.mod

const Main = imports.ui.main
const GLib = imports.gi.GLib

var Mod = class extends mod.Base {
    enable() {
        // Normally, we need to just call Main.overview.searchEntry.hide() to hide search bar once.
        // But with extension Dash2Dock, if we do that before it initialized (and it does that when overview is showed
        //  for the first time), it breaks overview completely. This hack delays hiding of search bar for 50ms so that
        //  Dash2Dock would have time to initialize. We need this hack only once, so it disconnects from that signal
        //  right away.
        const onceConnectId = Main.overview.connect('showing', () => {
            this.enableTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 500, () => {
                Main.overview.searchEntry.hide()
                delete this.enableTimeoutId
                return GLib.SOURCE_REMOVE
            })
            Main.overview.disconnect(onceConnectId)
        })

        this.connectedId = Main.overview._overview.controls._searchController.connect('notify::search-active', () => {
            if (Main.overview._overview.controls._searchController.searchActive) {
                Main.overview.searchEntry.show();
            } else {
                Main.overview.searchEntry.hide();
            }
        })
    }

    disable() {
        if (this.connectedId) {
            Main.overview._overview.controls._searchController.disconnect(this.connectedId)
        }

        if (this.enableTimeoutId) {
            GLib.source_remove(this.enableTimeoutId);
        }

        Main.overview.searchEntry.show()
    }
}
