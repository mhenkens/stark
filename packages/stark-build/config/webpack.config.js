"use strict";

const helpers = require("./helpers");
const buildUtils = require("./build-utils");
const fs = require("fs");

/**
 * Webpack Plugins
 */
const DefinePlugin = require("webpack/lib/DefinePlugin");
const ContextReplacementPlugin = require("webpack/lib/ContextReplacementPlugin");
const WebpackMonitor = require("webpack-monitor");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// const WriteFilePlugin = require("write-file-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
// const InlineManifestWebpackPlugin = require("inline-manifest-webpack-plugin");
// const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const webpackMerge = require("webpack-merge");
const METADATA = require("./webpack-metadata").METADATA;

const fixedTSLintConfig = buildUtils.getFixedTSLintConfig(
	buildUtils.get(buildUtils.ANGULAR_APP_CONFIG.config, "architect.lint.options.tslintConfig", "tslint.json")
);

// Dev custom config
const webpackCustomConfig = require(helpers.root("config/webpack-custom-config.dev.json"));

// Directives to be used in CSP header
const cspDirectives = [
	"base-uri 'self'",
	// "default-src 'self'", // FIXME: enable as soon as the issue is fixed in Angular (https://github.com/angular/angular-cli/issues/6872 )
	"child-src 'self'",
	"connect-src 'self' ws://" + METADATA.HOST + ":" + METADATA.PORT + " " + webpackCustomConfig["cspConnectSrc"], // ws://HOST:PORT" is due to Webpack
	`font-src 'self' ${webpackCustomConfig["cspFontSrc"] || ""}`,
	"form-action 'self' " + webpackCustomConfig["cspFormAction"],
	"frame-src 'self'", // deprecated. Use child-src instead. Used here because child-src is not yet supported by Firefox. Remove as soon as it is fully supported
	"frame-ancestors 'none'", // the app will not be allowed to be embedded in an iframe (roughly equivalent to X-Frame-Options: DENY)
	"img-src 'self' data: image/png", // data: image/png is due to ui-router visualizer loading PNG images
	"media-src 'self'",
	"object-src 'self'",
	"plugin-types application/pdf" // valid mime-types for plugins invoked via <object> and <embed>
	// "script-src 'self'", // FIXME: enable as soon as the issue is fixed in Angular (https://github.com/angular/angular-cli/issues/6872 )
	// "style-src 'self' 'nonce-uiroutervisualizer' 'nonce-cef324d21ec5483c8819cc7a5e33c4a2'" // we define the same nonce value as in the style-loader // FIXME: DomSharedStylesHost.prototype._addStylesToHost in platform-browser.js adds inline style!
];

/**
 * Custom extra configuration for Webpack, in addition to Angular CLI Webpack configuration.
 * See: https://github.com/just-jeb/angular-builders/tree/8.x.x/packages/custom-webpack#custom-webpack-config-function
 *
 * @param config The Webpack configuration by Angular CLI
 * @param options - The options defined in angular.json
 */
module.exports = (config, options) => {
	const MONITOR = !!process.env.MONITOR; // env MONITOR variable set via cross-env
	const BUNDLE_ANALYZER = !!process.env.BUNDLE_ANALYZER; // env BUNDLE_ANALYZER variable set via cross-env

	return webpackMerge(config, {
		/**
		 * Stats lets you precisely control what bundle information gets displayed
		 * reference: https://webpack.js.org/configuration/stats/
		 */
		stats: Object.assign(
			{
				assets: true,
				children: true,
				chunks: true,
				chunkModules: false,
				chunkOrigins: false,
				colors: true,
				errors: true,
				errorDetails: true, // display error details. Same as the --show-error-details flag,
				hash: true,
				modules: true,
				moduleTrace: true,
				performance: true,
				reasons: false,
				source: true,
				timings: true,
				version: true,
				warnings: true
			},
			METADATA.ENV === "production"
				? {
						chunkModules: true,
						chunkOrigins: true,
						reasons: true,
						maxModules: Infinity, // examine all modules (ModuleConcatenationPlugin debugging)
						optimizationBailout: true // display bailout reasons (ModuleConcatenationPlugin debugging)
				  }
				: {}
		),

		/**
		 * Options affecting the normal modules.
		 *
		 * See: https://webpack.js.org/configuration/module
		 */
		module: {
			rules: [
				/**
				 * TSLint loader support for *.ts files
				 * @see https://github.com/wbuchwalter/tslint-loader
				 */
				{
					enforce: "pre",
					test: /\.ts$/,
					use: [
						{
							loader: "tslint-loader",
							options: {
								typeCheck: false, // FIXME enable type checking when it is improved in tslint-loader (https://github.com/wbuchwalter/tslint-loader/pull/114)
								tsconfig: buildUtils.ANGULAR_APP_CONFIG.buildOptions.tsconfig || "tsconfig.json",
								configFile: fixedTSLintConfig //FIXME use the configured tslint.json when type checking is enabled
							}
						}
					],
					exclude: [helpers.root("node_modules")]
				},

				/**
				 * Prevent any external library from breaking support for Internet Explorer 11 (see https://github.com/NationalBankBelgium/stark/issues/900)
				 * Therefore, only certain libraries in 'node_modules' (except the biggest ones and the ones from NBB) are transpiled to ES5 with Babel
				 * reference: https://github.com/babel/babel-loader
				 */
				...(METADATA.ENV === "development"
					? [
							{
								test: /node_modules.*\.js$/,
								exclude: /node_modules.*(@angular|@mdi|@ng-idle|@nationalbankbelgium|@ngrx|@ngx-translate|@uirouter|cerialize|class-validator|core-js|google-libphonenumber|ibantools|lodash|prettier|rxjs)/,
								use: {
									loader: "babel-loader",
									options: {
										presets: [
											[
												"@babel/preset-env",
												{
													// Environments you support/target. See https://babeljs.io/docs/en/babel-preset-env#targets
													targets: { ie: "11" }
												}
											]
										]
									}
								}
							}
					  ]
					: [])
			]
		},

		/**
		 * Add additional plugins to the compiler.
		 *
		 * See: https://webpack.js.org/configuration/plugins
		 */
		plugins: [
			// TODO: cannot enable this WriteFilePlugin due to Error: Content and Map of this Source is no longer available (only size() is supported)
			// /**
			//  * Plugin: WriteFilePlugin
			//  * Description: This plugin makes sure that bundles and assets are written to disk
			//  * this is necessary so that assets are available in dev mode
			//  * See: https://www.npmjs.com/package/write-file-webpack-plugin
			//  */
			// new WriteFilePlugin(),

			/**
			 * Plugin: DefinePlugin
			 * Description: Define free variables.
			 * Useful for having development builds with debug logging or adding global constants.
			 *
			 * Environment helpers
			 * IMPORTANT: when adding more properties make sure you include them in typings/environment.d.ts
			 *
			 * See: https://webpack.js.org/plugins/define-plugin
			 */
			new DefinePlugin({
				ENV: JSON.stringify(METADATA.ENV),
				HMR: METADATA.HMR,
				AOT: METADATA.AOT, // TODO: is this needed?
				"process.env": {
					ENV: JSON.stringify(METADATA.ENV),
					NODE_ENV: JSON.stringify(METADATA.ENV),
					HMR: METADATA.HMR
				}
			}),

			/**
			 * Plugin: InlineManifestWebpackPlugin
			 * Inline Webpack's manifest.js in index.html
			 *
			 * https://github.com/szrenwei/inline-manifest-webpack-plugin
			 */
			// TODO evaluate this
			// new InlineManifestWebpackPlugin(),

			/**
			 * Plugin: WriteFilePlugin
			 * Description: This plugin makes sure that bundles and assets are written to disk
			 * this is necessary so that assets are available in dev mode
			 * See: https://www.npmjs.com/package/write-file-webpack-plugin
			 */
			// TODO evaluate this
			// new WriteFilePlugin(),

			/**
			 * Plugin: ContextReplacementPlugin
			 * Description: allows to override the inferred information in a 'require' context
			 * Including only a certain set of Moment locales
			 *
			 * See: https://webpack.js.org/plugins/context-replacement-plugin/
			 */
			// TODO Change with moment-locales-webpack-plugin
			new ContextReplacementPlugin(/moment[\/\\]locale$/, /(de|fr|en-gb|nl|nl-be)\.js/),

			/**
			 * Plugin: WebpackMonitor
			 * Description: Gives information about the bundle size
			 * See: https://github.com/webpackmonitor/webpackmonitor
			 */
			...(MONITOR
				? [
						new WebpackMonitor({
							capture: true, // -> default 'true'
							target: helpers.root("reports/webpack-monitor/stats.json"), // default -> '../monitor/stats.json'
							launch: true, // -> default 'false'
							port: 3030, // default 8081
							excludeSourceMaps: true // default 'true'
						})
				  ]
				: []),

			/**
			 * Plugin: BundleAnalyzerPlugin
			 * Description: Visualizes size of webpack output files with an interactive zoomable treemap.
			 * See: https://github.com/webpack-contrib/webpack-bundle-analyzer
			 */
			...(BUNDLE_ANALYZER
				? [
						new BundleAnalyzerPlugin({
							generateStatsFile: true, // default 'false'
							statsFilename: helpers.root("reports/bundle-analyzer/stats.json"), // default -> 'stats.json'
							openAnalyzer: true, //default 'true'
							analyzerPort: 3030 // default 8888
						})
				  ]
				: []),

			/**
			 * Plugin: Stylelint
			 * Description: Lints the stylesheets loaded in the app (pcss, scss, css, sass)
			 * See: https://github.com/webpack-contrib/stylelint-webpack-plugin
			 */
			...(fs.existsSync(helpers.root(".stylelintrc")) ? [new StylelintPlugin({
				configFile: ".stylelintrc",
				emitErrors: true,
				emitWarning: true,
				failOnError: false,
				files: ["src/**/*.?(pc|sc|c|sa)ss"] // pcss|scss|css|sass
			})] : []),
		],

		/**
		 * Webpack Development Server configuration
		 * Description: The webpack-dev-server is a little node.js Express server.
		 * The server emits information about the compilation state to the client,
		 * which reacts to those events.
		 *
		 * See: https://webpack.github.io/docs/webpack-dev-server.html
		 */
		...(METADATA.IS_DEV_SERVER
			? {
					devServer: {
						compress: true,

						// HTML5 History API support: no need for # in URLs
						// automatically redirect 404 errors to the index.html page
						// uses connect-history-api-fallback behind the scenes: https://github.com/bripkens/connect-history-api-fallback
						// reference: http://jaketrent.com/post/pushstate-webpack-dev-server/
						// historyApiFallback: true,

						// Can be used to add specific headers
						headers: {
							// enable CORS
							"Access-Control-Allow-Origin": "*",

							// TODO: enable CSP
							// CSP header (and its variants per browser)
							"Content-Security-Policy": cspDirectives.join(" ; "),
							"X-Content-Security-Policy": cspDirectives.join(" ; "),
							"X-WebKit-CSP": cspDirectives.join(" ; "),

							// Other security headers

							// protect against clickjacking: https://en.wikipedia.org/wiki/Clickjacking
							// reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/X-Frame-Options
							"X-Frame-Options": "deny",

							// enable some protection against XSS
							// reference: https://www.owasp.org/index.php/List_of_useful_HTTP_headers
							"X-Xss-Protection": "1; mode=block",

							// protect against drive-by download attacks and user uploaded content that could be treated by Internet Explorer as executable or dynamic HTML files
							// reference: https://www.owasp.org/index.php/List_of_useful_HTTP_headers
							"X-Content-Type-Options": "nosniff"
						}
					}
			  }
			: {})
	});
};
