import { AsyncStorage } from "react-native";
import Global from './global'
import * as _ from 'underscore'
import moment from 'moment'
import {
    passCheckedImage,
    hotelIco,
    transferIco,
    packageIco,
    cruiseIco,
    trainIco,
    carRentalIco,
    flightIco,
    activityIco,
    busIco
} from "@common/image"
import CountryPicker, { getAllCountries } from 'react-native-country-picker-modal'



const { T1, T2 } = Global.Translate
const isoLangs = {
    "ab": {
        "name": "Abkhaz",
        "nativeName": "аҧсуа"
    },
    "aa": {
        "name": "Afar",
        "nativeName": "Afaraf"
    },
    "af": {
        "name": "Afrikaans",
        "nativeName": "Afrikaans"
    },
    "ak": {
        "name": "Akan",
        "nativeName": "Akan"
    },
    "sq": {
        "name": "Albanian",
        "nativeName": "Shqip"
    },
    "am": {
        "name": "Amharic",
        "nativeName": "አማርኛ"
    },
    "ar": {
        "name": "Arabic",
        "nativeName": "العربية"
    },
    "an": {
        "name": "Aragonese",
        "nativeName": "Aragonés"
    },
    "hy": {
        "name": "Armenian",
        "nativeName": "Հայերեն"
    },
    "as": {
        "name": "Assamese",
        "nativeName": "অসমীয়া"
    },
    "av": {
        "name": "Avaric",
        "nativeName": "авар мацӀ, магӀарул мацӀ"
    },
    "ae": {
        "name": "Avestan",
        "nativeName": "avesta"
    },
    "ay": {
        "name": "Aymara",
        "nativeName": "aymar aru"
    },
    "az": {
        "name": "Azerbaijani",
        "nativeName": "azərbaycan dili"
    },
    "bm": {
        "name": "Bambara",
        "nativeName": "bamanankan"
    },
    "ba": {
        "name": "Bashkir",
        "nativeName": "башҡорт теле"
    },
    "eu": {
        "name": "Basque",
        "nativeName": "euskara, euskera"
    },
    "be": {
        "name": "Belarusian",
        "nativeName": "Беларуская"
    },
    "bn": {
        "name": "Bengali",
        "nativeName": "বাংলা"
    },
    "bh": {
        "name": "Bihari",
        "nativeName": "भोजपुरी"
    },
    "bi": {
        "name": "Bislama",
        "nativeName": "Bislama"
    },
    "bs": {
        "name": "Bosnian",
        "nativeName": "bosanski jezik"
    },
    "br": {
        "name": "Breton",
        "nativeName": "brezhoneg"
    },
    "bg": {
        "name": "Bulgarian",
        "nativeName": "български език"
    },
    "my": {
        "name": "Burmese",
        "nativeName": "ဗမာစာ"
    },
    "ca": {
        "name": "Catalan; Valencian",
        "nativeName": "Català"
    },
    "ch": {
        "name": "Chamorro",
        "nativeName": "Chamoru"
    },
    "ce": {
        "name": "Chechen",
        "nativeName": "нохчийн мотт"
    },
    "ny": {
        "name": "Chichewa; Chewa; Nyanja",
        "nativeName": "chiCheŵa, chinyanja"
    },
    "zh": {
        "name": "Chinese",
        "nativeName": "中文 (Zhōngwén), 汉语, 漢語"
    },
    "cv": {
        "name": "Chuvash",
        "nativeName": "чӑваш чӗлхи"
    },
    "kw": {
        "name": "Cornish",
        "nativeName": "Kernewek"
    },
    "co": {
        "name": "Corsican",
        "nativeName": "corsu, lingua corsa"
    },
    "cr": {
        "name": "Cree",
        "nativeName": "ᓀᐦᐃᔭᐍᐏᐣ"
    },
    "hr": {
        "name": "Croatian",
        "nativeName": "hrvatski"
    },
    "cs": {
        "name": "Czech",
        "nativeName": "česky, čeština"
    },
    "da": {
        "name": "Danish",
        "nativeName": "dansk"
    },
    "dv": {
        "name": "Divehi; Dhivehi; Maldivian;",
        "nativeName": "ދިވެހި"
    },
    "nl": {
        "name": "Dutch",
        "nativeName": "Nederlands, Vlaams"
    },
    "en": {
        "name": "English",
        "nativeName": "English"
    },
    "eo": {
        "name": "Esperanto",
        "nativeName": "Esperanto"
    },
    "et": {
        "name": "Estonian",
        "nativeName": "eesti, eesti keel"
    },
    "ee": {
        "name": "Ewe",
        "nativeName": "Eʋegbe"
    },
    "fo": {
        "name": "Faroese",
        "nativeName": "føroyskt"
    },
    "fj": {
        "name": "Fijian",
        "nativeName": "vosa Vakaviti"
    },
    "fi": {
        "name": "Finnish",
        "nativeName": "suomi, suomen kieli"
    },
    "fr": {
        "name": "French",
        "nativeName": "français, langue française"
    },
    "ff": {
        "name": "Fula; Fulah; Pulaar; Pular",
        "nativeName": "Fulfulde, Pulaar, Pular"
    },
    "gl": {
        "name": "Galician",
        "nativeName": "Galego"
    },
    "ka": {
        "name": "Georgian",
        "nativeName": "ქართული"
    },
    "de": {
        "name": "German",
        "nativeName": "Deutsch"
    },
    "el": {
        "name": "Greek, Modern",
        "nativeName": "Ελληνικά"
    },
    "gn": {
        "name": "Guaraní",
        "nativeName": "Avañeẽ"
    },
    "gu": {
        "name": "Gujarati",
        "nativeName": "ગુજરાતી"
    },
    "ht": {
        "name": "Haitian; Haitian Creole",
        "nativeName": "Kreyòl ayisyen"
    },
    "ha": {
        "name": "Hausa",
        "nativeName": "Hausa, هَوُسَ"
    },
    "he": {
        "name": "Hebrew (modern)",
        "nativeName": "עברית"
    },
    "hz": {
        "name": "Herero",
        "nativeName": "Otjiherero"
    },
    "hi": {
        "name": "Hindi",
        "nativeName": "हिन्दी, हिंदी"
    },
    "ho": {
        "name": "Hiri Motu",
        "nativeName": "Hiri Motu"
    },
    "hu": {
        "name": "Hungarian",
        "nativeName": "Magyar"
    },
    "ia": {
        "name": "Interlingua",
        "nativeName": "Interlingua"
    },
    "id": {
        "name": "Indonesian",
        "nativeName": "Bahasa Indonesia"
    },
    "ie": {
        "name": "Interlingue",
        "nativeName": "Originally called Occidental; then Interlingue after WWII"
    },
    "ga": {
        "name": "Irish",
        "nativeName": "Gaeilge"
    },
    "ig": {
        "name": "Igbo",
        "nativeName": "Asụsụ Igbo"
    },
    "ik": {
        "name": "Inupiaq",
        "nativeName": "Iñupiaq, Iñupiatun"
    },
    "io": {
        "name": "Ido",
        "nativeName": "Ido"
    },
    "is": {
        "name": "Icelandic",
        "nativeName": "Íslenska"
    },
    "it": {
        "name": "Italian",
        "nativeName": "Italiano"
    },
    "iu": {
        "name": "Inuktitut",
        "nativeName": "ᐃᓄᒃᑎᑐᑦ"
    },
    "ja": {
        "name": "Japanese",
        "nativeName": "日本語 (にほんご／にっぽんご)"
    },
    "jv": {
        "name": "Javanese",
        "nativeName": "basa Jawa"
    },
    "kl": {
        "name": "Kalaallisut, Greenlandic",
        "nativeName": "kalaallisut, kalaallit oqaasii"
    },
    "kn": {
        "name": "Kannada",
        "nativeName": "ಕನ್ನಡ"
    },
    "kr": {
        "name": "Kanuri",
        "nativeName": "Kanuri"
    },
    "ks": {
        "name": "Kashmiri",
        "nativeName": "कश्मीरी, كشميري‎"
    },
    "kk": {
        "name": "Kazakh",
        "nativeName": "Қазақ тілі"
    },
    "km": {
        "name": "Khmer",
        "nativeName": "ភាសាខ្មែរ"
    },
    "ki": {
        "name": "Kikuyu, Gikuyu",
        "nativeName": "Gĩkũyũ"
    },
    "rw": {
        "name": "Kinyarwanda",
        "nativeName": "Ikinyarwanda"
    },
    "ky": {
        "name": "Kirghiz, Kyrgyz",
        "nativeName": "кыргыз тили"
    },
    "kv": {
        "name": "Komi",
        "nativeName": "коми кыв"
    },
    "kg": {
        "name": "Kongo",
        "nativeName": "KiKongo"
    },
    "ko": {
        "name": "Korean",
        "nativeName": "한국어 (韓國語), 조선말 (朝鮮語)"
    },
    "ku": {
        "name": "Kurdish",
        "nativeName": "Kurdî, كوردی‎"
    },
    "kj": {
        "name": "Kwanyama, Kuanyama",
        "nativeName": "Kuanyama"
    },
    "la": {
        "name": "Latin",
        "nativeName": "latine, lingua latina"
    },
    "lb": {
        "name": "Luxembourgish, Letzeburgesch",
        "nativeName": "Lëtzebuergesch"
    },
    "lg": {
        "name": "Luganda",
        "nativeName": "Luganda"
    },
    "li": {
        "name": "Limburgish, Limburgan, Limburger",
        "nativeName": "Limburgs"
    },
    "ln": {
        "name": "Lingala",
        "nativeName": "Lingála"
    },
    "lo": {
        "name": "Lao",
        "nativeName": "ພາສາລາວ"
    },
    "lt": {
        "name": "Lithuanian",
        "nativeName": "lietuvių kalba"
    },
    "lu": {
        "name": "Luba-Katanga",
        "nativeName": ""
    },
    "lv": {
        "name": "Latvian",
        "nativeName": "latviešu valoda"
    },
    "gv": {
        "name": "Manx",
        "nativeName": "Gaelg, Gailck"
    },
    "mk": {
        "name": "Macedonian",
        "nativeName": "македонски јазик"
    },
    "mg": {
        "name": "Malagasy",
        "nativeName": "Malagasy fiteny"
    },
    "ms": {
        "name": "Malay",
        "nativeName": "bahasa Melayu, بهاس ملايو‎"
    },
    "ml": {
        "name": "Malayalam",
        "nativeName": "മലയാളം"
    },
    "mt": {
        "name": "Maltese",
        "nativeName": "Malti"
    },
    "mi": {
        "name": "Māori",
        "nativeName": "te reo Māori"
    },
    "mr": {
        "name": "Marathi (Marāṭhī)",
        "nativeName": "मराठी"
    },
    "mh": {
        "name": "Marshallese",
        "nativeName": "Kajin M̧ajeļ"
    },
    "mn": {
        "name": "Mongolian",
        "nativeName": "монгол"
    },
    "na": {
        "name": "Nauru",
        "nativeName": "Ekakairũ Naoero"
    },
    "nv": {
        "name": "Navajo, Navaho",
        "nativeName": "Diné bizaad, Dinékʼehǰí"
    },
    "nb": {
        "name": "Norwegian Bokmål",
        "nativeName": "Norsk bokmål"
    },
    "nd": {
        "name": "North Ndebele",
        "nativeName": "isiNdebele"
    },
    "ne": {
        "name": "Nepali",
        "nativeName": "नेपाली"
    },
    "ng": {
        "name": "Ndonga",
        "nativeName": "Owambo"
    },
    "nn": {
        "name": "Norwegian Nynorsk",
        "nativeName": "Norsk nynorsk"
    },
    "no": {
        "name": "Norwegian",
        "nativeName": "Norsk"
    },
    "ii": {
        "name": "Nuosu",
        "nativeName": "ꆈꌠ꒿ Nuosuhxop"
    },
    "nr": {
        "name": "South Ndebele",
        "nativeName": "isiNdebele"
    },
    "oc": {
        "name": "Occitan",
        "nativeName": "Occitan"
    },
    "oj": {
        "name": "Ojibwe, Ojibwa",
        "nativeName": "ᐊᓂᔑᓈᐯᒧᐎᓐ"
    },
    "cu": {
        "name": "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic",
        "nativeName": "ѩзыкъ словѣньскъ"
    },
    "om": {
        "name": "Oromo",
        "nativeName": "Afaan Oromoo"
    },
    "or": {
        "name": "Oriya",
        "nativeName": "ଓଡ଼ିଆ"
    },
    "os": {
        "name": "Ossetian, Ossetic",
        "nativeName": "ирон æвзаг"
    },
    "pa": {
        "name": "Panjabi, Punjabi",
        "nativeName": "ਪੰਜਾਬੀ, پنجابی‎"
    },
    "pi": {
        "name": "Pāli",
        "nativeName": "पाऴि"
    },
    "fa": {
        "name": "Persian",
        "nativeName": "فارسی"
    },
    "pl": {
        "name": "Polish",
        "nativeName": "polski"
    },
    "ps": {
        "name": "Pashto, Pushto",
        "nativeName": "پښتو"
    },
    "pt": {
        "name": "Portuguese",
        "nativeName": "Português"
    },
    "qu": {
        "name": "Quechua",
        "nativeName": "Runa Simi, Kichwa"
    },
    "rm": {
        "name": "Romansh",
        "nativeName": "rumantsch grischun"
    },
    "rn": {
        "name": "Kirundi",
        "nativeName": "kiRundi"
    },
    "ro": {
        "name": "Romanian, Moldavian, Moldovan",
        "nativeName": "română"
    },
    "ru": {
        "name": "Russian",
        "nativeName": "русский язык"
    },
    "sa": {
        "name": "Sanskrit (Saṁskṛta)",
        "nativeName": "संस्कृतम्"
    },
    "sc": {
        "name": "Sardinian",
        "nativeName": "sardu"
    },
    "sd": {
        "name": "Sindhi",
        "nativeName": "सिन्धी, سنڌي، سندھی‎"
    },
    "se": {
        "name": "Northern Sami",
        "nativeName": "Davvisámegiella"
    },
    "sm": {
        "name": "Samoan",
        "nativeName": "gagana faa Samoa"
    },
    "sg": {
        "name": "Sango",
        "nativeName": "yângâ tî sängö"
    },
    "sr": {
        "name": "Serbian",
        "nativeName": "српски језик"
    },
    "gd": {
        "name": "Scottish Gaelic; Gaelic",
        "nativeName": "Gàidhlig"
    },
    "sn": {
        "name": "Shona",
        "nativeName": "chiShona"
    },
    "si": {
        "name": "Sinhala, Sinhalese",
        "nativeName": "සිංහල"
    },
    "sk": {
        "name": "Slovak",
        "nativeName": "slovenčina"
    },
    "sl": {
        "name": "Slovene",
        "nativeName": "slovenščina"
    },
    "so": {
        "name": "Somali",
        "nativeName": "Soomaaliga, af Soomaali"
    },
    "st": {
        "name": "Southern Sotho",
        "nativeName": "Sesotho"
    },
    "es": {
        "name": "Spanish; Castilian",
        "nativeName": "español, castellano"
    },
    "su": {
        "name": "Sundanese",
        "nativeName": "Basa Sunda"
    },
    "sw": {
        "name": "Swahili",
        "nativeName": "Kiswahili"
    },
    "ss": {
        "name": "Swati",
        "nativeName": "SiSwati"
    },
    "sv": {
        "name": "Swedish",
        "nativeName": "svenska"
    },
    "ta": {
        "name": "Tamil",
        "nativeName": "தமிழ்"
    },
    "te": {
        "name": "Telugu",
        "nativeName": "తెలుగు"
    },
    "tg": {
        "name": "Tajik",
        "nativeName": "тоҷикӣ, toğikī, تاجیکی‎"
    },
    "th": {
        "name": "Thai",
        "nativeName": "ไทย"
    },
    "ti": {
        "name": "Tigrinya",
        "nativeName": "ትግርኛ"
    },
    "bo": {
        "name": "Tibetan Standard, Tibetan, Central",
        "nativeName": "བོད་ཡིག"
    },
    "tk": {
        "name": "Turkmen",
        "nativeName": "Türkmen, Түркмен"
    },
    "tl": {
        "name": "Tagalog",
        "nativeName": "Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔"
    },
    "tn": {
        "name": "Tswana",
        "nativeName": "Setswana"
    },
    "to": {
        "name": "Tonga (Tonga Islands)",
        "nativeName": "faka Tonga"
    },
    "tr": {
        "name": "Turkish",
        "nativeName": "Türkçe"
    },
    "ts": {
        "name": "Tsonga",
        "nativeName": "Xitsonga"
    },
    "tt": {
        "name": "Tatar",
        "nativeName": "татарча, tatarça, تاتارچا‎"
    },
    "tw": {
        "name": "Twi",
        "nativeName": "Twi"
    },
    "ty": {
        "name": "Tahitian",
        "nativeName": "Reo Tahiti"
    },
    "ug": {
        "name": "Uighur, Uyghur",
        "nativeName": "Uyƣurqə, ئۇيغۇرچە‎"
    },
    "uk": {
        "name": "Ukrainian",
        "nativeName": "українська"
    },
    "ur": {
        "name": "Urdu",
        "nativeName": "اردو"
    },
    "uz": {
        "name": "Uzbek",
        "nativeName": "zbek, Ўзбек, أۇزبېك‎"
    },
    "ve": {
        "name": "Venda",
        "nativeName": "Tshivenḓa"
    },
    "vi": {
        "name": "Vietnamese",
        "nativeName": "Tiếng Việt"
    },
    "vo": {
        "name": "Volapük",
        "nativeName": "Volapük"
    },
    "wa": {
        "name": "Walloon",
        "nativeName": "Walon"
    },
    "cy": {
        "name": "Welsh",
        "nativeName": "Cymraeg"
    },
    "wo": {
        "name": "Wolof",
        "nativeName": "Wollof"
    },
    "fy": {
        "name": "Western Frisian",
        "nativeName": "Frysk"
    },
    "xh": {
        "name": "Xhosa",
        "nativeName": "isiXhosa"
    },
    "yi": {
        "name": "Yiddish",
        "nativeName": "ייִדיש"
    },
    "yo": {
        "name": "Yoruba",
        "nativeName": "Yorùbá"
    },
    "za": {
        "name": "Zhuang, Chuang",
        "nativeName": "Saɯ cueŋƅ, Saw cuengh"
    }
}
class UtilService {
    static async saveLocalStringData(key, strValue) {
        await AsyncStorage.setItem("@tripshop:" + key, strValue);
        return true;
    }

    static async saveLocalObjectData(key, obj) {
        await AsyncStorage.setItem("@tripshop:" + key, JSON.stringify(obj));
    }

    static async getLocalStringData(key) {
        let ret = await AsyncStorage.getItem("@tripshop:" + key);

        return ret;
    }

    static async getLocalObjectData(key) {
        let ret = await AsyncStorage.getItem("@tripshop:" + key);
        if (ret != null) {
            return JSON.parse(ret);
        } else {
            return null;
        }
    }

    static async removeLocalObjectData(key) {
        let ret = await AsyncStorage.removeItem("@tripshop:" + key);
        return true;
    }

    static async getImageRawData(filePath) {
        return await Expo.FileSystem.readAsStringAsync(filePath, { encoding: Expo.FileSystem.EncodingTypes.Base64 })
    }

    static validateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }

    static priceFormat(price, decimal) {
        if (!price) return ''
        return price.toLocaleString('en-US', { minimumFractionDigits: (decimal || 0) })
    }

    static getPaxSummary(paxInfo) {
        if (!paxInfo || !paxInfo.item) return ''

        var adultPax = paxInfo.item.filter((o) => o.type == 0)[0]
        var adults = adultPax ? adultPax.quantity : 1
        var childs = paxInfo.item.filter((o) => o.type == 1).length

        return `${adults} Adults ${childs} Childrens`
    }

    static getPaxSummary3(paxInfo) {
        var adultPax = paxInfo.filter((o) => o.type == 0)[0]
        var adults = adultPax ? adultPax.quantity : 1
        var childs = paxInfo.filter((o) => o.type == 1).length

        return `${adults} Adults ${childs} Childrens`
    }

    static getPaxSummary4(paxInfo) {
        var adults = 0, children = 0, infants = 0
        for (var item of paxInfo) {
            if (item.type == 0) adults += item.quantity
            if (item.type == 1) children += item.quantity
            if (item.type == 2) infants += item.quantity
        }

        var result = `Adt : ${adults}, Chd : ${children}`
        if (infants > 0) {
            result += `, Inf : ${infants}`
        }
        return result
    }

    static getPaxSummary2(paxInfo) {
        return `${paxInfo.adult + paxInfo.child} people`
    }

    static getFullPaxSummary(paxInfos) {
        if (!paxInfos) return ''
        var adults = 0, childs = 0
        paxInfos.map((paxInfo) => {
            var adultPax = paxInfo.item.filter((o) => o.type == 0)[0]
            adults += (adultPax ? adultPax.quantity : 1)
            childs += (paxInfo.item.filter((o) => o.type == 1).length)
        })

        return `${paxInfos.length} Rooms ${adults} Adults ${childs} Childrens`
    }

    static getFullPaxSummary2(paxInfos) {
        if (!paxInfos) return ''
        var adults = 0, childs = 0
        paxInfos.map((paxInfo) => {
            var adultPax = paxInfo.item.filter((o) => o.type == 0)[0]
            adults += (adultPax ? adultPax.quantity : 1)
            childs += (paxInfo.item.filter((o) => o.type == 1).length)
        })

        return `${paxInfos.length} Room(s) | ${adults + childs} people`
    }

    static getRoomPeopleCount(paxInfos) {
        if (!paxInfos) return 0
        var adults = 0, childs = 0, infants = 0
        paxInfos.map((paxInfo) => {
            paxInfo.item.map(o => {
                if (o.type == 0) {
                    adults += o.quantity
                } else if (o.type == 1) {
                    childs += o.quantity
                } else if (o.type == 2) {
                    infants += o.quantity
                }
            })
        })

        return adults + childs + infants
    }

    static getBookingStatus(code) {
        switch (code) {
            case 0: return T2('None')
            case 1: return T2('Confirmed')
            case 9: return T2('Denied')
            case 10: return T2('Booked')
            case 15: return T2('Ticket on Process')
            case 17: return T2('Booking Failure')
        }
    }

    static startCase(str) {
        return str.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1").toUpperCase()
    }

    static startCaseWithoutUppercase(str) {
        return str.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1")
    }

    static getPaxGuestTotal(paxInfos) {
        if (!paxInfos) return 0
        var adults = 0, childs = 0
        paxInfos.map((paxInfo) => {
            var adultPax = paxInfo.item.filter((o) => o.type == 0)[0]
            adults += (adultPax ? adultPax.quantity : 1)
            childs += (paxInfo.item.filter((o) => o.type == 1).length)
        })

        return adults + childs
    }

    static makePaxInfo(rooms) {
        if(!rooms||rooms.length==0) return []
        var getItems = (room) => {
            var items = []
            items.push({
                "Type": 0,
                "TypeString": "ADT",
                "Quantity": room.adults
            })

            for (var idx = 0; idx < room.children.length; idx++) {
                items.push({
                    "type": 1,
                    "typeString": "CHD",
                    "quantity": "1",
                    "age": room.children[idx]
                })
            }

            return items
        }

        return rooms.map((room) => {
            return {
                "Properties": {},
                "Flags": {},
                "Code": null,
                "Item": getItems(room),
                "Config": []
            }
        })
    }

    static capitalizeFirstLetter(string) {
        if (!string) return ''
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static decodeHtmlEntity(str) {
        if (!str) return ''
        var temp = str.replace(/&#(\d+);/g, '').replace(/^\xa0*([^\xa0]*)\xa0*$/g, "$1").replace(/&nbsp;/g, " ").replace(/&apos;/g, "'");

        return _.unescape(temp).replace(/<\/?[^>]+(>|$)/g, "")
    };

    static getFieldFromList(list, key) {
        if (!list)
            return null
        var ret = list.find(o => o.key == key)
        if (ret) return ret.value

        return null
    }

    static getFieldFromList2(list, keyField, valueField, key) {
        if (!list)
            return null
        var ret = list.find(o => o[keyField] == key)
        if (ret) return ret[valueField]

        return null
    }

    static getTravellersCountFromTpExtension(list) {
        if (!list) return 0

        var adultCount = Math.max(Number(UtilService.getFieldFromList(list, 'adultCount') || '0'), 0)
        var childCount = Math.max(Number(UtilService.getFieldFromList(list, 'childCount') || '0'), 0)

        return adultCount + childCount
    }

    static isDefined(val) {
        if (!val) return false

        return true
    }

    static getHourMin(mins) {
        if (mins < 60) {
            return `${mins}m`
        } else {
            return `${Math.floor(mins / 60)}h ${mins % 60}m`
        }
    }

    static getChargeType(idx) {
        switch (Number(idx)) {
            case 1: return 'Base Price';
            case 2: return 'Markup';
            case 3: return 'Discount';
            case 4: return 'Paid Amount';
            case 5: return 'Surcharge';
            case 6: return 'Supplier Fee';
            case 7: return 'Service Tax';
            case 8: return 'Prepay';
            case 9: return 'Pay On Arrival';
            case 10: return 'Total Amount';
            case 11: return 'Cancellation Amount';
            case 12: return 'Refund Amount';
            case 13: return 'Not used';
            case 14: return 'Supplier Amount';
            case 15: return 'Other';
            case 16: return 'Credit Card Charges';
            case 17: return 'Service Fees';
            case 18: return 'Supplier Due Amount';
            case 19: return 'Total Markup';
            case 26: return 'Addons Amount';
            case 103: return 'Portal Discount';
            case 105: return 'Portal Surcharge';
            case 106: return 'Portal Fee';
            case 107: return 'Portal Tax';
            case 108: return 'Portal Prepay';
            case 111: return 'Portal Cancellation Amount';
            case 112: return 'Portal Refund Amount';
            case 115: return 'Portal Other Charges';
            case 116: return 'Payment Gateway Charges';
            case 117: return 'Portal Service Fee';
            case 118: return 'Portal Due Amount';
            case 133: return 'Pax Charges';
        }
    }

    static getBusinessName(business) {
        switch (business) {
            case 'hotel': return 'HOTEL';
            case 'activity': return 'ACTIVITY';
            case 'air': return 'FLIGHTS';
            case 'transfers': return 'TRANSFER';
            case 'bus': return 'BUSES';
            case 'vehicle': return 'CAR RENTAL';
            case 'package': return 'TRAVEL PACKAGE';
        }
    }

    static getBusinessIcon(business) {
        switch (business) {
            case 'hotel': return hotelIco;
            case 'activity': return activityIco;
            case 'air': return flightIco;
            case 'transfers': return transferIco;
            case 'bus': return busIco;
            case 'vehicle': return carRentalIco;
            case 'package': return packageIco;
        }
    }

    static getCountryName(code) {
        if (!code) return ''
        var country = getAllCountries().find(t => t.cca2 == code)
        if (country) return country.name.common
        return code
    }

    static getDuration(startDate, endDate) {
        if (!startDate || !endDate) return ''
        var dd = moment(endDate).diff(moment(startDate), 'minutes');
        if (dd > 24 * 60) {
            const d = Math.floor(dd / 24 / 60)
            const h = Math.floor((dd - d * 24 * 60) / 60)
            const m = (dd % 60)
            duration = d + 'D'
        } else if (dd >= 60) {
            duration = Math.floor(dd / 60) + 'h ' + (dd % 60) + 'm'
        } else {
            duration = dd + 'm'
        }

        return duration
    }

    static withoutSign(phone) {
        if (!phone) return ''
        if (phone.startsWith('+'))
            return phone.substr(1)

        return phone
    }

    static getValidDate(strDate) {
        if (strDate == '0001-01-01T00:00:00') return ''

        return moment(strDate).format(Global.dateFormat)
    }

    static getLangName(code) {
        return isoLangs[code].name
    }

    static NormalizeTransferName(name) {
        if (!name) return ''
        var typePos = name.lastIndexOf('-')
        if (typePos == -1) return name

        var type = name.substr(typePos + 2)
        return name.substr(0, typePos) + ' - ' + (type.charAt(0).toUpperCase() + type.slice(1))
    }

    static getInfo(business, withoutCulture) {
        var languages = Global.environment.availableLanguages.map(o => o.cultureName.split('-')[0])
        var langIndex = languages.indexOf(Global.language)

        if(withoutCulture) {
            return {
                "Id": null,
                "Title": null,
                "Description": null,
                "Business": business,
                "AccentColor": "#FFF44337"
            }
        } else {
            return {
                "Id": null,
                "Title": null,
                "Description": null,
                "Business": business,
                "CultureCode": Global.environment.availableLanguages[langIndex].cultureName,
                "AccentColor": "#FFF44337"
            }
        }
    }

    static getBusLocation(location) {
        return location.address + ' - ' + moment(location.time).format('h:mm A')
    }
}

export default UtilService;


String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

String.prototype.toCamelCase = function () {
    return this.replace(/^([A-Z])|\s(\w)/g, function (match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
};

String.prototype.isValidName = function(title){
    if ( this.length == 0 ) return "Please enter "+title+"."
    if ( !this.match(/^[A-Za-z]+$/)) return "Please enter valid "+title+"."
    if ( this.length == 1 ) return "Please enter at least 2 characters in "+title+"."
    return null
}
String.prototype.isValidEmail = function(){
    if (this.length == 0) return "Please enter email address."
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this)) return null
    return "Please enter valid Email Address."
}
String.prototype.isValidPhoneNumber=function(){
    if (this.length == 0) return "Please enter mobile number."
    if ( !(/^\d+$/.test(this))) return "Please enter valid mobile number."
    if ( this.length < 8 ) return "Please enter at least 8 digits mobile number."
    return null
}
String.prototype.isValidPassword=function(){
    if ( this.length==0) return "Please enter Password."
    if ( this.length <6) return "Password must be minimum 6 characters."
    return null
}
String.prototype.isValidConfirmPassword=function(password){
    if ( this.length==0) return "Please enter Confirm Password."
    if ( this.length <6) return "Confirm Password must be minimum 6 characters."
    if ( this != password ) return "Password does not match the confirm password."
    return null
}

console.log('-----', "test".isValidName("First Name"))

let words = [
    // "APRIL",
    // "AUGUST",
    // "Add On Details",
    // "Adt",
    // "Age of Guest",
    // "Are you a foreigner?",
    // "Cancellation Policy",
    // "DECEMBER",
    // "DONE",
    // "Economic Standard(M)",
    // "FEBRUARY",
    // "FRI",
    // "Itinerary RefNo",
    // "JANUARY",
    // "JULY",
    // "JUNE",
    // "Lead Passenger Details",
    // "MARCH",
    // "MAY",
    // "MON",
    // "NOVEMBER",
    // "New Passowrd(minimum 6 characters)",
    // "No Activity Found.",
    // "No Booking Policies Found",
    // "No Cars Found.",
    // "No Hotel(s) Found.",
    // "No Information Avaialble",
    // "No Policy(s) Found.",
    // "No Transfer Found.",
    // "No deal(s) are available.",
    // "Not here? Sign Up",
    // "OCTOBER",
    // "OTP Number",
    // "Package Policies",
    // "Price Details",
    // "Privacy and Policy",
    // "SAT",
    // "SEPTEMBER",
    // "SUN",
    // "Select Boarding & Dropping Point",
    // "Select Boarding Point",
    // "Select City or Airport",
    // "Select Dropping Point",
    // "Sign in",
    // "Sign in with Facebook",
    // "Sign in with Google+",
    // "THU",
    // "TUE",
    // "Use current location",
    // "WED",
    // "Your Selected Seat(s)",
    // "about app",
    // "about us",
    // "accommodation",
    // "activities",
    // "activity details",
    // "add another room",
    // "add co-traveler",
    // "add to cart",
    // "address",
    // "adults(s)",
    // "age",
    // "air",
    // "airline",
    // "airport",
    // "anniversary date",
    // "arabic",
    // "arrival",
    // "arriving date",
    // "arriving time",
    // "as above details",
    // "availability",
    // "available",
    // "available from",
    // "bag(s)",
    // "bags",
    // "base price",
    // "birth date",
    // "blocked",
    // "boarding point",
    // "book",
    // "booking date",
    // "booking failure",
    // "booking for",
    // "booking policies",
    // "booking ref no",
    // "booking status",
    // "bus",
    // "buses",
    // "call us",
    // "cancel",
    // "cancel request",
    // "cancellation policy",
    // "cancelled",
    // "car rental",
    // "category",
    // "cell phone",
    // "change date",
    // "change password",
    // "check-in",
    // "check-out",
    // "checkout",
    // "child",
    // "children",
    // "choose",
    // "choose room",
    // "city",
    // "co-travelers",
    // "comments",
    // "completeted",
    // "confirm new password",
    // "confirmed",
    // "contact",
    // "continue",
    // "country",
    // "credit card",
    // "cruise",
    // "cruises",
    // "customer details",
    // "date",
    // "day",
    // "days",
    // "default",
    // "delete",
    // "depart",
    // "departing",
    // "description",
    // "detailed day wise itinerary",
    // "details",
    // "document number",
    // "document type",
    // "drop off location",
    // "drop-off location",
    // "dropoff hotel details",
    // "dropoff hotel name",
    // "dropping point",
    // "duration",
    // "e-mail address",
    // "economy",
    // "edit",
    // "edit co-traveler",
    // "edit profile",
    // "email",
    // "english",
    // "exclusion",
    // "exclusions",
    // "expiry date",
    // "facilities",
    // "facility",
    // "fare summary",
    // "female",
    // "filter",
    // "first name",
    // "flight",
    // "flight customer details",
    // "flight details",
    // "flights",
    // "floor",
    // "for",
    // "forgot password?",
    // "found",
    // "from",
    // "from photo library",
    // "gender",
    // "general settings",
    // "guest details",
    // "guest first name",
    // "guest last name",
    // "home",
    // "home phone",
    // "home phone number",
    // "hot deal",
    // "hot deals",
    // "hotel",
    // "hotels",
    // "hotels in this area",
    // "hour",
    // "hours",
    // "images",
    // "inclusion",
    // "inclusion & exclusion",
    // "infant",
    // "infant(s)",
    // "issuing country",
    // "itinerary name",
    // "ladies",
    // "language",
    // "last name",
    // "latest search",
    // "list",
    // "loading",
    // "location",
    // "login & continue",
    // "logout",
    // "male",
    // "map",
    // "max persons",
    // "meeting place",
    // "mobile number",
    // "modify",
    // "modify request",
    // "my booking",
    // "my cart",
    // "my profile",
    // "name",
    // "nationality",
    // "night",
    // "nightly average",
    // "nights",
    // "no bus found",
    // "non refundable",
    // "non stop",
    // "notification",
    // "occupancy",
    // "old password",
    // "one way",
    // "operator name",
    // "other",
    // "overview",
    // "package",
    // "package date",
    // "passenger",
    // "passenger details",
    // "passenger type",
    // "passenger(s)",
    // "passengers",
    // "password",
    // "pay now",
    // "payment gateway charges",
    // "payment policy",
    // "people",
    // "per night",
    // "per person",
    // "person",
    // "phone",
    // "pick up location",
    // "pick-up location",
    // "pickup hotel details",
    // "pickup hotel name",
    // "price breakup",
    // "price rules",
    // "primary contact number",
    // "processing payment",
    // "profile",
    // "profile settings",
    // "rate average",
    // "rating",
    // "read more",
    // "recent searches",
    // "recommended",
    // "remove",
    // "reservation details",
    // "return",
    // "returning",
    // "room",
    // "room terms & conditions",
    // "rooms",
    // "round trip",
    // "save",
    // "save as co-traveler",
    // "schedule start",
    // "schedule terms",
    // "search",
    // "seat",
    // "see details",
    // "select",
    // "select a country",
    // "select a nationality",
    // "select a traveler",
    // "select date",
    // "select destination",
    // "select payment method",
    // "select seat",
    // "selected",
    // "send link",
    // "service tax",
    // "show less",
    // "sort by",
    // "special request",
    // "starting from",
    // "status",
    // "stop",
    // "summary of ratings",
    // "support",
    // "surcharge & tax",
    // "surname",
    // "take a picture",
    // "taken",
    // "tel",
    // "terms & conditions",
    // "terms and conditions",
    // "test payment gateway",
    // "thank you",
    // "to",
    // "total",
    // "total amount",
    // "total price",
    // "train",
    // "transfer",
    // "transfer details",
    // "transfer operators",
    // "travel packages",
    // "traveler",
    // "travelers",
    // "travelers information",
    // "upcomming",
    // "via location",
    // "view reservation",
    // "was",
    // "years",
    // "your itinerary number",
    // "zip code",
  ]

//   let messages=[
//       "Please fill the names of the Traveler(s) as they officially appear on Identification or passports.",
//       "Password does not match the confirm password.",
//       "Old password is wrong.",
//       "Password changed successfully.",
//       "Please enter valid email address.",
//       "Sent email. Please check your email.",
//       "Please enter valid mobile number.",
//       "Sent SMS. Please check your SMS.",
//       "Please enter email address.",
//       "Please enter phone number.",
//       "Please enter password.",
//       "Invalid Mobile number.",
//       "Invalid Mobile number.",
//     "Password does not match the confirm password.",
//     "Password must be minimum 6 characters.",
//     "You have been registered successfully.",
//     "Please select a location first.",
//     "Please select one more passengers.",
//     "Please select a From location.",
//     "Please select To location.",
//     "Please enter a destination for depature.",
//     "Please enter a destination for arrival.",
//     "The departure and arrival airports cannot be the same.",
//     "Please select one more adult.",
//     "You can select infants less than aduls. Will you increase adults too?",
//     "No Inclusion Exist For The Selected Transfer",
//     "No Exclusion Exist For The Selected Transfer",
//     "Please select a pick up location",
//     "Please select a drop off location",
//     "Are you sure you wish to remove the",
//     "Cart item is removed successfully.",
//     "No Booking(s) available yet.",
//     "Please select check-out date.",
//     "Please select valid Check-in/Check-out dates.",
//     "No inventory available at this location.",
//     "Your Booking Successfully Done.",
//     "Thank you for booking at Trip Shop.",
//     "You will receive an email with details for this booking.",
//     "You Can Contact Us , Using Below Details , In Case You Require Assistance",
//     "Yes Secure my trip with insurance",
//     "& confirm all passengers are between 2 to 70 years of age",
//     "I agree to the ",
//     "I have READ and AGREED to all the ",
//     "(Please note the Terms and Conditions are besides the individual items listed above)",
//     "For your convenience, you can store Traveler information for your fellow Travelers, like friends and family then, when making a reservation, save time by simply selecting the traveler from the list. You can add or delete names from your list of travelers at any time.",
//     "Co-Traveler deleted successfully.",
//     "Customer Profile updated successfully.",
//     "Change request has been successfully sent.",
//     "Thanks you for request. Your request will receive immediate attention and we will respond via email as soon as possible.",
//     "Three way to find answers",
//     "Search by 'My Bookings' to find answers to your questions.",
//     "Call Customer Support at 987234234\nWe are available 24 hours a day, 7 days a week.",
//     "Send us an email at reservation@tripshop.com with any non-urgent questions.",
//     "We Respond to inquiries within 24 hours",
//   ]

// let ml_obj = {}
// words.map(word => ml_obj[word.toLowerCase().toCamelCase()] = {
//     en: word,
//     ar: word + "_"
// })
// messages.map((message, index)=>ml_obj['message'+index]={
//     en: message,
//     ar: message+'_'
// })
// console.log(ml_obj)

// You have been logged out
// Ledger Balance