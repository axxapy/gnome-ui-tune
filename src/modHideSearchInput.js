const mod = imports.misc.extensionUtils.getCurrentExtension().imports.src.mod

const Main = imports.ui.main

var Mod = class extends mod.Base {
    enable() {
        this.c = {
            searchEntry: Main.overview.searchEntry,
            searchController: Main.overview._overview.controls._searchController,
        }

        this.c.searchEntry.hide()

        this.connectedId = this.c.searchController.connect('notify::search-active', () => {
            if (this.c.searchController.searchActive) {
                this.c.searchEntry.show();
            } else {
                this.c.searchEntry.hide();
            }
        })
    }

    disable() {
        if (this.connectedId) {
            this.c.searchController.disconnect(this.connectedId)
        }

        this.c.searchEntry.show()
    }
}