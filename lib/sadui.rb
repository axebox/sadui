require 'compass'

root = File.join(File.dirname(__FILE__), "..")

Compass::Frameworks.register("sadui",
    :path => root,
    :stylesheets_directory => File.join(root, "scss")
)

module Sadui
end