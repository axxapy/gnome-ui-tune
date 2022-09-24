const mod = imports.misc.extensionUtils.getCurrentExtension().imports.src.mod

const workspaceThumbnail = imports.ui.workspaceThumbnail
let SecondaryMonitorDisplay = imports.ui.workspacesView.SecondaryMonitorDisplay

var Mod = class extends mod.Base {
    constructor(scaleFactor) {
        super()
        this.scaleFactor = scaleFactor / 100
    }

    enable() {
        // Thumbnails on main monitor
        if (this.scaleFactor === workspaceThumbnail.MAX_THUMBNAIL_SCALE) {
            return
        }

        this.bkp_MAX_THUMBNAIL_SCALE = workspaceThumbnail.MAX_THUMBNAIL_SCALE
        workspaceThumbnail.MAX_THUMBNAIL_SCALE = this.scaleFactor

        // Thumbnails on second monitor
        // for gnome 42: SecondaryMonitorDisplay may get initialized after extension code is loaded => import above will not work
        SecondaryMonitorDisplay = SecondaryMonitorDisplay ?? imports.ui.workspacesView.SecondaryMonitorDisplay

        this.bkp_SecondaryMonitorDisplay_getThumbnailsHeight = SecondaryMonitorDisplay.prototype._getThumbnailsHeight
        SecondaryMonitorDisplay.prototype._getThumbnailsHeight = function(box) {
            if (!this._thumbnails.visible)
                return 0;

            const [width, height] = box.get_size();
            const { expandFraction } = this._thumbnails;
            const [thumbnailsHeight] = this._thumbnails.get_preferred_height(width);
            return Math.min(
                thumbnailsHeight * expandFraction,
                height * workspaceThumbnail.MAX_THUMBNAIL_SCALE);
        }
    }

    disable() {
        if (this.bkp_MAX_THUMBNAIL_SCALE) {
            workspaceThumbnail.MAX_THUMBNAIL_SCALE = this.bkp_MAX_THUMBNAIL_SCALE
        }

        if (this.bkp_SecondaryMonitorDisplay_getThumbnailsHeight) {
            SecondaryMonitorDisplay.prototype._getThumbnailsHeight = this.bkp_SecondaryMonitorDisplay_getThumbnailsHeight
        }
    }
}
