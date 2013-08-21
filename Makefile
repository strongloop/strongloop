.PHONY: cute test-cucumber
test: test-cucumber

# Pre-conditions:
#   ruby 1.9.3
#   gem install cucumber rspec

test-cucumber: check_cucumber
	export PATH=${PATH}:${PWD}/bin;export testFolder=/tmp;cd node_modules/automation/strongnode && cucumber -f pretty features/cli_slc*

check_cucumber:
	gem list cucumber
	gem list rspec
