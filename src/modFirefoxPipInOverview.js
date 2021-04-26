const mod = imports.misc.extensionUtils.getCurrentExtension().imports.src.mod

const Workspace = imports.ui.workspace.Workspace

var Mod = class extends mod.Base {
    enable() {
        this.bkp_isOverviewWindow = Workspace.prototype._isOverviewWindow
        const _isOverviewWindow = this.bkp_isOverviewWindow
        Workspace.prototype._isOverviewWindow = function(win) {
            if (win.title && win.title === 'Picture-in-Picture') {
                if (win.get_wm_class && win.get_wm_class().includes("firefox")) return true;
            }
            return _isOverviewWindow.call(this, win);
        }
    }

    disable() {
        if (this.bkp_isOverviewWindow) {
            Workspace.prototype._isOverviewWindow = this.bkp_isOverviewWindow
        }
    }
}