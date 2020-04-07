"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPodfileTheSame = function (file1, file2) {
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
