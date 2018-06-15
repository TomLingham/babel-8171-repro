module.exports = function(babel) {
  var t = babel.types;

  var SEEN_SYMBOL = Symbol();

  return {
    visitor: {
      CallExpression: {
        enter: function(path) {
          var node = path.node;
          if (node[SEEN_SYMBOL]) return;

          if (path.get('callee').isIdentifier({name: 'invariant'})) {
            var condition = node.arguments[0];



            var devInvariant = t.callExpression(
              node.callee,
              [t.booleanLiteral(false)]
            );
            devInvariant[SEEN_SYMBOL] = true;

            var prodInvariant = t.callExpression(
              node.callee,
              [t.booleanLiteral(false)]
            );
            prodInvariant[SEEN_SYMBOL] = true;



            path.replaceWith(t.ifStatement(
              t.binaryExpression(
                '===',
                t.stringLiteral('foo'),
                t.stringLiteral('bar')
              ),
              t.blockStatement([
                t.expressionStatement(devInvariant),
              ]),
              t.blockStatement([
                t.expressionStatement(prodInvariant),
              ])
            ));
          }
        },
      },
    },
  };
};
