var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].substring) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			substring: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			substring: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			substring: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			substring: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			substring: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			substring: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			substring: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			substring: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			substring: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			substring: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			substring: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			substring: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			substring: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   substring: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			substring: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();