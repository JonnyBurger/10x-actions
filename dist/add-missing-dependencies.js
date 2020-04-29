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
var commit_file_1 = require("./commit-file");
var exec = require("@actions/exec");
exports.addMissingDependencies = function (packageNames) { return __awaiter(void 0, void 0, void 0, function () {
    var packageJsonPath, packageLockPath, yarnLockPath, packageJsonExists, packageJson, parsedPackageJson, deps, uninstalled, _i, uninstalled_1, pack;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                packageJsonPath = 'package.json';
                packageLockPath = 'package-lock.json';
                yarnLockPath = 'yarn.lock';
                packageJsonExists = fs_1.default.existsSync(packageJsonPath);
                if (!packageJsonExists) {
                    throw new Error('No package.json exists. This is very strange');
                }
                return [4 /*yield*/, fs_1.default.promises.readFile(packageJsonPath, 'utf-8')];
            case 1:
                packageJson = _a.sent();
                parsedPackageJson = JSON.parse(packageJson);
                deps = __assign(__assign({}, parsedPackageJson.dependencies), parsedPackageJson.devDependencies);
                if (packageNames.every(function (p) { return deps[p]; })) {
                    console.log(packageNames.join(',') + ' is installed.');
                    return [2 /*return*/];
                }
                uninstalled = packageNames.filter(function (p) { return !deps[p]; });
                _i = 0, uninstalled_1 = uninstalled;
                _a.label = 2;
            case 2:
                if (!(_i < uninstalled_1.length)) return [3 /*break*/, 9];
                pack = uninstalled_1[_i];
                if (!fs_1.default.existsSync(packageLockPath)) return [3 /*break*/, 5];
                return [4 /*yield*/, exec.exec('npm', ['i', '--save-dev', pack])];
            case 3:
                _a.sent();
                return [4 /*yield*/, commit_file_1.commitFiles([
                        {
                            path: packageLockPath,
                            content: fs_1.default.readFileSync(packageLockPath, 'utf8'),
                        },
                        {
                            path: packageJsonPath,
                            content: fs_1.default.readFileSync(packageJsonPath, 'utf8'),
                        },
                    ], "\uD83E\uDD16 Installed " + pack + " in devDependencies")];
            case 4:
                _a.sent();
                return [3 /*break*/, 8];
            case 5: return [4 /*yield*/, exec.exec('yarn', ['add', '-D', pack])];
            case 6:
                _a.sent();
                return [4 /*yield*/, commit_file_1.commitFiles([
                        {
                            path: yarnLockPath,
                            content: fs_1.default.readFileSync(yarnLockPath, 'utf8'),
                        },
                        {
                            path: packageJsonPath,
                            content: fs_1.default.readFileSync(packageJsonPath, 'utf8'),
                        },
                    ], "\uD83E\uDD16 Installed " + pack + " in devDependencies")];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 2];
            case 9: return [2 /*return*/];
        }
    });
}); };
