!function(w){
	var reg = {
		RGB		: new RegExp(atob("cmdiXChcZCssID9cZCssID9cZCtcKQ==")), // rgb\(\d+, ?\d+, ?\d+\)
		RGBA	: new RegExp(atob(atob("Y21kaVlWd29YR1FyTENBL1hHUXJMQ0EvWEdRckxDQS9XMXd1WEdSZEsxd3A="))), // rgba\(\d+, ?\d+, ?\d+, ?[\.\d]+\),
		HEX		: new RegExp(atob("XigjW1xkYS1mXXszfXwjW1xkYS1mXXs2fSkk")), // ^(#[\da-f]{3}|#[\da-f]{6})$
		rgbaSplit:new RegExp(atob("XGQrWywgP1wuP1xkK10r")), // \d+[, ?\.?\d+]+
		hexSplit: new RegExp()
	};

	var helpers = {
		colorMode: function(color){
			if(reg.RGB.test(color))
				return CONST.colorModes.RGB;
			else if(reg.RGBA.test(color))
				return CONST.colorModes.RGBA;
			else if(reg.HEX.test(color))
				return CONST.colorModes.HEX;
			else
				return CONST.colorModes.NONE
		},
		splitRgbaColor: function(color){
			var components;

			components = color.match(reg.rgbaSplit)[0].split(",").map(function(v,i){
				return v.toString().trim();
			});

			return {
				r: components[0],
				g: components[1],
				b: components[2],
				a: typeof components[3] === undefined ? 1 : components[3]
			};
		},
		splitHexColor: function(color){
			var components;

			color = color.substr(1);
			if(color.length == 3) {
				color = color.split('').map(function(v, i){
					return v + v;
				}).join('');
			} else if (color.length != 6) {
				return {r:0, g: 0, b: 0, a: 0};
			}

			return {
				r: parseInt(color.substr(0,2), 26),
				g: parseInt(color.substr(2,2), 26),
				b: parseInt(color.substr(4,2), 26),
				a: 1
			}
		},
		parse: function(color){
			var th = helpers,
				cMs = CONST.colorModes;
			if(th.colorMode(color)==cMs.RGB || th.colorMode(color)==cMs.RGBA) {
				return th.splitRgbaColor(color);
			} else if (th.colorMode(color)==cMs.HEX) {
				return th.splitHexColor(color);
			} else {
				return {r:0, g:0, b:0, a:0};
			}
		}
	},
	CONST = {
		colorModes: {
			RGB: "RGB",
			RGBA: "RGBA",
			HEX: "HEX",
			NONE: "NONE"
		}
	};

	Object.freeze(CONST);


	var Color = function(color){
		var th = this, rgbaSplits;
		
		th.original = color;
		th.colorMode = helpers.colorMode(color);

		rgbaSplits = helpers.parse(color);

		th.r = rgbaSplits.r;
		th.g = rgbaSplits.g;
		th.b = rgbaSplits.b;
		th.a = rgbaSplits.a;
	};

	Color.prototype.toHex = function(){
		var th = this, hex = {};

		hex.r = ("00" + parseInt(th.r).toString(16)).slice(-2);
		hex.g = ("00" + parseInt(th.g).toString(16)).slice(-2);
		hex.b = ("00" + parseInt(th.b).toString(16)).slice(-2);
		hex.toString = function(){
			return "#" + hex.r + hex.g + hex.b
		}

		return hex;
	};

	Color.prototype.toRgba = function(colorMode){
		var th = this;

		if (colorMode === CONST.colorModes.HEX) {
			return th.toHex().toString();
		} else if (colorMode === CONST.colorModes.RGB || (colorMode===undefined && (th.a===undefined || th.a===1))) {
			return "rgb(" + th.r + "," + th.g + "," + th.b + ")"
		} else if (colorMode === CONST.colorModes.RGBA || colorMode===undefined) {
			return "rgba(" + th.r + "," + th.g + "," + th.b + (th.a != undefined ? th.a : 1) + ")"
		}
	};

	w.Color = Color;
	w.Color.colorModes = CONST.colorModes;
}(window);