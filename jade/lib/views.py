class Html:

    def get_categorie(comment, name, icon, element_name):
        html = f'''<div id='{element_name}-msg' class='category-msg'>
                  <h5><span>{name}</span>
                  <span>{comment}</span></h5>
                  <img class='category-icon {element_name}' src='{icon}'></div>
                  <div id='{element_name}' class='category-container row'>
                  <div id='{element_name}-favorites' class='row favorites'></div>
                  <div class="grid row">'''
        return html

    def get_app(name, generic_name, description, desktop, icon, keywords):
        html = f'''<div class='application-wrapper'>
                  <a class='application-box' href='desktop:{desktop}'>
                  <img class='application-icon' src='{icon}'>
                  <h5 class='application-name card'>{name}</h5>
                  <p class='application-comment'>{generic_name}
                  <br><br>{description}</p>
                  <span id='keywords' style='display:none;'>{keywords}</span>
                  </a></div>'''
        return html
