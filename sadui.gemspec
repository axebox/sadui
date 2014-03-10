# Provide a simple gemspec so you can easily use your
# project in your rails apps through git.
Gem::Specification.new do |s|

  s.name = "sadui"
  s.version = "0.0.1"
  s.summary = "Lightweight UI components"
  s.description = "SASS and JS components with minimal dependencies"

  s.authors     = ["Ethan Tabor"]
  s.email       = ["etabor@axebox.com"]
  s.homepage    = "https://github.com/axebox/sad-ui" 
  
  # s.files = Dir["lib/**/*"] + Dir["vendor/**/*"] + ["MIT-LICENSE", "Rakefile", "README.md"]
  s.files = Dir["js/**/*"] + Dir["scss/**/*"] + ["LICENSE", "README.md", "lib/sadui.rb"]
  
  s.add_dependency('jquery-rails')
  s.add_dependency('modernizr_rails')
  s.add_dependency("sass", [">= 3.2.0"])
  s.add_dependency("compass", [">= 0.11"])
  s.add_dependency("animation", [">= 0.1.alpha.0"])
  
  # s.add_development_dependency('rails')
  # s.add_development_dependency('sass')
  # s.add_development_dependency('uglifier')
  
  s.require_paths = ['lib']
end