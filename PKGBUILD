# Author: Vitor Lopes <vmnlop@gmail.com>

_pkgname=jade
pkgname="$_pkgname-git"
pkgver=a0.6
pkgrel=1
pkgdesc="JADE, a linux desktop built with html5, css, javascript and python."
arch=('any')
url="https://github.com/codesardine/Jadesktop"
license=('GPL')
makedepends=('git')
depends=('python-jade-application-kit' 'jade-menu-data' 'python-xdg' 'paper-icon-theme-git')
provides=("jade")
replaces=('jade')
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
    install -Dm644 $srcdir/$_pkgname/usr/share/applications/jade.desktop $pkgdir/usr/share/applications/$pkgname.desktop
    install -Dm755 $srcdir/jade/usr/bin/jade $pkgdir/usr/bin/jade
    
    
}
