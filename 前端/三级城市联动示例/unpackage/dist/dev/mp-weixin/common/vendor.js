(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],[
/* 0 */,
/* 1 */
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


function addSafeAreaInsets(result) {
  if (result.safeArea) {
    var safeArea = result.safeArea;
    result.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: result.windowWidth - safeArea.right,
      bottom: result.windowHeight - safeArea.bottom };

  }
}
var protocols = {
  previewImage: previewImage,
  getSystemInfo: {
    returnValue: addSafeAreaInsets },

  getSystemInfoSync: {
    returnValue: addSafeAreaInsets } };


var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm && this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),
/* 2 */
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),
/* 3 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/*!*************************************************************!*\
  !*** C:/Users/冬天捡到的徒弟xin/Desktop/诺金/前端/三级城市联动示例/pages.json ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 5 */
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),
/* 6 */
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25720200116005","_inBundle":false,"_integrity":"sha512-RZFw3WAaS/CZTzzv9JPaWvmoNitojD/06vPdHSzlqZi8GbuE222lFuyochEjrGkG8rPPrWHAnwfoPBuQVtkfdg==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25720200116005.tgz","_shasum":"08bb17aba91c84a981f33d74153aa3dd07b578ad","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"a129bde60de35f7ef497f43d5a45b4556231995c","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25720200116005"};

/***/ }),
/* 7 */
/*!******************************************************************************!*\
  !*** C:/Users/冬天捡到的徒弟xin/Desktop/诺金/前端/三级城市联动示例/pages.json?{"type":"style"} ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "三级城市联动" } }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "uni-app", "navigationBarBackgroundColor": "#F8F8F8", "backgroundColor": "#F8F8F8" } };exports.default = _default;

/***/ }),
/* 8 */
/*!*****************************************************************************!*\
  !*** C:/Users/冬天捡到的徒弟xin/Desktop/诺金/前端/三级城市联动示例/pages.json?{"type":"stat"} ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__0DB0EDD" };exports.default = _default;

/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/*!********************************************************************************************!*\
  !*** C:/Users/冬天捡到的徒弟xin/Desktop/诺金/前端/三级城市联动示例/pages/components/chenguanhua-city/city.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var cityData = [{
  "id": 1,
  "name": "北京",
  "parentId": 0,
  "districtList": [{
    "id": 72,
    "name": "朝阳区",
    "parentId": 1,
    "districtList": [{
      "id": 2799,
      "name": "三环以内",
      "parentId": 72,
      "districtList": [] },

    {
      "id": 2819,
      "name": "三环到四环之间",
      "parentId": 72,
      "districtList": [] },

    {
      "id": 2839,
      "name": "四环到五环之间",
      "parentId": 72,
      "districtList": [] },

    {
      "id": 2840,
      "name": "五环到六环之间",
      "parentId": 72,
      "districtList": [] },

    {
      "id": 4137,
      "name": "管庄",
      "parentId": 72,
      "districtList": [] },

    {
      "id": 4139,
      "name": "北苑",
      "parentId": 72,
      "districtList": [] },

    {
      "id": 4211,
      "name": "定福庄",
      "parentId": 72,
      "districtList": [] }] },



  {
    "id": 2800,
    "name": "海淀区",
    "parentId": 1,
    "districtList": [{
      "id": 2848,
      "name": "三环以内",
      "parentId": 2800,
      "districtList": [] },

    {
      "id": 2849,
      "name": "三环到四环之间",
      "parentId": 2800,
      "districtList": [] },

    {
      "id": 2850,
      "name": "四环到五环之间",
      "parentId": 2800,
      "districtList": [] },

    {
      "id": 2851,
      "name": "五环到六环之间",
      "parentId": 2800,
      "districtList": [] },

    {
      "id": 2852,
      "name": "六环以外",
      "parentId": 2800,
      "districtList": [] },

    {
      "id": 4134,
      "name": "西三旗",
      "parentId": 2800,
      "districtList": [] },

    {
      "id": 4209,
      "name": "西二旗",
      "parentId": 2800,
      "districtList": [] }] },



  {
    "id": 2801,
    "name": "西城区",
    "parentId": 1,
    "districtList": [{
      "id": 2827,
      "name": "内环到二环里",
      "parentId": 2801,
      "districtList": [] },

    {
      "id": 2853,
      "name": "二环到三环",
      "parentId": 2801,
      "districtList": [] }] },



  {
    "id": 2802,
    "name": "东城区",
    "parentId": 1,
    "districtList": [{
      "id": 2821,
      "name": "内环到三环里",
      "parentId": 2802,
      "districtList": [] }] },


  {
    "id": 2803,
    "name": "崇文区",
    "parentId": 1,
    "districtList": [{
      "id": 2829,
      "name": "一环到二环",
      "parentId": 2803,
      "districtList": [] },

    {
      "id": 2842,
      "name": "二环到三环",
      "parentId": 2803,
      "districtList": [] }] },



  {
    "id": 2804,
    "name": "宣武区",
    "parentId": 1,
    "districtList": [{
      "id": 2828,
      "name": "内环到三环里",
      "parentId": 2804,
      "districtList": [] }] },


  {
    "id": 2805,
    "name": "丰台区",
    "parentId": 1,
    "districtList": [{
      "id": 2832,
      "name": "四环到五环之间",
      "parentId": 2805,
      "districtList": [] },

    {
      "id": 2854,
      "name": "二环到三环",
      "parentId": 2805,
      "districtList": [] },

    {
      "id": 2855,
      "name": "三环到四环之间",
      "parentId": 2805,
      "districtList": [] },

    {
      "id": 34544,
      "name": "五环到六环之间",
      "parentId": 2805,
      "districtList": [] },

    {
      "id": 34545,
      "name": "六环之外",
      "parentId": 2805,
      "districtList": [] }] },



  {
    "id": 2806,
    "name": "石景山区",
    "parentId": 1,
    "districtList": [{
      "id": 2831,
      "name": "四环到五环内",
      "parentId": 2806,
      "districtList": [] },

    {
      "id": 4187,
      "name": "石景山城区",
      "parentId": 2806,
      "districtList": [] },

    {
      "id": 4188,
      "name": "八大处科技园区",
      "parentId": 2806,
      "districtList": [] }] },



  {
    "id": 2807,
    "name": "门头沟",
    "parentId": 1,
    "districtList": [{
      "id": 51552,
      "name": "城区",
      "parentId": 2807,
      "districtList": [] },

    {
      "id": 51553,
      "name": "龙泉镇",
      "parentId": 2807,
      "districtList": [] },

    {
      "id": 51554,
      "name": "永定镇",
      "parentId": 2807,
      "districtList": [] },

    {
      "id": 51555,
      "name": "大台镇",
      "parentId": 2807,
      "districtList": [] },

    {
      "id": 51556,
      "name": "潭柘寺镇",
      "parentId": 2807,
      "districtList": [] },

    {
      "id": 51557,
      "name": "王平镇",
      "parentId": 2807,
      "districtList": [] },

    {
      "id": 51558,
      "name": "军庄镇",
      "parentId": 2807,
      "districtList": [] },

    {
      "id": 51559,
      "name": "妙峰山镇",
      "parentId": 2807,
      "districtList": [] },

    {
      "id": 51560,
      "name": "雁翅镇",
      "parentId": 2807,
      "districtList": [] },

    {
      "id": 51561,
      "name": "斋堂镇",
      "parentId": 2807,
      "districtList": [] },

    {
      "id": 51562,
      "name": "清水镇",
      "parentId": 2807,
      "districtList": [] }] },



  {
    "id": 2808,
    "name": "房山区",
    "parentId": 1,
    "districtList": [{
      "id": 51528,
      "name": "城区",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51529,
      "name": "大安山乡",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51530,
      "name": "大石窝镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51531,
      "name": "窦店镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51532,
      "name": "佛子庄乡",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51534,
      "name": "韩村河镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51535,
      "name": "河北镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51536,
      "name": "良乡镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51537,
      "name": "琉璃河镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51538,
      "name": "南窖乡",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51539,
      "name": "蒲洼乡",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51540,
      "name": "青龙湖镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51541,
      "name": "十渡镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51542,
      "name": "石楼镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51543,
      "name": "史家营乡",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51544,
      "name": "霞云岭乡",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51545,
      "name": "新镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51546,
      "name": "阎村镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51547,
      "name": "燕山地区",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51548,
      "name": "张坊镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51549,
      "name": "长沟镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51550,
      "name": "长阳镇",
      "parentId": 2808,
      "districtList": [] },

    {
      "id": 51551,
      "name": "周口店镇",
      "parentId": 2808,
      "districtList": [] }] },



  {
    "id": 2809,
    "name": "通州区",
    "parentId": 1,
    "districtList": [{
      "id": 51216,
      "name": "六环内（马驹桥镇）",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51217,
      "name": "六环外（马驹桥镇）",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51218,
      "name": "永顺镇",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51219,
      "name": "梨园镇",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51220,
      "name": "宋庄镇",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51221,
      "name": "漷县镇",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51222,
      "name": "张家湾镇",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51223,
      "name": "西集镇",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51224,
      "name": "永乐店镇",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51225,
      "name": "潞城镇",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51226,
      "name": "台湖镇",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51227,
      "name": "于家务乡",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51228,
      "name": "中仓街道",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51229,
      "name": "新华街道",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51230,
      "name": "玉桥街道",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51231,
      "name": "北苑街道",
      "parentId": 2809,
      "districtList": [] },

    {
      "id": 51232,
      "name": "次渠镇",
      "parentId": 2809,
      "districtList": [] }] },



  {
    "id": 2810,
    "name": "大兴区",
    "parentId": 1,
    "districtList": [{
      "id": 4194,
      "name": "四环至五环之间",
      "parentId": 2810,
      "districtList": [] },

    {
      "id": 4205,
      "name": "六环以外",
      "parentId": 2810,
      "districtList": [] },

    {
      "id": 6501,
      "name": "五环至六环之间",
      "parentId": 2810,
      "districtList": [] },

    {
      "id": 51081,
      "name": "亦庄经济开发区",
      "parentId": 2810,
      "districtList": [] }] },



  {
    "id": 2812,
    "name": "顺义区",
    "parentId": 1,
    "districtList": [{
      "id": 51125,
      "name": "北石槽镇",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51126,
      "name": "北务镇",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51127,
      "name": "北小营镇",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51128,
      "name": "大孙各庄镇",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51129,
      "name": "高丽营镇",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51130,
      "name": "光明街道",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51131,
      "name": "后沙峪地区",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51132,
      "name": "空港街道",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51133,
      "name": "李桥镇",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51134,
      "name": "李遂镇",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51135,
      "name": "龙湾屯镇",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51136,
      "name": "马坡地区",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51137,
      "name": "木林镇",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51138,
      "name": "南彩镇",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51139,
      "name": "南法信地区",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51140,
      "name": "牛栏山地区",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51141,
      "name": "仁和地区",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51142,
      "name": "胜利街道",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51143,
      "name": "石园街道",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51144,
      "name": "双丰街道",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51145,
      "name": "天竺地区",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51146,
      "name": "旺泉街道",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51147,
      "name": "杨镇地区",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51148,
      "name": "张镇",
      "parentId": 2812,
      "districtList": [] },

    {
      "id": 51149,
      "name": "赵全营镇",
      "parentId": 2812,
      "districtList": [] }] },



  {
    "id": 2814,
    "name": "怀柔区",
    "parentId": 1,
    "districtList": [{
      "id": 2847,
      "name": "郊区",
      "parentId": 2814,
      "districtList": [] },

    {
      "id": 6115,
      "name": "城区以内",
      "parentId": 2814,
      "districtList": [] }] },



  {
    "id": 2816,
    "name": "密云区",
    "parentId": 1,
    "districtList": [{
      "id": 2862,
      "name": "城区以外",
      "parentId": 2816,
      "districtList": [] },

    {
      "id": 6667,
      "name": "城区",
      "parentId": 2816,
      "districtList": [] }] },



  {
    "id": 2901,
    "name": "昌平区",
    "parentId": 1,
    "districtList": [{
      "id": 2906,
      "name": "城区以外",
      "parentId": 2901,
      "districtList": [] },

    {
      "id": 4135,
      "name": "六环以内",
      "parentId": 2901,
      "districtList": [] },

    {
      "id": 4136,
      "name": "城区",
      "parentId": 2901,
      "districtList": [] }] },



  {
    "id": 2953,
    "name": "平谷区",
    "parentId": 1,
    "districtList": [{
      "id": 2954,
      "name": "城区以外",
      "parentId": 2953,
      "districtList": [] },

    {
      "id": 6666,
      "name": "城区",
      "parentId": 2953,
      "districtList": [] }] },



  {
    "id": 3065,
    "name": "延庆县",
    "parentId": 1,
    "districtList": [{
      "id": 51505,
      "name": "延庆镇",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51506,
      "name": "城区",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51507,
      "name": "康庄镇",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51508,
      "name": "八达岭镇",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51509,
      "name": "永宁镇",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51510,
      "name": "旧县镇",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51511,
      "name": "张山营镇",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51512,
      "name": "四海镇",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51513,
      "name": "千家店镇",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51514,
      "name": "沈家营镇",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51515,
      "name": "大榆树镇",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51516,
      "name": "井庄镇",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51517,
      "name": "大庄科乡",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51518,
      "name": "刘斌堡乡",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51519,
      "name": "香营乡",
      "parentId": 3065,
      "districtList": [] },

    {
      "id": 51520,
      "name": "珍珠泉乡",
      "parentId": 3065,
      "districtList": [] }] }] },





{
  "id": 2,
  "name": "上海",
  "parentId": 0,
  "districtList": [{
    "id": 78,
    "name": "黄浦区",
    "parentId": 2,
    "districtList": [{
      "id": 51978,
      "name": "城区",
      "parentId": 78,
      "districtList": [] }] },


  {
    "id": 2813,
    "name": "徐汇区",
    "parentId": 2,
    "districtList": [{
      "id": 51976,
      "name": "城区",
      "parentId": 2813,
      "districtList": [] }] },


  {
    "id": 2815,
    "name": "长宁区",
    "parentId": 2,
    "districtList": [{
      "id": 51975,
      "name": "城区",
      "parentId": 2815,
      "districtList": [] }] },


  {
    "id": 2817,
    "name": "静安区",
    "parentId": 2,
    "districtList": [{
      "id": 51973,
      "name": "城区",
      "parentId": 2817,
      "districtList": [] }] },


  {
    "id": 2820,
    "name": "闸北区",
    "parentId": 2,
    "districtList": [{
      "id": 51972,
      "name": "城区",
      "parentId": 2820,
      "districtList": [] }] },


  {
    "id": 2822,
    "name": "虹口区",
    "parentId": 2,
    "districtList": [{
      "id": 51979,
      "name": "城区",
      "parentId": 2822,
      "districtList": [] }] },


  {
    "id": 2823,
    "name": "杨浦区",
    "parentId": 2,
    "districtList": [{
      "id": 51974,
      "name": "城区",
      "parentId": 2823,
      "districtList": [] }] },


  {
    "id": 2824,
    "name": "宝山区",
    "parentId": 2,
    "districtList": [{
      "id": 51911,
      "name": "罗店镇",
      "parentId": 2824,
      "districtList": [] },

    {
      "id": 51912,
      "name": "大场镇",
      "parentId": 2824,
      "districtList": [] },

    {
      "id": 51913,
      "name": "杨行镇",
      "parentId": 2824,
      "districtList": [] },

    {
      "id": 51914,
      "name": "月浦镇",
      "parentId": 2824,
      "districtList": [] },

    {
      "id": 51915,
      "name": "罗泾镇",
      "parentId": 2824,
      "districtList": [] },

    {
      "id": 51916,
      "name": "顾村镇",
      "parentId": 2824,
      "districtList": [] },

    {
      "id": 51917,
      "name": "高境镇",
      "parentId": 2824,
      "districtList": [] },

    {
      "id": 51918,
      "name": "庙行镇",
      "parentId": 2824,
      "districtList": [] },

    {
      "id": 51919,
      "name": "淞南镇",
      "parentId": 2824,
      "districtList": [] },

    {
      "id": 51920,
      "name": "宝山城市工业园区",
      "parentId": 2824,
      "districtList": [] },

    {
      "id": 51921,
      "name": "城区",
      "parentId": 2824,
      "districtList": [] }] },



  {
    "id": 2825,
    "name": "闵行区",
    "parentId": 2,
    "districtList": [{
      "id": 51931,
      "name": "城区",
      "parentId": 2825,
      "districtList": [] },

    {
      "id": 51932,
      "name": "莘庄镇",
      "parentId": 2825,
      "districtList": [] },

    {
      "id": 51933,
      "name": "七宝镇",
      "parentId": 2825,
      "districtList": [] },

    {
      "id": 51934,
      "name": "浦江镇",
      "parentId": 2825,
      "districtList": [] },

    {
      "id": 51935,
      "name": "梅陇镇",
      "parentId": 2825,
      "districtList": [] },

    {
      "id": 51936,
      "name": "虹桥镇",
      "parentId": 2825,
      "districtList": [] },

    {
      "id": 51937,
      "name": "马桥镇",
      "parentId": 2825,
      "districtList": [] },

    {
      "id": 51938,
      "name": "吴泾镇",
      "parentId": 2825,
      "districtList": [] },

    {
      "id": 51939,
      "name": "华漕镇",
      "parentId": 2825,
      "districtList": [] },

    {
      "id": 51940,
      "name": "颛桥镇",
      "parentId": 2825,
      "districtList": [] }] },



  {
    "id": 2826,
    "name": "嘉定区",
    "parentId": 2,
    "districtList": [{
      "id": 51941,
      "name": "城区",
      "parentId": 2826,
      "districtList": [] },

    {
      "id": 51942,
      "name": "南翔镇",
      "parentId": 2826,
      "districtList": [] },

    {
      "id": 51943,
      "name": "马陆镇",
      "parentId": 2826,
      "districtList": [] },

    {
      "id": 51944,
      "name": "华亭镇",
      "parentId": 2826,
      "districtList": [] },

    {
      "id": 51945,
      "name": "江桥镇",
      "parentId": 2826,
      "districtList": [] },

    {
      "id": 51946,
      "name": "菊园新区",
      "parentId": 2826,
      "districtList": [] },

    {
      "id": 51947,
      "name": "安亭镇",
      "parentId": 2826,
      "districtList": [] },

    {
      "id": 51948,
      "name": "徐行镇",
      "parentId": 2826,
      "districtList": [] },

    {
      "id": 51949,
      "name": "外冈镇",
      "parentId": 2826,
      "districtList": [] },

    {
      "id": 51950,
      "name": "嘉定工业区",
      "parentId": 2826,
      "districtList": [] }] },



  {
    "id": 2830,
    "name": "浦东新区",
    "parentId": 2,
    "districtList": [{
      "id": 51800,
      "name": "城区",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51801,
      "name": "川沙新镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51802,
      "name": "高桥镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51803,
      "name": "北蔡镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51804,
      "name": "合庆镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51805,
      "name": "唐镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51806,
      "name": "曹路镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51807,
      "name": "金桥镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51808,
      "name": "高行镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51809,
      "name": "高东镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51810,
      "name": "张江镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51811,
      "name": "三林镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51812,
      "name": "南汇新城镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51822,
      "name": "祝桥镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51823,
      "name": "新场镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51824,
      "name": "惠南镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51825,
      "name": "康桥镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51826,
      "name": "宣桥镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51827,
      "name": "书院镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51828,
      "name": "大团镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51829,
      "name": "周浦镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51830,
      "name": "芦潮港镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51831,
      "name": "泥城镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51832,
      "name": "航头镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51833,
      "name": "万祥镇",
      "parentId": 2830,
      "districtList": [] },

    {
      "id": 51834,
      "name": "老港镇",
      "parentId": 2830,
      "districtList": [] }] },



  {
    "id": 2833,
    "name": "青浦区",
    "parentId": 2,
    "districtList": [{
      "id": 51951,
      "name": "朱家角镇",
      "parentId": 2833,
      "districtList": [] },

    {
      "id": 51952,
      "name": "赵巷镇",
      "parentId": 2833,
      "districtList": [] },

    {
      "id": 51953,
      "name": "徐泾镇",
      "parentId": 2833,
      "districtList": [] },

    {
      "id": 51954,
      "name": "华新镇",
      "parentId": 2833,
      "districtList": [] },

    {
      "id": 51955,
      "name": "重固镇",
      "parentId": 2833,
      "districtList": [] },

    {
      "id": 51956,
      "name": "白鹤镇",
      "parentId": 2833,
      "districtList": [] },

    {
      "id": 51957,
      "name": "练塘镇",
      "parentId": 2833,
      "districtList": [] },

    {
      "id": 51958,
      "name": "金泽镇",
      "parentId": 2833,
      "districtList": [] },

    {
      "id": 51959,
      "name": "城区",
      "parentId": 2833,
      "districtList": [] }] },



  {
    "id": 2834,
    "name": "松江区",
    "parentId": 2,
    "districtList": [{
      "id": 51982,
      "name": "城区",
      "parentId": 2834,
      "districtList": [] },

    {
      "id": 51983,
      "name": "泗泾镇",
      "parentId": 2834,
      "districtList": [] },

    {
      "id": 51984,
      "name": "佘山镇",
      "parentId": 2834,
      "districtList": [] },

    {
      "id": 51985,
      "name": "车墩镇",
      "parentId": 2834,
      "districtList": [] },

    {
      "id": 51986,
      "name": "新桥镇",
      "parentId": 2834,
      "districtList": [] },

    {
      "id": 51987,
      "name": "洞泾镇",
      "parentId": 2834,
      "districtList": [] },

    {
      "id": 51988,
      "name": "九亭镇",
      "parentId": 2834,
      "districtList": [] },

    {
      "id": 51989,
      "name": "泖港镇",
      "parentId": 2834,
      "districtList": [] },

    {
      "id": 51990,
      "name": "石湖荡镇",
      "parentId": 2834,
      "districtList": [] },

    {
      "id": 51991,
      "name": "新浜镇",
      "parentId": 2834,
      "districtList": [] },

    {
      "id": 51992,
      "name": "叶榭镇",
      "parentId": 2834,
      "districtList": [] },

    {
      "id": 51993,
      "name": "小昆山镇",
      "parentId": 2834,
      "districtList": [] }] },



  {
    "id": 2835,
    "name": "金山区",
    "parentId": 2,
    "districtList": [{
      "id": 51960,
      "name": "城区",
      "parentId": 2835,
      "districtList": [] },

    {
      "id": 51961,
      "name": "金山工业区",
      "parentId": 2835,
      "districtList": [] },

    {
      "id": 51962,
      "name": "朱泾镇",
      "parentId": 2835,
      "districtList": [] },

    {
      "id": 51963,
      "name": "枫泾镇",
      "parentId": 2835,
      "districtList": [] },

    {
      "id": 51964,
      "name": "张堰镇",
      "parentId": 2835,
      "districtList": [] },

    {
      "id": 51965,
      "name": "亭林镇",
      "parentId": 2835,
      "districtList": [] },

    {
      "id": 51966,
      "name": "吕巷镇",
      "parentId": 2835,
      "districtList": [] },

    {
      "id": 51967,
      "name": "廊下镇",
      "parentId": 2835,
      "districtList": [] },

    {
      "id": 51968,
      "name": "金山卫镇",
      "parentId": 2835,
      "districtList": [] },

    {
      "id": 51970,
      "name": "漕泾镇",
      "parentId": 2835,
      "districtList": [] },

    {
      "id": 51971,
      "name": "山阳镇",
      "parentId": 2835,
      "districtList": [] }] },



  {
    "id": 2837,
    "name": "奉贤区",
    "parentId": 2,
    "districtList": [{
      "id": 51928,
      "name": "南桥镇",
      "parentId": 2837,
      "districtList": [] },

    {
      "id": 51929,
      "name": "奉城镇",
      "parentId": 2837,
      "districtList": [] },

    {
      "id": 51930,
      "name": "四团镇",
      "parentId": 2837,
      "districtList": [] },

    {
      "id": 51994,
      "name": "柘林镇",
      "parentId": 2837,
      "districtList": [] },

    {
      "id": 51995,
      "name": "庄行镇",
      "parentId": 2837,
      "districtList": [] },

    {
      "id": 51996,
      "name": "金汇镇",
      "parentId": 2837,
      "districtList": [] },

    {
      "id": 51997,
      "name": "青村镇",
      "parentId": 2837,
      "districtList": [] },

    {
      "id": 51998,
      "name": "海湾镇",
      "parentId": 2837,
      "districtList": [] }] },



  {
    "id": 2841,
    "name": "普陀区",
    "parentId": 2,
    "districtList": [{
      "id": 51980,
      "name": "城区",
      "parentId": 2841,
      "districtList": [] }] },


  {
    "id": 2919,
    "name": "崇明县",
    "parentId": 2,
    "districtList": [{
      "id": 50779,
      "name": "堡镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50780,
      "name": "庙镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50781,
      "name": "陈家镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50782,
      "name": "城桥镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50783,
      "name": "东平镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50784,
      "name": "港西镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50785,
      "name": "港沿镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50786,
      "name": "建设镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50787,
      "name": "绿华镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50788,
      "name": "三星镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50789,
      "name": "竖新镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50790,
      "name": "向化镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50791,
      "name": "新海镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50792,
      "name": "新河镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50793,
      "name": "中兴镇",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50794,
      "name": "长兴乡",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50795,
      "name": "横沙乡",
      "parentId": 2919,
      "districtList": [] },

    {
      "id": 50796,
      "name": "新村乡",
      "parentId": 2919,
      "districtList": [] }] }] },





{
  "id": 3,
  "name": "天津",
  "parentId": 0,
  "districtList": [{
    "id": 51035,
    "name": "东丽区",
    "parentId": 3,
    "districtList": [{
      "id": 39620,
      "name": "全境",
      "parentId": 51035,
      "districtList": [] }] },


  {
    "id": 51036,
    "name": "和平区",
    "parentId": 3,
    "districtList": [{
      "id": 2984,
      "name": "全境",
      "parentId": 51036,
      "districtList": [] }] },


  {
    "id": 51037,
    "name": "河北区",
    "parentId": 3,
    "districtList": [{
      "id": 2987,
      "name": "全境",
      "parentId": 51037,
      "districtList": [] }] },


  {
    "id": 51038,
    "name": "河东区",
    "parentId": 3,
    "districtList": [{
      "id": 3000,
      "name": "全境",
      "parentId": 51038,
      "districtList": [] }] },


  {
    "id": 51039,
    "name": "河西区",
    "parentId": 3,
    "districtList": [{
      "id": 2985,
      "name": "全境",
      "parentId": 51039,
      "districtList": [] }] },


  {
    "id": 51040,
    "name": "红桥区",
    "parentId": 3,
    "districtList": [{
      "id": 2986,
      "name": "全境",
      "parentId": 51040,
      "districtList": [] }] },


  {
    "id": 51041,
    "name": "蓟县",
    "parentId": 3,
    "districtList": [{
      "id": 98,
      "name": "全境",
      "parentId": 51041,
      "districtList": [] }] },


  {
    "id": 51042,
    "name": "静海县",
    "parentId": 3,
    "districtList": [{
      "id": 36157,
      "name": "全境",
      "parentId": 51042,
      "districtList": [] }] },


  {
    "id": 51043,
    "name": "南开区",
    "parentId": 3,
    "districtList": [{
      "id": 2907,
      "name": "全境",
      "parentId": 51043,
      "districtList": [] }] },


  {
    "id": 51044,
    "name": "塘沽区",
    "parentId": 3,
    "districtList": [{
      "id": 25708,
      "name": "全境",
      "parentId": 51044,
      "districtList": [] }] },


  {
    "id": 51045,
    "name": "西青区",
    "parentId": 3,
    "districtList": [{
      "id": 53866,
      "name": "全境",
      "parentId": 51045,
      "districtList": [] }] },


  {
    "id": 51046,
    "name": "武清区",
    "parentId": 3,
    "districtList": [{
      "id": 53669,
      "name": "全境",
      "parentId": 51046,
      "districtList": [] }] },


  {
    "id": 51047,
    "name": "津南区",
    "parentId": 3,
    "districtList": [{
      "id": 25704,
      "name": "咸水沽镇、海河教育园，海河科技园",
      "parentId": 51047,
      "districtList": [] },

    {
      "id": 36171,
      "name": "双港，辛庄",
      "parentId": 51047,
      "districtList": [] },

    {
      "id": 36172,
      "name": "其他地区",
      "parentId": 51047,
      "districtList": [] }] },



  {
    "id": 51048,
    "name": "汉沽区",
    "parentId": 3,
    "districtList": [{
      "id": 23672,
      "name": "汉沽区街里、汉沽开发区",
      "parentId": 51048,
      "districtList": [] },

    {
      "id": 23673,
      "name": "其它地区",
      "parentId": 51048,
      "districtList": [] }] },



  {
    "id": 51049,
    "name": "大港区",
    "parentId": 3,
    "districtList": [{
      "id": 8545,
      "name": "大港油田",
      "parentId": 51049,
      "districtList": [] },

    {
      "id": 8546,
      "name": "主城区内",
      "parentId": 51049,
      "districtList": [] },

    {
      "id": 8547,
      "name": "主城区外",
      "parentId": 51049,
      "districtList": [] }] },



  {
    "id": 51050,
    "name": "北辰区",
    "parentId": 3,
    "districtList": [{
      "id": 6646,
      "name": "外环内",
      "parentId": 51050,
      "districtList": [] },

    {
      "id": 36167,
      "name": "外环外双街镇，河北工大新校，屈店工业园",
      "parentId": 51050,
      "districtList": [] },

    {
      "id": 36168,
      "name": "外环外其它地区",
      "parentId": 51050,
      "districtList": [] }] },



  {
    "id": 51051,
    "name": "宝坻区",
    "parentId": 3,
    "districtList": [{
      "id": 22848,
      "name": "城关镇、马家店开发区、天宝工业园",
      "parentId": 51051,
      "districtList": [] },

    {
      "id": 22849,
      "name": "其它地区",
      "parentId": 51051,
      "districtList": [] }] },



  {
    "id": 51052,
    "name": "宁河县",
    "parentId": 3,
    "districtList": [{
      "id": 23674,
      "name": "芦台镇、经济开发区、贸易开发区",
      "parentId": 51052,
      "districtList": [] },

    {
      "id": 23675,
      "name": "其它地区",
      "parentId": 51052,
      "districtList": [] }] }] },





{
  "id": 4,
  "name": "重庆",
  "parentId": 0,
  "districtList": [{
    "id": 113,
    "name": "万州区",
    "parentId": 4,
    "districtList": [{
      "id": 9786,
      "name": "白土镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9787,
      "name": "白羊镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9788,
      "name": "大周镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9789,
      "name": "弹子镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9790,
      "name": "分水镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9791,
      "name": "甘宁镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9792,
      "name": "高峰镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9793,
      "name": "高梁镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9794,
      "name": "后山镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9795,
      "name": "李河镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9796,
      "name": "龙驹镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9797,
      "name": "龙沙镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9798,
      "name": "罗田镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9799,
      "name": "孙家镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9800,
      "name": "太安镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9801,
      "name": "太龙镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9802,
      "name": "天城镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9803,
      "name": "武陵镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9804,
      "name": "响水镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9805,
      "name": "小周镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9806,
      "name": "新田镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9807,
      "name": "新乡镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9808,
      "name": "熊家镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9809,
      "name": "余家镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9810,
      "name": "长岭镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9811,
      "name": "长坪镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9812,
      "name": "长滩镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9813,
      "name": "走马镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9814,
      "name": "瀼渡镇",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9815,
      "name": "茨竹乡",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9816,
      "name": "柱山乡",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9817,
      "name": "燕山乡",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9818,
      "name": "溪口乡",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9819,
      "name": "普子乡",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9820,
      "name": "地宝乡",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9821,
      "name": "铁峰乡",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9822,
      "name": "黄柏乡",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9823,
      "name": "九池乡",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9824,
      "name": "梨树乡",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9825,
      "name": "郭村乡",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 9826,
      "name": "恒合乡",
      "parentId": 113,
      "districtList": [] },

    {
      "id": 52484,
      "name": "城区",
      "parentId": 113,
      "districtList": [] }] },



  {
    "id": 114,
    "name": "涪陵区",
    "parentId": 4,
    "districtList": [{
      "id": 9898,
      "name": "李渡镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9899,
      "name": "白涛镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9900,
      "name": "百胜镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9901,
      "name": "堡子镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9902,
      "name": "焦石镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9903,
      "name": "蔺市镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9904,
      "name": "龙桥镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9905,
      "name": "龙潭镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9906,
      "name": "马武镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9907,
      "name": "南沱镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9908,
      "name": "青羊镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9909,
      "name": "清溪镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9910,
      "name": "石沱镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9911,
      "name": "新妙镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9912,
      "name": "义和镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9913,
      "name": "增福乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9914,
      "name": "珍溪镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9915,
      "name": "镇安镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9916,
      "name": "致韩镇",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9917,
      "name": "土地坡乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9918,
      "name": "武陵山乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9919,
      "name": "中峰乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9920,
      "name": "梓里乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9921,
      "name": "丛林乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9922,
      "name": "大木乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9923,
      "name": "惠民乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9924,
      "name": "酒店乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9925,
      "name": "聚宝乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9926,
      "name": "卷洞乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9927,
      "name": "两汇乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9928,
      "name": "罗云乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9929,
      "name": "明家乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9930,
      "name": "仁义乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9931,
      "name": "山窝乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9932,
      "name": "石和乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9933,
      "name": "石龙乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9934,
      "name": "太和乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9935,
      "name": "天台乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9936,
      "name": "同乐乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 9937,
      "name": "新村乡",
      "parentId": 114,
      "districtList": [] },

    {
      "id": 52485,
      "name": "城区",
      "parentId": 114,
      "districtList": [] }] },



  {
    "id": 115,
    "name": "梁平区",
    "parentId": 4,
    "districtList": [{
      "id": 9938,
      "name": "梁山镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9939,
      "name": "柏家镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9940,
      "name": "碧山镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9941,
      "name": "大观镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9942,
      "name": "福禄镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9943,
      "name": "合兴镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9944,
      "name": "和林镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9945,
      "name": "虎城镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9946,
      "name": "回龙镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9947,
      "name": "金带镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9948,
      "name": "聚奎镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9949,
      "name": "礼让镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9950,
      "name": "龙门镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9951,
      "name": "明达镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9952,
      "name": "蟠龙镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9953,
      "name": "屏锦镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9954,
      "name": "仁贤镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9955,
      "name": "石安镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9956,
      "name": "文化镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9957,
      "name": "新盛镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9958,
      "name": "荫平镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9959,
      "name": "袁驿镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9960,
      "name": "云龙镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9961,
      "name": "竹山镇",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9962,
      "name": "安胜乡",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9963,
      "name": "铁门乡",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9964,
      "name": "紫照乡",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9965,
      "name": "曲水乡",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9966,
      "name": "龙胜乡",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9967,
      "name": "城北乡",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9968,
      "name": "城东乡",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 9969,
      "name": "复平乡",
      "parentId": 115,
      "districtList": [] },

    {
      "id": 39680,
      "name": "县城内",
      "parentId": 115,
      "districtList": [] }] },



  {
    "id": 119,
    "name": "南川区",
    "parentId": 4,
    "districtList": [{
      "id": 9973,
      "name": "太平场镇",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9974,
      "name": "大观镇",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9975,
      "name": "大有镇",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9976,
      "name": "合溪镇",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9977,
      "name": "金山镇",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9978,
      "name": "鸣玉镇",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9979,
      "name": "南平镇",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9980,
      "name": "三泉镇",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9981,
      "name": "神童镇",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9982,
      "name": "石墙镇",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9983,
      "name": "水江镇",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9984,
      "name": "头渡镇",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9985,
      "name": "兴隆镇",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9986,
      "name": "冷水关乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9987,
      "name": "德隆乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9988,
      "name": "峰岩乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9989,
      "name": "福寿乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9990,
      "name": "古花乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9991,
      "name": "河图乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9992,
      "name": "民主乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9993,
      "name": "木凉乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9994,
      "name": "乾丰乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9995,
      "name": "庆元乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9996,
      "name": "石莲乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9997,
      "name": "石溪乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9998,
      "name": "铁村乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 9999,
      "name": "土溪乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 10000,
      "name": "鱼泉乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 10001,
      "name": "中桥乡",
      "parentId": 119,
      "districtList": [] },

    {
      "id": 52486,
      "name": "城区",
      "parentId": 119,
      "districtList": [] }] },



  {
    "id": 123,
    "name": "潼南区",
    "parentId": 4,
    "districtList": [{
      "id": 9756,
      "name": "柏梓镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9757,
      "name": "宝龙镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9758,
      "name": "崇龛镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9759,
      "name": "古溪镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9760,
      "name": "龙形镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9761,
      "name": "米心镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9762,
      "name": "群力镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9763,
      "name": "上和镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9764,
      "name": "双江镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9765,
      "name": "太安镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9766,
      "name": "塘坝镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9767,
      "name": "卧佛镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9768,
      "name": "五桂镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9769,
      "name": "小渡镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9770,
      "name": "新胜镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9771,
      "name": "玉溪镇",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9772,
      "name": "别口乡",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9773,
      "name": "田家乡",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 9774,
      "name": "寿桥乡",
      "parentId": 123,
      "districtList": [] },

    {
      "id": 39688,
      "name": "县城内",
      "parentId": 123,
      "districtList": [] }] },



  {
    "id": 126,
    "name": "大足区",
    "parentId": 4,
    "districtList": [{
      "id": 13520,
      "name": "龙滩子镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13521,
      "name": "龙水镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13522,
      "name": "智凤镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13523,
      "name": "宝顶镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13524,
      "name": "中敖镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13525,
      "name": "三驱镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13526,
      "name": "宝兴镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13527,
      "name": "玉龙镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13528,
      "name": "石马镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13529,
      "name": "拾万镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13530,
      "name": "回龙镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13531,
      "name": "金山镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13532,
      "name": "万古镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13533,
      "name": "国梁镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13534,
      "name": "雍溪镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13535,
      "name": "珠溪镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13536,
      "name": "龙石镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13537,
      "name": "邮亭镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13538,
      "name": "铁山镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13539,
      "name": "高升镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13540,
      "name": "季家镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13541,
      "name": "古龙镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13542,
      "name": "高坪镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13543,
      "name": "双路镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 13544,
      "name": "通桥镇",
      "parentId": 126,
      "districtList": [] },

    {
      "id": 52487,
      "name": "城区",
      "parentId": 126,
      "districtList": [] }] },



  {
    "id": 128,
    "name": "黔江区",
    "parentId": 4,
    "districtList": [{
      "id": 10005,
      "name": "正阳镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10006,
      "name": "舟白镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10007,
      "name": "阿蓬江镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10008,
      "name": "小南海镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10009,
      "name": "鹅池镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10010,
      "name": "冯家镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10011,
      "name": "黑溪镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10012,
      "name": "黄溪镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10013,
      "name": "金溪镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10014,
      "name": "黎水镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10015,
      "name": "邻鄂镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10016,
      "name": "马喇镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10017,
      "name": "石会镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10018,
      "name": "石家镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10019,
      "name": "濯水镇",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10020,
      "name": "白石乡",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10021,
      "name": "白土乡",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10022,
      "name": "金洞乡",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10023,
      "name": "蓬东乡",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10024,
      "name": "沙坝乡",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10025,
      "name": "杉岭乡",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10026,
      "name": "水市乡",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10027,
      "name": "水田乡",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10028,
      "name": "太极乡",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10029,
      "name": "五里乡",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10030,
      "name": "新华乡",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 10031,
      "name": "中塘乡",
      "parentId": 128,
      "districtList": [] },

    {
      "id": 52488,
      "name": "城区",
      "parentId": 128,
      "districtList": [] }] },



  {
    "id": 129,
    "name": "武隆区",
    "parentId": 4,
    "districtList": [{
      "id": 10032,
      "name": "仙女山镇",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10033,
      "name": "巷口镇",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10034,
      "name": "白马镇",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10035,
      "name": "火炉镇",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10036,
      "name": "江口镇",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10037,
      "name": "平桥镇",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10038,
      "name": "桐梓镇",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10039,
      "name": "土坎镇",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10040,
      "name": "鸭江镇",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10041,
      "name": "羊角镇",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10042,
      "name": "长坝镇",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10043,
      "name": "白云乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10044,
      "name": "沧沟乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10045,
      "name": "凤来乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10046,
      "name": "浩口乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10047,
      "name": "和顺乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10048,
      "name": "后坪乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10049,
      "name": "黄莺乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10050,
      "name": "接龙乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10051,
      "name": "庙垭乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10052,
      "name": "石桥乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10053,
      "name": "双河乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10054,
      "name": "铁矿乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10055,
      "name": "土地乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10056,
      "name": "文复乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 10057,
      "name": "赵家乡",
      "parentId": 129,
      "districtList": [] },

    {
      "id": 39692,
      "name": "县城内",
      "parentId": 129,
      "districtList": [] }] },



  {
    "id": 130,
    "name": "丰都县",
    "parentId": 4,
    "districtList": [{
      "id": 10059,
      "name": "南天湖镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10060,
      "name": "许明寺镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10061,
      "name": "包鸾镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10062,
      "name": "董家镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10063,
      "name": "高家镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10064,
      "name": "虎威镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10065,
      "name": "江池镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10066,
      "name": "龙河镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10067,
      "name": "名山镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10068,
      "name": "三元镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10069,
      "name": "社坛镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10070,
      "name": "十直镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10071,
      "name": "树人镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10072,
      "name": "双路镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10073,
      "name": "武平镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10074,
      "name": "兴义镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10075,
      "name": "湛普镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10076,
      "name": "镇江镇",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10077,
      "name": "太平坝乡",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10078,
      "name": "双龙场乡",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10079,
      "name": "保合乡",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10080,
      "name": "崇兴乡",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10081,
      "name": "都督乡",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10082,
      "name": "暨龙乡",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10083,
      "name": "栗子乡",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10084,
      "name": "龙孔乡",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10085,
      "name": "青龙乡",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10086,
      "name": "仁沙乡",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10087,
      "name": "三坝乡",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 10088,
      "name": "三建乡",
      "parentId": 130,
      "districtList": [] },

    {
      "id": 39694,
      "name": "县城内",
      "parentId": 130,
      "districtList": [] }] },



  {
    "id": 131,
    "name": "奉节县",
    "parentId": 4,
    "districtList": [{
      "id": 10377,
      "name": "永安镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10378,
      "name": "白帝镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10379,
      "name": "草堂镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10380,
      "name": "大树镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10381,
      "name": "汾河镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10382,
      "name": "公平镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10383,
      "name": "甲高镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10384,
      "name": "康乐镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10385,
      "name": "青龙镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10386,
      "name": "吐祥镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10387,
      "name": "新民镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10388,
      "name": "兴隆镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10389,
      "name": "羊市镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10390,
      "name": "朱衣镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10391,
      "name": "竹园镇",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10392,
      "name": "安坪乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10393,
      "name": "冯坪乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10394,
      "name": "鹤峰乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10395,
      "name": "红土乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10396,
      "name": "康坪乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10397,
      "name": "龙桥乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10398,
      "name": "平安乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10399,
      "name": "石岗乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10400,
      "name": "太和乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10401,
      "name": "五马乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10402,
      "name": "新政乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10403,
      "name": "岩湾乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10404,
      "name": "云雾乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 10405,
      "name": "长安乡",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 39698,
      "name": "县城内",
      "parentId": 131,
      "districtList": [] },

    {
      "id": 51706,
      "name": "永乐镇",
      "parentId": 131,
      "districtList": [] }] },



  {
    "id": 132,
    "name": "开州区",
    "parentId": 4,
    "districtList": [{
      "id": 9831,
      "name": "九龙山镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9832,
      "name": "大进镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9833,
      "name": "敦好镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9834,
      "name": "高桥镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9835,
      "name": "郭家镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9836,
      "name": "和谦镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9837,
      "name": "河堰镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9838,
      "name": "厚坝镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9839,
      "name": "临江镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9840,
      "name": "南门镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9841,
      "name": "南雅镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9842,
      "name": "渠口镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9843,
      "name": "铁桥镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9844,
      "name": "温泉镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9845,
      "name": "义和镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9846,
      "name": "长沙镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9847,
      "name": "赵家镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9848,
      "name": "镇安镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9849,
      "name": "中和镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9850,
      "name": "竹溪镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9851,
      "name": "三汇口乡",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9852,
      "name": "白桥乡",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9853,
      "name": "大德乡",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9854,
      "name": "关面乡",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9855,
      "name": "金峰乡",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9856,
      "name": "麻柳乡",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9857,
      "name": "满月乡",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9858,
      "name": "谭家乡",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9859,
      "name": "天和乡",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9860,
      "name": "巫山镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9861,
      "name": "五通乡",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 9862,
      "name": "紫水乡",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 39699,
      "name": "县城内",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 51202,
      "name": "白桥镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 51203,
      "name": "大德镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 51204,
      "name": "金峰镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 51205,
      "name": "谭家镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 51206,
      "name": "天和镇",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 51207,
      "name": "白泉乡",
      "parentId": 132,
      "districtList": [] },

    {
      "id": 52083,
      "name": "岳溪镇",
      "parentId": 132,
      "districtList": [] }] },



  {
    "id": 133,
    "name": "云阳县",
    "parentId": 4,
    "districtList": [{
      "id": 10091,
      "name": "云阳镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10092,
      "name": "巴阳镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10093,
      "name": "凤鸣镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10094,
      "name": "高阳镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10095,
      "name": "故陵镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10096,
      "name": "红狮镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10097,
      "name": "黄石镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10098,
      "name": "江口镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10099,
      "name": "龙角镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10100,
      "name": "路阳镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10101,
      "name": "南溪镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10102,
      "name": "农坝镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10103,
      "name": "盘龙镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10104,
      "name": "平安镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10105,
      "name": "渠马镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10106,
      "name": "人和镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10107,
      "name": "桑坪镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10108,
      "name": "沙市镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10109,
      "name": "双土镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10110,
      "name": "鱼泉镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10111,
      "name": "云安镇",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10112,
      "name": "洞鹿乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10113,
      "name": "后叶乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10114,
      "name": "龙洞乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10115,
      "name": "毛坝乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10116,
      "name": "泥溪乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10117,
      "name": "票草乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10118,
      "name": "普安乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10119,
      "name": "栖霞乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10120,
      "name": "清水乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10121,
      "name": "上坝乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10122,
      "name": "石门乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10123,
      "name": "双龙乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10124,
      "name": "水口乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10125,
      "name": "外郎乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10126,
      "name": "新津乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10127,
      "name": "堰坪乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10128,
      "name": "养鹿乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10129,
      "name": "耀灵乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 10130,
      "name": "云硐乡",
      "parentId": 133,
      "districtList": [] },

    {
      "id": 39701,
      "name": "县城内",
      "parentId": 133,
      "districtList": [] }] },



  {
    "id": 134,
    "name": "忠县",
    "parentId": 4,
    "districtList": [{
      "id": 10131,
      "name": "忠州镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10132,
      "name": "拔山镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10133,
      "name": "白石镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10134,
      "name": "东溪镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10135,
      "name": "复兴镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10136,
      "name": "官坝镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10137,
      "name": "花桥镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10138,
      "name": "黄金镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10139,
      "name": "金鸡镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10140,
      "name": "马灌镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10141,
      "name": "任家镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10142,
      "name": "汝溪镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10143,
      "name": "三汇镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10144,
      "name": "石宝镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10145,
      "name": "石黄镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10146,
      "name": "双桂镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10147,
      "name": "乌杨镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10148,
      "name": "新生镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10149,
      "name": "洋渡镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10150,
      "name": "野鹤镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10151,
      "name": "永丰镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10152,
      "name": "金声乡",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10153,
      "name": "磨子乡",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10154,
      "name": "善广乡",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10155,
      "name": "石子乡",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10156,
      "name": "涂井乡",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 10157,
      "name": "兴峰乡",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 19915,
      "name": "新立镇",
      "parentId": 134,
      "districtList": [] },

    {
      "id": 39702,
      "name": "县城内",
      "parentId": 134,
      "districtList": [] }] },



  {
    "id": 135,
    "name": "巫溪县",
    "parentId": 4,
    "districtList": [{
      "id": 10158,
      "name": "城厢镇",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10159,
      "name": "凤凰镇",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10160,
      "name": "古路镇",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10161,
      "name": "尖山镇",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10162,
      "name": "宁厂镇",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10163,
      "name": "上磺镇",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10164,
      "name": "文峰镇",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10165,
      "name": "下堡镇",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10166,
      "name": "徐家镇",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10167,
      "name": "朝阳洞乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10168,
      "name": "大河乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10169,
      "name": "峰灵乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10170,
      "name": "花台乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10171,
      "name": "兰英乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10172,
      "name": "菱角乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10173,
      "name": "蒲莲乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10174,
      "name": "胜利乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10175,
      "name": "双阳乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10176,
      "name": "塘坊乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10177,
      "name": "天星乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10178,
      "name": "天元乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10179,
      "name": "田坝乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10180,
      "name": "通城乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10181,
      "name": "土城乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10182,
      "name": "乌龙乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10183,
      "name": "鱼鳞乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10184,
      "name": "长桂乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10185,
      "name": "中岗乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 10186,
      "name": "中梁乡",
      "parentId": 135,
      "districtList": [] },

    {
      "id": 39704,
      "name": "县城内",
      "parentId": 135,
      "districtList": [] }] },



  {
    "id": 136,
    "name": "巫山县",
    "parentId": 4,
    "districtList": [{
      "id": 10187,
      "name": "巫峡镇",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10188,
      "name": "大昌镇",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10189,
      "name": "福田镇",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10190,
      "name": "官渡镇",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10191,
      "name": "官阳镇",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10192,
      "name": "龙溪镇",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10193,
      "name": "骡坪镇",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10194,
      "name": "庙堂乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10195,
      "name": "庙宇镇",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10196,
      "name": "双龙镇",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10197,
      "name": "铜鼓镇",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10198,
      "name": "抱龙镇",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10199,
      "name": "大溪乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10200,
      "name": "当阳乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10201,
      "name": "邓家乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10202,
      "name": "笃坪乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10203,
      "name": "红椿乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10204,
      "name": "建平乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10205,
      "name": "金坪乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10206,
      "name": "两坪乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10207,
      "name": "龙井乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10208,
      "name": "培石乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10209,
      "name": "平河乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10210,
      "name": "曲尺乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10211,
      "name": "三溪乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 10212,
      "name": "竹贤乡",
      "parentId": 136,
      "districtList": [] },

    {
      "id": 39706,
      "name": "县城内",
      "parentId": 136,
      "districtList": [] }] },



  {
    "id": 137,
    "name": "石柱县",
    "parentId": 4,
    "districtList": [{
      "id": 10213,
      "name": "南宾镇",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10214,
      "name": "黄水镇",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10215,
      "name": "临溪镇",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10216,
      "name": "龙沙镇",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10217,
      "name": "马武镇",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10218,
      "name": "沙子镇",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10219,
      "name": "王场镇",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10220,
      "name": "西沱镇",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10221,
      "name": "下路镇",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10222,
      "name": "沿溪镇",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10223,
      "name": "渔池镇",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10224,
      "name": "悦崃镇",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10225,
      "name": "大歇乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10226,
      "name": "枫木乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10227,
      "name": "河嘴乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10228,
      "name": "黄鹤乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10229,
      "name": "金铃乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10230,
      "name": "金竹乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10231,
      "name": "冷水乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10232,
      "name": "黎场乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10233,
      "name": "六塘乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10234,
      "name": "龙潭乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10235,
      "name": "桥头乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10236,
      "name": "三河乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10237,
      "name": "三益乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10238,
      "name": "石家乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10239,
      "name": "万朝乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10240,
      "name": "王家乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10241,
      "name": "洗新乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10242,
      "name": "新乐乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 10243,
      "name": "中益乡",
      "parentId": 137,
      "districtList": [] },

    {
      "id": 39710,
      "name": "县城内",
      "parentId": 137,
      "districtList": [] }] },



  {
    "id": 138,
    "name": "彭水县",
    "parentId": 4,
    "districtList": [{
      "id": 10245,
      "name": "保家镇",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10246,
      "name": "高谷镇",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10247,
      "name": "黄家镇",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10248,
      "name": "连湖镇",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10249,
      "name": "龙射镇",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10250,
      "name": "鹿角镇",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10251,
      "name": "普子镇",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10252,
      "name": "桑柘镇",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10253,
      "name": "万足镇",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10254,
      "name": "郁山镇",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10255,
      "name": "梅子垭乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10256,
      "name": "鞍子乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10257,
      "name": "大垭乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10258,
      "name": "棣棠乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10259,
      "name": "靛水乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10260,
      "name": "朗溪乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10261,
      "name": "联合乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10262,
      "name": "龙塘乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10263,
      "name": "龙溪乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10264,
      "name": "芦塘乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10265,
      "name": "鹿鸣乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10266,
      "name": "平安乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10267,
      "name": "迁乔乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10268,
      "name": "乔梓乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10269,
      "name": "润溪乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10270,
      "name": "三义乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10271,
      "name": "善感乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10272,
      "name": "石柳乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10273,
      "name": "石盘乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10274,
      "name": "双龙乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10275,
      "name": "太原乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10276,
      "name": "桐楼乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10277,
      "name": "小厂乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10278,
      "name": "新田乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10279,
      "name": "岩东乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10280,
      "name": "长滩乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10281,
      "name": "诸佛乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 10282,
      "name": "走马乡",
      "parentId": 138,
      "districtList": [] },

    {
      "id": 39711,
      "name": "县城内",
      "parentId": 138,
      "districtList": [] }] },



  {
    "id": 139,
    "name": "垫江县",
    "parentId": 4,
    "districtList": [{
      "id": 10283,
      "name": "桂溪镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10284,
      "name": "澄溪镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10285,
      "name": "高安镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10286,
      "name": "高峰镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10287,
      "name": "鹤游镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10288,
      "name": "普顺镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10289,
      "name": "沙坪镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10290,
      "name": "太平镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10291,
      "name": "五洞镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10292,
      "name": "新民镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10293,
      "name": "砚台镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10294,
      "name": "永安镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10295,
      "name": "周嘉镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10296,
      "name": "白家乡",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10297,
      "name": "包家乡",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10298,
      "name": "曹回乡",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10299,
      "name": "大石乡",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10300,
      "name": "杠家乡",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10301,
      "name": "黄沙乡",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10302,
      "name": "裴兴乡",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10303,
      "name": "三溪乡",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10304,
      "name": "沙河乡",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10305,
      "name": "永平乡",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 10306,
      "name": "长龙乡",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 32060,
      "name": "坪山镇",
      "parentId": 139,
      "districtList": [] },

    {
      "id": 39712,
      "name": "县城内",
      "parentId": 139,
      "districtList": [] }] },



  {
    "id": 140,
    "name": "酉阳县",
    "parentId": 4,
    "districtList": [{
      "id": 10307,
      "name": "钟多镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10308,
      "name": "苍岭镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10309,
      "name": "车田乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10310,
      "name": "大溪镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10311,
      "name": "丁市镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10312,
      "name": "泔溪镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10313,
      "name": "龚滩镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10314,
      "name": "黑水镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10315,
      "name": "后溪镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10316,
      "name": "李溪镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10317,
      "name": "龙潭镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10318,
      "name": "麻旺镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10319,
      "name": "小河镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10320,
      "name": "兴隆镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10321,
      "name": "酉酬镇",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10322,
      "name": "南腰界乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10323,
      "name": "后坪坝乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10324,
      "name": "板溪乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10325,
      "name": "官清乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10326,
      "name": "花田乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10327,
      "name": "江丰乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10328,
      "name": "可大乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10329,
      "name": "浪坪乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10330,
      "name": "两罾乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10331,
      "name": "毛坝乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10332,
      "name": "庙溪乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10333,
      "name": "木叶乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10334,
      "name": "楠木乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10335,
      "name": "偏柏乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10336,
      "name": "清泉乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10337,
      "name": "双泉乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10338,
      "name": "天馆乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10339,
      "name": "铜鼓乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10340,
      "name": "涂市乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10341,
      "name": "万木乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10342,
      "name": "五福乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10343,
      "name": "宜居乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10344,
      "name": "腴地乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 10345,
      "name": "板桥乡",
      "parentId": 140,
      "districtList": [] },

    {
      "id": 39714,
      "name": "县城内",
      "parentId": 140,
      "districtList": [] }] },



  {
    "id": 141,
    "name": "秀山县",
    "parentId": 4,
    "districtList": [{
      "id": 10346,
      "name": "清溪场镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10347,
      "name": "中和镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10348,
      "name": "隘口镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10349,
      "name": "峨溶镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10350,
      "name": "官庄镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10351,
      "name": "洪安镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10352,
      "name": "兰桥镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10353,
      "name": "龙池镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10354,
      "name": "梅江镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10355,
      "name": "平凯镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10356,
      "name": "溶溪镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10357,
      "name": "石堤镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10358,
      "name": "石耶镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10359,
      "name": "雅江镇",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10360,
      "name": "巴家乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10361,
      "name": "保安乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10362,
      "name": "岑溪乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10363,
      "name": "大溪乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10364,
      "name": "干川乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10365,
      "name": "膏田乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10366,
      "name": "官舟乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10367,
      "name": "海洋乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10368,
      "name": "里仁乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10369,
      "name": "妙泉乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10370,
      "name": "平马乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10371,
      "name": "宋农乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10372,
      "name": "溪口乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10373,
      "name": "孝溪乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10374,
      "name": "涌洞乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10375,
      "name": "中平乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 10376,
      "name": "钟灵乡",
      "parentId": 141,
      "districtList": [] },

    {
      "id": 39716,
      "name": "县城内",
      "parentId": 141,
      "districtList": [] }] },



  {
    "id": 4164,
    "name": "城口县",
    "parentId": 4,
    "districtList": [{
      "id": 10406,
      "name": "葛城镇",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10407,
      "name": "巴山镇",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10408,
      "name": "高观镇",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10409,
      "name": "庙坝镇",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10410,
      "name": "明通镇",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10411,
      "name": "坪坝镇",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10412,
      "name": "修齐镇",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10413,
      "name": "北屏乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10414,
      "name": "东安乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10415,
      "name": "高楠乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10416,
      "name": "高燕乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10417,
      "name": "河鱼乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10418,
      "name": "厚坪乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10419,
      "name": "鸡鸣乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10420,
      "name": "岚天乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10421,
      "name": "蓼子乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10422,
      "name": "龙田乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10423,
      "name": "明中乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10424,
      "name": "双河乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10425,
      "name": "咸宜乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10426,
      "name": "沿河乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10427,
      "name": "治平乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10428,
      "name": "周溪乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 10429,
      "name": "左岚乡",
      "parentId": 4164,
      "districtList": [] },

    {
      "id": 39717,
      "name": "县城内",
      "parentId": 4164,
      "districtList": [] }] },



  {
    "id": 48131,
    "name": "璧山区",
    "parentId": 4,
    "districtList": [{
      "id": 48185,
      "name": "县城内",
      "parentId": 48131,
      "districtList": [] },

    {
      "id": 48188,
      "name": "青杠镇",
      "parentId": 48131,
      "districtList": [] },

    {
      "id": 48189,
      "name": "来凤镇",
      "parentId": 48131,
      "districtList": [] },

    {
      "id": 48190,
      "name": "丁家镇",
      "parentId": 48131,
      "districtList": [] },

    {
      "id": 48191,
      "name": "大路镇",
      "parentId": 48131,
      "districtList": [] },

    {
      "id": 48192,
      "name": "八塘镇",
      "parentId": 48131,
      "districtList": [] },

    {
      "id": 48193,
      "name": "七塘镇",
      "parentId": 48131,
      "districtList": [] },

    {
      "id": 48194,
      "name": "河边镇",
      "parentId": 48131,
      "districtList": [] },

    {
      "id": 48195,
      "name": "福禄镇",
      "parentId": 48131,
      "districtList": [] },

    {
      "id": 48196,
      "name": "大兴镇",
      "parentId": 48131,
      "districtList": [] },

    {
      "id": 48197,
      "name": "正兴镇",
      "parentId": 48131,
      "districtList": [] },

    {
      "id": 48198,
      "name": "广普镇",
      "parentId": 48131,
      "districtList": [] },

    {
      "id": 48199,
      "name": "三合镇",
      "parentId": 48131,
      "districtList": [] },

    {
      "id": 48200,
      "name": "健龙镇",
      "parentId": 48131,
      "districtList": [] }] },



  {
    "id": 48132,
    "name": "荣昌区",
    "parentId": 4,
    "districtList": [{
      "id": 48163,
      "name": "县城内",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48166,
      "name": "广顺镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48167,
      "name": "安富镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48168,
      "name": "峰高镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48169,
      "name": "双河镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48170,
      "name": "直升镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48171,
      "name": "路孔镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48172,
      "name": "清江镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48173,
      "name": "仁义镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48174,
      "name": "河包镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48175,
      "name": "古昌镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48176,
      "name": "吴家镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48177,
      "name": "观胜镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48178,
      "name": "铜鼓镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48179,
      "name": "清流镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48180,
      "name": "盘龙镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48181,
      "name": "远觉镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48182,
      "name": "清升镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48183,
      "name": "荣隆镇",
      "parentId": 48132,
      "districtList": [] },

    {
      "id": 48184,
      "name": "龙集镇",
      "parentId": 48132,
      "districtList": [] }] },



  {
    "id": 48133,
    "name": "铜梁区",
    "parentId": 4,
    "districtList": [{
      "id": 48134,
      "name": "县城内",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48138,
      "name": "土桥镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48139,
      "name": "二坪镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48140,
      "name": "水口镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48141,
      "name": "安居镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48142,
      "name": "白羊镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48143,
      "name": "平滩镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48144,
      "name": "石鱼镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48145,
      "name": "福果镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48146,
      "name": "维新镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48147,
      "name": "高楼镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48148,
      "name": "大庙镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48149,
      "name": "围龙镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48150,
      "name": "华兴镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48151,
      "name": "永嘉镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48152,
      "name": "安溪镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48153,
      "name": "西河镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48154,
      "name": "太平镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48155,
      "name": "旧县镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48156,
      "name": "虎峰镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48157,
      "name": "少云镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48158,
      "name": "蒲吕镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48159,
      "name": "侣俸镇",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48160,
      "name": "小林乡",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48161,
      "name": "双山乡",
      "parentId": 48133,
      "districtList": [] },

    {
      "id": 48162,
      "name": "庆隆乡",
      "parentId": 48133,
      "districtList": [] }] },



  {
    "id": 48201,
    "name": "合川区",
    "parentId": 4,
    "districtList": [{
      "id": 48298,
      "name": "草街镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48299,
      "name": "盐井镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48300,
      "name": "云门镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48301,
      "name": "大石镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48302,
      "name": "沙鱼镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48303,
      "name": "官渡镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48304,
      "name": "涞滩镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48305,
      "name": "肖家镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48306,
      "name": "古楼镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48307,
      "name": "三庙镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48308,
      "name": "二郎镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48309,
      "name": "龙凤镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48310,
      "name": "隆兴镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48311,
      "name": "铜溪镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48312,
      "name": "双凤镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48313,
      "name": "狮滩镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48314,
      "name": "清平镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48315,
      "name": "土场镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48316,
      "name": "小沔镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48317,
      "name": "三汇镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48318,
      "name": "香龙镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48319,
      "name": "钱塘镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48320,
      "name": "龙市镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48321,
      "name": "燕窝镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48322,
      "name": "太和镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48323,
      "name": "渭沱镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 48324,
      "name": "双槐镇",
      "parentId": 48201,
      "districtList": [] },

    {
      "id": 52489,
      "name": "城区",
      "parentId": 48201,
      "districtList": [] }] },



  {
    "id": 48202,
    "name": "巴南区",
    "parentId": 4,
    "districtList": [{
      "id": 48355,
      "name": "南泉镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48356,
      "name": "一品镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48357,
      "name": "南彭镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48358,
      "name": "惠民镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48359,
      "name": "麻柳嘴镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48360,
      "name": "天星寺镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48361,
      "name": "双河口镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48362,
      "name": "界石镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48363,
      "name": "安澜镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48364,
      "name": "跳石镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48365,
      "name": "木洞镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48366,
      "name": "丰盛镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48367,
      "name": "二圣镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48368,
      "name": "东泉镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48369,
      "name": "姜家镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48370,
      "name": "接龙镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48371,
      "name": "石滩镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 48372,
      "name": "石龙镇",
      "parentId": 48202,
      "districtList": [] },

    {
      "id": 52490,
      "name": "城区",
      "parentId": 48202,
      "districtList": [] }] },



  {
    "id": 48203,
    "name": "北碚区",
    "parentId": 4,
    "districtList": [{
      "id": 48240,
      "name": "东阳镇",
      "parentId": 48203,
      "districtList": [] },

    {
      "id": 48242,
      "name": "蔡家岗镇",
      "parentId": 48203,
      "districtList": [] },

    {
      "id": 48243,
      "name": "童家溪镇",
      "parentId": 48203,
      "districtList": [] },

    {
      "id": 48244,
      "name": "施家梁镇",
      "parentId": 48203,
      "districtList": [] },

    {
      "id": 48245,
      "name": "金刀峡镇",
      "parentId": 48203,
      "districtList": [] },

    {
      "id": 48246,
      "name": "澄江镇",
      "parentId": 48203,
      "districtList": [] },

    {
      "id": 48247,
      "name": "水土镇",
      "parentId": 48203,
      "districtList": [] },

    {
      "id": 48248,
      "name": "歇马镇",
      "parentId": 48203,
      "districtList": [] },

    {
      "id": 48249,
      "name": "天府镇",
      "parentId": 48203,
      "districtList": [] },

    {
      "id": 48250,
      "name": "复兴镇",
      "parentId": 48203,
      "districtList": [] },

    {
      "id": 48251,
      "name": "静观镇",
      "parentId": 48203,
      "districtList": [] },

    {
      "id": 48252,
      "name": "柳荫镇",
      "parentId": 48203,
      "districtList": [] },

    {
      "id": 48253,
      "name": "三圣镇",
      "parentId": 48203,
      "districtList": [] },

    {
      "id": 52491,
      "name": "城区",
      "parentId": 48203,
      "districtList": [] }] },



  {
    "id": 48204,
    "name": "江津区",
    "parentId": 4,
    "districtList": [{
      "id": 48213,
      "name": "四面山镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48214,
      "name": "支坪镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48215,
      "name": "白沙镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48216,
      "name": "珞璜镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48217,
      "name": "柏林镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48218,
      "name": "蔡家镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48219,
      "name": "慈云镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48220,
      "name": "杜市镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48221,
      "name": "广兴镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48222,
      "name": "嘉平镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48223,
      "name": "贾嗣镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48224,
      "name": "李市镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48225,
      "name": "龙华镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48226,
      "name": "石蟆镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48227,
      "name": "石门镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48228,
      "name": "塘河镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48229,
      "name": "吴滩镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48230,
      "name": "西湖镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48231,
      "name": "夏坝镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48232,
      "name": "先锋镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48233,
      "name": "永兴镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48234,
      "name": "油溪镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48235,
      "name": "中山镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 48236,
      "name": "朱杨镇",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 52492,
      "name": "城区",
      "parentId": 48204,
      "districtList": [] },

    {
      "id": 53556,
      "name": "双福镇",
      "parentId": 48204,
      "districtList": [] }] },



  {
    "id": 48205,
    "name": "渝北区",
    "parentId": 4,
    "districtList": [{
      "id": 48332,
      "name": "礼嘉镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48337,
      "name": "两路镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48338,
      "name": "王家镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48339,
      "name": "悦来镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48340,
      "name": "玉峰山镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48341,
      "name": "茨竹镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48342,
      "name": "大盛镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48343,
      "name": "大塆镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48344,
      "name": "古路镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48345,
      "name": "龙兴镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48346,
      "name": "洛碛镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48347,
      "name": "木耳镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48348,
      "name": "石船镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48349,
      "name": "统景镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 48350,
      "name": "兴隆镇",
      "parentId": 48205,
      "districtList": [] },

    {
      "id": 52493,
      "name": "城区",
      "parentId": 48205,
      "districtList": [] }] },



  {
    "id": 48206,
    "name": "长寿区",
    "parentId": 4,
    "districtList": [{
      "id": 48281,
      "name": "长寿湖镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 48282,
      "name": "邻封镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 48283,
      "name": "但渡镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 48284,
      "name": "云集镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 48285,
      "name": "双龙镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 48286,
      "name": "龙河镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 48287,
      "name": "石堰镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 48288,
      "name": "云台镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 48289,
      "name": "海棠镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 48290,
      "name": "葛兰镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 48291,
      "name": "新市镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 48292,
      "name": "八颗镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 48293,
      "name": "洪湖镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 48294,
      "name": "万顺镇",
      "parentId": 48206,
      "districtList": [] },

    {
      "id": 52494,
      "name": "城区",
      "parentId": 48206,
      "districtList": [] }] },



  {
    "id": 48207,
    "name": "永川区",
    "parentId": 4,
    "districtList": [{
      "id": 48257,
      "name": "双竹镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48258,
      "name": "三教镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48259,
      "name": "大安镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48260,
      "name": "陈食镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48261,
      "name": "板桥镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48262,
      "name": "宝峰镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48263,
      "name": "临江镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48264,
      "name": "红炉镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48265,
      "name": "吉安镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48266,
      "name": "金龙镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48267,
      "name": "来苏镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48268,
      "name": "青峰镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48270,
      "name": "双石镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48271,
      "name": "松溉镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48272,
      "name": "五间镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48273,
      "name": "仙龙镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48274,
      "name": "永荣镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48275,
      "name": "朱沱镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 48276,
      "name": "何埂镇",
      "parentId": 48207,
      "districtList": [] },

    {
      "id": 52495,
      "name": "城区",
      "parentId": 48207,
      "districtList": [] }] },



  {
    "id": 50950,
    "name": "江北区",
    "parentId": 4,
    "districtList": [{
      "id": 88,
      "name": "内环以内",
      "parentId": 50950,
      "districtList": [] },

    {
      "id": 50957,
      "name": "寸滩镇",
      "parentId": 50950,
      "districtList": [] },

    {
      "id": 50958,
      "name": "郭家沱镇",
      "parentId": 50950,
      "districtList": [] },

    {
      "id": 50959,
      "name": "铁山坪镇",
      "parentId": 50950,
      "districtList": [] },

    {
      "id": 50960,
      "name": "鱼嘴镇",
      "parentId": 50950,
      "districtList": [] },

    {
      "id": 50961,
      "name": "复盛镇",
      "parentId": 50950,
      "districtList": [] },

    {
      "id": 50962,
      "name": "五宝镇",
      "parentId": 50950,
      "districtList": [] },

    {
      "id": 51198,
      "name": "大石坝镇",
      "parentId": 50950,
      "districtList": [] }] },



  {
    "id": 50951,
    "name": "南岸区",
    "parentId": 4,
    "districtList": [{
      "id": 4298,
      "name": "内环以内",
      "parentId": 50951,
      "districtList": [] },

    {
      "id": 50963,
      "name": "茶园新区",
      "parentId": 50951,
      "districtList": [] },

    {
      "id": 50964,
      "name": "鸡冠石镇",
      "parentId": 50951,
      "districtList": [] },

    {
      "id": 50965,
      "name": "长生桥镇",
      "parentId": 50951,
      "districtList": [] },

    {
      "id": 50966,
      "name": "峡口镇",
      "parentId": 50951,
      "districtList": [] },

    {
      "id": 50967,
      "name": "广阳镇",
      "parentId": 50951,
      "districtList": [] },

    {
      "id": 50968,
      "name": "迎龙镇",
      "parentId": 50951,
      "districtList": [] },

    {
      "id": 52496,
      "name": "城区",
      "parentId": 50951,
      "districtList": [] }] },



  {
    "id": 50952,
    "name": "九龙坡区",
    "parentId": 4,
    "districtList": [{
      "id": 106,
      "name": "内环以内",
      "parentId": 50952,
      "districtList": [] },

    {
      "id": 50969,
      "name": "白市驿镇",
      "parentId": 50952,
      "districtList": [] },

    {
      "id": 50970,
      "name": "铜罐驿镇",
      "parentId": 50952,
      "districtList": [] },

    {
      "id": 50971,
      "name": "华岩镇",
      "parentId": 50952,
      "districtList": [] },

    {
      "id": 50972,
      "name": "巴福镇",
      "parentId": 50952,
      "districtList": [] },

    {
      "id": 50973,
      "name": "含谷镇",
      "parentId": 50952,
      "districtList": [] },

    {
      "id": 50974,
      "name": "金凤镇",
      "parentId": 50952,
      "districtList": [] },

    {
      "id": 50975,
      "name": "石板镇",
      "parentId": 50952,
      "districtList": [] },

    {
      "id": 50976,
      "name": "陶家镇",
      "parentId": 50952,
      "districtList": [] },

    {
      "id": 50977,
      "name": "西彭镇",
      "parentId": 50952,
      "districtList": [] },

    {
      "id": 50978,
      "name": "走马镇",
      "parentId": 50952,
      "districtList": [] }] },



  {
    "id": 50953,
    "name": "沙坪坝区",
    "parentId": 4,
    "districtList": [{
      "id": 50979,
      "name": "内环以内",
      "parentId": 50953,
      "districtList": [] },

    {
      "id": 50980,
      "name": "陈家桥镇",
      "parentId": 50953,
      "districtList": [] },

    {
      "id": 50981,
      "name": "歌乐山镇",
      "parentId": 50953,
      "districtList": [] },

    {
      "id": 50982,
      "name": "青木关镇",
      "parentId": 50953,
      "districtList": [] },

    {
      "id": 50983,
      "name": "回龙坝镇",
      "parentId": 50953,
      "districtList": [] },

    {
      "id": 50984,
      "name": "大学城",
      "parentId": 50953,
      "districtList": [] },

    {
      "id": 50985,
      "name": "虎溪镇",
      "parentId": 50953,
      "districtList": [] },

    {
      "id": 50986,
      "name": "西永镇",
      "parentId": 50953,
      "districtList": [] },

    {
      "id": 50987,
      "name": "土主镇",
      "parentId": 50953,
      "districtList": [] },

    {
      "id": 50988,
      "name": "井口镇",
      "parentId": 50953,
      "districtList": [] },

    {
      "id": 50989,
      "name": "曾家镇",
      "parentId": 50953,
      "districtList": [] },

    {
      "id": 50990,
      "name": "凤凰镇",
      "parentId": 50953,
      "districtList": [] },

    {
      "id": 50991,
      "name": "中梁镇",
      "parentId": 50953,
      "districtList": [] }] },



  {
    "id": 50954,
    "name": "大渡口区",
    "parentId": 4,
    "districtList": [{
      "id": 111,
      "name": "内环以内",
      "parentId": 50954,
      "districtList": [] },

    {
      "id": 50992,
      "name": "茄子溪镇",
      "parentId": 50954,
      "districtList": [] },

    {
      "id": 50993,
      "name": "建胜镇",
      "parentId": 50954,
      "districtList": [] },

    {
      "id": 50994,
      "name": "跳磴镇",
      "parentId": 50954,
      "districtList": [] }] },



  {
    "id": 50995,
    "name": "綦江区",
    "parentId": 4,
    "districtList": [{
      "id": 51000,
      "name": "三江镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51001,
      "name": "安稳镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51002,
      "name": "打通镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51003,
      "name": "丁山镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51004,
      "name": "东溪镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51005,
      "name": "扶欢镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51006,
      "name": "赶水镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51007,
      "name": "郭扶镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51008,
      "name": "横山镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51009,
      "name": "隆盛镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51010,
      "name": "三角镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51011,
      "name": "石壕镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51012,
      "name": "石角镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51013,
      "name": "新盛镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51014,
      "name": "永城镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51015,
      "name": "永新镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51016,
      "name": "中峰镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51017,
      "name": "篆塘镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51018,
      "name": "丛林镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51019,
      "name": "关坝镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51020,
      "name": "黑山镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51021,
      "name": "金桥镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51022,
      "name": "南桐镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51023,
      "name": "青年镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51024,
      "name": "石林镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 51025,
      "name": "万东镇",
      "parentId": 50995,
      "districtList": [] },

    {
      "id": 52497,
      "name": "城区",
      "parentId": 50995,
      "districtList": [] }] },



  {
    "id": 51026,
    "name": "渝中区",
    "parentId": 4,
    "districtList": [{
      "id": 103,
      "name": "全境",
      "parentId": 51026,
      "districtList": [] }] },


  {
    "id": 51027,
    "name": "高新区",
    "parentId": 4,
    "districtList": [{
      "id": 50956,
      "name": "全境",
      "parentId": 51027,
      "districtList": [] }] },


  {
    "id": 51028,
    "name": "北部新区",
    "parentId": 4,
    "districtList": [{
      "id": 50955,
      "name": "全境",
      "parentId": 51028,
      "districtList": [] }] }] },




{
  "id": 5,
  "name": "河北",
  "parentId": 0,
  "districtList": [{
    "id": 142,
    "name": "石家庄市",
    "parentId": 5,
    "districtList": [{
      "id": 143,
      "name": "辛集市",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 145,
      "name": "晋州市",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 146,
      "name": "新乐市",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 153,
      "name": "井陉县",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 154,
      "name": "栾城县",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 156,
      "name": "行唐县",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 157,
      "name": "灵寿县",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 158,
      "name": "高邑县",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 159,
      "name": "赵县",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 160,
      "name": "赞皇县",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 161,
      "name": "深泽县",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 162,
      "name": "无极县",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 163,
      "name": "元氏县",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 3182,
      "name": "井陉矿区",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 4158,
      "name": "平山县",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 42540,
      "name": "藁城区",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 42541,
      "name": "鹿泉市",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 42542,
      "name": "正定县",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 42543,
      "name": "新华区",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 42544,
      "name": "桥西区",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 42545,
      "name": "桥东区",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 42546,
      "name": "裕华区",
      "parentId": 142,
      "districtList": [] },

    {
      "id": 42547,
      "name": "长安区",
      "parentId": 142,
      "districtList": [] }] },



  {
    "id": 148,
    "name": "邯郸市",
    "parentId": 5,
    "districtList": [{
      "id": 167,
      "name": "邯郸县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 168,
      "name": "峰峰矿区",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 169,
      "name": "曲周县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 170,
      "name": "馆陶县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 171,
      "name": "魏县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 172,
      "name": "成安县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 173,
      "name": "大名县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 174,
      "name": "涉县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 175,
      "name": "鸡泽县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 176,
      "name": "邱县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 177,
      "name": "广平县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 178,
      "name": "肥乡县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 180,
      "name": "磁县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 3077,
      "name": "临漳县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 3187,
      "name": "永年县",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 34049,
      "name": "丛台区",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 34050,
      "name": "邯山区",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 34051,
      "name": "复兴区",
      "parentId": 148,
      "districtList": [] },

    {
      "id": 34052,
      "name": "武安市",
      "parentId": 148,
      "districtList": [] }] },



  {
    "id": 164,
    "name": "邢台市",
    "parentId": 5,
    "districtList": [{
      "id": 183,
      "name": "邢台县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 184,
      "name": "南宫市",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 185,
      "name": "沙河市",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 186,
      "name": "柏乡县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 187,
      "name": "任县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 188,
      "name": "清河县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 189,
      "name": "隆尧县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 190,
      "name": "临城县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 191,
      "name": "广宗县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 192,
      "name": "临西县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 193,
      "name": "内丘县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 194,
      "name": "平乡县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 195,
      "name": "巨鹿县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 196,
      "name": "新河县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 197,
      "name": "南和县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 257,
      "name": "宁晋县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 3098,
      "name": "威县",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 47712,
      "name": "桥西区",
      "parentId": 164,
      "districtList": [] },

    {
      "id": 47713,
      "name": "桥东区",
      "parentId": 164,
      "districtList": [] }] },



  {
    "id": 199,
    "name": "保定市",
    "parentId": 5,
    "districtList": [{
      "id": 203,
      "name": "安国市",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 205,
      "name": "满城区",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 206,
      "name": "清苑县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 207,
      "name": "涞水县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 208,
      "name": "阜平县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 210,
      "name": "定兴县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 211,
      "name": "唐县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 212,
      "name": "高阳县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 213,
      "name": "容城县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 214,
      "name": "涞源县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 215,
      "name": "望都县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 217,
      "name": "易县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 218,
      "name": "曲阳县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 219,
      "name": "蠡县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 220,
      "name": "顺平县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 221,
      "name": "博野县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 222,
      "name": "雄县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 3190,
      "name": "新市区",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 3193,
      "name": "安新县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 47213,
      "name": "涿州市",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 47214,
      "name": "定州市",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 47215,
      "name": "徐水县",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 47216,
      "name": "高碑店市",
      "parentId": 199,
      "districtList": [] },

    {
      "id": 53865,
      "name": "莲池区",
      "parentId": 199,
      "districtList": [] }] },



  {
    "id": 224,
    "name": "张家口市",
    "parentId": 5,
    "districtList": [{
      "id": 225,
      "name": "宣化县",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 226,
      "name": "康保县",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 227,
      "name": "张北县",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 228,
      "name": "阳原县",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 229,
      "name": "赤城县",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 230,
      "name": "怀安县",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 231,
      "name": "怀来县",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 232,
      "name": "崇礼县",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 233,
      "name": "尚义县",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 234,
      "name": "蔚县",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 235,
      "name": "涿鹿县",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 236,
      "name": "万全县",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 238,
      "name": "下花园区",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 3156,
      "name": "沽源县",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 4046,
      "name": "宣化区",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 34298,
      "name": "桥西区",
      "parentId": 224,
      "districtList": [] },

    {
      "id": 34299,
      "name": "桥东区",
      "parentId": 224,
      "districtList": [] }] },



  {
    "id": 239,
    "name": "承德市",
    "parentId": 5,
    "districtList": [{
      "id": 241,
      "name": "兴隆县",
      "parentId": 239,
      "districtList": [] },

    {
      "id": 242,
      "name": "平泉市",
      "parentId": 239,
      "districtList": [] },

    {
      "id": 243,
      "name": "滦平县",
      "parentId": 239,
      "districtList": [] },

    {
      "id": 245,
      "name": "丰宁县",
      "parentId": 239,
      "districtList": [] },

    {
      "id": 246,
      "name": "围场县",
      "parentId": 239,
      "districtList": [] },

    {
      "id": 247,
      "name": "宽城县",
      "parentId": 239,
      "districtList": [] },

    {
      "id": 2767,
      "name": "隆化县",
      "parentId": 239,
      "districtList": [] },

    {
      "id": 3092,
      "name": "承德县",
      "parentId": 239,
      "districtList": [] },

    {
      "id": 3197,
      "name": "双滦区",
      "parentId": 239,
      "districtList": [] },

    {
      "id": 3198,
      "name": "鹰手营子矿区",
      "parentId": 239,
      "districtList": [] },

    {
      "id": 48379,
      "name": "双桥区",
      "parentId": 239,
      "districtList": [] }] },



  {
    "id": 248,
    "name": "秦皇岛市",
    "parentId": 5,
    "districtList": [{
      "id": 261,
      "name": "卢龙县",
      "parentId": 248,
      "districtList": [] },

    {
      "id": 262,
      "name": "青龙县",
      "parentId": 248,
      "districtList": [] },

    {
      "id": 263,
      "name": "昌黎县",
      "parentId": 248,
      "districtList": [] },

    {
      "id": 2990,
      "name": "北戴河区",
      "parentId": 248,
      "districtList": [] },

    {
      "id": 4093,
      "name": "抚宁县",
      "parentId": 248,
      "districtList": [] },

    {
      "id": 48377,
      "name": "海港区",
      "parentId": 248,
      "districtList": [] },

    {
      "id": 48378,
      "name": "山海关区",
      "parentId": 248,
      "districtList": [] }] },



  {
    "id": 258,
    "name": "唐山市",
    "parentId": 5,
    "districtList": [{
      "id": 2756,
      "name": "遵化市",
      "parentId": 258,
      "districtList": [] },

    {
      "id": 2757,
      "name": "丰南区",
      "parentId": 258,
      "districtList": [] },

    {
      "id": 2759,
      "name": "迁西县",
      "parentId": 258,
      "districtList": [] },

    {
      "id": 2760,
      "name": "滦南县",
      "parentId": 258,
      "districtList": [] },

    {
      "id": 2762,
      "name": "玉田县",
      "parentId": 258,
      "districtList": [] },

    {
      "id": 2763,
      "name": "曹妃甸区",
      "parentId": 258,
      "districtList": [] },

    {
      "id": 2764,
      "name": "乐亭县",
      "parentId": 258,
      "districtList": [] },

    {
      "id": 2765,
      "name": "滦县",
      "parentId": 258,
      "districtList": [] },

    {
      "id": 3202,
      "name": "古冶区",
      "parentId": 258,
      "districtList": [] },

    {
      "id": 3203,
      "name": "开平区",
      "parentId": 258,
      "districtList": [] },

    {
      "id": 41497,
      "name": "路北区",
      "parentId": 258,
      "districtList": [] },

    {
      "id": 41499,
      "name": "路南区",
      "parentId": 258,
      "districtList": [] },

    {
      "id": 41500,
      "name": "迁安市",
      "parentId": 258,
      "districtList": [] },

    {
      "id": 41502,
      "name": "丰润区",
      "parentId": 258,
      "districtList": [] }] },



  {
    "id": 264,
    "name": "沧州市",
    "parentId": 5,
    "districtList": [{
      "id": 265,
      "name": "沧县",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 266,
      "name": "泊头市",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 268,
      "name": "河间市",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 269,
      "name": "献县",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 270,
      "name": "肃宁县",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 271,
      "name": "青县",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 272,
      "name": "东光县",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 273,
      "name": "吴桥县",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 276,
      "name": "南皮县",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 277,
      "name": "盐山县",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 278,
      "name": "海兴县",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 279,
      "name": "孟村县",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 49576,
      "name": "运河区",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 49577,
      "name": "新华区",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 49578,
      "name": "任丘市",
      "parentId": 264,
      "districtList": [] },

    {
      "id": 49579,
      "name": "黄骅市",
      "parentId": 264,
      "districtList": [] }] },



  {
    "id": 274,
    "name": "廊坊市",
    "parentId": 5,
    "districtList": [{
      "id": 284,
      "name": "固安县",
      "parentId": 274,
      "districtList": [] },

    {
      "id": 285,
      "name": "永清县",
      "parentId": 274,
      "districtList": [] },

    {
      "id": 286,
      "name": "香河县",
      "parentId": 274,
      "districtList": [] },

    {
      "id": 287,
      "name": "大城县",
      "parentId": 274,
      "districtList": [] },

    {
      "id": 288,
      "name": "文安县",
      "parentId": 274,
      "districtList": [] },

    {
      "id": 289,
      "name": "大厂县",
      "parentId": 274,
      "districtList": [] },

    {
      "id": 3206,
      "name": "安次区",
      "parentId": 274,
      "districtList": [] },

    {
      "id": 3207,
      "name": "广阳区",
      "parentId": 274,
      "districtList": [] },

    {
      "id": 4097,
      "name": "开发区",
      "parentId": 274,
      "districtList": [] },

    {
      "id": 49707,
      "name": "三河市",
      "parentId": 274,
      "districtList": [] },

    {
      "id": 49708,
      "name": "霸州市",
      "parentId": 274,
      "districtList": [] }] },



  {
    "id": 275,
    "name": "衡水市",
    "parentId": 5,
    "districtList": [{
      "id": 291,
      "name": "冀州市",
      "parentId": 275,
      "districtList": [] },

    {
      "id": 292,
      "name": "深州市",
      "parentId": 275,
      "districtList": [] },

    {
      "id": 293,
      "name": "饶阳县",
      "parentId": 275,
      "districtList": [] },

    {
      "id": 294,
      "name": "枣强县",
      "parentId": 275,
      "districtList": [] },

    {
      "id": 295,
      "name": "故城县",
      "parentId": 275,
      "districtList": [] },

    {
      "id": 296,
      "name": "阜城县",
      "parentId": 275,
      "districtList": [] },

    {
      "id": 297,
      "name": "安平县",
      "parentId": 275,
      "districtList": [] },

    {
      "id": 298,
      "name": "武邑县",
      "parentId": 275,
      "districtList": [] },

    {
      "id": 299,
      "name": "景县",
      "parentId": 275,
      "districtList": [] },

    {
      "id": 300,
      "name": "武强县",
      "parentId": 275,
      "districtList": [] },

    {
      "id": 41510,
      "name": "桃城区",
      "parentId": 275,
      "districtList": [] }] }] },





{
  "id": 6,
  "name": "山西",
  "parentId": 0,
  "districtList": [{
    "id": 303,
    "name": "太原市",
    "parentId": 6,
    "districtList": [{
      "id": 304,
      "name": "阳曲县",
      "parentId": 303,
      "districtList": [] },

    {
      "id": 305,
      "name": "古交市",
      "parentId": 303,
      "districtList": [] },

    {
      "id": 306,
      "name": "娄烦县",
      "parentId": 303,
      "districtList": [] },

    {
      "id": 307,
      "name": "清徐县",
      "parentId": 303,
      "districtList": [] },

    {
      "id": 36780,
      "name": "小店区",
      "parentId": 303,
      "districtList": [] },

    {
      "id": 36781,
      "name": "迎泽区",
      "parentId": 303,
      "districtList": [] },

    {
      "id": 36782,
      "name": "晋源区",
      "parentId": 303,
      "districtList": [] },

    {
      "id": 36783,
      "name": "万柏林区",
      "parentId": 303,
      "districtList": [] },

    {
      "id": 36784,
      "name": "尖草坪区",
      "parentId": 303,
      "districtList": [] },

    {
      "id": 36785,
      "name": "杏花岭区",
      "parentId": 303,
      "districtList": [] }] },



  {
    "id": 309,
    "name": "大同市",
    "parentId": 6,
    "districtList": [{
      "id": 310,
      "name": "大同县",
      "parentId": 309,
      "districtList": [] },

    {
      "id": 311,
      "name": "天镇县",
      "parentId": 309,
      "districtList": [] },

    {
      "id": 312,
      "name": "灵丘县",
      "parentId": 309,
      "districtList": [] },

    {
      "id": 313,
      "name": "阳高县",
      "parentId": 309,
      "districtList": [] },

    {
      "id": 314,
      "name": "左云县",
      "parentId": 309,
      "districtList": [] },

    {
      "id": 315,
      "name": "浑源县",
      "parentId": 309,
      "districtList": [] },

    {
      "id": 316,
      "name": "广灵县",
      "parentId": 309,
      "districtList": [] },

    {
      "id": 3214,
      "name": "新荣区",
      "parentId": 309,
      "districtList": [] },

    {
      "id": 3216,
      "name": "南郊区",
      "parentId": 309,
      "districtList": [] },

    {
      "id": 3217,
      "name": "矿区",
      "parentId": 309,
      "districtList": [] },

    {
      "id": 32061,
      "name": "城区",
      "parentId": 309,
      "districtList": [] }] },



  {
    "id": 318,
    "name": "阳泉市",
    "parentId": 6,
    "districtList": [{
      "id": 319,
      "name": "盂县",
      "parentId": 318,
      "districtList": [] },

    {
      "id": 320,
      "name": "平定县",
      "parentId": 318,
      "districtList": [] },

    {
      "id": 321,
      "name": "郊区",
      "parentId": 318,
      "districtList": [] },

    {
      "id": 3219,
      "name": "矿区",
      "parentId": 318,
      "districtList": [] },

    {
      "id": 44144,
      "name": "城区",
      "parentId": 318,
      "districtList": [] }] },



  {
    "id": 325,
    "name": "晋城市",
    "parentId": 6,
    "districtList": [{
      "id": 326,
      "name": "高平市",
      "parentId": 325,
      "districtList": [] },

    {
      "id": 327,
      "name": "阳城县",
      "parentId": 325,
      "districtList": [] },

    {
      "id": 328,
      "name": "沁水县",
      "parentId": 325,
      "districtList": [] },

    {
      "id": 329,
      "name": "陵川县",
      "parentId": 325,
      "districtList": [] },

    {
      "id": 2967,
      "name": "泽州县",
      "parentId": 325,
      "districtList": [] },

    {
      "id": 3073,
      "name": "城区",
      "parentId": 325,
      "districtList": [] }] },



  {
    "id": 330,
    "name": "朔州市",
    "parentId": 6,
    "districtList": [{
      "id": 331,
      "name": "山阴县",
      "parentId": 330,
      "districtList": [] },

    {
      "id": 332,
      "name": "右玉县",
      "parentId": 330,
      "districtList": [] },

    {
      "id": 333,
      "name": "应县",
      "parentId": 330,
      "districtList": [] },

    {
      "id": 334,
      "name": "怀仁县",
      "parentId": 330,
      "districtList": [] },

    {
      "id": 335,
      "name": "朔城区",
      "parentId": 330,
      "districtList": [] },

    {
      "id": 3118,
      "name": "平鲁区",
      "parentId": 330,
      "districtList": [] }] },



  {
    "id": 336,
    "name": "晋中市",
    "parentId": 6,
    "districtList": [{
      "id": 338,
      "name": "介休市",
      "parentId": 336,
      "districtList": [] },

    {
      "id": 339,
      "name": "昔阳县",
      "parentId": 336,
      "districtList": [] },

    {
      "id": 341,
      "name": "祁县",
      "parentId": 336,
      "districtList": [] },

    {
      "id": 342,
      "name": "左权县",
      "parentId": 336,
      "districtList": [] },

    {
      "id": 343,
      "name": "寿阳县",
      "parentId": 336,
      "districtList": [] },

    {
      "id": 344,
      "name": "太谷县",
      "parentId": 336,
      "districtList": [] },

    {
      "id": 345,
      "name": "和顺县",
      "parentId": 336,
      "districtList": [] },

    {
      "id": 346,
      "name": "灵石县",
      "parentId": 336,
      "districtList": [] },

    {
      "id": 347,
      "name": "平遥县",
      "parentId": 336,
      "districtList": [] },

    {
      "id": 348,
      "name": "榆社县",
      "parentId": 336,
      "districtList": [] },

    {
      "id": 44145,
      "name": "榆次区",
      "parentId": 336,
      "districtList": [] }] },



  {
    "id": 350,
    "name": "忻州市",
    "parentId": 6,
    "districtList": [{
      "id": 351,
      "name": "原平市",
      "parentId": 350,
      "districtList": [] },

    {
      "id": 352,
      "name": "代县",
      "parentId": 350,
      "districtList": [] },

    {
      "id": 353,
      "name": "神池县",
      "parentId": 350,
      "districtList": [] },

    {
      "id": 354,
      "name": "五寨县",
      "parentId": 350,
      "districtList": [] },

    {
      "id": 358,
      "name": "五台县",
      "parentId": 350,
      "districtList": [] },

    {
      "id": 359,
      "name": "偏关县",
      "parentId": 350,
      "districtList": [] },

    {
      "id": 360,
      "name": "宁武县",
      "parentId": 350,
      "districtList": [] },

    {
      "id": 361,
      "name": "静乐县",
      "parentId": 350,
      "districtList": [] },

    {
      "id": 362,
      "name": "繁峙县",
      "parentId": 350,
      "districtList": [] },

    {
      "id": 363,
      "name": "河曲县",
      "parentId": 350,
      "districtList": [] },

    {
      "id": 364,
      "name": "保德县",
      "parentId": 350,
      "districtList": [] },

    {
      "id": 365,
      "name": "定襄县",
      "parentId": 350,
      "districtList": [] },

    {
      "id": 366,
      "name": "忻府区",
      "parentId": 350,
      "districtList": [] },

    {
      "id": 367,
      "name": "岢岚县",
      "parentId": 350,
      "districtList": [] }] },



  {
    "id": 368,
    "name": "吕梁市",
    "parentId": 6,
    "districtList": [{
      "id": 369,
      "name": "离石区",
      "parentId": 368,
      "districtList": [] },

    {
      "id": 370,
      "name": "孝义市",
      "parentId": 368,
      "districtList": [] },

    {
      "id": 371,
      "name": "汾阳市",
      "parentId": 368,
      "districtList": [] },

    {
      "id": 372,
      "name": "文水县",
      "parentId": 368,
      "districtList": [] },

    {
      "id": 373,
      "name": "中阳县",
      "parentId": 368,
      "districtList": [] },

    {
      "id": 374,
      "name": "兴县",
      "parentId": 368,
      "districtList": [] },

    {
      "id": 375,
      "name": "临县",
      "parentId": 368,
      "districtList": [] },

    {
      "id": 376,
      "name": "方山县",
      "parentId": 368,
      "districtList": [] },

    {
      "id": 377,
      "name": "柳林县",
      "parentId": 368,
      "districtList": [] },

    {
      "id": 378,
      "name": "岚县",
      "parentId": 368,
      "districtList": [] },

    {
      "id": 3235,
      "name": "交口县",
      "parentId": 368,
      "districtList": [] },

    {
      "id": 3236,
      "name": "交城县",
      "parentId": 368,
      "districtList": [] },

    {
      "id": 3237,
      "name": "石楼县",
      "parentId": 368,
      "districtList": [] }] },



  {
    "id": 379,
    "name": "临汾市",
    "parentId": 6,
    "districtList": [{
      "id": 380,
      "name": "侯马市",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 381,
      "name": "霍州市",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 382,
      "name": "汾西县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 383,
      "name": "吉县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 384,
      "name": "安泽县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 386,
      "name": "浮山县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 387,
      "name": "大宁县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 388,
      "name": "古县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 389,
      "name": "隰县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 390,
      "name": "襄汾县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 391,
      "name": "翼城县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 392,
      "name": "永和县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 393,
      "name": "乡宁县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 395,
      "name": "洪洞县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 396,
      "name": "蒲县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 3136,
      "name": "曲沃县",
      "parentId": 379,
      "districtList": [] },

    {
      "id": 32206,
      "name": "尧都区",
      "parentId": 379,
      "districtList": [] }] },



  {
    "id": 398,
    "name": "运城市",
    "parentId": 6,
    "districtList": [{
      "id": 399,
      "name": "河津市",
      "parentId": 398,
      "districtList": [] },

    {
      "id": 400,
      "name": "永济市",
      "parentId": 398,
      "districtList": [] },

    {
      "id": 402,
      "name": "新绛县",
      "parentId": 398,
      "districtList": [] },

    {
      "id": 403,
      "name": "平陆县",
      "parentId": 398,
      "districtList": [] },

    {
      "id": 404,
      "name": "垣曲县",
      "parentId": 398,
      "districtList": [] },

    {
      "id": 405,
      "name": "绛县",
      "parentId": 398,
      "districtList": [] },

    {
      "id": 406,
      "name": "稷山县",
      "parentId": 398,
      "districtList": [] },

    {
      "id": 407,
      "name": "芮城县",
      "parentId": 398,
      "districtList": [] },

    {
      "id": 408,
      "name": "夏县",
      "parentId": 398,
      "districtList": [] },

    {
      "id": 409,
      "name": "临猗县",
      "parentId": 398,
      "districtList": [] },

    {
      "id": 410,
      "name": "万荣县",
      "parentId": 398,
      "districtList": [] },

    {
      "id": 3233,
      "name": "闻喜县",
      "parentId": 398,
      "districtList": [] },

    {
      "id": 32360,
      "name": "盐湖区",
      "parentId": 398,
      "districtList": [] }] },



  {
    "id": 3074,
    "name": "长治市",
    "parentId": 6,
    "districtList": [{
      "id": 3075,
      "name": "长治县",
      "parentId": 3074,
      "districtList": [] },

    {
      "id": 3109,
      "name": "潞城市",
      "parentId": 3074,
      "districtList": [] },

    {
      "id": 3222,
      "name": "郊区",
      "parentId": 3074,
      "districtList": [] },

    {
      "id": 3223,
      "name": "襄垣县",
      "parentId": 3074,
      "districtList": [] },

    {
      "id": 3224,
      "name": "屯留县",
      "parentId": 3074,
      "districtList": [] },

    {
      "id": 3225,
      "name": "平顺县",
      "parentId": 3074,
      "districtList": [] },

    {
      "id": 3226,
      "name": "黎城县",
      "parentId": 3074,
      "districtList": [] },

    {
      "id": 3227,
      "name": "壶关县",
      "parentId": 3074,
      "districtList": [] },

    {
      "id": 3228,
      "name": "长子县",
      "parentId": 3074,
      "districtList": [] },

    {
      "id": 3229,
      "name": "武乡县",
      "parentId": 3074,
      "districtList": [] },

    {
      "id": 3230,
      "name": "沁县",
      "parentId": 3074,
      "districtList": [] },

    {
      "id": 3231,
      "name": "沁源县",
      "parentId": 3074,
      "districtList": [] },

    {
      "id": 32505,
      "name": "城区",
      "parentId": 3074,
      "districtList": [] }] }] },





{
  "id": 7,
  "name": "河南",
  "parentId": 0,
  "districtList": [{
    "id": 412,
    "name": "郑州市",
    "parentId": 7,
    "districtList": [{
      "id": 415,
      "name": "新密市",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 416,
      "name": "登封市",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 2782,
      "name": "上街区",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 3544,
      "name": "惠济区",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 3545,
      "name": "金水区",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 3546,
      "name": "管城区",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 3547,
      "name": "二七区",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 3548,
      "name": "中原区",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 4337,
      "name": "郑东新区",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 46820,
      "name": "新郑市",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 46821,
      "name": "巩义市",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 46822,
      "name": "荥阳市",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 46823,
      "name": "中牟县",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 47300,
      "name": "经济开发区",
      "parentId": 412,
      "districtList": [] },

    {
      "id": 47301,
      "name": "高新技术开发区",
      "parentId": 412,
      "districtList": [] }] },



  {
    "id": 420,
    "name": "开封市",
    "parentId": 7,
    "districtList": [{
      "id": 421,
      "name": "开封县",
      "parentId": 420,
      "districtList": [] },

    {
      "id": 422,
      "name": "杞县",
      "parentId": 420,
      "districtList": [] },

    {
      "id": 423,
      "name": "兰考县",
      "parentId": 420,
      "districtList": [] },

    {
      "id": 425,
      "name": "尉氏县",
      "parentId": 420,
      "districtList": [] },

    {
      "id": 3127,
      "name": "通许县",
      "parentId": 420,
      "districtList": [] },

    {
      "id": 45533,
      "name": "金明区",
      "parentId": 420,
      "districtList": [] },

    {
      "id": 45534,
      "name": "龙亭区",
      "parentId": 420,
      "districtList": [] },

    {
      "id": 45535,
      "name": "顺河区",
      "parentId": 420,
      "districtList": [] },

    {
      "id": 45536,
      "name": "鼓楼区",
      "parentId": 420,
      "districtList": [] },

    {
      "id": 45537,
      "name": "禹王台区",
      "parentId": 420,
      "districtList": [] }] },



  {
    "id": 427,
    "name": "洛阳市",
    "parentId": 7,
    "districtList": [{
      "id": 428,
      "name": "偃师市",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 429,
      "name": "孟津县",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 430,
      "name": "汝阳县",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 431,
      "name": "伊川县",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 432,
      "name": "洛宁县",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 434,
      "name": "宜阳县",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 435,
      "name": "栾川县",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 436,
      "name": "新安县",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 3555,
      "name": "吉利区",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 3556,
      "name": "涧西区",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 3557,
      "name": "瀍河区",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 3558,
      "name": "老城区",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 3559,
      "name": "西工区",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 4150,
      "name": "嵩县",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 45531,
      "name": "伊滨区",
      "parentId": 427,
      "districtList": [] },

    {
      "id": 45532,
      "name": "洛龙区",
      "parentId": 427,
      "districtList": [] }] },



  {
    "id": 438,
    "name": "平顶山市",
    "parentId": 7,
    "districtList": [{
      "id": 439,
      "name": "汝州市",
      "parentId": 438,
      "districtList": [] },

    {
      "id": 440,
      "name": "舞钢市",
      "parentId": 438,
      "districtList": [] },

    {
      "id": 441,
      "name": "郏县",
      "parentId": 438,
      "districtList": [] },

    {
      "id": 442,
      "name": "叶县",
      "parentId": 438,
      "districtList": [] },

    {
      "id": 443,
      "name": "鲁山县",
      "parentId": 438,
      "districtList": [] },

    {
      "id": 444,
      "name": "宝丰县",
      "parentId": 438,
      "districtList": [] },

    {
      "id": 3560,
      "name": "石龙区",
      "parentId": 438,
      "districtList": [] },

    {
      "id": 35965,
      "name": "湛河区",
      "parentId": 438,
      "districtList": [] },

    {
      "id": 35966,
      "name": "卫东区",
      "parentId": 438,
      "districtList": [] },

    {
      "id": 35967,
      "name": "新华区",
      "parentId": 438,
      "districtList": [] }] },



  {
    "id": 446,
    "name": "焦作市",
    "parentId": 7,
    "districtList": [{
      "id": 447,
      "name": "沁阳市",
      "parentId": 446,
      "districtList": [] },

    {
      "id": 448,
      "name": "孟州市",
      "parentId": 446,
      "districtList": [] },

    {
      "id": 449,
      "name": "修武县",
      "parentId": 446,
      "districtList": [] },

    {
      "id": 450,
      "name": "温县",
      "parentId": 446,
      "districtList": [] },

    {
      "id": 451,
      "name": "武陟县",
      "parentId": 446,
      "districtList": [] },

    {
      "id": 452,
      "name": "博爱县",
      "parentId": 446,
      "districtList": [] },

    {
      "id": 453,
      "name": "山阳区",
      "parentId": 446,
      "districtList": [] },

    {
      "id": 3566,
      "name": "解放区",
      "parentId": 446,
      "districtList": [] },

    {
      "id": 37371,
      "name": "马村区",
      "parentId": 446,
      "districtList": [] },

    {
      "id": 37372,
      "name": "中站区",
      "parentId": 446,
      "districtList": [] }] },



  {
    "id": 454,
    "name": "鹤壁市",
    "parentId": 7,
    "districtList": [{
      "id": 455,
      "name": "浚县",
      "parentId": 454,
      "districtList": [] },

    {
      "id": 456,
      "name": "淇县",
      "parentId": 454,
      "districtList": [] },

    {
      "id": 457,
      "name": "鹤山区",
      "parentId": 454,
      "districtList": [] },

    {
      "id": 3567,
      "name": "山城区",
      "parentId": 454,
      "districtList": [] },

    {
      "id": 35591,
      "name": "淇滨区",
      "parentId": 454,
      "districtList": [] }] },



  {
    "id": 458,
    "name": "新乡市",
    "parentId": 7,
    "districtList": [{
      "id": 459,
      "name": "卫辉市",
      "parentId": 458,
      "districtList": [] },

    {
      "id": 460,
      "name": "辉县市",
      "parentId": 458,
      "districtList": [] },

    {
      "id": 461,
      "name": "新乡县",
      "parentId": 458,
      "districtList": [] },

    {
      "id": 462,
      "name": "获嘉县",
      "parentId": 458,
      "districtList": [] },

    {
      "id": 463,
      "name": "原阳县",
      "parentId": 458,
      "districtList": [] },

    {
      "id": 464,
      "name": "长垣县",
      "parentId": 458,
      "districtList": [] },

    {
      "id": 465,
      "name": "延津县",
      "parentId": 458,
      "districtList": [] },

    {
      "id": 466,
      "name": "封丘县",
      "parentId": 458,
      "districtList": [] },

    {
      "id": 3570,
      "name": "凤泉区",
      "parentId": 458,
      "districtList": [] },

    {
      "id": 37456,
      "name": "牧野区",
      "parentId": 458,
      "districtList": [] },

    {
      "id": 37457,
      "name": "红旗区",
      "parentId": 458,
      "districtList": [] },

    {
      "id": 37458,
      "name": "卫滨区",
      "parentId": 458,
      "districtList": [] }] },



  {
    "id": 468,
    "name": "安阳市",
    "parentId": 7,
    "districtList": [{
      "id": 469,
      "name": "林州市",
      "parentId": 468,
      "districtList": [] },

    {
      "id": 470,
      "name": "安阳县",
      "parentId": 468,
      "districtList": [] },

    {
      "id": 471,
      "name": "滑县",
      "parentId": 468,
      "districtList": [] },

    {
      "id": 472,
      "name": "汤阴县",
      "parentId": 468,
      "districtList": [] },

    {
      "id": 473,
      "name": "内黄县",
      "parentId": 468,
      "districtList": [] },

    {
      "id": 35470,
      "name": "龙安区",
      "parentId": 468,
      "districtList": [] },

    {
      "id": 35471,
      "name": "殷都区",
      "parentId": 468,
      "districtList": [] },

    {
      "id": 35472,
      "name": "文峰区",
      "parentId": 468,
      "districtList": [] },

    {
      "id": 35473,
      "name": "开发区",
      "parentId": 468,
      "districtList": [] },

    {
      "id": 35474,
      "name": "北关区",
      "parentId": 468,
      "districtList": [] }] },



  {
    "id": 475,
    "name": "濮阳市",
    "parentId": 7,
    "districtList": [{
      "id": 476,
      "name": "濮阳县",
      "parentId": 475,
      "districtList": [] },

    {
      "id": 477,
      "name": "南乐县",
      "parentId": 475,
      "districtList": [] },

    {
      "id": 478,
      "name": "台前县",
      "parentId": 475,
      "districtList": [] },

    {
      "id": 479,
      "name": "清丰县",
      "parentId": 475,
      "districtList": [] },

    {
      "id": 480,
      "name": "范县",
      "parentId": 475,
      "districtList": [] },

    {
      "id": 481,
      "name": "华龙区",
      "parentId": 475,
      "districtList": [] }] },



  {
    "id": 482,
    "name": "许昌市",
    "parentId": 7,
    "districtList": [{
      "id": 483,
      "name": "禹州市",
      "parentId": 482,
      "districtList": [] },

    {
      "id": 484,
      "name": "长葛市",
      "parentId": 482,
      "districtList": [] },

    {
      "id": 485,
      "name": "建安区",
      "parentId": 482,
      "districtList": [] },

    {
      "id": 486,
      "name": "鄢陵县",
      "parentId": 482,
      "districtList": [] },

    {
      "id": 487,
      "name": "襄城县",
      "parentId": 482,
      "districtList": [] },

    {
      "id": 488,
      "name": "魏都区",
      "parentId": 482,
      "districtList": [] }] },



  {
    "id": 489,
    "name": "漯河市",
    "parentId": 7,
    "districtList": [{
      "id": 490,
      "name": "郾城区",
      "parentId": 489,
      "districtList": [] },

    {
      "id": 492,
      "name": "临颍县",
      "parentId": 489,
      "districtList": [] },

    {
      "id": 493,
      "name": "召陵区",
      "parentId": 489,
      "districtList": [] },

    {
      "id": 494,
      "name": "舞阳县",
      "parentId": 489,
      "districtList": [] },

    {
      "id": 3576,
      "name": "源汇区",
      "parentId": 489,
      "districtList": [] }] },



  {
    "id": 495,
    "name": "三门峡市",
    "parentId": 7,
    "districtList": [{
      "id": 496,
      "name": "义马市",
      "parentId": 495,
      "districtList": [] },

    {
      "id": 497,
      "name": "灵宝市",
      "parentId": 495,
      "districtList": [] },

    {
      "id": 498,
      "name": "陕县",
      "parentId": 495,
      "districtList": [] },

    {
      "id": 499,
      "name": "卢氏县",
      "parentId": 495,
      "districtList": [] },

    {
      "id": 3113,
      "name": "渑池县",
      "parentId": 495,
      "districtList": [] },

    {
      "id": 35637,
      "name": "湖滨区",
      "parentId": 495,
      "districtList": [] }] },



  {
    "id": 502,
    "name": "南阳市",
    "parentId": 7,
    "districtList": [{
      "id": 503,
      "name": "邓州市",
      "parentId": 502,
      "districtList": [] },

    {
      "id": 504,
      "name": "桐柏县",
      "parentId": 502,
      "districtList": [] },

    {
      "id": 505,
      "name": "方城县",
      "parentId": 502,
      "districtList": [] },

    {
      "id": 506,
      "name": "淅川县",
      "parentId": 502,
      "districtList": [] },

    {
      "id": 507,
      "name": "镇平县",
      "parentId": 502,
      "districtList": [] },

    {
      "id": 508,
      "name": "唐河县",
      "parentId": 502,
      "districtList": [] },

    {
      "id": 509,
      "name": "南召县",
      "parentId": 502,
      "districtList": [] },

    {
      "id": 510,
      "name": "内乡县",
      "parentId": 502,
      "districtList": [] },

    {
      "id": 511,
      "name": "新野县",
      "parentId": 502,
      "districtList": [] },

    {
      "id": 512,
      "name": "社旗县",
      "parentId": 502,
      "districtList": [] },

    {
      "id": 515,
      "name": "西峡县",
      "parentId": 502,
      "districtList": [] },

    {
      "id": 35751,
      "name": "卧龙区",
      "parentId": 502,
      "districtList": [] },

    {
      "id": 35752,
      "name": "宛城区",
      "parentId": 502,
      "districtList": [] }] },



  {
    "id": 517,
    "name": "商丘市",
    "parentId": 7,
    "districtList": [{
      "id": 518,
      "name": "永城市",
      "parentId": 517,
      "districtList": [] },

    {
      "id": 519,
      "name": "宁陵县",
      "parentId": 517,
      "districtList": [] },

    {
      "id": 520,
      "name": "虞城县",
      "parentId": 517,
      "districtList": [] },

    {
      "id": 521,
      "name": "民权县",
      "parentId": 517,
      "districtList": [] },

    {
      "id": 522,
      "name": "夏邑县",
      "parentId": 517,
      "districtList": [] },

    {
      "id": 523,
      "name": "柘城县",
      "parentId": 517,
      "districtList": [] },

    {
      "id": 524,
      "name": "睢县",
      "parentId": 517,
      "districtList": [] },

    {
      "id": 34751,
      "name": "睢阳区",
      "parentId": 517,
      "districtList": [] },

    {
      "id": 34752,
      "name": "梁园区",
      "parentId": 517,
      "districtList": [] }] },



  {
    "id": 527,
    "name": "周口市",
    "parentId": 7,
    "districtList": [{
      "id": 529,
      "name": "项城市",
      "parentId": 527,
      "districtList": [] },

    {
      "id": 530,
      "name": "商水县",
      "parentId": 527,
      "districtList": [] },

    {
      "id": 531,
      "name": "淮阳县",
      "parentId": 527,
      "districtList": [] },

    {
      "id": 532,
      "name": "太康县",
      "parentId": 527,
      "districtList": [] },

    {
      "id": 533,
      "name": "鹿邑县",
      "parentId": 527,
      "districtList": [] },

    {
      "id": 534,
      "name": "西华县",
      "parentId": 527,
      "districtList": [] },

    {
      "id": 535,
      "name": "扶沟县",
      "parentId": 527,
      "districtList": [] },

    {
      "id": 536,
      "name": "沈丘县",
      "parentId": 527,
      "districtList": [] },

    {
      "id": 537,
      "name": "郸城县",
      "parentId": 527,
      "districtList": [] },

    {
      "id": 34926,
      "name": "东新区",
      "parentId": 527,
      "districtList": [] },

    {
      "id": 34927,
      "name": "经济开发区",
      "parentId": 527,
      "districtList": [] },

    {
      "id": 35108,
      "name": "川汇区",
      "parentId": 527,
      "districtList": [] }] },



  {
    "id": 538,
    "name": "驻马店市",
    "parentId": 7,
    "districtList": [{
      "id": 540,
      "name": "确山县",
      "parentId": 538,
      "districtList": [] },

    {
      "id": 541,
      "name": "新蔡县",
      "parentId": 538,
      "districtList": [] },

    {
      "id": 542,
      "name": "上蔡县",
      "parentId": 538,
      "districtList": [] },

    {
      "id": 543,
      "name": "泌阳县",
      "parentId": 538,
      "districtList": [] },

    {
      "id": 544,
      "name": "西平县",
      "parentId": 538,
      "districtList": [] },

    {
      "id": 545,
      "name": "遂平县",
      "parentId": 538,
      "districtList": [] },

    {
      "id": 546,
      "name": "汝南县",
      "parentId": 538,
      "districtList": [] },

    {
      "id": 547,
      "name": "平舆县",
      "parentId": 538,
      "districtList": [] },

    {
      "id": 548,
      "name": "正阳县",
      "parentId": 538,
      "districtList": [] },

    {
      "id": 35189,
      "name": "驿城区",
      "parentId": 538,
      "districtList": [] }] },



  {
    "id": 549,
    "name": "信阳市",
    "parentId": 7,
    "districtList": [{
      "id": 551,
      "name": "潢川县",
      "parentId": 549,
      "districtList": [] },

    {
      "id": 552,
      "name": "淮滨县",
      "parentId": 549,
      "districtList": [] },

    {
      "id": 553,
      "name": "息县",
      "parentId": 549,
      "districtList": [] },

    {
      "id": 554,
      "name": "新县",
      "parentId": 549,
      "districtList": [] },

    {
      "id": 556,
      "name": "固始县",
      "parentId": 549,
      "districtList": [] },

    {
      "id": 557,
      "name": "罗山县",
      "parentId": 549,
      "districtList": [] },

    {
      "id": 558,
      "name": "光山县",
      "parentId": 549,
      "districtList": [] },

    {
      "id": 3119,
      "name": "商城县",
      "parentId": 549,
      "districtList": [] },

    {
      "id": 34548,
      "name": "平桥区",
      "parentId": 549,
      "districtList": [] },

    {
      "id": 34549,
      "name": "浉河区",
      "parentId": 549,
      "districtList": [] }] },



  {
    "id": 2780,
    "name": "济源市",
    "parentId": 7,
    "districtList": [{
      "id": 35178,
      "name": "五龙口镇",
      "parentId": 2780,
      "districtList": [] },

    {
      "id": 35179,
      "name": "下冶镇",
      "parentId": 2780,
      "districtList": [] },

    {
      "id": 35180,
      "name": "轵城镇",
      "parentId": 2780,
      "districtList": [] },

    {
      "id": 35181,
      "name": "王屋镇",
      "parentId": 2780,
      "districtList": [] },

    {
      "id": 35182,
      "name": "思礼镇",
      "parentId": 2780,
      "districtList": [] },

    {
      "id": 35183,
      "name": "邵原镇",
      "parentId": 2780,
      "districtList": [] },

    {
      "id": 35184,
      "name": "坡头镇",
      "parentId": 2780,
      "districtList": [] },

    {
      "id": 35185,
      "name": "梨林镇",
      "parentId": 2780,
      "districtList": [] },

    {
      "id": 35186,
      "name": "克井镇",
      "parentId": 2780,
      "districtList": [] },

    {
      "id": 35187,
      "name": "大峪镇",
      "parentId": 2780,
      "districtList": [] },

    {
      "id": 35188,
      "name": "承留镇",
      "parentId": 2780,
      "districtList": [] },

    {
      "id": 52305,
      "name": "城区",
      "parentId": 2780,
      "districtList": [] }] }] },





{
  "id": 8,
  "name": "辽宁",
  "parentId": 0,
  "districtList": [{
    "id": 560,
    "name": "沈阳市",
    "parentId": 8,
    "districtList": [{
      "id": 567,
      "name": "苏家屯区",
      "parentId": 560,
      "districtList": [] },

    {
      "id": 569,
      "name": "新民市",
      "parentId": 560,
      "districtList": [] },

    {
      "id": 570,
      "name": "法库县",
      "parentId": 560,
      "districtList": [] },

    {
      "id": 571,
      "name": "辽中县",
      "parentId": 560,
      "districtList": [] },

    {
      "id": 572,
      "name": "康平县",
      "parentId": 560,
      "districtList": [] },

    {
      "id": 50819,
      "name": "皇姑区",
      "parentId": 560,
      "districtList": [] },

    {
      "id": 50820,
      "name": "铁西区",
      "parentId": 560,
      "districtList": [] },

    {
      "id": 50821,
      "name": "大东区",
      "parentId": 560,
      "districtList": [] },

    {
      "id": 50822,
      "name": "沈河区",
      "parentId": 560,
      "districtList": [] },

    {
      "id": 50823,
      "name": "东陵区",
      "parentId": 560,
      "districtList": [] },

    {
      "id": 50824,
      "name": "于洪区",
      "parentId": 560,
      "districtList": [] },

    {
      "id": 50825,
      "name": "和平区",
      "parentId": 560,
      "districtList": [] },

    {
      "id": 50826,
      "name": "浑南新区",
      "parentId": 560,
      "districtList": [] },

    {
      "id": 50827,
      "name": "沈北新区",
      "parentId": 560,
      "districtList": [] }] },



  {
    "id": 573,
    "name": "大连市",
    "parentId": 8,
    "districtList": [{
      "id": 574,
      "name": "普兰店市",
      "parentId": 573,
      "districtList": [] },

    {
      "id": 575,
      "name": "瓦房店市",
      "parentId": 573,
      "districtList": [] },

    {
      "id": 576,
      "name": "庄河市",
      "parentId": 573,
      "districtList": [] },

    {
      "id": 577,
      "name": "长海县",
      "parentId": 573,
      "districtList": [] },

    {
      "id": 3261,
      "name": "沙河口区",
      "parentId": 573,
      "districtList": [] },

    {
      "id": 3263,
      "name": "西岗区",
      "parentId": 573,
      "districtList": [] },

    {
      "id": 4468,
      "name": "中山区",
      "parentId": 573,
      "districtList": [] },

    {
      "id": 5909,
      "name": "甘井子区",
      "parentId": 573,
      "districtList": [] },

    {
      "id": 6561,
      "name": "高新园区",
      "parentId": 573,
      "districtList": [] },

    {
      "id": 6627,
      "name": "大连开发区",
      "parentId": 573,
      "districtList": [] },

    {
      "id": 46824,
      "name": "金州区",
      "parentId": 573,
      "districtList": [] },

    {
      "id": 46825,
      "name": "旅顺口区",
      "parentId": 573,
      "districtList": [] }] },



  {
    "id": 579,
    "name": "鞍山市",
    "parentId": 8,
    "districtList": [{
      "id": 580,
      "name": "台安县",
      "parentId": 579,
      "districtList": [] },

    {
      "id": 581,
      "name": "海城市",
      "parentId": 579,
      "districtList": [] },

    {
      "id": 583,
      "name": "岫岩县",
      "parentId": 579,
      "districtList": [] },

    {
      "id": 3264,
      "name": "铁东区",
      "parentId": 579,
      "districtList": [] },

    {
      "id": 3266,
      "name": "立山区",
      "parentId": 579,
      "districtList": [] },

    {
      "id": 37581,
      "name": "铁西区",
      "parentId": 579,
      "districtList": [] },

    {
      "id": 37582,
      "name": "千山区",
      "parentId": 579,
      "districtList": [] }] },



  {
    "id": 584,
    "name": "抚顺市",
    "parentId": 8,
    "districtList": [{
      "id": 585,
      "name": "抚顺县",
      "parentId": 584,
      "districtList": [] },

    {
      "id": 586,
      "name": "新宾县",
      "parentId": 584,
      "districtList": [] },

    {
      "id": 587,
      "name": "清原县",
      "parentId": 584,
      "districtList": [] },

    {
      "id": 3268,
      "name": "望花区",
      "parentId": 584,
      "districtList": [] },

    {
      "id": 3269,
      "name": "东洲区",
      "parentId": 584,
      "districtList": [] },

    {
      "id": 3270,
      "name": "新抚区",
      "parentId": 584,
      "districtList": [] },

    {
      "id": 3271,
      "name": "顺城区",
      "parentId": 584,
      "districtList": [] }] },



  {
    "id": 589,
    "name": "本溪市",
    "parentId": 8,
    "districtList": [{
      "id": 591,
      "name": "桓仁县",
      "parentId": 589,
      "districtList": [] },

    {
      "id": 3275,
      "name": "南芬区",
      "parentId": 589,
      "districtList": [] },

    {
      "id": 41341,
      "name": "本溪县",
      "parentId": 589,
      "districtList": [] },

    {
      "id": 41342,
      "name": "平山区",
      "parentId": 589,
      "districtList": [] },

    {
      "id": 41343,
      "name": "溪湖区",
      "parentId": 589,
      "districtList": [] },

    {
      "id": 41344,
      "name": "明山区",
      "parentId": 589,
      "districtList": [] }] },



  {
    "id": 593,
    "name": "丹东市",
    "parentId": 8,
    "districtList": [{
      "id": 596,
      "name": "宽甸县",
      "parentId": 593,
      "districtList": [] },

    {
      "id": 20171,
      "name": "元宝区",
      "parentId": 593,
      "districtList": [] },

    {
      "id": 20172,
      "name": "振兴区",
      "parentId": 593,
      "districtList": [] },

    {
      "id": 20173,
      "name": "振安区",
      "parentId": 593,
      "districtList": [] },

    {
      "id": 20174,
      "name": "东港市",
      "parentId": 593,
      "districtList": [] },

    {
      "id": 20175,
      "name": "凤城市",
      "parentId": 593,
      "districtList": [] }] },



  {
    "id": 598,
    "name": "锦州市",
    "parentId": 8,
    "districtList": [{
      "id": 599,
      "name": "义县",
      "parentId": 598,
      "districtList": [] },

    {
      "id": 600,
      "name": "凌海市",
      "parentId": 598,
      "districtList": [] },

    {
      "id": 601,
      "name": "北镇市",
      "parentId": 598,
      "districtList": [] },

    {
      "id": 602,
      "name": "黑山县",
      "parentId": 598,
      "districtList": [] },

    {
      "id": 4912,
      "name": "古塔区",
      "parentId": 598,
      "districtList": [] },

    {
      "id": 4913,
      "name": "凌河区",
      "parentId": 598,
      "districtList": [] },

    {
      "id": 4914,
      "name": "太和区",
      "parentId": 598,
      "districtList": [] },

    {
      "id": 6790,
      "name": "经济技术开发区",
      "parentId": 598,
      "districtList": [] }] },



  {
    "id": 604,
    "name": "葫芦岛市",
    "parentId": 8,
    "districtList": [{
      "id": 606,
      "name": "绥中县",
      "parentId": 604,
      "districtList": [] },

    {
      "id": 607,
      "name": "建昌县",
      "parentId": 604,
      "districtList": [] },

    {
      "id": 608,
      "name": "南票区",
      "parentId": 604,
      "districtList": [] },

    {
      "id": 3300,
      "name": "龙港区",
      "parentId": 604,
      "districtList": [] },

    {
      "id": 20524,
      "name": "连山区",
      "parentId": 604,
      "districtList": [] },

    {
      "id": 20525,
      "name": "兴城市",
      "parentId": 604,
      "districtList": [] }] },



  {
    "id": 609,
    "name": "营口市",
    "parentId": 8,
    "districtList": [{
      "id": 610,
      "name": "大石桥市",
      "parentId": 609,
      "districtList": [] },

    {
      "id": 611,
      "name": "盖州市",
      "parentId": 609,
      "districtList": [] },

    {
      "id": 3282,
      "name": "老边区",
      "parentId": 609,
      "districtList": [] },

    {
      "id": 3283,
      "name": "西市区",
      "parentId": 609,
      "districtList": [] },

    {
      "id": 6628,
      "name": "站前区",
      "parentId": 609,
      "districtList": [] },

    {
      "id": 20183,
      "name": "鲅鱼圈区",
      "parentId": 609,
      "districtList": [] }] },



  {
    "id": 613,
    "name": "盘锦市",
    "parentId": 8,
    "districtList": [{
      "id": 614,
      "name": "盘山县",
      "parentId": 613,
      "districtList": [] },

    {
      "id": 615,
      "name": "大洼区",
      "parentId": 613,
      "districtList": [] },

    {
      "id": 20661,
      "name": "兴隆台区",
      "parentId": 613,
      "districtList": [] },

    {
      "id": 20662,
      "name": "双台子区",
      "parentId": 613,
      "districtList": [] }] },



  {
    "id": 617,
    "name": "阜新市",
    "parentId": 8,
    "districtList": [{
      "id": 618,
      "name": "阜新县",
      "parentId": 617,
      "districtList": [] },

    {
      "id": 619,
      "name": "彰武县",
      "parentId": 617,
      "districtList": [] },

    {
      "id": 3286,
      "name": "清河门区",
      "parentId": 617,
      "districtList": [] },

    {
      "id": 3288,
      "name": "新邱区",
      "parentId": 617,
      "districtList": [] },

    {
      "id": 20658,
      "name": "海州区",
      "parentId": 617,
      "districtList": [] },

    {
      "id": 20659,
      "name": "太平区",
      "parentId": 617,
      "districtList": [] },

    {
      "id": 20660,
      "name": "细河区",
      "parentId": 617,
      "districtList": [] }] },



  {
    "id": 621,
    "name": "辽阳市",
    "parentId": 8,
    "districtList": [{
      "id": 623,
      "name": "辽阳县",
      "parentId": 621,
      "districtList": [] },

    {
      "id": 3290,
      "name": "太子河区",
      "parentId": 621,
      "districtList": [] },

    {
      "id": 3291,
      "name": "弓长岭区",
      "parentId": 621,
      "districtList": [] },

    {
      "id": 3292,
      "name": "宏伟区",
      "parentId": 621,
      "districtList": [] },

    {
      "id": 43963,
      "name": "白塔区",
      "parentId": 621,
      "districtList": [] },

    {
      "id": 43964,
      "name": "文圣区",
      "parentId": 621,
      "districtList": [] },

    {
      "id": 43965,
      "name": "灯塔市",
      "parentId": 621,
      "districtList": [] }] },



  {
    "id": 632,
    "name": "朝阳市",
    "parentId": 8,
    "districtList": [{
      "id": 633,
      "name": "凌源市",
      "parentId": 632,
      "districtList": [] },

    {
      "id": 634,
      "name": "北票市",
      "parentId": 632,
      "districtList": [] },

    {
      "id": 635,
      "name": "喀喇沁左翼县",
      "parentId": 632,
      "districtList": [] },

    {
      "id": 636,
      "name": "朝阳县",
      "parentId": 632,
      "districtList": [] },

    {
      "id": 637,
      "name": "建平县",
      "parentId": 632,
      "districtList": [] },

    {
      "id": 3299,
      "name": "龙城区",
      "parentId": 632,
      "districtList": [] },

    {
      "id": 20348,
      "name": "双塔区",
      "parentId": 632,
      "districtList": [] }] },



  {
    "id": 6858,
    "name": "铁岭市",
    "parentId": 8,
    "districtList": [{
      "id": 6859,
      "name": "银州区",
      "parentId": 6858,
      "districtList": [] },

    {
      "id": 6860,
      "name": "清河区",
      "parentId": 6858,
      "districtList": [] },

    {
      "id": 6862,
      "name": "开原市",
      "parentId": 6858,
      "districtList": [] },

    {
      "id": 6863,
      "name": "铁岭县",
      "parentId": 6858,
      "districtList": [] },

    {
      "id": 6864,
      "name": "西丰县",
      "parentId": 6858,
      "districtList": [] },

    {
      "id": 6865,
      "name": "昌图县",
      "parentId": 6858,
      "districtList": [] },

    {
      "id": 44027,
      "name": "调兵山市",
      "parentId": 6858,
      "districtList": [] }] }] },





{
  "id": 9,
  "name": "吉林",
  "parentId": 0,
  "districtList": [{
    "id": 639,
    "name": "长春市",
    "parentId": 9,
    "districtList": [{
      "id": 640,
      "name": "榆树市",
      "parentId": 639,
      "districtList": [] },

    {
      "id": 641,
      "name": "九台市",
      "parentId": 639,
      "districtList": [] },

    {
      "id": 642,
      "name": "农安县",
      "parentId": 639,
      "districtList": [] },

    {
      "id": 3172,
      "name": "德惠市",
      "parentId": 639,
      "districtList": [] },

    {
      "id": 3306,
      "name": "双阳区",
      "parentId": 639,
      "districtList": [] },

    {
      "id": 38630,
      "name": "朝阳区",
      "parentId": 639,
      "districtList": [] },

    {
      "id": 38631,
      "name": "南关区",
      "parentId": 639,
      "districtList": [] },

    {
      "id": 38632,
      "name": "宽城区",
      "parentId": 639,
      "districtList": [] },

    {
      "id": 38633,
      "name": "二道区",
      "parentId": 639,
      "districtList": [] },

    {
      "id": 38634,
      "name": "绿园区",
      "parentId": 639,
      "districtList": [] },

    {
      "id": 38635,
      "name": "净月区",
      "parentId": 639,
      "districtList": [] },

    {
      "id": 38636,
      "name": "汽车产业开发区",
      "parentId": 639,
      "districtList": [] },

    {
      "id": 38637,
      "name": "高新技术开发区",
      "parentId": 639,
      "districtList": [] },

    {
      "id": 38638,
      "name": "经济技术开发区",
      "parentId": 639,
      "districtList": [] }] },



  {
    "id": 644,
    "name": "吉林市",
    "parentId": 9,
    "districtList": [{
      "id": 645,
      "name": "舒兰市",
      "parentId": 644,
      "districtList": [] },

    {
      "id": 646,
      "name": "桦甸市",
      "parentId": 644,
      "districtList": [] },

    {
      "id": 647,
      "name": "蛟河市",
      "parentId": 644,
      "districtList": [] },

    {
      "id": 648,
      "name": "磐石市",
      "parentId": 644,
      "districtList": [] },

    {
      "id": 649,
      "name": "永吉县",
      "parentId": 644,
      "districtList": [] },

    {
      "id": 24069,
      "name": "昌邑区",
      "parentId": 644,
      "districtList": [] },

    {
      "id": 24070,
      "name": "龙潭区",
      "parentId": 644,
      "districtList": [] },

    {
      "id": 24071,
      "name": "船营区",
      "parentId": 644,
      "districtList": [] },

    {
      "id": 24072,
      "name": "丰满区",
      "parentId": 644,
      "districtList": [] }] },



  {
    "id": 651,
    "name": "四平市",
    "parentId": 9,
    "districtList": [{
      "id": 652,
      "name": "公主岭市",
      "parentId": 651,
      "districtList": [] },

    {
      "id": 653,
      "name": "双辽市",
      "parentId": 651,
      "districtList": [] },

    {
      "id": 654,
      "name": "梨树县",
      "parentId": 651,
      "districtList": [] },

    {
      "id": 656,
      "name": "伊通县",
      "parentId": 651,
      "districtList": [] },

    {
      "id": 6641,
      "name": "铁东区",
      "parentId": 651,
      "districtList": [] },

    {
      "id": 6642,
      "name": "铁西区",
      "parentId": 651,
      "districtList": [] }] },



  {
    "id": 657,
    "name": "通化市",
    "parentId": 9,
    "districtList": [{
      "id": 658,
      "name": "梅河口市",
      "parentId": 657,
      "districtList": [] },

    {
      "id": 659,
      "name": "集安市",
      "parentId": 657,
      "districtList": [] },

    {
      "id": 660,
      "name": "通化县",
      "parentId": 657,
      "districtList": [] },

    {
      "id": 661,
      "name": "辉南县",
      "parentId": 657,
      "districtList": [] },

    {
      "id": 662,
      "name": "柳河县",
      "parentId": 657,
      "districtList": [] },

    {
      "id": 663,
      "name": "二道江区",
      "parentId": 657,
      "districtList": [] },

    {
      "id": 3311,
      "name": "东昌区",
      "parentId": 657,
      "districtList": [] }] },



  {
    "id": 664,
    "name": "白山市",
    "parentId": 9,
    "districtList": [{
      "id": 665,
      "name": "临江市",
      "parentId": 664,
      "districtList": [] },

    {
      "id": 669,
      "name": "江源区",
      "parentId": 664,
      "districtList": [] },

    {
      "id": 671,
      "name": "靖宇县",
      "parentId": 664,
      "districtList": [] },

    {
      "id": 672,
      "name": "抚松县",
      "parentId": 664,
      "districtList": [] },

    {
      "id": 673,
      "name": "长白县",
      "parentId": 664,
      "districtList": [] },

    {
      "id": 24074,
      "name": "浑江区",
      "parentId": 664,
      "districtList": [] }] },



  {
    "id": 674,
    "name": "松原市",
    "parentId": 9,
    "districtList": [{
      "id": 675,
      "name": "乾安县",
      "parentId": 674,
      "districtList": [] },

    {
      "id": 676,
      "name": "长岭县",
      "parentId": 674,
      "districtList": [] },

    {
      "id": 677,
      "name": "扶余县",
      "parentId": 674,
      "districtList": [] },

    {
      "id": 24075,
      "name": "宁江区",
      "parentId": 674,
      "districtList": [] },

    {
      "id": 24076,
      "name": "前郭县",
      "parentId": 674,
      "districtList": [] }] },



  {
    "id": 681,
    "name": "白城市",
    "parentId": 9,
    "districtList": [{
      "id": 682,
      "name": "大安市",
      "parentId": 681,
      "districtList": [] },

    {
      "id": 683,
      "name": "洮南市",
      "parentId": 681,
      "districtList": [] },

    {
      "id": 684,
      "name": "通榆县",
      "parentId": 681,
      "districtList": [] },

    {
      "id": 685,
      "name": "镇赉县",
      "parentId": 681,
      "districtList": [] },

    {
      "id": 686,
      "name": "洮北区",
      "parentId": 681,
      "districtList": [] }] },



  {
    "id": 687,
    "name": "延边州",
    "parentId": 9,
    "districtList": [{
      "id": 3312,
      "name": "图们市",
      "parentId": 687,
      "districtList": [] },

    {
      "id": 3313,
      "name": "敦化市",
      "parentId": 687,
      "districtList": [] },

    {
      "id": 3314,
      "name": "珲春市",
      "parentId": 687,
      "districtList": [] },

    {
      "id": 3315,
      "name": "龙井市",
      "parentId": 687,
      "districtList": [] },

    {
      "id": 3316,
      "name": "和龙市",
      "parentId": 687,
      "districtList": [] },

    {
      "id": 3317,
      "name": "汪清县",
      "parentId": 687,
      "districtList": [] },

    {
      "id": 3318,
      "name": "安图县",
      "parentId": 687,
      "districtList": [] },

    {
      "id": 24073,
      "name": "延吉市",
      "parentId": 687,
      "districtList": [] }] },



  {
    "id": 2992,
    "name": "辽源市",
    "parentId": 9,
    "districtList": [{
      "id": 2993,
      "name": "龙山区",
      "parentId": 2992,
      "districtList": [] },

    {
      "id": 2994,
      "name": "西安区",
      "parentId": 2992,
      "districtList": [] },

    {
      "id": 2995,
      "name": "东丰县",
      "parentId": 2992,
      "districtList": [] },

    {
      "id": 2996,
      "name": "东辽县",
      "parentId": 2992,
      "districtList": [] }] }] },





{
  "id": 10,
  "name": "黑龙江",
  "parentId": 0,
  "districtList": [{
    "id": 698,
    "name": "哈尔滨市",
    "parentId": 10,
    "districtList": [{
      "id": 699,
      "name": "阿城区",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 700,
      "name": "尚志市",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 701,
      "name": "双城市",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 702,
      "name": "五常市",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 704,
      "name": "方正县",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 705,
      "name": "宾县",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 706,
      "name": "依兰县",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 707,
      "name": "巴彦县",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 708,
      "name": "通河县",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 709,
      "name": "木兰县",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 710,
      "name": "延寿县",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 45814,
      "name": "呼兰区",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 45815,
      "name": "松北区",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 45816,
      "name": "道里区",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 45817,
      "name": "南岗区",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 45818,
      "name": "道外区",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 45819,
      "name": "香坊区",
      "parentId": 698,
      "districtList": [] },

    {
      "id": 45820,
      "name": "平房区",
      "parentId": 698,
      "districtList": [] }] },



  {
    "id": 712,
    "name": "齐齐哈尔市",
    "parentId": 10,
    "districtList": [{
      "id": 713,
      "name": "梅里斯区",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 714,
      "name": "昂昂溪区",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 715,
      "name": "富拉尔基区",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 716,
      "name": "碾子山区",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 717,
      "name": "讷河市",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 718,
      "name": "富裕县",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 719,
      "name": "拜泉县",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 720,
      "name": "甘南县",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 721,
      "name": "依安县",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 722,
      "name": "克山县",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 723,
      "name": "龙江县",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 724,
      "name": "克东县",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 725,
      "name": "泰来县",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 33404,
      "name": "建华区",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 33405,
      "name": "龙沙区",
      "parentId": 712,
      "districtList": [] },

    {
      "id": 33406,
      "name": "铁锋区",
      "parentId": 712,
      "districtList": [] }] },



  {
    "id": 727,
    "name": "鹤岗市",
    "parentId": 10,
    "districtList": [{
      "id": 728,
      "name": "萝北县",
      "parentId": 727,
      "districtList": [] },

    {
      "id": 729,
      "name": "绥滨县",
      "parentId": 727,
      "districtList": [] },

    {
      "id": 3334,
      "name": "兴山区",
      "parentId": 727,
      "districtList": [] },

    {
      "id": 3335,
      "name": "向阳区",
      "parentId": 727,
      "districtList": [] },

    {
      "id": 3336,
      "name": "工农区",
      "parentId": 727,
      "districtList": [] },

    {
      "id": 3337,
      "name": "南山区",
      "parentId": 727,
      "districtList": [] },

    {
      "id": 3338,
      "name": "兴安区",
      "parentId": 727,
      "districtList": [] },

    {
      "id": 3339,
      "name": "东山区",
      "parentId": 727,
      "districtList": [] }] },



  {
    "id": 731,
    "name": "双鸭山市",
    "parentId": 10,
    "districtList": [{
      "id": 733,
      "name": "集贤县",
      "parentId": 731,
      "districtList": [] },

    {
      "id": 734,
      "name": "宝清县",
      "parentId": 731,
      "districtList": [] },

    {
      "id": 735,
      "name": "友谊县",
      "parentId": 731,
      "districtList": [] },

    {
      "id": 736,
      "name": "饶河县",
      "parentId": 731,
      "districtList": [] },

    {
      "id": 3340,
      "name": "尖山区",
      "parentId": 731,
      "districtList": [] },

    {
      "id": 3341,
      "name": "岭东区",
      "parentId": 731,
      "districtList": [] },

    {
      "id": 3342,
      "name": "四方台区",
      "parentId": 731,
      "districtList": [] },

    {
      "id": 3343,
      "name": "宝山区",
      "parentId": 731,
      "districtList": [] }] },



  {
    "id": 737,
    "name": "鸡西市",
    "parentId": 10,
    "districtList": [{
      "id": 739,
      "name": "密山市",
      "parentId": 737,
      "districtList": [] },

    {
      "id": 740,
      "name": "虎林市",
      "parentId": 737,
      "districtList": [] },

    {
      "id": 741,
      "name": "鸡东县",
      "parentId": 737,
      "districtList": [] },

    {
      "id": 3329,
      "name": "恒山区",
      "parentId": 737,
      "districtList": [] },

    {
      "id": 3330,
      "name": "滴道区",
      "parentId": 737,
      "districtList": [] },

    {
      "id": 3331,
      "name": "梨树区",
      "parentId": 737,
      "districtList": [] },

    {
      "id": 3332,
      "name": "城子河区",
      "parentId": 737,
      "districtList": [] },

    {
      "id": 3333,
      "name": "麻山区",
      "parentId": 737,
      "districtList": [] },

    {
      "id": 33163,
      "name": "鸡冠区",
      "parentId": 737,
      "districtList": [] }] },



  {
    "id": 742,
    "name": "大庆市",
    "parentId": 10,
    "districtList": [{
      "id": 744,
      "name": "萨尔图区",
      "parentId": 742,
      "districtList": [] },

    {
      "id": 745,
      "name": "龙凤区",
      "parentId": 742,
      "districtList": [] },

    {
      "id": 746,
      "name": "让胡路区",
      "parentId": 742,
      "districtList": [] },

    {
      "id": 747,
      "name": "红岗区",
      "parentId": 742,
      "districtList": [] },

    {
      "id": 748,
      "name": "大同区",
      "parentId": 742,
      "districtList": [] },

    {
      "id": 749,
      "name": "林甸县",
      "parentId": 742,
      "districtList": [] },

    {
      "id": 750,
      "name": "肇州县",
      "parentId": 742,
      "districtList": [] },

    {
      "id": 751,
      "name": "肇源县",
      "parentId": 742,
      "districtList": [] },

    {
      "id": 752,
      "name": "杜尔伯特县",
      "parentId": 742,
      "districtList": [] }] },



  {
    "id": 753,
    "name": "伊春市",
    "parentId": 10,
    "districtList": [{
      "id": 754,
      "name": "铁力市",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 755,
      "name": "嘉荫县",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3344,
      "name": "伊春区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3345,
      "name": "南岔区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3346,
      "name": "友好区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3347,
      "name": "西林区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3348,
      "name": "翠峦区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3349,
      "name": "新青区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3350,
      "name": "美溪区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3351,
      "name": "金山屯区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3352,
      "name": "五营区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3353,
      "name": "乌马河区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3354,
      "name": "汤旺河区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3355,
      "name": "带岭区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3356,
      "name": "乌伊岭区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3357,
      "name": "红星区",
      "parentId": 753,
      "districtList": [] },

    {
      "id": 3358,
      "name": "上甘岭区",
      "parentId": 753,
      "districtList": [] }] },



  {
    "id": 757,
    "name": "牡丹江市",
    "parentId": 10,
    "districtList": [{
      "id": 758,
      "name": "海林市",
      "parentId": 757,
      "districtList": [] },

    {
      "id": 760,
      "name": "宁安市",
      "parentId": 757,
      "districtList": [] },

    {
      "id": 761,
      "name": "穆棱市",
      "parentId": 757,
      "districtList": [] },

    {
      "id": 762,
      "name": "林口县",
      "parentId": 757,
      "districtList": [] },

    {
      "id": 763,
      "name": "东宁县",
      "parentId": 757,
      "districtList": [] },

    {
      "id": 3367,
      "name": "爱民区",
      "parentId": 757,
      "districtList": [] },

    {
      "id": 3368,
      "name": "东安区",
      "parentId": 757,
      "districtList": [] },

    {
      "id": 3369,
      "name": "阳明区",
      "parentId": 757,
      "districtList": [] },

    {
      "id": 3370,
      "name": "西安区",
      "parentId": 757,
      "districtList": [] },

    {
      "id": 4148,
      "name": "绥芬河市",
      "parentId": 757,
      "districtList": [] }] },



  {
    "id": 765,
    "name": "佳木斯市",
    "parentId": 10,
    "districtList": [{
      "id": 766,
      "name": "同江市",
      "parentId": 765,
      "districtList": [] },

    {
      "id": 767,
      "name": "富锦市",
      "parentId": 765,
      "districtList": [] },

    {
      "id": 768,
      "name": "桦川县",
      "parentId": 765,
      "districtList": [] },

    {
      "id": 769,
      "name": "抚远县",
      "parentId": 765,
      "districtList": [] },

    {
      "id": 770,
      "name": "桦南县",
      "parentId": 765,
      "districtList": [] },

    {
      "id": 771,
      "name": "汤原县",
      "parentId": 765,
      "districtList": [] },

    {
      "id": 33269,
      "name": "前进区",
      "parentId": 765,
      "districtList": [] },

    {
      "id": 33270,
      "name": "向阳区",
      "parentId": 765,
      "districtList": [] },

    {
      "id": 33271,
      "name": "东风区",
      "parentId": 765,
      "districtList": [] },

    {
      "id": 33272,
      "name": "郊区",
      "parentId": 765,
      "districtList": [] }] },



  {
    "id": 773,
    "name": "七台河市",
    "parentId": 10,
    "districtList": [{
      "id": 774,
      "name": "勃利县",
      "parentId": 773,
      "districtList": [] },

    {
      "id": 3364,
      "name": "桃山区",
      "parentId": 773,
      "districtList": [] },

    {
      "id": 3365,
      "name": "新兴区",
      "parentId": 773,
      "districtList": [] },

    {
      "id": 3366,
      "name": "茄子河区",
      "parentId": 773,
      "districtList": [] },

    {
      "id": 53287,
      "name": "金沙新区",
      "parentId": 773,
      "districtList": [] }] },



  {
    "id": 776,
    "name": "黑河市",
    "parentId": 10,
    "districtList": [{
      "id": 777,
      "name": "北安市",
      "parentId": 776,
      "districtList": [] },

    {
      "id": 778,
      "name": "五大连池市",
      "parentId": 776,
      "districtList": [] },

    {
      "id": 779,
      "name": "逊克县",
      "parentId": 776,
      "districtList": [] },

    {
      "id": 780,
      "name": "孙吴县",
      "parentId": 776,
      "districtList": [] },

    {
      "id": 3096,
      "name": "嫩江县",
      "parentId": 776,
      "districtList": [] },

    {
      "id": 3371,
      "name": "爱辉区",
      "parentId": 776,
      "districtList": [] }] },



  {
    "id": 782,
    "name": "绥化市",
    "parentId": 10,
    "districtList": [{
      "id": 784,
      "name": "安达市",
      "parentId": 782,
      "districtList": [] },

    {
      "id": 785,
      "name": "肇东市",
      "parentId": 782,
      "districtList": [] },

    {
      "id": 786,
      "name": "海伦市",
      "parentId": 782,
      "districtList": [] },

    {
      "id": 787,
      "name": "绥棱县",
      "parentId": 782,
      "districtList": [] },

    {
      "id": 788,
      "name": "兰西县",
      "parentId": 782,
      "districtList": [] },

    {
      "id": 789,
      "name": "明水县",
      "parentId": 782,
      "districtList": [] },

    {
      "id": 790,
      "name": "青冈县",
      "parentId": 782,
      "districtList": [] },

    {
      "id": 791,
      "name": "庆安县",
      "parentId": 782,
      "districtList": [] },

    {
      "id": 792,
      "name": "望奎县",
      "parentId": 782,
      "districtList": [] },

    {
      "id": 6712,
      "name": "北林区",
      "parentId": 782,
      "districtList": [] }] },



  {
    "id": 793,
    "name": "大兴安岭地区",
    "parentId": 10,
    "districtList": [{
      "id": 794,
      "name": "呼玛县",
      "parentId": 793,
      "districtList": [] },

    {
      "id": 795,
      "name": "塔河县",
      "parentId": 793,
      "districtList": [] },

    {
      "id": 796,
      "name": "漠河县",
      "parentId": 793,
      "districtList": [] },

    {
      "id": 4114,
      "name": "加格达奇区",
      "parentId": 793,
      "districtList": [] },

    {
      "id": 4115,
      "name": "松岭区",
      "parentId": 793,
      "districtList": [] },

    {
      "id": 4116,
      "name": "呼中区",
      "parentId": 793,
      "districtList": [] },

    {
      "id": 11432,
      "name": "新林区",
      "parentId": 793,
      "districtList": [] }] }] },





{
  "id": 11,
  "name": "内蒙古",
  "parentId": 0,
  "districtList": [{
    "id": 799,
    "name": "呼和浩特市",
    "parentId": 11,
    "districtList": [{
      "id": 801,
      "name": "土默特左旗",
      "parentId": 799,
      "districtList": [] },

    {
      "id": 802,
      "name": "和林格尔县",
      "parentId": 799,
      "districtList": [] },

    {
      "id": 803,
      "name": "武川县",
      "parentId": 799,
      "districtList": [] },

    {
      "id": 804,
      "name": "托克托县",
      "parentId": 799,
      "districtList": [] },

    {
      "id": 3133,
      "name": "清水河县",
      "parentId": 799,
      "districtList": [] },

    {
      "id": 3240,
      "name": "玉泉区",
      "parentId": 799,
      "districtList": [] },

    {
      "id": 3241,
      "name": "赛罕区",
      "parentId": 799,
      "districtList": [] },

    {
      "id": 32652,
      "name": "回民区",
      "parentId": 799,
      "districtList": [] },

    {
      "id": 32653,
      "name": "新城区",
      "parentId": 799,
      "districtList": [] }] },



  {
    "id": 805,
    "name": "包头市",
    "parentId": 11,
    "districtList": [{
      "id": 807,
      "name": "固阳县",
      "parentId": 805,
      "districtList": [] },

    {
      "id": 808,
      "name": "土默特右旗",
      "parentId": 805,
      "districtList": [] },

    {
      "id": 809,
      "name": "达茂联合旗",
      "parentId": 805,
      "districtList": [] },

    {
      "id": 3245,
      "name": "石拐区",
      "parentId": 805,
      "districtList": [] },

    {
      "id": 3246,
      "name": "白云矿区",
      "parentId": 805,
      "districtList": [] },

    {
      "id": 38251,
      "name": "东河区",
      "parentId": 805,
      "districtList": [] },

    {
      "id": 38252,
      "name": "九原区",
      "parentId": 805,
      "districtList": [] },

    {
      "id": 38253,
      "name": "青山区",
      "parentId": 805,
      "districtList": [] },

    {
      "id": 38254,
      "name": "昆都仑区",
      "parentId": 805,
      "districtList": [] }] },



  {
    "id": 810,
    "name": "乌海市",
    "parentId": 11,
    "districtList": [{
      "id": 811,
      "name": "海勃湾区",
      "parentId": 810,
      "districtList": [] },

    {
      "id": 3248,
      "name": "海南区",
      "parentId": 810,
      "districtList": [] },

    {
      "id": 3249,
      "name": "乌达区",
      "parentId": 810,
      "districtList": [] }] },



  {
    "id": 812,
    "name": "赤峰市",
    "parentId": 11,
    "districtList": [{
      "id": 814,
      "name": "宁城县",
      "parentId": 812,
      "districtList": [] },

    {
      "id": 815,
      "name": "敖汉旗",
      "parentId": 812,
      "districtList": [] },

    {
      "id": 816,
      "name": "喀喇沁旗",
      "parentId": 812,
      "districtList": [] },

    {
      "id": 817,
      "name": "翁牛特旗",
      "parentId": 812,
      "districtList": [] },

    {
      "id": 818,
      "name": "巴林右旗",
      "parentId": 812,
      "districtList": [] },

    {
      "id": 819,
      "name": "林西县",
      "parentId": 812,
      "districtList": [] },

    {
      "id": 820,
      "name": "克什克腾旗",
      "parentId": 812,
      "districtList": [] },

    {
      "id": 821,
      "name": "巴林左旗",
      "parentId": 812,
      "districtList": [] },

    {
      "id": 822,
      "name": "阿鲁科尔沁旗",
      "parentId": 812,
      "districtList": [] },

    {
      "id": 3199,
      "name": "元宝山区",
      "parentId": 812,
      "districtList": [] },

    {
      "id": 3251,
      "name": "松山区",
      "parentId": 812,
      "districtList": [] },

    {
      "id": 32937,
      "name": "红山区",
      "parentId": 812,
      "districtList": [] }] },



  {
    "id": 823,
    "name": "乌兰察布市",
    "parentId": 11,
    "districtList": [{
      "id": 824,
      "name": "集宁区",
      "parentId": 823,
      "districtList": [] },

    {
      "id": 825,
      "name": "丰镇市",
      "parentId": 823,
      "districtList": [] },

    {
      "id": 826,
      "name": "兴和县",
      "parentId": 823,
      "districtList": [] },

    {
      "id": 827,
      "name": "卓资县",
      "parentId": 823,
      "districtList": [] },

    {
      "id": 828,
      "name": "商都县",
      "parentId": 823,
      "districtList": [] },

    {
      "id": 829,
      "name": "凉城县",
      "parentId": 823,
      "districtList": [] },

    {
      "id": 830,
      "name": "化德县",
      "parentId": 823,
      "districtList": [] },

    {
      "id": 831,
      "name": "察哈尔右翼前旗",
      "parentId": 823,
      "districtList": [] },

    {
      "id": 832,
      "name": "察哈尔右翼中旗",
      "parentId": 823,
      "districtList": [] },

    {
      "id": 833,
      "name": "察哈尔右翼后旗",
      "parentId": 823,
      "districtList": [] },

    {
      "id": 834,
      "name": "四子王旗",
      "parentId": 823,
      "districtList": [] }] },



  {
    "id": 835,
    "name": "锡林郭勒盟",
    "parentId": 11,
    "districtList": [{
      "id": 836,
      "name": "锡林浩特市",
      "parentId": 835,
      "districtList": [] },

    {
      "id": 837,
      "name": "二连浩特市",
      "parentId": 835,
      "districtList": [] },

    {
      "id": 838,
      "name": "多伦县",
      "parentId": 835,
      "districtList": [] },

    {
      "id": 839,
      "name": "阿巴嘎旗",
      "parentId": 835,
      "districtList": [] },

    {
      "id": 840,
      "name": "西乌珠穆沁旗",
      "parentId": 835,
      "districtList": [] },

    {
      "id": 841,
      "name": "东乌珠穆沁旗",
      "parentId": 835,
      "districtList": [] },

    {
      "id": 842,
      "name": "苏尼特右旗",
      "parentId": 835,
      "districtList": [] },

    {
      "id": 843,
      "name": "苏尼特左旗",
      "parentId": 835,
      "districtList": [] },

    {
      "id": 844,
      "name": "太仆寺旗",
      "parentId": 835,
      "districtList": [] },

    {
      "id": 845,
      "name": "正镶白旗",
      "parentId": 835,
      "districtList": [] },

    {
      "id": 846,
      "name": "正蓝旗",
      "parentId": 835,
      "districtList": [] },

    {
      "id": 847,
      "name": "镶黄旗",
      "parentId": 835,
      "districtList": [] }] },



  {
    "id": 848,
    "name": "呼伦贝尔市",
    "parentId": 11,
    "districtList": [{
      "id": 849,
      "name": "海拉尔区",
      "parentId": 848,
      "districtList": [] },

    {
      "id": 850,
      "name": "满洲里市",
      "parentId": 848,
      "districtList": [] },

    {
      "id": 851,
      "name": "牙克石市",
      "parentId": 848,
      "districtList": [] },

    {
      "id": 852,
      "name": "扎兰屯市",
      "parentId": 848,
      "districtList": [] },

    {
      "id": 853,
      "name": "根河市",
      "parentId": 848,
      "districtList": [] },

    {
      "id": 854,
      "name": "额尔古纳市",
      "parentId": 848,
      "districtList": [] },

    {
      "id": 855,
      "name": "陈巴尔虎旗",
      "parentId": 848,
      "districtList": [] },

    {
      "id": 856,
      "name": "阿荣旗",
      "parentId": 848,
      "districtList": [] },

    {
      "id": 857,
      "name": "新巴尔虎左旗",
      "parentId": 848,
      "districtList": [] },

    {
      "id": 858,
      "name": "新巴尔虎右旗",
      "parentId": 848,
      "districtList": [] },

    {
      "id": 859,
      "name": "鄂伦春旗",
      "parentId": 848,
      "districtList": [] },

    {
      "id": 860,
      "name": "莫力达瓦旗",
      "parentId": 848,
      "districtList": [] },

    {
      "id": 861,
      "name": "鄂温克族旗",
      "parentId": 848,
      "districtList": [] }] },



  {
    "id": 870,
    "name": "鄂尔多斯市",
    "parentId": 11,
    "districtList": [{
      "id": 871,
      "name": "东胜区",
      "parentId": 870,
      "districtList": [] },

    {
      "id": 872,
      "name": "准格尔旗",
      "parentId": 870,
      "districtList": [] },

    {
      "id": 874,
      "name": "伊金霍洛旗",
      "parentId": 870,
      "districtList": [] },

    {
      "id": 875,
      "name": "乌审旗",
      "parentId": 870,
      "districtList": [] },

    {
      "id": 876,
      "name": "杭锦旗",
      "parentId": 870,
      "districtList": [] },

    {
      "id": 877,
      "name": "鄂托克旗",
      "parentId": 870,
      "districtList": [] },

    {
      "id": 878,
      "name": "鄂托克前旗",
      "parentId": 870,
      "districtList": [] },

    {
      "id": 879,
      "name": "达拉特旗",
      "parentId": 870,
      "districtList": [] },

    {
      "id": 18374,
      "name": "康巴什新区",
      "parentId": 870,
      "districtList": [] }] },



  {
    "id": 880,
    "name": "巴彦淖尔市",
    "parentId": 11,
    "districtList": [{
      "id": 881,
      "name": "临河区",
      "parentId": 880,
      "districtList": [] },

    {
      "id": 882,
      "name": "五原县",
      "parentId": 880,
      "districtList": [] },

    {
      "id": 883,
      "name": "磴口县",
      "parentId": 880,
      "districtList": [] },

    {
      "id": 884,
      "name": "杭锦后旗",
      "parentId": 880,
      "districtList": [] },

    {
      "id": 885,
      "name": "乌拉特中旗",
      "parentId": 880,
      "districtList": [] },

    {
      "id": 888,
      "name": "乌拉特后旗 ",
      "parentId": 880,
      "districtList": [] },

    {
      "id": 890,
      "name": "乌拉特前旗",
      "parentId": 880,
      "districtList": [] }] },



  {
    "id": 891,
    "name": "阿拉善盟",
    "parentId": 11,
    "districtList": [{
      "id": 892,
      "name": "阿拉善右旗",
      "parentId": 891,
      "districtList": [] },

    {
      "id": 893,
      "name": "阿拉善左旗",
      "parentId": 891,
      "districtList": [] },

    {
      "id": 894,
      "name": "额济纳旗",
      "parentId": 891,
      "districtList": [] }] },



  {
    "id": 895,
    "name": "兴安盟",
    "parentId": 11,
    "districtList": [{
      "id": 896,
      "name": "乌兰浩特市",
      "parentId": 895,
      "districtList": [] },

    {
      "id": 897,
      "name": "阿尔山市",
      "parentId": 895,
      "districtList": [] },

    {
      "id": 898,
      "name": "突泉县",
      "parentId": 895,
      "districtList": [] },

    {
      "id": 899,
      "name": "扎赉特旗",
      "parentId": 895,
      "districtList": [] },

    {
      "id": 900,
      "name": "科尔沁右翼前旗",
      "parentId": 895,
      "districtList": [] },

    {
      "id": 901,
      "name": "科尔沁右翼中旗",
      "parentId": 895,
      "districtList": [] }] },



  {
    "id": 902,
    "name": "通辽市",
    "parentId": 11,
    "districtList": [{
      "id": 3142,
      "name": "霍林郭勒市",
      "parentId": 902,
      "districtList": [] },

    {
      "id": 3252,
      "name": "开鲁县",
      "parentId": 902,
      "districtList": [] },

    {
      "id": 3253,
      "name": "库伦旗",
      "parentId": 902,
      "districtList": [] },

    {
      "id": 3254,
      "name": "奈曼旗",
      "parentId": 902,
      "districtList": [] },

    {
      "id": 3255,
      "name": "扎鲁特旗",
      "parentId": 902,
      "districtList": [] },

    {
      "id": 3256,
      "name": "科尔沁左翼中旗",
      "parentId": 902,
      "districtList": [] },

    {
      "id": 3258,
      "name": "科尔沁左翼后旗",
      "parentId": 902,
      "districtList": [] },

    {
      "id": 32769,
      "name": "科尔沁区",
      "parentId": 902,
      "districtList": [] }] }] },





{
  "id": 12,
  "name": "江苏",
  "parentId": 0,
  "districtList": [{
    "id": 904,
    "name": "南京市",
    "parentId": 12,
    "districtList": [{
      "id": 905,
      "name": "江宁区",
      "parentId": 904,
      "districtList": [] },

    {
      "id": 907,
      "name": "高淳区",
      "parentId": 904,
      "districtList": [] },

    {
      "id": 908,
      "name": "六合区",
      "parentId": 904,
      "districtList": [] },

    {
      "id": 3024,
      "name": "溧水区",
      "parentId": 904,
      "districtList": [] },

    {
      "id": 3373,
      "name": "玄武区",
      "parentId": 904,
      "districtList": [] },

    {
      "id": 3375,
      "name": "秦淮区",
      "parentId": 904,
      "districtList": [] },

    {
      "id": 3376,
      "name": "建邺区",
      "parentId": 904,
      "districtList": [] },

    {
      "id": 3377,
      "name": "鼓楼区",
      "parentId": 904,
      "districtList": [] },

    {
      "id": 3378,
      "name": "栖霞区",
      "parentId": 904,
      "districtList": [] },

    {
      "id": 3379,
      "name": "雨花台区",
      "parentId": 904,
      "districtList": [] },

    {
      "id": 50647,
      "name": "浦口区",
      "parentId": 904,
      "districtList": [] }] },



  {
    "id": 911,
    "name": "徐州市",
    "parentId": 12,
    "districtList": [{
      "id": 914,
      "name": "铜山区",
      "parentId": 911,
      "districtList": [] },

    {
      "id": 915,
      "name": "睢宁县",
      "parentId": 911,
      "districtList": [] },

    {
      "id": 916,
      "name": "沛县",
      "parentId": 911,
      "districtList": [] },

    {
      "id": 917,
      "name": "丰县",
      "parentId": 911,
      "districtList": [] },

    {
      "id": 3388,
      "name": "贾汪区",
      "parentId": 911,
      "districtList": [] },

    {
      "id": 4223,
      "name": "金山桥开发区",
      "parentId": 911,
      "districtList": [] },

    {
      "id": 4224,
      "name": "铜山经济技术开发区",
      "parentId": 911,
      "districtList": [] },

    {
      "id": 4228,
      "name": "八段工业园区",
      "parentId": 911,
      "districtList": [] },

    {
      "id": 23686,
      "name": "鼓楼区",
      "parentId": 911,
      "districtList": [] },

    {
      "id": 23687,
      "name": "邳州市",
      "parentId": 911,
      "districtList": [] },

    {
      "id": 23688,
      "name": "泉山区",
      "parentId": 911,
      "districtList": [] },

    {
      "id": 23689,
      "name": "新沂市",
      "parentId": 911,
      "districtList": [] },

    {
      "id": 23690,
      "name": "云龙区",
      "parentId": 911,
      "districtList": [] }] },



  {
    "id": 919,
    "name": "连云港市",
    "parentId": 12,
    "districtList": [{
      "id": 920,
      "name": "赣榆区",
      "parentId": 919,
      "districtList": [] },

    {
      "id": 921,
      "name": "灌云县",
      "parentId": 919,
      "districtList": [] },

    {
      "id": 922,
      "name": "东海县",
      "parentId": 919,
      "districtList": [] },

    {
      "id": 923,
      "name": "灌南县",
      "parentId": 919,
      "districtList": [] },

    {
      "id": 4248,
      "name": "连云区",
      "parentId": 919,
      "districtList": [] },

    {
      "id": 23684,
      "name": "海州区",
      "parentId": 919,
      "districtList": [] }] },



  {
    "id": 925,
    "name": "淮安市",
    "parentId": 12,
    "districtList": [{
      "id": 926,
      "name": "淮安区",
      "parentId": 925,
      "districtList": [] },

    {
      "id": 929,
      "name": "洪泽县",
      "parentId": 925,
      "districtList": [] },

    {
      "id": 930,
      "name": "金湖县",
      "parentId": 925,
      "districtList": [] },

    {
      "id": 931,
      "name": "盱眙县",
      "parentId": 925,
      "districtList": [] },

    {
      "id": 4305,
      "name": "经济开发区",
      "parentId": 925,
      "districtList": [] },

    {
      "id": 36560,
      "name": "清河区",
      "parentId": 925,
      "districtList": [] },

    {
      "id": 36561,
      "name": "淮阴区",
      "parentId": 925,
      "districtList": [] },

    {
      "id": 36562,
      "name": "清浦区",
      "parentId": 925,
      "districtList": [] },

    {
      "id": 36563,
      "name": "涟水县",
      "parentId": 925,
      "districtList": [] },

    {
      "id": 53743,
      "name": "清江浦区",
      "parentId": 925,
      "districtList": [] }] },



  {
    "id": 933,
    "name": "宿迁市",
    "parentId": 12,
    "districtList": [{
      "id": 934,
      "name": "宿豫区",
      "parentId": 933,
      "districtList": [] },

    {
      "id": 937,
      "name": "泗洪县",
      "parentId": 933,
      "districtList": [] },

    {
      "id": 3407,
      "name": "宿城区",
      "parentId": 933,
      "districtList": [] },

    {
      "id": 8558,
      "name": "沭阳县",
      "parentId": 933,
      "districtList": [] },

    {
      "id": 8559,
      "name": "泗阳县",
      "parentId": 933,
      "districtList": [] },

    {
      "id": 40649,
      "name": "宿迁经济开发区",
      "parentId": 933,
      "districtList": [] }] },



  {
    "id": 939,
    "name": "盐城市",
    "parentId": 12,
    "districtList": [{
      "id": 940,
      "name": "东台市",
      "parentId": 939,
      "districtList": [] },

    {
      "id": 941,
      "name": "大丰区",
      "parentId": 939,
      "districtList": [] },

    {
      "id": 945,
      "name": "建湖县",
      "parentId": 939,
      "districtList": [] },

    {
      "id": 946,
      "name": "响水县",
      "parentId": 939,
      "districtList": [] },

    {
      "id": 948,
      "name": "阜宁县",
      "parentId": 939,
      "districtList": [] },

    {
      "id": 949,
      "name": "滨海县",
      "parentId": 939,
      "districtList": [] },

    {
      "id": 23681,
      "name": "射阳县",
      "parentId": 939,
      "districtList": [] },

    {
      "id": 23682,
      "name": "亭湖区",
      "parentId": 939,
      "districtList": [] },

    {
      "id": 23683,
      "name": "盐都区",
      "parentId": 939,
      "districtList": [] }] },



  {
    "id": 951,
    "name": "扬州市",
    "parentId": 12,
    "districtList": [{
      "id": 955,
      "name": "广陵区",
      "parentId": 951,
      "districtList": [] },

    {
      "id": 956,
      "name": "邗江区",
      "parentId": 951,
      "districtList": [] },

    {
      "id": 957,
      "name": "宝应县",
      "parentId": 951,
      "districtList": [] },

    {
      "id": 42218,
      "name": "仪征市",
      "parentId": 951,
      "districtList": [] },

    {
      "id": 42219,
      "name": "高邮市",
      "parentId": 951,
      "districtList": [] },

    {
      "id": 42220,
      "name": "江都区",
      "parentId": 951,
      "districtList": [] }] },



  {
    "id": 959,
    "name": "泰州市",
    "parentId": 12,
    "districtList": [{
      "id": 960,
      "name": "泰兴市",
      "parentId": 959,
      "districtList": [] },

    {
      "id": 962,
      "name": "靖江市",
      "parentId": 959,
      "districtList": [] },

    {
      "id": 963,
      "name": "兴化市",
      "parentId": 959,
      "districtList": [] },

    {
      "id": 3405,
      "name": "高港区",
      "parentId": 959,
      "districtList": [] },

    {
      "id": 3406,
      "name": "海陵区",
      "parentId": 959,
      "districtList": [] },

    {
      "id": 40174,
      "name": "姜堰区",
      "parentId": 959,
      "districtList": [] },

    {
      "id": 53766,
      "name": "泰州医药高新区",
      "parentId": 959,
      "districtList": [] }] },



  {
    "id": 965,
    "name": "南通市",
    "parentId": 12,
    "districtList": [{
      "id": 967,
      "name": "通州区",
      "parentId": 965,
      "districtList": [] },

    {
      "id": 970,
      "name": "如东县",
      "parentId": 965,
      "districtList": [] },

    {
      "id": 2774,
      "name": "海安县",
      "parentId": 965,
      "districtList": [] },

    {
      "id": 3394,
      "name": "港闸区",
      "parentId": 965,
      "districtList": [] },

    {
      "id": 3395,
      "name": "崇川区",
      "parentId": 965,
      "districtList": [] },

    {
      "id": 4385,
      "name": "南通经济技术开发区",
      "parentId": 965,
      "districtList": [] },

    {
      "id": 38364,
      "name": "如皋市",
      "parentId": 965,
      "districtList": [] },

    {
      "id": 38365,
      "name": "海门市",
      "parentId": 965,
      "districtList": [] },

    {
      "id": 38366,
      "name": "启东市",
      "parentId": 965,
      "districtList": [] }] },



  {
    "id": 972,
    "name": "镇江市",
    "parentId": 12,
    "districtList": [{
      "id": 973,
      "name": "扬中市",
      "parentId": 972,
      "districtList": [] },

    {
      "id": 976,
      "name": "丹徒区",
      "parentId": 972,
      "districtList": [] },

    {
      "id": 3403,
      "name": "润州区",
      "parentId": 972,
      "districtList": [] },

    {
      "id": 3404,
      "name": "京口区",
      "parentId": 972,
      "districtList": [] },

    {
      "id": 4916,
      "name": "镇江新区",
      "parentId": 972,
      "districtList": [] },

    {
      "id": 38517,
      "name": "丹阳市",
      "parentId": 972,
      "districtList": [] },

    {
      "id": 38518,
      "name": "句容市",
      "parentId": 972,
      "districtList": [] },

    {
      "id": 51180,
      "name": "丹徒新区",
      "parentId": 972,
      "districtList": [] }] },



  {
    "id": 978,
    "name": "常州市",
    "parentId": 12,
    "districtList": [{
      "id": 980,
      "name": "金坛区",
      "parentId": 978,
      "districtList": [] },

    {
      "id": 981,
      "name": "溧阳市",
      "parentId": 978,
      "districtList": [] },

    {
      "id": 2927,
      "name": "新北区",
      "parentId": 978,
      "districtList": [] },

    {
      "id": 3392,
      "name": "钟楼区",
      "parentId": 978,
      "districtList": [] },

    {
      "id": 3393,
      "name": "天宁区",
      "parentId": 978,
      "districtList": [] },

    {
      "id": 4459,
      "name": "武进区",
      "parentId": 978,
      "districtList": [] }] },



  {
    "id": 984,
    "name": "无锡市",
    "parentId": 12,
    "districtList": [{
      "id": 3381,
      "name": "崇安区",
      "parentId": 984,
      "districtList": [] },

    {
      "id": 3382,
      "name": "南长区",
      "parentId": 984,
      "districtList": [] },

    {
      "id": 3383,
      "name": "北塘区",
      "parentId": 984,
      "districtList": [] },

    {
      "id": 3384,
      "name": "锡山区",
      "parentId": 984,
      "districtList": [] },

    {
      "id": 3385,
      "name": "惠山区",
      "parentId": 984,
      "districtList": [] },

    {
      "id": 4029,
      "name": "新区",
      "parentId": 984,
      "districtList": [] },

    {
      "id": 13989,
      "name": "江阴市",
      "parentId": 984,
      "districtList": [] },

    {
      "id": 15943,
      "name": "宜兴市",
      "parentId": 984,
      "districtList": [] },

    {
      "id": 40035,
      "name": "滨湖区",
      "parentId": 984,
      "districtList": [] },

    {
      "id": 53561,
      "name": "新吴区",
      "parentId": 984,
      "districtList": [] },

    {
      "id": 53562,
      "name": "梁溪区",
      "parentId": 984,
      "districtList": [] }] },



  {
    "id": 988,
    "name": "苏州市",
    "parentId": 12,
    "districtList": [{
      "id": 993,
      "name": "常熟市",
      "parentId": 988,
      "districtList": [] },

    {
      "id": 994,
      "name": "张家港市",
      "parentId": 988,
      "districtList": [] },

    {
      "id": 3082,
      "name": "相城区",
      "parentId": 988,
      "districtList": [] },

    {
      "id": 3083,
      "name": "金阊区",
      "parentId": 988,
      "districtList": [] },

    {
      "id": 3085,
      "name": "虎丘区",
      "parentId": 988,
      "districtList": [] },

    {
      "id": 3087,
      "name": "平江区",
      "parentId": 988,
      "districtList": [] },

    {
      "id": 3088,
      "name": "沧浪区",
      "parentId": 988,
      "districtList": [] },

    {
      "id": 3444,
      "name": "工业园区",
      "parentId": 988,
      "districtList": [] },

    {
      "id": 3742,
      "name": "高新区",
      "parentId": 988,
      "districtList": [] },

    {
      "id": 4346,
      "name": "太仓市",
      "parentId": 988,
      "districtList": [] },

    {
      "id": 39628,
      "name": "吴江区",
      "parentId": 988,
      "districtList": [] },

    {
      "id": 40034,
      "name": "吴中区",
      "parentId": 988,
      "districtList": [] },

    {
      "id": 47821,
      "name": "昆山市",
      "parentId": 988,
      "districtList": [] },

    {
      "id": 53563,
      "name": "姑苏区",
      "parentId": 988,
      "districtList": [] }] }] },





{
  "id": 13,
  "name": "山东",
  "parentId": 0,
  "districtList": [{
    "id": 1000,
    "name": "济南市",
    "parentId": 13,
    "districtList": [{
      "id": 1002,
      "name": "长清区",
      "parentId": 1000,
      "districtList": [] },

    {
      "id": 1003,
      "name": "平阴县",
      "parentId": 1000,
      "districtList": [] },

    {
      "id": 1004,
      "name": "济阳县",
      "parentId": 1000,
      "districtList": [] },

    {
      "id": 1005,
      "name": "商河县",
      "parentId": 1000,
      "districtList": [] },

    {
      "id": 4277,
      "name": "高新区",
      "parentId": 1000,
      "districtList": [] },

    {
      "id": 40488,
      "name": "历城区",
      "parentId": 1000,
      "districtList": [] },

    {
      "id": 40489,
      "name": "天桥区",
      "parentId": 1000,
      "districtList": [] },

    {
      "id": 40490,
      "name": "槐荫区",
      "parentId": 1000,
      "districtList": [] },

    {
      "id": 40491,
      "name": "历下区",
      "parentId": 1000,
      "districtList": [] },

    {
      "id": 40492,
      "name": "市中区",
      "parentId": 1000,
      "districtList": [] },

    {
      "id": 40493,
      "name": "章丘市",
      "parentId": 1000,
      "districtList": [] }] },



  {
    "id": 1007,
    "name": "青岛市",
    "parentId": 13,
    "districtList": [{
      "id": 1014,
      "name": "莱西市",
      "parentId": 1007,
      "districtList": [] },

    {
      "id": 3519,
      "name": "四方区",
      "parentId": 1007,
      "districtList": [] },

    {
      "id": 3520,
      "name": "市北区",
      "parentId": 1007,
      "districtList": [] },

    {
      "id": 3521,
      "name": "市南区",
      "parentId": 1007,
      "districtList": [] },

    {
      "id": 4909,
      "name": "李沧区",
      "parentId": 1007,
      "districtList": [] },

    {
      "id": 5505,
      "name": "黄岛区",
      "parentId": 1007,
      "districtList": [] },

    {
      "id": 37916,
      "name": "即墨区",
      "parentId": 1007,
      "districtList": [] },

    {
      "id": 37917,
      "name": "城阳区",
      "parentId": 1007,
      "districtList": [] },

    {
      "id": 37918,
      "name": "崂山区",
      "parentId": 1007,
      "districtList": [] },

    {
      "id": 37919,
      "name": "胶州市",
      "parentId": 1007,
      "districtList": [] },

    {
      "id": 37920,
      "name": "平度市",
      "parentId": 1007,
      "districtList": [] }] },



  {
    "id": 1016,
    "name": "淄博市",
    "parentId": 13,
    "districtList": [{
      "id": 1019,
      "name": "高青县",
      "parentId": 1016,
      "districtList": [] },

    {
      "id": 1020,
      "name": "沂源县",
      "parentId": 1016,
      "districtList": [] },

    {
      "id": 1021,
      "name": "桓台县",
      "parentId": 1016,
      "districtList": [] },

    {
      "id": 2924,
      "name": "周村区",
      "parentId": 1016,
      "districtList": [] },

    {
      "id": 2962,
      "name": "淄川区",
      "parentId": 1016,
      "districtList": [] },

    {
      "id": 2968,
      "name": "博山区",
      "parentId": 1016,
      "districtList": [] },

    {
      "id": 2969,
      "name": "临淄区",
      "parentId": 1016,
      "districtList": [] },

    {
      "id": 47166,
      "name": "张店区",
      "parentId": 1016,
      "districtList": [] }] },



  {
    "id": 1022,
    "name": "枣庄市",
    "parentId": 13,
    "districtList": [{
      "id": 3522,
      "name": "山亭区",
      "parentId": 1022,
      "districtList": [] },

    {
      "id": 3523,
      "name": "台儿庄区",
      "parentId": 1022,
      "districtList": [] },

    {
      "id": 3524,
      "name": "峄城区",
      "parentId": 1022,
      "districtList": [] },

    {
      "id": 3525,
      "name": "薛城区",
      "parentId": 1022,
      "districtList": [] },

    {
      "id": 3526,
      "name": "市中区",
      "parentId": 1022,
      "districtList": [] },

    {
      "id": 28932,
      "name": "滕州市",
      "parentId": 1022,
      "districtList": [] }] },



  {
    "id": 1025,
    "name": "东营市",
    "parentId": 13,
    "districtList": [{
      "id": 1026,
      "name": "河口区",
      "parentId": 1025,
      "districtList": [] },

    {
      "id": 1027,
      "name": "广饶县",
      "parentId": 1025,
      "districtList": [] },

    {
      "id": 1028,
      "name": "利津县",
      "parentId": 1025,
      "districtList": [] },

    {
      "id": 1029,
      "name": "垦利区",
      "parentId": 1025,
      "districtList": [] },

    {
      "id": 36884,
      "name": "东营区",
      "parentId": 1025,
      "districtList": [] }] },



  {
    "id": 1032,
    "name": "潍坊市",
    "parentId": 13,
    "districtList": [{
      "id": 1033,
      "name": "青州市",
      "parentId": 1032,
      "districtList": [] },

    {
      "id": 1034,
      "name": "诸城市",
      "parentId": 1032,
      "districtList": [] },

    {
      "id": 1036,
      "name": "安丘市",
      "parentId": 1032,
      "districtList": [] },

    {
      "id": 1037,
      "name": "高密市",
      "parentId": 1032,
      "districtList": [] },

    {
      "id": 1038,
      "name": "昌邑市",
      "parentId": 1032,
      "districtList": [] },

    {
      "id": 1039,
      "name": "昌乐县",
      "parentId": 1032,
      "districtList": [] },

    {
      "id": 1041,
      "name": "临朐县",
      "parentId": 1032,
      "districtList": [] },

    {
      "id": 3530,
      "name": "坊子区",
      "parentId": 1032,
      "districtList": [] },

    {
      "id": 28921,
      "name": "潍城区",
      "parentId": 1032,
      "districtList": [] },

    {
      "id": 28922,
      "name": "奎文区",
      "parentId": 1032,
      "districtList": [] },

    {
      "id": 28923,
      "name": "高新区",
      "parentId": 1032,
      "districtList": [] },

    {
      "id": 28924,
      "name": "寒亭区",
      "parentId": 1032,
      "districtList": [] },

    {
      "id": 28925,
      "name": "寿光市",
      "parentId": 1032,
      "districtList": [] }] },



  {
    "id": 1042,
    "name": "烟台市",
    "parentId": 13,
    "districtList": [{
      "id": 1044,
      "name": "莱阳市",
      "parentId": 1042,
      "districtList": [] },

    {
      "id": 1047,
      "name": "招远市",
      "parentId": 1042,
      "districtList": [] },

    {
      "id": 1048,
      "name": "蓬莱市",
      "parentId": 1042,
      "districtList": [] },

    {
      "id": 1049,
      "name": "栖霞市",
      "parentId": 1042,
      "districtList": [] },

    {
      "id": 1050,
      "name": "海阳市",
      "parentId": 1042,
      "districtList": [] },

    {
      "id": 1051,
      "name": "长岛县",
      "parentId": 1042,
      "districtList": [] },

    {
      "id": 3126,
      "name": "芝罘区",
      "parentId": 1042,
      "districtList": [] },

    {
      "id": 3528,
      "name": "莱山区",
      "parentId": 1042,
      "districtList": [] },

    {
      "id": 46504,
      "name": "福山区",
      "parentId": 1042,
      "districtList": [] },

    {
      "id": 46505,
      "name": "牟平区",
      "parentId": 1042,
      "districtList": [] },

    {
      "id": 46506,
      "name": "龙口市",
      "parentId": 1042,
      "districtList": [] },

    {
      "id": 46507,
      "name": "莱州市",
      "parentId": 1042,
      "districtList": [] },

    {
      "id": 51029,
      "name": "开发区",
      "parentId": 1042,
      "districtList": [] }] },



  {
    "id": 1053,
    "name": "威海市",
    "parentId": 13,
    "districtList": [{
      "id": 1054,
      "name": "乳山市",
      "parentId": 1053,
      "districtList": [] },

    {
      "id": 28926,
      "name": "环翠区",
      "parentId": 1053,
      "districtList": [] },

    {
      "id": 28928,
      "name": "荣成市",
      "parentId": 1053,
      "districtList": [] },

    {
      "id": 28929,
      "name": "文登市",
      "parentId": 1053,
      "districtList": [] }] },



  {
    "id": 1058,
    "name": "莱芜市",
    "parentId": 13,
    "districtList": [{
      "id": 1059,
      "name": "莱城区",
      "parentId": 1058,
      "districtList": [] },

    {
      "id": 3539,
      "name": "钢城区",
      "parentId": 1058,
      "districtList": [] }] },



  {
    "id": 1060,
    "name": "德州市",
    "parentId": 13,
    "districtList": [{
      "id": 1061,
      "name": "乐陵市",
      "parentId": 1060,
      "districtList": [] },

    {
      "id": 1062,
      "name": "禹城市",
      "parentId": 1060,
      "districtList": [] },

    {
      "id": 1063,
      "name": "陵县",
      "parentId": 1060,
      "districtList": [] },

    {
      "id": 1064,
      "name": "宁津县",
      "parentId": 1060,
      "districtList": [] },

    {
      "id": 1066,
      "name": "武城县",
      "parentId": 1060,
      "districtList": [] },

    {
      "id": 1067,
      "name": "庆云县",
      "parentId": 1060,
      "districtList": [] },

    {
      "id": 1068,
      "name": "平原县",
      "parentId": 1060,
      "districtList": [] },

    {
      "id": 1069,
      "name": "临邑县",
      "parentId": 1060,
      "districtList": [] },

    {
      "id": 1071,
      "name": "夏津县",
      "parentId": 1060,
      "districtList": [] },

    {
      "id": 3542,
      "name": "德城区",
      "parentId": 1060,
      "districtList": [] },

    {
      "id": 25879,
      "name": "齐河县",
      "parentId": 1060,
      "districtList": [] }] },



  {
    "id": 1072,
    "name": "临沂市",
    "parentId": 13,
    "districtList": [{
      "id": 1073,
      "name": "沂南县",
      "parentId": 1072,
      "districtList": [] },

    {
      "id": 1074,
      "name": "沂水县",
      "parentId": 1072,
      "districtList": [] },

    {
      "id": 1076,
      "name": "费县",
      "parentId": 1072,
      "districtList": [] },

    {
      "id": 1077,
      "name": "平邑县",
      "parentId": 1072,
      "districtList": [] },

    {
      "id": 1078,
      "name": "蒙阴县",
      "parentId": 1072,
      "districtList": [] },

    {
      "id": 1079,
      "name": "临沭县",
      "parentId": 1072,
      "districtList": [] },

    {
      "id": 2926,
      "name": "莒南县",
      "parentId": 1072,
      "districtList": [] },

    {
      "id": 2974,
      "name": "郯城县",
      "parentId": 1072,
      "districtList": [] },

    {
      "id": 3540,
      "name": "罗庄区",
      "parentId": 1072,
      "districtList": [] },

    {
      "id": 28930,
      "name": "兰山区",
      "parentId": 1072,
      "districtList": [] },

    {
      "id": 28931,
      "name": "河东区",
      "parentId": 1072,
      "districtList": [] },

    {
      "id": 52023,
      "name": "兰陵县",
      "parentId": 1072,
      "districtList": [] }] },



  {
    "id": 1081,
    "name": "聊城市",
    "parentId": 13,
    "districtList": [{
      "id": 1082,
      "name": "临清市",
      "parentId": 1081,
      "districtList": [] },

    {
      "id": 1084,
      "name": "阳谷县",
      "parentId": 1081,
      "districtList": [] },

    {
      "id": 1085,
      "name": "茌平县",
      "parentId": 1081,
      "districtList": [] },

    {
      "id": 1086,
      "name": "莘县",
      "parentId": 1081,
      "districtList": [] },

    {
      "id": 1087,
      "name": "东阿县",
      "parentId": 1081,
      "districtList": [] },

    {
      "id": 1088,
      "name": "冠县",
      "parentId": 1081,
      "districtList": [] },

    {
      "id": 4043,
      "name": "高唐县",
      "parentId": 1081,
      "districtList": [] },

    {
      "id": 25880,
      "name": "东昌府区",
      "parentId": 1081,
      "districtList": [] }] },



  {
    "id": 1090,
    "name": "滨州市",
    "parentId": 13,
    "districtList": [{
      "id": 1092,
      "name": "邹平县",
      "parentId": 1090,
      "districtList": [] },

    {
      "id": 1093,
      "name": "沾化县",
      "parentId": 1090,
      "districtList": [] },

    {
      "id": 1094,
      "name": "惠民县",
      "parentId": 1090,
      "districtList": [] },

    {
      "id": 1095,
      "name": "博兴县",
      "parentId": 1090,
      "districtList": [] },

    {
      "id": 1096,
      "name": "阳信县",
      "parentId": 1090,
      "districtList": [] },

    {
      "id": 2772,
      "name": "无棣县",
      "parentId": 1090,
      "districtList": [] },

    {
      "id": 25877,
      "name": "北海新区",
      "parentId": 1090,
      "districtList": [] },

    {
      "id": 25878,
      "name": "滨城区",
      "parentId": 1090,
      "districtList": [] }] },



  {
    "id": 1099,
    "name": "菏泽市",
    "parentId": 13,
    "districtList": [{
      "id": 1101,
      "name": "单县",
      "parentId": 1099,
      "districtList": [] },

    {
      "id": 1102,
      "name": "曹县",
      "parentId": 1099,
      "districtList": [] },

    {
      "id": 1103,
      "name": "定陶县",
      "parentId": 1099,
      "districtList": [] },

    {
      "id": 1104,
      "name": "巨野县",
      "parentId": 1099,
      "districtList": [] },

    {
      "id": 1105,
      "name": "成武县",
      "parentId": 1099,
      "districtList": [] },

    {
      "id": 1106,
      "name": "东明县",
      "parentId": 1099,
      "districtList": [] },

    {
      "id": 1107,
      "name": "郓城县",
      "parentId": 1099,
      "districtList": [] },

    {
      "id": 2773,
      "name": "鄄城县",
      "parentId": 1099,
      "districtList": [] },

    {
      "id": 3543,
      "name": "牡丹区",
      "parentId": 1099,
      "districtList": [] }] },



  {
    "id": 1108,
    "name": "日照市",
    "parentId": 13,
    "districtList": [{
      "id": 2934,
      "name": "五莲县",
      "parentId": 1108,
      "districtList": [] },

    {
      "id": 3068,
      "name": "莒县",
      "parentId": 1108,
      "districtList": [] },

    {
      "id": 4113,
      "name": "岚山区",
      "parentId": 1108,
      "districtList": [] },

    {
      "id": 4196,
      "name": "新市区",
      "parentId": 1108,
      "districtList": [] },

    {
      "id": 28920,
      "name": "东港区",
      "parentId": 1108,
      "districtList": [] }] },



  {
    "id": 1112,
    "name": "泰安市",
    "parentId": 13,
    "districtList": [{
      "id": 3132,
      "name": "东平县",
      "parentId": 1112,
      "districtList": [] },

    {
      "id": 3535,
      "name": "宁阳县",
      "parentId": 1112,
      "districtList": [] },

    {
      "id": 46665,
      "name": "岱岳区",
      "parentId": 1112,
      "districtList": [] },

    {
      "id": 46666,
      "name": "泰山区",
      "parentId": 1112,
      "districtList": [] },

    {
      "id": 46667,
      "name": "肥城市",
      "parentId": 1112,
      "districtList": [] },

    {
      "id": 46668,
      "name": "新泰市",
      "parentId": 1112,
      "districtList": [] }] },



  {
    "id": 2900,
    "name": "济宁市",
    "parentId": 13,
    "districtList": [{
      "id": 2908,
      "name": "梁山县",
      "parentId": 2900,
      "districtList": [] },

    {
      "id": 2910,
      "name": "兖州市",
      "parentId": 2900,
      "districtList": [] },

    {
      "id": 2912,
      "name": "微山县",
      "parentId": 2900,
      "districtList": [] },

    {
      "id": 2913,
      "name": "汶上县",
      "parentId": 2900,
      "districtList": [] },

    {
      "id": 2914,
      "name": "泗水县",
      "parentId": 2900,
      "districtList": [] },

    {
      "id": 2915,
      "name": "嘉祥县",
      "parentId": 2900,
      "districtList": [] },

    {
      "id": 2916,
      "name": "鱼台县",
      "parentId": 2900,
      "districtList": [] },

    {
      "id": 2917,
      "name": "金乡县",
      "parentId": 2900,
      "districtList": [] },

    {
      "id": 3533,
      "name": "任城区",
      "parentId": 2900,
      "districtList": [] },

    {
      "id": 25713,
      "name": "邹城市",
      "parentId": 2900,
      "districtList": [] },

    {
      "id": 25714,
      "name": "市中区",
      "parentId": 2900,
      "districtList": [] },

    {
      "id": 25715,
      "name": "曲阜市",
      "parentId": 2900,
      "districtList": [] },

    {
      "id": 25728,
      "name": "高新区",
      "parentId": 2900,
      "districtList": [] }] }] },





{
  "id": 14,
  "name": "安徽",
  "parentId": 0,
  "districtList": [{
    "id": 1114,
    "name": "铜陵市",
    "parentId": 14,
    "districtList": [{
      "id": 19784,
      "name": "郊区",
      "parentId": 1114,
      "districtList": [] },

    {
      "id": 19786,
      "name": "义安区",
      "parentId": 1114,
      "districtList": [] },

    {
      "id": 52830,
      "name": "铜官区",
      "parentId": 1114,
      "districtList": [] },

    {
      "id": 52832,
      "name": "枞阳县",
      "parentId": 1114,
      "districtList": [] }] },



  {
    "id": 1116,
    "name": "合肥市",
    "parentId": 14,
    "districtList": [{
      "id": 1119,
      "name": "肥东县",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 1190,
      "name": "庐江县",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 3431,
      "name": "包河区",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 3432,
      "name": "蜀山区",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 3433,
      "name": "瑶海区",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 3434,
      "name": "庐阳区",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 4173,
      "name": "经济技术开发区",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 4192,
      "name": "高新技术开发区",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 6117,
      "name": "北城新区",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 6118,
      "name": "滨湖新区",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 6119,
      "name": "政务文化新区",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 6120,
      "name": "新站综合开发试验区",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 36173,
      "name": "肥西县",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 49709,
      "name": "巢湖市",
      "parentId": 1116,
      "districtList": [] },

    {
      "id": 49710,
      "name": "长丰县",
      "parentId": 1116,
      "districtList": [] }] },



  {
    "id": 1121,
    "name": "淮南市",
    "parentId": 14,
    "districtList": [{
      "id": 1122,
      "name": "凤台县",
      "parentId": 1121,
      "districtList": [] },

    {
      "id": 3447,
      "name": "田家庵区",
      "parentId": 1121,
      "districtList": [] },

    {
      "id": 3448,
      "name": "大通区",
      "parentId": 1121,
      "districtList": [] },

    {
      "id": 3449,
      "name": "谢家集区",
      "parentId": 1121,
      "districtList": [] },

    {
      "id": 3450,
      "name": "八公山区",
      "parentId": 1121,
      "districtList": [] },

    {
      "id": 3451,
      "name": "潘集区",
      "parentId": 1121,
      "districtList": [] },

    {
      "id": 4960,
      "name": "淮南高新技术开发区",
      "parentId": 1121,
      "districtList": [] },

    {
      "id": 52831,
      "name": "寿县",
      "parentId": 1121,
      "districtList": [] }] },



  {
    "id": 1124,
    "name": "淮北市",
    "parentId": 14,
    "districtList": [{
      "id": 19223,
      "name": "杜集区",
      "parentId": 1124,
      "districtList": [] },

    {
      "id": 19224,
      "name": "烈山区",
      "parentId": 1124,
      "districtList": [] },

    {
      "id": 19225,
      "name": "濉溪县",
      "parentId": 1124,
      "districtList": [] },

    {
      "id": 19226,
      "name": "相山区",
      "parentId": 1124,
      "districtList": [] }] },



  {
    "id": 1127,
    "name": "芜湖市",
    "parentId": 14,
    "districtList": [{
      "id": 1128,
      "name": "芜湖县",
      "parentId": 1127,
      "districtList": [] },

    {
      "id": 1129,
      "name": "繁昌县",
      "parentId": 1127,
      "districtList": [] },

    {
      "id": 1130,
      "name": "南陵县",
      "parentId": 1127,
      "districtList": [] },

    {
      "id": 1189,
      "name": "无为县",
      "parentId": 1127,
      "districtList": [] },

    {
      "id": 3438,
      "name": "镜湖区",
      "parentId": 1127,
      "districtList": [] },

    {
      "id": 4172,
      "name": "弋江区",
      "parentId": 1127,
      "districtList": [] },

    {
      "id": 49137,
      "name": "鸠江区",
      "parentId": 1127,
      "districtList": [] },

    {
      "id": 49138,
      "name": "三山区",
      "parentId": 1127,
      "districtList": [] }] },



  {
    "id": 1132,
    "name": "蚌埠市",
    "parentId": 14,
    "districtList": [{
      "id": 1133,
      "name": "怀远县",
      "parentId": 1132,
      "districtList": [] },

    {
      "id": 1134,
      "name": "固镇县",
      "parentId": 1132,
      "districtList": [] },

    {
      "id": 1135,
      "name": "五河县",
      "parentId": 1132,
      "districtList": [] },

    {
      "id": 3442,
      "name": "蚌山区",
      "parentId": 1132,
      "districtList": [] },

    {
      "id": 18549,
      "name": "淮上区",
      "parentId": 1132,
      "districtList": [] },

    {
      "id": 18550,
      "name": "龙子湖区",
      "parentId": 1132,
      "districtList": [] },

    {
      "id": 18551,
      "name": "禹会区",
      "parentId": 1132,
      "districtList": [] }] },



  {
    "id": 1137,
    "name": "马鞍山市",
    "parentId": 14,
    "districtList": [{
      "id": 1138,
      "name": "当涂县",
      "parentId": 1137,
      "districtList": [] },

    {
      "id": 1187,
      "name": "含山县",
      "parentId": 1137,
      "districtList": [] },

    {
      "id": 1188,
      "name": "和县",
      "parentId": 1137,
      "districtList": [] },

    {
      "id": 6963,
      "name": "博望区",
      "parentId": 1137,
      "districtList": [] },

    {
      "id": 49253,
      "name": "花山区",
      "parentId": 1137,
      "districtList": [] },

    {
      "id": 49254,
      "name": "雨山区",
      "parentId": 1137,
      "districtList": [] }] },



  {
    "id": 1140,
    "name": "安庆市",
    "parentId": 14,
    "districtList": [{
      "id": 1141,
      "name": "桐城市",
      "parentId": 1140,
      "districtList": [] },

    {
      "id": 1142,
      "name": "宿松县",
      "parentId": 1140,
      "districtList": [] },

    {
      "id": 1144,
      "name": "太湖县",
      "parentId": 1140,
      "districtList": [] },

    {
      "id": 1145,
      "name": "怀宁县",
      "parentId": 1140,
      "districtList": [] },

    {
      "id": 1146,
      "name": "岳西县",
      "parentId": 1140,
      "districtList": [] },

    {
      "id": 1147,
      "name": "望江县",
      "parentId": 1140,
      "districtList": [] },

    {
      "id": 1148,
      "name": "潜山县",
      "parentId": 1140,
      "districtList": [] },

    {
      "id": 18375,
      "name": "大观区",
      "parentId": 1140,
      "districtList": [] },

    {
      "id": 18376,
      "name": "宜秀区",
      "parentId": 1140,
      "districtList": [] },

    {
      "id": 18377,
      "name": "迎江区",
      "parentId": 1140,
      "districtList": [] }] },



  {
    "id": 1151,
    "name": "黄山市",
    "parentId": 14,
    "districtList": [{
      "id": 1153,
      "name": "休宁县",
      "parentId": 1151,
      "districtList": [] },

    {
      "id": 1154,
      "name": "歙县",
      "parentId": 1151,
      "districtList": [] },

    {
      "id": 1155,
      "name": "黟县",
      "parentId": 1151,
      "districtList": [] },

    {
      "id": 1156,
      "name": "祁门县",
      "parentId": 1151,
      "districtList": [] },

    {
      "id": 3464,
      "name": "黄山区",
      "parentId": 1151,
      "districtList": [] },

    {
      "id": 19227,
      "name": "徽州区",
      "parentId": 1151,
      "districtList": [] },

    {
      "id": 19228,
      "name": "屯溪区",
      "parentId": 1151,
      "districtList": [] }] },



  {
    "id": 1159,
    "name": "滁州市",
    "parentId": 14,
    "districtList": [{
      "id": 1161,
      "name": "明光市",
      "parentId": 1159,
      "districtList": [] },

    {
      "id": 1162,
      "name": "全椒县",
      "parentId": 1159,
      "districtList": [] },

    {
      "id": 1163,
      "name": "来安县",
      "parentId": 1159,
      "districtList": [] },

    {
      "id": 1164,
      "name": "定远县",
      "parentId": 1159,
      "districtList": [] },

    {
      "id": 1165,
      "name": "凤阳县",
      "parentId": 1159,
      "districtList": [] },

    {
      "id": 3467,
      "name": "南谯区",
      "parentId": 1159,
      "districtList": [] },

    {
      "id": 18715,
      "name": "琅琊区",
      "parentId": 1159,
      "districtList": [] },

    {
      "id": 18716,
      "name": "天长市",
      "parentId": 1159,
      "districtList": [] }] },



  {
    "id": 1167,
    "name": "阜阳市",
    "parentId": 14,
    "districtList": [{
      "id": 1168,
      "name": "界首市",
      "parentId": 1167,
      "districtList": [] },

    {
      "id": 1169,
      "name": "太和县",
      "parentId": 1167,
      "districtList": [] },

    {
      "id": 1170,
      "name": "阜南县",
      "parentId": 1167,
      "districtList": [] },

    {
      "id": 1171,
      "name": "颍上县",
      "parentId": 1167,
      "districtList": [] },

    {
      "id": 1172,
      "name": "临泉县",
      "parentId": 1167,
      "districtList": [] },

    {
      "id": 4832,
      "name": "经济开发区",
      "parentId": 1167,
      "districtList": [] },

    {
      "id": 19158,
      "name": "颍泉区",
      "parentId": 1167,
      "districtList": [] },

    {
      "id": 19159,
      "name": "颍州区",
      "parentId": 1167,
      "districtList": [] },

    {
      "id": 19160,
      "name": "颍东区",
      "parentId": 1167,
      "districtList": [] }] },



  {
    "id": 1174,
    "name": "亳州市",
    "parentId": 14,
    "districtList": [{
      "id": 1176,
      "name": "利辛县",
      "parentId": 1174,
      "districtList": [] },

    {
      "id": 1177,
      "name": "蒙城县",
      "parentId": 1174,
      "districtList": [] },

    {
      "id": 1178,
      "name": "涡阳县",
      "parentId": 1174,
      "districtList": [] },

    {
      "id": 18627,
      "name": "谯城区",
      "parentId": 1174,
      "districtList": [] }] },



  {
    "id": 1180,
    "name": "宿州市",
    "parentId": 14,
    "districtList": [{
      "id": 1181,
      "name": "灵璧县",
      "parentId": 1180,
      "districtList": [] },

    {
      "id": 1182,
      "name": "泗县",
      "parentId": 1180,
      "districtList": [] },

    {
      "id": 1183,
      "name": "萧县",
      "parentId": 1180,
      "districtList": [] },

    {
      "id": 1184,
      "name": "砀山县",
      "parentId": 1180,
      "districtList": [] },

    {
      "id": 6006,
      "name": "经济开发区",
      "parentId": 1180,
      "districtList": [] },

    {
      "id": 19575,
      "name": "埇桥区",
      "parentId": 1180,
      "districtList": [] }] },



  {
    "id": 1201,
    "name": "池州市",
    "parentId": 14,
    "districtList": [{
      "id": 1202,
      "name": "东至县",
      "parentId": 1201,
      "districtList": [] },

    {
      "id": 1203,
      "name": "石台县",
      "parentId": 1201,
      "districtList": [] },

    {
      "id": 1204,
      "name": "青阳县",
      "parentId": 1201,
      "districtList": [] },

    {
      "id": 18714,
      "name": "贵池区",
      "parentId": 1201,
      "districtList": [] }] },



  {
    "id": 1206,
    "name": "六安市",
    "parentId": 14,
    "districtList": [{
      "id": 1208,
      "name": "霍山县",
      "parentId": 1206,
      "districtList": [] },

    {
      "id": 1209,
      "name": "金寨县",
      "parentId": 1206,
      "districtList": [] },

    {
      "id": 1210,
      "name": "霍邱县",
      "parentId": 1206,
      "districtList": [] },

    {
      "id": 1211,
      "name": "舒城县",
      "parentId": 1206,
      "districtList": [] },

    {
      "id": 18912,
      "name": "金安区",
      "parentId": 1206,
      "districtList": [] },

    {
      "id": 18913,
      "name": "裕安区",
      "parentId": 1206,
      "districtList": [] },

    {
      "id": 53765,
      "name": "叶集区",
      "parentId": 1206,
      "districtList": [] }] },



  {
    "id": 2971,
    "name": "宣城市",
    "parentId": 14,
    "districtList": [{
      "id": 2972,
      "name": "泾县",
      "parentId": 2971,
      "districtList": [] },

    {
      "id": 3128,
      "name": "旌德县",
      "parentId": 2971,
      "districtList": [] },

    {
      "id": 3147,
      "name": "宁国市",
      "parentId": 2971,
      "districtList": [] },

    {
      "id": 3477,
      "name": "郎溪县",
      "parentId": 2971,
      "districtList": [] },

    {
      "id": 3478,
      "name": "广德县",
      "parentId": 2971,
      "districtList": [] },

    {
      "id": 3479,
      "name": "绩溪县",
      "parentId": 2971,
      "districtList": [] },

    {
      "id": 19684,
      "name": "宣州区",
      "parentId": 2971,
      "districtList": [] }] }] },





{
  "id": 15,
  "name": "浙江",
  "parentId": 0,
  "districtList": [{
    "id": 1158,
    "name": "宁波市",
    "parentId": 15,
    "districtList": [{
      "id": 1224,
      "name": "慈溪市",
      "parentId": 1158,
      "districtList": [] },

    {
      "id": 1226,
      "name": "奉化市",
      "parentId": 1158,
      "districtList": [] },

    {
      "id": 1227,
      "name": "宁海县",
      "parentId": 1158,
      "districtList": [] },

    {
      "id": 1228,
      "name": "象山县",
      "parentId": 1158,
      "districtList": [] },

    {
      "id": 3412,
      "name": "海曙区",
      "parentId": 1158,
      "districtList": [] },

    {
      "id": 3413,
      "name": "江东区",
      "parentId": 1158,
      "districtList": [] },

    {
      "id": 4253,
      "name": "高新科技开发区",
      "parentId": 1158,
      "districtList": [] },

    {
      "id": 46341,
      "name": "北仑区",
      "parentId": 1158,
      "districtList": [] },

    {
      "id": 46342,
      "name": "镇海区",
      "parentId": 1158,
      "districtList": [] },

    {
      "id": 46343,
      "name": "鄞州区",
      "parentId": 1158,
      "districtList": [] },

    {
      "id": 46344,
      "name": "江北区",
      "parentId": 1158,
      "districtList": [] },

    {
      "id": 46345,
      "name": "余姚市",
      "parentId": 1158,
      "districtList": [] }] },



  {
    "id": 1213,
    "name": "杭州市",
    "parentId": 15,
    "districtList": [{
      "id": 1214,
      "name": "余杭区",
      "parentId": 1213,
      "districtList": [] },

    {
      "id": 1215,
      "name": "萧山区",
      "parentId": 1213,
      "districtList": [] },

    {
      "id": 1217,
      "name": "富阳区",
      "parentId": 1213,
      "districtList": [] },

    {
      "id": 1218,
      "name": "桐庐县",
      "parentId": 1213,
      "districtList": [] },

    {
      "id": 1219,
      "name": "建德市",
      "parentId": 1213,
      "districtList": [] },

    {
      "id": 1220,
      "name": "淳安县",
      "parentId": 1213,
      "districtList": [] },

    {
      "id": 2963,
      "name": "江干区",
      "parentId": 1213,
      "districtList": [] },

    {
      "id": 3038,
      "name": "滨江区",
      "parentId": 1213,
      "districtList": [] },

    {
      "id": 3408,
      "name": "上城区",
      "parentId": 1213,
      "districtList": [] },

    {
      "id": 3409,
      "name": "下城区",
      "parentId": 1213,
      "districtList": [] },

    {
      "id": 3410,
      "name": "拱墅区",
      "parentId": 1213,
      "districtList": [] },

    {
      "id": 3411,
      "name": "西湖区",
      "parentId": 1213,
      "districtList": [] },

    {
      "id": 4285,
      "name": "下沙区",
      "parentId": 1213,
      "districtList": [] },

    {
      "id": 49711,
      "name": "临安市",
      "parentId": 1213,
      "districtList": [] }] },



  {
    "id": 1233,
    "name": "温州市",
    "parentId": 15,
    "districtList": [{
      "id": 1237,
      "name": "文成县",
      "parentId": 1233,
      "districtList": [] },

    {
      "id": 1238,
      "name": "平阳县",
      "parentId": 1233,
      "districtList": [] },

    {
      "id": 1239,
      "name": "泰顺县",
      "parentId": 1233,
      "districtList": [] },

    {
      "id": 1240,
      "name": "洞头区",
      "parentId": 1233,
      "districtList": [] },

    {
      "id": 1241,
      "name": "苍南县",
      "parentId": 1233,
      "districtList": [] },

    {
      "id": 3416,
      "name": "龙湾区",
      "parentId": 1233,
      "districtList": [] },

    {
      "id": 4342,
      "name": "茶山高教园区",
      "parentId": 1233,
      "districtList": [] },

    {
      "id": 42321,
      "name": "瑞安市",
      "parentId": 1233,
      "districtList": [] },

    {
      "id": 42322,
      "name": "乐清市",
      "parentId": 1233,
      "districtList": [] },

    {
      "id": 42323,
      "name": "鹿城区",
      "parentId": 1233,
      "districtList": [] },

    {
      "id": 42324,
      "name": "瓯海区",
      "parentId": 1233,
      "districtList": [] },

    {
      "id": 42325,
      "name": "永嘉县",
      "parentId": 1233,
      "districtList": [] }] },



  {
    "id": 1243,
    "name": "嘉兴市",
    "parentId": 15,
    "districtList": [{
      "id": 1244,
      "name": "海宁市",
      "parentId": 1243,
      "districtList": [] },

    {
      "id": 1248,
      "name": "海盐县",
      "parentId": 1243,
      "districtList": [] },

    {
      "id": 3418,
      "name": "南湖区",
      "parentId": 1243,
      "districtList": [] },

    {
      "id": 3419,
      "name": "秀洲区",
      "parentId": 1243,
      "districtList": [] },

    {
      "id": 4429,
      "name": "桐乡市",
      "parentId": 1243,
      "districtList": [] },

    {
      "id": 4430,
      "name": "平湖市",
      "parentId": 1243,
      "districtList": [] },

    {
      "id": 4431,
      "name": "嘉善县",
      "parentId": 1243,
      "districtList": [] }] },



  {
    "id": 1250,
    "name": "湖州市",
    "parentId": 15,
    "districtList": [{
      "id": 1251,
      "name": "长兴县",
      "parentId": 1250,
      "districtList": [] },

    {
      "id": 1252,
      "name": "德清县",
      "parentId": 1250,
      "districtList": [] },

    {
      "id": 1253,
      "name": "安吉县",
      "parentId": 1250,
      "districtList": [] },

    {
      "id": 4130,
      "name": "南浔区",
      "parentId": 1250,
      "districtList": [] },

    {
      "id": 44189,
      "name": "吴兴区",
      "parentId": 1250,
      "districtList": [] }] },



  {
    "id": 1255,
    "name": "绍兴市",
    "parentId": 15,
    "districtList": [{
      "id": 1257,
      "name": "诸暨市",
      "parentId": 1255,
      "districtList": [] },

    {
      "id": 1258,
      "name": "上虞区",
      "parentId": 1255,
      "districtList": [] },

    {
      "id": 1259,
      "name": "嵊州市",
      "parentId": 1255,
      "districtList": [] },

    {
      "id": 1260,
      "name": "新昌县",
      "parentId": 1255,
      "districtList": [] },

    {
      "id": 15944,
      "name": "柯桥区",
      "parentId": 1255,
      "districtList": [] },

    {
      "id": 44188,
      "name": "越城区",
      "parentId": 1255,
      "districtList": [] }] },



  {
    "id": 1262,
    "name": "金华市",
    "parentId": 15,
    "districtList": [{
      "id": 1263,
      "name": "金东区",
      "parentId": 1262,
      "districtList": [] },

    {
      "id": 1264,
      "name": "兰溪市",
      "parentId": 1262,
      "districtList": [] },

    {
      "id": 1265,
      "name": "婺城区",
      "parentId": 1262,
      "districtList": [] },

    {
      "id": 1266,
      "name": "义乌市",
      "parentId": 1262,
      "districtList": [] },

    {
      "id": 1267,
      "name": "东阳市",
      "parentId": 1262,
      "districtList": [] },

    {
      "id": 1268,
      "name": "永康市",
      "parentId": 1262,
      "districtList": [] },

    {
      "id": 1269,
      "name": "武义县",
      "parentId": 1262,
      "districtList": [] },

    {
      "id": 1270,
      "name": "浦江县",
      "parentId": 1262,
      "districtList": [] },

    {
      "id": 1271,
      "name": "磐安县",
      "parentId": 1262,
      "districtList": [] }] },



  {
    "id": 1273,
    "name": "衢州市",
    "parentId": 15,
    "districtList": [{
      "id": 1275,
      "name": "江山市",
      "parentId": 1273,
      "districtList": [] },

    {
      "id": 1276,
      "name": "常山县",
      "parentId": 1273,
      "districtList": [] },

    {
      "id": 1277,
      "name": "开化县",
      "parentId": 1273,
      "districtList": [] },

    {
      "id": 1278,
      "name": "龙游县",
      "parentId": 1273,
      "districtList": [] },

    {
      "id": 22044,
      "name": "柯城区",
      "parentId": 1273,
      "districtList": [] },

    {
      "id": 22045,
      "name": "衢江区",
      "parentId": 1273,
      "districtList": [] }] },



  {
    "id": 1280,
    "name": "丽水市",
    "parentId": 15,
    "districtList": [{
      "id": 1281,
      "name": "龙泉市",
      "parentId": 1280,
      "districtList": [] },

    {
      "id": 1282,
      "name": "缙云县",
      "parentId": 1280,
      "districtList": [] },

    {
      "id": 1283,
      "name": "遂昌县",
      "parentId": 1280,
      "districtList": [] },

    {
      "id": 1284,
      "name": "松阳县",
      "parentId": 1280,
      "districtList": [] },

    {
      "id": 1285,
      "name": "景宁县",
      "parentId": 1280,
      "districtList": [] },

    {
      "id": 1286,
      "name": "云和县",
      "parentId": 1280,
      "districtList": [] },

    {
      "id": 1288,
      "name": "青田县",
      "parentId": 1280,
      "districtList": [] },

    {
      "id": 3045,
      "name": "庆元县",
      "parentId": 1280,
      "districtList": [] },

    {
      "id": 22043,
      "name": "莲都区",
      "parentId": 1280,
      "districtList": [] }] },



  {
    "id": 1290,
    "name": "台州市",
    "parentId": 15,
    "districtList": [{
      "id": 1291,
      "name": "临海市",
      "parentId": 1290,
      "districtList": [] },

    {
      "id": 1294,
      "name": "三门县",
      "parentId": 1290,
      "districtList": [] },

    {
      "id": 1295,
      "name": "天台县",
      "parentId": 1290,
      "districtList": [] },

    {
      "id": 1296,
      "name": "仙居县",
      "parentId": 1290,
      "districtList": [] },

    {
      "id": 22046,
      "name": "黄岩区",
      "parentId": 1290,
      "districtList": [] },

    {
      "id": 22047,
      "name": "椒江区",
      "parentId": 1290,
      "districtList": [] },

    {
      "id": 22048,
      "name": "路桥区",
      "parentId": 1290,
      "districtList": [] },

    {
      "id": 22049,
      "name": "温岭市",
      "parentId": 1290,
      "districtList": [] },

    {
      "id": 22050,
      "name": "玉环县",
      "parentId": 1290,
      "districtList": [] }] },



  {
    "id": 1298,
    "name": "舟山市",
    "parentId": 15,
    "districtList": [{
      "id": 1300,
      "name": "岱山县",
      "parentId": 1298,
      "districtList": [] },

    {
      "id": 1301,
      "name": "嵊泗县",
      "parentId": 1298,
      "districtList": [] },

    {
      "id": 42565,
      "name": "普陀区",
      "parentId": 1298,
      "districtList": [] },

    {
      "id": 42566,
      "name": "定海区",
      "parentId": 1298,
      "districtList": [] }] }] },





{
  "id": 16,
  "name": "福建",
  "parentId": 0,
  "districtList": [{
    "id": 1303,
    "name": "福州市",
    "parentId": 16,
    "districtList": [{
      "id": 1305,
      "name": "长乐区",
      "parentId": 1303,
      "districtList": [] },

    {
      "id": 1308,
      "name": "平潭县",
      "parentId": 1303,
      "districtList": [] },

    {
      "id": 1309,
      "name": "连江县",
      "parentId": 1303,
      "districtList": [] },

    {
      "id": 1312,
      "name": "罗源县",
      "parentId": 1303,
      "districtList": [] },

    {
      "id": 1313,
      "name": "永泰县",
      "parentId": 1303,
      "districtList": [] },

    {
      "id": 1314,
      "name": "闽清县",
      "parentId": 1303,
      "districtList": [] },

    {
      "id": 3483,
      "name": "台江区",
      "parentId": 1303,
      "districtList": [] },

    {
      "id": 3484,
      "name": "鼓楼区",
      "parentId": 1303,
      "districtList": [] },

    {
      "id": 48712,
      "name": "晋安区",
      "parentId": 1303,
      "districtList": [] },

    {
      "id": 48713,
      "name": "仓山区",
      "parentId": 1303,
      "districtList": [] },

    {
      "id": 48714,
      "name": "马尾区",
      "parentId": 1303,
      "districtList": [] },

    {
      "id": 48715,
      "name": "福清市",
      "parentId": 1303,
      "districtList": [] },

    {
      "id": 48716,
      "name": "闽侯县",
      "parentId": 1303,
      "districtList": [] }] },



  {
    "id": 1315,
    "name": "厦门市",
    "parentId": 16,
    "districtList": [{
      "id": 1316,
      "name": "思明区",
      "parentId": 1315,
      "districtList": [] },

    {
      "id": 3486,
      "name": "湖里区",
      "parentId": 1315,
      "districtList": [] },

    {
      "id": 3489,
      "name": "翔安区",
      "parentId": 1315,
      "districtList": [] },

    {
      "id": 46763,
      "name": "海沧区",
      "parentId": 1315,
      "districtList": [] },

    {
      "id": 46764,
      "name": "集美区",
      "parentId": 1315,
      "districtList": [] },

    {
      "id": 46765,
      "name": "同安区",
      "parentId": 1315,
      "districtList": [] }] },



  {
    "id": 1317,
    "name": "三明市",
    "parentId": 16,
    "districtList": [{
      "id": 1319,
      "name": "永安市",
      "parentId": 1317,
      "districtList": [] },

    {
      "id": 1320,
      "name": "明溪县",
      "parentId": 1317,
      "districtList": [] },

    {
      "id": 1321,
      "name": "将乐县",
      "parentId": 1317,
      "districtList": [] },

    {
      "id": 1322,
      "name": "大田县",
      "parentId": 1317,
      "districtList": [] },

    {
      "id": 1323,
      "name": "宁化县",
      "parentId": 1317,
      "districtList": [] },

    {
      "id": 1324,
      "name": "建宁县",
      "parentId": 1317,
      "districtList": [] },

    {
      "id": 1325,
      "name": "沙县",
      "parentId": 1317,
      "districtList": [] },

    {
      "id": 1326,
      "name": "尤溪县",
      "parentId": 1317,
      "districtList": [] },

    {
      "id": 1327,
      "name": "清流县",
      "parentId": 1317,
      "districtList": [] },

    {
      "id": 1328,
      "name": "泰宁县",
      "parentId": 1317,
      "districtList": [] },

    {
      "id": 22463,
      "name": "梅列区",
      "parentId": 1317,
      "districtList": [] },

    {
      "id": 22464,
      "name": "三元区",
      "parentId": 1317,
      "districtList": [] }] },



  {
    "id": 1329,
    "name": "莆田市",
    "parentId": 16,
    "districtList": [{
      "id": 1331,
      "name": "仙游县",
      "parentId": 1329,
      "districtList": [] },

    {
      "id": 3022,
      "name": "涵江区",
      "parentId": 1329,
      "districtList": [] },

    {
      "id": 3492,
      "name": "秀屿区",
      "parentId": 1329,
      "districtList": [] },

    {
      "id": 46146,
      "name": "城厢区",
      "parentId": 1329,
      "districtList": [] },

    {
      "id": 46147,
      "name": "荔城区",
      "parentId": 1329,
      "districtList": [] }] },



  {
    "id": 1332,
    "name": "泉州市",
    "parentId": 16,
    "districtList": [{
      "id": 1334,
      "name": "石狮市",
      "parentId": 1332,
      "districtList": [] },

    {
      "id": 1336,
      "name": "南安市",
      "parentId": 1332,
      "districtList": [] },

    {
      "id": 1337,
      "name": "惠安县",
      "parentId": 1332,
      "districtList": [] },

    {
      "id": 1338,
      "name": "安溪县",
      "parentId": 1332,
      "districtList": [] },

    {
      "id": 1339,
      "name": "德化县",
      "parentId": 1332,
      "districtList": [] },

    {
      "id": 1340,
      "name": "永春县",
      "parentId": 1332,
      "districtList": [] },

    {
      "id": 3117,
      "name": "泉港区",
      "parentId": 1332,
      "districtList": [] },

    {
      "id": 3495,
      "name": "金门县",
      "parentId": 1332,
      "districtList": [] },

    {
      "id": 3498,
      "name": "洛江区",
      "parentId": 1332,
      "districtList": [] },

    {
      "id": 42930,
      "name": "鲤城区",
      "parentId": 1332,
      "districtList": [] },

    {
      "id": 42931,
      "name": "丰泽区",
      "parentId": 1332,
      "districtList": [] },

    {
      "id": 42932,
      "name": "晋江市",
      "parentId": 1332,
      "districtList": [] }] },



  {
    "id": 1341,
    "name": "漳州市",
    "parentId": 16,
    "districtList": [{
      "id": 1343,
      "name": "龙海市",
      "parentId": 1341,
      "districtList": [] },

    {
      "id": 1344,
      "name": "平和县",
      "parentId": 1341,
      "districtList": [] },

    {
      "id": 1345,
      "name": "南靖县",
      "parentId": 1341,
      "districtList": [] },

    {
      "id": 1346,
      "name": "诏安县",
      "parentId": 1341,
      "districtList": [] },

    {
      "id": 1347,
      "name": "漳浦县",
      "parentId": 1341,
      "districtList": [] },

    {
      "id": 1348,
      "name": "华安县",
      "parentId": 1341,
      "districtList": [] },

    {
      "id": 1349,
      "name": "云霄县",
      "parentId": 1341,
      "districtList": [] },

    {
      "id": 1350,
      "name": "东山县",
      "parentId": 1341,
      "districtList": [] },

    {
      "id": 1351,
      "name": "长泰县",
      "parentId": 1341,
      "districtList": [] },

    {
      "id": 3499,
      "name": "芗城区",
      "parentId": 1341,
      "districtList": [] },

    {
      "id": 3500,
      "name": "龙文区",
      "parentId": 1341,
      "districtList": [] }] },



  {
    "id": 1352,
    "name": "南平市",
    "parentId": 16,
    "districtList": [{
      "id": 1354,
      "name": "建瓯市",
      "parentId": 1352,
      "districtList": [] },

    {
      "id": 1355,
      "name": "邵武市",
      "parentId": 1352,
      "districtList": [] },

    {
      "id": 1356,
      "name": "武夷山市",
      "parentId": 1352,
      "districtList": [] },

    {
      "id": 1357,
      "name": "建阳市",
      "parentId": 1352,
      "districtList": [] },

    {
      "id": 1358,
      "name": "松溪县",
      "parentId": 1352,
      "districtList": [] },

    {
      "id": 1359,
      "name": "顺昌县",
      "parentId": 1352,
      "districtList": [] },

    {
      "id": 1360,
      "name": "浦城县",
      "parentId": 1352,
      "districtList": [] },

    {
      "id": 1361,
      "name": "政和县",
      "parentId": 1352,
      "districtList": [] },

    {
      "id": 2956,
      "name": "光泽县",
      "parentId": 1352,
      "districtList": [] },

    {
      "id": 22465,
      "name": "延平区",
      "parentId": 1352,
      "districtList": [] }] },



  {
    "id": 1362,
    "name": "龙岩市",
    "parentId": 16,
    "districtList": [{
      "id": 1364,
      "name": "漳平市",
      "parentId": 1362,
      "districtList": [] },

    {
      "id": 1365,
      "name": "长汀县",
      "parentId": 1362,
      "districtList": [] },

    {
      "id": 1366,
      "name": "武平县",
      "parentId": 1362,
      "districtList": [] },

    {
      "id": 1367,
      "name": "永定县",
      "parentId": 1362,
      "districtList": [] },

    {
      "id": 1368,
      "name": "上杭县",
      "parentId": 1362,
      "districtList": [] },

    {
      "id": 1369,
      "name": "连城县",
      "parentId": 1362,
      "districtList": [] },

    {
      "id": 44319,
      "name": "新罗区",
      "parentId": 1362,
      "districtList": [] }] },



  {
    "id": 1370,
    "name": "宁德市",
    "parentId": 16,
    "districtList": [{
      "id": 1372,
      "name": "福安市",
      "parentId": 1370,
      "districtList": [] },

    {
      "id": 1373,
      "name": "福鼎市",
      "parentId": 1370,
      "districtList": [] },

    {
      "id": 1374,
      "name": "寿宁县",
      "parentId": 1370,
      "districtList": [] },

    {
      "id": 1375,
      "name": "霞浦县",
      "parentId": 1370,
      "districtList": [] },

    {
      "id": 1376,
      "name": "柘荣县",
      "parentId": 1370,
      "districtList": [] },

    {
      "id": 1377,
      "name": "屏南县",
      "parentId": 1370,
      "districtList": [] },

    {
      "id": 1378,
      "name": "古田县",
      "parentId": 1370,
      "districtList": [] },

    {
      "id": 1379,
      "name": "周宁县",
      "parentId": 1370,
      "districtList": [] },

    {
      "id": 46145,
      "name": "蕉城区",
      "parentId": 1370,
      "districtList": [] },

    {
      "id": 46164,
      "name": "东侨开发区",
      "parentId": 1370,
      "districtList": [] }] }] },





{
  "id": 17,
  "name": "湖北",
  "parentId": 0,
  "districtList": [{
    "id": 1381,
    "name": "武汉市",
    "parentId": 17,
    "districtList": [{
      "id": 1386,
      "name": "江岸区",
      "parentId": 1381,
      "districtList": [] },

    {
      "id": 3079,
      "name": "武昌区",
      "parentId": 1381,
      "districtList": [] },

    {
      "id": 3582,
      "name": "江汉区",
      "parentId": 1381,
      "districtList": [] },

    {
      "id": 3583,
      "name": "硚口区",
      "parentId": 1381,
      "districtList": [] },

    {
      "id": 4424,
      "name": "武汉经济技术开发区",
      "parentId": 1381,
      "districtList": [] },

    {
      "id": 50712,
      "name": "蔡甸区",
      "parentId": 1381,
      "districtList": [] },

    {
      "id": 50713,
      "name": "江夏区",
      "parentId": 1381,
      "districtList": [] },

    {
      "id": 50714,
      "name": "新洲区",
      "parentId": 1381,
      "districtList": [] },

    {
      "id": 50715,
      "name": "黄陂区",
      "parentId": 1381,
      "districtList": [] },

    {
      "id": 50716,
      "name": "汉阳区",
      "parentId": 1381,
      "districtList": [] },

    {
      "id": 50717,
      "name": "青山区",
      "parentId": 1381,
      "districtList": [] },

    {
      "id": 50718,
      "name": "洪山区",
      "parentId": 1381,
      "districtList": [] },

    {
      "id": 50719,
      "name": "汉南区",
      "parentId": 1381,
      "districtList": [] },

    {
      "id": 50720,
      "name": "东西湖区",
      "parentId": 1381,
      "districtList": [] }] },



  {
    "id": 1387,
    "name": "黄石市",
    "parentId": 17,
    "districtList": [{
      "id": 1389,
      "name": "黄石港区",
      "parentId": 1387,
      "districtList": [] },

    {
      "id": 1392,
      "name": "铁山区",
      "parentId": 1387,
      "districtList": [] },

    {
      "id": 1393,
      "name": "大冶市",
      "parentId": 1387,
      "districtList": [] },

    {
      "id": 1394,
      "name": "阳新县",
      "parentId": 1387,
      "districtList": [] },

    {
      "id": 43272,
      "name": "下陆区",
      "parentId": 1387,
      "districtList": [] },

    {
      "id": 43273,
      "name": "西塞山区",
      "parentId": 1387,
      "districtList": [] },

    {
      "id": 43291,
      "name": "经济技术开发区",
      "parentId": 1387,
      "districtList": [] }] },



  {
    "id": 1396,
    "name": "襄阳市",
    "parentId": 17,
    "districtList": [{
      "id": 1397,
      "name": "老河口市",
      "parentId": 1396,
      "districtList": [] },

    {
      "id": 1398,
      "name": "枣阳市",
      "parentId": 1396,
      "districtList": [] },

    {
      "id": 1399,
      "name": "宜城市",
      "parentId": 1396,
      "districtList": [] },

    {
      "id": 1401,
      "name": "南漳县",
      "parentId": 1396,
      "districtList": [] },

    {
      "id": 1402,
      "name": "保康县",
      "parentId": 1396,
      "districtList": [] },

    {
      "id": 1403,
      "name": "谷城县",
      "parentId": 1396,
      "districtList": [] },

    {
      "id": 23282,
      "name": "樊城区",
      "parentId": 1396,
      "districtList": [] },

    {
      "id": 23283,
      "name": "襄城区",
      "parentId": 1396,
      "districtList": [] },

    {
      "id": 23284,
      "name": "襄州区",
      "parentId": 1396,
      "districtList": [] }] },



  {
    "id": 1405,
    "name": "十堰市",
    "parentId": 17,
    "districtList": [{
      "id": 1406,
      "name": "丹江口市",
      "parentId": 1405,
      "districtList": [] },

    {
      "id": 1407,
      "name": "房县",
      "parentId": 1405,
      "districtList": [] },

    {
      "id": 1408,
      "name": "竹山县",
      "parentId": 1405,
      "districtList": [] },

    {
      "id": 1409,
      "name": "竹溪县",
      "parentId": 1405,
      "districtList": [] },

    {
      "id": 1410,
      "name": "郧县",
      "parentId": 1405,
      "districtList": [] },

    {
      "id": 1411,
      "name": "郧西县",
      "parentId": 1405,
      "districtList": [] },

    {
      "id": 23429,
      "name": "茅箭区",
      "parentId": 1405,
      "districtList": [] },

    {
      "id": 23430,
      "name": "张湾区",
      "parentId": 1405,
      "districtList": [] }] },



  {
    "id": 1413,
    "name": "荆州市",
    "parentId": 17,
    "districtList": [{
      "id": 1414,
      "name": "江陵县",
      "parentId": 1413,
      "districtList": [] },

    {
      "id": 1415,
      "name": "洪湖市",
      "parentId": 1413,
      "districtList": [] },

    {
      "id": 1416,
      "name": "石首市",
      "parentId": 1413,
      "districtList": [] },

    {
      "id": 1417,
      "name": "松滋市",
      "parentId": 1413,
      "districtList": [] },

    {
      "id": 1418,
      "name": "监利县",
      "parentId": 1413,
      "districtList": [] },

    {
      "id": 1419,
      "name": "公安县",
      "parentId": 1413,
      "districtList": [] },

    {
      "id": 3593,
      "name": "沙市区",
      "parentId": 1413,
      "districtList": [] },

    {
      "id": 4078,
      "name": "荆州区",
      "parentId": 1413,
      "districtList": [] }] },



  {
    "id": 1421,
    "name": "宜昌市",
    "parentId": 17,
    "districtList": [{
      "id": 1423,
      "name": "当阳市",
      "parentId": 1421,
      "districtList": [] },

    {
      "id": 1424,
      "name": "枝江市",
      "parentId": 1421,
      "districtList": [] },

    {
      "id": 1425,
      "name": "夷陵区",
      "parentId": 1421,
      "districtList": [] },

    {
      "id": 1426,
      "name": "秭归县",
      "parentId": 1421,
      "districtList": [] },

    {
      "id": 1427,
      "name": "兴山县",
      "parentId": 1421,
      "districtList": [] },

    {
      "id": 1428,
      "name": "远安县",
      "parentId": 1421,
      "districtList": [] },

    {
      "id": 1429,
      "name": "五峰土家族自治县",
      "parentId": 1421,
      "districtList": [] },

    {
      "id": 1430,
      "name": "长阳土家族自治县",
      "parentId": 1421,
      "districtList": [] },

    {
      "id": 3594,
      "name": "宜都市",
      "parentId": 1421,
      "districtList": [] },

    {
      "id": 3595,
      "name": "猇亭区",
      "parentId": 1421,
      "districtList": [] },

    {
      "id": 3596,
      "name": "点军区",
      "parentId": 1421,
      "districtList": [] },

    {
      "id": 3597,
      "name": "伍家岗区",
      "parentId": 1421,
      "districtList": [] },

    {
      "id": 3598,
      "name": "西陵区",
      "parentId": 1421,
      "districtList": [] }] },



  {
    "id": 1432,
    "name": "孝感市",
    "parentId": 17,
    "districtList": [{
      "id": 1435,
      "name": "汉川市",
      "parentId": 1432,
      "districtList": [] },

    {
      "id": 1437,
      "name": "云梦县",
      "parentId": 1432,
      "districtList": [] },

    {
      "id": 1438,
      "name": "大悟县",
      "parentId": 1432,
      "districtList": [] },

    {
      "id": 1439,
      "name": "孝昌县",
      "parentId": 1432,
      "districtList": [] },

    {
      "id": 45215,
      "name": "孝南区",
      "parentId": 1432,
      "districtList": [] },

    {
      "id": 45216,
      "name": "应城市",
      "parentId": 1432,
      "districtList": [] },

    {
      "id": 45217,
      "name": "安陆市",
      "parentId": 1432,
      "districtList": [] }] },



  {
    "id": 1441,
    "name": "黄冈市",
    "parentId": 17,
    "districtList": [{
      "id": 1444,
      "name": "红安县",
      "parentId": 1441,
      "districtList": [] },

    {
      "id": 1445,
      "name": "罗田县",
      "parentId": 1441,
      "districtList": [] },

    {
      "id": 1447,
      "name": "黄梅县",
      "parentId": 1441,
      "districtList": [] },

    {
      "id": 1448,
      "name": "英山县",
      "parentId": 1441,
      "districtList": [] },

    {
      "id": 1449,
      "name": "团风县",
      "parentId": 1441,
      "districtList": [] },

    {
      "id": 41908,
      "name": "黄州区",
      "parentId": 1441,
      "districtList": [] },

    {
      "id": 41909,
      "name": "蕲春县",
      "parentId": 1441,
      "districtList": [] },

    {
      "id": 41910,
      "name": "麻城市",
      "parentId": 1441,
      "districtList": [] },

    {
      "id": 41911,
      "name": "武穴市",
      "parentId": 1441,
      "districtList": [] },

    {
      "id": 41912,
      "name": "浠水县",
      "parentId": 1441,
      "districtList": [] }] },



  {
    "id": 1458,
    "name": "咸宁市",
    "parentId": 17,
    "districtList": [{
      "id": 1461,
      "name": "嘉鱼县",
      "parentId": 1458,
      "districtList": [] },

    {
      "id": 1462,
      "name": "通山县",
      "parentId": 1458,
      "districtList": [] },

    {
      "id": 1463,
      "name": "崇阳县",
      "parentId": 1458,
      "districtList": [] },

    {
      "id": 1464,
      "name": "通城县",
      "parentId": 1458,
      "districtList": [] },

    {
      "id": 43387,
      "name": "咸安区",
      "parentId": 1458,
      "districtList": [] },

    {
      "id": 43388,
      "name": "赤壁市",
      "parentId": 1458,
      "districtList": [] }] },



  {
    "id": 1466,
    "name": "恩施州",
    "parentId": 17,
    "districtList": [{
      "id": 1467,
      "name": "恩施市",
      "parentId": 1466,
      "districtList": [] },

    {
      "id": 1468,
      "name": "利川市",
      "parentId": 1466,
      "districtList": [] },

    {
      "id": 1469,
      "name": "建始县",
      "parentId": 1466,
      "districtList": [] },

    {
      "id": 1470,
      "name": "来凤县",
      "parentId": 1466,
      "districtList": [] },

    {
      "id": 1471,
      "name": "巴东县",
      "parentId": 1466,
      "districtList": [] },

    {
      "id": 1472,
      "name": "鹤峰县",
      "parentId": 1466,
      "districtList": [] },

    {
      "id": 1473,
      "name": "宣恩县",
      "parentId": 1466,
      "districtList": [] },

    {
      "id": 1474,
      "name": "咸丰县",
      "parentId": 1466,
      "districtList": [] }] },



  {
    "id": 1475,
    "name": "鄂州市",
    "parentId": 17,
    "districtList": [{
      "id": 3601,
      "name": "梁子湖区",
      "parentId": 1475,
      "districtList": [] },

    {
      "id": 3602,
      "name": "华容区",
      "parentId": 1475,
      "districtList": [] },

    {
      "id": 41907,
      "name": "鄂城区",
      "parentId": 1475,
      "districtList": [] }] },



  {
    "id": 1477,
    "name": "荆门市",
    "parentId": 17,
    "districtList": [{
      "id": 1478,
      "name": "京山县",
      "parentId": 1477,
      "districtList": [] },

    {
      "id": 2973,
      "name": "钟祥市",
      "parentId": 1477,
      "districtList": [] },

    {
      "id": 3055,
      "name": "沙洋县",
      "parentId": 1477,
      "districtList": [] },

    {
      "id": 3599,
      "name": "掇刀区",
      "parentId": 1477,
      "districtList": [] },

    {
      "id": 3600,
      "name": "东宝区",
      "parentId": 1477,
      "districtList": [] }] },



  {
    "id": 1479,
    "name": "随州市",
    "parentId": 17,
    "districtList": [{
      "id": 3163,
      "name": "广水市",
      "parentId": 1479,
      "districtList": [] },

    {
      "id": 3164,
      "name": "曾都区",
      "parentId": 1479,
      "districtList": [] },

    {
      "id": 7357,
      "name": "随县",
      "parentId": 1479,
      "districtList": [] }] },



  {
    "id": 2922,
    "name": "潜江市",
    "parentId": 17,
    "districtList": [{
      "id": 23585,
      "name": "园林",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23586,
      "name": "杨市",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23587,
      "name": "周矶",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23588,
      "name": "广华",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23589,
      "name": "泰丰",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23590,
      "name": "竹根滩镇",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23591,
      "name": "高石碑镇",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23592,
      "name": "积玉口镇",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23593,
      "name": "渔洋镇",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23594,
      "name": "王场镇",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23595,
      "name": "熊口镇",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23596,
      "name": "老新镇",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23597,
      "name": "浩口镇",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23598,
      "name": "张金镇",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23599,
      "name": "龙湾镇",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23600,
      "name": "江汉石油管理局",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23601,
      "name": "潜江经济开发区",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23602,
      "name": "西大垸管理区",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23603,
      "name": "运粮湖管理区",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23604,
      "name": "周矶管理区",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23605,
      "name": "后湖管理区",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23606,
      "name": "熊口管理区",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23607,
      "name": "总口管理区",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23608,
      "name": "高场原种场",
      "parentId": 2922,
      "districtList": [] },

    {
      "id": 23609,
      "name": "浩口原种场",
      "parentId": 2922,
      "districtList": [] }] },



  {
    "id": 2980,
    "name": "天门市",
    "parentId": 17,
    "districtList": [{
      "id": 23618,
      "name": "侨乡街道开发区",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23619,
      "name": "竟陵街道",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23620,
      "name": "杨林街道",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23621,
      "name": "佛子山镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23622,
      "name": "多宝镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23623,
      "name": "拖市镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23624,
      "name": "张港镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23625,
      "name": "蒋场镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23626,
      "name": "汪场镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23627,
      "name": "渔薪镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23628,
      "name": "黄潭镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23629,
      "name": "岳口镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23630,
      "name": "横林镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23631,
      "name": "彭市镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23632,
      "name": "麻洋镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23633,
      "name": "多祥镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23634,
      "name": "干驿镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23635,
      "name": "马湾镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23636,
      "name": "卢市镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23637,
      "name": "小板镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23638,
      "name": "九真镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23639,
      "name": "皂市镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23640,
      "name": "胡市镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23641,
      "name": "石河镇",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23642,
      "name": "净潭乡",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23643,
      "name": "蒋湖农场",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23644,
      "name": "白茅湖农场",
      "parentId": 2980,
      "districtList": [] },

    {
      "id": 23645,
      "name": "沉湖管委会",
      "parentId": 2980,
      "districtList": [] }] },



  {
    "id": 2983,
    "name": "仙桃市",
    "parentId": 17,
    "districtList": [{
      "id": 23649,
      "name": "郑场镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23650,
      "name": "毛嘴镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23651,
      "name": "豆河镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23652,
      "name": "三伏潭镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23653,
      "name": "胡场镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23654,
      "name": "长埫口镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23655,
      "name": "西流河镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23656,
      "name": "沙湖镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23657,
      "name": "杨林尾镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23658,
      "name": "彭场镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23659,
      "name": "张沟镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23660,
      "name": "郭河镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23661,
      "name": "沔城镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23662,
      "name": "通海口镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23663,
      "name": "陈场镇",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23664,
      "name": "工业园区",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23665,
      "name": "九合垸原种场",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23666,
      "name": "沙湖原种场",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23667,
      "name": "排湖渔场",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23668,
      "name": "五湖渔场",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23669,
      "name": "赵西垸林场",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23670,
      "name": "刘家垸林场",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 23671,
      "name": "畜禽良种场",
      "parentId": 2983,
      "districtList": [] },

    {
      "id": 52306,
      "name": "城区",
      "parentId": 2983,
      "districtList": [] }] },



  {
    "id": 3154,
    "name": "神农架林区",
    "parentId": 17,
    "districtList": [{
      "id": 23610,
      "name": "松柏镇",
      "parentId": 3154,
      "districtList": [] },

    {
      "id": 23611,
      "name": "阳日镇",
      "parentId": 3154,
      "districtList": [] },

    {
      "id": 23612,
      "name": "木鱼镇",
      "parentId": 3154,
      "districtList": [] },

    {
      "id": 23613,
      "name": "红坪镇",
      "parentId": 3154,
      "districtList": [] },

    {
      "id": 23614,
      "name": "新华镇",
      "parentId": 3154,
      "districtList": [] },

    {
      "id": 23615,
      "name": "宋洛乡",
      "parentId": 3154,
      "districtList": [] },

    {
      "id": 23616,
      "name": "九湖乡",
      "parentId": 3154,
      "districtList": [] },

    {
      "id": 23617,
      "name": "下谷坪乡",
      "parentId": 3154,
      "districtList": [] }] }] },





{
  "id": 18,
  "name": "湖南",
  "parentId": 0,
  "districtList": [{
    "id": 1482,
    "name": "长沙市",
    "parentId": 18,
    "districtList": [{
      "id": 1485,
      "name": "望城区",
      "parentId": 1482,
      "districtList": [] },

    {
      "id": 3606,
      "name": "芙蓉区",
      "parentId": 1482,
      "districtList": [] },

    {
      "id": 48936,
      "name": "岳麓区",
      "parentId": 1482,
      "districtList": [] },

    {
      "id": 48937,
      "name": "雨花区",
      "parentId": 1482,
      "districtList": [] },

    {
      "id": 48938,
      "name": "开福区",
      "parentId": 1482,
      "districtList": [] },

    {
      "id": 48939,
      "name": "天心区",
      "parentId": 1482,
      "districtList": [] },

    {
      "id": 48941,
      "name": "浏阳市",
      "parentId": 1482,
      "districtList": [] },

    {
      "id": 48942,
      "name": "长沙县",
      "parentId": 1482,
      "districtList": [] },

    {
      "id": 48943,
      "name": "宁乡县",
      "parentId": 1482,
      "districtList": [] }] },



  {
    "id": 1488,
    "name": "株洲市",
    "parentId": 18,
    "districtList": [{
      "id": 1489,
      "name": "醴陵市",
      "parentId": 1488,
      "districtList": [] },

    {
      "id": 1490,
      "name": "株洲县",
      "parentId": 1488,
      "districtList": [] },

    {
      "id": 1491,
      "name": "攸县",
      "parentId": 1488,
      "districtList": [] },

    {
      "id": 1492,
      "name": "茶陵县",
      "parentId": 1488,
      "districtList": [] },

    {
      "id": 1493,
      "name": "炎陵县",
      "parentId": 1488,
      "districtList": [] },

    {
      "id": 29444,
      "name": "天元区",
      "parentId": 1488,
      "districtList": [] },

    {
      "id": 29445,
      "name": "石峰区",
      "parentId": 1488,
      "districtList": [] },

    {
      "id": 29446,
      "name": "芦淞区",
      "parentId": 1488,
      "districtList": [] },

    {
      "id": 29447,
      "name": "荷塘区",
      "parentId": 1488,
      "districtList": [] },

    {
      "id": 53693,
      "name": "云龙示范区",
      "parentId": 1488,
      "districtList": [] }] },



  {
    "id": 1495,
    "name": "湘潭市",
    "parentId": 18,
    "districtList": [{
      "id": 1496,
      "name": "湘乡市",
      "parentId": 1495,
      "districtList": [] },

    {
      "id": 1497,
      "name": "湘潭县",
      "parentId": 1495,
      "districtList": [] },

    {
      "id": 1498,
      "name": "韶山市",
      "parentId": 1495,
      "districtList": [] },

    {
      "id": 29448,
      "name": "雨湖区",
      "parentId": 1495,
      "districtList": [] },

    {
      "id": 29449,
      "name": "岳塘区",
      "parentId": 1495,
      "districtList": [] }] },



  {
    "id": 1501,
    "name": "衡阳市",
    "parentId": 18,
    "districtList": [{
      "id": 1502,
      "name": "常宁市",
      "parentId": 1501,
      "districtList": [] },

    {
      "id": 1503,
      "name": "衡阳县",
      "parentId": 1501,
      "districtList": [] },

    {
      "id": 1504,
      "name": "耒阳市",
      "parentId": 1501,
      "districtList": [] },

    {
      "id": 1505,
      "name": "衡东县",
      "parentId": 1501,
      "districtList": [] },

    {
      "id": 1506,
      "name": "衡南县",
      "parentId": 1501,
      "districtList": [] },

    {
      "id": 1507,
      "name": "衡山县",
      "parentId": 1501,
      "districtList": [] },

    {
      "id": 1508,
      "name": "祁东县",
      "parentId": 1501,
      "districtList": [] },

    {
      "id": 1509,
      "name": "南岳区",
      "parentId": 1501,
      "districtList": [] },

    {
      "id": 29450,
      "name": "蒸湘区",
      "parentId": 1501,
      "districtList": [] },

    {
      "id": 29451,
      "name": "石鼓区",
      "parentId": 1501,
      "districtList": [] },

    {
      "id": 29452,
      "name": "珠晖区",
      "parentId": 1501,
      "districtList": [] },

    {
      "id": 29453,
      "name": "雁峰区",
      "parentId": 1501,
      "districtList": [] }] },



  {
    "id": 1511,
    "name": "邵阳市",
    "parentId": 18,
    "districtList": [{
      "id": 1512,
      "name": "武冈市",
      "parentId": 1511,
      "districtList": [] },

    {
      "id": 1513,
      "name": "邵东县",
      "parentId": 1511,
      "districtList": [] },

    {
      "id": 1514,
      "name": "洞口县",
      "parentId": 1511,
      "districtList": [] },

    {
      "id": 1515,
      "name": "新邵县",
      "parentId": 1511,
      "districtList": [] },

    {
      "id": 1516,
      "name": "绥宁县",
      "parentId": 1511,
      "districtList": [] },

    {
      "id": 1517,
      "name": "新宁县",
      "parentId": 1511,
      "districtList": [] },

    {
      "id": 1518,
      "name": "邵阳县",
      "parentId": 1511,
      "districtList": [] },

    {
      "id": 1519,
      "name": "隆回县",
      "parentId": 1511,
      "districtList": [] },

    {
      "id": 1520,
      "name": "城步县",
      "parentId": 1511,
      "districtList": [] },

    {
      "id": 29457,
      "name": "大祥区",
      "parentId": 1511,
      "districtList": [] },

    {
      "id": 29458,
      "name": "双清区",
      "parentId": 1511,
      "districtList": [] },

    {
      "id": 29459,
      "name": "北塔区",
      "parentId": 1511,
      "districtList": [] }] },



  {
    "id": 1522,
    "name": "岳阳市",
    "parentId": 18,
    "districtList": [{
      "id": 1523,
      "name": "临湘市",
      "parentId": 1522,
      "districtList": [] },

    {
      "id": 1524,
      "name": "汨罗市",
      "parentId": 1522,
      "districtList": [] },

    {
      "id": 1525,
      "name": "岳阳县",
      "parentId": 1522,
      "districtList": [] },

    {
      "id": 1526,
      "name": "湘阴县",
      "parentId": 1522,
      "districtList": [] },

    {
      "id": 1527,
      "name": "华容县",
      "parentId": 1522,
      "districtList": [] },

    {
      "id": 1528,
      "name": "平江县",
      "parentId": 1522,
      "districtList": [] },

    {
      "id": 3619,
      "name": "君山区",
      "parentId": 1522,
      "districtList": [] },

    {
      "id": 3620,
      "name": "云溪区",
      "parentId": 1522,
      "districtList": [] },

    {
      "id": 29460,
      "name": "岳阳楼区",
      "parentId": 1522,
      "districtList": [] }] },



  {
    "id": 1530,
    "name": "常德市",
    "parentId": 18,
    "districtList": [{
      "id": 1532,
      "name": "津市市",
      "parentId": 1530,
      "districtList": [] },

    {
      "id": 1533,
      "name": "澧县",
      "parentId": 1530,
      "districtList": [] },

    {
      "id": 1534,
      "name": "临澧县",
      "parentId": 1530,
      "districtList": [] },

    {
      "id": 1535,
      "name": "桃源县",
      "parentId": 1530,
      "districtList": [] },

    {
      "id": 1536,
      "name": "汉寿县",
      "parentId": 1530,
      "districtList": [] },

    {
      "id": 1537,
      "name": "石门县",
      "parentId": 1530,
      "districtList": [] },

    {
      "id": 1538,
      "name": "安乡县",
      "parentId": 1530,
      "districtList": [] },

    {
      "id": 29461,
      "name": "鼎城区",
      "parentId": 1530,
      "districtList": [] },

    {
      "id": 29462,
      "name": "武陵区",
      "parentId": 1530,
      "districtList": [] }] },



  {
    "id": 1540,
    "name": "张家界市",
    "parentId": 18,
    "districtList": [{
      "id": 1541,
      "name": "慈利县",
      "parentId": 1540,
      "districtList": [] },

    {
      "id": 1542,
      "name": "桑植县",
      "parentId": 1540,
      "districtList": [] },

    {
      "id": 1543,
      "name": "武陵源区",
      "parentId": 1540,
      "districtList": [] },

    {
      "id": 3622,
      "name": "永定区",
      "parentId": 1540,
      "districtList": [] }] },



  {
    "id": 1544,
    "name": "郴州市",
    "parentId": 18,
    "districtList": [{
      "id": 1545,
      "name": "资兴市",
      "parentId": 1544,
      "districtList": [] },

    {
      "id": 1546,
      "name": "宜章县",
      "parentId": 1544,
      "districtList": [] },

    {
      "id": 1547,
      "name": "安仁县",
      "parentId": 1544,
      "districtList": [] },

    {
      "id": 1548,
      "name": "汝城县",
      "parentId": 1544,
      "districtList": [] },

    {
      "id": 1549,
      "name": "嘉禾县",
      "parentId": 1544,
      "districtList": [] },

    {
      "id": 1550,
      "name": "临武县",
      "parentId": 1544,
      "districtList": [] },

    {
      "id": 1551,
      "name": "桂东县",
      "parentId": 1544,
      "districtList": [] },

    {
      "id": 1552,
      "name": "永兴县",
      "parentId": 1544,
      "districtList": [] },

    {
      "id": 1553,
      "name": "桂阳县",
      "parentId": 1544,
      "districtList": [] },

    {
      "id": 29465,
      "name": "北湖区",
      "parentId": 1544,
      "districtList": [] },

    {
      "id": 29466,
      "name": "苏仙区",
      "parentId": 1544,
      "districtList": [] }] },



  {
    "id": 1555,
    "name": "益阳市",
    "parentId": 18,
    "districtList": [{
      "id": 1556,
      "name": "南县",
      "parentId": 1555,
      "districtList": [] },

    {
      "id": 1557,
      "name": "桃江县",
      "parentId": 1555,
      "districtList": [] },

    {
      "id": 1558,
      "name": "安化县",
      "parentId": 1555,
      "districtList": [] },

    {
      "id": 1565,
      "name": "沅江市",
      "parentId": 1555,
      "districtList": [] },

    {
      "id": 29463,
      "name": "赫山区",
      "parentId": 1555,
      "districtList": [] },

    {
      "id": 29464,
      "name": "资阳区",
      "parentId": 1555,
      "districtList": [] }] },



  {
    "id": 1560,
    "name": "永州市",
    "parentId": 18,
    "districtList": [{
      "id": 1563,
      "name": "祁阳县",
      "parentId": 1560,
      "districtList": [] },

    {
      "id": 1564,
      "name": "双牌县",
      "parentId": 1560,
      "districtList": [] },

    {
      "id": 1566,
      "name": "道县",
      "parentId": 1560,
      "districtList": [] },

    {
      "id": 1567,
      "name": "江永县",
      "parentId": 1560,
      "districtList": [] },

    {
      "id": 1568,
      "name": "江华县",
      "parentId": 1560,
      "districtList": [] },

    {
      "id": 1569,
      "name": "宁远县",
      "parentId": 1560,
      "districtList": [] },

    {
      "id": 1570,
      "name": "新田县",
      "parentId": 1560,
      "districtList": [] },

    {
      "id": 1571,
      "name": "蓝山县",
      "parentId": 1560,
      "districtList": [] },

    {
      "id": 1572,
      "name": "东安县",
      "parentId": 1560,
      "districtList": [] },

    {
      "id": 1573,
      "name": "零陵区",
      "parentId": 1560,
      "districtList": [] },

    {
      "id": 29454,
      "name": "冷水滩区",
      "parentId": 1560,
      "districtList": [] }] },



  {
    "id": 1574,
    "name": "怀化市",
    "parentId": 18,
    "districtList": [{
      "id": 1575,
      "name": "洪江市",
      "parentId": 1574,
      "districtList": [] },

    {
      "id": 1576,
      "name": "会同县",
      "parentId": 1574,
      "districtList": [] },

    {
      "id": 1578,
      "name": "溆浦县",
      "parentId": 1574,
      "districtList": [] },

    {
      "id": 1579,
      "name": "辰溪县",
      "parentId": 1574,
      "districtList": [] },

    {
      "id": 1580,
      "name": "靖州县",
      "parentId": 1574,
      "districtList": [] },

    {
      "id": 1581,
      "name": "通道县",
      "parentId": 1574,
      "districtList": [] },

    {
      "id": 1582,
      "name": "芷江县",
      "parentId": 1574,
      "districtList": [] },

    {
      "id": 1583,
      "name": "新晃县",
      "parentId": 1574,
      "districtList": [] },

    {
      "id": 1584,
      "name": "麻阳县",
      "parentId": 1574,
      "districtList": [] },

    {
      "id": 3070,
      "name": "沅陵县",
      "parentId": 1574,
      "districtList": [] },

    {
      "id": 3626,
      "name": "中方县",
      "parentId": 1574,
      "districtList": [] },

    {
      "id": 29455,
      "name": "鹤城区",
      "parentId": 1574,
      "districtList": [] }] },



  {
    "id": 1586,
    "name": "娄底市",
    "parentId": 18,
    "districtList": [{
      "id": 1588,
      "name": "冷水江市",
      "parentId": 1586,
      "districtList": [] },

    {
      "id": 1589,
      "name": "涟源市",
      "parentId": 1586,
      "districtList": [] },

    {
      "id": 1590,
      "name": "新化县",
      "parentId": 1586,
      "districtList": [] },

    {
      "id": 1591,
      "name": "双峰县",
      "parentId": 1586,
      "districtList": [] },

    {
      "id": 29456,
      "name": "娄星区",
      "parentId": 1586,
      "districtList": [] }] },



  {
    "id": 1592,
    "name": "湘西州",
    "parentId": 18,
    "districtList": [{
      "id": 1593,
      "name": "吉首市",
      "parentId": 1592,
      "districtList": [] },

    {
      "id": 1594,
      "name": "古丈县",
      "parentId": 1592,
      "districtList": [] },

    {
      "id": 1595,
      "name": "龙山县",
      "parentId": 1592,
      "districtList": [] },

    {
      "id": 1596,
      "name": "永顺县",
      "parentId": 1592,
      "districtList": [] },

    {
      "id": 1597,
      "name": "泸溪县",
      "parentId": 1592,
      "districtList": [] },

    {
      "id": 1598,
      "name": "凤凰县",
      "parentId": 1592,
      "districtList": [] },

    {
      "id": 1599,
      "name": "花垣县",
      "parentId": 1592,
      "districtList": [] },

    {
      "id": 1600,
      "name": "保靖县",
      "parentId": 1592,
      "districtList": [] }] }] },





{
  "id": 19,
  "name": "广东",
  "parentId": 0,
  "districtList": [{
    "id": 1601,
    "name": "广州市",
    "parentId": 19,
    "districtList": [{
      "id": 3633,
      "name": "天河区",
      "parentId": 1601,
      "districtList": [] },

    {
      "id": 3634,
      "name": "海珠区",
      "parentId": 1601,
      "districtList": [] },

    {
      "id": 3635,
      "name": "荔湾区",
      "parentId": 1601,
      "districtList": [] },

    {
      "id": 3637,
      "name": "越秀区",
      "parentId": 1601,
      "districtList": [] },

    {
      "id": 36953,
      "name": "番禺区",
      "parentId": 1601,
      "districtList": [] },

    {
      "id": 50256,
      "name": "花都区",
      "parentId": 1601,
      "districtList": [] },

    {
      "id": 50258,
      "name": "白云区",
      "parentId": 1601,
      "districtList": [] },

    {
      "id": 50259,
      "name": "南沙区",
      "parentId": 1601,
      "districtList": [] },

    {
      "id": 50283,
      "name": "黄埔区",
      "parentId": 1601,
      "districtList": [] },

    {
      "id": 50284,
      "name": "增城区",
      "parentId": 1601,
      "districtList": [] },

    {
      "id": 50285,
      "name": "从化区",
      "parentId": 1601,
      "districtList": [] },

    {
      "id": 51091,
      "name": "广州大学城",
      "parentId": 1601,
      "districtList": [] }] },



  {
    "id": 1607,
    "name": "深圳市",
    "parentId": 19,
    "districtList": [{
      "id": 3155,
      "name": "南山区",
      "parentId": 1607,
      "districtList": [] },

    {
      "id": 3638,
      "name": "罗湖区",
      "parentId": 1607,
      "districtList": [] },

    {
      "id": 3639,
      "name": "福田区",
      "parentId": 1607,
      "districtList": [] },

    {
      "id": 4773,
      "name": "宝安区",
      "parentId": 1607,
      "districtList": [] },

    {
      "id": 6675,
      "name": "光明新区",
      "parentId": 1607,
      "districtList": [] },

    {
      "id": 6736,
      "name": "坪山新区",
      "parentId": 1607,
      "districtList": [] },

    {
      "id": 6737,
      "name": "大鹏新区",
      "parentId": 1607,
      "districtList": [] },

    {
      "id": 40152,
      "name": "龙岗区",
      "parentId": 1607,
      "districtList": [] },

    {
      "id": 47387,
      "name": "盐田区",
      "parentId": 1607,
      "districtList": [] },

    {
      "id": 47388,
      "name": "龙华区",
      "parentId": 1607,
      "districtList": [] }] },



  {
    "id": 1609,
    "name": "珠海市",
    "parentId": 19,
    "districtList": [{
      "id": 41653,
      "name": "斗门区",
      "parentId": 1609,
      "districtList": [] },

    {
      "id": 41654,
      "name": "金湾区",
      "parentId": 1609,
      "districtList": [] },

    {
      "id": 41655,
      "name": "香洲区",
      "parentId": 1609,
      "districtList": [] }] },



  {
    "id": 1611,
    "name": "汕头市",
    "parentId": 19,
    "districtList": [{
      "id": 1614,
      "name": "南澳县",
      "parentId": 1611,
      "districtList": [] },

    {
      "id": 19916,
      "name": "龙湖区",
      "parentId": 1611,
      "districtList": [] },

    {
      "id": 19917,
      "name": "金平区",
      "parentId": 1611,
      "districtList": [] },

    {
      "id": 19918,
      "name": "澄海区",
      "parentId": 1611,
      "districtList": [] },

    {
      "id": 19919,
      "name": "潮阳区",
      "parentId": 1611,
      "districtList": [] },

    {
      "id": 19920,
      "name": "潮南区",
      "parentId": 1611,
      "districtList": [] },

    {
      "id": 19921,
      "name": "濠江区",
      "parentId": 1611,
      "districtList": [] }] },



  {
    "id": 1617,
    "name": "韶关市",
    "parentId": 19,
    "districtList": [{
      "id": 1618,
      "name": "南雄市",
      "parentId": 1617,
      "districtList": [] },

    {
      "id": 1619,
      "name": "乐昌市",
      "parentId": 1617,
      "districtList": [] },

    {
      "id": 1620,
      "name": "仁化县",
      "parentId": 1617,
      "districtList": [] },

    {
      "id": 1621,
      "name": "始兴县",
      "parentId": 1617,
      "districtList": [] },

    {
      "id": 1622,
      "name": "翁源县",
      "parentId": 1617,
      "districtList": [] },

    {
      "id": 1624,
      "name": "新丰县",
      "parentId": 1617,
      "districtList": [] },

    {
      "id": 1625,
      "name": "乳源瑶族自治县",
      "parentId": 1617,
      "districtList": [] },

    {
      "id": 1626,
      "name": "曲江区",
      "parentId": 1617,
      "districtList": [] },

    {
      "id": 3643,
      "name": "武江区",
      "parentId": 1617,
      "districtList": [] },

    {
      "id": 3644,
      "name": "浈江区",
      "parentId": 1617,
      "districtList": [] }] },



  {
    "id": 1627,
    "name": "河源市",
    "parentId": 19,
    "districtList": [{
      "id": 1628,
      "name": "和平县",
      "parentId": 1627,
      "districtList": [] },

    {
      "id": 1629,
      "name": "龙川县",
      "parentId": 1627,
      "districtList": [] },

    {
      "id": 1630,
      "name": "紫金县",
      "parentId": 1627,
      "districtList": [] },

    {
      "id": 1631,
      "name": "连平县",
      "parentId": 1627,
      "districtList": [] },

    {
      "id": 37864,
      "name": "源城区",
      "parentId": 1627,
      "districtList": [] },

    {
      "id": 37865,
      "name": "东源县",
      "parentId": 1627,
      "districtList": [] }] },



  {
    "id": 1634,
    "name": "梅州市",
    "parentId": 19,
    "districtList": [{
      "id": 1635,
      "name": "兴宁市",
      "parentId": 1634,
      "districtList": [] },

    {
      "id": 1636,
      "name": "梅县",
      "parentId": 1634,
      "districtList": [] },

    {
      "id": 1637,
      "name": "蕉岭县",
      "parentId": 1634,
      "districtList": [] },

    {
      "id": 1638,
      "name": "大埔县",
      "parentId": 1634,
      "districtList": [] },

    {
      "id": 1639,
      "name": "丰顺县",
      "parentId": 1634,
      "districtList": [] },

    {
      "id": 1640,
      "name": "五华县",
      "parentId": 1634,
      "districtList": [] },

    {
      "id": 1641,
      "name": "平远县",
      "parentId": 1634,
      "districtList": [] },

    {
      "id": 1642,
      "name": "梅江区",
      "parentId": 1634,
      "districtList": [] }] },



  {
    "id": 1643,
    "name": "惠州市",
    "parentId": 19,
    "districtList": [{
      "id": 1647,
      "name": "龙门县",
      "parentId": 1643,
      "districtList": [] },

    {
      "id": 36174,
      "name": "惠阳区",
      "parentId": 1643,
      "districtList": [] },

    {
      "id": 36175,
      "name": "大亚湾区",
      "parentId": 1643,
      "districtList": [] },

    {
      "id": 36176,
      "name": "惠城区",
      "parentId": 1643,
      "districtList": [] },

    {
      "id": 36177,
      "name": "惠东县",
      "parentId": 1643,
      "districtList": [] },

    {
      "id": 36178,
      "name": "博罗县",
      "parentId": 1643,
      "districtList": [] }] },



  {
    "id": 1650,
    "name": "汕尾市",
    "parentId": 19,
    "districtList": [{
      "id": 1653,
      "name": "陆河县",
      "parentId": 1650,
      "districtList": [] },

    {
      "id": 3037,
      "name": "海丰县",
      "parentId": 1650,
      "districtList": [] },

    {
      "id": 20051,
      "name": "城区",
      "parentId": 1650,
      "districtList": [] },

    {
      "id": 20052,
      "name": "陆丰市",
      "parentId": 1650,
      "districtList": [] }] },



  {
    "id": 1655,
    "name": "东莞市",
    "parentId": 19,
    "districtList": [{
      "id": 2950,
      "name": "中堂镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 3041,
      "name": "东坑镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 3078,
      "name": "道滘镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 3097,
      "name": "沙田镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 3100,
      "name": "高埗镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 3102,
      "name": "石龙镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 3104,
      "name": "石排镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 3105,
      "name": "企石镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 3111,
      "name": "石碣镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 3116,
      "name": "洪梅镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 3120,
      "name": "麻涌镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 3134,
      "name": "桥头镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 3151,
      "name": "望牛墩镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 3171,
      "name": "茶山镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 4087,
      "name": "谢岗镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 4147,
      "name": "松山湖",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 4255,
      "name": "莞城区",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 4256,
      "name": "南城区",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 4760,
      "name": "长安镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 4866,
      "name": "寮步镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 4871,
      "name": "大岭山镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 4886,
      "name": "常平镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 4910,
      "name": "厚街镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 4911,
      "name": "万江区",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 4932,
      "name": "樟木头镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 4980,
      "name": "大朗镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 5457,
      "name": "塘厦镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 5473,
      "name": "凤岗镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 5869,
      "name": "清溪镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 5905,
      "name": "横沥镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 36102,
      "name": "东城区",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 39461,
      "name": "黄江镇",
      "parentId": 1655,
      "districtList": [] },

    {
      "id": 39462,
      "name": "虎门镇",
      "parentId": 1655,
      "districtList": [] }] },



  {
    "id": 1657,
    "name": "中山市",
    "parentId": 19,
    "districtList": [{
      "id": 2777,
      "name": "南朗镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 2902,
      "name": "小榄镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 2957,
      "name": "古镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 3001,
      "name": "坦洲镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 3007,
      "name": "黄圃镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 3016,
      "name": "三乡镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 3067,
      "name": "东凤镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 3112,
      "name": "横栏镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 3143,
      "name": "三角镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 3176,
      "name": "南头镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 3743,
      "name": "沙溪镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 4042,
      "name": "五桂山镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 4076,
      "name": "阜沙镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 4080,
      "name": "东升镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 4102,
      "name": "板芙镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 4127,
      "name": "神湾镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 4141,
      "name": "港口镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 4190,
      "name": "大涌镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 4852,
      "name": "火炬开发区",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 8540,
      "name": "民众镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 39653,
      "name": "沙朗镇",
      "parentId": 1657,
      "districtList": [] },

    {
      "id": 52093,
      "name": "城区",
      "parentId": 1657,
      "districtList": [] }] },



  {
    "id": 1659,
    "name": "江门市",
    "parentId": 19,
    "districtList": [{
      "id": 37258,
      "name": "台山市",
      "parentId": 1659,
      "districtList": [] },

    {
      "id": 37259,
      "name": "新会区",
      "parentId": 1659,
      "districtList": [] },

    {
      "id": 37260,
      "name": "鹤山市",
      "parentId": 1659,
      "districtList": [] },

    {
      "id": 37261,
      "name": "江海区",
      "parentId": 1659,
      "districtList": [] },

    {
      "id": 37262,
      "name": "蓬江区",
      "parentId": 1659,
      "districtList": [] },

    {
      "id": 37263,
      "name": "开平市",
      "parentId": 1659,
      "districtList": [] },

    {
      "id": 37264,
      "name": "恩平市",
      "parentId": 1659,
      "districtList": [] }] },



  {
    "id": 1666,
    "name": "佛山市",
    "parentId": 19,
    "districtList": [{
      "id": 1669,
      "name": "顺德区",
      "parentId": 1666,
      "districtList": [] },

    {
      "id": 36264,
      "name": "禅城区",
      "parentId": 1666,
      "districtList": [] },

    {
      "id": 36265,
      "name": "高明区",
      "parentId": 1666,
      "districtList": [] },

    {
      "id": 36266,
      "name": "三水区",
      "parentId": 1666,
      "districtList": [] },

    {
      "id": 36267,
      "name": "南海区",
      "parentId": 1666,
      "districtList": [] }] },



  {
    "id": 1672,
    "name": "阳江市",
    "parentId": 19,
    "districtList": [{
      "id": 1673,
      "name": "阳春市",
      "parentId": 1672,
      "districtList": [] },

    {
      "id": 1674,
      "name": "阳西县",
      "parentId": 1672,
      "districtList": [] },

    {
      "id": 19827,
      "name": "江城区",
      "parentId": 1672,
      "districtList": [] },

    {
      "id": 19828,
      "name": "阳东县",
      "parentId": 1672,
      "districtList": [] }] },



  {
    "id": 1677,
    "name": "湛江市",
    "parentId": 19,
    "districtList": [{
      "id": 1679,
      "name": "雷州市",
      "parentId": 1677,
      "districtList": [] },

    {
      "id": 1680,
      "name": "吴川市",
      "parentId": 1677,
      "districtList": [] },

    {
      "id": 1682,
      "name": "徐闻县",
      "parentId": 1677,
      "districtList": [] },

    {
      "id": 3646,
      "name": "坡头区",
      "parentId": 1677,
      "districtList": [] },

    {
      "id": 19377,
      "name": "赤坎区",
      "parentId": 1677,
      "districtList": [] },

    {
      "id": 19378,
      "name": "霞山区",
      "parentId": 1677,
      "districtList": [] },

    {
      "id": 19379,
      "name": "经济技术开发区",
      "parentId": 1677,
      "districtList": [] },

    {
      "id": 19380,
      "name": "麻章区",
      "parentId": 1677,
      "districtList": [] },

    {
      "id": 19381,
      "name": "遂溪县",
      "parentId": 1677,
      "districtList": [] },

    {
      "id": 19382,
      "name": "廉江市",
      "parentId": 1677,
      "districtList": [] }] },



  {
    "id": 1684,
    "name": "茂名市",
    "parentId": 19,
    "districtList": [{
      "id": 1687,
      "name": "信宜市",
      "parentId": 1684,
      "districtList": [] },

    {
      "id": 19465,
      "name": "茂南区",
      "parentId": 1684,
      "districtList": [] },

    {
      "id": 19466,
      "name": "电白区",
      "parentId": 1684,
      "districtList": [] },

    {
      "id": 19467,
      "name": "高州市",
      "parentId": 1684,
      "districtList": [] },

    {
      "id": 19468,
      "name": "化州市",
      "parentId": 1684,
      "districtList": [] }] },



  {
    "id": 1690,
    "name": "肇庆市",
    "parentId": 19,
    "districtList": [{
      "id": 1693,
      "name": "广宁县",
      "parentId": 1690,
      "districtList": [] },

    {
      "id": 1694,
      "name": "德庆县",
      "parentId": 1690,
      "districtList": [] },

    {
      "id": 1695,
      "name": "怀集县",
      "parentId": 1690,
      "districtList": [] },

    {
      "id": 1696,
      "name": "封开县",
      "parentId": 1690,
      "districtList": [] },

    {
      "id": 1697,
      "name": "鼎湖区",
      "parentId": 1690,
      "districtList": [] },

    {
      "id": 4781,
      "name": "端州区",
      "parentId": 1690,
      "districtList": [] },

    {
      "id": 39723,
      "name": "四会市",
      "parentId": 1690,
      "districtList": [] },

    {
      "id": 39725,
      "name": "高要市",
      "parentId": 1690,
      "districtList": [] }] },



  {
    "id": 1698,
    "name": "云浮市",
    "parentId": 19,
    "districtList": [{
      "id": 1700,
      "name": "云安县",
      "parentId": 1698,
      "districtList": [] },

    {
      "id": 1701,
      "name": "新兴县",
      "parentId": 1698,
      "districtList": [] },

    {
      "id": 1702,
      "name": "郁南县",
      "parentId": 1698,
      "districtList": [] },

    {
      "id": 19829,
      "name": "云城区",
      "parentId": 1698,
      "districtList": [] },

    {
      "id": 19830,
      "name": "罗定市",
      "parentId": 1698,
      "districtList": [] }] },



  {
    "id": 1704,
    "name": "清远市",
    "parentId": 19,
    "districtList": [{
      "id": 1795,
      "name": "连州市",
      "parentId": 1704,
      "districtList": [] },

    {
      "id": 1796,
      "name": "佛冈县",
      "parentId": 1704,
      "districtList": [] },

    {
      "id": 1797,
      "name": "阳山县",
      "parentId": 1704,
      "districtList": [] },

    {
      "id": 1798,
      "name": "清新区",
      "parentId": 1704,
      "districtList": [] },

    {
      "id": 1799,
      "name": "连山县",
      "parentId": 1704,
      "districtList": [] },

    {
      "id": 1800,
      "name": "连南县",
      "parentId": 1704,
      "districtList": [] },

    {
      "id": 37734,
      "name": "清城区",
      "parentId": 1704,
      "districtList": [] },

    {
      "id": 37735,
      "name": "英德市",
      "parentId": 1704,
      "districtList": [] }] },



  {
    "id": 1705,
    "name": "潮州市",
    "parentId": 19,
    "districtList": [{
      "id": 1707,
      "name": "饶平县",
      "parentId": 1705,
      "districtList": [] },

    {
      "id": 4238,
      "name": "枫溪区",
      "parentId": 1705,
      "districtList": [] },

    {
      "id": 19991,
      "name": "湘桥区",
      "parentId": 1705,
      "districtList": [] },

    {
      "id": 19992,
      "name": "潮安区",
      "parentId": 1705,
      "districtList": [] }] },



  {
    "id": 1709,
    "name": "揭阳市",
    "parentId": 19,
    "districtList": [{
      "id": 1712,
      "name": "揭西县",
      "parentId": 1709,
      "districtList": [] },

    {
      "id": 1713,
      "name": "惠来县",
      "parentId": 1709,
      "districtList": [] },

    {
      "id": 5484,
      "name": "东山区",
      "parentId": 1709,
      "districtList": [] },

    {
      "id": 5864,
      "name": "普宁市",
      "parentId": 1709,
      "districtList": [] },

    {
      "id": 20093,
      "name": "榕城区",
      "parentId": 1709,
      "districtList": [] },

    {
      "id": 20094,
      "name": "揭东县",
      "parentId": 1709,
      "districtList": [] }] }] },





{
  "id": 20,
  "name": "广西",
  "parentId": 0,
  "districtList": [{
    "id": 1715,
    "name": "南宁市",
    "parentId": 20,
    "districtList": [{
      "id": 1716,
      "name": "武鸣区",
      "parentId": 1715,
      "districtList": [] },

    {
      "id": 1724,
      "name": "邕宁区",
      "parentId": 1715,
      "districtList": [] },

    {
      "id": 3005,
      "name": "宾阳县",
      "parentId": 1715,
      "districtList": [] },

    {
      "id": 3650,
      "name": "横县",
      "parentId": 1715,
      "districtList": [] },

    {
      "id": 3651,
      "name": "上林县",
      "parentId": 1715,
      "districtList": [] },

    {
      "id": 3652,
      "name": "隆安县",
      "parentId": 1715,
      "districtList": [] },

    {
      "id": 3653,
      "name": "马山县",
      "parentId": 1715,
      "districtList": [] },

    {
      "id": 43114,
      "name": "良庆区",
      "parentId": 1715,
      "districtList": [] },

    {
      "id": 43115,
      "name": "江南区",
      "parentId": 1715,
      "districtList": [] },

    {
      "id": 43116,
      "name": "兴宁区",
      "parentId": 1715,
      "districtList": [] },

    {
      "id": 43117,
      "name": "青秀区",
      "parentId": 1715,
      "districtList": [] },

    {
      "id": 43118,
      "name": "西乡塘区",
      "parentId": 1715,
      "districtList": [] }] },



  {
    "id": 1720,
    "name": "柳州市",
    "parentId": 20,
    "districtList": [{
      "id": 1721,
      "name": "柳江县",
      "parentId": 1720,
      "districtList": [] },

    {
      "id": 1722,
      "name": "柳城县",
      "parentId": 1720,
      "districtList": [] },

    {
      "id": 1725,
      "name": "鹿寨县",
      "parentId": 1720,
      "districtList": [] },

    {
      "id": 3659,
      "name": "融安县",
      "parentId": 1720,
      "districtList": [] },

    {
      "id": 3660,
      "name": "三江县",
      "parentId": 1720,
      "districtList": [] },

    {
      "id": 3661,
      "name": "融水县",
      "parentId": 1720,
      "districtList": [] },

    {
      "id": 22906,
      "name": "鱼峰区",
      "parentId": 1720,
      "districtList": [] },

    {
      "id": 22907,
      "name": "城中区",
      "parentId": 1720,
      "districtList": [] },

    {
      "id": 22908,
      "name": "柳南区",
      "parentId": 1720,
      "districtList": [] },

    {
      "id": 22909,
      "name": "柳北区",
      "parentId": 1720,
      "districtList": [] }] },



  {
    "id": 1726,
    "name": "桂林市",
    "parentId": 20,
    "districtList": [{
      "id": 1727,
      "name": "阳朔县",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 1728,
      "name": "临桂县",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 1729,
      "name": "灵川县",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 1730,
      "name": "全州县",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 1731,
      "name": "平乐县",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 1732,
      "name": "兴安县",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 1733,
      "name": "灌阳县",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 1734,
      "name": "荔浦县",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 1735,
      "name": "资源县",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 1736,
      "name": "永福县",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 1738,
      "name": "龙胜县",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 3666,
      "name": "恭城县",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 3670,
      "name": "象山区",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 4457,
      "name": "雁山区",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 22883,
      "name": "秀峰区",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 22884,
      "name": "叠彩区",
      "parentId": 1726,
      "districtList": [] },

    {
      "id": 22885,
      "name": "七星区",
      "parentId": 1726,
      "districtList": [] }] },



  {
    "id": 1740,
    "name": "梧州市",
    "parentId": 20,
    "districtList": [{
      "id": 1741,
      "name": "岑溪市",
      "parentId": 1740,
      "districtList": [] },

    {
      "id": 1742,
      "name": "苍梧县",
      "parentId": 1740,
      "districtList": [] },

    {
      "id": 1743,
      "name": "藤县",
      "parentId": 1740,
      "districtList": [] },

    {
      "id": 1744,
      "name": "蒙山县",
      "parentId": 1740,
      "districtList": [] },

    {
      "id": 23037,
      "name": "万秀区",
      "parentId": 1740,
      "districtList": [] },

    {
      "id": 23038,
      "name": "蝶山区",
      "parentId": 1740,
      "districtList": [] },

    {
      "id": 23039,
      "name": "长洲区",
      "parentId": 1740,
      "districtList": [] },

    {
      "id": 53521,
      "name": "龙圩区",
      "parentId": 1740,
      "districtList": [] }] },



  {
    "id": 1746,
    "name": "北海市",
    "parentId": 20,
    "districtList": [{
      "id": 1747,
      "name": "合浦县",
      "parentId": 1746,
      "districtList": [] },

    {
      "id": 1748,
      "name": "铁山港区",
      "parentId": 1746,
      "districtList": [] },

    {
      "id": 22851,
      "name": "海城区",
      "parentId": 1746,
      "districtList": [] },

    {
      "id": 22852,
      "name": "银海区",
      "parentId": 1746,
      "districtList": [] }] },



  {
    "id": 1749,
    "name": "防城港市",
    "parentId": 20,
    "districtList": [{
      "id": 1750,
      "name": "东兴市",
      "parentId": 1749,
      "districtList": [] },

    {
      "id": 1751,
      "name": "上思县",
      "parentId": 1749,
      "districtList": [] },

    {
      "id": 25190,
      "name": "防城区",
      "parentId": 1749,
      "districtList": [] },

    {
      "id": 25191,
      "name": "港口区",
      "parentId": 1749,
      "districtList": [] }] },



  {
    "id": 1753,
    "name": "钦州市",
    "parentId": 20,
    "districtList": [{
      "id": 1754,
      "name": "浦北县",
      "parentId": 1753,
      "districtList": [] },

    {
      "id": 1755,
      "name": "灵山县",
      "parentId": 1753,
      "districtList": [] },

    {
      "id": 2999,
      "name": "钦北区",
      "parentId": 1753,
      "districtList": [] },

    {
      "id": 25189,
      "name": "钦南区",
      "parentId": 1753,
      "districtList": [] }] },



  {
    "id": 1757,
    "name": "贵港市",
    "parentId": 20,
    "districtList": [{
      "id": 1758,
      "name": "桂平市",
      "parentId": 1757,
      "districtList": [] },

    {
      "id": 1759,
      "name": "平南县",
      "parentId": 1757,
      "districtList": [] },

    {
      "id": 1760,
      "name": "覃塘区",
      "parentId": 1757,
      "districtList": [] },

    {
      "id": 25192,
      "name": "港南区",
      "parentId": 1757,
      "districtList": [] },

    {
      "id": 25193,
      "name": "港北区",
      "parentId": 1757,
      "districtList": [] }] },



  {
    "id": 1761,
    "name": "玉林市",
    "parentId": 20,
    "districtList": [{
      "id": 1762,
      "name": "北流市",
      "parentId": 1761,
      "districtList": [] },

    {
      "id": 1763,
      "name": "容县",
      "parentId": 1761,
      "districtList": [] },

    {
      "id": 1764,
      "name": "博白县",
      "parentId": 1761,
      "districtList": [] },

    {
      "id": 1765,
      "name": "陆川县",
      "parentId": 1761,
      "districtList": [] },

    {
      "id": 1766,
      "name": "兴业县",
      "parentId": 1761,
      "districtList": [] },

    {
      "id": 25188,
      "name": "玉州区",
      "parentId": 1761,
      "districtList": [] },

    {
      "id": 53764,
      "name": "福绵区",
      "parentId": 1761,
      "districtList": [] }] },



  {
    "id": 1792,
    "name": "贺州市",
    "parentId": 20,
    "districtList": [{
      "id": 1803,
      "name": "钟山县",
      "parentId": 1792,
      "districtList": [] },

    {
      "id": 1804,
      "name": "昭平县",
      "parentId": 1792,
      "districtList": [] },

    {
      "id": 1805,
      "name": "富川县",
      "parentId": 1792,
      "districtList": [] },

    {
      "id": 22850,
      "name": "平桂管理区",
      "parentId": 1792,
      "districtList": [] },

    {
      "id": 23040,
      "name": "八步区",
      "parentId": 1792,
      "districtList": [] }] },



  {
    "id": 1806,
    "name": "百色市",
    "parentId": 20,
    "districtList": [{
      "id": 1807,
      "name": "右江区",
      "parentId": 1806,
      "districtList": [] },

    {
      "id": 1808,
      "name": "平果县",
      "parentId": 1806,
      "districtList": [] },

    {
      "id": 1809,
      "name": "乐业县",
      "parentId": 1806,
      "districtList": [] },

    {
      "id": 1810,
      "name": "田阳县",
      "parentId": 1806,
      "districtList": [] },

    {
      "id": 1811,
      "name": "西林县",
      "parentId": 1806,
      "districtList": [] },

    {
      "id": 1812,
      "name": "田林县",
      "parentId": 1806,
      "districtList": [] },

    {
      "id": 1813,
      "name": "德保县",
      "parentId": 1806,
      "districtList": [] },

    {
      "id": 1814,
      "name": "靖西县",
      "parentId": 1806,
      "districtList": [] },

    {
      "id": 1815,
      "name": "田东县",
      "parentId": 1806,
      "districtList": [] },

    {
      "id": 1816,
      "name": "那坡县",
      "parentId": 1806,
      "districtList": [] },

    {
      "id": 1817,
      "name": "隆林县",
      "parentId": 1806,
      "districtList": [] },

    {
      "id": 3678,
      "name": "凌云县",
      "parentId": 1806,
      "districtList": [] }] },



  {
    "id": 1818,
    "name": "河池市",
    "parentId": 20,
    "districtList": [{
      "id": 1820,
      "name": "宜州市",
      "parentId": 1818,
      "districtList": [] },

    {
      "id": 1821,
      "name": "天峨县",
      "parentId": 1818,
      "districtList": [] },

    {
      "id": 1822,
      "name": "凤山县",
      "parentId": 1818,
      "districtList": [] },

    {
      "id": 1823,
      "name": "南丹县",
      "parentId": 1818,
      "districtList": [] },

    {
      "id": 1824,
      "name": "东兰县",
      "parentId": 1818,
      "districtList": [] },

    {
      "id": 1825,
      "name": "巴马县",
      "parentId": 1818,
      "districtList": [] },

    {
      "id": 1826,
      "name": "环江县",
      "parentId": 1818,
      "districtList": [] },

    {
      "id": 2991,
      "name": "罗城县",
      "parentId": 1818,
      "districtList": [] },

    {
      "id": 3152,
      "name": "大化县",
      "parentId": 1818,
      "districtList": [] },

    {
      "id": 3679,
      "name": "都安县",
      "parentId": 1818,
      "districtList": [] },

    {
      "id": 3680,
      "name": "金城江区",
      "parentId": 1818,
      "districtList": [] }] },



  {
    "id": 3044,
    "name": "来宾市",
    "parentId": 20,
    "districtList": [{
      "id": 3046,
      "name": "兴宾区",
      "parentId": 3044,
      "districtList": [] },

    {
      "id": 3047,
      "name": "合山市",
      "parentId": 3044,
      "districtList": [] },

    {
      "id": 3048,
      "name": "忻城县",
      "parentId": 3044,
      "districtList": [] },

    {
      "id": 3049,
      "name": "武宣县",
      "parentId": 3044,
      "districtList": [] },

    {
      "id": 3050,
      "name": "象州县",
      "parentId": 3044,
      "districtList": [] },

    {
      "id": 3051,
      "name": "金秀县",
      "parentId": 3044,
      "districtList": [] }] },



  {
    "id": 3168,
    "name": "崇左市",
    "parentId": 20,
    "districtList": [{
      "id": 3169,
      "name": "江州区",
      "parentId": 3168,
      "districtList": [] },

    {
      "id": 3681,
      "name": "凭祥市",
      "parentId": 3168,
      "districtList": [] },

    {
      "id": 3682,
      "name": "扶绥县",
      "parentId": 3168,
      "districtList": [] },

    {
      "id": 3683,
      "name": "大新县",
      "parentId": 3168,
      "districtList": [] },

    {
      "id": 3684,
      "name": "天等县",
      "parentId": 3168,
      "districtList": [] },

    {
      "id": 3685,
      "name": "宁明县",
      "parentId": 3168,
      "districtList": [] },

    {
      "id": 3686,
      "name": "龙州县",
      "parentId": 3168,
      "districtList": [] }] }] },





{
  "id": 21,
  "name": "江西",
  "parentId": 0,
  "districtList": [{
    "id": 1827,
    "name": "南昌市",
    "parentId": 21,
    "districtList": [{
      "id": 1828,
      "name": "南昌县",
      "parentId": 1827,
      "districtList": [] },

    {
      "id": 1829,
      "name": "进贤县",
      "parentId": 1827,
      "districtList": [] },

    {
      "id": 1830,
      "name": "安义县",
      "parentId": 1827,
      "districtList": [] },

    {
      "id": 3502,
      "name": "新建县",
      "parentId": 1827,
      "districtList": [] },

    {
      "id": 3504,
      "name": "湾里区",
      "parentId": 1827,
      "districtList": [] },

    {
      "id": 3505,
      "name": "青云谱区",
      "parentId": 1827,
      "districtList": [] },

    {
      "id": 3506,
      "name": "西湖区",
      "parentId": 1827,
      "districtList": [] },

    {
      "id": 3507,
      "name": "东湖区",
      "parentId": 1827,
      "districtList": [] },

    {
      "id": 4039,
      "name": "高新区",
      "parentId": 1827,
      "districtList": [] },

    {
      "id": 4101,
      "name": "昌北区",
      "parentId": 1827,
      "districtList": [] },

    {
      "id": 40846,
      "name": "青山湖区",
      "parentId": 1827,
      "districtList": [] },

    {
      "id": 40847,
      "name": "红谷滩新区",
      "parentId": 1827,
      "districtList": [] }] },



  {
    "id": 1832,
    "name": "景德镇市",
    "parentId": 21,
    "districtList": [{
      "id": 1833,
      "name": "乐平市",
      "parentId": 1832,
      "districtList": [] },

    {
      "id": 1834,
      "name": "浮梁县",
      "parentId": 1832,
      "districtList": [] },

    {
      "id": 3508,
      "name": "珠山区",
      "parentId": 1832,
      "districtList": [] },

    {
      "id": 24947,
      "name": "昌江区",
      "parentId": 1832,
      "districtList": [] }] },



  {
    "id": 1836,
    "name": "萍乡市",
    "parentId": 21,
    "districtList": [{
      "id": 1837,
      "name": "湘东区",
      "parentId": 1836,
      "districtList": [] },

    {
      "id": 1838,
      "name": "莲花县",
      "parentId": 1836,
      "districtList": [] },

    {
      "id": 1839,
      "name": "上栗县",
      "parentId": 1836,
      "districtList": [] },

    {
      "id": 1840,
      "name": "芦溪县",
      "parentId": 1836,
      "districtList": [] },

    {
      "id": 18317,
      "name": "安源区",
      "parentId": 1836,
      "districtList": [] }] },



  {
    "id": 1842,
    "name": "新余市",
    "parentId": 21,
    "districtList": [{
      "id": 1843,
      "name": "分宜县",
      "parentId": 1842,
      "districtList": [] },

    {
      "id": 26455,
      "name": "渝水区",
      "parentId": 1842,
      "districtList": [] }] },



  {
    "id": 1845,
    "name": "九江市",
    "parentId": 21,
    "districtList": [{
      "id": 1846,
      "name": "柴桑区",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 1847,
      "name": "瑞昌市",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 1848,
      "name": "庐山市",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 1849,
      "name": "武宁县",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 1850,
      "name": "彭泽县",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 1851,
      "name": "永修县",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 1852,
      "name": "修水县",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 1853,
      "name": "湖口县",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 1854,
      "name": "德安县",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 1855,
      "name": "都昌县",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 4161,
      "name": "共青城市",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 23678,
      "name": "经济技术开发区",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 23679,
      "name": "八里湖新区",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 23680,
      "name": "庐山风景名胜区",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 25481,
      "name": "濂溪区",
      "parentId": 1845,
      "districtList": [] },

    {
      "id": 25482,
      "name": "浔阳区",
      "parentId": 1845,
      "districtList": [] }] },



  {
    "id": 1857,
    "name": "鹰潭市",
    "parentId": 21,
    "districtList": [{
      "id": 1858,
      "name": "余江县",
      "parentId": 1857,
      "districtList": [] },

    {
      "id": 1859,
      "name": "贵溪市",
      "parentId": 1857,
      "districtList": [] },

    {
      "id": 1860,
      "name": "月湖区",
      "parentId": 1857,
      "districtList": [] },

    {
      "id": 51245,
      "name": "龙虎山风景旅游区",
      "parentId": 1857,
      "districtList": [] }] },



  {
    "id": 1861,
    "name": "上饶市",
    "parentId": 21,
    "districtList": [{
      "id": 1863,
      "name": "德兴市",
      "parentId": 1861,
      "districtList": [] },

    {
      "id": 1864,
      "name": "广丰县",
      "parentId": 1861,
      "districtList": [] },

    {
      "id": 1865,
      "name": "鄱阳县",
      "parentId": 1861,
      "districtList": [] },

    {
      "id": 1866,
      "name": "婺源县",
      "parentId": 1861,
      "districtList": [] },

    {
      "id": 1867,
      "name": "余干县",
      "parentId": 1861,
      "districtList": [] },

    {
      "id": 1868,
      "name": "横峰县",
      "parentId": 1861,
      "districtList": [] },

    {
      "id": 1869,
      "name": "弋阳县",
      "parentId": 1861,
      "districtList": [] },

    {
      "id": 1870,
      "name": "铅山县",
      "parentId": 1861,
      "districtList": [] },

    {
      "id": 1871,
      "name": "玉山县",
      "parentId": 1861,
      "districtList": [] },

    {
      "id": 1872,
      "name": "万年县",
      "parentId": 1861,
      "districtList": [] },

    {
      "id": 26449,
      "name": "信州区",
      "parentId": 1861,
      "districtList": [] },

    {
      "id": 26450,
      "name": "上饶县",
      "parentId": 1861,
      "districtList": [] }] },



  {
    "id": 1874,
    "name": "宜春市",
    "parentId": 21,
    "districtList": [{
      "id": 1875,
      "name": "丰城市",
      "parentId": 1874,
      "districtList": [] },

    {
      "id": 1876,
      "name": "樟树市",
      "parentId": 1874,
      "districtList": [] },

    {
      "id": 1877,
      "name": "高安市",
      "parentId": 1874,
      "districtList": [] },

    {
      "id": 1878,
      "name": "铜鼓县",
      "parentId": 1874,
      "districtList": [] },

    {
      "id": 1879,
      "name": "靖安县",
      "parentId": 1874,
      "districtList": [] },

    {
      "id": 1880,
      "name": "宜丰县",
      "parentId": 1874,
      "districtList": [] },

    {
      "id": 1881,
      "name": "奉新县",
      "parentId": 1874,
      "districtList": [] },

    {
      "id": 1882,
      "name": "万载县",
      "parentId": 1874,
      "districtList": [] },

    {
      "id": 1883,
      "name": "上高县",
      "parentId": 1874,
      "districtList": [] },

    {
      "id": 26452,
      "name": "袁州区",
      "parentId": 1874,
      "districtList": [] }] },



  {
    "id": 1885,
    "name": "抚州市",
    "parentId": 21,
    "districtList": [{
      "id": 1887,
      "name": "南丰县",
      "parentId": 1885,
      "districtList": [] },

    {
      "id": 1888,
      "name": "乐安县",
      "parentId": 1885,
      "districtList": [] },

    {
      "id": 1889,
      "name": "金溪县",
      "parentId": 1885,
      "districtList": [] },

    {
      "id": 1890,
      "name": "南城县",
      "parentId": 1885,
      "districtList": [] },

    {
      "id": 1891,
      "name": "东乡县",
      "parentId": 1885,
      "districtList": [] },

    {
      "id": 1892,
      "name": "资溪县",
      "parentId": 1885,
      "districtList": [] },

    {
      "id": 1893,
      "name": "宜黄县",
      "parentId": 1885,
      "districtList": [] },

    {
      "id": 1894,
      "name": "崇仁县",
      "parentId": 1885,
      "districtList": [] },

    {
      "id": 1895,
      "name": "黎川县",
      "parentId": 1885,
      "districtList": [] },

    {
      "id": 1896,
      "name": "广昌县",
      "parentId": 1885,
      "districtList": [] },

    {
      "id": 24946,
      "name": "临川区",
      "parentId": 1885,
      "districtList": [] }] },



  {
    "id": 1898,
    "name": "吉安市",
    "parentId": 21,
    "districtList": [{
      "id": 1899,
      "name": "井冈山市",
      "parentId": 1898,
      "districtList": [] },

    {
      "id": 1900,
      "name": "吉安县",
      "parentId": 1898,
      "districtList": [] },

    {
      "id": 1901,
      "name": "永丰县",
      "parentId": 1898,
      "districtList": [] },

    {
      "id": 1902,
      "name": "永新县",
      "parentId": 1898,
      "districtList": [] },

    {
      "id": 1903,
      "name": "新干县",
      "parentId": 1898,
      "districtList": [] },

    {
      "id": 1904,
      "name": "泰和县",
      "parentId": 1898,
      "districtList": [] },

    {
      "id": 1905,
      "name": "峡江县",
      "parentId": 1898,
      "districtList": [] },

    {
      "id": 1906,
      "name": "遂川县",
      "parentId": 1898,
      "districtList": [] },

    {
      "id": 1907,
      "name": "安福县",
      "parentId": 1898,
      "districtList": [] },

    {
      "id": 1908,
      "name": "吉水县",
      "parentId": 1898,
      "districtList": [] },

    {
      "id": 1909,
      "name": "万安县",
      "parentId": 1898,
      "districtList": [] },

    {
      "id": 26453,
      "name": "青原区",
      "parentId": 1898,
      "districtList": [] },

    {
      "id": 26454,
      "name": "吉州区",
      "parentId": 1898,
      "districtList": [] }] },



  {
    "id": 1911,
    "name": "赣州市",
    "parentId": 21,
    "districtList": [{
      "id": 1912,
      "name": "南康市",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1913,
      "name": "瑞金市",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1914,
      "name": "石城县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1915,
      "name": "安远县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1916,
      "name": "赣县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1917,
      "name": "宁都县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1918,
      "name": "寻乌县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1919,
      "name": "兴国县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1920,
      "name": "定南县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1921,
      "name": "上犹县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1922,
      "name": "于都县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1923,
      "name": "龙南县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1924,
      "name": "崇义县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1925,
      "name": "大余县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1926,
      "name": "信丰县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1927,
      "name": "全南县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 1928,
      "name": "会昌县",
      "parentId": 1911,
      "districtList": [] },

    {
      "id": 26451,
      "name": "章贡区",
      "parentId": 1911,
      "districtList": [] }] }] },





{
  "id": 22,
  "name": "四川",
  "parentId": 0,
  "districtList": [{
    "id": 1930,
    "name": "成都市",
    "parentId": 22,
    "districtList": [{
      "id": 4284,
      "name": "高新西区",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49314,
      "name": "新都区",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49315,
      "name": "温江区",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49316,
      "name": "龙泉驿区",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49317,
      "name": "青白江区",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49318,
      "name": "彭州市",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49319,
      "name": "崇州市",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49320,
      "name": "邛崃市",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49321,
      "name": "都江堰市",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49322,
      "name": "郫都区",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49323,
      "name": "新津县",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49324,
      "name": "双流区",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49325,
      "name": "大邑县",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49326,
      "name": "蒲江县",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 49327,
      "name": "金堂县",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 50944,
      "name": "青羊区",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 50945,
      "name": "锦江区",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 50946,
      "name": "金牛区",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 50947,
      "name": "武侯区",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 50948,
      "name": "成华区",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 50949,
      "name": "高新区",
      "parentId": 1930,
      "districtList": [] },

    {
      "id": 53763,
      "name": "简阳市",
      "parentId": 1930,
      "districtList": [] }] },



  {
    "id": 1946,
    "name": "自贡市",
    "parentId": 22,
    "districtList": [{
      "id": 1947,
      "name": "荣县",
      "parentId": 1946,
      "districtList": [] },

    {
      "id": 1948,
      "name": "富顺县",
      "parentId": 1946,
      "districtList": [] },

    {
      "id": 1949,
      "name": "自流井区",
      "parentId": 1946,
      "districtList": [] },

    {
      "id": 3895,
      "name": "沿滩区",
      "parentId": 1946,
      "districtList": [] },

    {
      "id": 43224,
      "name": "大安区",
      "parentId": 1946,
      "districtList": [] },

    {
      "id": 43225,
      "name": "贡井区",
      "parentId": 1946,
      "districtList": [] }] },



  {
    "id": 1950,
    "name": "攀枝花市",
    "parentId": 22,
    "districtList": [{
      "id": 1951,
      "name": "米易县",
      "parentId": 1950,
      "districtList": [] },

    {
      "id": 1952,
      "name": "盐边县",
      "parentId": 1950,
      "districtList": [] },

    {
      "id": 1953,
      "name": "仁和区",
      "parentId": 1950,
      "districtList": [] },

    {
      "id": 3896,
      "name": "西区",
      "parentId": 1950,
      "districtList": [] },

    {
      "id": 27502,
      "name": "东区",
      "parentId": 1950,
      "districtList": [] }] },



  {
    "id": 1954,
    "name": "泸州市",
    "parentId": 22,
    "districtList": [{
      "id": 1955,
      "name": "泸县",
      "parentId": 1954,
      "districtList": [] },

    {
      "id": 1956,
      "name": "合江县",
      "parentId": 1954,
      "districtList": [] },

    {
      "id": 1957,
      "name": "叙永县",
      "parentId": 1954,
      "districtList": [] },

    {
      "id": 1958,
      "name": "古蔺县",
      "parentId": 1954,
      "districtList": [] },

    {
      "id": 3898,
      "name": "纳溪区",
      "parentId": 1954,
      "districtList": [] },

    {
      "id": 39014,
      "name": "江阳区",
      "parentId": 1954,
      "districtList": [] },

    {
      "id": 39015,
      "name": "龙马潭区",
      "parentId": 1954,
      "districtList": [] }] },



  {
    "id": 1960,
    "name": "绵阳市",
    "parentId": 22,
    "districtList": [{
      "id": 1970,
      "name": "盐亭县",
      "parentId": 1960,
      "districtList": [] },

    {
      "id": 1971,
      "name": "三台县",
      "parentId": 1960,
      "districtList": [] },

    {
      "id": 1972,
      "name": "平武县",
      "parentId": 1960,
      "districtList": [] },

    {
      "id": 1973,
      "name": "北川县",
      "parentId": 1960,
      "districtList": [] },

    {
      "id": 1974,
      "name": "安州区",
      "parentId": 1960,
      "districtList": [] },

    {
      "id": 1975,
      "name": "梓潼县",
      "parentId": 1960,
      "districtList": [] },

    {
      "id": 38573,
      "name": "江油市",
      "parentId": 1960,
      "districtList": [] },

    {
      "id": 38574,
      "name": "涪城区",
      "parentId": 1960,
      "districtList": [] },

    {
      "id": 38575,
      "name": "游仙区",
      "parentId": 1960,
      "districtList": [] },

    {
      "id": 38576,
      "name": "高新区",
      "parentId": 1960,
      "districtList": [] },

    {
      "id": 38577,
      "name": "经开区",
      "parentId": 1960,
      "districtList": [] }] },



  {
    "id": 1962,
    "name": "德阳市",
    "parentId": 22,
    "districtList": [{
      "id": 1965,
      "name": "罗江县",
      "parentId": 1962,
      "districtList": [] },

    {
      "id": 1966,
      "name": "中江县",
      "parentId": 1962,
      "districtList": [] },

    {
      "id": 39010,
      "name": "广汉市",
      "parentId": 1962,
      "districtList": [] },

    {
      "id": 39011,
      "name": "什邡市",
      "parentId": 1962,
      "districtList": [] },

    {
      "id": 39012,
      "name": "旌阳区",
      "parentId": 1962,
      "districtList": [] },

    {
      "id": 39013,
      "name": "绵竹市",
      "parentId": 1962,
      "districtList": [] }] },



  {
    "id": 1977,
    "name": "广元市",
    "parentId": 22,
    "districtList": [{
      "id": 1978,
      "name": "青川县",
      "parentId": 1977,
      "districtList": [] },

    {
      "id": 1979,
      "name": "旺苍县",
      "parentId": 1977,
      "districtList": [] },

    {
      "id": 1980,
      "name": "剑阁县",
      "parentId": 1977,
      "districtList": [] },

    {
      "id": 1981,
      "name": "苍溪县",
      "parentId": 1977,
      "districtList": [] },

    {
      "id": 3901,
      "name": "昭化区",
      "parentId": 1977,
      "districtList": [] },

    {
      "id": 3902,
      "name": "朝天区",
      "parentId": 1977,
      "districtList": [] },

    {
      "id": 27499,
      "name": "利州区",
      "parentId": 1977,
      "districtList": [] }] },



  {
    "id": 1983,
    "name": "遂宁市",
    "parentId": 22,
    "districtList": [{
      "id": 1984,
      "name": "射洪县",
      "parentId": 1983,
      "districtList": [] },

    {
      "id": 1985,
      "name": "蓬溪县",
      "parentId": 1983,
      "districtList": [] },

    {
      "id": 1986,
      "name": "大英县",
      "parentId": 1983,
      "districtList": [] },

    {
      "id": 1987,
      "name": "安居区",
      "parentId": 1983,
      "districtList": [] },

    {
      "id": 4961,
      "name": "船山区",
      "parentId": 1983,
      "districtList": [] }] },



  {
    "id": 1988,
    "name": "内江市",
    "parentId": 22,
    "districtList": [{
      "id": 1989,
      "name": "资中县",
      "parentId": 1988,
      "districtList": [] },

    {
      "id": 1990,
      "name": "隆昌县",
      "parentId": 1988,
      "districtList": [] },

    {
      "id": 1991,
      "name": "威远县",
      "parentId": 1988,
      "districtList": [] },

    {
      "id": 1992,
      "name": "市中区",
      "parentId": 1988,
      "districtList": [] },

    {
      "id": 3121,
      "name": "东兴区",
      "parentId": 1988,
      "districtList": [] }] },



  {
    "id": 1993,
    "name": "乐山市",
    "parentId": 22,
    "districtList": [{
      "id": 1994,
      "name": "五通桥区",
      "parentId": 1993,
      "districtList": [] },

    {
      "id": 1995,
      "name": "沙湾区",
      "parentId": 1993,
      "districtList": [] },

    {
      "id": 1996,
      "name": "金口河区",
      "parentId": 1993,
      "districtList": [] },

    {
      "id": 1998,
      "name": "夹江县",
      "parentId": 1993,
      "districtList": [] },

    {
      "id": 1999,
      "name": "井研县",
      "parentId": 1993,
      "districtList": [] },

    {
      "id": 2000,
      "name": "犍为县",
      "parentId": 1993,
      "districtList": [] },

    {
      "id": 2001,
      "name": "沐川县",
      "parentId": 1993,
      "districtList": [] },

    {
      "id": 2002,
      "name": "峨边县",
      "parentId": 1993,
      "districtList": [] },

    {
      "id": 2003,
      "name": "马边县",
      "parentId": 1993,
      "districtList": [] },

    {
      "id": 36983,
      "name": "市中区",
      "parentId": 1993,
      "districtList": [] },

    {
      "id": 36984,
      "name": "峨眉山市",
      "parentId": 1993,
      "districtList": [] }] },



  {
    "id": 2005,
    "name": "宜宾市",
    "parentId": 22,
    "districtList": [{
      "id": 2006,
      "name": "宜宾县",
      "parentId": 2005,
      "districtList": [] },

    {
      "id": 2007,
      "name": "南溪区",
      "parentId": 2005,
      "districtList": [] },

    {
      "id": 2008,
      "name": "江安县",
      "parentId": 2005,
      "districtList": [] },

    {
      "id": 2009,
      "name": "长宁县",
      "parentId": 2005,
      "districtList": [] },

    {
      "id": 2010,
      "name": "兴文县",
      "parentId": 2005,
      "districtList": [] },

    {
      "id": 2011,
      "name": "珙县",
      "parentId": 2005,
      "districtList": [] },

    {
      "id": 2012,
      "name": "高县",
      "parentId": 2005,
      "districtList": [] },

    {
      "id": 2013,
      "name": "屏山县",
      "parentId": 2005,
      "districtList": [] },

    {
      "id": 2015,
      "name": "筠连县",
      "parentId": 2005,
      "districtList": [] },

    {
      "id": 36315,
      "name": "翠屏区",
      "parentId": 2005,
      "districtList": [] }] },



  {
    "id": 2016,
    "name": "广安市",
    "parentId": 22,
    "districtList": [{
      "id": 2017,
      "name": "岳池县",
      "parentId": 2016,
      "districtList": [] },

    {
      "id": 2018,
      "name": "武胜县",
      "parentId": 2016,
      "districtList": [] },

    {
      "id": 2019,
      "name": "邻水县",
      "parentId": 2016,
      "districtList": [] },

    {
      "id": 2020,
      "name": "广安区",
      "parentId": 2016,
      "districtList": [] },

    {
      "id": 2021,
      "name": "华蓥市",
      "parentId": 2016,
      "districtList": [] },

    {
      "id": 52607,
      "name": "前锋区",
      "parentId": 2016,
      "districtList": [] }] },



  {
    "id": 2022,
    "name": "南充市",
    "parentId": 22,
    "districtList": [{
      "id": 2028,
      "name": "仪陇县",
      "parentId": 2022,
      "districtList": [] },

    {
      "id": 2029,
      "name": "蓬安县",
      "parentId": 2022,
      "districtList": [] },

    {
      "id": 2030,
      "name": "营山县",
      "parentId": 2022,
      "districtList": [] },

    {
      "id": 36936,
      "name": "南部县",
      "parentId": 2022,
      "districtList": [] },

    {
      "id": 43226,
      "name": "顺庆区",
      "parentId": 2022,
      "districtList": [] },

    {
      "id": 43227,
      "name": "高坪区",
      "parentId": 2022,
      "districtList": [] },

    {
      "id": 43228,
      "name": "嘉陵区",
      "parentId": 2022,
      "districtList": [] },

    {
      "id": 43229,
      "name": "西充县",
      "parentId": 2022,
      "districtList": [] },

    {
      "id": 43230,
      "name": "阆中市",
      "parentId": 2022,
      "districtList": [] }] },



  {
    "id": 2033,
    "name": "达州市",
    "parentId": 22,
    "districtList": [{
      "id": 2034,
      "name": "通川区",
      "parentId": 2033,
      "districtList": [] },

    {
      "id": 2035,
      "name": "达川区",
      "parentId": 2033,
      "districtList": [] },

    {
      "id": 2036,
      "name": "大竹县",
      "parentId": 2033,
      "districtList": [] },

    {
      "id": 2037,
      "name": "渠县",
      "parentId": 2033,
      "districtList": [] },

    {
      "id": 2038,
      "name": "万源市",
      "parentId": 2033,
      "districtList": [] },

    {
      "id": 2039,
      "name": "宣汉县",
      "parentId": 2033,
      "districtList": [] },

    {
      "id": 2040,
      "name": "开江县",
      "parentId": 2033,
      "districtList": [] }] },



  {
    "id": 2042,
    "name": "巴中市",
    "parentId": 22,
    "districtList": [{
      "id": 2044,
      "name": "南江县",
      "parentId": 2042,
      "districtList": [] },

    {
      "id": 2045,
      "name": "平昌县",
      "parentId": 2042,
      "districtList": [] },

    {
      "id": 2046,
      "name": "通江县",
      "parentId": 2042,
      "districtList": [] },

    {
      "id": 3904,
      "name": "巴州区",
      "parentId": 2042,
      "districtList": [] },

    {
      "id": 52623,
      "name": "恩阳区",
      "parentId": 2042,
      "districtList": [] }] },



  {
    "id": 2047,
    "name": "雅安市",
    "parentId": 22,
    "districtList": [{
      "id": 2049,
      "name": "芦山县",
      "parentId": 2047,
      "districtList": [] },

    {
      "id": 2052,
      "name": "石棉县",
      "parentId": 2047,
      "districtList": [] },

    {
      "id": 2053,
      "name": "名山区",
      "parentId": 2047,
      "districtList": [] },

    {
      "id": 2054,
      "name": "天全县",
      "parentId": 2047,
      "districtList": [] },

    {
      "id": 2055,
      "name": "荥经县",
      "parentId": 2047,
      "districtList": [] },

    {
      "id": 2056,
      "name": "汉源县",
      "parentId": 2047,
      "districtList": [] },

    {
      "id": 2057,
      "name": "宝兴县",
      "parentId": 2047,
      "districtList": [] },

    {
      "id": 41028,
      "name": "雨城区",
      "parentId": 2047,
      "districtList": [] }] },



  {
    "id": 2058,
    "name": "眉山市",
    "parentId": 22,
    "districtList": [{
      "id": 2060,
      "name": "仁寿县",
      "parentId": 2058,
      "districtList": [] },

    {
      "id": 2061,
      "name": "彭山区",
      "parentId": 2058,
      "districtList": [] },

    {
      "id": 2062,
      "name": "洪雅县",
      "parentId": 2058,
      "districtList": [] },

    {
      "id": 2063,
      "name": "丹棱县",
      "parentId": 2058,
      "districtList": [] },

    {
      "id": 2064,
      "name": "青神县",
      "parentId": 2058,
      "districtList": [] },

    {
      "id": 41029,
      "name": "东坡区",
      "parentId": 2058,
      "districtList": [] }] },



  {
    "id": 2065,
    "name": "资阳市",
    "parentId": 22,
    "districtList": [{
      "id": 2068,
      "name": "安岳县",
      "parentId": 2065,
      "districtList": [] },

    {
      "id": 2069,
      "name": "乐至县",
      "parentId": 2065,
      "districtList": [] },

    {
      "id": 3905,
      "name": "雁江区",
      "parentId": 2065,
      "districtList": [] },

    {
      "id": 44342,
      "name": "简阳市",
      "parentId": 2065,
      "districtList": [] }] },



  {
    "id": 2070,
    "name": "阿坝州",
    "parentId": 22,
    "districtList": [{
      "id": 2071,
      "name": "马尔康市",
      "parentId": 2070,
      "districtList": [] },

    {
      "id": 2072,
      "name": "九寨沟县",
      "parentId": 2070,
      "districtList": [] },

    {
      "id": 2073,
      "name": "红原县",
      "parentId": 2070,
      "districtList": [] },

    {
      "id": 2075,
      "name": "阿坝县",
      "parentId": 2070,
      "districtList": [] },

    {
      "id": 2076,
      "name": "理县",
      "parentId": 2070,
      "districtList": [] },

    {
      "id": 2077,
      "name": "若尔盖县",
      "parentId": 2070,
      "districtList": [] },

    {
      "id": 2078,
      "name": "金川县",
      "parentId": 2070,
      "districtList": [] },

    {
      "id": 2079,
      "name": "小金县",
      "parentId": 2070,
      "districtList": [] },

    {
      "id": 2080,
      "name": "黑水县",
      "parentId": 2070,
      "districtList": [] },

    {
      "id": 2081,
      "name": "松潘县",
      "parentId": 2070,
      "districtList": [] },

    {
      "id": 2082,
      "name": "壤塘县",
      "parentId": 2070,
      "districtList": [] },

    {
      "id": 2083,
      "name": "茂县",
      "parentId": 2070,
      "districtList": [] },

    {
      "id": 27498,
      "name": "汶川县",
      "parentId": 2070,
      "districtList": [] }] },



  {
    "id": 2084,
    "name": "甘孜州",
    "parentId": 22,
    "districtList": [{
      "id": 2085,
      "name": "康定市",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2086,
      "name": "泸定县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2087,
      "name": "九龙县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2088,
      "name": "丹巴县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2089,
      "name": "道孚县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2090,
      "name": "炉霍县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2091,
      "name": "色达县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2092,
      "name": "甘孜县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2093,
      "name": "新龙县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2094,
      "name": "白玉县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2095,
      "name": "德格县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2096,
      "name": "石渠县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2097,
      "name": "雅江县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2098,
      "name": "理塘县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2099,
      "name": "巴塘县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2100,
      "name": "稻城县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2101,
      "name": "乡城县",
      "parentId": 2084,
      "districtList": [] },

    {
      "id": 2102,
      "name": "得荣县",
      "parentId": 2084,
      "districtList": [] }] },



  {
    "id": 2103,
    "name": "凉山州",
    "parentId": 22,
    "districtList": [{
      "id": 2105,
      "name": "美姑县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2106,
      "name": "昭觉县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2107,
      "name": "会理县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2108,
      "name": "会东县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2109,
      "name": "普格县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2110,
      "name": "宁南县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2111,
      "name": "德昌县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2112,
      "name": "冕宁县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2113,
      "name": "盐源县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2114,
      "name": "金阳县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2115,
      "name": "布拖县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2116,
      "name": "雷波县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2117,
      "name": "越西县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2118,
      "name": "喜德县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2119,
      "name": "甘洛县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 2120,
      "name": "木里县",
      "parentId": 2103,
      "districtList": [] },

    {
      "id": 27500,
      "name": "西昌市",
      "parentId": 2103,
      "districtList": [] }] }] },





{
  "id": 23,
  "name": "海南",
  "parentId": 0,
  "districtList": [{
    "id": 2121,
    "name": "海口市",
    "parentId": 23,
    "districtList": [{
      "id": 22466,
      "name": "秀英区",
      "parentId": 2121,
      "districtList": [] },

    {
      "id": 22467,
      "name": "龙华区",
      "parentId": 2121,
      "districtList": [] },

    {
      "id": 22468,
      "name": "琼山区",
      "parentId": 2121,
      "districtList": [] },

    {
      "id": 22469,
      "name": "美兰区",
      "parentId": 2121,
      "districtList": [] }] },



  {
    "id": 3034,
    "name": "儋州市",
    "parentId": 23,
    "districtList": [{
      "id": 3125,
      "name": "那大镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3733,
      "name": "和庆镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3734,
      "name": "南丰镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3735,
      "name": "大成镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3736,
      "name": "雅星镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3737,
      "name": "兰洋镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3738,
      "name": "光村镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3739,
      "name": "木棠镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3740,
      "name": "海头镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3741,
      "name": "峨蔓镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3744,
      "name": "三都镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3745,
      "name": "王五镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3746,
      "name": "白马井镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3747,
      "name": "中和镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3748,
      "name": "排浦镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3749,
      "name": "东成镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3750,
      "name": "新州镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 3751,
      "name": "洋浦经济开发区",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 4214,
      "name": "富克镇",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 12752,
      "name": "西培农场",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 12753,
      "name": "西联农场",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 12754,
      "name": "蓝洋农场",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 12755,
      "name": "八一农场",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 12756,
      "name": "西华农场",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 12757,
      "name": "西庆农场",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 12758,
      "name": "西流农场",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 12759,
      "name": "新盈农场",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 12760,
      "name": "龙山农场",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 12761,
      "name": "红岭农场",
      "parentId": 3034,
      "districtList": [] },

    {
      "id": 12824,
      "name": "热作学院",
      "parentId": 3034,
      "districtList": [] }] },



  {
    "id": 3115,
    "name": "琼海市",
    "parentId": 23,
    "districtList": [{
      "id": 3720,
      "name": "嘉积镇",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 3721,
      "name": "万泉镇",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 3722,
      "name": "石壁镇",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 3723,
      "name": "中原镇",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 3724,
      "name": "博鳌镇",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 3725,
      "name": "阳江镇",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 3727,
      "name": "龙江镇",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 3728,
      "name": "潭门镇",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 3729,
      "name": "塔洋镇",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 3730,
      "name": "长坡镇",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 3731,
      "name": "大路镇",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 3732,
      "name": "会山镇",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 12747,
      "name": "彬村山华侨农场",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 12748,
      "name": "东太农场",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 12749,
      "name": "东红农场",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 12750,
      "name": "东升农场",
      "parentId": 3115,
      "districtList": [] },

    {
      "id": 12751,
      "name": "南俸农场",
      "parentId": 3115,
      "districtList": [] }] },



  {
    "id": 3137,
    "name": "万宁市",
    "parentId": 23,
    "districtList": [{
      "id": 3768,
      "name": "万城镇",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 3769,
      "name": "龙滚镇",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 3770,
      "name": "和乐镇",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 3771,
      "name": "后安镇",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 3772,
      "name": "大茂镇",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 3773,
      "name": "东澳镇",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 3774,
      "name": "礼纪镇",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 3775,
      "name": "长丰镇",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 3776,
      "name": "山根镇",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 3777,
      "name": "北大镇",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 3778,
      "name": "南桥镇",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 3779,
      "name": "三更罗镇",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 12775,
      "name": "六连林场",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 12776,
      "name": "东兴农场",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 12777,
      "name": "东和农场",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 12778,
      "name": "新中农场",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 12779,
      "name": "兴隆华侨农场",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 53111,
      "name": "兴隆镇",
      "parentId": 3137,
      "districtList": [] },

    {
      "id": 53112,
      "name": "南林农场",
      "parentId": 3137,
      "districtList": [] }] },



  {
    "id": 3173,
    "name": "东方市",
    "parentId": 23,
    "districtList": [{
      "id": 3780,
      "name": "八所镇",
      "parentId": 3173,
      "districtList": [] },

    {
      "id": 3781,
      "name": "东河镇",
      "parentId": 3173,
      "districtList": [] },

    {
      "id": 3782,
      "name": "大田镇",
      "parentId": 3173,
      "districtList": [] },

    {
      "id": 3783,
      "name": "感城镇",
      "parentId": 3173,
      "districtList": [] },

    {
      "id": 3784,
      "name": "板桥镇",
      "parentId": 3173,
      "districtList": [] },

    {
      "id": 3785,
      "name": "三家镇",
      "parentId": 3173,
      "districtList": [] },

    {
      "id": 3786,
      "name": "四更镇",
      "parentId": 3173,
      "districtList": [] },

    {
      "id": 3787,
      "name": "新龙镇",
      "parentId": 3173,
      "districtList": [] },

    {
      "id": 3788,
      "name": "天安乡",
      "parentId": 3173,
      "districtList": [] },

    {
      "id": 3789,
      "name": "江边乡",
      "parentId": 3173,
      "districtList": [] },

    {
      "id": 12780,
      "name": "广坝农场",
      "parentId": 3173,
      "districtList": [] },

    {
      "id": 12781,
      "name": "东方华侨农场",
      "parentId": 3173,
      "districtList": [] }] },



  {
    "id": 3690,
    "name": "三亚市",
    "parentId": 23,
    "districtList": [{
      "id": 3693,
      "name": "海棠区",
      "parentId": 3690,
      "districtList": [] },

    {
      "id": 3694,
      "name": "吉阳区",
      "parentId": 3690,
      "districtList": [] },

    {
      "id": 3696,
      "name": "天涯区",
      "parentId": 3690,
      "districtList": [] },

    {
      "id": 4182,
      "name": "崖州区",
      "parentId": 3690,
      "districtList": [] }] },



  {
    "id": 3698,
    "name": "文昌市",
    "parentId": 23,
    "districtList": [{
      "id": 3752,
      "name": "文城镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3753,
      "name": "重兴镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3754,
      "name": "蓬莱镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3755,
      "name": "会文镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3756,
      "name": "东路镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3757,
      "name": "潭牛镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3758,
      "name": "东阁镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3759,
      "name": "文教镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3760,
      "name": "东郊镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3761,
      "name": "龙楼镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3762,
      "name": "昌洒镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3763,
      "name": "翁田镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3764,
      "name": "抱罗镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3765,
      "name": "冯坡镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3766,
      "name": "锦山镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 3767,
      "name": "铺前镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 12762,
      "name": "公坡镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 12763,
      "name": "迈号镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 12764,
      "name": "清谰镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 12765,
      "name": "南阳镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 12766,
      "name": "新桥镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 12767,
      "name": "头苑镇",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 12768,
      "name": "宝芳乡",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 12769,
      "name": "龙马乡",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 12770,
      "name": "湖山乡",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 12771,
      "name": "东路农场",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 12772,
      "name": "南阳农场",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 12773,
      "name": "罗豆农场",
      "parentId": 3698,
      "districtList": [] },

    {
      "id": 12774,
      "name": "橡胶研究所",
      "parentId": 3698,
      "districtList": [] }] },



  {
    "id": 3699,
    "name": "五指山市",
    "parentId": 23,
    "districtList": [{
      "id": 3712,
      "name": "通什镇",
      "parentId": 3699,
      "districtList": [] },

    {
      "id": 3713,
      "name": "南圣镇",
      "parentId": 3699,
      "districtList": [] },

    {
      "id": 3714,
      "name": "毛阳镇",
      "parentId": 3699,
      "districtList": [] },

    {
      "id": 3715,
      "name": "番阳镇",
      "parentId": 3699,
      "districtList": [] },

    {
      "id": 3716,
      "name": "畅好乡",
      "parentId": 3699,
      "districtList": [] },

    {
      "id": 3717,
      "name": "毛道乡",
      "parentId": 3699,
      "districtList": [] },

    {
      "id": 3719,
      "name": "水满乡",
      "parentId": 3699,
      "districtList": [] },

    {
      "id": 12746,
      "name": "畅好农场",
      "parentId": 3699,
      "districtList": [] }] },



  {
    "id": 3701,
    "name": "临高县",
    "parentId": 23,
    "districtList": [{
      "id": 3790,
      "name": "临城镇",
      "parentId": 3701,
      "districtList": [] },

    {
      "id": 3791,
      "name": "波莲镇",
      "parentId": 3701,
      "districtList": [] },

    {
      "id": 3792,
      "name": "东英镇",
      "parentId": 3701,
      "districtList": [] },

    {
      "id": 3793,
      "name": "博厚镇",
      "parentId": 3701,
      "districtList": [] },

    {
      "id": 3794,
      "name": "皇桐镇",
      "parentId": 3701,
      "districtList": [] },

    {
      "id": 3795,
      "name": "多文镇",
      "parentId": 3701,
      "districtList": [] },

    {
      "id": 3796,
      "name": "和舍镇",
      "parentId": 3701,
      "districtList": [] },

    {
      "id": 3797,
      "name": "南宝镇",
      "parentId": 3701,
      "districtList": [] },

    {
      "id": 3798,
      "name": "新盈镇",
      "parentId": 3701,
      "districtList": [] },

    {
      "id": 3799,
      "name": "调楼镇",
      "parentId": 3701,
      "districtList": [] },

    {
      "id": 3800,
      "name": "加来镇",
      "parentId": 3701,
      "districtList": [] },

    {
      "id": 12791,
      "name": "红华农场",
      "parentId": 3701,
      "districtList": [] },

    {
      "id": 12792,
      "name": "加来农场",
      "parentId": 3701,
      "districtList": [] },

    {
      "id": 39884,
      "name": "城区",
      "parentId": 3701,
      "districtList": [] }] },



  {
    "id": 3702,
    "name": "澄迈县",
    "parentId": 23,
    "districtList": [{
      "id": 3801,
      "name": "金江镇",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 3802,
      "name": "老城镇",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 3803,
      "name": "瑞溪镇",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 3804,
      "name": "永发镇",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 3805,
      "name": "加乐镇",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 3806,
      "name": "文儒镇",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 3807,
      "name": "中兴镇",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 3808,
      "name": "仁兴镇",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 3809,
      "name": "福山镇",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 3810,
      "name": "桥头镇",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 12787,
      "name": "大丰镇",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 12788,
      "name": "红光农场",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 12789,
      "name": "西达农场",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 12790,
      "name": "金安农场",
      "parentId": 3702,
      "districtList": [] },

    {
      "id": 39886,
      "name": "城区",
      "parentId": 3702,
      "districtList": [] }] },



  {
    "id": 3703,
    "name": "定安县",
    "parentId": 23,
    "districtList": [{
      "id": 3811,
      "name": "定城镇",
      "parentId": 3703,
      "districtList": [] },

    {
      "id": 3812,
      "name": "新竹镇",
      "parentId": 3703,
      "districtList": [] },

    {
      "id": 3813,
      "name": "龙湖镇",
      "parentId": 3703,
      "districtList": [] },

    {
      "id": 3814,
      "name": "雷鸣镇",
      "parentId": 3703,
      "districtList": [] },

    {
      "id": 3815,
      "name": "龙门镇",
      "parentId": 3703,
      "districtList": [] },

    {
      "id": 3816,
      "name": "龙河镇",
      "parentId": 3703,
      "districtList": [] },

    {
      "id": 3817,
      "name": "岭口镇",
      "parentId": 3703,
      "districtList": [] },

    {
      "id": 3818,
      "name": "翰林镇",
      "parentId": 3703,
      "districtList": [] },

    {
      "id": 3819,
      "name": "富文镇",
      "parentId": 3703,
      "districtList": [] },

    {
      "id": 4498,
      "name": "黄竹镇",
      "parentId": 3703,
      "districtList": [] },

    {
      "id": 12782,
      "name": "金鸡岭农场",
      "parentId": 3703,
      "districtList": [] },

    {
      "id": 12783,
      "name": "中瑞农场",
      "parentId": 3703,
      "districtList": [] },

    {
      "id": 12784,
      "name": "南海农场",
      "parentId": 3703,
      "districtList": [] },

    {
      "id": 39887,
      "name": "城区",
      "parentId": 3703,
      "districtList": [] }] },



  {
    "id": 3704,
    "name": "屯昌县",
    "parentId": 23,
    "districtList": [{
      "id": 3820,
      "name": "屯城镇",
      "parentId": 3704,
      "districtList": [] },

    {
      "id": 3821,
      "name": "新兴镇",
      "parentId": 3704,
      "districtList": [] },

    {
      "id": 3822,
      "name": "枫木镇",
      "parentId": 3704,
      "districtList": [] },

    {
      "id": 3823,
      "name": "乌坡镇",
      "parentId": 3704,
      "districtList": [] },

    {
      "id": 3824,
      "name": "南吕镇",
      "parentId": 3704,
      "districtList": [] },

    {
      "id": 3825,
      "name": "南坤镇",
      "parentId": 3704,
      "districtList": [] },

    {
      "id": 3826,
      "name": "坡心镇",
      "parentId": 3704,
      "districtList": [] },

    {
      "id": 3827,
      "name": "西昌镇",
      "parentId": 3704,
      "districtList": [] },

    {
      "id": 12785,
      "name": "中建农场",
      "parentId": 3704,
      "districtList": [] },

    {
      "id": 12786,
      "name": "中坤农场",
      "parentId": 3704,
      "districtList": [] },

    {
      "id": 39889,
      "name": "县城内",
      "parentId": 3704,
      "districtList": [] }] },



  {
    "id": 3705,
    "name": "昌江县",
    "parentId": 23,
    "districtList": [{
      "id": 3828,
      "name": "石碌镇",
      "parentId": 3705,
      "districtList": [] },

    {
      "id": 3829,
      "name": "叉河镇",
      "parentId": 3705,
      "districtList": [] },

    {
      "id": 3830,
      "name": "十月田镇",
      "parentId": 3705,
      "districtList": [] },

    {
      "id": 3831,
      "name": "乌烈镇",
      "parentId": 3705,
      "districtList": [] },

    {
      "id": 3832,
      "name": "昌化镇",
      "parentId": 3705,
      "districtList": [] },

    {
      "id": 3833,
      "name": "海尾镇",
      "parentId": 3705,
      "districtList": [] },

    {
      "id": 12796,
      "name": "七叉镇",
      "parentId": 3705,
      "districtList": [] },

    {
      "id": 12797,
      "name": "王下乡",
      "parentId": 3705,
      "districtList": [] },

    {
      "id": 12798,
      "name": "海南矿业公司",
      "parentId": 3705,
      "districtList": [] },

    {
      "id": 12799,
      "name": "霸王岭林场",
      "parentId": 3705,
      "districtList": [] },

    {
      "id": 12800,
      "name": "红林农场",
      "parentId": 3705,
      "districtList": [] },

    {
      "id": 39890,
      "name": "城区",
      "parentId": 3705,
      "districtList": [] }] },



  {
    "id": 3706,
    "name": "白沙县",
    "parentId": 23,
    "districtList": [{
      "id": 3834,
      "name": "牙叉镇",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 3835,
      "name": "七坊镇",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 3836,
      "name": "邦溪镇",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 3837,
      "name": "打安镇",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 3838,
      "name": "细水乡",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 3839,
      "name": "元门乡",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 3840,
      "name": "南开乡",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 3841,
      "name": "阜龙乡",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 3842,
      "name": "青松乡",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 3843,
      "name": "金波乡",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 3844,
      "name": "荣邦乡",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 12793,
      "name": "白沙农场",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 12794,
      "name": "龙江农场",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 12795,
      "name": "邦溪农场",
      "parentId": 3706,
      "districtList": [] },

    {
      "id": 39892,
      "name": "城区",
      "parentId": 3706,
      "districtList": [] }] },



  {
    "id": 3707,
    "name": "琼中县",
    "parentId": 23,
    "districtList": [{
      "id": 3878,
      "name": "营根镇",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 3879,
      "name": "湾岭镇",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 3880,
      "name": "黎母山镇",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 3881,
      "name": "和平镇",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 3882,
      "name": "长征镇",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 3883,
      "name": "红毛镇",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 3884,
      "name": "中平镇",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 3885,
      "name": "上安乡",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 3886,
      "name": "什运乡",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 12813,
      "name": "吊罗山乡",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 12814,
      "name": "黎母山林业公司",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 12815,
      "name": "阳江农场",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 12816,
      "name": "乌石农场",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 12817,
      "name": "加钗农场",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 12818,
      "name": "长征农场",
      "parentId": 3707,
      "districtList": [] },

    {
      "id": 39893,
      "name": "城区",
      "parentId": 3707,
      "districtList": [] }] },



  {
    "id": 3708,
    "name": "陵水县",
    "parentId": 23,
    "districtList": [{
      "id": 3858,
      "name": "椰林镇",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 3859,
      "name": "光坡镇",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 3860,
      "name": "三才镇",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 3861,
      "name": "英州镇",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 3862,
      "name": "隆广镇",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 3863,
      "name": "文罗镇",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 3864,
      "name": "本号镇",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 3865,
      "name": "新村镇",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 3866,
      "name": "黎安镇",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 3867,
      "name": "提蒙乡",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 3868,
      "name": "群英乡",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 12806,
      "name": "吊罗山林业公司",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 12807,
      "name": "岭门农场",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 12808,
      "name": "南平农场",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 39895,
      "name": "城区",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 53109,
      "name": "东华镇",
      "parentId": 3708,
      "districtList": [] },

    {
      "id": 53110,
      "name": "南平镇",
      "parentId": 3708,
      "districtList": [] }] },



  {
    "id": 3709,
    "name": "保亭县",
    "parentId": 23,
    "districtList": [{
      "id": 3869,
      "name": "保城镇",
      "parentId": 3709,
      "districtList": [] },

    {
      "id": 3870,
      "name": "什玲镇",
      "parentId": 3709,
      "districtList": [] },

    {
      "id": 3871,
      "name": "加茂镇",
      "parentId": 3709,
      "districtList": [] },

    {
      "id": 3872,
      "name": "响水镇",
      "parentId": 3709,
      "districtList": [] },

    {
      "id": 3873,
      "name": "新政镇",
      "parentId": 3709,
      "districtList": [] },

    {
      "id": 3874,
      "name": "三道镇",
      "parentId": 3709,
      "districtList": [] },

    {
      "id": 3875,
      "name": "六弓乡",
      "parentId": 3709,
      "districtList": [] },

    {
      "id": 3876,
      "name": "南林乡",
      "parentId": 3709,
      "districtList": [] },

    {
      "id": 3877,
      "name": "毛感乡",
      "parentId": 3709,
      "districtList": [] },

    {
      "id": 12809,
      "name": "保亭研究所",
      "parentId": 3709,
      "districtList": [] },

    {
      "id": 12810,
      "name": "新星农场",
      "parentId": 3709,
      "districtList": [] },

    {
      "id": 12811,
      "name": "金江农场",
      "parentId": 3709,
      "districtList": [] },

    {
      "id": 12812,
      "name": "三道农场",
      "parentId": 3709,
      "districtList": [] }] },



  {
    "id": 3710,
    "name": "乐东县",
    "parentId": 23,
    "districtList": [{
      "id": 3845,
      "name": "抱由镇",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 3846,
      "name": "万冲镇",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 3847,
      "name": "大安镇",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 3849,
      "name": "志仲镇",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 3851,
      "name": "千家镇",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 3852,
      "name": "九所镇",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 3853,
      "name": "利国镇",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 3854,
      "name": "黄流镇",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 3855,
      "name": "佛罗镇",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 3856,
      "name": "尖峰镇",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 3857,
      "name": "莺歌海镇",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 12801,
      "name": "尖峰岭林业公司",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 12802,
      "name": "莺歌海盐场",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 12803,
      "name": "山荣农场",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 12804,
      "name": "乐光农场",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 12805,
      "name": "保国农场",
      "parentId": 3710,
      "districtList": [] },

    {
      "id": 39897,
      "name": "城区",
      "parentId": 3710,
      "districtList": [] }] },



  {
    "id": 3711,
    "name": "三沙市",
    "parentId": 23,
    "districtList": [{
      "id": 3887,
      "name": "西沙群岛",
      "parentId": 3711,
      "districtList": [] },

    {
      "id": 3888,
      "name": "南沙群岛",
      "parentId": 3711,
      "districtList": [] },

    {
      "id": 12819,
      "name": "中沙群岛",
      "parentId": 3711,
      "districtList": [] }] }] },





{
  "id": 24,
  "name": "贵州",
  "parentId": 0,
  "districtList": [{
    "id": 2144,
    "name": "贵阳市",
    "parentId": 24,
    "districtList": [{
      "id": 2145,
      "name": "清镇市",
      "parentId": 2144,
      "districtList": [] },

    {
      "id": 2146,
      "name": "开阳县",
      "parentId": 2144,
      "districtList": [] },

    {
      "id": 2147,
      "name": "修文县",
      "parentId": 2144,
      "districtList": [] },

    {
      "id": 2148,
      "name": "息烽县",
      "parentId": 2144,
      "districtList": [] },

    {
      "id": 2149,
      "name": "乌当区",
      "parentId": 2144,
      "districtList": [] },

    {
      "id": 3906,
      "name": "南明区",
      "parentId": 2144,
      "districtList": [] },

    {
      "id": 3909,
      "name": "白云区",
      "parentId": 2144,
      "districtList": [] },

    {
      "id": 21037,
      "name": "云岩区",
      "parentId": 2144,
      "districtList": [] },

    {
      "id": 21038,
      "name": "花溪区",
      "parentId": 2144,
      "districtList": [] },

    {
      "id": 21039,
      "name": "小河区",
      "parentId": 2144,
      "districtList": [] },

    {
      "id": 24463,
      "name": "观山湖区",
      "parentId": 2144,
      "districtList": [] }] },



  {
    "id": 2150,
    "name": "六盘水市",
    "parentId": 24,
    "districtList": [{
      "id": 2151,
      "name": "盘县",
      "parentId": 2150,
      "districtList": [] },

    {
      "id": 2152,
      "name": "六枝特区",
      "parentId": 2150,
      "districtList": [] },

    {
      "id": 2153,
      "name": "水城县",
      "parentId": 2150,
      "districtList": [] },

    {
      "id": 2154,
      "name": "钟山区",
      "parentId": 2150,
      "districtList": [] }] },



  {
    "id": 2155,
    "name": "遵义市",
    "parentId": 24,
    "districtList": [{
      "id": 2156,
      "name": "赤水市",
      "parentId": 2155,
      "districtList": [] },

    {
      "id": 2157,
      "name": "仁怀市",
      "parentId": 2155,
      "districtList": [] },

    {
      "id": 2158,
      "name": "播州区",
      "parentId": 2155,
      "districtList": [] },

    {
      "id": 2159,
      "name": "桐梓县",
      "parentId": 2155,
      "districtList": [] },

    {
      "id": 2160,
      "name": "绥阳县",
      "parentId": 2155,
      "districtList": [] },

    {
      "id": 2161,
      "name": "习水县",
      "parentId": 2155,
      "districtList": [] },

    {
      "id": 2162,
      "name": "凤冈县",
      "parentId": 2155,
      "districtList": [] },

    {
      "id": 2163,
      "name": "正安县",
      "parentId": 2155,
      "districtList": [] },

    {
      "id": 2164,
      "name": "湄潭县",
      "parentId": 2155,
      "districtList": [] },

    {
      "id": 2165,
      "name": "余庆县",
      "parentId": 2155,
      "districtList": [] },

    {
      "id": 2166,
      "name": "道真县",
      "parentId": 2155,
      "districtList": [] },

    {
      "id": 2167,
      "name": "务川县",
      "parentId": 2155,
      "districtList": [] },

    {
      "id": 21035,
      "name": "红花岗区",
      "parentId": 2155,
      "districtList": [] },

    {
      "id": 21036,
      "name": "汇川区",
      "parentId": 2155,
      "districtList": [] }] },



  {
    "id": 2169,
    "name": "铜仁市",
    "parentId": 24,
    "districtList": [{
      "id": 2170,
      "name": "碧江区",
      "parentId": 2169,
      "districtList": [] },

    {
      "id": 2171,
      "name": "德江县",
      "parentId": 2169,
      "districtList": [] },

    {
      "id": 2172,
      "name": "江口县",
      "parentId": 2169,
      "districtList": [] },

    {
      "id": 2173,
      "name": "思南县",
      "parentId": 2169,
      "districtList": [] },

    {
      "id": 2174,
      "name": "万山区",
      "parentId": 2169,
      "districtList": [] },

    {
      "id": 2175,
      "name": "石阡县",
      "parentId": 2169,
      "districtList": [] },

    {
      "id": 2176,
      "name": "玉屏侗族自治县",
      "parentId": 2169,
      "districtList": [] },

    {
      "id": 2177,
      "name": "松桃苗族自治县",
      "parentId": 2169,
      "districtList": [] },

    {
      "id": 2178,
      "name": "印江土家族苗族自治县",
      "parentId": 2169,
      "districtList": [] },

    {
      "id": 2179,
      "name": "沿河土家族自治县",
      "parentId": 2169,
      "districtList": [] }] },



  {
    "id": 2180,
    "name": "毕节市",
    "parentId": 24,
    "districtList": [{
      "id": 2182,
      "name": "黔西县",
      "parentId": 2180,
      "districtList": [] },

    {
      "id": 2183,
      "name": "大方县",
      "parentId": 2180,
      "districtList": [] },

    {
      "id": 2184,
      "name": "织金县",
      "parentId": 2180,
      "districtList": [] },

    {
      "id": 2185,
      "name": "金沙县",
      "parentId": 2180,
      "districtList": [] },

    {
      "id": 2186,
      "name": "赫章县",
      "parentId": 2180,
      "districtList": [] },

    {
      "id": 2187,
      "name": "纳雍县",
      "parentId": 2180,
      "districtList": [] },

    {
      "id": 2188,
      "name": "威宁彝族回族苗族自治县",
      "parentId": 2180,
      "districtList": [] },

    {
      "id": 8891,
      "name": "七星关区",
      "parentId": 2180,
      "districtList": [] }] },



  {
    "id": 2189,
    "name": "安顺市",
    "parentId": 24,
    "districtList": [{
      "id": 2190,
      "name": "西秀区",
      "parentId": 2189,
      "districtList": [] },

    {
      "id": 2191,
      "name": "普定县",
      "parentId": 2189,
      "districtList": [] },

    {
      "id": 2192,
      "name": "平坝区",
      "parentId": 2189,
      "districtList": [] },

    {
      "id": 2193,
      "name": "镇宁布依族苗族自治县",
      "parentId": 2189,
      "districtList": [] },

    {
      "id": 2194,
      "name": "关岭布依族苗族自治县",
      "parentId": 2189,
      "districtList": [] },

    {
      "id": 2195,
      "name": "紫云苗族布依族自治县",
      "parentId": 2189,
      "districtList": [] }] },



  {
    "id": 2196,
    "name": "黔西南州",
    "parentId": 24,
    "districtList": [{
      "id": 2197,
      "name": "兴义市",
      "parentId": 2196,
      "districtList": [] },

    {
      "id": 2198,
      "name": "望谟县",
      "parentId": 2196,
      "districtList": [] },

    {
      "id": 2199,
      "name": "兴仁县",
      "parentId": 2196,
      "districtList": [] },

    {
      "id": 2200,
      "name": "普安县",
      "parentId": 2196,
      "districtList": [] },

    {
      "id": 2201,
      "name": "册亨县",
      "parentId": 2196,
      "districtList": [] },

    {
      "id": 2202,
      "name": "晴隆县",
      "parentId": 2196,
      "districtList": [] },

    {
      "id": 2203,
      "name": "贞丰县",
      "parentId": 2196,
      "districtList": [] },

    {
      "id": 2204,
      "name": "安龙县",
      "parentId": 2196,
      "districtList": [] }] },



  {
    "id": 2205,
    "name": "黔东南州",
    "parentId": 24,
    "districtList": [{
      "id": 2206,
      "name": "凯里市",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2207,
      "name": "施秉县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2208,
      "name": "从江县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2209,
      "name": "锦屏县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2210,
      "name": "镇远县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2211,
      "name": "麻江县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2212,
      "name": "台江县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2213,
      "name": "天柱县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2214,
      "name": "黄平县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2215,
      "name": "榕江县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2216,
      "name": "剑河县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2217,
      "name": "三穗县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2218,
      "name": "雷山县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2219,
      "name": "黎平县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2220,
      "name": "岑巩县",
      "parentId": 2205,
      "districtList": [] },

    {
      "id": 2221,
      "name": "丹寨县",
      "parentId": 2205,
      "districtList": [] }] },



  {
    "id": 2222,
    "name": "黔南州",
    "parentId": 24,
    "districtList": [{
      "id": 2223,
      "name": "都匀市",
      "parentId": 2222,
      "districtList": [] },

    {
      "id": 2224,
      "name": "福泉市",
      "parentId": 2222,
      "districtList": [] },

    {
      "id": 2225,
      "name": "贵定县",
      "parentId": 2222,
      "districtList": [] },

    {
      "id": 2226,
      "name": "惠水县",
      "parentId": 2222,
      "districtList": [] },

    {
      "id": 2227,
      "name": "罗甸县",
      "parentId": 2222,
      "districtList": [] },

    {
      "id": 2228,
      "name": "瓮安县",
      "parentId": 2222,
      "districtList": [] },

    {
      "id": 2229,
      "name": "荔波县",
      "parentId": 2222,
      "districtList": [] },

    {
      "id": 2230,
      "name": "龙里县",
      "parentId": 2222,
      "districtList": [] },

    {
      "id": 2231,
      "name": "平塘县",
      "parentId": 2222,
      "districtList": [] },

    {
      "id": 2232,
      "name": "长顺县",
      "parentId": 2222,
      "districtList": [] },

    {
      "id": 2233,
      "name": "独山县",
      "parentId": 2222,
      "districtList": [] },

    {
      "id": 2234,
      "name": "三都县",
      "parentId": 2222,
      "districtList": [] }] }] },





{
  "id": 25,
  "name": "云南",
  "parentId": 0,
  "districtList": [{
    "id": 2235,
    "name": "昆明市",
    "parentId": 25,
    "districtList": [{
      "id": 2236,
      "name": "东川区",
      "parentId": 2235,
      "districtList": [] },

    {
      "id": 2237,
      "name": "安宁市",
      "parentId": 2235,
      "districtList": [] },

    {
      "id": 2238,
      "name": "富民县",
      "parentId": 2235,
      "districtList": [] },

    {
      "id": 2239,
      "name": "嵩明县",
      "parentId": 2235,
      "districtList": [] },

    {
      "id": 2241,
      "name": "晋宁区",
      "parentId": 2235,
      "districtList": [] },

    {
      "id": 2242,
      "name": "宜良县",
      "parentId": 2235,
      "districtList": [] },

    {
      "id": 2243,
      "name": "禄劝县",
      "parentId": 2235,
      "districtList": [] },

    {
      "id": 2244,
      "name": "石林县",
      "parentId": 2235,
      "districtList": [] },

    {
      "id": 2245,
      "name": "寻甸县",
      "parentId": 2235,
      "districtList": [] },

    {
      "id": 2246,
      "name": "盘龙区",
      "parentId": 2235,
      "districtList": [] },

    {
      "id": 3912,
      "name": "五华区",
      "parentId": 2235,
      "districtList": [] },

    {
      "id": 3913,
      "name": "官渡区",
      "parentId": 2235,
      "districtList": [] },

    {
      "id": 3914,
      "name": "西山区",
      "parentId": 2235,
      "districtList": [] },

    {
      "id": 27497,
      "name": "呈贡区",
      "parentId": 2235,
      "districtList": [] }] },



  {
    "id": 2247,
    "name": "曲靖市",
    "parentId": 25,
    "districtList": [{
      "id": 2249,
      "name": "马龙县",
      "parentId": 2247,
      "districtList": [] },

    {
      "id": 2250,
      "name": "宣威市",
      "parentId": 2247,
      "districtList": [] },

    {
      "id": 2251,
      "name": "富源县",
      "parentId": 2247,
      "districtList": [] },

    {
      "id": 2252,
      "name": "会泽县",
      "parentId": 2247,
      "districtList": [] },

    {
      "id": 2253,
      "name": "陆良县",
      "parentId": 2247,
      "districtList": [] },

    {
      "id": 2254,
      "name": "师宗县",
      "parentId": 2247,
      "districtList": [] },

    {
      "id": 2255,
      "name": "罗平县",
      "parentId": 2247,
      "districtList": [] },

    {
      "id": 2256,
      "name": "沾益区",
      "parentId": 2247,
      "districtList": [] },

    {
      "id": 21034,
      "name": "麒麟区",
      "parentId": 2247,
      "districtList": [] }] },



  {
    "id": 2258,
    "name": "玉溪市",
    "parentId": 25,
    "districtList": [{
      "id": 2259,
      "name": "红塔区",
      "parentId": 2258,
      "districtList": [] },

    {
      "id": 2260,
      "name": "华宁县",
      "parentId": 2258,
      "districtList": [] },

    {
      "id": 2261,
      "name": "澄江县",
      "parentId": 2258,
      "districtList": [] },

    {
      "id": 2262,
      "name": "易门县",
      "parentId": 2258,
      "districtList": [] },

    {
      "id": 2263,
      "name": "通海县",
      "parentId": 2258,
      "districtList": [] },

    {
      "id": 2264,
      "name": "江川区",
      "parentId": 2258,
      "districtList": [] },

    {
      "id": 2265,
      "name": "元江县",
      "parentId": 2258,
      "districtList": [] },

    {
      "id": 2266,
      "name": "新平县",
      "parentId": 2258,
      "districtList": [] },

    {
      "id": 2267,
      "name": "峨山县",
      "parentId": 2258,
      "districtList": [] }] },



  {
    "id": 2270,
    "name": "昭通市",
    "parentId": 25,
    "districtList": [{
      "id": 2271,
      "name": "昭阳区",
      "parentId": 2270,
      "districtList": [] },

    {
      "id": 2272,
      "name": "镇雄县",
      "parentId": 2270,
      "districtList": [] },

    {
      "id": 2273,
      "name": "永善县",
      "parentId": 2270,
      "districtList": [] },

    {
      "id": 2274,
      "name": "大关县",
      "parentId": 2270,
      "districtList": [] },

    {
      "id": 2275,
      "name": "盐津县",
      "parentId": 2270,
      "districtList": [] },

    {
      "id": 2276,
      "name": "彝良县",
      "parentId": 2270,
      "districtList": [] },

    {
      "id": 2277,
      "name": "水富县",
      "parentId": 2270,
      "districtList": [] },

    {
      "id": 2278,
      "name": "巧家县",
      "parentId": 2270,
      "districtList": [] },

    {
      "id": 2279,
      "name": "威信县",
      "parentId": 2270,
      "districtList": [] },

    {
      "id": 3002,
      "name": "鲁甸县",
      "parentId": 2270,
      "districtList": [] },

    {
      "id": 3003,
      "name": "绥江县",
      "parentId": 2270,
      "districtList": [] }] },



  {
    "id": 2281,
    "name": "普洱市",
    "parentId": 25,
    "districtList": [{
      "id": 2282,
      "name": "思茅区",
      "parentId": 2281,
      "districtList": [] },

    {
      "id": 2283,
      "name": "宁洱县",
      "parentId": 2281,
      "districtList": [] },

    {
      "id": 2284,
      "name": "景东县",
      "parentId": 2281,
      "districtList": [] },

    {
      "id": 2285,
      "name": "镇沅县",
      "parentId": 2281,
      "districtList": [] },

    {
      "id": 2286,
      "name": "景谷县",
      "parentId": 2281,
      "districtList": [] },

    {
      "id": 2287,
      "name": "墨江县",
      "parentId": 2281,
      "districtList": [] },

    {
      "id": 2288,
      "name": "澜沧县",
      "parentId": 2281,
      "districtList": [] },

    {
      "id": 2289,
      "name": "西盟县",
      "parentId": 2281,
      "districtList": [] },

    {
      "id": 2290,
      "name": "江城县",
      "parentId": 2281,
      "districtList": [] },

    {
      "id": 2958,
      "name": "孟连县",
      "parentId": 2281,
      "districtList": [] }] },



  {
    "id": 2291,
    "name": "临沧市",
    "parentId": 25,
    "districtList": [{
      "id": 2292,
      "name": "临翔区",
      "parentId": 2291,
      "districtList": [] },

    {
      "id": 2293,
      "name": "镇康县",
      "parentId": 2291,
      "districtList": [] },

    {
      "id": 2294,
      "name": "凤庆县",
      "parentId": 2291,
      "districtList": [] },

    {
      "id": 2295,
      "name": "云县",
      "parentId": 2291,
      "districtList": [] },

    {
      "id": 2296,
      "name": "永德县",
      "parentId": 2291,
      "districtList": [] },

    {
      "id": 2297,
      "name": "耿马县",
      "parentId": 2291,
      "districtList": [] },

    {
      "id": 3915,
      "name": "双江县",
      "parentId": 2291,
      "districtList": [] },

    {
      "id": 3916,
      "name": "沧源县",
      "parentId": 2291,
      "districtList": [] }] },



  {
    "id": 2298,
    "name": "保山市",
    "parentId": 25,
    "districtList": [{
      "id": 2299,
      "name": "隆阳区",
      "parentId": 2298,
      "districtList": [] },

    {
      "id": 2300,
      "name": "施甸县",
      "parentId": 2298,
      "districtList": [] },

    {
      "id": 2301,
      "name": "昌宁县",
      "parentId": 2298,
      "districtList": [] },

    {
      "id": 2302,
      "name": "龙陵县",
      "parentId": 2298,
      "districtList": [] },

    {
      "id": 2303,
      "name": "腾冲市",
      "parentId": 2298,
      "districtList": [] }] },



  {
    "id": 2304,
    "name": "丽江市",
    "parentId": 25,
    "districtList": [{
      "id": 2305,
      "name": "玉龙县",
      "parentId": 2304,
      "districtList": [] },

    {
      "id": 2306,
      "name": "华坪县",
      "parentId": 2304,
      "districtList": [] },

    {
      "id": 2307,
      "name": "永胜县",
      "parentId": 2304,
      "districtList": [] },

    {
      "id": 2308,
      "name": "宁蒗县",
      "parentId": 2304,
      "districtList": [] },

    {
      "id": 21033,
      "name": "古城区",
      "parentId": 2304,
      "districtList": [] }] },



  {
    "id": 2309,
    "name": "文山州",
    "parentId": 25,
    "districtList": [{
      "id": 2310,
      "name": "文山市",
      "parentId": 2309,
      "districtList": [] },

    {
      "id": 2311,
      "name": "麻栗坡县",
      "parentId": 2309,
      "districtList": [] },

    {
      "id": 2312,
      "name": "砚山县",
      "parentId": 2309,
      "districtList": [] },

    {
      "id": 2313,
      "name": "广南县",
      "parentId": 2309,
      "districtList": [] },

    {
      "id": 2314,
      "name": "马关县",
      "parentId": 2309,
      "districtList": [] },

    {
      "id": 2315,
      "name": "富宁县",
      "parentId": 2309,
      "districtList": [] },

    {
      "id": 2316,
      "name": "西畴县",
      "parentId": 2309,
      "districtList": [] },

    {
      "id": 2317,
      "name": "丘北县",
      "parentId": 2309,
      "districtList": [] }] },



  {
    "id": 2318,
    "name": "红河州",
    "parentId": 25,
    "districtList": [{
      "id": 2319,
      "name": "个旧市",
      "parentId": 2318,
      "districtList": [] },

    {
      "id": 2320,
      "name": "开远市",
      "parentId": 2318,
      "districtList": [] },

    {
      "id": 2321,
      "name": "弥勒市",
      "parentId": 2318,
      "districtList": [] },

    {
      "id": 2322,
      "name": "红河县",
      "parentId": 2318,
      "districtList": [] },

    {
      "id": 2323,
      "name": "绿春县",
      "parentId": 2318,
      "districtList": [] },

    {
      "id": 2324,
      "name": "蒙自市",
      "parentId": 2318,
      "districtList": [] },

    {
      "id": 2325,
      "name": "泸西县",
      "parentId": 2318,
      "districtList": [] },

    {
      "id": 2326,
      "name": "建水县",
      "parentId": 2318,
      "districtList": [] },

    {
      "id": 2327,
      "name": "元阳县",
      "parentId": 2318,
      "districtList": [] },

    {
      "id": 2328,
      "name": "石屏县",
      "parentId": 2318,
      "districtList": [] },

    {
      "id": 2329,
      "name": "金平县",
      "parentId": 2318,
      "districtList": [] },

    {
      "id": 2330,
      "name": "屏边县",
      "parentId": 2318,
      "districtList": [] },

    {
      "id": 2331,
      "name": "河口县",
      "parentId": 2318,
      "districtList": [] }] },



  {
    "id": 2332,
    "name": "西双版纳州",
    "parentId": 25,
    "districtList": [{
      "id": 2333,
      "name": "景洪市",
      "parentId": 2332,
      "districtList": [] },

    {
      "id": 2334,
      "name": "勐海县",
      "parentId": 2332,
      "districtList": [] },

    {
      "id": 2335,
      "name": "勐腊县",
      "parentId": 2332,
      "districtList": [] }] },



  {
    "id": 2336,
    "name": "楚雄州",
    "parentId": 25,
    "districtList": [{
      "id": 2338,
      "name": "元谋县",
      "parentId": 2336,
      "districtList": [] },

    {
      "id": 2339,
      "name": "南华县",
      "parentId": 2336,
      "districtList": [] },

    {
      "id": 2340,
      "name": "牟定县",
      "parentId": 2336,
      "districtList": [] },

    {
      "id": 2341,
      "name": "武定县",
      "parentId": 2336,
      "districtList": [] },

    {
      "id": 2342,
      "name": "大姚县",
      "parentId": 2336,
      "districtList": [] },

    {
      "id": 2343,
      "name": "双柏县",
      "parentId": 2336,
      "districtList": [] },

    {
      "id": 2344,
      "name": "禄丰县",
      "parentId": 2336,
      "districtList": [] },

    {
      "id": 2345,
      "name": "永仁县",
      "parentId": 2336,
      "districtList": [] },

    {
      "id": 3917,
      "name": "姚安县",
      "parentId": 2336,
      "districtList": [] },

    {
      "id": 20817,
      "name": "楚雄市",
      "parentId": 2336,
      "districtList": [] }] },



  {
    "id": 2347,
    "name": "大理州",
    "parentId": 25,
    "districtList": [{
      "id": 2349,
      "name": "剑川县",
      "parentId": 2347,
      "districtList": [] },

    {
      "id": 2350,
      "name": "弥渡县",
      "parentId": 2347,
      "districtList": [] },

    {
      "id": 2351,
      "name": "云龙县",
      "parentId": 2347,
      "districtList": [] },

    {
      "id": 2352,
      "name": "洱源县",
      "parentId": 2347,
      "districtList": [] },

    {
      "id": 2353,
      "name": "鹤庆县",
      "parentId": 2347,
      "districtList": [] },

    {
      "id": 2354,
      "name": "宾川县",
      "parentId": 2347,
      "districtList": [] },

    {
      "id": 2355,
      "name": "祥云县",
      "parentId": 2347,
      "districtList": [] },

    {
      "id": 2356,
      "name": "永平县",
      "parentId": 2347,
      "districtList": [] },

    {
      "id": 2357,
      "name": "巍山县",
      "parentId": 2347,
      "districtList": [] },

    {
      "id": 2358,
      "name": "漾濞县",
      "parentId": 2347,
      "districtList": [] },

    {
      "id": 2359,
      "name": "南涧县",
      "parentId": 2347,
      "districtList": [] },

    {
      "id": 20818,
      "name": "大理市",
      "parentId": 2347,
      "districtList": [] }] },



  {
    "id": 2360,
    "name": "德宏州",
    "parentId": 25,
    "districtList": [{
      "id": 2361,
      "name": "芒市",
      "parentId": 2360,
      "districtList": [] },

    {
      "id": 2362,
      "name": "瑞丽市",
      "parentId": 2360,
      "districtList": [] },

    {
      "id": 2363,
      "name": "盈江县",
      "parentId": 2360,
      "districtList": [] },

    {
      "id": 2364,
      "name": "梁河县",
      "parentId": 2360,
      "districtList": [] },

    {
      "id": 2365,
      "name": "陇川县",
      "parentId": 2360,
      "districtList": [] }] },



  {
    "id": 2366,
    "name": "怒江州",
    "parentId": 25,
    "districtList": [{
      "id": 2367,
      "name": "泸水市",
      "parentId": 2366,
      "districtList": [] },

    {
      "id": 2368,
      "name": "福贡县",
      "parentId": 2366,
      "districtList": [] },

    {
      "id": 2369,
      "name": "兰坪县",
      "parentId": 2366,
      "districtList": [] },

    {
      "id": 2370,
      "name": "贡山县",
      "parentId": 2366,
      "districtList": [] }] },



  {
    "id": 4108,
    "name": "迪庆州",
    "parentId": 25,
    "districtList": [{
      "id": 6823,
      "name": "香格里拉市",
      "parentId": 4108,
      "districtList": [] },

    {
      "id": 6824,
      "name": "德钦县",
      "parentId": 4108,
      "districtList": [] },

    {
      "id": 6825,
      "name": "维西县",
      "parentId": 4108,
      "districtList": [] }] }] },





{
  "id": 26,
  "name": "西藏",
  "parentId": 0,
  "districtList": [{
    "id": 2951,
    "name": "拉萨市",
    "parentId": 26,
    "districtList": [{
      "id": 2952,
      "name": "城关区",
      "parentId": 2951,
      "districtList": [] },

    {
      "id": 3123,
      "name": "林周县",
      "parentId": 2951,
      "districtList": [] },

    {
      "id": 3918,
      "name": "当雄县",
      "parentId": 2951,
      "districtList": [] },

    {
      "id": 3919,
      "name": "尼木县",
      "parentId": 2951,
      "districtList": [] },

    {
      "id": 3920,
      "name": "曲水县",
      "parentId": 2951,
      "districtList": [] },

    {
      "id": 3921,
      "name": "堆龙德庆区",
      "parentId": 2951,
      "districtList": [] },

    {
      "id": 3922,
      "name": "达孜县",
      "parentId": 2951,
      "districtList": [] },

    {
      "id": 3923,
      "name": "墨竹工卡县",
      "parentId": 2951,
      "districtList": [] }] },



  {
    "id": 3107,
    "name": "那曲地区",
    "parentId": 26,
    "districtList": [{
      "id": 3108,
      "name": "索县",
      "parentId": 3107,
      "districtList": [] },

    {
      "id": 3961,
      "name": "那曲县",
      "parentId": 3107,
      "districtList": [] },

    {
      "id": 3962,
      "name": "嘉黎县",
      "parentId": 3107,
      "districtList": [] },

    {
      "id": 3963,
      "name": "比如县",
      "parentId": 3107,
      "districtList": [] },

    {
      "id": 3964,
      "name": "聂荣县",
      "parentId": 3107,
      "districtList": [] },

    {
      "id": 3965,
      "name": "安多县",
      "parentId": 3107,
      "districtList": [] },

    {
      "id": 3966,
      "name": "申扎县",
      "parentId": 3107,
      "districtList": [] },

    {
      "id": 3967,
      "name": "班戈县",
      "parentId": 3107,
      "districtList": [] },

    {
      "id": 3968,
      "name": "巴青县",
      "parentId": 3107,
      "districtList": [] },

    {
      "id": 3969,
      "name": "尼玛县",
      "parentId": 3107,
      "districtList": [] },

    {
      "id": 53091,
      "name": "双湖县",
      "parentId": 3107,
      "districtList": [] }] },



  {
    "id": 3129,
    "name": "山南地区",
    "parentId": 26,
    "districtList": [{
      "id": 3130,
      "name": "贡嘎县",
      "parentId": 3129,
      "districtList": [] },

    {
      "id": 3934,
      "name": "扎囊县",
      "parentId": 3129,
      "districtList": [] },

    {
      "id": 3935,
      "name": "乃东区",
      "parentId": 3129,
      "districtList": [] },

    {
      "id": 3936,
      "name": "桑日县",
      "parentId": 3129,
      "districtList": [] },

    {
      "id": 3937,
      "name": "琼结县",
      "parentId": 3129,
      "districtList": [] },

    {
      "id": 3938,
      "name": "曲松县",
      "parentId": 3129,
      "districtList": [] },

    {
      "id": 3939,
      "name": "措美县",
      "parentId": 3129,
      "districtList": [] },

    {
      "id": 3940,
      "name": "洛扎县",
      "parentId": 3129,
      "districtList": [] },

    {
      "id": 3941,
      "name": "加查县",
      "parentId": 3129,
      "districtList": [] },

    {
      "id": 3942,
      "name": "隆子县",
      "parentId": 3129,
      "districtList": [] },

    {
      "id": 3943,
      "name": "错那县",
      "parentId": 3129,
      "districtList": [] },

    {
      "id": 3944,
      "name": "浪卡子县",
      "parentId": 3129,
      "districtList": [] }] },



  {
    "id": 3138,
    "name": "昌都地区",
    "parentId": 26,
    "districtList": [{
      "id": 3139,
      "name": "卡若区",
      "parentId": 3138,
      "districtList": [] },

    {
      "id": 3924,
      "name": "江达县",
      "parentId": 3138,
      "districtList": [] },

    {
      "id": 3925,
      "name": "贡觉县",
      "parentId": 3138,
      "districtList": [] },

    {
      "id": 3926,
      "name": "类乌齐县",
      "parentId": 3138,
      "districtList": [] },

    {
      "id": 3927,
      "name": "丁青县",
      "parentId": 3138,
      "districtList": [] },

    {
      "id": 3928,
      "name": "察雅县",
      "parentId": 3138,
      "districtList": [] },

    {
      "id": 3929,
      "name": "八宿县",
      "parentId": 3138,
      "districtList": [] },

    {
      "id": 3930,
      "name": "左贡县",
      "parentId": 3138,
      "districtList": [] },

    {
      "id": 3931,
      "name": "芒康县",
      "parentId": 3138,
      "districtList": [] },

    {
      "id": 3932,
      "name": "洛隆县",
      "parentId": 3138,
      "districtList": [] },

    {
      "id": 3933,
      "name": "边坝县",
      "parentId": 3138,
      "districtList": [] }] },



  {
    "id": 3144,
    "name": "日喀则地区",
    "parentId": 26,
    "districtList": [{
      "id": 3160,
      "name": "聂拉木县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3166,
      "name": "昂仁县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3945,
      "name": "桑珠孜区",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3946,
      "name": "南木林县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3947,
      "name": "江孜县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3948,
      "name": "定日县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3949,
      "name": "萨迦县　",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3950,
      "name": "拉孜县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3951,
      "name": "谢通门县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3952,
      "name": "白朗县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3953,
      "name": "仁布县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3954,
      "name": "康马县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3955,
      "name": "定结县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3956,
      "name": "仲巴县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3957,
      "name": "亚东县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3958,
      "name": "吉隆县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3959,
      "name": "萨嘎县",
      "parentId": 3144,
      "districtList": [] },

    {
      "id": 3960,
      "name": "岗巴县",
      "parentId": 3144,
      "districtList": [] }] },



  {
    "id": 3970,
    "name": "阿里地区",
    "parentId": 26,
    "districtList": [{
      "id": 3972,
      "name": "噶尔县",
      "parentId": 3970,
      "districtList": [] },

    {
      "id": 3973,
      "name": "普兰县",
      "parentId": 3970,
      "districtList": [] },

    {
      "id": 3974,
      "name": "札达县　",
      "parentId": 3970,
      "districtList": [] },

    {
      "id": 3975,
      "name": "日土县",
      "parentId": 3970,
      "districtList": [] },

    {
      "id": 3976,
      "name": "革吉县",
      "parentId": 3970,
      "districtList": [] },

    {
      "id": 3977,
      "name": "改则县",
      "parentId": 3970,
      "districtList": [] },

    {
      "id": 3978,
      "name": "措勤县",
      "parentId": 3970,
      "districtList": [] }] },



  {
    "id": 3971,
    "name": "林芝市",
    "parentId": 26,
    "districtList": [{
      "id": 3979,
      "name": "巴宜区",
      "parentId": 3971,
      "districtList": [] },

    {
      "id": 3980,
      "name": "工布江达县",
      "parentId": 3971,
      "districtList": [] },

    {
      "id": 3981,
      "name": "米林县",
      "parentId": 3971,
      "districtList": [] },

    {
      "id": 3982,
      "name": "墨脱县",
      "parentId": 3971,
      "districtList": [] },

    {
      "id": 3983,
      "name": "波密县",
      "parentId": 3971,
      "districtList": [] },

    {
      "id": 3984,
      "name": "察隅县",
      "parentId": 3971,
      "districtList": [] },

    {
      "id": 3985,
      "name": "朗县",
      "parentId": 3971,
      "districtList": [] }] }] },





{
  "id": 27,
  "name": "陕西",
  "parentId": 0,
  "districtList": [{
    "id": 2376,
    "name": "西安市",
    "parentId": 27,
    "districtList": [{
      "id": 2380,
      "name": "高陵区",
      "parentId": 2376,
      "districtList": [] },

    {
      "id": 2381,
      "name": "蓝田县",
      "parentId": 2376,
      "districtList": [] },

    {
      "id": 2382,
      "name": "鄠邑区",
      "parentId": 2376,
      "districtList": [] },

    {
      "id": 2383,
      "name": "周至县",
      "parentId": 2376,
      "districtList": [] },

    {
      "id": 4343,
      "name": "雁塔区",
      "parentId": 2376,
      "districtList": [] },

    {
      "id": 50230,
      "name": "未央区",
      "parentId": 2376,
      "districtList": [] },

    {
      "id": 50231,
      "name": "长安区",
      "parentId": 2376,
      "districtList": [] },

    {
      "id": 50232,
      "name": "灞桥区",
      "parentId": 2376,
      "districtList": [] },

    {
      "id": 50233,
      "name": "碑林区",
      "parentId": 2376,
      "districtList": [] },

    {
      "id": 50235,
      "name": "莲湖区",
      "parentId": 2376,
      "districtList": [] },

    {
      "id": 50236,
      "name": "临潼区",
      "parentId": 2376,
      "districtList": [] },

    {
      "id": 50237,
      "name": "阎良区",
      "parentId": 2376,
      "districtList": [] },

    {
      "id": 51881,
      "name": "新城区",
      "parentId": 2376,
      "districtList": [] },

    {
      "id": 52075,
      "name": "西安武警工程学院",
      "parentId": 2376,
      "districtList": [] }] },



  {
    "id": 2386,
    "name": "铜川市",
    "parentId": 27,
    "districtList": [{
      "id": 2387,
      "name": "印台区",
      "parentId": 2386,
      "districtList": [] },

    {
      "id": 2388,
      "name": "宜君县",
      "parentId": 2386,
      "districtList": [] },

    {
      "id": 2389,
      "name": "王益区",
      "parentId": 2386,
      "districtList": [] },

    {
      "id": 3989,
      "name": "耀州区",
      "parentId": 2386,
      "districtList": [] }] },



  {
    "id": 2390,
    "name": "宝鸡市",
    "parentId": 27,
    "districtList": [{
      "id": 2392,
      "name": "岐山县",
      "parentId": 2390,
      "districtList": [] },

    {
      "id": 2393,
      "name": "太白县",
      "parentId": 2390,
      "districtList": [] },

    {
      "id": 2394,
      "name": "凤翔县",
      "parentId": 2390,
      "districtList": [] },

    {
      "id": 2395,
      "name": "陇县",
      "parentId": 2390,
      "districtList": [] },

    {
      "id": 2396,
      "name": "麟游县",
      "parentId": 2390,
      "districtList": [] },

    {
      "id": 2397,
      "name": "千阳县",
      "parentId": 2390,
      "districtList": [] },

    {
      "id": 2398,
      "name": "扶风县",
      "parentId": 2390,
      "districtList": [] },

    {
      "id": 2399,
      "name": "凤县",
      "parentId": 2390,
      "districtList": [] },

    {
      "id": 2400,
      "name": "眉县",
      "parentId": 2390,
      "districtList": [] },

    {
      "id": 2401,
      "name": "渭滨区",
      "parentId": 2390,
      "districtList": [] },

    {
      "id": 3990,
      "name": "金台区",
      "parentId": 2390,
      "districtList": [] },

    {
      "id": 40650,
      "name": "陈仓区",
      "parentId": 2390,
      "districtList": [] }] },



  {
    "id": 2402,
    "name": "咸阳市",
    "parentId": 27,
    "districtList": [{
      "id": 2403,
      "name": "兴平市",
      "parentId": 2402,
      "districtList": [] },

    {
      "id": 2404,
      "name": "礼泉县",
      "parentId": 2402,
      "districtList": [] },

    {
      "id": 2405,
      "name": "泾阳县",
      "parentId": 2402,
      "districtList": [] },

    {
      "id": 2406,
      "name": "永寿县",
      "parentId": 2402,
      "districtList": [] },

    {
      "id": 2407,
      "name": "三原县",
      "parentId": 2402,
      "districtList": [] },

    {
      "id": 2408,
      "name": "彬县",
      "parentId": 2402,
      "districtList": [] },

    {
      "id": 2409,
      "name": "旬邑县",
      "parentId": 2402,
      "districtList": [] },

    {
      "id": 2411,
      "name": "长武县",
      "parentId": 2402,
      "districtList": [] },

    {
      "id": 2412,
      "name": "乾县",
      "parentId": 2402,
      "districtList": [] },

    {
      "id": 2413,
      "name": "武功县",
      "parentId": 2402,
      "districtList": [] },

    {
      "id": 2414,
      "name": "淳化县",
      "parentId": 2402,
      "districtList": [] },

    {
      "id": 44320,
      "name": "秦都区",
      "parentId": 2402,
      "districtList": [] },

    {
      "id": 44321,
      "name": "渭城区",
      "parentId": 2402,
      "districtList": [] },

    {
      "id": 44514,
      "name": "杨陵区",
      "parentId": 2402,
      "districtList": [] }] },



  {
    "id": 2416,
    "name": "渭南市",
    "parentId": 27,
    "districtList": [{
      "id": 2417,
      "name": "韩城市",
      "parentId": 2416,
      "districtList": [] },

    {
      "id": 2418,
      "name": "华阴市",
      "parentId": 2416,
      "districtList": [] },

    {
      "id": 2419,
      "name": "蒲城县",
      "parentId": 2416,
      "districtList": [] },

    {
      "id": 2420,
      "name": "华县",
      "parentId": 2416,
      "districtList": [] },

    {
      "id": 2421,
      "name": "潼关县",
      "parentId": 2416,
      "districtList": [] },

    {
      "id": 2422,
      "name": "大荔县",
      "parentId": 2416,
      "districtList": [] },

    {
      "id": 2423,
      "name": "澄城县",
      "parentId": 2416,
      "districtList": [] },

    {
      "id": 2424,
      "name": "合阳县",
      "parentId": 2416,
      "districtList": [] },

    {
      "id": 2425,
      "name": "白水县",
      "parentId": 2416,
      "districtList": [] },

    {
      "id": 2426,
      "name": "富平县",
      "parentId": 2416,
      "districtList": [] },

    {
      "id": 38094,
      "name": "临渭区",
      "parentId": 2416,
      "districtList": [] }] },



  {
    "id": 2428,
    "name": "延安市",
    "parentId": 27,
    "districtList": [{
      "id": 2429,
      "name": "安塞县",
      "parentId": 2428,
      "districtList": [] },

    {
      "id": 2430,
      "name": "洛川县",
      "parentId": 2428,
      "districtList": [] },

    {
      "id": 2431,
      "name": "子长县",
      "parentId": 2428,
      "districtList": [] },

    {
      "id": 2432,
      "name": "黄陵县",
      "parentId": 2428,
      "districtList": [] },

    {
      "id": 2433,
      "name": "延长县",
      "parentId": 2428,
      "districtList": [] },

    {
      "id": 2434,
      "name": "宜川县",
      "parentId": 2428,
      "districtList": [] },

    {
      "id": 2435,
      "name": "延川县",
      "parentId": 2428,
      "districtList": [] },

    {
      "id": 2436,
      "name": "甘泉县",
      "parentId": 2428,
      "districtList": [] },

    {
      "id": 2437,
      "name": "富县",
      "parentId": 2428,
      "districtList": [] },

    {
      "id": 2438,
      "name": "志丹县",
      "parentId": 2428,
      "districtList": [] },

    {
      "id": 2439,
      "name": "黄龙县",
      "parentId": 2428,
      "districtList": [] },

    {
      "id": 2440,
      "name": "吴起县",
      "parentId": 2428,
      "districtList": [] },

    {
      "id": 31523,
      "name": "宝塔区",
      "parentId": 2428,
      "districtList": [] }] },



  {
    "id": 2442,
    "name": "汉中市",
    "parentId": 27,
    "districtList": [{
      "id": 2443,
      "name": "南郑县",
      "parentId": 2442,
      "districtList": [] },

    {
      "id": 2444,
      "name": "城固县",
      "parentId": 2442,
      "districtList": [] },

    {
      "id": 2445,
      "name": "洋县",
      "parentId": 2442,
      "districtList": [] },

    {
      "id": 2446,
      "name": "佛坪县",
      "parentId": 2442,
      "districtList": [] },

    {
      "id": 2447,
      "name": "留坝县",
      "parentId": 2442,
      "districtList": [] },

    {
      "id": 2448,
      "name": "镇巴县",
      "parentId": 2442,
      "districtList": [] },

    {
      "id": 2449,
      "name": "西乡县",
      "parentId": 2442,
      "districtList": [] },

    {
      "id": 2450,
      "name": "勉县",
      "parentId": 2442,
      "districtList": [] },

    {
      "id": 2451,
      "name": "略阳县",
      "parentId": 2442,
      "districtList": [] },

    {
      "id": 2452,
      "name": "宁强县",
      "parentId": 2442,
      "districtList": [] },

    {
      "id": 31864,
      "name": "汉台区",
      "parentId": 2442,
      "districtList": [] },

    {
      "id": 53107,
      "name": "经济开发区南区",
      "parentId": 2442,
      "districtList": [] }] },



  {
    "id": 2454,
    "name": "榆林市",
    "parentId": 27,
    "districtList": [{
      "id": 2456,
      "name": "清涧县",
      "parentId": 2454,
      "districtList": [] },

    {
      "id": 2457,
      "name": "绥德县",
      "parentId": 2454,
      "districtList": [] },

    {
      "id": 2459,
      "name": "佳县",
      "parentId": 2454,
      "districtList": [] },

    {
      "id": 2460,
      "name": "神木市",
      "parentId": 2454,
      "districtList": [] },

    {
      "id": 2461,
      "name": "府谷县",
      "parentId": 2454,
      "districtList": [] },

    {
      "id": 2462,
      "name": "子洲县",
      "parentId": 2454,
      "districtList": [] },

    {
      "id": 2464,
      "name": "横山县",
      "parentId": 2454,
      "districtList": [] },

    {
      "id": 2465,
      "name": "米脂县",
      "parentId": 2454,
      "districtList": [] },

    {
      "id": 2466,
      "name": "吴堡县",
      "parentId": 2454,
      "districtList": [] },

    {
      "id": 2467,
      "name": "定边县",
      "parentId": 2454,
      "districtList": [] },

    {
      "id": 4081,
      "name": "靖边县",
      "parentId": 2454,
      "districtList": [] },

    {
      "id": 31680,
      "name": "榆阳区",
      "parentId": 2454,
      "districtList": [] }] },



  {
    "id": 2468,
    "name": "商洛市",
    "parentId": 27,
    "districtList": [{
      "id": 2469,
      "name": "商州区",
      "parentId": 2468,
      "districtList": [] },

    {
      "id": 2470,
      "name": "镇安县",
      "parentId": 2468,
      "districtList": [] },

    {
      "id": 2471,
      "name": "山阳县",
      "parentId": 2468,
      "districtList": [] },

    {
      "id": 2472,
      "name": "洛南县",
      "parentId": 2468,
      "districtList": [] },

    {
      "id": 2473,
      "name": "商南县",
      "parentId": 2468,
      "districtList": [] },

    {
      "id": 2474,
      "name": "丹凤县",
      "parentId": 2468,
      "districtList": [] },

    {
      "id": 2475,
      "name": "柞水县",
      "parentId": 2468,
      "districtList": [] }] },



  {
    "id": 2476,
    "name": "安康市",
    "parentId": 27,
    "districtList": [{
      "id": 2478,
      "name": "紫阳县",
      "parentId": 2476,
      "districtList": [] },

    {
      "id": 2479,
      "name": "岚皋县",
      "parentId": 2476,
      "districtList": [] },

    {
      "id": 2480,
      "name": "旬阳县",
      "parentId": 2476,
      "districtList": [] },

    {
      "id": 2481,
      "name": "镇坪县",
      "parentId": 2476,
      "districtList": [] },

    {
      "id": 2482,
      "name": "平利县",
      "parentId": 2476,
      "districtList": [] },

    {
      "id": 2483,
      "name": "宁陕县",
      "parentId": 2476,
      "districtList": [] },

    {
      "id": 2484,
      "name": "汉阴县",
      "parentId": 2476,
      "districtList": [] },

    {
      "id": 2485,
      "name": "石泉县",
      "parentId": 2476,
      "districtList": [] },

    {
      "id": 2486,
      "name": "白河县",
      "parentId": 2476,
      "districtList": [] },

    {
      "id": 3993,
      "name": "汉滨区",
      "parentId": 2476,
      "districtList": [] }] }] },





{
  "id": 28,
  "name": "甘肃",
  "parentId": 0,
  "districtList": [{
    "id": 2487,
    "name": "兰州市",
    "parentId": 28,
    "districtList": [{
      "id": 2488,
      "name": "永登县",
      "parentId": 2487,
      "districtList": [] },

    {
      "id": 2489,
      "name": "榆中县",
      "parentId": 2487,
      "districtList": [] },

    {
      "id": 2490,
      "name": "皋兰县",
      "parentId": 2487,
      "districtList": [] },

    {
      "id": 3995,
      "name": "西固区",
      "parentId": 2487,
      "districtList": [] },

    {
      "id": 3997,
      "name": "红古区",
      "parentId": 2487,
      "districtList": [] },

    {
      "id": 21646,
      "name": "七里河区",
      "parentId": 2487,
      "districtList": [] },

    {
      "id": 21647,
      "name": "安宁区",
      "parentId": 2487,
      "districtList": [] },

    {
      "id": 21648,
      "name": "城关区",
      "parentId": 2487,
      "districtList": [] }] },



  {
    "id": 2492,
    "name": "金昌市",
    "parentId": 28,
    "districtList": [{
      "id": 2493,
      "name": "永昌县",
      "parentId": 2492,
      "districtList": [] },

    {
      "id": 2494,
      "name": "金川区",
      "parentId": 2492,
      "districtList": [] }] },



  {
    "id": 2495,
    "name": "白银市",
    "parentId": 28,
    "districtList": [{
      "id": 2496,
      "name": "白银区",
      "parentId": 2495,
      "districtList": [] },

    {
      "id": 2497,
      "name": "平川区",
      "parentId": 2495,
      "districtList": [] },

    {
      "id": 2498,
      "name": "靖远县",
      "parentId": 2495,
      "districtList": [] },

    {
      "id": 2499,
      "name": "景泰县",
      "parentId": 2495,
      "districtList": [] },

    {
      "id": 2500,
      "name": "会宁县",
      "parentId": 2495,
      "districtList": [] }] },



  {
    "id": 2501,
    "name": "天水市",
    "parentId": 28,
    "districtList": [{
      "id": 2504,
      "name": "甘谷县",
      "parentId": 2501,
      "districtList": [] },

    {
      "id": 2505,
      "name": "武山县",
      "parentId": 2501,
      "districtList": [] },

    {
      "id": 2506,
      "name": "清水县",
      "parentId": 2501,
      "districtList": [] },

    {
      "id": 2507,
      "name": "秦安县",
      "parentId": 2501,
      "districtList": [] },

    {
      "id": 2508,
      "name": "张家川县",
      "parentId": 2501,
      "districtList": [] },

    {
      "id": 21644,
      "name": "麦积区",
      "parentId": 2501,
      "districtList": [] },

    {
      "id": 21645,
      "name": "秦州区",
      "parentId": 2501,
      "districtList": [] }] },



  {
    "id": 2509,
    "name": "嘉峪关市",
    "parentId": 28,
    "districtList": [{
      "id": 2970,
      "name": "雄关区",
      "parentId": 2509,
      "districtList": [] },

    {
      "id": 16899,
      "name": "长城区",
      "parentId": 2509,
      "districtList": [] },

    {
      "id": 16923,
      "name": "镜铁区",
      "parentId": 2509,
      "districtList": [] }] },



  {
    "id": 2518,
    "name": "平凉市",
    "parentId": 28,
    "districtList": [{
      "id": 2519,
      "name": "华亭县",
      "parentId": 2518,
      "districtList": [] },

    {
      "id": 2520,
      "name": "崇信县",
      "parentId": 2518,
      "districtList": [] },

    {
      "id": 2521,
      "name": "泾川县",
      "parentId": 2518,
      "districtList": [] },

    {
      "id": 2522,
      "name": "灵台县",
      "parentId": 2518,
      "districtList": [] },

    {
      "id": 2524,
      "name": "庄浪县",
      "parentId": 2518,
      "districtList": [] },

    {
      "id": 3023,
      "name": "崆峒区",
      "parentId": 2518,
      "districtList": [] },

    {
      "id": 3998,
      "name": "静宁县",
      "parentId": 2518,
      "districtList": [] }] },



  {
    "id": 2525,
    "name": "庆阳市",
    "parentId": 28,
    "districtList": [{
      "id": 2526,
      "name": "西峰区",
      "parentId": 2525,
      "districtList": [] },

    {
      "id": 2528,
      "name": "镇原县",
      "parentId": 2525,
      "districtList": [] },

    {
      "id": 2529,
      "name": "合水县",
      "parentId": 2525,
      "districtList": [] },

    {
      "id": 2530,
      "name": "华池县",
      "parentId": 2525,
      "districtList": [] },

    {
      "id": 2531,
      "name": "环县",
      "parentId": 2525,
      "districtList": [] },

    {
      "id": 2532,
      "name": "宁县",
      "parentId": 2525,
      "districtList": [] },

    {
      "id": 2533,
      "name": "正宁县",
      "parentId": 2525,
      "districtList": [] },

    {
      "id": 4001,
      "name": "庆城县",
      "parentId": 2525,
      "districtList": [] }] },



  {
    "id": 2534,
    "name": "陇南市",
    "parentId": 28,
    "districtList": [{
      "id": 2535,
      "name": "成县",
      "parentId": 2534,
      "districtList": [] },

    {
      "id": 2536,
      "name": "礼县",
      "parentId": 2534,
      "districtList": [] },

    {
      "id": 2537,
      "name": "康县",
      "parentId": 2534,
      "districtList": [] },

    {
      "id": 2538,
      "name": "武都区",
      "parentId": 2534,
      "districtList": [] },

    {
      "id": 2539,
      "name": "文县",
      "parentId": 2534,
      "districtList": [] },

    {
      "id": 2540,
      "name": "两当县",
      "parentId": 2534,
      "districtList": [] },

    {
      "id": 2541,
      "name": "徽县",
      "parentId": 2534,
      "districtList": [] },

    {
      "id": 2542,
      "name": "宕昌县",
      "parentId": 2534,
      "districtList": [] },

    {
      "id": 2543,
      "name": "西和县",
      "parentId": 2534,
      "districtList": [] }] },



  {
    "id": 2544,
    "name": "武威市",
    "parentId": 28,
    "districtList": [{
      "id": 2545,
      "name": "凉州区",
      "parentId": 2544,
      "districtList": [] },

    {
      "id": 2546,
      "name": "古浪县",
      "parentId": 2544,
      "districtList": [] },

    {
      "id": 2547,
      "name": "天祝县",
      "parentId": 2544,
      "districtList": [] },

    {
      "id": 2548,
      "name": "民勤县",
      "parentId": 2544,
      "districtList": [] }] },



  {
    "id": 2549,
    "name": "张掖市",
    "parentId": 28,
    "districtList": [{
      "id": 2550,
      "name": "甘州区",
      "parentId": 2549,
      "districtList": [] },

    {
      "id": 2551,
      "name": "山丹县",
      "parentId": 2549,
      "districtList": [] },

    {
      "id": 2552,
      "name": "临泽县",
      "parentId": 2549,
      "districtList": [] },

    {
      "id": 2553,
      "name": "高台县",
      "parentId": 2549,
      "districtList": [] },

    {
      "id": 2554,
      "name": "肃南县",
      "parentId": 2549,
      "districtList": [] },

    {
      "id": 2555,
      "name": "民乐县",
      "parentId": 2549,
      "districtList": [] }] },



  {
    "id": 2556,
    "name": "酒泉市",
    "parentId": 28,
    "districtList": [{
      "id": 2558,
      "name": "玉门市",
      "parentId": 2556,
      "districtList": [] },

    {
      "id": 2559,
      "name": "敦煌市",
      "parentId": 2556,
      "districtList": [] },

    {
      "id": 2560,
      "name": "金塔县",
      "parentId": 2556,
      "districtList": [] },

    {
      "id": 2562,
      "name": "阿克塞县",
      "parentId": 2556,
      "districtList": [] },

    {
      "id": 2563,
      "name": "肃北县",
      "parentId": 2556,
      "districtList": [] },

    {
      "id": 3999,
      "name": "瓜州县",
      "parentId": 2556,
      "districtList": [] },

    {
      "id": 4000,
      "name": "肃州区",
      "parentId": 2556,
      "districtList": [] }] },



  {
    "id": 2564,
    "name": "甘南州",
    "parentId": 28,
    "districtList": [{
      "id": 2565,
      "name": "合作市",
      "parentId": 2564,
      "districtList": [] },

    {
      "id": 2566,
      "name": "夏河县",
      "parentId": 2564,
      "districtList": [] },

    {
      "id": 2567,
      "name": "碌曲县",
      "parentId": 2564,
      "districtList": [] },

    {
      "id": 2568,
      "name": "舟曲县",
      "parentId": 2564,
      "districtList": [] },

    {
      "id": 2569,
      "name": "玛曲县",
      "parentId": 2564,
      "districtList": [] },

    {
      "id": 2570,
      "name": "迭部县",
      "parentId": 2564,
      "districtList": [] },

    {
      "id": 2571,
      "name": "临潭县",
      "parentId": 2564,
      "districtList": [] },

    {
      "id": 2572,
      "name": "卓尼县",
      "parentId": 2564,
      "districtList": [] }] },



  {
    "id": 2573,
    "name": "临夏州",
    "parentId": 28,
    "districtList": [{
      "id": 2574,
      "name": "临夏县",
      "parentId": 2573,
      "districtList": [] },

    {
      "id": 2575,
      "name": "康乐县",
      "parentId": 2573,
      "districtList": [] },

    {
      "id": 2576,
      "name": "永靖县",
      "parentId": 2573,
      "districtList": [] },

    {
      "id": 2577,
      "name": "和政县",
      "parentId": 2573,
      "districtList": [] },

    {
      "id": 2578,
      "name": "东乡族自治县",
      "parentId": 2573,
      "districtList": [] },

    {
      "id": 2579,
      "name": "积石山县",
      "parentId": 2573,
      "districtList": [] },

    {
      "id": 3175,
      "name": "临夏市",
      "parentId": 2573,
      "districtList": [] },

    {
      "id": 4008,
      "name": "广河县",
      "parentId": 2573,
      "districtList": [] }] },



  {
    "id": 3080,
    "name": "定西市",
    "parentId": 28,
    "districtList": [{
      "id": 3081,
      "name": "岷县",
      "parentId": 3080,
      "districtList": [] },

    {
      "id": 4002,
      "name": "安定区",
      "parentId": 3080,
      "districtList": [] },

    {
      "id": 4003,
      "name": "通渭县",
      "parentId": 3080,
      "districtList": [] },

    {
      "id": 4004,
      "name": "临洮县",
      "parentId": 3080,
      "districtList": [] },

    {
      "id": 4005,
      "name": "漳县",
      "parentId": 3080,
      "districtList": [] },

    {
      "id": 4006,
      "name": "渭源县",
      "parentId": 3080,
      "districtList": [] },

    {
      "id": 4007,
      "name": "陇西县",
      "parentId": 3080,
      "districtList": [] }] }] },





{
  "id": 29,
  "name": "青海",
  "parentId": 0,
  "districtList": [{
    "id": 2580,
    "name": "西宁市",
    "parentId": 29,
    "districtList": [{
      "id": 2581,
      "name": "湟中县",
      "parentId": 2580,
      "districtList": [] },

    {
      "id": 2582,
      "name": "湟源县",
      "parentId": 2580,
      "districtList": [] },

    {
      "id": 2583,
      "name": "大通县",
      "parentId": 2580,
      "districtList": [] },

    {
      "id": 21652,
      "name": "城中区",
      "parentId": 2580,
      "districtList": [] },

    {
      "id": 21653,
      "name": "城东区",
      "parentId": 2580,
      "districtList": [] },

    {
      "id": 21654,
      "name": "城西区",
      "parentId": 2580,
      "districtList": [] },

    {
      "id": 21655,
      "name": "城北区",
      "parentId": 2580,
      "districtList": [] }] },



  {
    "id": 2585,
    "name": "海东地区",
    "parentId": 29,
    "districtList": [{
      "id": 2586,
      "name": "平安县",
      "parentId": 2585,
      "districtList": [] },

    {
      "id": 2587,
      "name": "乐都县",
      "parentId": 2585,
      "districtList": [] },

    {
      "id": 2588,
      "name": "民和县",
      "parentId": 2585,
      "districtList": [] },

    {
      "id": 2589,
      "name": "互助县",
      "parentId": 2585,
      "districtList": [] },

    {
      "id": 2590,
      "name": "化隆县",
      "parentId": 2585,
      "districtList": [] },

    {
      "id": 2591,
      "name": "循化县",
      "parentId": 2585,
      "districtList": [] }] },



  {
    "id": 2592,
    "name": "海北州",
    "parentId": 29,
    "districtList": [{
      "id": 2593,
      "name": "海晏县",
      "parentId": 2592,
      "districtList": [] },

    {
      "id": 2594,
      "name": "祁连县",
      "parentId": 2592,
      "districtList": [] },

    {
      "id": 2595,
      "name": "刚察县",
      "parentId": 2592,
      "districtList": [] },

    {
      "id": 2596,
      "name": "门源县",
      "parentId": 2592,
      "districtList": [] }] },



  {
    "id": 2597,
    "name": "黄南州",
    "parentId": 29,
    "districtList": [{
      "id": 2598,
      "name": "尖扎县",
      "parentId": 2597,
      "districtList": [] },

    {
      "id": 2599,
      "name": "同仁县",
      "parentId": 2597,
      "districtList": [] },

    {
      "id": 2600,
      "name": "泽库县",
      "parentId": 2597,
      "districtList": [] },

    {
      "id": 2602,
      "name": "河南县",
      "parentId": 2597,
      "districtList": [] }] },



  {
    "id": 2603,
    "name": "海南州",
    "parentId": 29,
    "districtList": [{
      "id": 4012,
      "name": "共和县",
      "parentId": 2603,
      "districtList": [] },

    {
      "id": 4013,
      "name": "同德县",
      "parentId": 2603,
      "districtList": [] },

    {
      "id": 4014,
      "name": "贵德县",
      "parentId": 2603,
      "districtList": [] },

    {
      "id": 4015,
      "name": "兴海县",
      "parentId": 2603,
      "districtList": [] },

    {
      "id": 4016,
      "name": "贵南县",
      "parentId": 2603,
      "districtList": [] }] },



  {
    "id": 2605,
    "name": "果洛州",
    "parentId": 29,
    "districtList": [{
      "id": 2606,
      "name": "玛沁县",
      "parentId": 2605,
      "districtList": [] },

    {
      "id": 2607,
      "name": "甘德县",
      "parentId": 2605,
      "districtList": [] },

    {
      "id": 2608,
      "name": "达日县",
      "parentId": 2605,
      "districtList": [] },

    {
      "id": 2609,
      "name": "班玛县",
      "parentId": 2605,
      "districtList": [] },

    {
      "id": 2610,
      "name": "久治县",
      "parentId": 2605,
      "districtList": [] },

    {
      "id": 2611,
      "name": "玛多县",
      "parentId": 2605,
      "districtList": [] }] },



  {
    "id": 2612,
    "name": "玉树州",
    "parentId": 29,
    "districtList": [{
      "id": 2613,
      "name": "玉树县",
      "parentId": 2612,
      "districtList": [] },

    {
      "id": 2614,
      "name": "称多县",
      "parentId": 2612,
      "districtList": [] },

    {
      "id": 2615,
      "name": "囊谦县",
      "parentId": 2612,
      "districtList": [] },

    {
      "id": 2616,
      "name": "杂多县",
      "parentId": 2612,
      "districtList": [] },

    {
      "id": 2617,
      "name": "治多县",
      "parentId": 2612,
      "districtList": [] },

    {
      "id": 2618,
      "name": "曲麻莱县",
      "parentId": 2612,
      "districtList": [] }] },



  {
    "id": 2620,
    "name": "海西州",
    "parentId": 29,
    "districtList": [{
      "id": 2621,
      "name": "德令哈市",
      "parentId": 2620,
      "districtList": [] },

    {
      "id": 2622,
      "name": "乌兰县",
      "parentId": 2620,
      "districtList": [] },

    {
      "id": 2623,
      "name": "天峻县",
      "parentId": 2620,
      "districtList": [] },

    {
      "id": 2624,
      "name": "都兰县",
      "parentId": 2620,
      "districtList": [] },

    {
      "id": 2625,
      "name": "大柴旦行委",
      "parentId": 2620,
      "districtList": [] },

    {
      "id": 2626,
      "name": "冷湖行委",
      "parentId": 2620,
      "districtList": [] },

    {
      "id": 2627,
      "name": "茫崖行委",
      "parentId": 2620,
      "districtList": [] },

    {
      "id": 3021,
      "name": "格尔木市",
      "parentId": 2620,
      "districtList": [] }] }] },





{
  "id": 30,
  "name": "宁夏",
  "parentId": 0,
  "districtList": [{
    "id": 2628,
    "name": "银川市",
    "parentId": 30,
    "districtList": [{
      "id": 2629,
      "name": "灵武市",
      "parentId": 2628,
      "districtList": [] },

    {
      "id": 2630,
      "name": "永宁县",
      "parentId": 2628,
      "districtList": [] },

    {
      "id": 2631,
      "name": "贺兰县",
      "parentId": 2628,
      "districtList": [] },

    {
      "id": 21649,
      "name": "兴庆区",
      "parentId": 2628,
      "districtList": [] },

    {
      "id": 21650,
      "name": "金凤区",
      "parentId": 2628,
      "districtList": [] },

    {
      "id": 21651,
      "name": "西夏区",
      "parentId": 2628,
      "districtList": [] }] },



  {
    "id": 2632,
    "name": "石嘴山市",
    "parentId": 30,
    "districtList": [{
      "id": 2633,
      "name": "平罗县",
      "parentId": 2632,
      "districtList": [] },

    {
      "id": 2635,
      "name": "惠农区",
      "parentId": 2632,
      "districtList": [] },

    {
      "id": 2636,
      "name": "大武口区",
      "parentId": 2632,
      "districtList": [] }] },



  {
    "id": 2637,
    "name": "吴忠市",
    "parentId": 30,
    "districtList": [{
      "id": 2638,
      "name": "青铜峡市",
      "parentId": 2637,
      "districtList": [] },

    {
      "id": 2641,
      "name": "同心县",
      "parentId": 2637,
      "districtList": [] },

    {
      "id": 2642,
      "name": "盐池县",
      "parentId": 2637,
      "districtList": [] },

    {
      "id": 2643,
      "name": "红寺堡开发区",
      "parentId": 2637,
      "districtList": [] },

    {
      "id": 2966,
      "name": "利通区",
      "parentId": 2637,
      "districtList": [] }] },



  {
    "id": 2644,
    "name": "固原市",
    "parentId": 30,
    "districtList": [{
      "id": 2647,
      "name": "西吉县",
      "parentId": 2644,
      "districtList": [] },

    {
      "id": 2648,
      "name": "隆德县",
      "parentId": 2644,
      "districtList": [] },

    {
      "id": 2649,
      "name": "泾源县",
      "parentId": 2644,
      "districtList": [] },

    {
      "id": 2650,
      "name": "彭阳县",
      "parentId": 2644,
      "districtList": [] },

    {
      "id": 2651,
      "name": "原州区",
      "parentId": 2644,
      "districtList": [] }] },



  {
    "id": 3071,
    "name": "中卫市",
    "parentId": 30,
    "districtList": [{
      "id": 3072,
      "name": "中宁县",
      "parentId": 3071,
      "districtList": [] },

    {
      "id": 3148,
      "name": "海原县",
      "parentId": 3071,
      "districtList": [] },

    {
      "id": 4020,
      "name": "沙坡头区",
      "parentId": 3071,
      "districtList": [] }] }] },





{
  "id": 31,
  "name": "新疆",
  "parentId": 0,
  "districtList": [{
    "id": 2652,
    "name": "乌鲁木齐市",
    "parentId": 31,
    "districtList": [{
      "id": 2653,
      "name": "乌鲁木齐县",
      "parentId": 2652,
      "districtList": [] },

    {
      "id": 4024,
      "name": "头屯河区",
      "parentId": 2652,
      "districtList": [] },

    {
      "id": 4025,
      "name": "达坂城区",
      "parentId": 2652,
      "districtList": [] },

    {
      "id": 4026,
      "name": "米东区",
      "parentId": 2652,
      "districtList": [] },

    {
      "id": 36684,
      "name": "天山区",
      "parentId": 2652,
      "districtList": [] },

    {
      "id": 36685,
      "name": "新市区",
      "parentId": 2652,
      "districtList": [] },

    {
      "id": 36686,
      "name": "沙依巴克区",
      "parentId": 2652,
      "districtList": [] },

    {
      "id": 36687,
      "name": "水磨沟区",
      "parentId": 2652,
      "districtList": [] }] },



  {
    "id": 2654,
    "name": "克拉玛依市",
    "parentId": 31,
    "districtList": [{
      "id": 2655,
      "name": "克拉玛依区",
      "parentId": 2654,
      "districtList": [] },

    {
      "id": 2930,
      "name": "独山子区",
      "parentId": 2654,
      "districtList": [] },

    {
      "id": 3006,
      "name": "白碱滩区",
      "parentId": 2654,
      "districtList": [] },

    {
      "id": 4027,
      "name": "乌尔禾区",
      "parentId": 2654,
      "districtList": [] }] },



  {
    "id": 2656,
    "name": "石河子市",
    "parentId": 31,
    "districtList": [{
      "id": 2657,
      "name": "石河子市",
      "parentId": 2656,
      "districtList": [] }] },


  {
    "id": 2658,
    "name": "吐鲁番地区",
    "parentId": 31,
    "districtList": [{
      "id": 2659,
      "name": "吐鲁番市",
      "parentId": 2658,
      "districtList": [] },

    {
      "id": 2660,
      "name": "托克逊县",
      "parentId": 2658,
      "districtList": [] },

    {
      "id": 2661,
      "name": "鄯善县",
      "parentId": 2658,
      "districtList": [] }] },



  {
    "id": 2662,
    "name": "哈密地区",
    "parentId": 31,
    "districtList": [{
      "id": 2663,
      "name": "哈密市",
      "parentId": 2662,
      "districtList": [] },

    {
      "id": 2664,
      "name": "巴里坤县",
      "parentId": 2662,
      "districtList": [] },

    {
      "id": 2665,
      "name": "伊吾县",
      "parentId": 2662,
      "districtList": [] }] },



  {
    "id": 2666,
    "name": "和田地区",
    "parentId": 31,
    "districtList": [{
      "id": 2667,
      "name": "和田市",
      "parentId": 2666,
      "districtList": [] },

    {
      "id": 2669,
      "name": "墨玉县",
      "parentId": 2666,
      "districtList": [] },

    {
      "id": 2670,
      "name": "洛浦县",
      "parentId": 2666,
      "districtList": [] },

    {
      "id": 2671,
      "name": "策勒县",
      "parentId": 2666,
      "districtList": [] },

    {
      "id": 2672,
      "name": "于田县",
      "parentId": 2666,
      "districtList": [] },

    {
      "id": 2673,
      "name": "民丰县",
      "parentId": 2666,
      "districtList": [] },

    {
      "id": 2674,
      "name": "皮山县",
      "parentId": 2666,
      "districtList": [] },

    {
      "id": 14848,
      "name": "和田县",
      "parentId": 2666,
      "districtList": [] }] },



  {
    "id": 2675,
    "name": "阿克苏地区",
    "parentId": 31,
    "districtList": [{
      "id": 2676,
      "name": "阿克苏市",
      "parentId": 2675,
      "districtList": [] },

    {
      "id": 2678,
      "name": "温宿县",
      "parentId": 2675,
      "districtList": [] },

    {
      "id": 2679,
      "name": "沙雅县",
      "parentId": 2675,
      "districtList": [] },

    {
      "id": 2680,
      "name": "拜城县",
      "parentId": 2675,
      "districtList": [] },

    {
      "id": 2681,
      "name": "阿瓦提县",
      "parentId": 2675,
      "districtList": [] },

    {
      "id": 2682,
      "name": "库车县",
      "parentId": 2675,
      "districtList": [] },

    {
      "id": 2683,
      "name": "柯坪县",
      "parentId": 2675,
      "districtList": [] },

    {
      "id": 2684,
      "name": "新和县",
      "parentId": 2675,
      "districtList": [] },

    {
      "id": 2685,
      "name": "乌什县",
      "parentId": 2675,
      "districtList": [] }] },



  {
    "id": 2686,
    "name": "喀什地区",
    "parentId": 31,
    "districtList": [{
      "id": 2687,
      "name": "喀什市",
      "parentId": 2686,
      "districtList": [] },

    {
      "id": 2688,
      "name": "巴楚县",
      "parentId": 2686,
      "districtList": [] },

    {
      "id": 2689,
      "name": "泽普县",
      "parentId": 2686,
      "districtList": [] },

    {
      "id": 2690,
      "name": "伽师县",
      "parentId": 2686,
      "districtList": [] },

    {
      "id": 2691,
      "name": "叶城县",
      "parentId": 2686,
      "districtList": [] },

    {
      "id": 2692,
      "name": "岳普湖县",
      "parentId": 2686,
      "districtList": [] },

    {
      "id": 2693,
      "name": "疏附县",
      "parentId": 2686,
      "districtList": [] },

    {
      "id": 2694,
      "name": "疏勒县",
      "parentId": 2686,
      "districtList": [] },

    {
      "id": 2695,
      "name": "英吉沙县",
      "parentId": 2686,
      "districtList": [] },

    {
      "id": 2696,
      "name": "麦盖提县",
      "parentId": 2686,
      "districtList": [] },

    {
      "id": 2697,
      "name": "莎车县",
      "parentId": 2686,
      "districtList": [] },

    {
      "id": 2698,
      "name": "塔什库尔干县",
      "parentId": 2686,
      "districtList": [] }] },



  {
    "id": 2699,
    "name": "克孜勒苏柯尔克孜自治州",
    "parentId": 31,
    "districtList": [{
      "id": 2700,
      "name": "阿图什市",
      "parentId": 2699,
      "districtList": [] },

    {
      "id": 2701,
      "name": "阿合奇县",
      "parentId": 2699,
      "districtList": [] },

    {
      "id": 2702,
      "name": "乌恰县",
      "parentId": 2699,
      "districtList": [] },

    {
      "id": 2703,
      "name": "阿克陶县",
      "parentId": 2699,
      "districtList": [] }] },



  {
    "id": 2704,
    "name": "巴音郭楞州",
    "parentId": 31,
    "districtList": [{
      "id": 2705,
      "name": "库尔勒市",
      "parentId": 2704,
      "districtList": [] },

    {
      "id": 2706,
      "name": "尉犁县",
      "parentId": 2704,
      "districtList": [] },

    {
      "id": 2707,
      "name": "和静县",
      "parentId": 2704,
      "districtList": [] },

    {
      "id": 2708,
      "name": "博湖县",
      "parentId": 2704,
      "districtList": [] },

    {
      "id": 2709,
      "name": "和硕县",
      "parentId": 2704,
      "districtList": [] },

    {
      "id": 2710,
      "name": "轮台县",
      "parentId": 2704,
      "districtList": [] },

    {
      "id": 2711,
      "name": "若羌县",
      "parentId": 2704,
      "districtList": [] },

    {
      "id": 2712,
      "name": "且末县",
      "parentId": 2704,
      "districtList": [] },

    {
      "id": 2713,
      "name": "焉耆县",
      "parentId": 2704,
      "districtList": [] }] },



  {
    "id": 2714,
    "name": "昌吉州",
    "parentId": 31,
    "districtList": [{
      "id": 2715,
      "name": "昌吉市",
      "parentId": 2714,
      "districtList": [] },

    {
      "id": 2716,
      "name": "阜康市",
      "parentId": 2714,
      "districtList": [] },

    {
      "id": 2718,
      "name": "奇台县",
      "parentId": 2714,
      "districtList": [] },

    {
      "id": 2719,
      "name": "玛纳斯县",
      "parentId": 2714,
      "districtList": [] },

    {
      "id": 2720,
      "name": "吉木萨尔县",
      "parentId": 2714,
      "districtList": [] },

    {
      "id": 2721,
      "name": "呼图壁县",
      "parentId": 2714,
      "districtList": [] },

    {
      "id": 2722,
      "name": "木垒县",
      "parentId": 2714,
      "districtList": [] }] },



  {
    "id": 2723,
    "name": "博尔塔拉州",
    "parentId": 31,
    "districtList": [{
      "id": 2724,
      "name": "博乐市",
      "parentId": 2723,
      "districtList": [] },

    {
      "id": 2725,
      "name": "精河县",
      "parentId": 2723,
      "districtList": [] },

    {
      "id": 2726,
      "name": "温泉县",
      "parentId": 2723,
      "districtList": [] },

    {
      "id": 52790,
      "name": "阿拉山口市",
      "parentId": 2723,
      "districtList": [] }] },



  {
    "id": 2727,
    "name": "伊犁州",
    "parentId": 31,
    "districtList": [{
      "id": 2728,
      "name": "伊宁市",
      "parentId": 2727,
      "districtList": [] },

    {
      "id": 2729,
      "name": "特克斯县",
      "parentId": 2727,
      "districtList": [] },

    {
      "id": 2730,
      "name": "尼勒克县",
      "parentId": 2727,
      "districtList": [] },

    {
      "id": 2731,
      "name": "昭苏县",
      "parentId": 2727,
      "districtList": [] },

    {
      "id": 2732,
      "name": "新源县",
      "parentId": 2727,
      "districtList": [] },

    {
      "id": 2733,
      "name": "霍城县",
      "parentId": 2727,
      "districtList": [] },

    {
      "id": 2734,
      "name": "察布查尔县",
      "parentId": 2727,
      "districtList": [] },

    {
      "id": 2735,
      "name": "巩留县",
      "parentId": 2727,
      "districtList": [] },

    {
      "id": 4028,
      "name": "奎屯市",
      "parentId": 2727,
      "districtList": [] },

    {
      "id": 4499,
      "name": "伊宁县",
      "parentId": 2727,
      "districtList": [] },

    {
      "id": 53694,
      "name": "霍尔果斯市",
      "parentId": 2727,
      "districtList": [] }] },



  {
    "id": 2736,
    "name": "塔城地区",
    "parentId": 31,
    "districtList": [{
      "id": 2737,
      "name": "塔城市",
      "parentId": 2736,
      "districtList": [] },

    {
      "id": 2738,
      "name": "乌苏市",
      "parentId": 2736,
      "districtList": [] },

    {
      "id": 2739,
      "name": "额敏县",
      "parentId": 2736,
      "districtList": [] },

    {
      "id": 2740,
      "name": "裕民县",
      "parentId": 2736,
      "districtList": [] },

    {
      "id": 2741,
      "name": "沙湾县",
      "parentId": 2736,
      "districtList": [] },

    {
      "id": 2742,
      "name": "托里县",
      "parentId": 2736,
      "districtList": [] },

    {
      "id": 2743,
      "name": "和布克赛尔县",
      "parentId": 2736,
      "districtList": [] }] },



  {
    "id": 2744,
    "name": "阿勒泰地区",
    "parentId": 31,
    "districtList": [{
      "id": 2745,
      "name": "阿勒泰市",
      "parentId": 2744,
      "districtList": [] },

    {
      "id": 2746,
      "name": "富蕴县",
      "parentId": 2744,
      "districtList": [] },

    {
      "id": 2747,
      "name": "青河县",
      "parentId": 2744,
      "districtList": [] },

    {
      "id": 2748,
      "name": "吉木乃县",
      "parentId": 2744,
      "districtList": [] },

    {
      "id": 2749,
      "name": "布尔津县",
      "parentId": 2744,
      "districtList": [] },

    {
      "id": 2750,
      "name": "福海县",
      "parentId": 2744,
      "districtList": [] },

    {
      "id": 2751,
      "name": "哈巴河县",
      "parentId": 2744,
      "districtList": [] },

    {
      "id": 6822,
      "name": "北屯市",
      "parentId": 2744,
      "districtList": [] }] },



  {
    "id": 4110,
    "name": "五家渠市",
    "parentId": 31,
    "districtList": [{
      "id": 4122,
      "name": "五家渠市",
      "parentId": 4110,
      "districtList": [] }] },


  {
    "id": 15945,
    "name": "阿拉尔市",
    "parentId": 31,
    "districtList": [{
      "id": 15948,
      "name": "阿拉尔市",
      "parentId": 15945,
      "districtList": [] }] },


  {
    "id": 15946,
    "name": "图木舒克市",
    "parentId": 31,
    "districtList": [{
      "id": 15947,
      "name": "图木舒克市",
      "parentId": 15946,
      "districtList": [] }] },


  {
    "id": 53090,
    "name": "铁门关市",
    "parentId": 31,
    "districtList": [{
      "id": 53108,
      "name": "铁门关市",
      "parentId": 53090,
      "districtList": [] }] },


  {
    "id": 53668,
    "name": "昆玉市",
    "parentId": 31,
    "districtList": [{
      "id": 53688,
      "name": "昆玉市",
      "parentId": 53668,
      "districtList": [] }] }] },




{
  "id": 32,
  "name": "台湾",
  "parentId": 0,
  "districtList": [{
    "id": 2768,
    "name": "台湾",
    "parentId": 32,
    "districtList": [{
      "id": 53497,
      "name": "彰化",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53498,
      "name": "嘉义",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53499,
      "name": "新竹",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53500,
      "name": "花莲",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53501,
      "name": "宜兰",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53502,
      "name": "高雄",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53503,
      "name": "基隆",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53504,
      "name": "金门",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53505,
      "name": "连江",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53506,
      "name": "苗栗",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53507,
      "name": "南投",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53508,
      "name": "澎湖",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53509,
      "name": "屏东",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53510,
      "name": "台东",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53511,
      "name": "台中",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53512,
      "name": "台南",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53513,
      "name": "台北",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53514,
      "name": "桃园",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53515,
      "name": "云林",
      "parentId": 2768,
      "districtList": [] },

    {
      "id": 53516,
      "name": "新北",
      "parentId": 2768,
      "districtList": [] }] }] },




{
  "id": 84,
  "name": "钓鱼岛",
  "parentId": 0,
  "districtList": [{
    "id": 1310,
    "name": "钓鱼岛",
    "parentId": 84,
    "districtList": [{
      "id": 53262,
      "name": "钓鱼岛县",
      "parentId": 1310,
      "districtList": [] },

    {
      "id": 53263,
      "name": "钓鱼岛县1",
      "parentId": 1310,
      "districtList": [] },

    {
      "id": 53281,
      "name": "钓鱼岛全区",
      "parentId": 1310,
      "districtList": [] }] }] },




{
  "id": 52993,
  "name": "港澳",
  "parentId": 0,
  "districtList": [{
    "id": 52994,
    "name": "香港特别行政区",
    "parentId": 52993,
    "districtList": [{
      "id": 52996,
      "name": "中西区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 52997,
      "name": "东区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 52998,
      "name": "九龙城区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 52999,
      "name": "观塘区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53000,
      "name": "深水埗区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53001,
      "name": "湾仔区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53002,
      "name": "黄大仙区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53003,
      "name": "油尖旺区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53004,
      "name": "离岛区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53005,
      "name": "葵青区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53006,
      "name": "北区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53007,
      "name": "西贡区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53008,
      "name": "沙田区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53009,
      "name": "屯门区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53010,
      "name": "大埔区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53011,
      "name": "荃湾区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53012,
      "name": "元朗区",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53013,
      "name": "香港",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53014,
      "name": "九龙",
      "parentId": 52994,
      "districtList": [] },

    {
      "id": 53015,
      "name": "新界",
      "parentId": 52994,
      "districtList": [] }] },



  {
    "id": 52995,
    "name": "澳门特别行政区",
    "parentId": 52993,
    "districtList": [{
      "id": 53016,
      "name": "澳门特别行政区",
      "parentId": 52995,
      "districtList": [] },

    {
      "id": 53017,
      "name": "澳门半岛",
      "parentId": 52995,
      "districtList": [] },

    {
      "id": 53018,
      "name": "凼仔",
      "parentId": 52995,
      "districtList": [] },

    {
      "id": 53019,
      "name": "路凼城",
      "parentId": 52995,
      "districtList": [] },

    {
      "id": 53020,
      "name": "路环",
      "parentId": 52995,
      "districtList": [] }] }] }];






module.exports = {
  data: cityData };

/***/ })
]]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map