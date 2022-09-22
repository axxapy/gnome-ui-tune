'use strict';

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const Self = imports.misc.extensionUtils.getCurrentExtension()
const extensionUtils = imports.misc.extensionUtils
const _ = imports.gettext.domain(Self.metadata.uuid).gettext


function init() {
}

function buildPrefsWidget() {
    extensionUtils.initTranslations(Self.metadata.uuid);

    const settings = extensionUtils.getSettings()

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

        const value = settings.get_value(key)
        let toggle = null
        switch (value.get_type_string()) {
            case "s":
                toggle = new Gtk.Box({halign: Gtk.Align.END, css_classes: ['linked']})
                const value_enum = settings.get_enum(key)
                const value_string = settings.get_string(key)

                const values = settings.get_range(key).deep_unpack()[1].deep_unpack()

                let btn = null
                for (let v in values) {
                    btn = new Gtk.ToggleButton({
                        active: value_string === values[v],
                        label: values[v],
                        group: btn
                    })
                    toggle.append(btn)
                    btn.connect('toggled', button => {
                        button.active && settings.set_string(key, values[v])
                    })
                }
                break

            default:
                toggle = new Gtk.Switch({halign: Gtk.Align.END, active: settings.get_boolean(key)})
                settings.bind(key, toggle, 'active', Gio.SettingsBindFlags.DEFAULT)
        }

        prefsWidget.attach(label, 0, row, 1, 1);
        prefsWidget.attach(toggle, 1, row, 1, 1);
    }


    return prefsWidget
}
