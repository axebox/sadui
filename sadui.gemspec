# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'sadui/version'

Gem::Specification.new do |spec|
  spec.name          = "sadui"
  spec.version       = Sadui::VERSION
  spec.authors       = ["Ethan Tabor"]
  spec.email         = ["etabor@axebox.com"]
  spec.summary       = "Lightweight UI components"
  spec.description   = "SASS and JS components with minimal dependencies"
  spec.homepage      = "https://github.com/axebox/sadui"
  spec.license       = "MIT"



  # spec.files         = `git ls-files -z`.split("\x0")
  spec.files = Dir["{lib}/**/*"] + ["LICENSE", "README.md"]
  # spec.files = Dir["{lib,vendor}/**/*"] + ["MIT-LICENSE", "README.md"]
  # spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  # spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib", "js", "scss"]

  # spec.add_development_dependency('rails')
  # spec.add_development_dependency('sass')
  # spec.add_development_dependency('uglifier')

  spec.add_development_dependency "bundler", "~> 1.5"
  spec.add_development_dependency "rake"
end
