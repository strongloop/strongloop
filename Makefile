build: man

MKD = $(wildcard man/*.md)
TXT = $(MKD:.md=)

.PHONY: man
man: $(TXT)

man/%.md2: man/%.md
	perl -pes'/^#//' < $< > $@

man/%.roff: man/%.md2
	ronn --pipe -r $< > $@

man/%: man/%.roff
	man -Tascii $< > $@
