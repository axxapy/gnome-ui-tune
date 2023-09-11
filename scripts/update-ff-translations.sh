#!/bin/bash

set -e

DIR=$(cd $(dirname "$0")/../ && pwd)
TARGET_FILE="$DIR/src/modFirefoxPipInOverview_titles.js"

LANGS=($(curl -s https://hg.mozilla.org/l10n-central/ | grep -Eo 'href="/l10n-central/[a-zA-Z-]+/"' | cut -d'"' -f2))

STRINGS=""
for lang in "${LANGS[@]}"; do
    echo "Fetching $lang"

    STRING=$(curl -s https://hg.mozilla.org{$lang}raw-file/tip/toolkit/toolkit/pictureinpicture/pictureinpicture.ftl | grep 'pictureinpicture-player-title =' | cut -d'=' -f2 | tr -d '[:space:]')
    STRINGS="$STRINGS\"$STRING\":true,\n"
done

STRINGS=$(echo -e $STRINGS | sort | uniq | grep -v '"":true,')
echo -e "/*\n * DO NOT EDIT MANUALLY\n * Generated via 'make update-ff-translations'\n */" > "$TARGET_FILE"
echo -e "var titles = {${STRINGS::-1}\n}\n" >> "$TARGET_FILE"

echo Done
