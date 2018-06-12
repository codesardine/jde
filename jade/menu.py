import xdg.DesktopEntry
import xdg.Menu
import icons
from j.AK import Api
from functools import lru_cache as cache

# TODO port to gi, and separate html
def build(application_category, iteration=0):
    """

    :param application_category:
    :param iteration:
    """
    category_name = application_category.getName()
    category = category_name.replace(" ", "-")
    category_icon_name = application_category.getIcon()
    category_description = application_category.getComment()

    if iteration == 0:
        Api.html += '''<span id='%(category_name)s'><a>%(category_name)s</a><img src="img/back.svg" class="applications-arrow-highlight"></span>''' % locals()

    else:

        category_icon = icons.get(category_icon_name)

        Api.html += '''<div id='%(category)s-msg' class='category-msg'>
                          <h5><span>%(category)s</span><span>%(category_description)s</span></h5>
                          <img class='category-icon %(category_name)s' src='%(category_icon)s'>
                          </div>
                          <div id='%(category)s' class='category-container row'><div id='%(category)s-favorites' class='row favorites'></div><div class="grid row">''' % locals()

        # TODO this block needs a clean up including Api.html
        tag = "li"
        action = "onmouseover"
        if category_name == "Settings" or category_name == "System" or category_name == "Help":
            tag = "div"
            action = "onclick"

        Api.html += "<" + tag + " class='application-category " + category + "'><a href='#' " + action + '''=\"
                        display('#%(category)s, #%(category)s-msg');
                        \">%(category_name)s
                        </a></''' % locals() + tag + ">"

    iteration += 1
    for entry in application_category.getEntries():
        if isinstance(entry, xdg.Menu.Menu):
            build(entry, iteration)

        elif isinstance(entry, xdg.Menu.MenuEntry):
            terminal = entry.DesktopEntry.getTerminal()

            if terminal != "true":
                application_executable = entry.DesktopEntry.getExec()
                application_icon = entry.DesktopEntry.getIcon()
                application_icon = icons.get(application_icon)
                application_executable = application_executable.split('%')[0].strip()

                application_generic_name = entry.DesktopEntry.getGenericName()
                application_name = entry.DesktopEntry.getName().replace(")", "").replace("(", "").replace("/", " ")

                application_comment = entry.DesktopEntry.getComment()
                application_keywords = entry.DesktopEntry.getKeywords()

                application_keywords = " ".join(application_keywords)
                application_keywords = "<span style='display:none;'>" + application_keywords + "</span>"

                Api.html += '''<div class='application-wrapper'>
                                  <a class='application-box' href = 'shell:%(application_executable)s'>
                                  <img class='application-icon' src='%(application_icon)s'>
                                  <h5 class='application-name card'>%(application_name)s</h5>
                                  ''' % locals()

                br = "<br><br>"
                if not application_comment and not application_generic_name:
                    application_comment = "Description not available."
                    br = ""

                # fix duplicate descriptions
                elif application_comment == application_generic_name:
                    application_generic_name = ""
                    br = ""

                Api.html += '''<p class='application-comment'>
                                    %(application_generic_name)s
                                    <br><br>
                                    %(application_comment)s
                                    </p>%(application_keywords)s
                                    </a></div>''' % locals()

    Api.html += "</div></div>"

@cache(maxsize=None)
def get():  # /etc/xdg/menus
    """
    parses the menu file
    """
    menu = xdg.Menu.parse('/etc/xdg/menus/jade-applications.menu')
    build(menu)

