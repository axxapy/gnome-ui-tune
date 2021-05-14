'use strict';

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const Self = imports.misc.extensionUtils.getCurrentExtension()
const Convenience = Self.imports.src.convenience


function init() {
}

function buildPrefsWidget() {
    const settings = Convenience.getSettings()

    let prefsWidget = new Gtk.Grid({
        margin_top: 18,
        margin_bottom: 18,
        margin_start: 18,
        margin_end: 18,
        column_spacing: 12,
        row_spacing: 22,
        visible: true
    });

    let title = new Gtk.Label({
        label: `<b>${Self.metadata.name} Preferences</b>`,
        halign: Gtk.Align.START,
        use_markup: true,
        visible: true
    });
    prefsWidget.attach(title, 0, 0, 2, 1);

    const mods = [
        'hide-search',
        'increase-thumbnails-size',
        'restore-thumbnails-background',
        'overview-firefox-pip',
    ]

    for (let modNum = 0; modNum < mods.length; modNum++) {
        const key = mods[modNum]

        let toggleLabel = new Gtk.Label({
            label: `${key}:`,
            halign: Gtk.Align.START,
            visible: true,
        });
        prefsWidget.attach(toggleLabel, 0, modNum + 1, 1, 1);

        let toggle = new Gtk.Switch({
            active: settings.get_boolean(key),
            halign: Gtk.Align.END,
            visible: true,
        });
        prefsWidget.attach(toggle, 1, modNum + 1, 1, 1);

        settings.bind(key, toggle, 'active', Gio.SettingsBindFlags.DEFAULT)
    }


    return prefsWidget
}
