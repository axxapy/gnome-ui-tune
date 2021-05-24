'use strict';

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const Self = imports.misc.extensionUtils.getCurrentExtension()
const Convenience = Self.imports.src.convenience
const _ = imports.gettext.domain(Self.metadata.uuid).gettext


function init() {
}

function buildPrefsWidget() {
    imports.misc.extensionUtils.initTranslations(Self.metadata.uuid);

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
        label: `<b>${_('settings-mods-list')}</b>`,
        halign: Gtk.Align.START,
        use_markup: true,
        visible: true
    });
    prefsWidget.attach(title, 0, 0, 2, 1);

    const mods = Self.imports.src.modsList.getNames()

    for (let modNum = 0; modNum < mods.length; modNum++) {
        const key = mods[modNum]

        const row = modNum + 1

        const label = new Gtk.Label({label: _(key), halign: Gtk.Align.START})
        const toggle = new Gtk.Switch({halign: Gtk.Align.END, active: settings.get_boolean(key)})

        prefsWidget.attach(label, 0, row, 1, 1);
        prefsWidget.attach(toggle, 1, row, 1, 1);

        settings.bind(key, toggle, 'active', Gio.SettingsBindFlags.DEFAULT)
    }


    return prefsWidget
}
