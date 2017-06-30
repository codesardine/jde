#!/bin/sh

# set default application shortcuts for the dashboard

# default terminal

for terminal in xfce-terminal terminix konsole xfce-term term deepin-terminal gnome-terminal; do
    if which "$terminal" &>/dev/null; then
        #echo "Default JADE terminal = ${terminal}"
	export JADE_TERMINAL=$terminal
        break
    fi
done

# default file manager

for file_manager in nautilus dde-file-manager nemo thunar phanteon-files dolphin; do
    if which "$terminal" &>/dev/null; then
        #echo "Default JADE File Manager ${file_manager}"
	export JADE_FILE_MANAGER=$file_manager
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

# default settings application

for settings in gnome-settings manjaro-settings-manager; do
    if which "$settings" &>/dev/null; then
        #echo "Default JADE Settings ${settings}"
	export JADE_SETTINGS=$settings
        break
    fi
done

# default browser

for browser in chromium firefox midori; do
    if which "$browser" &>/dev/null; then
        #echo "Default JADE Browser ${browser}"
	export JADE_BROWSER=$browser
        break
    fi
done

#default welcome screen

#for welcome_screen in manjaro-hello; do
    #if which "$welcome_screen" &>/dev/null; then
        #echo "Default JADE Welcome Screen ${welcome_screen}"
	#export JADE_DISTRIBUTOR_WELCOME_SCREEN=$welcome_screen
        #break
    #fi
#done

# default disk usage

for disk_usage in baobab; do
    if which "$disk_usage" &>/dev/null; then
        export JADE_DISK_USAGE=$disk_usage
        break
    fi
done
