'use strict';
const path = require('path');
const gutil = require('gulp-util');
const through = require('through2');
const Yazl = require('yazl');
const getStream = require('get-stream');

module.exports = (filename, opts) => {
	if (!filename) {
		throw new gutil.PluginError('gulp-zip', '`filename` required');
	}

	opts = Object.assign({
		compress: true
	}, opts);

	let firstFile;
	const zip = new Yazl.ZipFile();

	return through.obj((file, enc, cb) => {
		if (!firstFile) {
			firstFile = file;
		}

		// Because Windows...
		const pathname = file.relative.replace(/\\/g, '/');

		if (!pathname) {
			cb();
			return;
		}

		if (file.isNull() && file.stat && file.stat.isDirectory && file.stat.isDirectory()) {
			zip.addEmptyDirectory(pathname, {
				mtime: file.stat.mtime || new Date(),
				mode: file.stat.mode
			});
		} else {
			const stat = {
				compress: opts.compress,
				mtime: file.stat ? file.stat.mtime : new Date(),
				mode: file.stat ? file.stat.mode : null
			};

			if (file.isStream()) {
				zip.addReadStream(file.contents, pathname, stat);
			}

			if (file.isBuffer()) {
				zip.addBuffer(file.contents, pathname, stat);
			}
		}

		cb();
	}, function (cb) {
		if (!firstFile) {
			cb();
			return;
		}

		getStream.buffer(zip.outputStream).then(data => {
			this.push(new gutil.File({
				cwd: firstFile.cwd,
				base: firstFile.base,
				path: path.join(firstFile.base, filename),
				contents: data
			}));

			cb(); // eslint-disable-line promise/no-callback-in-promise
		});

		zip.end();
	});
};
