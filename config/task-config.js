module.exports = {
  html        : true,
  images      : true,
  fonts       : true,
  static      : true,
  svgSprite   : true,
  ghPages     : false,
  stylesheets : true,

  javascripts: {
    entry: {
      // files paths are relative to
      // javascripts.dest in path-config.json
      app: ["./app.js"]
    }
  },

  browserSync: {
    server: {
      // should match `dest` in
      // path-config.json
      baseDir: 'public'
    }
  },

  production: {
    rev: true
  },

  stylesheets: {
    extensions: ["sass", "scss", "css"],
    alternateTask: function (gulp, PATH_CONFIG, TASK_CONFIG) {
    // PostCSS task instead of Sass
    const browserSync = require('browser-sync');
    const postcss = require('gulp-postcss');
    const tailwindcss = require('tailwindcss');
    const sass = require('gulp-sass');
    const gulpif = require('gulp-if');
    const sourcemaps = require('gulp-sourcemaps');
    const path = require('path');
    const cssnano = require('gulp-cssnano')

		return function () {
			const plugins = [
				tailwindcss('./../../tailwind.js'),
				require('autoprefixer')
			];
			const paths = {
				src: path.resolve(process.env.INIT_CWD, PATH_CONFIG.src, PATH_CONFIG.stylesheets.src, '**/*.{' + TASK_CONFIG.stylesheets.extensions + '}'),
        dest: path.resolve(process.env.INIT_CWD, PATH_CONFIG.dest, PATH_CONFIG.stylesheets.dest)
			};

			return gulp
				.src(paths.src)
				.pipe(gulpif(!global.production, sourcemaps.init()))
				.pipe(sass(TASK_CONFIG.stylesheets.sass))
        .pipe(postcss(plugins))
        //.on('error', handleErrors)
        .pipe(gulpif(global.production, cssnano(TASK_CONFIG.stylesheets.cssnano)))
				.pipe(gulpif(!global.production, sourcemaps.write()))
				.pipe(gulp.dest(paths.dest))
				.pipe(browserSync.stream());
		};
	}
  }
}
