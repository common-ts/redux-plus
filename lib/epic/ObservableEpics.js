"use strict";
var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };
  return function (d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var redux_observable_1 = require("redux-observable");
var rxjs_1 = require("rxjs");
var fromPromise_1 = require("rxjs-compat/observable/fromPromise");
var operators_1 = require("rxjs/operators");
var BaseActionType_1 = require("../action/BaseActionType");
var ViewObservableEpics = (function () {
  function ViewObservableEpics(viewActionType, viewService) {
    this.viewActionType = viewActionType;
    this.viewService = viewService;
    this.load = this.load.bind(this);
  }
  ViewObservableEpics.prototype.load = function (action$) {
    var _this = this;
    return action$.pipe(redux_observable_1.ofType(this.viewActionType.getByIdType), operators_1.flatMap(function (action) {
      var _a = action.payload, parameter = _a.parameter, callback = _a.callback;
      var execute = callback.execute, handleError = callback.handleError;
      return fromPromise_1.fromPromise(_this.viewService.load(parameter)).pipe(operators_1.map(function (res) {
        execute(res);
        return ({
          type: BaseActionType_1.BaseActionType.ACTION_SUCCESS
        });
      }), operators_1.catchError(function (err) {
        handleError(err);
        return null;
      }));
    }));
  };
  return ViewObservableEpics;
}());
exports.ViewObservableEpics = ViewObservableEpics;
var GenericObservableEpics = (function (_super) {
  __extends(GenericObservableEpics, _super);
  function GenericObservableEpics(genericActionType, genericService) {
    var _this = _super.call(this, genericActionType, genericService) || this;
    _this.genericActionType = genericActionType;
    _this.genericService = genericService;
    _this.update = _this.update.bind(_this);
    _this.insert = _this.insert.bind(_this);
    return _this;
  }
  GenericObservableEpics.prototype.update = function (action$) {
    var _this = this;
    return action$.pipe(redux_observable_1.ofType(this.genericActionType.updateType), operators_1.flatMap(function (action) {
      var _a = action.payload, parameter = _a.parameter, callback = _a.callback;
      var execute = callback.execute, handleError = callback.handleError;
      return fromPromise_1.fromPromise(_this.genericService.update(parameter)).pipe(operators_1.map(function (res) {
        execute(res);
        return ({
          type: BaseActionType_1.BaseActionType.ACTION_SUCCESS
        });
      }), operators_1.catchError(function (err) {
        handleError(err);
        return null;
      }));
    }));
  };
  GenericObservableEpics.prototype.insert = function (action$) {
    var _this = this;
    return action$.pipe(redux_observable_1.ofType(this.genericActionType.insertType), operators_1.flatMap(function (action) {
      var _a = action.payload, parameter = _a.parameter, callback = _a.callback;
      var execute = callback.execute, handleError = callback.handleError;
      return fromPromise_1.fromPromise(_this.genericService.insert(parameter)).pipe(operators_1.map(function (res) {
        execute(res);
        return ({
          type: BaseActionType_1.BaseActionType.ACTION_SUCCESS
        });
      }), operators_1.catchError(function (err) {
        handleError(err);
        return null;
      }));
    }));
  };
  GenericObservableEpics.prototype.patch = function (action$) {
    var _this = this;
    return action$.pipe(redux_observable_1.ofType(this.genericActionType.insertType), operators_1.flatMap(function (action) {
      var _a = action.payload, parameter = _a.parameter, body = _a.body, callback = _a.callback;
      var execute = callback.execute, handleError = callback.handleError;
      return fromPromise_1.fromPromise(_this.genericService.patch(parameter, body)).pipe(operators_1.map(function (res) {
        execute(res);
        return ({
          type: BaseActionType_1.BaseActionType.ACTION_SUCCESS
        });
      }), operators_1.catchError(function (err) {
        handleError(err);
        return null;
      }));
    }));
  };
  return GenericObservableEpics;
}(ViewObservableEpics));
exports.GenericObservableEpics = GenericObservableEpics;
var SearchObservableEpics = (function () {
  function SearchObservableEpics(searchActionType, searchService) {
    this.searchActionType = searchActionType;
    this.searchService = searchService;
    this.search = this.search.bind(this);
  }
  SearchObservableEpics.prototype.search = function (action$) {
    var _this = this;
    return action$.pipe(redux_observable_1.ofType(this.searchActionType.searchType), operators_1.flatMap(function (action) {
      var _a = action.payload, searchModel = _a.searchModel, callback = _a.callback;
      return fromPromise_1.fromPromise(_this.searchService.search(searchModel)).pipe(operators_1.map(function (list) {
        callback.showResults(searchModel, list);
        return ({
          type: BaseActionType_1.BaseActionType.ACTION_SUCCESS
        });
      }), operators_1.catchError(function (error) { return rxjs_1.throwError(error); }));
    }));
  };
  return SearchObservableEpics;
}());
exports.SearchObservableEpics = SearchObservableEpics;
var ViewSearchObservableEpics = (function (_super) {
  __extends(ViewSearchObservableEpics, _super);
  function ViewSearchObservableEpics(genericSearchActionType, genericSearchService) {
    var _this = _super.call(this, genericSearchActionType, genericSearchService) || this;
    _this.searchObservableEpics = new SearchObservableEpics(genericSearchActionType, genericSearchService);
    _this.search = _this.search.bind(_this);
    return _this;
  }
  ViewSearchObservableEpics.prototype.search = function (action$) {
    return this.searchObservableEpics.search(action$);
  };
  return ViewSearchObservableEpics;
}(ViewObservableEpics));
exports.ViewSearchObservableEpics = ViewSearchObservableEpics;
var GenericSearchObservableEpics = (function (_super) {
  __extends(GenericSearchObservableEpics, _super);
  function GenericSearchObservableEpics(genericSearchActionType, genericSearchService) {
    var _this = _super.call(this, genericSearchActionType, genericSearchService) || this;
    _this.searchObservableEpics = new SearchObservableEpics(genericSearchActionType, genericSearchService);
    _this.search = _this.search.bind(_this);
    return _this;
  }
  GenericSearchObservableEpics.prototype.search = function (action$) {
    return this.searchObservableEpics.search(action$);
  };
  return GenericSearchObservableEpics;
}(GenericObservableEpics));
exports.GenericSearchObservableEpics = GenericSearchObservableEpics;
var DiffObservableEpics = (function () {
  function DiffObservableEpics(actionType, service) {
    this.actionType = actionType;
    this.service = service;
    this.diff = this.diff.bind(this);
  }
  DiffObservableEpics.prototype.diff = function (action$) {
    var _this = this;
    return action$.pipe(redux_observable_1.ofType(this.actionType.diff), operators_1.flatMap(function (action) {
      var _a = action.payload, parameter = _a.parameter, callback = _a.callback;
      var execute = callback.execute, handleError = callback.handleError, formatData = callback.formatData;
      return fromPromise_1.fromPromise(_this.service.diff(parameter)).pipe(operators_1.map(function (res) {
        var formatedRes = formatData(res);
        execute(formatedRes);
        return ({
          type: BaseActionType_1.BaseActionType.ACTION_SUCCESS
        });
      }), operators_1.catchError(function (error) {
        handleError(error);
        return null;
      }));
    }));
  };
  return DiffObservableEpics;
}());
exports.DiffObservableEpics = DiffObservableEpics;
var Status;
(function (Status) {
  Status[Status["DataNotFound"] = 0] = "DataNotFound";
  Status[Status["Success"] = 1] = "Success";
  Status[Status["Error"] = 2] = "Error";
  Status[Status["DataVersionError"] = 4] = "DataVersionError";
})(Status = exports.Status || (exports.Status = {}));
var ApprObservableEpics = (function () {
  function ApprObservableEpics(actionType, service) {
    this.actionType = actionType;
    this.service = service;
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }
  ApprObservableEpics.prototype.approve = function (action$) {
    var _this = this;
    return action$.pipe(redux_observable_1.ofType(this.actionType.approveType), operators_1.flatMap(function (action) {
      var _a = action.payload, parameter = _a.parameter, callback = _a.callback;
      var execute = callback.execute, handleError = callback.handleError;
      return fromPromise_1.fromPromise(_this.service.approve(parameter)).pipe(operators_1.map(function (status) {
        execute(status);
        return ({
          type: BaseActionType_1.BaseActionType.ACTION_SUCCESS
        });
      }), operators_1.catchError(function (err) {
        handleError(err);
        return null;
      }));
    }));
  };
  ApprObservableEpics.prototype.reject = function (action$) {
    var _this = this;
    return action$.pipe(redux_observable_1.ofType(this.actionType.rejectType), operators_1.flatMap(function (action) {
      var _a = action.payload, parameter = _a.parameter, callback = _a.callback;
      var execute = callback.execute, handleError = callback.handleError;
      return fromPromise_1.fromPromise(_this.service.reject(parameter)).pipe(operators_1.map(function (res) {
        execute(true);
        return ({
          type: BaseActionType_1.BaseActionType.ACTION_SUCCESS
        });
      }), operators_1.catchError(function (error) {
        execute(false, error);
        handleError(error);
        return null;
      }));
    }));
  };
  return ApprObservableEpics;
}());
exports.ApprObservableEpics = ApprObservableEpics;
var DiffApprObservableEpics = (function (_super) {
  __extends(DiffApprObservableEpics, _super);
  function DiffApprObservableEpics(actionType, service) {
    var _this = _super.call(this, actionType, service) || this;
    _this.diffObservableEpics = new DiffObservableEpics(actionType, service);
    _this.diff = _this.diff.bind(_this);
    return _this;
  }
  DiffApprObservableEpics.prototype.diff = function (action$) {
    return this.diffObservableEpics.diff(action$);
  };
  return DiffApprObservableEpics;
}(ApprObservableEpics));
exports.DiffApprObservableEpics = DiffApprObservableEpics;
var GenericSearchDiffApprObservableEpics = (function (_super) {
  __extends(GenericSearchDiffApprObservableEpics, _super);
  function GenericSearchDiffApprObservableEpics(actionType, service) {
    var _this = _super.call(this, actionType, service) || this;
    _this.actionType = actionType;
    _this.service = service;
    _this.diffObservableEpics = new DiffApprObservableEpics(actionType, service);
    _this.diff = _this.diff.bind(_this);
    _this.approve = _this.approve.bind(_this);
    _this.reject = _this.reject.bind(_this);
    return _this;
  }
  GenericSearchDiffApprObservableEpics.prototype.diff = function (action$) {
    return this.diffObservableEpics.diff(action$);
  };
  GenericSearchDiffApprObservableEpics.prototype.approve = function (action$) {
    var _this = this;
    return action$.pipe(redux_observable_1.ofType(this.actionType.approveType), operators_1.flatMap(function (action) {
      var _a = action.payload, parameter = _a.parameter, callback = _a.callback;
      var execute = callback.execute, handleError = callback.handleError;
      return fromPromise_1.fromPromise(_this.service.approve(parameter)).pipe(operators_1.map(function (status) {
        execute(status);
        return ({
          type: BaseActionType_1.BaseActionType.ACTION_SUCCESS
        });
      }), operators_1.catchError(function (err) {
        handleError(err);
        return null;
      }));
    }));
  };
  GenericSearchDiffApprObservableEpics.prototype.reject = function (action$) {
    var _this = this;
    return action$.pipe(redux_observable_1.ofType(this.actionType.rejectType), operators_1.flatMap(function (action) {
      var _a = action.payload, parameter = _a.parameter, callback = _a.callback;
      var execute = callback.execute, handleError = callback.handleError;
      return fromPromise_1.fromPromise(_this.service.reject(parameter)).pipe(operators_1.map(function (res) {
        execute(true);
        return ({
          type: BaseActionType_1.BaseActionType.ACTION_SUCCESS
        });
      }), operators_1.catchError(function (error) {
        execute(false, error);
        handleError(error);
        return null;
      }));
    }));
  };
  return GenericSearchDiffApprObservableEpics;
}(GenericSearchObservableEpics));
exports.GenericSearchDiffApprObservableEpics = GenericSearchDiffApprObservableEpics;
