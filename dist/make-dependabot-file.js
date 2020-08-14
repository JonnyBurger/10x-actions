"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xns_1 = __importDefault(require("xns"));
var yaml_1 = __importDefault(require("yaml"));
var get_context_1 = require("./get-context");
var truthy_1 = require("./truthy");
var is_react_native_app_1 = require("./is-react-native-app");
var getIgnoredUpdates = function (repo) {
    return [
        repo === 'JonnyBurger/bestande' ? 'uuid' : null,
        repo === 'JonnyBurger/bestande' ? 'file-loader' : null,
        repo === 'JonnyBurger/bestande' ? '@types/uuid' : null,
        repo === 'JonnyBurger/anysticker-app' ? 'react-native-bootsplash' : null,
    ].filter(truthy_1.truthy);
};
var getAutomergedUpdates = function (repo) {
    return [
        'aws-sdk',
        'stripe',
        'tics',
        'semver',
        is_react_native_app_1.isReactNativeApp(repo) ? '@react-native-community/cli' : null,
        'ava',
        'polished',
        'prettier',
        '@jonny/eslint-config',
        'ts-node',
        'mongodb-memory-server',
        '@react-navigation/bottom-tabs',
        '@react-navigation/native',
        '@react-navigation/stack',
        'react-native-device-info',
        'react-native-redash',
        'typescript',
        'date-fns',
        'ts-unused-exports',
    ].filter(truthy_1.truthy);
};
exports.makeDependabotFile = xns_1.default(function () {
    var context = get_context_1.getContext();
    var repo = context.owner + "/" + context.repo;
    var ignoredUpdates = getIgnoredUpdates(repo).map(function (name) {
        return {
            match: {
                dependency_name: name,
            },
        };
    });
    var input = {
        version: 1,
        update_configs: [
            __assign(__assign({ package_manager: 'javascript', directory: '/', update_schedule: 'live' }, (ignoredUpdates.length > 0 ? { ignored_updates: ignoredUpdates } : {})), { automerged_updates: __spreadArrays([
                    {
                        match: {
                            dependency_type: 'all',
                            update_type: 'all',
                            dependency_name: '@types/*',
                        },
                    }
                ], getAutomergedUpdates(repo).map(function (name) {
                    return {
                        match: {
                            dependency_name: name,
                        },
                    };
                })), version_requirement_updates: 'increase_versions' }),
            is_react_native_app_1.isReactNativeApp(repo) && repo !== 'JonnyBurger/pingpongtische'
                ? {
                    package_manager: 'ruby:bundler',
                    directory: repo === 'JonnyBurger/bestande' ? '/ios' : '/',
                    update_schedule: 'live',
                    automerged_updates: [
                        {
                            match: {
                                dependency_name: 'fastlane',
                            },
                        },
                    ],
                }
                : null,
            repo === 'JonnyBurger/bestande'
                ? {
                    package_manager: 'ruby:bundler',
                    directory: repo === 'JonnyBurger/bestande' ? '/android' : '/',
                    update_schedule: 'live',
                    automerged_updates: [
                        {
                            match: {
                                dependency_name: 'fastlane',
                            },
                        },
                    ],
                }
                : null,
        ].filter(Boolean),
    };
    return yaml_1.default.stringify(input, {});
});
