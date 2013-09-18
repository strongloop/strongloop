.PHONY: test

# Pre-conditions:
#   ruby 1.9.3
#   gem install cucumber rspec

.PHONY: test-cucumber
test-cucumber: check_cucumber
	export PATH=${PATH}:${PWD}/bin;export testFolder=/tmp;cd node_modules/automation/strongnode && cucumber -f pretty features/cli_slc*

test: test-cucumber

check_cucumber:
	gem list cucumber
	gem list rspec

.PHONY: test-mocha
test-mocha:
	JENKINS_HOME=true ./node_modules/.bin/mocha

test: test-mocha

.PHONY: test-cli
test-cli:
	cd cli-test/cmd_strongops && node drv_strongops_test.js
	cd cli-test/prompt && node drv_prompt_test.js

test: test-cli

.PHONY: build
build: man

MKD = $(wildcard man/*.md)
TXT = $(MKD:.md=)

.PHONY: man
man: check-ronn $(TXT)

man/%.md2: man/%.md
	perl -pes'/^#//' < $< > $@

man/%.roff: man/%.md2 $(RONN)
	ronn --pipe -r $< > $@

man/%: man/%.roff
	groff -Tascii -mandoc -c $< | uniq > $@

check-ronn:
ifeq ($(shell which ronn),)
	$(error Cannot find `ronn` executable. \
	Install it by running `gem install ronn` or `apt-get install ruby-ronn`)
endif
