class Html:

        def get_categorie(comment, name, icon, element_name):
            html = '''<div id='%(element_name)s-msg' class='category-msg'>
                      <h5><span>%(name)s</span>
                      <span>%(comment)s</span></h5>
                      <img class='category-icon %(element_name)s' src='%(icon)s'></div>
                      <div id='%(element_name)s' class='category-container row'>
                      <div id='%(element_name)s-favorites' class='row favorites'></div>
                      <div class="grid row">''' % locals()
            return html

        def get_app(name, generic_name, description, desktop, icon, keywords):
            html = '''<div class='application-wrapper'>
                      <a class='application-box' href = 'desktop:%(desktop)s'>
                      <img class='application-icon' src='%(icon)s'>
                      <h5 class='application-name card'>%(name)s</h5>
                      <p class='application-comment'>%(generic_name)s
                      <br><br>%(description)s</p>
                      <span id='keywords' style='display:none;'>%(keywords)s</span>
                      </a></div>''' % locals()
            return html
