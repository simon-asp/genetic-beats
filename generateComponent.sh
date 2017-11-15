#!/bin/bash
path='./src/components/'${1}
continue=false

# If no argument provided
if [ -z "$1" ]
then
	echo "Provide a component name"
else
	#If the component folder already exists
	if [ -e $path ]; then
	  echo "Component $1 already exists!"

		#Prompt the user
		while true; do
		    read -p "Do you wish to delete the component and make a new one? [y/n]: " yn
		    case $yn in
		        [Yy]* ) rm -rf $path; continue=true; break;;
		        [Nn]* ) exit;;
		        * ) echo "Please answer yes or no.";;
		    esac
		done
	fi

	if [ ! -f $path ] || [ $continue=true ]; then
	  mkdir $path

	  jsPath=$path/$1.js
	  cssPath=$path/$1.css
	  packagePath=$path/package.json

	  jsContent="import React from 'react';\nimport classNames from 'classnames/bind';\nimport withStyles from 'isomorphic-style-loader/lib/withStyles';\nimport s from './${1}.css';\nimport PropTypes from 'prop-types';\n// import cx from 'classnames';\n// let cx = classNames.bind(s);\n\nfunction ${1}() {\n  return (\n    <div className={s.root}>\n    </div>\n  );\n}\n\n${1}.propTypes = {};\n\nexport default withStyles(s)(${1});"
		cssContent="@import '../variables.css'\n\n.root {\n};"
		packageContent="{\n  \"name\": \"${1}\",\n  \"version\": \"0.0.0\",\n  \"private\": true,\n  \"main\": \"./${1}.js\"\n}"

		#echo $jsContent
		echo -e "$jsContent" > $jsPath
		echo -e "$cssContent" > $cssPath
	  echo -e "$packageContent" > $packagePath
	fi
fi
