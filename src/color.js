!function(w){
	var reg = {
		RGB		: /rgb\(\d+, ?\d+, ?\d+\)/,
		RGBA	: /rgba\(\d+, ?\d+, ?\d+, ?[\.\d]+\)/,
		HEX		: /^(#[\da-f]{3}|#[\da-f]{6})$/,
		rgbaSplit:/\d+[, ?\.?\d+]+/,
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

		if (colorMode === CONST.colorModes.RGB || (colorMode===undefined && (th.a===undefined || th.a===1))) {
			return "rgb(" + th.r + "," + th.g + "," + th.b + ")"
		} else if (colorMode === CONST.colorModes.RGBA || colorMode===undefined) {
			return "rgba(" + th.r + "," + th.g + "," + th.b + "," + (th.a != undefined ? th.a : 1) + ")"
		}
	};

	Color.prototype.equals = function(color){
		var th = this;

		if(typeof color == 'string') {
			return th.equals(new Color(color));
		}

		if(color instanceof Color)
			return (color.r===th.r && color.g===th.g && color.b===th.b && color.a===th.a);

		console.warn("Unmatched type.");
		return false;
	};

	Color.prototype.toString = function(){
		return this.toHex.apply(this, arguments).toString();
	};

	w.Color = Color;
	w.Color.colorModes = CONST.colorModes;
}(window);