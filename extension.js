/* exported init */

const Main = imports.ui.main
const workspaceThumbnail = imports.ui.workspaceThumbnail
const Workspace = imports.ui.workspace.Workspace
const SecondaryMonitorDisplay = imports.ui.workspacesView.SecondaryMonitorDisplay
const BackgroundManager = imports.ui.background.BackgroundManager

//const Self = imports.misc.extensionUtils.getCurrentExtension()
//const css = Self.imports.src

class Extension {
    constructor() {
        this.bkp = {}
    }

    enable() {
        // Thumbnails
        this.bkp.MAX_THUMBNAIL_SCALE = workspaceThumbnail.MAX_THUMBNAIL_SCALE
        workspaceThumbnail.MAX_THUMBNAIL_SCALE = 0.1

        this.bkp.thumb_init = workspaceThumbnail.WorkspaceThumbnail.prototype._init;
        const _init = this.bkp.thumb_init
        workspaceThumbnail.WorkspaceThumbnail.prototype._init = function(metaWorkspace, monitorIndex) {
            _init.call(this, metaWorkspace, monitorIndex)
            this._bgManager = new BackgroundManager({
                monitorIndex: Main.layoutManager.primaryIndex,
                container: this._contents,
                vignette: false
            });
        }

        this.bkp.thumb_onDestroy = workspaceThumbnail.WorkspaceThumbnail.prototype._onDestroy;
        const _onDestroy = this.bkp.thumb_onDestroy
        workspaceThumbnail.WorkspaceThumbnail.prototype._onDestroy = function() {
            _onDestroy.call(this)
            if (this._bgManager) {
                this._bgManager.destroy();
                this._bgManager = null;
            }
        }

        // Thumbnails on second monitor
        this.bkp.SecondaryMonitorDisplay_getThumbnailsHeight = SecondaryMonitorDisplay.prototype._getThumbnailsHeight
        SecondaryMonitorDisplay.prototype._getThumbnailsHeight = function(box) {
            if (!this._thumbnails.visible)
                return 0;

            const [width, height] = box.get_size();
            const { expandFraction } = this._thumbnails;
            const [thumbnailsHeight] = this._thumbnails.get_preferred_height(width);
            return Math.min(
                thumbnailsHeight * expandFraction,
                height * 0.1);
        }

        this.bkp.layoutManager_thumbnailsBox_updateStates = imports.ui.workspacesView.ThumbnailsBox.prototype._queueUpdateStates
        const layoutManager_thumbnailsBox_updateStates = this.bkp.layoutManager_thumbnailsBox_updateStates
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

        // Firefox picture-in-picture
        if (false) {
            this.bkp._isOverviewWindow = Workspace.prototype._isOverviewWindow
            const _isOverviewWindow = this.bkp._isOverviewWindow
            Workspace.prototype._isOverviewWindow = function(win) {
                if (win.title && win.title === 'Picture-in-Picture') {
                    if (win.get_wm_class && win.get_wm_class().includes("firefox")) return true;
                }
                return _isOverviewWindow.call(this, win);
            }
        }

        // Search input
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
        // Thumbnails
        if (this.bkp.MAX_THUMBNAIL_SCALE) {
            workspaceThumbnail.MAX_THUMBNAIL_SCALE = this.bkp.MAX_THUMBNAIL_SCALE
            delete(this.bkp.MAX_THUMBNAIL_SCALE)
        }

        if (this.bkp.thumb_init) {
            workspaceThumbnail.WorkspaceThumbnail.prototype._init = this.bkp.thumb_init
            delete(this.bkp.thumb_init)
        }

        if (this.bkp.thumb_onDestroy) {
            workspaceThumbnail.WorkspaceThumbnail.prototype._onDestroy = this.bkp.thumb_onDestroy
            delete(this.bkp.thumb_onDestroy)
        }

        if (this.bkp.SecondaryMonitorDisplay_getThumbnailsHeight) {
            SecondaryMonitorDisplay.prototype._getThumbnailsHeight = this.bkp.SecondaryMonitorDisplay_getThumbnailsHeight
            delete(this.bkp.SecondaryMonitorDisplay_getThumbnailsHeight)
        }

        if (this.bkp.layoutManager_thumbnailsBox_updateStates) {
            imports.ui.workspacesView.ThumbnailsBox.prototype._queueUpdateStates = this.bkp.layoutManager_thumbnailsBox_updateStates
            delete(this.bkp.layoutManager_thumbnailsBox_updateStates)
        }

        // Firefox
        if (this.bkp._isOverviewWindow) {
            Workspace.prototype._isOverviewWindow = this.bkp._isOverviewWindow
            delete(this.bkp._isOverviewWindow)
        }

        // Search input
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
