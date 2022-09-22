
// This func can not be used from prefs.js due to mods being actually loaded when they're imported
function get() {
    const src = imports.misc.extensionUtils.getCurrentExtension().imports.src
    return {
        'increase-thumbnails-size': src.modScaleThumbnails.Mod,
        'hide-search': src.modHideSearchInput.Mod,
        'restore-thumbnails-background': src.modRestoreThumbnailsBackground.Mod,
        'always-show-thumbnails': src.modAlwaysShowThumbnails.Mod,
        'overview-firefox-pip': src.modFirefoxPipInOverview.Mod,
    }
}

// This func is safe to use from prefs.js as it has no external dependencies
function getNames() {
    return [
        'increase-thumbnails-size',
        'hide-search',
        'restore-thumbnails-background',
        'always-show-thumbnails',
        'overview-firefox-pip',
    ];
}
