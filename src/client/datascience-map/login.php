<?php
	echo "Identity Information <br />";
	echo $_SERVER["Shib-Identity-Provider"] . "<br />";

	echo "Environment Information <br />";
	echo print_r(getenv(), 1)
?>