const mod = imports.misc.extensionUtils.getCurrentExtension().imports.src.mod

const ThumbnailsBox = imports.ui.workspaceThumbnail.ThumbnailsBox

var Mod = class extends mod.Base {
    enable() {
        this.bkp = ThumbnailsBox.prototype._updateShouldShow
        ThumbnailsBox.prototype._updateShouldShow = function() {
            if (!this._shouldShow) {
                this._shouldShow = true;
                this.notify('should-show');
            }
        }
    }

    disable() {
        if (this.bkp) {
            ThumbnailsBox.prototype._updateShouldShow = this.bkp
        }
    }
}
