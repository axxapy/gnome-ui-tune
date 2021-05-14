.PHONY: gettext dist help
.DEFAULT_GOAL=help
uuid:=$(shell cat metadata.json | jq -r .uuid)

help:  ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[\/a-zA-Z_-]+:.*?## / {sub("\\\\n",sprintf("\n%22c"," "), $$2);printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

gettext: ## Generate .mo translation files
	find locale -name *.po | xargs basename -s .po | xargs -I{} mkdir -p locale/{}/LC_MESSAGES || /bin/true
	find locale -name *.po | xargs basename -s .po | xargs -I{} msgfmt -D locale -o locale/{}/LC_MESSAGES/$(uuid).mo {}.po

dist: ## Prepare zip file for extensions.gnome.org
	gnome-extensions pack --force --podir=locale .
