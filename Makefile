help:
	@echo "convert-po-files - Converts po files into i18next compatible JSON."

convert-po-files:
	for locale in en de fr pl ; do \
		node_modules/.bin/i18next-conv --language=$$locale --source=./locales/$$locale/$$locale.po --target=./locales/$$locale/$$locale.json ; \
	done
	@echo All done!