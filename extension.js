/* exported init */

const workspaceThumbnail = imports.ui.workspaceThumbnail;

class Extension {
    constructor() {
        this.bkp = {}
    }

    enable() {
        this.bkp.MAX_THUMBNAIL_SCALE = workspaceThumbnail.MAX_THUMBNAIL_SCALE
        workspaceThumbnail.MAX_THUMBNAIL_SCALE = 0.1
    }

    disable() {
        if (this.bkp.MAX_THUMBNAIL_SCALE) {
            workspaceThumbnail.MAX_THUMBNAIL_SCALE = this.bkp.MAX_THUMBNAIL_SCALE;
        }
    }
}

function init() {
    return new Extension();
}
