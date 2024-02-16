
# list of sites to update
sites=(
	"genomics-map"
	"community-map"
	"open-source-map"
	"sustainability-map"
)


function update_scripts() {
	for site in ${sites[@]}; do
		echo "updating $site scripts"

		# replace all site scripts
		rm -rf ../$site/scripts
		cp -r scripts ../$site/scripts
	done
}

function update_styles() {
	for site in ${sites[@]}; do
		echo "updating $site styles"

		# replace all site styles
		rm -rf ../$site/styles
		cp -r styles ../$site/styles
	done
}

# main
update_scripts
update_styles