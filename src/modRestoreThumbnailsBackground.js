const mod = imports.misc.extensionUtils.getCurrentExtension().imports.src.mod

const Main = imports.ui.main
const workspaceThumbnail = imports.ui.workspaceThumbnail
const BackgroundManager = imports.ui.background.BackgroundManager

var Mod = class extends mod.Base {
    enable() {
        // Thumbnails on main monitor
        this.bkp_thumb_init = workspaceThumbnail.WorkspaceThumbnail.prototype._init;
        const _init = this.bkp_thumb_init
        workspaceThumbnail.WorkspaceThumbnail.prototype._init = function(metaWorkspace, monitorIndex) {
            _init.call(this, metaWorkspace, monitorIndex)
            this._bgManager = new BackgroundManager({
                monitorIndex: monitorIndex,
                container: this._contents,
                vignette: false
            });
        }

        this.bkp_thumb_onDestroy = workspaceThumbnail.WorkspaceThumbnail.prototype._onDestroy;
        const _onDestroy = this.bkp_thumb_onDestroy
        workspaceThumbnail.WorkspaceThumbnail.prototype._onDestroy = function() {
            _onDestroy.call(this)
            if (this._bgManager) {
                this._bgManager.destroy();
                this._bgManager = null;
            }
        }

        // Thumbnails on second monitor
        if (!imports.ui.workspacesView.ThumbnailsBox) return; // gnome 42 does not require this hack
        this.bkp_layoutManager_thumbnailsBox_updateStates = imports.ui.workspacesView.ThumbnailsBox.prototype._queueUpdateStates
        const layoutManager_thumbnailsBox_updateStates = this.bkp_layoutManager_thumbnailsBox_updateStates
        imports.ui.workspacesView.ThumbnailsBox.prototype._queueUpdateStates = function() {
            layoutManager_thumbnailsBox_updateStates.call(this)

            this._thumbnails.forEach(thumbnail => {
                if (thumbnail._bgManager && thumbnail._bgManager.HACKED) {
                    return
                }
                thumbnail._bgManager = new BackgroundManager({
                    monitorIndex: this._monitorIndex,
                    container: thumbnail._contents,
                    vignette: false
                });
                thumbnail._bgManager.HACKED = true
                const onDestroy = this._thumbnails[0]._onDestroy
                thumbnail._onDestroy = function() {
                    onDestroy.call(this)
                    if (this._bgManager) {
                        this._bgManager.destroy();
                        this._bgManager = null;
                    }
                }
            })
        }
    }

    disable() {
        if (this.bkp_thumb_init) {
            workspaceThumbnail.WorkspaceThumbnail.prototype._init = this.bkp_thumb_init
        }

        if (this.bkp_thumb_onDestroy) {
            workspaceThumbnail.WorkspaceThumbnail.prototype._onDestroy = this.bkp_thumb_onDestroy
        }

        if (this.bkp_layoutManager_thumbnailsBox_updateStates) {
            imports.ui.workspacesView.ThumbnailsBox.prototype._queueUpdateStates = this.bkp_layoutManager_thumbnailsBox_updateStates
        }
    }
}