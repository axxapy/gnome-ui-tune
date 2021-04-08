/* exported init */

const Main = imports.ui.main
const workspaceThumbnail = imports.ui.workspaceThumbnail

//const Self = imports.misc.extensionUtils.getCurrentExtension()
//const css = Self.imports.src

class Extension {
    constructor() {
        this.bkp = {}
    }

    enable() {
        this.c = {
            searchEntry: Main.overview.searchEntry,
            searchController: Main.overview._overview.controls._searchController,
        }

        this.bkp.MAX_THUMBNAIL_SCALE = workspaceThumbnail.MAX_THUMBNAIL_SCALE
        workspaceThumbnail.MAX_THUMBNAIL_SCALE = 0.1

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
        if (this.bkp.MAX_THUMBNAIL_SCALE) {
            workspaceThumbnail.MAX_THUMBNAIL_SCALE = this.bkp.MAX_THUMBNAIL_SCALE
            delete(this.bkp.MAX_THUMBNAIL_SCALE)
        }

        if (this.connectedId) {
            this.c.searchController.disconnect(this.connectedId)
            delete(this.connectedId)
        }

        this.c.searchEntry.show()

        delete(this.c)
    }
}

function init() {
    return new Extension();
}
