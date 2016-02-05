/* global CleanCSS */

(function(global) {
  'use strict';

  var log, HTMLParser;
  if (global.console && global.console.log) {
    log = function(message) {
      // "preserving" `this`
      global.console.log(message);
    };
  }
  else {
    log = function() {};
  }

  if (global.HTMLParser) {
    HTMLParser = global.HTMLParser;
  }
  else if (typeof require === 'function') {
    HTMLParser = require('./htmlparser').HTMLParser;
  }

  var trimWhitespace = function(str) {
    if (typeof str !== 'string') {
      return str;
    }
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  };
  if (String.prototype.trim) {
    trimWhitespace = function(str) {
      if (typeof str !== 'string') {
        return str;
      }
      return str.trim();
    };
  }

  function collapseWhitespace(str) {
    return str ? str.replace(/[\t\n\r ]+/g, ' ') : str;
  }

  function createMap(values) {
    var map = {};
    values.forEach(function(value) {
      map[value] = 1;
    });
    return map;
  }

  // array of non-empty element tags that will maintain a single space outside of them
  var inlineTags = createMap([
    'a', 'abbr', 'acronym', 'b', 'bdi', 'bdo', 'big', 'button', 'cite',
    'code', 'del', 'dfn', 'em', 'font', 'i', 'ins', 'kbd', 'mark', 'math',
    'q', 'rt', 'rp', 's', 'samp', 'small', 'span', 'strike', 'strong',
    'sub', 'sup', 'svg', 'time', 'tt', 'u', 'var'
  ]);

  function collapseWhitespaceSmart(str, prevTag, nextTag, options) {
    var lineBreakBefore = '', lineBreakAfter = '';

    if (options.preserveLineBreaks) {
      str = str.replace(/^[\t ]*[\n\r]+[\t\n\r ]*/, function() {
        lineBreakBefore = '\n';
        return '';
      }).replace(/[\t\n\r ]*[\n\r]+[\t ]*$/, function() {
        lineBreakAfter = '\n';
        return '';
      });
    }

    if (prevTag && prevTag !== 'img' && prevTag !== 'input' && (prevTag.charAt(0) !== '/'
      || options.collapseInlineTagWhitespace || inlineTags[prevTag.substr(1)] !== 1)) {
      str = str.replace(/^\s+/, !options.preserveLineBreaks && options.conservativeCollapse ? ' ' : '');
    }

    if (nextTag && nextTag !== 'img' && nextTag !== 'input' && (nextTag.charAt(0) === '/'
      || options.collapseInlineTagWhitespace || inlineTags[nextTag] !== 1)) {
      str = str.replace(/\s+$/, !options.preserveLineBreaks && options.conservativeCollapse ? ' ' : '');
    }

    if (prevTag && nextTag) {
      // strip non space whitespace then compress spaces to one
      str = str.replace(/[\t\n\r ]+/g, ' ');
    }

    return lineBreakBefore + str + lineBreakAfter;
  }

  function isConditionalComment(text) {
    return ((/\[if[^\]]+\]/).test(text) || (/\s*((?:<!)?\[endif\])$/).test(text));
  }

  function isIgnoredComment(text, options) {
    if (/^!/.test(text)) {
      return true;
    }

    if (options.ignoreCustomComments) {
      for (var i = 0, len = options.ignoreCustomComments.length; i < len; i++) {
        if (options.ignoreCustomComments[i].test(text)) {
          return true;
        }
      }
    }

    return false;
  }

  function isEventAttribute(attrName, options) {
    var patterns = options.customEventAttributes;
    if (patterns) {
      for (var i = patterns.length; i--;) {
        if (patterns[i].test(attrName)) {
          return true;
        }
      }
      return false;
    }
    else {
      return (/^on[a-z]{3,}$/).test(attrName);
    }
  }

  function canRemoveAttributeQuotes(value) {
    // http://mathiasbynens.be/notes/unquoted-attribute-values
    return (/^[^\x20\t\n\f\r"'`=<>]+$/).test(value);
  }

  function attributesInclude(attributes, attribute) {
    for (var i = attributes.length; i--;) {
      if (attributes[i].name.toLowerCase() === attribute) {
        return true;
      }
    }
    return false;
  }

  function isAttributeRedundant(tag, attrName, attrValue, attrs) {
    attrValue = attrValue ? trimWhitespace(attrValue.toLowerCase()) : '';

    return (
        (tag === 'script' &&
        attrName === 'language' &&
        attrValue === 'javascript') ||

        (tag === 'form' &&
        attrName === 'method' &&
        attrValue === 'get') ||

        (tag === 'input' &&
        attrName === 'type' &&
        attrValue === 'text') ||

        (tag === 'script' &&
        attrName === 'charset' &&
        !attributesInclude(attrs, 'src')) ||

        (tag === 'a' &&
        attrName === 'name' &&
        attributesInclude(attrs, 'id')) ||

        (tag === 'area' &&
        attrName === 'shape' &&
        attrValue === 'rect')
    );
  }

  function isScriptTypeAttribute(tag, attrName, attrValue) {
    return (
      tag === 'script' &&
      attrName === 'type' &&
      trimWhitespace(attrValue.toLowerCase()) === 'text/javascript'
    );
  }

  // https://mathiasbynens.be/demo/javascript-mime-type
  // https://developer.mozilla.org/en/docs/Web/HTML/Element/script#attr-type
  var executableScriptsMimetypes = createMap([
    'text/javascript',
    'text/ecmascript',
    'text/jscript',
    'application/javascript',
    'application/x-javascript',
    'application/ecmascript'
  ]);

  function isExecutableScript(tag, attrs) {
    if (tag !== 'script') {
      return false;
    }
    for (var i = 0, len = attrs.length; i < len; i++) {
      var attrName = attrs[i].name.toLowerCase();
      if (attrName === 'type') {
        var attrValue = attrs[i].value;
        return attrValue === '' || executableScriptsMimetypes[attrValue] === 1;
      }
    }
    return true;
  }

  function isStyleLinkTypeAttribute(tag, attrName, attrValue) {
    return (
      (tag === 'style' || tag === 'link') &&
      attrName === 'type' &&
      trimWhitespace(attrValue.toLowerCase()) === 'text/css'
    );
  }

  var enumeratedAttributeValues = {
    draggable: ['true', 'false'] // defaults to 'auto'
  };

  function isBooleanAttribute(attrName, attrValue) {
    var isSimpleBoolean = (/^(?:allowfullscreen|async|autofocus|autoplay|checked|compact|controls|declare|default|defaultchecked|defaultmuted|defaultselected|defer|disabled|enabled|formnovalidate|hidden|indeterminate|inert|ismap|itemscope|loop|multiple|muted|nohref|noresize|noshade|novalidate|nowrap|open|pauseonexit|readonly|required|reversed|scoped|seamless|selected|sortable|truespeed|typemustmatch|visible)$/i).test(attrName);
    if (isSimpleBoolean) {
      return true;
    }

    var attrValueEnumeration = enumeratedAttributeValues[attrName.toLowerCase()];
    if (!attrValueEnumeration) {
      return false;
    }
    else {
      return (-1 === attrValueEnumeration.indexOf(attrValue.toLowerCase()));
    }
  }

  function isUriTypeAttribute(attrName, tag) {
    return (
      ((/^(?:a|area|link|base)$/).test(tag) && attrName === 'href') ||
      (tag === 'img' && (/^(?:src|longdesc|usemap)$/).test(attrName)) ||
      (tag === 'object' && (/^(?:classid|codebase|data|usemap)$/).test(attrName)) ||
      (tag === 'q' && attrName === 'cite') ||
      (tag === 'blockquote' && attrName === 'cite') ||
      ((tag === 'ins' || tag === 'del') && attrName === 'cite') ||
      (tag === 'form' && attrName === 'action') ||
      (tag === 'input' && (attrName === 'src' || attrName === 'usemap')) ||
      (tag === 'head' && attrName === 'profile') ||
      (tag === 'script' && (attrName === 'src' || attrName === 'for'))
    );
  }

  function isNumberTypeAttribute(attrName, tag) {
    return (
      ((/^(?:a|area|object|button)$/).test(tag) && attrName === 'tabindex') ||
      (tag === 'input' && (attrName === 'maxlength' || attrName === 'tabindex')) ||
      (tag === 'select' && (attrName === 'size' || attrName === 'tabindex')) ||
      (tag === 'textarea' && (/^(?:rows|cols|tabindex)$/).test(attrName)) ||
      (tag === 'colgroup' && attrName === 'span') ||
      (tag === 'col' && attrName === 'span') ||
      ((tag === 'th' || tag === 'td') && (attrName === 'rowspan' || attrName === 'colspan'))
    );
  }

  function isCanonicalURL(tag, attrs) {
    if (tag !== 'link') {
      return false;
    }
    for (var i = 0, len = attrs.length; i < len; i++) {
      if (attrs[i].name === 'rel' && attrs[i].value === 'canonical') {
        return true;
      }
    }
  }

  var fnPrefix = '!function(){';
  var fnSuffix = '}();';

  function cleanAttributeValue(tag, attrName, attrValue, options, attrs) {
    if (attrValue && isEventAttribute(attrName, options)) {
      attrValue = trimWhitespace(attrValue).replace(/^javascript:\s*/i, '').replace(/\s*;$/, '');
      if (options.minifyJS) {
        var minified = minifyJS(fnPrefix + attrValue + fnSuffix, options.minifyJS);
        return minified.slice(fnPrefix.length, -fnSuffix.length);
      }
      return attrValue;
    }
    else if (attrName === 'class') {
      return collapseWhitespace(trimWhitespace(attrValue));
    }
    else if (isUriTypeAttribute(attrName, tag)) {
      attrValue = trimWhitespace(attrValue);
      if (options.minifyURLs && !isCanonicalURL(tag, attrs)) {
        return minifyURLs(attrValue, options.minifyURLs);
      }
      return attrValue;
    }
    else if (isNumberTypeAttribute(attrName, tag)) {
      return trimWhitespace(attrValue);
    }
    else if (attrName === 'style') {
      attrValue = trimWhitespace(attrValue);
      if (attrValue) {
        attrValue = attrValue.replace(/\s*;\s*$/, '');
      }
      if (options.minifyCSS) {
        return minifyCSS(attrValue, options.minifyCSS, true);
      }
      return attrValue;
    }
    else if (isMetaViewport(tag, attrs) && attrName === 'content') {
      attrValue = attrValue.replace(/\s+/g, '').replace(/[0-9]+\.[0-9]+/g, function(numString) {
        // "0.90000" -> "0.9"
        // "1.0" -> "1"
        // "1.0001" -> "1.0001" (unchanged)
        return (+numString).toString();
      });
    }
    else if (attrValue && options.customAttrCollapse && options.customAttrCollapse.test(attrName)) {
      attrValue = attrValue.replace(/\n+|\r+|\s{2,}/g, '');
    }
    return attrValue;
  }

  function isMetaViewport(tag, attrs) {
    if (tag !== 'meta') {
      return false;
    }
    for (var i = 0, len = attrs.length; i < len; i++) {
      if (attrs[i].name === 'name' && attrs[i].value === 'viewport') {
        return true;
      }
    }
  }

  // Wrap CSS declarations for CleanCSS > 3.x
  // See https://github.com/jakubpawlowicz/clean-css/issues/418
  function wrapCSS(text) {
    return '*{' + text + '}';
  }

  function unwrapCSS(text) {
    var matches = text.match(/^\*\{([\s\S]*)\}$/m);
    if (matches && matches[1]) {
      return matches[1];
    }
    else {
      return text;
    }
  }

  function cleanConditionalComment(comment) {
    return comment
      .replace(/^(\[[^\]]+\]>)\s*/, '$1')
      .replace(/\s*(<!\[endif\])$/, '$1');
  }

  function removeCDATASections(text) {
    return text
      // "/* <![CDATA[ */" or "// <![CDATA["
      .replace(/^(?:\s*\/\*\s*<!\[CDATA\[\s*\*\/|\s*\/\/\s*<!\[CDATA\[.*)/, '')
      // "/* ]]> */" or "// ]]>"
      .replace(/(?:\/\*\s*\]\]>\s*\*\/|\/\/\s*\]\]>)\s*$/, '');
  }

  function processScript(text, options, currentAttrs) {
    for (var i = 0, len = currentAttrs.length; i < len; i++) {
      if (currentAttrs[i].name.toLowerCase() === 'type' &&
          options.processScripts.indexOf(currentAttrs[i].value) > -1) {
        return minify(text, options);
      }
    }
    return text;
  }

  var reStartDelimiter = {
    // account for js + html comments (e.g.: //<!--)
    script: /^\s*(?:\/\/)?\s*<!--.*\n?/,
    style: /^\s*<!--\s*/
  };
  var reEndDelimiter = {
    script: /\s*(?:\/\/)?\s*-->\s*$/,
    style: /\s*-->\s*$/
  };
  function removeComments(text, tag) {
    return text.replace(reStartDelimiter[tag], '').replace(reEndDelimiter[tag], '');
  }

  function isOptionalTag(tag) {
    return (/^(?:html|t?body|t?head|tfoot|tr|td|th|dt|dd|option|colgroup|source|track)$/).test(tag);
  }

  var reEmptyAttribute = new RegExp(
    '^(?:class|id|style|title|lang|dir|on(?:focus|blur|change|click|dblclick|mouse(' +
      '?:down|up|over|move|out)|key(?:press|down|up)))$');

  function canDeleteEmptyAttribute(tag, attrName, attrValue) {
    var isValueEmpty = !attrValue || (/^\s*$/).test(attrValue);
    if (isValueEmpty) {
      return (
        (tag === 'input' && attrName === 'value') ||
        reEmptyAttribute.test(attrName));
    }
    return false;
  }

  function canRemoveElement(tag, attrs) {
    if (tag === 'textarea') {
      return false;
    }

    if (tag === 'script') {
      for (var i = attrs.length - 1; i >= 0; i--) {
        if (attrs[i].name === 'src') {
          return false;
        }
      }
    }

    return true;
  }

  function canCollapseWhitespace(tag) {
    return !(/^(?:script|style|pre|textarea)$/.test(tag));
  }

  function canTrimWhitespace(tag) {
    return !(/^(?:pre|textarea)$/.test(tag));
  }

  function normalizeAttribute(attr, attrs, tag, hasUnarySlash, index, options, isLast) {

    var attrName = options.caseSensitive ? attr.name : attr.name.toLowerCase(),
        attrValue = attr.value,
        attrQuote = attr.quote,
        attrFragment,
        emittedAttrValue;

    if ((options.removeRedundantAttributes &&
      isAttributeRedundant(tag, attrName, attrValue, attrs))
      ||
      (options.removeScriptTypeAttributes &&
      isScriptTypeAttribute(tag, attrName, attrValue))
      ||
      (options.removeStyleLinkTypeAttributes &&
      isStyleLinkTypeAttribute(tag, attrName, attrValue))) {
      return '';
    }

    attrValue = cleanAttributeValue(tag, attrName, attrValue, options, attrs);

    if (options.removeEmptyAttributes &&
        canDeleteEmptyAttribute(tag, attrName, attrValue)) {
      return '';
    }

    if (attrValue !== undefined && !options.removeAttributeQuotes ||
        !canRemoveAttributeQuotes(attrValue)) {
      if (!options.preventAttributesEscaping) {
        if (options.quoteCharacter !== undefined) {
          attrQuote = options.quoteCharacter === '\'' ? '\'' : '"';
        }
        else {
          var apos = (attrValue.match(/'/g) || []).length;
          var quot = (attrValue.match(/"/g) || []).length;
          attrQuote = apos < quot ? '\'' : '"';
        }
        if (attrQuote === '"') {
          attrValue = attrValue.replace(/"/g, '&#34;');
        }
        else {
          attrValue = attrValue.replace(/'/g, '&#39;');
        }
      }
      emittedAttrValue = attrQuote + attrValue + attrQuote;
      if (!isLast && !options.removeTagWhitespace) {
        emittedAttrValue += ' ';
      }
    }
    // make sure trailing slash is not interpreted as HTML self-closing tag
    else if (isLast && !hasUnarySlash && !/\/$/.test(attrValue)) {
      emittedAttrValue = attrValue;
    }
    else {
      emittedAttrValue = attrValue + ' ';
    }

    if (attrValue === undefined || (options.collapseBooleanAttributes &&
        isBooleanAttribute(attrName, attrValue))) {
      attrFragment = attrName;
      if (!isLast) {
        attrFragment += ' ';
      }
    }
    else {
      attrFragment = attrName + attr.customAssign + emittedAttrValue;
    }

    return attr.customOpen + attrFragment + attr.customClose;
  }

  function setDefaultTesters(options) {

    var defaultTesters = ['canCollapseWhitespace', 'canTrimWhitespace'];

    for (var i = 0, len = defaultTesters.length; i < len; i++) {
      if (!options[defaultTesters[i]]) {
        options[defaultTesters[i]] = function() {
          return false;
        };
      }
    }
  }

  function minifyURLs(text, options) {
    if (typeof options !== 'object') {
      options = { };
    }

    try {
      // try to get global reference first
      var __RelateUrl = global.RelateUrl;

      if (typeof __RelateUrl === 'undefined' && typeof require === 'function') {
        __RelateUrl = require('relateurl');
      }

      // noop
      if (!__RelateUrl) {
        return text;
      }

      if (__RelateUrl.relate) {
        return __RelateUrl.relate(text, options);
      }
      else {
        return text;
      }
    }
    catch (err) {
      log(err);
    }
    return text;
  }

  function minifyJS(text, options) {
    if (typeof options !== 'object') {
      options = { };
    }
    options.fromString = true;
    var outputOptions = options.output || {};
    outputOptions.inline_script = true;
    options.output = outputOptions;

    try {
      // try to get global reference first
      var __UglifyJS = global.UglifyJS;

      if (typeof __UglifyJS === 'undefined' && typeof require === 'function') {
        __UglifyJS = require('uglify-js');
      }

      // noop
      if (!__UglifyJS) {
        return text;
      }

      if (__UglifyJS.minify) {
        return __UglifyJS.minify(text, options).code;
      }
      else if (__UglifyJS.parse) {

        var ast = __UglifyJS.parse(text);
        ast.figure_out_scope();

        var compressor = __UglifyJS.Compressor();
        var compressedAst = ast.transform(compressor);

        compressedAst.figure_out_scope();
        compressedAst.compute_char_frequency();

        if (options.mangle !== false) {
          compressedAst.mangle_names();
        }

        var stream = __UglifyJS.OutputStream(options.output);
        compressedAst.print(stream);

        return stream.toString();
      }
      else {
        return text;
      }
    }
    catch (err) {
      log(err);
    }
    return text;
  }

  function minifyCSS(text, options, inline) {
    if (typeof options !== 'object') {
      options = { };
    }
    if (typeof options.advanced === 'undefined') {
      options.advanced = false;
    }
    try {
      var cleanCSS;

      if (typeof CleanCSS !== 'undefined') {
        cleanCSS = new CleanCSS(options);
      }
      else if (typeof require === 'function') {
        var CleanCSSModule = require('clean-css');
        cleanCSS = new CleanCSSModule(options);
      }
      if (inline) {
        return unwrapCSS(cleanCSS.minify(wrapCSS(text)).styles);
      }
      else {
        return cleanCSS.minify(text).styles;
      }
    }
    catch (err) {
      log(err);
    }
    return text;
  }

  function uniqueId(value) {
    var id;
    do {
      id = Math.random().toString(36).slice(2);
    } while (~value.indexOf(id));
    return id;
  }

  function minify(value, options) {

    options = options || {};
    var optionsStack = [];

    value = trimWhitespace(value);
    setDefaultTesters(options);

    var results = [ ],
        buffer = [ ],
        currentChars = '',
        currentTag = '',
        currentAttrs = [],
        stackNoTrimWhitespace = [],
        stackNoCollapseWhitespace = [],
        lint = options.lint,
        t = Date.now(),
        ignoredMarkupChunks = [ ],
        ignoredCustomMarkupChunks = [ ],
        uidIgnore,
        uidAttr;

    if (~value.indexOf('<!-- htmlmin:ignore -->')) {
      uidIgnore = '<!--!' + uniqueId(value) + '-->';
      // temporarily replace ignored chunks with comments,
      // so that we don't have to worry what's there.
      // for all we care there might be
      // completely-horribly-broken-alien-non-html-emoj-cthulhu-filled content
      value = value.replace(/<!-- htmlmin:ignore -->([\s\S]*?)<!-- htmlmin:ignore -->/g, function(match, group1) {
        ignoredMarkupChunks.push(group1);
        return uidIgnore;
      });
    }

    if (options.ignoreCustomFragments) {
      uidAttr = uniqueId(value);
      var customFragments = options.ignoreCustomFragments.map(function(re) {
        return re.source;
      });
      var reCustomIgnore = new RegExp('\\s*(?:' + customFragments.join('|') + ')\\s*', 'g');
      // temporarily replace custom ignored fragments with unique attributes
      value = value.replace(reCustomIgnore, function(match) {
        ignoredCustomMarkupChunks.push(match);
        return ' ' + uidAttr + ' ';
      });
    }

    function _canCollapseWhitespace(tag, attrs) {
      return canCollapseWhitespace(tag) || options.canCollapseWhitespace(tag, attrs);
    }

    function _canTrimWhitespace(tag, attrs) {
      return canTrimWhitespace(tag) || options.canTrimWhitespace(tag, attrs);
    }

    new HTMLParser(value, {
      html5: typeof options.html5 !== 'undefined' ? options.html5 : true,

      start: function(tag, attrs, unary, unarySlash) {

        var lowerTag = tag.toLowerCase();

        if (lowerTag === 'svg') {
          optionsStack.push(options);
          var nextOptions = {};
          for (var key in options) {
            nextOptions[key] = options[key];
          }
          nextOptions.keepClosingSlash = true;
          nextOptions.caseSensitive = true;
          options = nextOptions;
        }

        tag = options.caseSensitive ? tag : lowerTag;

        currentTag = tag;
        currentChars = '';
        currentAttrs = attrs;

        // set whitespace flags for nested tags (eg. <code> within a <pre>)
        if (options.collapseWhitespace) {
          if (!_canTrimWhitespace(tag, attrs)) {
            stackNoTrimWhitespace.push(tag);
          }
          if (!_canCollapseWhitespace(tag, attrs)) {
            stackNoCollapseWhitespace.push(tag);
          }
        }

        var openTag = '<' + tag;
        var hasUnarySlash = unarySlash && options.keepClosingSlash;

        buffer.push(openTag);

        if (lint) {
          lint.testElement(tag);
        }

        var parts = [ ];
        var token, isLast = true;
        for (var i = attrs.length; --i >= 0; ) {
          if (lint) {
            lint.testAttribute(tag, attrs[i].name.toLowerCase(), attrs[i].value);
          }
          token = normalizeAttribute(attrs[i], attrs, tag, hasUnarySlash, i, options, isLast);
          if (token) {
            isLast = false;
            parts.unshift(token);
          }
        }
        if (parts.length > 0) {
          buffer.push(' ');
          buffer.push.apply(buffer, parts);
        }

        buffer.push(buffer.pop() + (hasUnarySlash ? '/' : '') + '>');
      },
      end: function(tag, attrs) {

        var lowerTag = tag.toLowerCase();
        if (lowerTag === 'svg') {
          options = optionsStack.pop();
        }

        // check if current tag is in a whitespace stack
        if (options.collapseWhitespace) {
          if (stackNoTrimWhitespace.length &&
            tag === stackNoTrimWhitespace[stackNoTrimWhitespace.length - 1]) {
            stackNoTrimWhitespace.pop();
          }
          if (stackNoCollapseWhitespace.length &&
            tag === stackNoCollapseWhitespace[stackNoCollapseWhitespace.length - 1]) {
            stackNoCollapseWhitespace.pop();
          }
        }

        var isElementEmpty = false;
        if (tag === currentTag) {
          currentTag = '';
          isElementEmpty = currentChars === '';
        }
        if (options.removeEmptyElements && isElementEmpty && canRemoveElement(tag, attrs)) {
          // remove last "element" from buffer, return
          for (var i = buffer.length - 1; i >= 0; i--) {
            if (/^<[^\/!]/.test(buffer[i])) {
              buffer.splice(i);
              break;
            }
          }
          return;
        }
        else if (options.removeOptionalTags && isOptionalTag(tag)) {
          // noop, leave start tag in buffer
          return;
        }
        else {
          // push end tag to buffer
          buffer.push('</' + (options.caseSensitive ? tag : lowerTag) + '>');
          results.push.apply(results, buffer);
        }
        // flush buffer
        buffer.length = 0;
        currentChars = '';
      },
      chars: function(text, prevTag, nextTag) {
        prevTag = prevTag === '' ? 'comment' : prevTag;
        nextTag = nextTag === '' ? 'comment' : nextTag;

        if (currentTag === 'script' || currentTag === 'style') {
          if (options.removeCommentsFromCDATA) {
            text = removeComments(text, currentTag);
          }
          if (options.removeCDATASectionsFromCDATA) {
            text = removeCDATASections(text);
          }
          if (options.processScripts) {
            text = processScript(text, options, currentAttrs);
          }
        }
        if (options.minifyJS && isExecutableScript(currentTag, currentAttrs)) {
          text = minifyJS(text, options.minifyJS);
          if (text.charAt(text.length - 1) === ';') {
            text = text.slice(0, -1);
          }
        }
        if (currentTag === 'style' && options.minifyCSS) {
          text = minifyCSS(text, options.minifyCSS);
        }
        if (options.collapseWhitespace) {
          if (!stackNoTrimWhitespace.length) {
            text = ((prevTag && prevTag !== 'comment') || (nextTag && nextTag !== 'comment')) ?
              collapseWhitespaceSmart(text, prevTag, nextTag, options)
              : trimWhitespace(text);
          }
          if (!stackNoCollapseWhitespace.length) {
            text = prevTag && nextTag || nextTag === 'html' ? text : collapseWhitespace(text);
          }
        }
        currentChars += text;
        if (lint) {
          lint.testChars(text);
        }
        buffer.push(text);
      },
      comment: function(text, nonStandard) {

        var prefix = nonStandard ? '<!' : '<!--';
        var suffix = nonStandard ? '>' : '-->';

        if (options.removeComments) {
          if (isConditionalComment(text)) {
            text = prefix + cleanConditionalComment(text) + suffix;
          }
          else if (isIgnoredComment(text, options)) {
            text = '<!--' + text + '-->';
          }
          else {
            text = '';
          }
        }
        else {
          text = prefix + text + suffix;
        }
        buffer.push(text);
      },
      doctype: function(doctype) {
        buffer.push(options.useShortDoctype ? '<!DOCTYPE html>' : collapseWhitespace(doctype));
      },
      customAttrAssign: options.customAttrAssign,
      customAttrSurround: options.customAttrSurround
    });

    results.push.apply(results, buffer);
    var str = joinResultSegments(results, options);

    if (uidAttr) {
      str = str.replace(new RegExp('\\s*' + uidAttr + '\\s*', 'g'), function() {
        return ignoredCustomMarkupChunks.shift();
      });
    }
    if (uidIgnore) {
      str = str.replace(new RegExp(uidIgnore, 'g'), function() {
        return ignoredMarkupChunks.shift();
      });
    }

    log('minified in: ' + (Date.now() - t) + 'ms');
    return str;
  }

  function joinResultSegments(results, options) {
    var str;
    var maxLineLength = options.maxLineLength;
    if (maxLineLength) {
      var token;
      var lines = [];
      var line = '';
      for (var i = 0, len = results.length; i < len; i++) {
        token = results[i];
        if (line.length + token.length < maxLineLength) {
          line += token;
        }
        else {
          lines.push(line.replace(/^\n/, ''));
          line = token;
        }
      }
      lines.push(line);

      str = lines.join('\n');
    }
    else {
      str = results.join('');
    }

    return str;
  }

  // for CommonJS enviroments, export everything
  if (typeof exports !== 'undefined') {
    exports.minify = minify;
  }
  else {
    global.minify = minify;
  }

}(typeof exports === 'undefined' ? this : exports));
