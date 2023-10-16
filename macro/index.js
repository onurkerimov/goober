const {readFileSync, writeFileSync} = require('fs');
const {basename, relative} = require('path');
const {createMacro} = require('babel-plugin-macros');
const {addSideEffect, addNamed} = require('@babel/helper-module-imports');
const CallExpression = require('./visitors/CallExpression');
const StyleSheet = require('./StyleSheet');

const checkType = (path, type) => {
  if (path.parentPath.type !== type)
    throw new Error(
      `itches/macro/${path.node.name} can only be used as ${type}. You tried ${path.parentPath.type}.`
    );
};

module.exports = createMacro(({ references, state, babel }) => {
  const {types} = babel;
  const program = state.file.path;
  const cssRefs = references.css || [];
  const stylesRefs = references.styles || [];

  const styleSheet = new StyleSheet();

  Object.assign(state, {styleSheet});

  cssRefs.forEach(ref => {
    checkType(ref, 'CallExpression');
    CallExpression(ref.parentPath, state, types);
  });

  Object.keys(references).forEach((refName) => {
    const id = addNamed(program, refName, 'itches/runtime');
    references[refName].forEach((referencePath) => {
        referencePath.node.name = id.name;
    });
  });

  // remove variable declarations of css``;
  // cssRefs.forEach(ref => {
  //   ref.parentPath.parentPath.remove();
  // });

  const filename = state.file.opts.filename;

  // choose a file to save the styles
  const outputFilename = relative(process.cwd(), filename.replace(/\.[^.]+$/, '.zero.css'));

  // include this file as an import to the referenced module, so that css-loader can pick it up at bundle-time
  addSideEffect(stylesRefs[0], './' + basename(outputFilename));

  // combine all the used styles
  const cssText = styleSheet.toString();

  // Read the file first to compare the content
  // Write the new content only if it's changed
  // This will prevent unnecessary reloads
  let currentCssText;

  try {
    currentCssText = readFileSync(outputFilename, 'utf-8');
  } catch (e) {
    // Ignore error
  }

  // if the files hasn't changed, nothing more to do
  if (currentCssText === cssText) return;

  writeFileSync(outputFilename, cssText);
});