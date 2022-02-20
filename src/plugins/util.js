const Util = {
  serialize(json) {
    return Object.keys(json)
      .map(key => (json[key] != null ? json[key].toString().length > 0 ? key + '=' + json[key] : null : null))
      .filter(value => value != null)
      .join('&')
      .toString();
  },
  textToUppercase(stringInput) {
    try {
      return stringInput.toUpperCase();
    } catch (error) {
      return stringInput;
    }
  },
  toCapitalize(str) {
    return str?.split('').map((e, i) => (i === 0 ? e.toUpperCase() : e)).join('');
  }
};

export default {
  install: (Vue) => {
    Vue.prototype.$util = Util;
  }
};
