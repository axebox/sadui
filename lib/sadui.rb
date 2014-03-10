require "sadui/version"
require 'compass'

module Sadui
  module Rails
    class Engine < ::Rails::Engine
    end
  end
end

root = File.join(File.dirname(__FILE__), "..")

Compass::Frameworks.register("sadui",
    :path => root,
    :stylesheets_directory => File.join(root, "scss")
)