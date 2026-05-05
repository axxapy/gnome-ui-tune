import {Mod} from './mod.js'

import {WorkspaceThumbnail} from 'resource:///org/gnome/shell/ui/workspaceThumbnail.js'
import {BackgroundManager} from  'resource:///org/gnome/shell/ui/background.js'

export default class extends Mod {
    enable() {
        // Thumbnails on main monitor
        this.bkp_thumb_init = WorkspaceThumbnail.prototype._init;
        const _init = this.bkp_thumb_init
        WorkspaceThumbnail.prototype._init = function(metaWorkspace, monitorIndex) {
            _init.call(this, metaWorkspace, monitorIndex)
            this._bgManager = new BackgroundManager({
                monitorIndex: monitorIndex,
                container: this._contents,
                vignette: false
            });

            // Shell 50: when the wallpaper image finishes loading after the
            // thumbnail is built (cold cache on cold boot, or after resume
            // invalidates the cache), the Meta.BackgroundActor's preferred
            // size update no longer always propagates to its parent's
            // allocation, leaving the thumbnail blank until something else
            // (e.g. switching workspaces) forces a relayout. Force one
            // ourselves on every load and on every actor swap.
            const requeue = () => this._bgManager.backgroundActor?.queue_relayout()
            this._bgManagerLoadedId  = this._bgManager.connect('loaded',  requeue)
            this._bgManagerChangedId = this._bgManager.connect('changed', requeue)
        }

        this.bkp_thumb_onDestroy = WorkspaceThumbnail.prototype._onDestroy;
        const _onDestroy = this.bkp_thumb_onDestroy
        WorkspaceThumbnail.prototype._onDestroy = function() {
            _onDestroy.call(this)
            if (this._bgManager) {
                if (this._bgManagerLoadedId) {
                    this._bgManager.disconnect(this._bgManagerLoadedId)
                    this._bgManagerLoadedId = 0
                }
                if (this._bgManagerChangedId) {
                    this._bgManager.disconnect(this._bgManagerChangedId)
                    this._bgManagerChangedId = 0
                }
                this._bgManager.destroy();
                this._bgManager = null;
            }
        }
    }

    disable() {
        if (this.bkp_thumb_init) {
            WorkspaceThumbnail.prototype._init = this.bkp_thumb_init
        }

        if (this.bkp_thumb_onDestroy) {
            WorkspaceThumbnail.prototype._onDestroy = this.bkp_thumb_onDestroy
        }
    }
}
