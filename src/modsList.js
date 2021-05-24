
// This func can not be used from prefs.js due to mods being actually loaded when they're imported
function get() {
    const src = imports.misc.extensionUtils.getCurrentExtension().imports.src
    return {
        'hide-search': src.modHideSearchInput.Mod,
        'increase-thumbnails-size': src.modScaleThumbnails.Mod,
        'restore-thumbnails-background': src.modRestoreThumbnailsBackground.Mod,
        'always-show-thumbnails': src.modAlwaysShowThumbnails.Mod,
        'overview-firefox-pip': src.modFirefoxPipInOverview.Mod,
    }
}

// This func is safe to use from prefs.js as it has no external dependencies
function getNames() {
    return [
        'hide-search',
        'increase-thumbnails-size',
        'restore-thumbnails-background',
        'always-show-thumbnails',
        'overview-firefox-pip',
    ];
}
