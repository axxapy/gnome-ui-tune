import {Mod} from './mod.js'
import * as main from 'resource:///org/gnome/shell/ui/main.js'

import {SecondaryMonitorDisplay} from 'resource:///org/gnome/shell/ui/workspacesView.js'

export default class extends Mod {
    constructor(scaleFactor) {
        super()
        this.scaleFactor = scaleFactor / 100
    }

    enable() {
        let _thumbnailsBox = main.overview._overview._controls._thumbnailsBox;

        // Thumbnails on main monitor
        if (this.scaleFactor === _thumbnailsBox._maxThumbnailScale) {
            return
        }

        this.bkp_MAX_THUMBNAIL_SCALE = _thumbnailsBox._maxThumbnailScale
        _thumbnailsBox._maxThumbnailScale = this.scaleFactor
        
        const __scaleFactor = this.scaleFactor
        this.bkp_SecondaryMonitorDisplay_init = SecondaryMonitorDisplay.prototype._init
        const _init = this.bkp_SecondaryMonitorDisplay_init
        SecondaryMonitorDisplay.prototype._init = function(...args) {
            _init.call(this, ...args)
            // Must be set before the first layout: changing it later doesn't invalidate the cached size request
            this._thumbnails._maxThumbnailScale = __scaleFactor
        }
    }

    disable() {
        if (this.bkp_MAX_THUMBNAIL_SCALE) {
            let _thumbnailsBox = main.overview._overview._controls._thumbnailsBox;
            _thumbnailsBox._maxThumbnailScale = this.bkp_MAX_THUMBNAIL_SCALE
        }

        if (this.bkp_SecondaryMonitorDisplay_init) {
            SecondaryMonitorDisplay.prototype._init = this.bkp_SecondaryMonitorDisplay_init
        }
    }
}
