import dbus
import dbus.service as service
from JAK.Utils import JavaScript  
from Utils import Session, Desktop 

class Service(dbus.service.Object):

    def __init__(self):
        bus_name = service.BusName("org.jade.Desktop", dbus.SessionBus())
        service.Object.__init__(self, bus_name, "/org/jade/Desktop")        

    @dbus.service.method("org.jade.Desktop.Background", in_signature='s', out_signature='')
    def setImage(self, image):
        Desktop.setBackground(image)

    @dbus.service.method("org.jade.Desktop", in_signature='', out_signature='')
    def toggleLauncher(self):
        Desktop.toggleLauncher()

    @dbus.service.method("org.jade.Desktop", in_signature='', out_signature='')
    def toggleSettings(self):
        Desktop.toggleSettings()

    @dbus.service.method("org.jade.Desktop", in_signature='', out_signature='')
    def show(self):
        Desktop.show()        

    @dbus.service.method("org.jade.Desktop", in_signature='', out_signature='')
    def toggleSearch(self):
        Desktop.toggleSearch()
       
   