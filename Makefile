.PHONY: test test-mocha

test: test-mocha
	JENKINS_HOME=true ./node_modules/.bin/mocha

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
	groff -Tascii -mandoc -c $< > $@

check-ronn:
ifeq ($(shell which ronn),)
	$(error Cannot find `ronn` executable. \
	Install it by running `gem install ronn` or `apt-get install ruby-ronn`)
endif
