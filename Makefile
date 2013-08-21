test: cute

cute: check_cucumber
	export PATH=${PATH}:${PWD}/bin;export testFolder=/tmp;cd node_modules/automation/strongnode && cucumber -f pretty features/cli_slc*

check_cucumber:
	gem list cucumber
	gem list rspec

.PHONY: cute test
