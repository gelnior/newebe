exports.config =
    # See docs at http://brunch.readthedocs.org/en/latest/config.html.
    coffeelint:
       pattern: /^app\/.*\.coffee$/
       options:
           indentation:
               value: 4
               level: "error"

    files:
        javascripts:
            joinTo:
                'javascripts/app.js': /^app/
                'javascripts/vendor.js': /^vendor/
                'test/javascripts/test.js': /^test(\/|\\)(?!vendor)/
                'test/javascripts/test-vendor.js': /^test(\/|\\)(?=vendor)/
            order:
                # Files in `vendor` directories are compiled before other files
                # even if they aren't specified in order.
                before: [
                    'vendor/scripts/jquery-2.0.2.js'
                    'vendor/scripts/lodash-2.4.1.js'
                    'vendor/scripts/backbone-1.1.2.js'
                ]

        stylesheets:
            joinTo: 'stylesheets/app.css'
            order:
                before: ['vendor/styles/normalize.css']
                after: ['vendor/styles/helpers.css']

        templates:
            defaultExtension: 'jade'
            joinTo: 'javascripts/app.js'
