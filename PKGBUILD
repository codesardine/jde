# Author: Vitor Lopes <vmnlop@gmail.com>

_pkgname=jadesktop
pkgname="$_pkgname-git"
pkgver=0.a20
pkgrel=5
pkgdesc="JADE, a linux desktop built with HTML5, CSS, JavaScript and Python."
arch=('any')
url="https://github.com/codesardine/Jadesktop"
license=('GPL')
makedepends=('git')
depends=('python-jade-application-kit' 'jade-menu-data' 'python-xdg' 'baobab')
optdepends=('paper-icon-theme-git')
provides=("jadesktop")
replaces=('jadesktop')
source=("$_pkgname"::"git+$url.git")
md5sums=('SKIP')

pkgver() {
    cd "$_pkgname"
    (
        printf "$pkgver.r%s.%s" "$(git rev-list --count HEAD)" "$(git rev-parse --short HEAD)"
    )
}

package() {
    cd "$_pkgname"
    cp -r $srcdir/$_pkgname/usr $pkgdir/
    cp -r $srcdir/$_pkgname/etc $pkgdir/
    mkdir -p "$pkgdir/opt/jade"
    cp -r $srcdir/$_pkgname/jade $pkgdir/opt
    chmod 644 $pkgdir/etc/xdg/autostart/jade.desktop
    chmod 755 $pkgdir/usr/bin/jade
}
