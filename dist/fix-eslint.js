"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var fs_1 = __importDefault(require("fs"));
var commit_file_1 = require("./commit-file");
var exec = require("@actions/exec");
exports.fixEslint = function () { return __awaiter(void 0, void 0, void 0, function () {
    var packageJson, parsed, testCommand, splitByAnd, eslintCommand, splittedEslintCommand, gitStatus, modifiedRaw, modifiedFiles, filesToChange;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs_1.default.promises.readFile('package.json', 'utf-8')];
            case 1:
                packageJson = _a.sent();
                parsed = JSON.parse(packageJson);
                testCommand = parsed.scripts.test;
                splitByAnd = testCommand.split('&&').map(function (a) { return a.trim(); });
                eslintCommand = splitByAnd.find(function (s) { return s.startsWith('eslint'); });
                if (!eslintCommand) {
                    console.log('Test script: ', testCommand);
                    console.log('No ESLint command found. Quitting.');
                    return [2 /*return*/];
                }
                splittedEslintCommand = eslintCommand.split(' ');
                return [4 /*yield*/, exec.exec('eslint', __spreadArrays(['--fix'], splittedEslintCommand.slice(1)))];
            case 2:
                _a.sent();
                gitStatus = '';
                return [4 /*yield*/, exec.exec('git', ['status'], {
                        listeners: {
                            stdout: function (data) {
                                gitStatus += data.toString();
                            },
                        },
                    })];
            case 3:
                _a.sent();
                console.log('Git status:');
                console.log(gitStatus);
                modifiedRaw = gitStatus
                    .split('\n')
                    .filter(function (f) { return f.includes('modified:'); });
                modifiedFiles = modifiedRaw
                    .map(function (m) { return m.replace('modified:', '').trim(); })
                    // Fix a maximum of 20 files
                    .slice(0, 20);
                console.log('modified files:');
                console.log(modifiedFiles);
                return [4 /*yield*/, Promise.all(modifiedFiles.map(function (path) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, fs_1.default.promises.readFile(path, 'utf8')];
                                case 1: return [2 /*return*/, (_a.content = _b.sent(),
                                        _a.path = path,
                                        _a)];
                            }
                        });
                    }); }))];
            case 4:
                filesToChange = _a.sent();
                return [4 /*yield*/, commit_file_1.commitFiles(filesToChange, '🤖 Fixed ESLint errors')];
            case 5:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
