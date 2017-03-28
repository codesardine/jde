## JADE
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7197c9d3255543d39ec9a15623ee0e51)](https://www.codacy.com/app/codesardine/Jadesktop?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=codesardine/Jadesktop&amp;utm_campaign=Badge_Grade)

JADE is a serveless linux Desktop Environment, built with Python and web techonlogies on top of Webkit2 using the Gtk toolkit, the front end is built using HTML5, Javascript, and CSS.
JADE is under the GPL license, background images are under [Creative Commons Zero license](http://creativecommons.org/publicdomain/zero/1.0/).

Every developer has a vision of what a DE should be, this is mine.
 
JADE is a modern DE. Jade does not try to hide things away from the user, and reduces nested clicking for a modern workflow. Jade is not meant to be a full blown DE, and is meant to be complemented by 3rd party applications.

At the moment it only offers basic functionality, provides access to installed applications, shuts down your system, allows access to recently used files, provides application search, displays the current time and total disk usage in a pleasant way to the user. 

### Why web techonlogies?

Most ( Non-Technical ) people dont know how to use a computer properly, most dont know what Linux is or that they carry it in their pockets on a daily basis. But they all have one thing in common, they all use the browser to buy, go to social networks or check their email. JADE uses familiar interfaces and technologies, which makes it easy to use no matter the skill level of the user.

### Why did i build this?

I built JADE out of my desire to learn Python. I was also in need of an interface for my home entertainment PC, that was easy to use and to hack into. Later on I decided to adapt Jade for desktop use and I decided to release Jade to the masses, maybe someone else will like using it too.

This is a Protoype Desktop Environment, it's a developer build preview, and it is unfinished. JADE is subject to changes at any time.

you can reach me here:
[Twitter Codesardine](https://twitter.com/codesardine)

or here: https://forum.manjaro.org/t/new-desktop-jade-on-the-works-update-1/17228/40


![desktop](jade.jpg)


Instalation and dependencies: 

I only have packages available for Manjaro Linux or archlinux based distros, if you have something else, you will have to use 'git clone' and install manualy or make your own distro packages.

* [jade-application-kit](https://github.com/codesardine/Jade-Application-Kit) - [pkgbuild available](https://github.com/codesardine/Jade-Application-Kit/blob/master/PKGBUILD)
* paper-icon-theme-git ( available in the aur )
* [jade-menu-data](https://github.com/codesardine/Jade-menu-data) - [pkgbuild available](https://github.com/codesardine/Jade-menu-data/blob/master/PKGBUILD)
* python-xdg ( available in the repos )

Jade can be run as a normal application window, or as a Desktop Environment by selecting the window type hint in the manifest file.
[manifest file configuration.](https://github.com/codesardine/Jade-Application-Kit/wiki/Application-manifest-file)

Development:

I will be adding more functionality as needed. If you have an idea that you think would work well with JADE Desktop Environment, please feel free to open an issue. 

If there is something you can't find or do inside the interface, open an issue, as I consider interface design problems a bug.

Issues may take me a while to resolve, however I will eventually fix them when I have some spare time.

