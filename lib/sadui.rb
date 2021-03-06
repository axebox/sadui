require "sadui/version"
require 'compass-rails'

# Used to ensure that Rails 3.0.x, as well as Rails >= 3.1 with asset pipeline disabled
# get the minified version of the scripts included into the layout in production.
module Sadui
  module Rails
    class Engine < ::Rails::Engine
    end
    # class Railtie < ::Rails::Railtie
    #   config.before_configuration do
    #     if config.action_view.javascript_expansions
    #       jq_defaults = ::Rails.env.production? || ::Rails.env.test? ? %w(jquery.min) : %w(jquery)

    #       # Merge the jQuery scripts, remove the Prototype defaults and finally add 'jquery_ujs'
    #       # at the end, because load order is important
    #       config.action_view.javascript_expansions[:defaults] -= PROTOTYPE_JS + ['rails']
    #       config.action_view.javascript_expansions[:defaults] |= jq_defaults + ['jquery_ujs']
    #     end
    #   end
    # end
  end
end

root = File.join(File.dirname(__FILE__), "..")

Compass::Frameworks.register("sadui",
    :path => root,
    :stylesheets_directory => File.join(root, "scss")
)