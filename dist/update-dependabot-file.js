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
var make_dependabot_file_1 = require("./make-dependabot-file");
var commit_file_1 = require("./commit-file");
var get_context_1 = require("./get-context");
exports.updateDependabotFile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var context, dependabotFilePath, fileExists, fileBefore, _a, fileAfter;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Checking for dependabot updates...');
                context = get_context_1.getContext();
                if (context.ref !== 'heads/master') {
                    console.log('Not checking for dependabot file because we are not on master.');
                    return [2 /*return*/];
                }
                dependabotFilePath = '.dependabot/config.yml';
                fileExists = fs_1.default.existsSync(dependabotFilePath);
                if (!fileExists) return [3 /*break*/, 2];
                return [4 /*yield*/, fs_1.default.promises.readFile(dependabotFilePath, 'utf8')];
            case 1:
                _a = _b.sent();
                return [3 /*break*/, 3];
            case 2:
                _a = '';
                _b.label = 3;
            case 3:
                fileBefore = _a;
                fileAfter = make_dependabot_file_1.makeDependabotFile();
                if (fileBefore === fileAfter) {
                    console.log('Dependabot file is up to date!');
                    return [2 /*return*/];
                }
                if (!(fileBefore !== fileAfter)) return [3 /*break*/, 5];
                return [4 /*yield*/, commit_file_1.commitFiles([
                        {
                            content: fileAfter,
                            path: dependabotFilePath,
                        },
                    ], 'improved the dependabot file for you 🤖')];
            case 4:
                _b.sent();
                console.log('Updated the dependabot file with the newest improvements.');
                _b.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
