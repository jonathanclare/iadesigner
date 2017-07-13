/** 
 * Adds locale-specific formatting for numbers, dates etc.
 *
 * @author J Clare
 * @class ia.Locale
 * @constructor
 * @param {String} language The language code - currently one of "en (English);de (Deutsch);es (español);
 *  			fr (français);it (italiano);nl (Nederlands);be ;bg ;ca (català);cs (ceština);da (dansk);el ;et (Eesti);
 *  			fi (suomi);hr (hrvatski);hu (magyar);is (íslenska);lt (Lietuviu);lv (Latviešu);mk ;no (norsk);pl (polski);
 *  			pt (português);ro (româna);ru ;sk (Slovencina);sl (Slovenšcina);sq (shqipe);sr ;sv (svenska);tr (Türkçe);
 *  			uk ;none".
 */
ia.Locale = function(language)
{
	this._propertyHash = {};
	this.formatter = new ia.Formatter();
	var l = language || "en";
	this.setLanguage(l);
};

/** 
 * The formatter for the locale.
 *
 * @property formatter
 * @type ia.Formatter
 */
ia.Locale.prototype.formatter;

/** 
 * Get the language of this locale as an ISO code. 
 * 
 * @method getLanguage
 * @return {String} The language.
 */
ia.Locale.prototype.getLanguage = function()
{
	return this._language;
};

/** 
 * Set the language of this locale as an ISO code. 
 * 
 * @method setLanguage
 * @param {String} l The language.
 */
ia.Locale.prototype.setLanguage = function(l)
{
	this._language = l;

	if (this._language == "be") 
	{
		// Belarusian
		this._displayLanguage = "\u0431\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0456";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = " ";
	}
	else if (this._language == "bg") 
	{
		// Bulgarian
		this._displayLanguage = "\u0431\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = " ";
	}
	else if (this._language == "ca") 
	{
		// Catalan
		this._displayLanguage = "catal\u00e0";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "cs") 
	{
		// Czech
		this._displayLanguage = "\u010de\u0161tina";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = " ";
	}
	else if (this._language == "da") 
	{
		// Danish
		this._displayLanguage = "dansk";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "de") 
	{
		// German
		this._displayLanguage = "Deutsch";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "el") 
	{
		// Greek
		this._displayLanguage = "\u03b5\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "en") 
	{
		// English
		this._displayLanguage = "English";
		this.formatter.decimalSeparatorTo = ".";
		this.formatter.thousandsSeparatorTo = ",";
	}
	else if (this._language == "es") 
	{
		// Spanish
		this._displayLanguage = "espa\u00f1ol";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "et") 
	{
		// Estonian
		this._displayLanguage = "Eesti";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = " ";
	}
	else if (this._language == "fi") 
	{
		// Finnish
		this._displayLanguage = "suomi";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = " ";
	}
	else if (this._language == "fr") 
	{
		// French
		this._displayLanguage = "fran\u00e7ais";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = " ";
	}
	else if (this._language == "hr") 
	{
		// Croatian
		this._displayLanguage = "hrvatski";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "hu") 
	{
		// Hungarian
		this._displayLanguage = "magyar";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = " ";
	}
	else if (this._language == "is") 
	{
		// Icelandic
		this._displayLanguage = "\u00edslenska";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "it") 
	{
		// Italian
		this._displayLanguage = "italiano";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "lt") 
	{
		// Lithuanian
		this._displayLanguage = "Lietuvi\u0173";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "lv") 
	{
		// Latvian
		this._displayLanguage = "Latvie\u0161u";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = " ";
	}
	else if (this._language == "mk") 
	{
		// Macedonian
		this._displayLanguage = "\u043c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "nl") 
	{
		// Dutch
		this._displayLanguage = "Nederlands";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "no") 
	{
		// Norwegian
		this._displayLanguage = "norsk";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = " ";
	}
	else if (this._language == "pl") 
	{
		// Polish
		this._displayLanguage = "polski";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = " ";
	}
	else if (this._language == "pt") 
	{
		// Portuguese
		this._displayLanguage = "portugu\u00eas";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "ro") 
	{
		// Romanian
		this._displayLanguage = "rom\u00e2n\u0103";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "ru") 
	{
		// Russian
		this._displayLanguage = "\u0440\u0443\u0441\u0441\u043a\u0438\u0439";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = " ";
	}
	else if (this._language == "sk") 
	{
		// Slovak
		this._displayLanguage = "Sloven\u010dina";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = " ";
	}
	else if (this._language == "sl") 
	{
		// Slovenian
		this._displayLanguage = "Sloven\u0161\u010dina";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "sq") 
	{
		// Albanian
		this._displayLanguage = "shqipe";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "sr") 
	{
		// Serbian
		this._displayLanguage = "\u0421\u0440\u043f\u0441\u043a\u0438";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "sv") 
	{
		// Swedish
		this._displayLanguage = "svenska";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = " ";
	}
	else if (this._language == "tr") 
	{
		// Turkish
		this._displayLanguage = "T\u00fcrk\u00e7e";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	else if (this._language == "uk") 
	{
		// Ukrainian
		this._displayLanguage = "\u0443\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430";
		this.formatter.decimalSeparatorTo = ",";
		this.formatter.thousandsSeparatorTo = ".";
	}
	// Special case to do nothing to numbers (in English)
	else if (this._language.toLowerCase() == "none") 
	{
		// English
		this._displayLanguage = "English";
		this.formatter.decimalSeparatorTo = ".";
		this.formatter.thousandsSeparatorTo = "";
	}
	// Default to English
	else 
	{
		// English
		this._language = "en";
		this._displayLanguage = "English";
		this.formatter.decimalSeparatorTo = ".";
		this.formatter.thousandsSeparatorTo = ",";
	}
	this.formatter.language = this._language;
};