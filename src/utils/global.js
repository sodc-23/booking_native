
import multiLang from '@common/language/multi_lang'

const arMap = new Map()
const enMap = new Map()

const erMap = new Map()

for ( item in multiLang){
    arMap.set(item, multiLang[item].ar)
    enMap.set(item, multiLang[item].en)
    erMap.set(multiLang[item].en, multiLang[item].ar)
}

function T(key, hash) {
    if (hash.has(key)) return hash.get(key)
    return key
}

function translate1(lang) {
    switch (lang) {
        case 'ar':
            return (key) => T(key, arMap);
        default:
            return (key) => T(key, enMap);
    }
}

function translate2(lang) {
    switch (lang) {
        case 'ar':
            return (key) => T(key, erMap);
        default:
            return (key) => key
    }
}
function translate3(lang) {
    switch (lang) {
        case 'ar':
            return (key) => T(key.toLowerCase(), erMap).toProperCase();
        default:
            return (key) => key.toProperCase()
    }
}
function translate4(lang) {
    switch (lang) {
        case 'ar':
            return (key) => T(key.toLowerCase(), erMap).toUpperCase();
        default:
            return (key) => key.toUpperCase()
    }
}


class global {
    constructor() {
        this.currentUser = null;
        this.countryCode = 'en'
        this.language = 'en'
        this.authToken = null
        this.basicAuthToken = null
        this.environment = {}
        this.searchToken = []
        this.currentCart = null
        this.currency = 'SAR'
        this.currentHotel = null
        this.dateFormat = 'DD/MM/YYYY'
        this.documentTypes = []

        this.Translate={
            T1: translate1(this.language),
            T2: translate2(this.language),
            T3: translate3(this.language),
            T4: translate4(this.language),
        }
    }

    setLanguage(lang){
        this.language = lang
        this.Translate={
            T1: translate1(this.language),
            T2: translate2(this.language),
            T3: translate3(this.language),
            T4: translate4(this.language),
        }
    }

    getPaymentGatewayName(code) {
        var option = this.environment.paymentGatewayInputInfo.find(o => o.code.toLowerCase() == code) || {}
        return option.name || 'Unknown'
    }
}

export default new global();
