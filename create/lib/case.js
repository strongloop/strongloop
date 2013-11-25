/**
 * Expose `pascal` and `camel`.
 */

exports.pascalCase = pascal;
exports.camelCase = camel;


/**
 * Convert the given `str` into PascalCase.
 *
 * @param {Object} options
 * @return {Pascal}
 */

function pascal(str) {
  return str
    .replace(/\W|_/g, ' ')
    .replace(/(\w)(\w*)/g, function (g0,g1,g2) {
      return g1.toUpperCase() + g2.toLowerCase();
    })
    .replace(/\s/g, '');
}

function camel(str) {
  str = pascal(str);
  str = str.split('');
  str[0] = str[0].toLowerCase();
  return str.join('');
}
