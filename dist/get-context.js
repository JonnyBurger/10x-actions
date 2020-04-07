"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var github = require("@actions/github");
exports.getContext = function () {
    var _a = github.context, wrongRef = _a.ref, _b = _a.repo, owner = _b.owner, repo = _b.repo;
    var ref = wrongRef.replace('refs/', '');
    return {
        ref: ref,
        owner: owner,
        repo: repo,
    };
};
