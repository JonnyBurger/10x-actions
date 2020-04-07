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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var xns_1 = require("xns");
var commit_file_1 = require("./commit-file");
var fix_eslint_1 = require("./fix-eslint");
var core = require("@actions/core");
var exec = require("@actions/exec");
var isPodfileTheSame = function (file1, file2) {
    var exceptions = ['DoubleConversion', 'Folly', 'glog'];
    var split1 = file1.split('\n');
    var split2 = file2.split('\n');
    if (split2.length !== split1.length) {
        return false;
    }
    for (var i = 0; i < split1.length; i++) {
        var line1 = split1[i];
        var line2 = split2[i];
        if (line1.toLowerCase() !== line2.toLowerCase()) {
            if (!exceptions.some(function (e) { return split1.includes(e) && split2.includes(e); })) {
                return false;
            }
        }
    }
    return true;
};
xns_1.xns(function () { return __awaiter(void 0, void 0, void 0, function () {
    var cwd, podfileBefore, podfileLockBefore, podfilePath, podfileLockPath, podfileAfter, podfileLockAfter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fix_eslint_1.fixEslint()];
            case 1:
                _a.sent();
                cwd = core.getInput('pod-dir');
                return [4 /*yield*/, fs_1.default.promises.readFile(cwd + "/Podfile", 'utf-8')];
            case 2:
                podfileBefore = _a.sent();
                return [4 /*yield*/, fs_1.default.promises.readFile(cwd + "/Podfile.lock", 'utf-8')];
            case 3:
                podfileLockBefore = _a.sent();
                podfilePath = cwd + "/Podfile";
                podfileLockPath = cwd + "/Podfile.lock";
                console.log('Got Podfile before, now running pod install...');
                return [4 /*yield*/, exec.exec('pod', ['install'], {
                        cwd: cwd,
                    })];
            case 4:
                _a.sent();
                return [4 /*yield*/, fs_1.default.promises.readFile(podfilePath, 'utf-8')];
            case 5:
                podfileAfter = _a.sent();
                return [4 /*yield*/, fs_1.default.promises.readFile(podfileLockPath, 'utf-8')];
            case 6:
                podfileLockAfter = _a.sent();
                console.log('Got Podfile before, now running pod install...');
                if (!(!isPodfileTheSame(podfileLockBefore, podfileLockAfter) ||
                    podfileBefore !== podfileAfter)) return [3 /*break*/, 8];
                console.log('The Podfile is different, let me fix that');
                return [4 /*yield*/, commit_file_1.commitFiles([
                        { path: podfilePath, content: podfileAfter },
                        {
                            path: podfileLockPath,
                            content: podfileLockAfter,
                        },
                    ], '🤖 Fixed your fucking Podfile')];
            case 7:
                _a.sent();
                console.log('Fixed the fucking Podfile.');
                return [3 /*break*/, 9];
            case 8:
                console.log('Pod file is up to date!');
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); });
