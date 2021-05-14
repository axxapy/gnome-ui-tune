const {
    modHideSearchInput,
    modScaleThumbnails,
    modRestoreThumbnailsBackground,
    modFirefoxPipInOverview
} = imports.misc.extensionUtils.getCurrentExtension().imports.src

function get() {
    return {
        'hide-search': modHideSearchInput.Mod,
        'increase-thumbnails-size': modScaleThumbnails.Mod,
        'restore-thumbnails-background': modRestoreThumbnailsBackground.Mod,
        'overview-firefox-pip': modFirefoxPipInOverview.Mod,
    }
}
