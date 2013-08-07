# Makefile: npm and test wrapper

CLI=slnode

PATH:=$(PWD)/bin:$(PATH)
export PATH

.PHONY: test-make
test-make: test-clean
	echo PATH=$$PATH
	./bin/$(CLI) create cli out-cli
	./bin/$(CLI) create web out-web
	./bin/$(CLI) create out-default
	./bin/$(CLI) create module out-module
	./bin/$(CLI) create package out-package

.PHONY: test-clean
test-clean:
	rm -rf out-* lib/out-*
