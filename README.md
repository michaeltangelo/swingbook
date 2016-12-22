## SwingBook
<h3>5...6...7...8</h3>

*Created by Michael Tan*

SwingBook is a social platform to connect the Swing Dance community, world wide. Find out what's happening *tonight* and which friends are going. Classes throughout the city will be listed -- beginners welcome!. Featuring the ability view and attend events within your area (currently limited to NYC). The 'Swing DJ' section also provides a way to stream specific tempos of music to practice and/or queue up for a social dance.

SwingBook is currently in development, but a temporary version of the app is available at [swingbook.io](http://www.swingbook.io).

## Requirements

* node `6.4.x`+
* npm `3.9.x`+

## Development

    $ git clone https://github.com/michaeltangelo/swingbook.git
    $ npm install
    $ npm run start

As of 12/21/2016, SwingBook's master branch is a simple express app using handlebars as a templating framework. SwingBook is currently in the process of being converted to Angular. The folder structure for the project places all Angular components inside `app/`. Angular components including views, controllers, and css pages can be found inside `app/components`, shared classes and services can be found within `app/shared`, and all assets are located inside the `assets/` folder. As of 12/21/2016 on the *angular* branch, routes are being handled inside `app.js` as well as `routes/index.js`.

## FAQ

**Why is this the only question on the FAQ?** Because I have no answers yet.

## Troubleshooting

At this point, anything goes. You're on your own.

## License & Acknowledgements

SwingBook is released under the [MIT license](https://github.com/michaeltangelo/swingbook/blob/master/LICENSE). Huge thanks to [Anthony](https://github.com/aksperiod) and [Kenneth](https://github.com/kensworth) for constant web dev support and Anthony's app [Polycritic](https://github.com/aksperiod/Polycritic) for a lot of beautiful Angular code examples.
