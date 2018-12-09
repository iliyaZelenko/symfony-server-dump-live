#!/usr/bin/env node
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "2af9a5ab6e29e398ce55";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __webpack_require__(1);
new App_1.default();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __webpack_require__(2);
const CLI = __webpack_require__(3);
const fs = __webpack_require__(4);
const path_1 = __webpack_require__(5);
const DefaultConfig_1 = __webpack_require__(6);
const AppServer_1 = __webpack_require__(7);
const WebSocket_1 = __webpack_require__(17);
const packageJson = __webpack_require__(20);
const { version: appVersion } = packageJson;
const { defaultFileName, defaultFilePath, defaultHost, defaultPort, defaultNoOpen } = DefaultConfig_1.default;
class App {
    constructor() {
        // показано ли предупреждение о том что path параметр из CLI является директорией.
        this.CLIPathIsDirectoryNoticeShowed = false;
        const { host, port, open, runDump } = this.CLIParams = this.makeCLI();
        const fileToWatch = this.getFileToWatch();
        // console.log(fileToWatch)
        if (runDump) {
            this.runServerDump();
        }
        if (!fs.pathExistsSync(fileToWatch)) {
            const msg = App.getWarningText(`We did not find a file ${fileToWatch}.`) +
                '\nIt is required that "server:dump" worked with this file by itself. ' +
                'We created the file manually, but you have to start "server:dump" with this file, for example: ' +
                chalk_1.default.blue('php ./bin/console server:dump --format=html > dump.html');
            console.log(msg);
            // создает файл если его нет чтобы не было ишибки на сокете и express серверах
            fs.ensureFileSync(fileToWatch);
            // пишет в файл контент TODO описать лучше
            fs.writeFileSync(fileToWatch, '<div style="text-align: center;">This file created manually.</div>');
        }
        this.appServer = new AppServer_1.default(this, port, host, open).start();
        new WebSocket_1.default(this).start();
    }
    // по правилас TSLint статические методы должны быть в саммо начале, даже раньше аттрибутов
    static getWarningText(msg) {
        const warning = chalk_1.default.keyword('orange');
        return warning(msg);
    }
    static getErrorText(msg) {
        const error = chalk_1.default.bold.red;
        return error(msg);
    }
    getAppServer() {
        return this.appServer;
    }
    getCLIParams() {
        return this.CLIParams;
    }
    getFileToWatch() {
        const path = path_1.join(process.cwd(), this.CLIParams.path);
        let newPath;
        if (fs.pathExistsSync(path) && fs.lstatSync(path).isDirectory()) {
            newPath = path_1.join(path, defaultFileName);
            if (!this.CLIPathIsDirectoryNoticeShowed) {
                console.log(App.getWarningText(`Your path "${path}" does not contain a file, we changed it to "${newPath}", ` +
                    'if you have a different file name, add it.'));
                this.CLIPathIsDirectoryNoticeShowed = true;
            }
            return newPath || path;
        }
        return path;
    }
    makeCLI() {
        // TODO перемеиновать dist/index.js в dump-server, чтобы usage в help норм отображался
        CLI
            .version(appVersion, '-v, --version')
            .usage('[options]')
            .option('--host [host]', 'server host', defaultHost)
            .option('-p, --port [port]', 'server port', defaultPort)
            .option('-b, --path [path]', 'path to file generated by Symfony\'s "server:dump" command.', defaultFilePath)
            .option('-r, --run-dump', 'manually runs Symfony\'s "server:dump" command (uses dump.html).')
            .option('--no-open', 'it won\'t open your browser.', defaultNoOpen)
            .parse(process.argv);
        const { host, port, path, open, runDump } = CLI;
        return {
            host,
            port,
            path,
            open,
            runDump
        };
    }
    runServerDump() {
        // runner.exec("php " + phpScriptPath + " " +argsString, function(err, phpResponse, stderr) {
        //   if(err) console.log(err); /* log error */
        //   console.log( phpResponse );
        // });
        console.log('Running server:dump...');
        // https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
        const { spawn } = __webpack_require__(21);
        // const child =
        // spawn('php', [
        //   join(process.cwd(), 'bin/console'),
        //   'server:dump'
        // ], { env: { FORCE_COLOR: true }, shell: true, stdio: 'inherit' })
        spawn(`php ${path_1.join(process.cwd(), 'bin', 'console')} server:dump --format=html > dump.html`, [], {
            // заметил результат только от stdio: 'inherit'
            env: { FORCE_COLOR: true }, shell: true, stdio: 'inherit'
        });
        // child.stdout.setEncoding('utf8')
        // child.stderr.setEncoding('utf8')
        // use child.stdout.setEncoding('utf8'); if you want text chunks
        // child.stdout.on('data', (chunk) => {
        //   // console.log('Info: ' + chunk)
        //   // запускается когда выводится dump
        //   console.log(chunk)
        //   // data from standard output is here as buffers
        // })
        // // err
        // child.stderr.on('data', (data) => {
        //   // console.log('stderr: ' + data)
        //   // почему-то выводится при старте
        //   console.log(data)
        // })
        //
        // child.on('error', (err) => {
        //   console.log('Error: ' + err)
        // })
        //
        // child.on('close', (code) => {
        //   console.log(`Child process exited with code ${code}.`)
        // })
        //
        // child.on('exit', (code, signal) => {
        //   console.log('child process exited with ' +
        //     `code ${code} and signal ${signal}`)
        // })
    }
}
exports.default = App;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("chalk");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("commander");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("fs-extra");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const defaultFileName = 'dump.html';
const DefaultConfig = {
    defaultFileName,
    defaultFilePath: defaultFileName,
    defaultHost: 'localhost',
    defaultPort: 9000,
    defaultNoOpen: false
};
exports.default = DefaultConfig;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __webpack_require__(2);
const express = __webpack_require__(8);
const http_1 = __webpack_require__(9);
const opn = __webpack_require__(10);
const routing_1 = __webpack_require__(11);
class AppServer {
    constructor(app, port, host, open) {
        this.DEFAULT_PORT = 9000;
        this.app = app;
        this.port = port;
        this.host = host;
        this.open = open;
        this.express = express();
        this.server = http_1.createServer(this.express);
    }
    start() {
        this.listen();
        this.routing();
        return this;
    }
    getServer() {
        return this.server;
    }
    getExpress() {
        return this.express;
    }
    getPort() {
        return this.DEFAULT_PORT;
    }
    listen() {
        this.server.listen(this.port, this.host, () => {
            if (this.open) {
                // открывает в дефолтном браузере
                opn(`http://${this.host}:` + this.port);
            }
            console.log(chalk_1.default.green(`Site is running on port ${chalk_1.default.bold(this.port.toString())}.`));
        });
    }
    routing() {
        routing_1.default(this.app, this);
    }
}
exports.default = AppServer;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("opn");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// , Request, Response
const fs = __webpack_require__(4);
const InjectHtml_1 = __webpack_require__(12);
exports.default = (app, appServer) => {
    const express = appServer.getExpress();
    const fileToWatch = app.getFileToWatch();
    express.get('/', async (req, res) => {
        const html = await fs.readFile(fileToWatch, 'utf8');
        res.send(InjectHtml_1.default(html, appServer.getPort()));
    });
    express.get('/admin', (req, res) => {
        res.send('Admin page');
    });
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = __webpack_require__(13);
const page_1 = __webpack_require__(14);
exports.default = (html, serverPort) => {
    const content = getGroupedContent(html);
    return page_1.default({ serverPort, content });
};
/**
 * Добавляет кнопки в каждый article
 * @param {HTML} html
 * @return {cheerioObj} cheerio object
 */
function addButtons(html) {
    const $ = cheerio.load(html);
    $('section.body > p.text-small').each((i, el) => {
        if ($(el).find('.iz-toggle-all-btn').length) {
            return;
        }
        const textOpenClose = ['Open all', 'Close all'];
        $(el).append(`
      <button
        onclick="
        const articleBody = this.closest('section.body')
        const toggleSelector = 'pre.sf-dump .sf-dump-toggle'

        if (this.textContent.includes('${textOpenClose[0]}')) {
          articleBody
            .querySelectorAll(toggleSelector + ' + .sf-dump-compact')
            .forEach(i => i.previousElementSibling.click())

          this.textContent = '${textOpenClose[1]}'
        } else {
          articleBody
            .querySelectorAll(toggleSelector + ' + .sf-dump-expanded')
            .forEach(i => i.previousElementSibling.click())
          this.textContent = '${textOpenClose[0]}'
        }
        "
        class="iz-toggle-all-btn iz-btn"
      >
        ${textOpenClose[0]}
      </button>
    `);
        $(el).append(`
      <button
        onclick="this.closest('section.body').querySelectorAll('pre.sf-dump .sf-dump-toggle').forEach(i => i.click())"
        class="iz-toggle-all-btn iz-btn"
      >
        Toggle all
      </button>
    `);
        $(el).append(`
      <button
        onclick="
          const pre = this.closest('section.body').querySelector('pre.sf-dump')

          if (this.search) {
            const el = pre.querySelector('.sf-dump-search-wrapper')

            if (el) {
              el.classList.add('sf-dump-search-hidden')
            }

            this.search = false
            return
          }
          // pre.querySelector('sf-dump-search-wrapper').remove()
          pre.dispatchEvent(
            new KeyboardEvent('keydown',{ keyCode: 70, ctrlKey: true })
          )
          this.search = true
        "
        class="iz-toggle-all-btn iz-btn"
      >
        Search
      </button>
    `);
    });
    return $;
}
// предыдущий article
// let lastArticle: any = null
const ignoreArticle = [];
/**
 * Добавляет в игнор сообщения (article) которые не были добавлены.
 * @param {cheerioObj} $
 * @return {void}
 */
function addToIgnore($) {
    const articles = $('article');
    articles.each((i, el) => {
        const attr = $(el).attr('data-dedup-id');
        if (!ignoreArticle.includes(attr)) {
            ignoreArticle.push(attr);
        }
    });
}
/**
 * Возвращает не проигнорированные сообщения.
 * @param {cheerioObj} $
 * @return {any}
 */
function getNotIgnoredMessages($) {
    return $('article').filter((i, el) => {
        return !ignoreArticle.includes($(el).attr('data-dedup-id'));
    });
}
/**
 * Скрипт который в первую очередь и всегда выполняется для файла
 * @param {HTML} html
 * @return {cheerioObj} cheerio object
 */
function every(html) {
    const $ = addButtons(html);
    $('time').each((i, el) => {
        const datetime = $(el).attr('datetime');
        $(el).text(
        // toLocaleString
        new Date(datetime).toLocaleTimeString('ru-RU'));
    });
    return $;
}
/**
 * Возвращает сгрупированный контент (разобранный)
 * @param {string} html контент файла
 * @return {ContentGroupInterface}
 */
function getGroupedContent(html) {
    const content = {};
    // печально что нет DOMParser как в браузере (хоть где-то мне пригодился этот jquery xD)
    const $ = every(html);
    // const articles = $('article')
    addToIgnore($);
    // if (articles.length) {
    //   // хоть и last, но в браузере она первая (изменено через стили)
    //   const last = articles.last()
    //
    //   if (last) {
    //     // ставит последнюю статью
    //     lastArticle = last
    //   }
    // }
    const body = $('body').first();
    const head = $('head').first();
    if (head) {
        content.headContent = head.html();
    }
    content.bodyContent = body ? body.html() : html;
    return content;
}
/**
 * Обрабатывает новый HTML который пришел после обновления файла.
 * @param {string} html контент файла
 * @return {HTML | null}
 */
function processUpdatedHtml(html) {
    const $ = every(html);
    const messages = getNotIgnoredMessages($);
    addToIgnore($);
    if (!messages.length) {
        // если article совпадают (такая ситуация может возникнут ьесли вручную изменить html)
        // if (last.attr('data-dedup-id') === lastArticle.attr('data-dedup-id')
        // TODO нужна ли эта проверка или нет, без нее изменение файла не игнорируется
        // (по моеу после закрытия dump сервера), но в данном случае это не игнорирование вроде не на что не влияет
        // || !last.attr('data-dedup-id') || !lastArticle.attr('data-dedup-id')
        // ) {
        // TODO Важно! Проверять если число статей === 0, то возвращать значение с этой функции,
        // TODO которое уже поймет WebSocket и обновит страницу в браузере.
        console.log('File change is ignored because no new message was added.');
        // возвращает null который проигнорируется дальше
        return null;
    }
    // lastArticle = last
    // обозначает что последняя запись была только создана чтобы применилаь анимация
    messages.attr('data-iz-new-created', true);
    // TODO объеденить две конструкции что рядом
    // добавляет скриптам
    messages.find('script').each((i, el) => {
        if ($(el).attr('data-script-executed') !== 'true') {
            $(el).attr('data-script-executed', false);
        }
    });
    // last
    return $.html(messages);
}
exports.processUpdatedHtml = processUpdatedHtml;
/**
 * Возвращает количество сообщений на странице (article)
 * @param {HTML} [html]
 * @return {number}
 */
function getArticlesCount(html) {
    const $ = cheerio.load(html);
    return $('article').length;
}
exports.getArticlesCount = getArticlesCount;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("cheerio");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const css_1 = __webpack_require__(15);
const js_1 = __webpack_require__(16);
const pageTitle = 'Symfony server:dump';
exports.default = ({ serverPort, content }) => `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    >
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${pageTitle}</title>

    ${css_1.default}

    ${content.headContent}
  </head>
  <body>
    <div id="iz-app">
      <div id="iz-background" :style="{ background: color }"></div>
      <div class="iz-trash" title="Removes all messages from page." @click="trash">
        <img
          src="https://findicons.com/files/icons/1580/devine_icons_part_2/128/trash_recyclebin_empty_closed.png"
          alt="Trash"
          style="width: 100%;"
        >
      </div>
      <div class="iz-width" title="Changes width of container." @click="toggleWidth">
        <img
          src="http://www.iconarchive.com/download/i83709/custom-icon-design/mono-general-4/eye.ico"
          alt="Eye"
          style="width: 100%;"
        >
      </div>
      <div class="iz-color" title="Background color.">
        <input v-model="color" type="color" name="iz-color">
        <!--<label for="iz-color">Background color</label>-->
      </div>
    </div>
    <div data-iz-symfony-dump-watcher>
      ${content.bodyContent}
    </div>
      <div id="iz-no-content">
      Looks like dump is empty.
      <br>
      <small id="iz-no-content__small">
        If the messages do not appear, then maybe you did not run the
        <b>php ./bin/console server:dump --format=html > dump.html</b>
        command.
        <br>
        This package just looks at the "dump.html" file that Symfony needs to change.
      </small>
    </div>

    ${js_1.default(serverPort)}
  </body>
  </html>
`;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
<style>
  #iz-background {
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    top: 0;
    z-index: -11111;
  }

  article[data-iz-new-created] {
    animation: slide-up 0.4s ease;
  }

  [data-iz-symfony-dump-watcher] {
    transition: max-width .5s ease;
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    max-width: 1140px;
    margin: auto;
    padding: 45px 15px 15px;
    word-wrap: break-word;
    /*background-color: #F9F9F9;*/
    /*color: #222;*/
    /*font-family: Helvetica, Arial, sans-serif;*/
    /*font-size: 14px;*/
    /*line-height: 1.4;*/
    animation: fadein 3s;
  }

  .iz-trash, .iz-width, .iz-color {
    position: fixed;
    top: 8px;
    z-index: 999999;
    max-width: 40px;
    width: 100%;
    transition: max-width .5s ease;
  }

  .iz-trash {
    left: 5px;
  }

  .iz-width {
    left: 55px;
  }

  .iz-color {
    left: 115px;
    display: flex;
    align-items: center;
    height: 40px;
  }

  .iz-width:hover, .iz-trash:hover, .iz-color:hover{
    max-width: 50px;
    cursor: pointer;
  }
  .iz-color:hover input {
    cursor: pointer;
  }

  .iz-btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: #333;
    background-color: #fff;
    margin-left: 10px;
  }

  .iz-btn:hover {
    color: #333;
    background-color: #e6e6e6;
    border-color: #adadad;
  }

  #iz-no-content {
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    width: 100vw;
    font-size: 4rem;
    position: absolute;
    left: 0;
    top: 0;
  }
  #iz-no-content.iz-no-content--hidden {
    display: none;
  }
  #iz-no-content #iz-no-content__small {
    font-size: 1rem;
    color: grey;
  }

  body {
    display: initial !important;
    flex-direction: initial !important;
    justify-content: initial !important;
    max-width: initial !important;
    margin: initial !important;
    padding: initial !important;
    word-wrap: initial !important;

    background-color: #F9F9F9 !important;
    color: #222 !important;
    font-family: Helvetica, Arial, sans-serif !important;
    font-size: 14px !important;
    line-height: 1.4 !important;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slide-up {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
`;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// скрипт добавляет в тег header класс hidden, но не совсем понятно при каких условиях
// зато понятно что скрипт должен выполнятся каждый для всех элементов, то есть его надо вызывать и для ново-добавленных
// понял я это по этой строчке: document.addEventListener('DOMContentLoaded', function() {
// Update: скорее всего этот скрипт прячет хедер тем article которые вывелись за один запрос, чтобы они имели один хедер
const symfonyScript = `
+(function () {
  let prev = null;
  Array.from(document.getElementsByTagName('article')).reverse().forEach(function (article) {
    const dedupId = article.dataset.dedupId;
    if (dedupId === prev) {
      article.getElementsByTagName('header')[0].classList.add('hidden');
    }
    prev = dedupId;
  });
})()
`;
exports.default = (serverPort) => `
<script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script>
<!--Injected script that changes the contents-->
<script>
  window.containerForContent = document.querySelector('[data-iz-symfony-dump-watcher]') // body
  // изначально было только в DOMContentLoaded, но оказывается страница может долго грузится если много сообщений.
  checkArticlesCount()

  document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://localhost:${serverPort}')

    checkArticlesCount()

    const app = new Vue({
      el: '#iz-app',
      data () {
        const widthAllowed = ['1140px', '100%', '500px']

        return {
          width: localStorage.getItem('iz-width') || widthAllowed[0],
          color: localStorage.getItem('iz-color') || '#F9F9F9',
          widthAllowed
        }
      },
      created () {
        this.setWidth()
      },
      watch: {
        color () {
          localStorage.setItem('iz-color', this.color)
        }
      },
      methods: {
        trash () {
          // containerForContent.innerHTML = ''
          containerForContent.querySelectorAll('article').forEach(i => i.remove())

          checkArticlesCount()
        },
        toggleWidth () {
          let widthIndex = this.widthAllowed.indexOf(this.width) + 1

          if (widthIndex === this.widthAllowed.length) {
            widthIndex = 0
          }

          this.width = this.widthAllowed[widthIndex]
          this.setWidth()
        },
        setWidth () {
          containerForContent.style.maxWidth = this.width
          localStorage.setItem('iz-width', this.width)
        }
      }
    })

    socket.on('apply full content', (html) => {
      // calling document.write on a closed (loaded) document automatically calls document.open,
      // which will clear the document.
      // document.open()
      // document.write(html)
      // document.close()
      // document.documentElement.innerHTML = html
      // TOOD чтобы срабатывало Message added.

      location.reload()
    })

    socket.on('changed', (data) => {
      const beforeCount = checkArticlesCount()
      // select element with this data attr
      // containerForContent.innerHTML += data
      // containerForContent.innerHTML += data
      containerForContent.insertAdjacentHTML('beforeend', data)
      // скрипты которые только были добавленны имеют специальный аттрибут, эти скрипты нужно выполнить
      containerForContent.querySelectorAll('script[data-script-executed="false"]').forEach((el) => {
        // обозначает что скрипт был выполнен
        el.setAttribute('data-script-executed', true)
        // el.removeAttribute('data-script-executed')

        // выполняет содержимое скрипта (eval is good here)
        eval(
          el.textContent
        )
      })

      // скрипт которй должен вызывается после обновления DOM
      ${symfonyScript}

      const afterCount = checkArticlesCount()
      const diffCount = afterCount - beforeCount
      
      console.log(afterCount, beforeCount, diffCount)

      if (diffCount > 0) {
        const plural = diffCount > 1
        const msg = \`Message\${plural ? 's' : ''} added\${plural ? \` (\${diffCount})\`: ''}.\`

        socket.emit('feedback', msg)
      }
    })

    // скрипт которй должен вызывается при заходе на страницу
    ${symfonyScript}
  })

  function checkArticlesCount () {
    const text = document.querySelector('#iz-no-content')
    const count = containerForContent.querySelectorAll('article').length

    if (count) {
      text.classList.add('iz-no-content--hidden')
    } else {
      text.classList.remove('iz-no-content--hidden')
    }

    return count
  }
</script>
`;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const socketIo = __webpack_require__(18);
const fs = __webpack_require__(19);
const fsExtra = __webpack_require__(4);
const InjectHtml_1 = __webpack_require__(12);
class WebSocket {
    constructor(app) {
        this.app = app;
        this.io = socketIo(this.app.getAppServer().getServer());
    }
    start() {
        this.listen();
    }
    async listen() {
        // в мс
        const watchFileInterval = 500;
        this.fileToWatch = this.app.getFileToWatch();
        let watcher;
        // console.log('!!!', fileToWatch)
        let initAdded = false;
        this.io.on('connect', async (socket) => {
            // console.log('Client connected.')
            this.currentSocket = socket;
            this.initialContent = await this.getFileContent(this.fileToWatch);
            if (!initAdded) {
                // сразу после подключения менять весь контент
                const html = await this.generateInitialHtml(this.initialContent);
                this.currentSocket.emit('apply full content', html);
                initAdded = true;
            }
            // TODO watch советует использовать дока
            watcher = this.watchFile.bind(this);
            fs.watchFile(this.fileToWatch, { interval: watchFileInterval }, watcher);
            this.currentSocket.on('feedback', console.log);
            this.currentSocket.on('disconnect', () => {
                fs.unwatchFile(this.fileToWatch, watcher);
                delete this.currentSocket;
                // console.log('Client disconnected.')
            });
        });
    }
    async getFileContent(fileToWatch) {
        return fsExtra.readFile(fileToWatch, 'utf8');
    }
    async generateInitialHtml(content) {
        return InjectHtml_1.default(content, this.app.getAppServer().getPort());
    }
    async watchFile(curr, prev) {
        // console.log('Content changed.')
        if (!this.currentSocket) {
            // такого сценария не должно произойти
            return;
        }
        const content = await this.getFileContent(this.fileToWatch);
        if (this.initialContent === '') {
            const html = await this.generateInitialHtml(content);
            this.currentSocket.emit('apply full content', html, InjectHtml_1.getArticlesCount(html));
            // ignore initialContent next time
            this.initialContent = false;
        }
        else {
            const html = InjectHtml_1.processUpdatedHtml(content);
            if (html) {
                this.currentSocket.emit('changed', html);
            }
        }
        // console.log(`the current mtime is: ${curr.mtime}`)
        // console.log(`the previous mtime was: ${prev.mtime}`)
    }
}
exports.default = WebSocket;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 20 */
/***/ (function(module) {

module.exports = {"name":"symfony-server-dump-live","version":"1.0.4","author":"Ilya Zelenko","main":"./dist/dump-server.js","types":"./dist/index","bin":{"dump-server":"./dist/dump-server.js"},"files":["dist","src"],"keywords":["symfony","dump","server","live","debug","watcher","var","VarDumper","node","socket","html","cli"],"repository":{"type":"git","url":"git+https://github.com/iliyaZelenko/symfony-server-dump-live.git"},"bugs":{"url":"https://github.com/iliyaZelenko/symfony-server-dump-live/issues"},"homepage":"https://github.com/iliyaZelenko/symfony-server-dump-live#readme","license":"MIT","scripts":{"dev":"nodemon","start":"node ./dist","build":"webpack --mode none --config webpack.config.js","lint":"tslint -p tsconfig.json"},"devDependencies":{"@babel/core":"^7.1.6","@babel/preset-env":"^7.1.6","@types/express":"^4.16.0","@types/node":"^10.12.10","@types/socket.io":"^2.1.0","babel-eslint":"^10.0.1","babel-loader":"^8.0.4","eslint":"^5.9.0","eslint-config-standard":"^12.0.0","eslint-config-typescript":"^1.1.0","eslint-plugin-import":"^2.14.0","eslint-plugin-node":"^8.0.0","eslint-plugin-promise":"^4.0.1","eslint-plugin-standard":"^4.0.0","eslint-plugin-typescript":"^0.14.0","nodemon":"^1.18.7","ts-loader":"^5.3.1","ts-node":"^7.0.1","tsconfig-paths":"^3.7.0","tslint":"^5.11.0","tslint-config-standard":"^8.0.1","typescript":"^3.1.6","typescript-eslint-parser":"^21.0.1","webpack":"^4.26.1","webpack-cli":"^3.1.2","webpack-node-externals":"^1.7.2"},"dependencies":{"@types/express-serve-static-core":"^4.16.0","chalk":"^2.4.1","cheerio":"^1.0.0-rc.2","commander":"^2.19.0","express":"^4.16.4","fs-extra":"^7.0.1","opn":"^5.4.0","socket.io":"^2.2.0"}};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ })
/******/ ]);