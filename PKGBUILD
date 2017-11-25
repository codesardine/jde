# Author: Vitor Lopes <vmnlop@gmail.com>

_pkgname=jade-dashboard
pkgname="$_pkgname-git"
pkgver=0.4.50.r211.8e235d1
pkgrel=1
pkgdesc="JADE, a linux desktop built with HTML5, CSS, JavaScript and Python."
arch=('any')
url="https://github.com/codesardine/Jadesktop"
license=('GPL')
makedepends=('git')
depends=('python-jade-application-kit' 'jade-menu-data' 'python-xdg')
optdepends=('paper-icon-theme-git')
provides=('jade-dashboard')
replaces=('jade-dashboard')
source=("$_pkgname"::"git+$url.git")
md5sums=('SKIP')

pkgver() {
	cd "$_pkgname/jade/"
	local v_ver=$(awk '/"version"/ {print $2}' application-settings.json | cut -d '"' -f2 )
	printf "$v_ver.r$(git rev-list --count HEAD).$(git rev-parse --short HEAD)"
}

package() {
    cd "$_pkgname"
    cp -r $srcdir/$_pkgname/usr $pkgdir/
    cp -r $srcdir/$_pkgname/etc $pkgdir/
    mkdir -p "$pkgdir/opt/jade"
    cp -r $srcdir/$_pkgname/jade $pkgdir/opt
    chmod 644 $pkgdir/etc/xdg/autostart/jade-dashboard.desktop
    chmod 644 $pkgdir/usr/share/applications/jade-dashboard.desktop
    chmod 744 $pkgdir/usr/bin/jade-desktop
}
