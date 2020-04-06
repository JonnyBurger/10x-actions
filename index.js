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
var core = require("@actions/core");
var github = require("@actions/github");
var exec = require("@actions/exec");
xns_1.xns(function () { return __awaiter(void 0, void 0, void 0, function () {
    var myToken, cwd, octokit, _a, ref, _b, owner, repo, curentRef, latestCommit, podfileBefore, podfileLockBefore, podfilePath, podfileLockPath, podfileAfter, podfileLockAfter, podfileBlob, podfileLockBlob, commit;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                myToken = core.getInput("github-token");
                cwd = core.getInput("pod-dir");
                octokit = new github.GitHub(myToken);
                _a = github.context, ref = _a.ref, _b = _a.repo, owner = _b.owner, repo = _b.repo;
                return [4 /*yield*/, octokit.git.getRef({
                        owner: owner,
                        repo: repo,
                        ref: ref,
                    })];
            case 1:
                curentRef = _c.sent();
                return [4 /*yield*/, octokit.git.getCommit({
                        owner: owner,
                        repo: repo,
                        commit_sha: curentRef.data.object.sha,
                    })];
            case 2:
                latestCommit = _c.sent();
                return [4 /*yield*/, fs_1.default.promises.readFile(cwd + "/Podfile", "utf-8")];
            case 3:
                podfileBefore = _c.sent();
                return [4 /*yield*/, fs_1.default.promises.readFile(cwd + "/Podfile.lock", "utf-8")];
            case 4:
                podfileLockBefore = _c.sent();
                podfilePath = cwd + "/Podfile";
                podfileLockPath = cwd + "/Podfile.lock";
                console.log("Got Podfile before, now running pod install...");
                exec.exec("pod", ["install"], {
                    cwd: cwd,
                });
                return [4 /*yield*/, fs_1.default.promises.readFile(podfilePath, "utf-8")];
            case 5:
                podfileAfter = _c.sent();
                return [4 /*yield*/, fs_1.default.promises.readFile(podfileLockPath, "utf-8")];
            case 6:
                podfileLockAfter = _c.sent();
                console.log("Got Podfile before, now running pod install...");
                if (!(podfileLockBefore !== podfileLockAfter ||
                    podfileBefore !== podfileAfter)) return [3 /*break*/, 12];
                console.log("The Podfile is different, let me fix that");
                return [4 /*yield*/, octokit.git.createBlob({
                        repo: github.context.repo.repo,
                        owner: github.context.repo.owner,
                        content: podfileAfter,
                    })];
            case 7:
                podfileBlob = _c.sent();
                return [4 /*yield*/, octokit.git.createBlob({
                        repo: github.context.repo.repo,
                        owner: github.context.repo.owner,
                        content: podfileLockAfter,
                    })];
            case 8:
                podfileLockBlob = _c.sent();
                return [4 /*yield*/, octokit.git.createTree({
                        repo: github.context.repo.repo,
                        owner: github.context.repo.owner,
                        base_tree: latestCommit.data.sha,
                        tree: [
                            {
                                content: podfileAfter,
                                path: podfilePath,
                                sha: podfileBlob.data.sha,
                                type: "blob",
                                mode: "100644",
                            },
                            {
                                content: podfileLockAfter,
                                path: podfileLockPath,
                                sha: podfileLockBlob.data.sha,
                                type: "blob",
                                mode: "100644",
                            },
                        ],
                    })];
            case 9:
                commit = _c.sent();
                return [4 /*yield*/, octokit.git.createCommit({
                        repo: github.context.repo.repo,
                        owner: github.context.repo.owner,
                        committer: {
                            email: "hi@jonny.io",
                            name: "jonnybot",
                        },
                        message: "🤖 Fixed your fucking Podfile",
                        tree: commit.data.sha,
                        parents: [curentRef.data.object.sha],
                    })];
            case 10:
                _c.sent();
                return [4 /*yield*/, octokit.git.updateRef({
                        repo: repo,
                        owner: owner,
                        ref: ref,
                        sha: curentRef.data.object.sha,
                    })];
            case 11:
                _c.sent();
                console.log("Fixed the fucking Podfile. Failing this commit now, wait for the next one!");
                throw new Error("Podfile is not up to date (commit fix was made)");
            case 12:
                console.log("Pod file is up to date!");
                _c.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); });
