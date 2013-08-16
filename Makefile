test:
	export PATH=$PATH:$PWD/bin
	export testFolder=/tmp
	cd node_modules/automation-strongnode/ ; cucumber -f pretty features/cli_slc*

install:
	ruby -v
	gem list
	which cucumber || gem install cucumber rspec || sudo gem install cucumber rspec
	npm install

.PHONY: test
