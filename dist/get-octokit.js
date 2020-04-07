"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core = require("@actions/core");
var github = require("@actions/github");
exports.getOctokit = function () {
    var myToken = core.getInput('github-token');
    return new github.GitHub(myToken);
};
