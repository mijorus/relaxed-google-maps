/*!
 * relaxedMap: Lazy load Google Maps with cookie consent placeholder
 * (c) 2020 mijorus, MIT License
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function setAttributes(attributes, el) {
  for (var a in attributes) {
    el.setAttribute(a, attributes[a]);
  }
}

function inViewport(el) {
  var map = el.getBoundingClientRect();

  if (map.top <= (window.innerHeight || document.documentElement.clientHeight)) {
    return true;
  } else {
    return false;
  }
}

function checkData(param, target, value) {
  if (param !== undefined || target.dataset !== undefined && target.dataset["".concat(value)] !== undefined) {
    return param ? param : target.dataset["".concat(value)];
  } else {
    return undefined;
  }
}

var RelaxedMap = /*#__PURE__*/function () {
  function RelaxedMap() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'gmap';
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      src: '',
      alt: '',
      defaultMapStyle: false,
      placeholder: {
        text: undefined,
        subtitle: undefined,
        backgroundImage: undefined,
        backgroundColor: undefined,
        blurred: 3,
        grayscale: true
      }
    };

    _classCallCheck(this, RelaxedMap);

    this.relaxedGMap = document.getElementById(target);
    this.config = config;
    this.relaxedGMap.classList.add('relaxed-map');
    this.iframe;

    if (this.relaxedGMap.querySelector('iframe')) {
      this.iframe = this.relaxedGMap.querySelector('iframe');
    } else {
      this.createIframe();
    }

    return this;
  }

  _createClass(RelaxedMap, [{
    key: "createIframe",
    value: function createIframe() {
      //We can proceed and create the iframe
      var defaultMapStyle = 'width: 600px; height: 450px; frameborder: 0; border:0;';
      var iframeAttr = {
        'allowfullscreen': 'false',
        'aria-hidden': 'false',
        'tabindex': '0',
        'style': this.config.defaultMapStyle ? defaultMapStyle : '',
        'class': 'relaxed-map-iframe'
      };
      this.iframe = document.createElement('iframe');
      var iframeContainer = document.createElement('div');
      iframeContainer.classList.add('relaxed-map-container');
      iframeContainer.style = "overflow: hidden";
      iframeContainer.appendChild(this.iframe);
      setAttributes(iframeAttr, this.iframe);
      this.relaxedGMap.appendChild(iframeContainer);
    }
  }, {
    key: "unloaded",
    value: function unloaded() {
      //If the user doesn't allow cookies, we can create a placeholder for the map iframe
      this.relaxedGMap.style.position = 'relative';
      var linkStyle = 'width: 100%; height: 100%; position: absolute; top: 0; display: flex; z-index: 50; justify-content: center; align-items: center; cursor: pointer;';
      var linkAttr = {
        'target': '_blank',
        'rel': 'noopener',
        'style': linkStyle,
        'class': 'relaxed-map-alt'
      };
      var link = document.createElement('a'); // Shows a warming in the console if the alt param is not given

      var alt = checkData(this.config.alt, this.relaxedGMap, 'alt');
      var placeholder = this.config.placeholder || null;

      if (!alt) {
        console.warn('Warning: alternative map link not set');
      } else {
        link.setAttribute('href', alt);

        if (placeholder && placeholder.text) {
          var placeholderText = checkData(placeholder.text, this.relaxedGMap, 'text');
          link.innerText = placeholderText;
        } else {
          var defaultText = 'Open in Google Maps';
          link.innerText = defaultText;
        }

        setAttributes(linkAttr, link);
        this.relaxedGMap.appendChild(link);
      } //Setting the placeholder's image cover if any


      if (placeholder && placeholder.backgroundImage) {
        var iframeStyle = "background-image: url(\"".concat(this.config.placeholder.backgroundImage, "\"); background-position: center;");
        this.iframe.style = iframeStyle;

        if (placeholder.blurred === undefined) {
          this.iframe.style.filter = "blur(3px)";
        } else {
          this.iframe.style.filter = "blur(".concat(placeholder.blurred, "px)");
        }

        if (placeholder.grayscale === undefined || placeholder.grayscale === true) {
          this.iframe.style.filter += "grayscale(1)";
        }
      } else {
        if (placeholder && placeholder.backgroundColor) {
          this.iframe.style.backgroundColor = this.config.placeholder.backgroundColor;
        } else {
          this.iframe.style.backgroundColor = '#e9ecef';
        }
      } //Create the subtitle node


      this.subtitle = document.createElement('div');
      var subtitleAttr = {
        'style': 'text-align: center;',
        'class': 'relaxed-map-subtitle'
      };
      setAttributes(subtitleAttr, this.subtitle);

      if (placeholder && placeholder.subtitle) {
        this.subtitle.innerText = this.config.placeholder.subtitle;
      } else {
        var defaultSubtitle = 'Please, accept the cookie policy to use the map';
        this.subtitle.innerText = defaultSubtitle;
      }

      this.relaxedGMap.appendChild(this.subtitle);
      return this;
    }
  }, {
    key: "load",
    value: function load() {
      var map = this;
      this.src = checkData(this.config.src, this.relaxedGMap, 'src');

      function asyncMapLoad() {
        if (inViewport(map.relaxedGMap)) {
          document.removeEventListener('scroll', asyncMapLoad, {
            passive: true
          });
          var link = map.relaxedGMap.querySelector('.relaxed-map-alt');
          if (link) link.remove();
          if (map.subtitle) map.subtitle.remove();
          map.iframe.style.backgroundImage = '';
          map.iframe.style.filter = '';
          map.iframe.setAttribute('src', map.src);
          var mapLoad = new Event('relaxedMapLoad');
          map.relaxedGMap.dispatchEvent(mapLoad);
        }
      }

      if (!this.src) {
        console.warn('Warning: map position not set.');
      } else {
        if (inViewport(this.relaxedGMap)) {
          asyncMapLoad();
        } else {
          document.addEventListener('scroll', asyncMapLoad, {
            passive: true
          });
        }
      }
    }
  }]);

  return RelaxedMap;
}();

var _default = RelaxedMap;
exports["default"] = _default;