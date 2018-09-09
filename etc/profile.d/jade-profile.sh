#!/bin/bash

# set default application shortcuts for the dashboard

# default terminal

for terminal in xfce-terminal terminix konsole xfce-term term deepin-terminal gnome-terminal terminator; do
    if which "$terminal" &>/dev/null; then
        #echo "Default JADE terminal = ${terminal}"
	export JADE_TERMINAL=$terminal
        break
    fi
done

# default software installer

for software_installer in gnome-software pamac-manager; do
    if which "$software_installer" &>/dev/null; then
        #echo "Default JADE Software Installer ${software_installer}"
	export JADE_SOFTWARE_INSTALLER=$software_installer
        break
    fi
done
