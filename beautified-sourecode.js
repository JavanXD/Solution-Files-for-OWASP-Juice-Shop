angular.module("juiceShop", ["ngRoute", "ngCookies", "ngTouch", "ngAnimate", "ngFileUpload", "ui.bootstrap", "pascalprecht.translate", "btford.socket-io", "ngclipboard", "base64", "monospaced.qrcode"]), angular.module("juiceShop").factory("authInterceptor", ["$rootScope", "$q", "$cookies", function(e, n, t) {
    "use strict";
    return {
        request: function(e) {
            return e.headers = e.headers || {}, t.get("token") && (e.headers.Authorization = "Bearer " + t.get("token")), e
        },
        response: function(e) {
            return e || n.when(e)
        }
    }
}]), angular.module("juiceShop").factory("rememberMeInterceptor", ["$rootScope", "$q", "$cookies", function(e, n, t) {
    "use strict";
    return {
        request: function(e) {
            return e.headers = e.headers || {}, t.get("email") && (e.headers["X-User-Email"] = t.get("email")), e
        },
        response: function(e) {
            return e || n.when(e)
        }
    }
}]), angular.module("juiceShop").factory("socket", ["socketFactory", function(e) {
    return e()
}]), angular.module("juiceShop").config(["$httpProvider", function(e) {
    "use strict";
    e.interceptors.push("authInterceptor"), e.interceptors.push("rememberMeInterceptor")
}]), angular.module("juiceShop").run(["$cookies", "$rootScope", function(e, n) {
    "use strict";
    n.isLoggedIn = function() {
        return e.get("token")
    }
}]), angular.module("juiceShop").config(["$translateProvider", function(e) {
    "use strict";
    e.useStaticFilesLoader({
        prefix: "/i18n/",
        suffix: ".json"
    }), e.determinePreferredLanguage(), e.fallbackLanguage("en"), e.useSanitizeValueStrategy(null)
}]), angular.module("juiceShop").config(["$qProvider", function(e) {
    e.errorOnUnhandledRejections(!1)
}]), angular.module("juiceShop").config(["$locationProvider", function(e) {
    e.hashPrefix("")
}]), angular.module("juiceShop").filter("emailName", function() {
    return function(e) {
        return e.split("@")[0].split(".").join(" ")
    }
}), angular.module("juiceShop").controller("AboutController", ["$scope", "ConfigurationService", function(n, e) {
    n.twitterUrl = null, n.facebookUrl = null, e.getApplicationConfiguration().then(function(e) {
        e && e.application && (null !== e.application.twitterUrl && (n.twitterUrl = e.application.twitterUrl), null !== e.application.facebookUrl && (n.facebookUrl = e.application.facebookUrl))
    }).catch(function(e) {
        console.log(e)
    })
}]), angular.module("juiceShop").controller("AdministrationController", [function() {}]), angular.module("juiceShop").controller("BasketController", ["$scope", "$sce", "$window", "$translate", "$uibModal", "BasketService", "UserService", "ConfigurationService", function(t, a, n, o, e, r, i, s) {
    "use strict";

    function l() {
        r.find(n.sessionStorage.bid).then(function(e) {
            t.products = e.Products;
            for (var n = 0; n < t.products.length; n++) t.products[n].description = a.trustAsHtml(t.products[n].description)
        }).catch(function(e) {
            console.log(e)
        })
    }

    function c(t, a) {
        r.get(t).then(function(e) {
            var n = e.quantity + a;
            r.put(t, {
                quantity: n < 1 ? 1 : n
            }).then(function() {
                l()
            }).catch(function(e) {
                console.log(e)
            })
        }).catch(function(e) {
            console.log(e)
        })
    }
    i.whoAmI().then(function(e) {
        t.userEmail = e.email || "anonymous"
    }).catch(angular.noop), t.couponPanelExpanded = !!n.localStorage.couponPanelExpanded && JSON.parse(n.localStorage.couponPanelExpanded), t.paymentPanelExpanded = !!n.localStorage.paymentPanelExpanded && JSON.parse(n.localStorage.paymentPanelExpanded), t.toggleCoupon = function() {
        n.localStorage.couponPanelExpanded = JSON.stringify(t.couponPanelExpanded)
    }, t.togglePayment = function() {
        n.localStorage.paymentPanelExpanded = JSON.stringify(t.paymentPanelExpanded)
    }, l(), t.delete = function(e) {
        r.del(e).then(function() {
            l()
        }).catch(function(e) {
            console.log(e)
        })
    }, t.applyCoupon = function() {
        r.applyCoupon(n.sessionStorage.bid, encodeURIComponent(t.coupon)).then(function(e) {
            t.coupon = void 0, o("DISCOUNT_APPLIED", {
                discount: e
            }).then(function(e) {
                t.confirmation = e
            }, function(e) {
                t.confirmation = e
            }).catch(angular.noop), t.error = void 0, t.form.$setPristine()
        }).catch(function(e) {
            console.log(e), t.confirmation = void 0, t.error = e, t.form.$setPristine()
        })
    }, t.checkout = function() {
        r.checkout(n.sessionStorage.bid).then(function(e) {
            n.location.replace(e)
        }).catch(function(e) {
            console.log(e)
        })
    }, t.inc = function(e) {
        c(e, 1)
    }, t.dec = function(e) {
        c(e, -1)
    }, t.showBitcoinQrCode = function() {
        e.open({
            templateUrl: "views/QrCode.html",
            controller: "QrCodeController",
            size: "md",
            resolve: {
                data: function() {
                    return "bitcoin:1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm"
                },
                url: function() {
                    return "/redirect?to=https://blockchain.info/address/1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm"
                },
                address: function() {
                    return "1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm"
                },
                title: function() {
                    return "TITLE_BITCOIN_ADDRESS"
                }
            }
        })
    }, t.showDashQrCode = function() {
        e.open({
            templateUrl: "views/QrCode.html",
            controller: "QrCodeController",
            size: "md",
            resolve: {
                data: function() {
                    return "dash:Xr556RzuwX6hg5EGpkybbv5RanJoZN17kW"
                },
                url: function() {
                    return "/redirect?to=https://explorer.dash.org/address/Xr556RzuwX6hg5EGpkybbv5RanJoZN17kW"
                },
                address: function() {
                    return "Xr556RzuwX6hg5EGpkybbv5RanJoZN17kW"
                },
                title: function() {
                    return "TITLE_DASH_ADDRESS"
                }
            }
        })
    }, t.showEtherQrCode = function() {
        e.open({
            templateUrl: "views/QrCode.html",
            controller: "QrCodeController",
            size: "md",
            resolve: {
                data: function() {
                    return "0x0f933ab9fCAAA782D0279C300D73750e1311EAE6"
                },
                url: function() {
                    return "https://etherscan.io/address/0x0f933ab9fcaaa782d0279c300d73750e1311eae6"
                },
                address: function() {
                    return "0x0f933ab9fCAAA782D0279C300D73750e1311EAE6"
                },
                title: function() {
                    return "TITLE_ETHER_ADDRESS"
                }
            }
        })
    }, t.twitterUrl = null, t.facebookUrl = null, t.applicationName = "OWASP Juice Shop", s.getApplicationConfiguration().then(function(e) {
        e && e.application && (null !== e.application.twitterUrl && (t.twitterUrl = e.application.twitterUrl), null !== e.application.facebookUrl && (t.facebookUrl = e.application.facebookUrl), null !== e.application.name && (t.applicationName = e.application.name))
    }).catch(function(e) {
        console.log(e)
    })
}]), angular.module("juiceShop").controller("ChallengeController", ["$scope", "$sce", "$translate", "$cookies", "$uibModal", "$window", "ChallengeService", "ConfigurationService", "socket", function(i, n, e, t, a, o, r, s, l) {
    "use strict";
    i.scoreBoardTablesExpanded = o.localStorage.scoreBoardTablesExpanded ? JSON.parse(o.localStorage.scoreBoardTablesExpanded) : [null, !0, !1, !1, !1, !1, !1], i.offsetValue = ["100%", "100%", "100%", "100%", "100%", "100%"], i.toggleDifficulty = function() {
        o.localStorage.scoreBoardTablesExpanded = JSON.stringify(i.scoreBoardTablesExpanded)
    }, s.getApplicationConfiguration().then(function(e) {
        i.allowRepeatNotifications = e.application.showChallengeSolvedNotifications && e.ctf.showFlagsInNotifications, i.showChallengeHints = e.application.showChallengeHints
    }).catch(angular.noop), i.repeatNotification = function(e) {
        i.allowRepeatNotifications && r.repeatNotification(encodeURIComponent(e.name)).then(function() {
            o.scrollTo(0, 0)
        }).catch(angular.noop)
    }, i.openHint = function(e) {
        i.showChallengeHints && e.hintUrl && o.open(e.hintUrl, "_blank")
    }, i.trustDescriptionHtml = function() {
        for (var e = 0; e < i.challenges.length; e++) i.challenges[e].description = n.trustAsHtml(i.challenges[e].description)
    }, i.calculateProgressPercentage = function() {
        for (var e = 0, n = 0; n < i.challenges.length; n++) e += i.challenges[n].solved ? 1 : 0;
        i.percentChallengesSolved = (100 * e / i.challenges.length).toFixed(0), 75 < i.percentChallengesSolved ? i.completionColor = "success" : 25 < i.percentChallengesSolved ? i.completionColor = "warning" : i.completionColor = "danger"
    }, i.setOffset = function(e) {
        for (var n = 1; n <= 6; n++) {
            for (var t = 0, a = 0, o = 0; o < e.length; o++) e[o].difficulty === n && (a++, e[o].solved && t++);
            var r = Math.round(100 * t / a);
            r = +(r = 100 - r) + "%", i.offsetValue[n - 1] = r
        }
    }, r.find().then(function(e) {
        i.challenges = e;
        for (var n = 0; n < i.challenges.length; n++) i.challenges[n].hintUrl && (i.challenges[n].hint ? i.challenges[n].hint += " Click for more hints." : i.challenges[n].hint = "Click to open hints."), i.challenges[n].disabledEnv && (i.challenges[n].hint = "This challenge is unavailable in a " + i.challenges[n].disabledEnv + " environment!");
        i.trustDescriptionHtml(), i.calculateProgressPercentage(), i.setOffset(e)
    }).catch(function(e) {
        console.log(e)
    }), l.on("challenge solved", function(e) {
        if (e && e.challenge) {
            for (var n = 0; n < i.challenges.length; n++)
                if (i.challenges[n].name === e.name) {
                    i.challenges[n].solved = !0;
                    break
                } i.calculateProgressPercentage(), i.setOffset(i.challenges)
        }
    })
}]), angular.module("juiceShop").controller("ChallengeSolvedNotificationController", ["$scope", "$rootScope", "$translate", "$cookies", "socket", "ConfigurationService", "ChallengeService", "CountryMappingService", function(a, n, e, t, o, r, i, s) {
    "use strict";
    a.notifications = [], a.closeNotification = function(e) {
        a.notifications.splice(e, 1)
    }, a.showNotification = function(t) {
        e("CHALLENGE_SOLVED", {
            challenge: t.challenge
        }).then(function(e) {
            return e
        }, function(e) {
            return e
        }).then(function(e) {
            var n;
            a.showCtfCountryDetailsInNotifications && "none" !== a.showCtfCountryDetailsInNotifications && (n = a.countryMap[t.key]), a.notifications.push({
                message: e,
                flag: t.flag,
                country: n,
                copied: !1
            })
        }).catch(angular.noop)
    }, a.saveProgress = function() {
        i.continueCode().then(function(e) {
            if (!e) throw new Error("Received invalid continue code from the sever!");
            var n = new Date;
            n.setFullYear(n.getFullYear() + 1), t.put("continueCode", e, {
                expires: n
            })
        }).catch(function(e) {
            console.log(e)
        })
    }, o.on("challenge solved", function(e) {
        e && e.challenge && (e.hidden || a.showNotification(e), e.isRestore || a.saveProgress(), "Score Board" === e.name && n.$emit("score_board_challenge_solved"), o.emit("notification received", e.flag))
    }), r.getApplicationConfiguration().then(function(e) {
        e && e.ctf && (null !== e.ctf.showFlagsInNotifications ? a.showCtfFlagsInNotifications = e.ctf.showFlagsInNotifications : a.showCtfFlagsInNotifications = !1, e.ctf.showCountryDetailsInNotifications ? (a.showCtfCountryDetailsInNotifications = e.ctf.showCountryDetailsInNotifications, "none" !== e.ctf.showCountryDetailsInNotifications && s.getCountryMapping().then(function(e) {
            a.countryMap = e
        }).catch(function(e) {
            console.log(e)
        })) : a.showCtfCountryDetailsInNotifications = "none")
    }, function(e) {
        console.log(e)
    }).catch(angular.noop)
}]), angular.module("juiceShop").controller("ChangePasswordController", ["$scope", "$location", "UserService", function(n, e, t) {
    "use strict";

    function a() {
        n.currentPassword = void 0, n.newPassword = void 0, n.newPasswordRepeat = void 0, n.form.$setPristine()
    }
    n.changePassword = function() {
        t.changePassword({
            current: n.currentPassword,
            new: n.newPassword,
            repeat: n.newPasswordRepeat
        }).then(function() {
            n.error = void 0, n.confirmation = "Your password was successfully changed.", a()
        }).catch(function(e) {
            n.error = e, n.confirmation = void 0, a()
        })
    }
}]), angular.module("juiceShop").controller("ComplaintController", ["$scope", "Upload", "ComplaintService", "UserService", function(t, n, e, a) {
    "use strict";

    function o() {
        a.whoAmI().then(function(e) {
            t.complaint = {}, t.complaint.UserId = e.id, t.userEmail = e.email
        }).catch(angular.noop)
    }

    function r() {
        e.save(t.complaint).then(function(e) {
            t.confirmation = "Customer support will get in touch with you soon! Your complaint reference is #" + e.id, o(), t.file = void 0, t.form.$setPristine()
        }).catch(angular.noop)
    }
    o(), t.save = function() {
        t.file ? t.upload(t.file) : r()
    }, t.upload = function(e) {
        n.upload({
            url: "/file-upload",
            data: {
                file: e
            }
        }).then(function(e) {
            t.complaint.file = e.config.data.file.name, r()
        }, function(e) {
            console.log("Error status: " + e.status), r()
        }, function(e) {
            var n = parseInt(100 * e.loaded / e.total, 10);
            t.progress = "(Progress: " + n + "%)"
        }).catch(angular.noop)
    }
}]), angular.module("juiceShop").controller("ContactController", ["$scope", "FeedbackService", "UserService", "CaptchaService", function(n, e, t, a) {
    "use strict";

    function o() {
        a.getCaptcha().then(function(e) {
            n.captcha = e.captcha, n.captchaId = e.captchaId
        }).catch(angular.noop)
    }
    t.whoAmI().then(function(e) {
        n.feedback = {}, n.feedback.UserId = e.id, n.userEmail = e.email || "anonymous"
    }).catch(angular.noop), o(), n.save = function() {
        n.feedback.captchaId = n.captchaId, e.save(n.feedback).then(function(e) {
            n.error = null, n.confirmation = "Thank you for your feedback" + (5 === e.rating ? " and your 5-star rating!" : "."), n.feedback = {}, o(), n.form.$setPristine()
        }).catch(function(e) {
            n.error = e, n.confirmation = null, n.feedback = {}, n.form.$setPristine()
        })
    }
}]), angular.module("juiceShop").controller("FeedbackController", ["$scope", "$sce", "FeedbackService", function(t, a, n) {
    "use strict";
    t.interval = 5e3, t.noWrapSlides = !1, t.active = 0;
    var o = ["public/images/carousel/1.jpg", "public/images/carousel/2.jpg", "public/images/carousel/3.jpg", "public/images/carousel/4.jpg", "public/images/carousel/5.png", "public/images/carousel/6.jpg", "public/images/carousel/7.jpg"];

    function r() {
        n.find().then(function(e) {
            t.feedbacks = e;
            for (var n = 0; n < t.feedbacks.length; n++) t.feedbacks[n].comment = a.trustAsHtml(t.feedbacks[n].comment), t.feedbacks[n].image = o[n % o.length]
        }).catch(function(e) {
            console.log(e)
        })
    }
    r(), t.delete = function(e) {
        n.del(e).then(function() {
            r()
        }).catch(function(e) {
            console.log(e)
        })
    }
}]), angular.module("juiceShop").controller("ForgotPasswordController", ["$scope", "$location", "UserService", "SecurityQuestionService", function(n, e, t, a) {
    "use strict";

    function o() {
        n.email = void 0, n.securityQuestion = void 0, n.securityAnswer = void 0, n.newPassword = void 0, n.newPasswordRepeat = void 0, n.form.$setPristine()
    }
    n.findSecurityQuestion = function() {
        n.securityQuestion = void 0, n.email && a.findBy(n.email).then(function(e) {
            n.securityQuestion = e.question
        }).catch(angular.noop)
    }, n.resetPassword = function() {
        t.resetPassword({
            email: n.email,
            answer: n.securityAnswer,
            new: n.newPassword,
            repeat: n.newPasswordRepeat
        }).then(function() {
            n.error = void 0, n.confirmation = "Your password was successfully changed.", o()
        }).catch(function(e) {
            n.error = e, n.confirmation = void 0, o()
        })
    }
}]), angular.module("juiceShop").controller("LanguageController", ["$scope", "$cookies", "$translate", function(e, t, a) {
    "use strict";
    if (t.get("language")) {
        var n = t.get("language");
        a.use(n)
    }
    e.languages = languages, e.changeLanguage = function(e) {
        a.use(e);
        var n = new Date;
        n.setFullYear(n.getFullYear() + 1), t.put("language", e, {
            expires: n
        })
    }
}]);
var languages = [{
    key: "ar_SA",
    icon: "ae",
    lang: "عربى"
}, {
    key: "cs_CZ",
    icon: "cz",
    lang: "Česky",
    isFlask: !0
}, {
    key: "da_DK",
    icon: "dk",
    lang: "Dansk",
    isFlask: !0
}, {
    key: "de_DE",
    icon: "de",
    lang: "Deutsch"
}, {
    key: "el_GR",
    icon: "gr",
    lang: "Ελληνικά",
    isFlask: !0
}, {
    key: "es_ES",
    icon: "es",
    lang: "Español",
    isFlask: !0
}, {
    key: "et_EE",
    icon: "ee",
    lang: "Eesti"
}, {
    key: "fi_FI",
    icon: "fi",
    lang: "Suomalainen",
    isFlask: !0
}, {
    key: "fr_FR",
    icon: "fr",
    lang: "Français"
}, {
    key: "he_IL",
    icon: "il",
    lang: "עברי"
}, {
    key: "hi_IN",
    icon: "in",
    lang: "हिंदी"
}, {
    key: "hu_HU",
    icon: "hu",
    lang: "Magyar",
    isFlask: !0
}, {
    key: "id_ID",
    icon: "id",
    lang: "Bahasa Indonesia"
}, {
    key: "it_IT",
    icon: "it",
    lang: "Italiano"
}, {
    key: "ja_JP",
    icon: "jp",
    lang: "日本の"
}, {
    key: "lt_LT",
    icon: "lt",
    lang: "Lietuviešu",
    isFlask: !0
}, {
    key: "lv_LV",
    icon: "lv",
    lang: "Latvijas",
    isFlask: !0
}, {
    key: "my_MM",
    icon: "mm",
    lang: "ျမန္မာ",
    isFlask: !0
}, {
    key: "nl_NL",
    icon: "nl",
    lang: "Nederlands"
}, {
    key: "no_NO",
    icon: "no",
    lang: "Norsk"
}, {
    key: "pl_PL",
    icon: "pl",
    lang: "Język Polski"
}, {
    key: "pt_PT",
    icon: "pt",
    lang: "Português",
    isFlask: !0
}, {
    key: "pt_BR",
    icon: "br",
    lang: "Português (Brasil)"
}, {
    key: "ro_RO",
    icon: "ro",
    lang: "Românesc"
}, {
    key: "ru_RU",
    icon: "ru",
    lang: "Pусский",
    isFlask: !0
}, {
    key: "sv_SE",
    icon: "se",
    lang: "Svenska"
}, {
    key: "tr_TR",
    icon: "tr",
    lang: "Türkçe"
}, {
    key: "ur_PK",
    icon: "pk",
    lang: "اردو"
}, {
    key: "zh_CN",
    icon: "cn",
    lang: "中国"
}, {
    key: "zh_HK",
    icon: "hk",
    lang: "繁體中文"
}];
angular.module("juiceShop").controller("LoginController", ["$scope", "$rootScope", "$window", "$location", "$cookies", "UserService", function(n, t, a, o, r, e) {
    "use strict";
    var i = r.get("email");
    n.rememberMe = !!i && (n.user = {}, n.user.email = i, !0), n.login = function() {
        e.login(n.user).then(function(e) {
            r.put("token", e.token), a.sessionStorage.bid = e.bid, t.$emit("user_logged_in"), o.path("/")
        }).catch(function(e) {
            r.remove("token"), delete a.sessionStorage.bid, n.error = e, n.form.$setPristine()
        }), n.rememberMe ? r.put("email", n.user.email) : r.remove("email")
    }, n.googleLogin = function() {
        a.location.replace(s + "?client_id=" + l + "&response_type=token&scope=email&redirect_uri=" + c[u])
    };
    var s = "https://accounts.google.com/o/oauth2/v2/auth",
        l = "1005568560502-6hm16lef8oh46hr2d98vf2ohlnj4nfhq.apps.googleusercontent.com",
        c = {
            "http://demo.owasp-juice.shop": "http://demo.owasp-juice.shop",
            "https://juice-shop.herokuapp.com": "https://juice-shop.herokuapp.com",
            "http://juice-shop.herokuapp.com": "http://juice-shop.herokuapp.com",
            "http://preview.owasp-juice.shop": "http://preview.owasp-juice.shop",
            "https://juice-shop-staging.herokuapp.com": "https://juice-shop-staging.herokuapp.com",
            "http://juice-shop-staging.herokuapp.com": "http://juice-shop-staging.herokuapp.com",
            "http://localhost:3000": "http://localhost:3000",
            "http://localhost:4200": "http://localhost:4200",
            "http://juice.sh": "http://juice.sh",
            "http://192.168.99.100:3000": "http://tinyurl.com/ipMacLocalhost"
        },
        u = o.protocol() + "://" + location.host;
    n.oauthUnavailable = !c[u], n.oauthUnavailable && console.log(u + " is not an authorized redirect URI for this application.")
}]), angular.module("juiceShop").controller("LogoutController", ["$rootScope", "$cookies", "$window", "$location", function(e, n, t, a) {
    "use strict";
    n.remove("token"), delete t.sessionStorage.bid, e.$emit("user_logged_out"), a.path("/")
}]), angular.module("juiceShop").controller("NavbarController", ["$scope", "$rootScope", "$location", "AdministrationService", "ConfigurationService", "UserService", "ChallengeService", function(n, t, e, a, o, r, i) {
    "use strict";

    function s() {
        r.whoAmI().then(function(e) {
            t.userEmail = e.email
        }).catch(function(e) {
            console.log(e)
        })
    }
    n.version = "", a.getApplicationVersion().then(function(e) {
        e && (n.version = "v" + e)
    }).catch(function(e) {
        console.log(e)
    }), t.applicationName = "OWASP Juice Shop", t.gitHubRibbon = "orange", o.getApplicationConfiguration().then(function(e) {
        e && e.application && null !== e.application.name && (t.applicationName = e.application.name), e && e.application && null !== e.application.gitHubRibbon && (t.gitHubRibbon = "none" !== e.application.gitHubRibbon ? e.application.gitHubRibbon : null)
    }).catch(function(e) {
        console.log(e)
    }), e.search().gitHubRibbon && (t.gitHubRibbon = e.search().gitHubRibbon), t.userEmail = "", s(), t.$on("user_logged_in", function() {
        s()
    }), t.$on("user_logged_out", function() {
        t.userEmail = ""
    }), t.scoreBoardMenuVisible = !1, i.find({
        name: "Score Board"
    }).then(function(e) {
        t.scoreBoardMenuVisible = e[0].solved
    }).catch(function(e) {
        console.log(e)
    }), t.$on("score_board_challenge_solved", function() {
        t.scoreBoardMenuVisible = !0
    })
}]), angular.module("juiceShop").controller("OAuthController", ["$rootScope", "$window", "$location", "$cookies", "$base64", "UserService", function(n, t, o, a, r, i) {
    "use strict";

    function s(e) {
        i.login({
            email: e.email,
            password: r.encode(e.email),
            oauth: !0
        }).then(function(e) {
            a.put("token", e.token), t.sessionStorage.bid = e.bid, n.$emit("user_logged_in"), o.path("/")
        }).catch(function(e) {
            l(e), o.path("/login")
        })
    }

    function l(e) {
        console.log(e), a.remove("token"), delete t.sessionStorage.bid
    }
    i.oauthLogin(function() {
        for (var e = o.path().substr(1).split("&"), n = {}, t = 0; t < e.length; t++) {
            var a = e[t].split("=");
            n[a[0]] = a[1]
        }
        return n
    }().access_token).then(function(e) {
        i.save({
            email: e.email,
            password: r.encode(e.email)
        }).then(function() {
            s(e)
        }).catch(function() {
            s(e)
        })
    }).catch(function(e) {
        l(e), o.path("/login")
    })
}]), angular.module("juiceShop").controller("ProductDetailsController", ["$scope", "$sce", "$q", "$uibModal", "ProductService", "ProductReviewService", "UserService", "id", function(o, r, e, n, t, a, i, s) {
    "use strict";
    e.all([t.get(s), a.get(s), i.whoAmI()]).then(function(e) {
        var n = e[0],
            t = e[1],
            a = e[2];
        o.product = n, o.product.description = r.trustAsHtml(o.product.description), o.productReviews = t, a && a.email ? o.author = a.email : o.author = "Anonymous"
    }).catch(function(e) {
        console.log(e)
    }), o.addReview = function() {
        var e = {
            message: o.message,
            author: o.author
        };
        o.productReviews.push(e), a.create(s, e)
    }, o.refreshReviews = function() {
        a.get(s).then(function(e) {
            o.productReviews = e
        }).catch(angular.noop)
    }, o.editReview = function(e) {
        n.open({
            templateUrl: "views/ProductReviewEdit.html",
            controller: "ProductReviewEditController",
            bindings: {
                resolve: "<",
                close: "&",
                dismiss: "&"
            },
            size: "lg",
            resolve: {
                review: function() {
                    return e
                }
            }
        }).result.then(function() {
            o.refreshReviews()
        }, function() {
            console.log("Cancelled")
        })
    }
}]), angular.module("juiceShop").controller("ProductReviewEditController", ["$scope", "$uibModalInstance", "ProductReviewService", "review", function(n, e, t, a) {
    "use strict";
    n.id = a._id, n.message = a.message, n.editReview = function() {
        t.patch({
            id: n.id,
            message: n.message
        }).then(function() {
            e.close(n.message)
        }).catch(function(e) {
            console.log(e), n.err = e
        })
    }
}]), angular.module("juiceShop").controller("QrCodeController", ["$scope", "data", "url", "address", "title", function(e, n, t, a, o) {
    e.data = n, e.url = t, e.address = a, e.title = o
}]), angular.module("juiceShop").controller("RecycleController", ["$scope", "RecycleService", "UserService", "ConfigurationService", function(n, e, t, a) {
    "use strict";

    function o() {
        t.whoAmI().then(function(e) {
            n.recycle = {}, n.recycle.UserId = e.id, n.userEmail = e.email
        }).catch(angular.noop)
    }
    a.getApplicationConfiguration().then(function(e) {
        e && e.application && e.application.recyclePage && (n.topImage = "/public/images/products/" + e.application.recyclePage.topProductImage, n.bottomImage = "/public/images/products/" + e.application.recyclePage.bottomProductImage)
    }).catch(angular.noop), o(), n.save = function() {
        e.save(n.recycle).then(function(e) {
            n.confirmation = "Thank you for using our recycling service. We will " + (e.isPickup ? "pick up your pomace on " + e.pickupDate : "deliver your recycle box asap") + ".", o(), n.form.$setPristine()
        })
    }, e.find().then(function(e) {
        n.recycles = e
    }).catch(function(e) {
        console.log(e)
    })
}]), angular.module("juiceShop").controller("RegisterController", ["$scope", "$location", "UserService", "SecurityQuestionService", "SecurityAnswerService", function(n, t, e, a, o) {
    "use strict";
    a.find().then(function(e) {
        n.securityQuestions = e
    }).catch(function(e) {
        console.log(e)
    }), n.save = function() {
        e.save(n.user).then(function(e) {
            o.save({
                UserId: e.id,
                answer: n.user.securityAnswer,
                SecurityQuestionId: n.user.securityQuestion.id
            }).then(function() {
                n.user = {}, t.path("/login")
            })
        }).catch(angular.noop)
    }
}]), angular.module("juiceShop").controller("SearchController", ["$scope", "$location", function(e, n) {
    "use strict";
    e.search = function() {
        n.path("/search").search({
            q: e.searchQuery || ""
        })
    }
}]), angular.module("juiceShop").controller("SearchResultController", ["$scope", "$sce", "$window", "$uibModal", "$location", "$translate", "ProductService", "BasketService", function(r, t, i, n, e, s, l, c) {
    "use strict";
    r.showDetail = function(e) {
        n.open({
            templateUrl: "views/ProductDetail.html",
            controller: "ProductDetailsController",
            size: "lg",
            resolve: {
                id: function() {
                    return e
                }
            }
        })
    }, r.addToBasket = function(o) {
        c.find(i.sessionStorage.bid).then(function(e) {
            for (var n = e.Products, t = !1, a = 0; a < n.length; a++)
                if (n[a].id === o) {
                    t = !0, c.get(n[a].BasketItem.id).then(function(e) {
                        var n = e.quantity + 1;
                        c.put(e.id, {
                            quantity: n
                        }).then(function(e) {
                            l.get(e.ProductId).then(function(e) {
                                s("BASKET_ADD_SAME_PRODUCT", {
                                    product: e.name
                                }).then(function(e) {
                                    r.confirmation = e
                                }, function(e) {
                                    r.confirmation = e
                                }).catch(angular.noop)
                            }).catch(function(e) {
                                console.log(e)
                            })
                        }).catch(function(e) {
                            console.log(e)
                        })
                    }).catch(function(e) {
                        console.log(e)
                    });
                    break
                } t || c.save({
                ProductId: o,
                BasketId: i.sessionStorage.bid,
                quantity: 1
            }).then(function(e) {
                l.get(e.ProductId).then(function(e) {
                    s("BASKET_ADD_PRODUCT", {
                        product: e.name
                    }).then(function(e) {
                        r.confirmation = e
                    }, function(e) {
                        r.confirmation = e
                    }).catch(angular.noop)
                }).catch(function(e) {
                    console.log(e)
                })
            }).catch(function(e) {
                console.log(e)
            })
        }).catch(function(e) {
            console.log(e)
        })
    }, r.searchQuery = t.trustAsHtml(e.search().q), l.search(r.searchQuery).then(function(e) {
        r.products = e;
        for (var n = 0; n < r.products.length; n++) r.products[n].description = t.trustAsHtml(r.products[n].description)
    }).catch(function(e) {
        console.log(e)
    })
}]), angular.module("juiceShop").controller("ServerStartedNotificationController", ["$scope", "$translate", "$cookies", "ChallengeService", "socket", function(n, t, a, o, e) {
    "use strict";
    n.hackingProgress = {}, n.closeNotification = function() {
        n.hackingProgress.autoRestoreMessage = null
    }, n.clearProgress = function() {
        a.remove("continueCode"), n.hackingProgress.cleared = !0
    }, e.on("server started", function() {
        var e = a.get("continueCode");
        e && o.restoreProgress(encodeURIComponent(e)).then(function() {
            t("AUTO_RESTORED_PROGRESS").then(function(e) {
                n.hackingProgress.autoRestoreMessage = e
            }, function(e) {
                n.hackingProgress.autoRestoreMessage = e
            }).catch(angular.noop)
        }).catch(function(e) {
            console.log(e), t("AUTO_RESTORE_PROGRESS_FAILED", {
                error: e
            }).then(function(e) {
                n.hackingProgress.autoRestoreMessage = e
            }, function(e) {
                n.hackingProgress.autoRestoreMessage = e
            }).catch(angular.noop)
        })
    })
}]), angular.module("juiceShop").controller("TokenSaleController", ["$scope", "ConfigurationService", function(n, e) {
    n.altcoinName = "Juicycoin", e.getApplicationConfiguration().then(function(e) {
        e && e.application && null !== e.application.altcoinName && (n.altcoinName = e.application.altcoinName)
    }).catch(function(e) {
        console.log(e)
    })
}]), angular.module("juiceShop").controller("TrackOrderController", ["$scope", "$location", function(e, n) {
    "use strict";
    e.save = function() {
        n.path("/track-result").search({
            id: e.orderId || ""
        })
    }
}]), angular.module("juiceShop").controller("TrackResultController", ["$scope", "$sce", "$location", "TrackOrderService", function(n, t, e, a) {
    "use strict";
    n.orderId = e.search().id, a.track(n.orderId).then(function(e) {
        n.results = {}, n.results.orderId = t.trustAsHtml(e.data[0].orderId), n.results.email = e.data[0].email, n.results.totalPrice = e.data[0].totalPrice, n.results.products = e.data[0].products, n.results.eta = e.data[0].eta
    })
}]), angular.module("juiceShop").controller("UserController", ["$scope", "$uibModal", "$sce", "UserService", function(t, n, a, e) {
    "use strict";
    e.find().then(function(e) {
        t.users = e;
        for (var n = 0; n < t.users.length; n++) t.users[n].email = a.trustAsHtml(t.users[n].email)
    }).catch(function(e) {
        console.log(e)
    }), t.showDetail = function(e) {
        n.open({
            templateUrl: "views/UserDetail.html",
            controller: "UserDetailsController",
            size: "lg",
            resolve: {
                id: function() {
                    return e
                }
            }
        })
    }
}]), angular.module("juiceShop").controller("UserDetailsController", ["$scope", "$uibModal", "UserService", "id", function(n, e, t, a) {
    "use strict";
    t.get(a).then(function(e) {
        n.user = e
    }).catch(function(e) {
        console.log(e)
    })
}]), angular.module("juiceShop").config(["$routeProvider", function(e) {
    "use strict";
    e.when("/administration", {
        templateUrl: "views/Administration.html",
        controller: "AdministrationController"
    }), e.when("/about", {
        templateUrl: "views/About.html",
        controller: "AboutController"
    }), e.when("/contact", {
        templateUrl: "views/Contact.html",
        controller: "ContactController"
    }), e.when("/login", {
        templateUrl: "views/Login.html",
        controller: "LoginController"
    }), e.when("/register", {
        templateUrl: "views/Register.html",
        controller: "RegisterController"
    }), e.when("/basket", {
        templateUrl: "views/Basket.html",
        controller: "BasketController"
    }), e.when("/search", {
        templateUrl: "views/SearchResult.html",
        controller: "SearchResultController"
    }), e.when("/logout", {
        templateUrl: "views/Logout.html",
        controller: "LogoutController"
    }), e.when("/change-password", {
        templateUrl: "views/ChangePassword.html",
        controller: "ChangePasswordController"
    }), e.when("/forgot-password", {
        templateUrl: "views/ForgotPassword.html",
        controller: "ForgotPasswordController"
    }), e.when("/score-board", {
        templateUrl: "views/ScoreBoard.html",
        controller: "ChallengeController"
    }), e.when("/complain", {
        templateUrl: "views/Complaint.html",
        controller: "ComplaintController"
    }), e.when("/recycle", {
        templateUrl: "views/Recycle.html",
        controller: "RecycleController"
    }), e.when("/track-order", {
        templateUrl: "views/TrackOrder.html",
        controller: "TrackOrderController"
    }), e.when("/track-result", {
        templateUrl: "views/TrackResult.html",
        controller: "TrackResultController"
    }), e.when("/access_token=:accessToken", {
        templateUrl: "views/OAuth.html",
        controller: "OAuthController"
    }), e.when("/" + function() {
        var e = Array.prototype.slice.call(arguments),
            t = e.shift();
        return e.reverse().map(function(e, n) {
            return String.fromCharCode(e - t - 45 - n)
        }).join("")
    }(25, 184, 174, 179, 182, 186) + 36669..toString(36).toLowerCase() + function() {
        var e = Array.prototype.slice.call(arguments),
            t = e.shift();
        return e.reverse().map(function(e, n) {
            return String.fromCharCode(e - t - 24 - n)
        }).join("")
    }(13, 144, 87, 152, 139, 144, 83, 138) + 10..toString(36).toLowerCase(), {
        templateUrl: "views/TokenSale.html",
        controller: "TokenSaleController"
    }), e.otherwise({
        redirectTo: "/search"
    })
}]), angular.module("juiceShop").factory("AdministrationService", ["$http", "$q", function(e, t) {
    "use strict";
    return {
        getApplicationVersion: function() {
            var n = t.defer();
            return e.get("/rest/admin/application-version").then(function(e) {
                n.resolve(e.data.version)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("BasketService", ["$http", "$q", function(a, o) {
    "use strict";
    var r = "/api/BasketItems";
    return {
        find: function(e) {
            var n = o.defer();
            return a.get("/rest/basket/" + e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        get: function(e) {
            var n = o.defer();
            return a.get(r + "/" + e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        put: function(e, n) {
            var t = o.defer();
            return a.put(r + "/" + e, n).then(function(e) {
                t.resolve(e.data.data)
            }).catch(function(e) {
                t.reject(e.data)
            }), t.promise
        },
        del: function(e) {
            var n = o.defer();
            return a.delete(r + "/" + e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        save: function(e) {
            var n = o.defer();
            return a.post(r + "/", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        checkout: function(e) {
            var n = o.defer();
            return a.post("/rest/basket/" + e + "/checkout").then(function(e) {
                n.resolve(e.data.orderConfirmation)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        applyCoupon: function(e, n) {
            var t = o.defer();
            return a.put("/rest/basket/" + e + "/coupon/" + n).then(function(e) {
                t.resolve(e.data.discount)
            }).catch(function(e) {
                t.reject(e.data)
            }), t.promise
        }
    }
}]), angular.module("juiceShop").factory("CaptchaService", ["$http", "$q", function(e, t) {
    "use strict";
    return {
        getCaptcha: function() {
            var n = t.defer();
            return e.get("/rest/captcha/").then(function(e) {
                n.resolve(e.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("ChallengeService", ["$http", "$q", function(t, a) {
    "use strict";
    return {
        find: function(e) {
            var n = a.defer();
            return t.get("/api/Challenges/", {
                params: e
            }).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        repeatNotification: function(e) {
            return t.get("/rest/repeat-notification", {
                params: {
                    challenge: e
                }
            })
        },
        continueCode: function() {
            var n = a.defer();
            return t.get("/rest/continue-code").then(function(e) {
                n.resolve(e.data.continueCode)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        restoreProgress: function(e) {
            var n = a.defer();
            return t.put("/rest/continue-code/apply/" + e).then(function(e) {
                n.resolve(e.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("ComplaintService", ["$http", "$q", function(t, a) {
    "use strict";
    return {
        save: function(e) {
            var n = a.defer();
            return t.post("/api/Complaints/", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("ConfigurationService", ["$http", "$q", function(e, t) {
    "use strict";
    return {
        getApplicationConfiguration: function() {
            var n = t.defer();
            return e.get("/rest/admin/application-configuration").then(function(e) {
                n.resolve(e.data.config)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("CountryMappingService", ["$http", "$q", function(e, t) {
    "use strict";
    return {
        getCountryMapping: function() {
            var n = t.defer();
            return e.get("/rest/country-mapping").then(function(e) {
                n.resolve(e.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("FeedbackService", ["$http", "$q", function(t, a) {
    "use strict";
    var o = "/api/Feedbacks";
    return {
        find: function(e) {
            var n = a.defer();
            return t.get(o + "/", {
                params: e
            }).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        save: function(e) {
            var n = a.defer();
            return t.post(o + "/", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        del: function(e) {
            var n = a.defer();
            return t.delete(o + "/" + e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("ProductReviewService", ["$http", "$q", function(a, o) {
    "use strict";
    var r = "/rest/product";
    return {
        get: function(e) {
            var n = o.defer();
            return a.get(r + "/" + e + "/reviews").then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        create: function(e, n) {
            var t = o.defer();
            return a.put(r + "/" + e + "/reviews", n).then(function(e) {
                t.resolve(e.data.data)
            }).catch(function(e) {
                t.reject(e.data)
            }), t.promise
        },
        patch: function(e) {
            var n = o.defer();
            return a.patch(r + "/reviews", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("ProductService", ["$http", "$q", function(t, a) {
    "use strict";
    var o = "/api/Products";
    return {
        find: function(e) {
            var n = a.defer();
            return t.get(o + "/", {
                params: e
            }).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        get: function(e) {
            var n = a.defer();
            return t.get(o + "/" + e + "?d=" + encodeURIComponent((new Date).toDateString())).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        search: function(e) {
            var n = a.defer();
            return t.get("/rest/product/search?q=" + e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("RecycleService", ["$http", "$q", function(t, a) {
    "use strict";
    var o = "/api/Recycles";
    return {
        find: function(e) {
            var n = a.defer();
            return t.get(o + "/", {
                params: e
            }).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        save: function(e) {
            var n = a.defer();
            return t.post(o + "/", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("SecurityAnswerService", ["$http", "$q", function(t, a) {
    "use strict";
    return {
        save: function(e) {
            var n = a.defer();
            return t.post("/api/SecurityAnswers/", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("SecurityQuestionService", ["$http", "$q", function(t, a) {
    "use strict";
    return {
        find: function(e) {
            var n = a.defer();
            return t.get("/api/SecurityQuestions/", {
                params: e
            }).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        findBy: function(e) {
            var n = a.defer();
            return t.get("rest/user/security-question?email=" + e).then(function(e) {
                n.resolve(e.data.question)
            }).catch(function(e) {
                n.reject(e)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("TrackOrderService", ["$http", "$q", function(t, a) {
    "use strict";
    return {
        track: function(e) {
            var n = a.defer();
            return e = encodeURIComponent(e), t.get("/rest/track-order/" + e).then(function(e) {
                n.resolve(e.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("UserService", ["$http", "$q", function(t, a) {
    "use strict";
    var o = "/api/Users";
    return {
        find: function(e) {
            var n = a.defer();
            return t.get("/rest/user/authentication-details/", {
                params: e
            }).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        get: function(e) {
            var n = a.defer();
            return t.get(o + "/" + e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        save: function(e) {
            var n = a.defer();
            return t.post(o + "/", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        login: function(e) {
            var n = a.defer();
            return t.post("/rest/user/login", e).then(function(e) {
                n.resolve(e.data.authentication)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        changePassword: function(e) {
            var n = a.defer();
            return t.get("/rest/user/change-password?current=" + e.current + "&new=" + e.new + "&repeat=" + e.repeat).then(function(e) {
                n.resolve(e.data.user)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        resetPassword: function(e) {
            var n = a.defer();
            return t.post("/rest/user/reset-password", e).then(function(e) {
                n.resolve(e.data.user)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        whoAmI: function() {
            var n = a.defer();
            return t.get("/rest/user/whoami").then(function(e) {
                n.resolve(e.data.user)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        oauthLogin: function(e) {
            var n = a.defer();
            return t.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + e).then(function(e) {
                console.log("done: " + e.data), n.resolve(e.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop", ["ngRoute", "ngCookies", "ngTouch", "ngAnimate", "ngFileUpload", "ui.bootstrap", "pascalprecht.translate", "btford.socket-io", "ngclipboard", "base64", "monospaced.qrcode"]), angular.module("juiceShop").factory("authInterceptor", ["$rootScope", "$q", "$cookies", function(e, n, t) {
    "use strict";
    return {
        request: function(e) {
            return e.headers = e.headers || {}, t.get("token") && (e.headers.Authorization = "Bearer " + t.get("token")), e
        },
        response: function(e) {
            return e || n.when(e)
        }
    }
}]), angular.module("juiceShop").factory("rememberMeInterceptor", ["$rootScope", "$q", "$cookies", function(e, n, t) {
    "use strict";
    return {
        request: function(e) {
            return e.headers = e.headers || {}, t.get("email") && (e.headers["X-User-Email"] = t.get("email")), e
        },
        response: function(e) {
            return e || n.when(e)
        }
    }
}]), angular.module("juiceShop").factory("socket", ["socketFactory", function(e) {
    return e()
}]), angular.module("juiceShop").config(["$httpProvider", function(e) {
    "use strict";
    e.interceptors.push("authInterceptor"), e.interceptors.push("rememberMeInterceptor")
}]), angular.module("juiceShop").run(["$cookies", "$rootScope", function(e, n) {
    "use strict";
    n.isLoggedIn = function() {
        return e.get("token")
    }
}]), angular.module("juiceShop").config(["$translateProvider", function(e) {
    "use strict";
    e.useStaticFilesLoader({
        prefix: "/i18n/",
        suffix: ".json"
    }), e.determinePreferredLanguage(), e.fallbackLanguage("en"), e.useSanitizeValueStrategy(null)
}]), angular.module("juiceShop").config(["$qProvider", function(e) {
    e.errorOnUnhandledRejections(!1)
}]), angular.module("juiceShop").config(["$locationProvider", function(e) {
    e.hashPrefix("")
}]), angular.module("juiceShop").filter("emailName", function() {
    return function(e) {
        return e.split("@")[0].split(".").join(" ")
    }
}), angular.module("juiceShop").controller("AboutController", ["$scope", "ConfigurationService", function(n, e) {
    n.twitterUrl = null, n.facebookUrl = null, e.getApplicationConfiguration().then(function(e) {
        e && e.application && (null !== e.application.twitterUrl && (n.twitterUrl = e.application.twitterUrl), null !== e.application.facebookUrl && (n.facebookUrl = e.application.facebookUrl))
    }).catch(function(e) {
        console.log(e)
    })
}]), angular.module("juiceShop").controller("AdministrationController", [function() {}]), angular.module("juiceShop").controller("BasketController", ["$scope", "$sce", "$window", "$translate", "$uibModal", "BasketService", "UserService", "ConfigurationService", function(t, a, n, o, e, r, i, s) {
    "use strict";

    function l() {
        r.find(n.sessionStorage.bid).then(function(e) {
            t.products = e.Products;
            for (var n = 0; n < t.products.length; n++) t.products[n].description = a.trustAsHtml(t.products[n].description)
        }).catch(function(e) {
            console.log(e)
        })
    }

    function c(t, a) {
        r.get(t).then(function(e) {
            var n = e.quantity + a;
            r.put(t, {
                quantity: n < 1 ? 1 : n
            }).then(function() {
                l()
            }).catch(function(e) {
                console.log(e)
            })
        }).catch(function(e) {
            console.log(e)
        })
    }
    i.whoAmI().then(function(e) {
        t.userEmail = e.email || "anonymous"
    }).catch(angular.noop), t.couponPanelExpanded = !!n.localStorage.couponPanelExpanded && JSON.parse(n.localStorage.couponPanelExpanded), t.paymentPanelExpanded = !!n.localStorage.paymentPanelExpanded && JSON.parse(n.localStorage.paymentPanelExpanded), t.toggleCoupon = function() {
        n.localStorage.couponPanelExpanded = JSON.stringify(t.couponPanelExpanded)
    }, t.togglePayment = function() {
        n.localStorage.paymentPanelExpanded = JSON.stringify(t.paymentPanelExpanded)
    }, l(), t.delete = function(e) {
        r.del(e).then(function() {
            l()
        }).catch(function(e) {
            console.log(e)
        })
    }, t.applyCoupon = function() {
        r.applyCoupon(n.sessionStorage.bid, encodeURIComponent(t.coupon)).then(function(e) {
            t.coupon = void 0, o("DISCOUNT_APPLIED", {
                discount: e
            }).then(function(e) {
                t.confirmation = e
            }, function(e) {
                t.confirmation = e
            }).catch(angular.noop), t.error = void 0, t.form.$setPristine()
        }).catch(function(e) {
            console.log(e), t.confirmation = void 0, t.error = e, t.form.$setPristine()
        })
    }, t.checkout = function() {
        r.checkout(n.sessionStorage.bid).then(function(e) {
            n.location.replace(e)
        }).catch(function(e) {
            console.log(e)
        })
    }, t.inc = function(e) {
        c(e, 1)
    }, t.dec = function(e) {
        c(e, -1)
    }, t.showBitcoinQrCode = function() {
        e.open({
            templateUrl: "views/QrCode.html",
            controller: "QrCodeController",
            size: "md",
            resolve: {
                data: function() {
                    return "bitcoin:1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm"
                },
                url: function() {
                    return "/redirect?to=https://blockchain.info/address/1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm"
                },
                address: function() {
                    return "1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm"
                },
                title: function() {
                    return "TITLE_BITCOIN_ADDRESS"
                }
            }
        })
    }, t.showDashQrCode = function() {
        e.open({
            templateUrl: "views/QrCode.html",
            controller: "QrCodeController",
            size: "md",
            resolve: {
                data: function() {
                    return "dash:Xr556RzuwX6hg5EGpkybbv5RanJoZN17kW"
                },
                url: function() {
                    return "/redirect?to=https://explorer.dash.org/address/Xr556RzuwX6hg5EGpkybbv5RanJoZN17kW"
                },
                address: function() {
                    return "Xr556RzuwX6hg5EGpkybbv5RanJoZN17kW"
                },
                title: function() {
                    return "TITLE_DASH_ADDRESS"
                }
            }
        })
    }, t.showEtherQrCode = function() {
        e.open({
            templateUrl: "views/QrCode.html",
            controller: "QrCodeController",
            size: "md",
            resolve: {
                data: function() {
                    return "0x0f933ab9fCAAA782D0279C300D73750e1311EAE6"
                },
                url: function() {
                    return "https://etherscan.io/address/0x0f933ab9fcaaa782d0279c300d73750e1311eae6"
                },
                address: function() {
                    return "0x0f933ab9fCAAA782D0279C300D73750e1311EAE6"
                },
                title: function() {
                    return "TITLE_ETHER_ADDRESS"
                }
            }
        })
    }, t.twitterUrl = null, t.facebookUrl = null, t.applicationName = "OWASP Juice Shop", s.getApplicationConfiguration().then(function(e) {
        e && e.application && (null !== e.application.twitterUrl && (t.twitterUrl = e.application.twitterUrl), null !== e.application.facebookUrl && (t.facebookUrl = e.application.facebookUrl), null !== e.application.name && (t.applicationName = e.application.name))
    }).catch(function(e) {
        console.log(e)
    })
}]), angular.module("juiceShop").controller("ChallengeController", ["$scope", "$sce", "$translate", "$cookies", "$uibModal", "$window", "ChallengeService", "ConfigurationService", "socket", function(i, n, e, t, a, o, r, s, l) {
    "use strict";
    i.scoreBoardTablesExpanded = o.localStorage.scoreBoardTablesExpanded ? JSON.parse(o.localStorage.scoreBoardTablesExpanded) : [null, !0, !1, !1, !1, !1, !1], i.offsetValue = ["100%", "100%", "100%", "100%", "100%", "100%"], i.toggleDifficulty = function() {
        o.localStorage.scoreBoardTablesExpanded = JSON.stringify(i.scoreBoardTablesExpanded)
    }, s.getApplicationConfiguration().then(function(e) {
        i.allowRepeatNotifications = e.application.showChallengeSolvedNotifications && e.ctf.showFlagsInNotifications, i.showChallengeHints = e.application.showChallengeHints
    }).catch(angular.noop), i.repeatNotification = function(e) {
        i.allowRepeatNotifications && r.repeatNotification(encodeURIComponent(e.name)).then(function() {
            o.scrollTo(0, 0)
        }).catch(angular.noop)
    }, i.openHint = function(e) {
        i.showChallengeHints && e.hintUrl && o.open(e.hintUrl, "_blank")
    }, i.trustDescriptionHtml = function() {
        for (var e = 0; e < i.challenges.length; e++) i.challenges[e].description = n.trustAsHtml(i.challenges[e].description)
    }, i.calculateProgressPercentage = function() {
        for (var e = 0, n = 0; n < i.challenges.length; n++) e += i.challenges[n].solved ? 1 : 0;
        i.percentChallengesSolved = (100 * e / i.challenges.length).toFixed(0), 75 < i.percentChallengesSolved ? i.completionColor = "success" : 25 < i.percentChallengesSolved ? i.completionColor = "warning" : i.completionColor = "danger"
    }, i.setOffset = function(e) {
        for (var n = 1; n <= 6; n++) {
            for (var t = 0, a = 0, o = 0; o < e.length; o++) e[o].difficulty === n && (a++, e[o].solved && t++);
            var r = Math.round(100 * t / a);
            r = +(r = 100 - r) + "%", i.offsetValue[n - 1] = r
        }
    }, r.find().then(function(e) {
        i.challenges = e;
        for (var n = 0; n < i.challenges.length; n++) i.challenges[n].hintUrl && (i.challenges[n].hint ? i.challenges[n].hint += " Click for more hints." : i.challenges[n].hint = "Click to open hints."), i.challenges[n].disabledEnv && (i.challenges[n].hint = "This challenge is unavailable in a " + i.challenges[n].disabledEnv + " environment!");
        i.trustDescriptionHtml(), i.calculateProgressPercentage(), i.setOffset(e)
    }).catch(function(e) {
        console.log(e)
    }), l.on("challenge solved", function(e) {
        if (e && e.challenge) {
            for (var n = 0; n < i.challenges.length; n++)
                if (i.challenges[n].name === e.name) {
                    i.challenges[n].solved = !0;
                    break
                } i.calculateProgressPercentage(), i.setOffset(i.challenges)
        }
    })
}]), angular.module("juiceShop").controller("ChallengeSolvedNotificationController", ["$scope", "$rootScope", "$translate", "$cookies", "socket", "ConfigurationService", "ChallengeService", "CountryMappingService", function(a, n, e, t, o, r, i, s) {
    "use strict";
    a.notifications = [], a.closeNotification = function(e) {
        a.notifications.splice(e, 1)
    }, a.showNotification = function(t) {
        e("CHALLENGE_SOLVED", {
            challenge: t.challenge
        }).then(function(e) {
            return e
        }, function(e) {
            return e
        }).then(function(e) {
            var n;
            a.showCtfCountryDetailsInNotifications && "none" !== a.showCtfCountryDetailsInNotifications && (n = a.countryMap[t.key]), a.notifications.push({
                message: e,
                flag: t.flag,
                country: n,
                copied: !1
            })
        }).catch(angular.noop)
    }, a.saveProgress = function() {
        i.continueCode().then(function(e) {
            if (!e) throw new Error("Received invalid continue code from the sever!");
            var n = new Date;
            n.setFullYear(n.getFullYear() + 1), t.put("continueCode", e, {
                expires: n
            })
        }).catch(function(e) {
            console.log(e)
        })
    }, o.on("challenge solved", function(e) {
        e && e.challenge && (e.hidden || a.showNotification(e), e.isRestore || a.saveProgress(), "Score Board" === e.name && n.$emit("score_board_challenge_solved"), o.emit("notification received", e.flag))
    }), r.getApplicationConfiguration().then(function(e) {
        e && e.ctf && (null !== e.ctf.showFlagsInNotifications ? a.showCtfFlagsInNotifications = e.ctf.showFlagsInNotifications : a.showCtfFlagsInNotifications = !1, e.ctf.showCountryDetailsInNotifications ? (a.showCtfCountryDetailsInNotifications = e.ctf.showCountryDetailsInNotifications, "none" !== e.ctf.showCountryDetailsInNotifications && s.getCountryMapping().then(function(e) {
            a.countryMap = e
        }).catch(function(e) {
            console.log(e)
        })) : a.showCtfCountryDetailsInNotifications = "none")
    }, function(e) {
        console.log(e)
    }).catch(angular.noop)
}]), angular.module("juiceShop").controller("ChangePasswordController", ["$scope", "$location", "UserService", function(n, e, t) {
    "use strict";

    function a() {
        n.currentPassword = void 0, n.newPassword = void 0, n.newPasswordRepeat = void 0, n.form.$setPristine()
    }
    n.changePassword = function() {
        t.changePassword({
            current: n.currentPassword,
            new: n.newPassword,
            repeat: n.newPasswordRepeat
        }).then(function() {
            n.error = void 0, n.confirmation = "Your password was successfully changed.", a()
        }).catch(function(e) {
            n.error = e, n.confirmation = void 0, a()
        })
    }
}]), angular.module("juiceShop").controller("ComplaintController", ["$scope", "Upload", "ComplaintService", "UserService", function(t, n, e, a) {
    "use strict";

    function o() {
        a.whoAmI().then(function(e) {
            t.complaint = {}, t.complaint.UserId = e.id, t.userEmail = e.email
        }).catch(angular.noop)
    }

    function r() {
        e.save(t.complaint).then(function(e) {
            t.confirmation = "Customer support will get in touch with you soon! Your complaint reference is #" + e.id, o(), t.file = void 0, t.form.$setPristine()
        }).catch(angular.noop)
    }
    o(), t.save = function() {
        t.file ? t.upload(t.file) : r()
    }, t.upload = function(e) {
        n.upload({
            url: "/file-upload",
            data: {
                file: e
            }
        }).then(function(e) {
            t.complaint.file = e.config.data.file.name, r()
        }, function(e) {
            console.log("Error status: " + e.status), r()
        }, function(e) {
            var n = parseInt(100 * e.loaded / e.total, 10);
            t.progress = "(Progress: " + n + "%)"
        }).catch(angular.noop)
    }
}]), angular.module("juiceShop").controller("ContactController", ["$scope", "FeedbackService", "UserService", "CaptchaService", function(n, e, t, a) {
    "use strict";

    function o() {
        a.getCaptcha().then(function(e) {
            n.captcha = e.captcha, n.captchaId = e.captchaId
        }).catch(angular.noop)
    }
    t.whoAmI().then(function(e) {
        n.feedback = {}, n.feedback.UserId = e.id, n.userEmail = e.email || "anonymous"
    }).catch(angular.noop), o(), n.save = function() {
        n.feedback.captchaId = n.captchaId, e.save(n.feedback).then(function(e) {
            n.error = null, n.confirmation = "Thank you for your feedback" + (5 === e.rating ? " and your 5-star rating!" : "."), n.feedback = {}, o(), n.form.$setPristine()
        }).catch(function(e) {
            n.error = e, n.confirmation = null, n.feedback = {}, n.form.$setPristine()
        })
    }
}]), angular.module("juiceShop").controller("FeedbackController", ["$scope", "$sce", "FeedbackService", function(t, a, n) {
    "use strict";
    t.interval = 5e3, t.noWrapSlides = !1, t.active = 0;
    var o = ["public/images/carousel/1.jpg", "public/images/carousel/2.jpg", "public/images/carousel/3.jpg", "public/images/carousel/4.jpg", "public/images/carousel/5.png", "public/images/carousel/6.jpg", "public/images/carousel/7.jpg"];

    function r() {
        n.find().then(function(e) {
            t.feedbacks = e;
            for (var n = 0; n < t.feedbacks.length; n++) t.feedbacks[n].comment = a.trustAsHtml(t.feedbacks[n].comment), t.feedbacks[n].image = o[n % o.length]
        }).catch(function(e) {
            console.log(e)
        })
    }
    r(), t.delete = function(e) {
        n.del(e).then(function() {
            r()
        }).catch(function(e) {
            console.log(e)
        })
    }
}]), angular.module("juiceShop").controller("ForgotPasswordController", ["$scope", "$location", "UserService", "SecurityQuestionService", function(n, e, t, a) {
    "use strict";

    function o() {
        n.email = void 0, n.securityQuestion = void 0, n.securityAnswer = void 0, n.newPassword = void 0, n.newPasswordRepeat = void 0, n.form.$setPristine()
    }
    n.findSecurityQuestion = function() {
        n.securityQuestion = void 0, n.email && a.findBy(n.email).then(function(e) {
            n.securityQuestion = e.question
        }).catch(angular.noop)
    }, n.resetPassword = function() {
        t.resetPassword({
            email: n.email,
            answer: n.securityAnswer,
            new: n.newPassword,
            repeat: n.newPasswordRepeat
        }).then(function() {
            n.error = void 0, n.confirmation = "Your password was successfully changed.", o()
        }).catch(function(e) {
            n.error = e, n.confirmation = void 0, o()
        })
    }
}]), angular.module("juiceShop").controller("LanguageController", ["$scope", "$cookies", "$translate", function(e, t, a) {
    "use strict";
    if (t.get("language")) {
        var n = t.get("language");
        a.use(n)
    }
    e.languages = languages, e.changeLanguage = function(e) {
        a.use(e);
        var n = new Date;
        n.setFullYear(n.getFullYear() + 1), t.put("language", e, {
            expires: n
        })
    }
}]);
languages = [{
    key: "ar_SA",
    icon: "ae",
    lang: "عربى"
}, {
    key: "cs_CZ",
    icon: "cz",
    lang: "Česky",
    isFlask: !0
}, {
    key: "da_DK",
    icon: "dk",
    lang: "Dansk",
    isFlask: !0
}, {
    key: "de_DE",
    icon: "de",
    lang: "Deutsch"
}, {
    key: "el_GR",
    icon: "gr",
    lang: "Ελληνικά",
    isFlask: !0
}, {
    key: "es_ES",
    icon: "es",
    lang: "Español",
    isFlask: !0
}, {
    key: "et_EE",
    icon: "ee",
    lang: "Eesti"
}, {
    key: "fi_FI",
    icon: "fi",
    lang: "Suomalainen",
    isFlask: !0
}, {
    key: "fr_FR",
    icon: "fr",
    lang: "Français"
}, {
    key: "he_IL",
    icon: "il",
    lang: "עברי"
}, {
    key: "hi_IN",
    icon: "in",
    lang: "हिंदी"
}, {
    key: "hu_HU",
    icon: "hu",
    lang: "Magyar",
    isFlask: !0
}, {
    key: "id_ID",
    icon: "id",
    lang: "Bahasa Indonesia"
}, {
    key: "it_IT",
    icon: "it",
    lang: "Italiano"
}, {
    key: "ja_JP",
    icon: "jp",
    lang: "日本の"
}, {
    key: "lt_LT",
    icon: "lt",
    lang: "Lietuviešu",
    isFlask: !0
}, {
    key: "lv_LV",
    icon: "lv",
    lang: "Latvijas",
    isFlask: !0
}, {
    key: "my_MM",
    icon: "mm",
    lang: "ျမန္မာ",
    isFlask: !0
}, {
    key: "nl_NL",
    icon: "nl",
    lang: "Nederlands"
}, {
    key: "no_NO",
    icon: "no",
    lang: "Norsk"
}, {
    key: "pl_PL",
    icon: "pl",
    lang: "Język Polski"
}, {
    key: "pt_PT",
    icon: "pt",
    lang: "Português",
    isFlask: !0
}, {
    key: "pt_BR",
    icon: "br",
    lang: "Português (Brasil)"
}, {
    key: "ro_RO",
    icon: "ro",
    lang: "Românesc"
}, {
    key: "ru_RU",
    icon: "ru",
    lang: "Pусский",
    isFlask: !0
}, {
    key: "sv_SE",
    icon: "se",
    lang: "Svenska"
}, {
    key: "tr_TR",
    icon: "tr",
    lang: "Türkçe"
}, {
    key: "ur_PK",
    icon: "pk",
    lang: "اردو"
}, {
    key: "zh_CN",
    icon: "cn",
    lang: "中国"
}, {
    key: "zh_HK",
    icon: "hk",
    lang: "繁體中文"
}];
angular.module("juiceShop").controller("LoginController", ["$scope", "$rootScope", "$window", "$location", "$cookies", "UserService", function(n, t, a, o, r, e) {
    "use strict";
    var i = r.get("email");
    n.rememberMe = !!i && (n.user = {}, n.user.email = i, !0), n.login = function() {
        e.login(n.user).then(function(e) {
            r.put("token", e.token), a.sessionStorage.bid = e.bid, t.$emit("user_logged_in"), o.path("/")
        }).catch(function(e) {
            r.remove("token"), delete a.sessionStorage.bid, n.error = e, n.form.$setPristine()
        }), n.rememberMe ? r.put("email", n.user.email) : r.remove("email")
    }, n.googleLogin = function() {
        a.location.replace(s + "?client_id=" + l + "&response_type=token&scope=email&redirect_uri=" + c[u])
    };
    var s = "https://accounts.google.com/o/oauth2/v2/auth",
        l = "1005568560502-6hm16lef8oh46hr2d98vf2ohlnj4nfhq.apps.googleusercontent.com",
        c = {
            "http://demo.owasp-juice.shop": "http://demo.owasp-juice.shop",
            "https://juice-shop.herokuapp.com": "https://juice-shop.herokuapp.com",
            "http://juice-shop.herokuapp.com": "http://juice-shop.herokuapp.com",
            "http://preview.owasp-juice.shop": "http://preview.owasp-juice.shop",
            "https://juice-shop-staging.herokuapp.com": "https://juice-shop-staging.herokuapp.com",
            "http://juice-shop-staging.herokuapp.com": "http://juice-shop-staging.herokuapp.com",
            "http://localhost:3000": "http://localhost:3000",
            "http://localhost:4200": "http://localhost:4200",
            "http://juice.sh": "http://juice.sh",
            "http://192.168.99.100:3000": "http://tinyurl.com/ipMacLocalhost"
        },
        u = o.protocol() + "://" + location.host;
    n.oauthUnavailable = !c[u], n.oauthUnavailable && console.log(u + " is not an authorized redirect URI for this application.")
}]), angular.module("juiceShop").controller("LogoutController", ["$rootScope", "$cookies", "$window", "$location", function(e, n, t, a) {
    "use strict";
    n.remove("token"), delete t.sessionStorage.bid, e.$emit("user_logged_out"), a.path("/")
}]), angular.module("juiceShop").controller("NavbarController", ["$scope", "$rootScope", "$location", "AdministrationService", "ConfigurationService", "UserService", "ChallengeService", function(n, t, e, a, o, r, i) {
    "use strict";

    function s() {
        r.whoAmI().then(function(e) {
            t.userEmail = e.email
        }).catch(function(e) {
            console.log(e)
        })
    }
    n.version = "", a.getApplicationVersion().then(function(e) {
        e && (n.version = "v" + e)
    }).catch(function(e) {
        console.log(e)
    }), t.applicationName = "OWASP Juice Shop", t.gitHubRibbon = "orange", o.getApplicationConfiguration().then(function(e) {
        e && e.application && null !== e.application.name && (t.applicationName = e.application.name), e && e.application && null !== e.application.gitHubRibbon && (t.gitHubRibbon = "none" !== e.application.gitHubRibbon ? e.application.gitHubRibbon : null)
    }).catch(function(e) {
        console.log(e)
    }), e.search().gitHubRibbon && (t.gitHubRibbon = e.search().gitHubRibbon), t.userEmail = "", s(), t.$on("user_logged_in", function() {
        s()
    }), t.$on("user_logged_out", function() {
        t.userEmail = ""
    }), t.scoreBoardMenuVisible = !1, i.find({
        name: "Score Board"
    }).then(function(e) {
        t.scoreBoardMenuVisible = e[0].solved
    }).catch(function(e) {
        console.log(e)
    }), t.$on("score_board_challenge_solved", function() {
        t.scoreBoardMenuVisible = !0
    })
}]), angular.module("juiceShop").controller("OAuthController", ["$rootScope", "$window", "$location", "$cookies", "$base64", "UserService", function(n, t, r, a, o, i) {
    "use strict";

    function s(e) {
        i.login({
            email: e.email,
            password: o.encode(e.email),
            oauth: !0
        }).then(function(e) {
            a.put("token", e.token), t.sessionStorage.bid = e.bid, n.$emit("user_logged_in"), r.path("/")
        }).catch(function(e) {
            l(e), r.path("/login")
        })
    }

    function l(e) {
        console.log(e), a.remove("token"), delete t.sessionStorage.bid
    }
    i.oauthLogin(function() {
        for (var e = r.path().substr(1).split("&"), n = {}, t = 0; t < e.length; t++) {
            var a = e[t].split("="),
                o = a[0];
            n[o] = a[1]
        }
        return n
    }().access_token).then(function(e) {
        i.save({
            email: e.email,
            password: o.encode(e.email)
        }).then(function() {
            s(e)
        }).catch(function() {
            s(e)
        })
    }).catch(function(e) {
        l(e), r.path("/login")
    })
}]), angular.module("juiceShop").controller("ProductDetailsController", ["$scope", "$sce", "$q", "$uibModal", "ProductService", "ProductReviewService", "UserService", "id", function(o, r, e, n, t, a, i, s) {
    "use strict";
    e.all([t.get(s), a.get(s), i.whoAmI()]).then(function(e) {
        var n = e[0],
            t = e[1],
            a = e[2];
        o.product = n, o.product.description = r.trustAsHtml(o.product.description), o.productReviews = t, a && a.email ? o.author = a.email : o.author = "Anonymous"
    }).catch(function(e) {
        console.log(e)
    }), o.addReview = function() {
        var e = {
            message: o.message,
            author: o.author
        };
        o.productReviews.push(e), a.create(s, e)
    }, o.refreshReviews = function() {
        a.get(s).then(function(e) {
            o.productReviews = e
        }).catch(angular.noop)
    }, o.editReview = function(e) {
        n.open({
            templateUrl: "views/ProductReviewEdit.html",
            controller: "ProductReviewEditController",
            bindings: {
                resolve: "<",
                close: "&",
                dismiss: "&"
            },
            size: "lg",
            resolve: {
                review: function() {
                    return e
                }
            }
        }).result.then(function() {
            o.refreshReviews()
        }, function() {
            console.log("Cancelled")
        })
    }
}]), angular.module("juiceShop").controller("ProductReviewEditController", ["$scope", "$uibModalInstance", "ProductReviewService", "review", function(n, e, t, a) {
    "use strict";
    n.id = a._id, n.message = a.message, n.editReview = function() {
        t.patch({
            id: n.id,
            message: n.message
        }).then(function() {
            e.close(n.message)
        }).catch(function(e) {
            console.log(e), n.err = e
        })
    }
}]), angular.module("juiceShop").controller("QrCodeController", ["$scope", "data", "url", "address", "title", function(e, n, t, a, o) {
    e.data = n, e.url = t, e.address = a, e.title = o
}]), angular.module("juiceShop").controller("RecycleController", ["$scope", "RecycleService", "UserService", "ConfigurationService", function(n, e, t, a) {
    "use strict";

    function o() {
        t.whoAmI().then(function(e) {
            n.recycle = {}, n.recycle.UserId = e.id, n.userEmail = e.email
        }).catch(angular.noop)
    }
    a.getApplicationConfiguration().then(function(e) {
        e && e.application && e.application.recyclePage && (n.topImage = "/public/images/products/" + e.application.recyclePage.topProductImage, n.bottomImage = "/public/images/products/" + e.application.recyclePage.bottomProductImage)
    }).catch(angular.noop), o(), n.save = function() {
        e.save(n.recycle).then(function(e) {
            n.confirmation = "Thank you for using our recycling service. We will " + (e.isPickup ? "pick up your pomace on " + e.pickupDate : "deliver your recycle box asap") + ".", o(), n.form.$setPristine()
        })
    }, e.find().then(function(e) {
        n.recycles = e
    }).catch(function(e) {
        console.log(e)
    })
}]), angular.module("juiceShop").controller("RegisterController", ["$scope", "$location", "UserService", "SecurityQuestionService", "SecurityAnswerService", function(n, t, e, a, o) {
    "use strict";
    a.find().then(function(e) {
        n.securityQuestions = e
    }).catch(function(e) {
        console.log(e)
    }), n.save = function() {
        e.save(n.user).then(function(e) {
            o.save({
                UserId: e.id,
                answer: n.user.securityAnswer,
                SecurityQuestionId: n.user.securityQuestion.id
            }).then(function() {
                n.user = {}, t.path("/login")
            })
        }).catch(angular.noop)
    }
}]), angular.module("juiceShop").controller("SearchController", ["$scope", "$location", function(e, n) {
    "use strict";
    e.search = function() {
        n.path("/search").search({
            q: e.searchQuery || ""
        })
    }
}]), angular.module("juiceShop").controller("SearchResultController", ["$scope", "$sce", "$window", "$uibModal", "$location", "$translate", "ProductService", "BasketService", function(r, t, i, n, e, s, l, c) {
    "use strict";
    r.showDetail = function(e) {
        n.open({
            templateUrl: "views/ProductDetail.html",
            controller: "ProductDetailsController",
            size: "lg",
            resolve: {
                id: function() {
                    return e
                }
            }
        })
    }, r.addToBasket = function(o) {
        c.find(i.sessionStorage.bid).then(function(e) {
            for (var n = e.Products, t = !1, a = 0; a < n.length; a++)
                if (n[a].id === o) {
                    t = !0, c.get(n[a].BasketItem.id).then(function(e) {
                        var n = e.quantity + 1;
                        c.put(e.id, {
                            quantity: n
                        }).then(function(e) {
                            l.get(e.ProductId).then(function(e) {
                                s("BASKET_ADD_SAME_PRODUCT", {
                                    product: e.name
                                }).then(function(e) {
                                    r.confirmation = e
                                }, function(e) {
                                    r.confirmation = e
                                }).catch(angular.noop)
                            }).catch(function(e) {
                                console.log(e)
                            })
                        }).catch(function(e) {
                            console.log(e)
                        })
                    }).catch(function(e) {
                        console.log(e)
                    });
                    break
                } t || c.save({
                ProductId: o,
                BasketId: i.sessionStorage.bid,
                quantity: 1
            }).then(function(e) {
                l.get(e.ProductId).then(function(e) {
                    s("BASKET_ADD_PRODUCT", {
                        product: e.name
                    }).then(function(e) {
                        r.confirmation = e
                    }, function(e) {
                        r.confirmation = e
                    }).catch(angular.noop)
                }).catch(function(e) {
                    console.log(e)
                })
            }).catch(function(e) {
                console.log(e)
            })
        }).catch(function(e) {
            console.log(e)
        })
    }, r.searchQuery = t.trustAsHtml(e.search().q), l.search(r.searchQuery).then(function(e) {
        r.products = e;
        for (var n = 0; n < r.products.length; n++) r.products[n].description = t.trustAsHtml(r.products[n].description)
    }).catch(function(e) {
        console.log(e)
    })
}]), angular.module("juiceShop").controller("ServerStartedNotificationController", ["$scope", "$translate", "$cookies", "ChallengeService", "socket", function(n, t, a, o, e) {
    "use strict";
    n.hackingProgress = {}, n.closeNotification = function() {
        n.hackingProgress.autoRestoreMessage = null
    }, n.clearProgress = function() {
        a.remove("continueCode"), n.hackingProgress.cleared = !0
    }, e.on("server started", function() {
        var e = a.get("continueCode");
        e && o.restoreProgress(encodeURIComponent(e)).then(function() {
            t("AUTO_RESTORED_PROGRESS").then(function(e) {
                n.hackingProgress.autoRestoreMessage = e
            }, function(e) {
                n.hackingProgress.autoRestoreMessage = e
            }).catch(angular.noop)
        }).catch(function(e) {
            console.log(e), t("AUTO_RESTORE_PROGRESS_FAILED", {
                error: e
            }).then(function(e) {
                n.hackingProgress.autoRestoreMessage = e
            }, function(e) {
                n.hackingProgress.autoRestoreMessage = e
            }).catch(angular.noop)
        })
    })
}]), angular.module("juiceShop").controller("TokenSaleController", ["$scope", "ConfigurationService", function(n, e) {
    n.altcoinName = "Juicycoin", e.getApplicationConfiguration().then(function(e) {
        e && e.application && null !== e.application.altcoinName && (n.altcoinName = e.application.altcoinName)
    }).catch(function(e) {
        console.log(e)
    })
}]), angular.module("juiceShop").controller("TrackOrderController", ["$scope", "$location", function(e, n) {
    "use strict";
    e.save = function() {
        n.path("/track-result").search({
            id: e.orderId || ""
        })
    }
}]), angular.module("juiceShop").controller("TrackResultController", ["$scope", "$sce", "$location", "TrackOrderService", function(n, t, e, a) {
    "use strict";
    n.orderId = e.search().id, a.track(n.orderId).then(function(e) {
        n.results = {}, n.results.orderId = t.trustAsHtml(e.data[0].orderId), n.results.email = e.data[0].email, n.results.totalPrice = e.data[0].totalPrice, n.results.products = e.data[0].products, n.results.eta = e.data[0].eta
    })
}]), angular.module("juiceShop").controller("UserController", ["$scope", "$uibModal", "$sce", "UserService", function(t, n, a, e) {
    "use strict";
    e.find().then(function(e) {
        t.users = e;
        for (var n = 0; n < t.users.length; n++) t.users[n].email = a.trustAsHtml(t.users[n].email)
    }).catch(function(e) {
        console.log(e)
    }), t.showDetail = function(e) {
        n.open({
            templateUrl: "views/UserDetail.html",
            controller: "UserDetailsController",
            size: "lg",
            resolve: {
                id: function() {
                    return e
                }
            }
        })
    }
}]), angular.module("juiceShop").controller("UserDetailsController", ["$scope", "$uibModal", "UserService", "id", function(n, e, t, a) {
    "use strict";
    t.get(a).then(function(e) {
        n.user = e
    }).catch(function(e) {
        console.log(e)
    })
}]), angular.module("juiceShop").config(["$routeProvider", function(e) {
    "use strict";
    e.when("/administration", {
        templateUrl: "views/Administration.html",
        controller: "AdministrationController"
    }), e.when("/about", {
        templateUrl: "views/About.html",
        controller: "AboutController"
    }), e.when("/contact", {
        templateUrl: "views/Contact.html",
        controller: "ContactController"
    }), e.when("/login", {
        templateUrl: "views/Login.html",
        controller: "LoginController"
    }), e.when("/register", {
        templateUrl: "views/Register.html",
        controller: "RegisterController"
    }), e.when("/basket", {
        templateUrl: "views/Basket.html",
        controller: "BasketController"
    }), e.when("/search", {
        templateUrl: "views/SearchResult.html",
        controller: "SearchResultController"
    }), e.when("/logout", {
        templateUrl: "views/Logout.html",
        controller: "LogoutController"
    }), e.when("/change-password", {
        templateUrl: "views/ChangePassword.html",
        controller: "ChangePasswordController"
    }), e.when("/forgot-password", {
        templateUrl: "views/ForgotPassword.html",
        controller: "ForgotPasswordController"
    }), e.when("/score-board", {
        templateUrl: "views/ScoreBoard.html",
        controller: "ChallengeController"
    }), e.when("/complain", {
        templateUrl: "views/Complaint.html",
        controller: "ComplaintController"
    }), e.when("/recycle", {
        templateUrl: "views/Recycle.html",
        controller: "RecycleController"
    }), e.when("/track-order", {
        templateUrl: "views/TrackOrder.html",
        controller: "TrackOrderController"
    }), e.when("/track-result", {
        templateUrl: "views/TrackResult.html",
        controller: "TrackResultController"
    }), e.when("/access_token=:accessToken", {
        templateUrl: "views/OAuth.html",
        controller: "OAuthController"
    }), e.when("/" + function() {
        var e = Array.prototype.slice.call(arguments),
            t = e.shift();
        return e.reverse().map(function(e, n) {
            return String.fromCharCode(e - t - 45 - n)
        }).join("")
    }(25, 184, 174, 179, 182, 186) + 36669..toString(36).toLowerCase() + function() {
        var e = Array.prototype.slice.call(arguments),
            t = e.shift();
        return e.reverse().map(function(e, n) {
            return String.fromCharCode(e - t - 24 - n)
        }).join("")
    }(13, 144, 87, 152, 139, 144, 83, 138) + 10..toString(36).toLowerCase(), {
        templateUrl: "views/TokenSale.html",
        controller: "TokenSaleController"
    }), e.otherwise({
        redirectTo: "/search"
    })
}]), angular.module("juiceShop").factory("AdministrationService", ["$http", "$q", function(e, t) {
    "use strict";
    return {
        getApplicationVersion: function() {
            var n = t.defer();
            return e.get("/rest/admin/application-version").then(function(e) {
                n.resolve(e.data.version)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("BasketService", ["$http", "$q", function(a, o) {
    "use strict";
    var r = "/api/BasketItems";
    return {
        find: function(e) {
            var n = o.defer();
            return a.get("/rest/basket/" + e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        get: function(e) {
            var n = o.defer();
            return a.get(r + "/" + e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        put: function(e, n) {
            var t = o.defer();
            return a.put(r + "/" + e, n).then(function(e) {
                t.resolve(e.data.data)
            }).catch(function(e) {
                t.reject(e.data)
            }), t.promise
        },
        del: function(e) {
            var n = o.defer();
            return a.delete(r + "/" + e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        save: function(e) {
            var n = o.defer();
            return a.post(r + "/", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        checkout: function(e) {
            var n = o.defer();
            return a.post("/rest/basket/" + e + "/checkout").then(function(e) {
                n.resolve(e.data.orderConfirmation)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        applyCoupon: function(e, n) {
            var t = o.defer();
            return a.put("/rest/basket/" + e + "/coupon/" + n).then(function(e) {
                t.resolve(e.data.discount)
            }).catch(function(e) {
                t.reject(e.data)
            }), t.promise
        }
    }
}]), angular.module("juiceShop").factory("CaptchaService", ["$http", "$q", function(e, t) {
    "use strict";
    return {
        getCaptcha: function() {
            var n = t.defer();
            return e.get("/rest/captcha/").then(function(e) {
                n.resolve(e.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("ChallengeService", ["$http", "$q", function(t, a) {
    "use strict";
    return {
        find: function(e) {
            var n = a.defer();
            return t.get("/api/Challenges/", {
                params: e
            }).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        repeatNotification: function(e) {
            return t.get("/rest/repeat-notification", {
                params: {
                    challenge: e
                }
            })
        },
        continueCode: function() {
            var n = a.defer();
            return t.get("/rest/continue-code").then(function(e) {
                n.resolve(e.data.continueCode)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        restoreProgress: function(e) {
            var n = a.defer();
            return t.put("/rest/continue-code/apply/" + e).then(function(e) {
                n.resolve(e.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("ComplaintService", ["$http", "$q", function(t, a) {
    "use strict";
    return {
        save: function(e) {
            var n = a.defer();
            return t.post("/api/Complaints/", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("ConfigurationService", ["$http", "$q", function(e, t) {
    "use strict";
    return {
        getApplicationConfiguration: function() {
            var n = t.defer();
            return e.get("/rest/admin/application-configuration").then(function(e) {
                n.resolve(e.data.config)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("CountryMappingService", ["$http", "$q", function(e, t) {
    "use strict";
    return {
        getCountryMapping: function() {
            var n = t.defer();
            return e.get("/rest/country-mapping").then(function(e) {
                n.resolve(e.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("FeedbackService", ["$http", "$q", function(t, a) {
    "use strict";
    var o = "/api/Feedbacks";
    return {
        find: function(e) {
            var n = a.defer();
            return t.get(o + "/", {
                params: e
            }).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        save: function(e) {
            var n = a.defer();
            return t.post(o + "/", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        del: function(e) {
            var n = a.defer();
            return t.delete(o + "/" + e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("ProductReviewService", ["$http", "$q", function(a, o) {
    "use strict";
    var r = "/rest/product";
    return {
        get: function(e) {
            var n = o.defer();
            return a.get(r + "/" + e + "/reviews").then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        create: function(e, n) {
            var t = o.defer();
            return a.put(r + "/" + e + "/reviews", n).then(function(e) {
                t.resolve(e.data.data)
            }).catch(function(e) {
                t.reject(e.data)
            }), t.promise
        },
        patch: function(e) {
            var n = o.defer();
            return a.patch(r + "/reviews", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("ProductService", ["$http", "$q", function(t, a) {
    "use strict";
    var o = "/api/Products";
    return {
        find: function(e) {
            var n = a.defer();
            return t.get(o + "/", {
                params: e
            }).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        get: function(e) {
            var n = a.defer();
            return t.get(o + "/" + e + "?d=" + encodeURIComponent((new Date).toDateString())).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        search: function(e) {
            var n = a.defer();
            return t.get("/rest/product/search?q=" + e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("RecycleService", ["$http", "$q", function(t, a) {
    "use strict";
    var o = "/api/Recycles";
    return {
        find: function(e) {
            var n = a.defer();
            return t.get(o + "/", {
                params: e
            }).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        save: function(e) {
            var n = a.defer();
            return t.post(o + "/", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("SecurityAnswerService", ["$http", "$q", function(t, a) {
    "use strict";
    return {
        save: function(e) {
            var n = a.defer();
            return t.post("/api/SecurityAnswers/", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("SecurityQuestionService", ["$http", "$q", function(t, a) {
    "use strict";
    return {
        find: function(e) {
            var n = a.defer();
            return t.get("/api/SecurityQuestions/", {
                params: e
            }).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        findBy: function(e) {
            var n = a.defer();
            return t.get("rest/user/security-question?email=" + e).then(function(e) {
                n.resolve(e.data.question)
            }).catch(function(e) {
                n.reject(e)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("TrackOrderService", ["$http", "$q", function(t, a) {
    "use strict";
    return {
        track: function(e) {
            var n = a.defer();
            return e = encodeURIComponent(e), t.get("/rest/track-order/" + e).then(function(e) {
                n.resolve(e.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").factory("UserService", ["$http", "$q", function(t, a) {
    "use strict";
    var o = "/api/Users";
    return {
        find: function(e) {
            var n = a.defer();
            return t.get("/rest/user/authentication-details/", {
                params: e
            }).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        get: function(e) {
            var n = a.defer();
            return t.get(o + "/" + e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        save: function(e) {
            var n = a.defer();
            return t.post(o + "/", e).then(function(e) {
                n.resolve(e.data.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        login: function(e) {
            var n = a.defer();
            return t.post("/rest/user/login", e).then(function(e) {
                n.resolve(e.data.authentication)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        changePassword: function(e) {
            var n = a.defer();
            return t.get("/rest/user/change-password?current=" + e.current + "&new=" + e.new + "&repeat=" + e.repeat).then(function(e) {
                n.resolve(e.data.user)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        resetPassword: function(e) {
            var n = a.defer();
            return t.post("/rest/user/reset-password", e).then(function(e) {
                n.resolve(e.data.user)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        whoAmI: function() {
            var n = a.defer();
            return t.get("/rest/user/whoami").then(function(e) {
                n.resolve(e.data.user)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        },
        oauthLogin: function(e) {
            var n = a.defer();
            return t.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + e).then(function(e) {
                console.log("done: " + e.data), n.resolve(e.data)
            }).catch(function(e) {
                n.reject(e.data)
            }), n.promise
        }
    }
}]), angular.module("juiceShop").run(["$templateCache", function(e) {
    "use strict";
    e.put("views/About.html", '<div class="row">\n\n    <section class="col-lg-5 col-lg-offset-2 col-sm-10 col-sm-offset-1">\n        <h3 class="page-header page-header-sm"><span translate="TITLE_ABOUT"></span> <small translate="SECTION_CORPORATE_HISTORY"></small></h3>\n        <p class="text-justify">\n            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\n            Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.\n\n            Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.\n\n            <a href="/ftp/legal.md?md_debug=true" translate="LINK_TERMS_OF_USE"></a>\n\n            Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.\n\n            Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.\n\n            At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur.\n        </p>\n    </section>\n\n    <div class="col-lg-3 col-lg-offset-0 col-sm-10 col-sm-offset-1">\n        <section class="row">\n            <h3 class="page-header page-header-sm"><small translate="SECTION_CUSTOMER_FEEDBACK"></small></h3>\n\n            <div ng-controller="FeedbackController" style="height: 305px">\n\n                <div uib-carousel active="active" interval="interval" no-wrap="noWrapSlides">\n                 <div uib-slide ng-repeat="feedback in feedbacks track by feedback.id" index="$index">\n                   <img ng-src="{{feedback.image}}" style="margin:auto;">\n                   <div class="carousel-caption">\n                       <span uib-rating max="5" ng-model="feedback.rating" read-only="true"></span>\n                       <p><div ng-bind-html="feedback.comment"></div></p>\n                   </div>\n                 </div>\n               </div>\n            </div>\n        </section>\n\n        <section class="row" ng-show="twitterUrl || facebookUrl">\n            <h3 class="page-header page-header-sm"><small translate="SECTION_SOCIAL_MEDIA"></small></h3>\n            <div class="container-fluid">\n                <div class="row">\n                    <a id="followOnTwitter" class="btn btn-info" ng-show="twitterUrl" ng-href="{{twitterUrl}}" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter fa-lg"></i></a>\n                    <a id="followOnFacebook" class="btn btn-info" ng-show="facebookUrl" ng-href="{{facebookUrl}}" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook fa-lg"></i></a>\n                </div>\n            </div>\n        </section>\n    </div>\n\n</div>\n'), e.put("views/Administration.html", '<div class="row">\n    <div class="col-md-4 col-md-offset-2 col-sm-10 col-sm-offset-1">\n        <section class="row">\n            <h3 class="page-header page-header-sm"><span translate="TITLE_ADMINISTRATION"></span> <small translate="SECTION_USER"></small></h3>\n\n            <table class="table table-striped table-bordered table-condensed" ng-controller="UserController">\n                <tr>\n                    <th></th>\n                    <th translate="LABEL_EMAIL"></th>\n                    <th></th>\n                </tr>\n                <tr data-ng-repeat="user in users">\n                    <td><i ng-show="user.token" class="fas fa-user fa-lg"></i></td>\n                    <td><div ng-bind-html="user.email"></div></td>\n                    <td>\n                        <div class="btn-group">\n                            <a class="btn btn-default btn-xs" ng-click="showDetail(user.id)"><i class="fas fa-eye"></i></a>\n                        </div>\n                    </td>\n                </tr>\n            </table>\n        </section>\n        <section class="row">\n            <h3 class="page-header page-header-sm"><small translate="SECTION_RECYCLING"></small></h3>\n\n            <table class="table table-striped table-bordered table-condensed" ng-controller="RecycleController">\n                <tr>\n                    <th translate="LABEL_USER"></th>\n                    <th translate="LABEL_RECYCLE_QUANTITY"></th>\n                    <th translate="LABEL_ADDRESS"></th>\n                    <th></th>\n                    <th translate="LABEL_PICKUP_DATE"></th>\n                </tr>\n                <tr data-ng-repeat="recycle in recycles">\n                    <td>{{recycle.UserId}}</td>\n                    <td>{{recycle.quantity}}</td>\n                    <td>{{recycle.address}}</td>\n                    <td>\n                        <i ng-show="recycle.isPickup" class="fas fa-home fa-lg"></i>\n                        <i ng-show="!recycle.isPickup" class="fas fa-archive fa-lg"></i>\n                    </td>\n                    <td>{{recycle.date}}</td>\n                </tr>\n            </table>\n        </section>\n    </div>\n    \n    <section class="col-md-4 col-md-offset-0 col-sm-10 col-sm-offset-1">\n        <h3 class="page-header page-header-sm"><small translate="SECTION_CUSTOMER_FEEDBACK"></small></h3>\n\n        <table class="table table-striped table-bordered table-condensed" ng-controller="FeedbackController">\n            <tr>\n                <th translate="LABEL_USER"></th>\n                <th translate="LABEL_COMMENT"></th>\n                <th translate="LABEL_RATING"></th>\n                <th></th>\n            </tr>\n            <tr data-ng-repeat="feedback in feedbacks">\n                <td>{{feedback.UserId}}</td>\n                <td><div ng-bind-html="feedback.comment"></div></td>\n                <td>\n                    <span uib-rating max="5" ng-model="feedback.rating" read-only="true" class="nowrap"></span>\n                </td>\n                <td>\n                    <div class="btn-group">\n                        <a class="btn btn-danger btn-xs" ng-click="delete(feedback.id)"><i class="fas fa-trash-alt"></i></a>\n                    </div>\n                </td>\n            </tr>\n        </table>\n        <img src="/public/images/tracking/administration.png"/>\n    </section>\n</div>\n'), e.put("views/Basket.html", '<div class="row">\n    <section class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">\n        <h3 class="page-header page-header-sm">\n            <span translate="TITLE_BASKET"></span>&nbsp;\n            ({{userEmail}})\n        </h3>\n        <table class="table table-striped table-bordered table-condensed">\n            <tr>\n                <th translate="LABEL_PRODUCT"></th>\n                <th translate="LABEL_DESCRIPTION"></th>\n                <th translate="LABEL_PRICE"></th>\n                <th translate="LABEL_QUANTITY"></th>\n                <th translate="LABEL_TOTAL_PRICE"></th>\n                <th></th>\n            </tr>\n            <tr data-ng-repeat="product in products">\n                <td>{{product.name}}</td>\n                <td>{{product.description}}</td>\n                <td>{{product.price}}</td>\n                <td>\n                    <div class="btn-group">\n                        <a class="btn btn-default btn-xs" ng-click="dec(product.BasketItem.id)"><i class="fas fa-minus-square"></i></a>\n                        <span class="btn btn-default btn-xs">{{product.BasketItem.quantity}}</span>\n                        <a class="btn btn-default btn-xs" ng-click="inc(product.BasketItem.id)"><i class="fas fa-plus-square"></i></a>\n                    </div>\n                </td>\n                <td>{{(product.price*product.BasketItem.quantity).toFixed(2)}}</td>\n                <td>\n                    <div class="btn-group">\n                        <a class="btn btn-default btn-xs" ng-click="delete(product.BasketItem.id)"><i class="far fa-trash-alt"></i></a>\n                    </div>\n                </td>\n            </tr>\n        </table>\n\n        <div class="container-fluid well">\n            <div class="row">\n                <button type="submit" id="checkoutButton" class="btn btn-success" ng-disabled="products.length < 1" ng-click="checkout()"><i class="fas fa-cart-arrow-down"></i> <span translate="BTN_CHECKOUT"></span></button>\n                <a id="collapseCouponButton" class="btn btn-warning" ng-model="couponPanelExpanded" ng-click="toggleCoupon()" uib-btn-checkbox><i class="fas fa-gift fa-lg"></i></a>\n                <a id="collapsePaymentButton" class="btn btn-danger" ng-model="paymentPanelExpanded" ng-click="togglePayment()" uib-btn-checkbox><i class="fas fa-credit-card fa-lg"></i></a>\n            </div>\n        </div>\n\n        <section uib-collapse="!couponPanelExpanded">\n            <div class="alert-info" ng-show="confirmation && !form.$dirty">\n                <p>{{confirmation}}</p>\n            </div>\n            <div class="alert-danger" ng-show="error && !form.$dirty">\n                <p>{{error}}</p>\n            </div>\n            <div class="alert-danger" ng-show="form.$invalid && form.$dirty">\n                <p ng-show="(form.coupon.$error.minlength || form.coupon.$error.maxlength) && form.coupon.$dirty" translate="INVALID_COUPON_LENGTH" translate-value-length="10"></p>\n            </div>\n\n            <div class="container-fluid well">\n                <form role="form" name="form" novalidate>\n                    <div class="row">\n                        <div class="form-group">\n                            <label for="coupon" translate="LABEL_COUPON"></label> <span ng-show="twitterUrl || facebookUrl"><small>(</small><small translate="FOLLOW_FOR_MONTHLY_COUPONS" translate-value-twitter=\'<a href="{{twitterUrl}}" target="_blank">Twitter</a>\' translate-value-facebook=\'<a href="{{facebookUrl}}" target="_blank">Facebook</a>\'></small><small>)</small></span>\n                            <input type="text" class="form-control input-sm" id="coupon" name="coupon" ng-model="coupon" required ng-maxlength="10" ng-minlength="10"/>\n                        </div>\n\n                        <div class="form-group">\n                            <button type="submit" id="applyCouponButton" class="btn btn-warning" ng-disabled="form.$invalid" ng-click="applyCoupon()"><i class="far fa-gem fa-lg"></i> <span translate="BTN_REDEEM"></span></button>\n                        </div>\n                    </div>\n                </form>\n            </div>\n        </section>\n\n        <section uib-collapse="!paymentPanelExpanded">\n            <div class="container-fluid well">\n                <div class="row">\n                    <label translate="LABEL_PAYMENT"></label>\n                    <small>(<span translate="THANKS_FOR_SUPPORT" translate-value-juiceshop="OWASP Juice Shop" ng-show="applicationName === \'OWASP Juice Shop\'"></span><span translate="THANKS_FOR_SUPPORT_CUSTOMIZED" translate-value-appname="{{applicationName}}" ng-show="applicationName !== \'OWASP Juice Shop\'"></span> <i class="fas fa-heart"></i>)</small>\n                </div>\n                <div class="row">\n                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" style="display: inline-block;">\n                        <div class="paypal_donation_button">\n                            <input type="hidden" name="cmd" value="_donations">\n                            <input type="hidden" name="business" value="paypal@owasp.org">\n                            <input type="hidden" name="lc" value="BM">\n                            <input type="hidden" name="item_name" value="OWASP Juice Shop Project">\n                            <input type="hidden" name="item_number" value="OWASP Foundation">\n                            <input type="hidden" name="no_note" value="0">\n                            <input type="hidden" name="currency_code" value="EUR">\n                            <input type="hidden" name="bn" value="PP-DonationsBF:btn_donate_LG.gif:NonHostedGuest">\n                            <button type="submit" name="submit" class="btn btn-danger"><i class="fab fa-paypal fa-lg"></i> PayPal</button>\n                            <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" style="display: none !important;">\n                        </div>\n                    </form>\n                    <a href="https://bkimminich.gitbooks.io/pwning-owasp-juice-shop/content/part3/donations.html#credit-card-donation-step-by-step" target="_blank" class="btn btn-danger">\n                        <i class="far fa-credit-card fa-lg"></i> <span translate="BTN_CREDIT_CARD"></span>\n                    </a>\n                    \x3c!--<a href="/redirect?to=https://gratipay.com/juice-shop" target="_blank" class="btn btn-danger">\n                        <i class="fab fa-gratipay fa-lg"></i> Gratipay\n                    </a>--\x3e\n                    <a ng-click="showBitcoinQrCode()" class="btn btn-danger">\n                        <i class="fab fa-btc fa-lg"></i> Bitcoin\n                    </a>\n                    <a ng-click="showDashQrCode()" class="btn btn-danger">\n                        <i class="fa-lg">Ð</i> Dash\n                    </a>\n                    <a ng-click="showEtherQrCode()" class="btn btn-danger">\n                        <i class="fab fa-ethereum fa-lg"></i> Ether\n                    </a>\n                </div>\n            </div>\n            <div class="container-fluid well">\n                <div class="row">\n                    <label translate="LABEL_MERCHANDISE"></label>\n                    <small>(<span translate="OFFICIAL_MERCHANDISE_STORES" translate-value-juiceshop="OWASP Juice Shop" ng-show="applicationName === \'OWASP Juice Shop\'"></span><span translate="OFFICIAL_MERCHANDISE_STORES_CUSTOMIZED" translate-value-appname="{{applicationName}}" ng-show="applicationName !== \'OWASP Juice Shop\'"></span> <i class="fas fa-thumbs-up"></i>)\n                    </small>\n                </div>\n                <div class="row">\n                    <a href="/redirect?to=http://shop.spreadshirt.com/juiceshop" target="_blank" class="btn btn-danger">\n                        <i class="fas fa-shopping-bag fa-lg"></i> Spreadshirt.com\n                    </a>\n                    <a href="/redirect?to=http://shop.spreadshirt.de/juiceshop" target="_blank" class="btn btn-danger">\n                        <i class="fas fa-shopping-bag fa-lg"></i> Spreadshirt.de\n                    </a>\n                    <a href="/redirect?to=https://www.stickeryou.com/products/owasp-juice-shop/794" target="_blank" class="btn btn-danger">\n                        <i class="fas fa-sticky-note fa-lg"></i> StickerYou.com\n                    </a>\n                </div>\n            </div>\n        </section>\n\n    </section>\n</div>\n'), e.put("views/ChangePassword.html", '<div class="row">\n    <section class="col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-2">\n        <h3 class="page-header page-header-sm" translate="TITLE_CHANGE_PASSWORD"></h3>\n\n        <div>\n\n            <form role="form" name="form" novalidate>\n\n                <div class="alert-info" ng-show="confirmation && !form.$dirty">\n                    <p>{{confirmation}}</p>\n                </div>\n                <div class="alert-danger" ng-show="error && !form.$dirty">\n                    <p>{{error}}</p>\n                </div>\n                <div class="alert-danger" ng-show="form.$invalid && form.$dirty">\n                    <p ng-show="form.currentPassword.$error.required && form.currentPassword.$dirty" translate="MANDATORY_CURRENT_PASSWORD"></p>\n                    <p ng-show="form.newPassword.$error.required && form.newPassword.$dirty" translate="MANDATORY_NEW_PASSWORD"></p>\n                    <p ng-show="(form.newPassword.$error.minlength || form.newPassword.$error.maxlength) && form.newPassword.$dirty" translate="INVALID_PASSWORD_LENGTH" translate-value-length="5-20"></p>\n                    <p ng-show="form.newPasswordRepeat.$error.required && form.newPasswordRepeat.$dirty" translate="MANDATORY_PASSWORD_REPEAT"></p>\n                </div>\n\n                <div class="container-fluid well">\n\n                        <div class="row">\n                            <div class="form-group">\n                                <label for="currentPassword" translate="LABEL_CURRENT_PASSWORD"></label>\n                                <input type="password" class="form-control input-sm" id="currentPassword" name="currentPassword" ng-model="currentPassword" required/>\n                            </div>\n                        </div>\n                        <div class="row">\n                            <div class="form-group">\n                                <label for="newPassword" translate="LABEL_NEW_PASSWORD"></label>\n                                <input type="password" class="form-control input-sm" id="newPassword" name="newPassword" ng-model="newPassword" required ng-minlength="5" ng-maxlength="20"/>\n                            </div>\n                        </div>\n                        <div class="row">\n                            <div class="form-group">\n                                <label for="newPasswordRepeat" translate="LABEL_REPEAT_NEW_PASSWORD"></label>\n                                <input type="password" class="form-control input-sm" id="newPasswordRepeat" name="newPasswordRepeat" ng-model="newPasswordRepeat" required/>\n                            </div>\n                        </div>\n                        <div class="row">\n                                <div class="form-group">\n                                    <button type="submit" id="changeButton" class="btn btn-primary" ng-disabled="form.$invalid" ng-click="changePassword()"><i class="fas fa-save fa-lg"></i> <span translate="BTN_CHANGE"></span></button>\n                                </div>\n                        </div>\n                </div>\n\n            </form>\n        </div>\n\n    </section>\n</div>'), e.put("views/Complaint.html", '<div class="row">\n    <section class="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">\n        <h3 class="page-header page-header-sm" translate="TITLE_COMPLAIN"></h3>\n\n        <div>\n\n            <form role="form" name="form" novalidate>\n                <div class="alert-info" ng-show="confirmation && !form.$dirty">\n                    <p>{{confirmation}}</p>\n                </div>\n                <div class="alert-danger" ng-show="form.$invalid && form.$dirty">\n                    <p ng-show="form.complaintMessage.$error.required && form.complaintMessage.$dirty" translate="MANDATORY_MESSAGE"></p>\n                    <p ng-show="form.complaintMessage.$error.maxlength && form.complaintMessage.$dirty" translate="INVALID_MESSAGE_LENGTH" translate-value-length="1-160"></p>\n                    <p ng-show="form.file.$error.maxSize" translate="INVALID_FILE_SIZE" translate-value-size="100 KB"></p>\n                    <p ng-show="form.file.$error.pattern" translate="INVALID_FILE_TYPE" translate-value-type="PDF"></p>\n                </div>\n\n                <div class="container-fluid well">\n\n                        <div class="row">\n                            <div class="form-group">\n                                <label translate="LABEL_CUSTOMER"></label>\n                                <label class="form-control input-sm">{{userEmail}}</label>\n                            </div>\n                        </div>\n                        <div class="row">\n                            <div class="form-group">\n                                <label for="complaintMessage" translate="LABEL_MESSAGE"></label>\n                                <textarea class="form-control input-sm" id="complaintMessage" name="complaintMessage" ng-model="complaint.message" required ng-maxlength="160"></textarea>\n                            </div>\n                        </div>\n                        <div class="row">\n                            <div class="form-group">\n                                <label for="file" translate="LABEL_INVOICE"></label>\n                                <input type="file" ngf-select ng-model="file" id="file" name="file" ngf-pattern="\'.pdf,.xml\'" ngf-accept="\'.pdf\'" ngf-max-size="100KB"/>\n                            </div>\n                        </div>\n                        <div class="row">\n                            <div class="form-group">\n                                <button type="submit" id="submitButton" class="btn btn-primary" ng-disabled="form.$invalid" ng-click="save()"><i class="fas fa-bomb fa-lg"></i> <span translate="BTN_SUBMIT"></span></button> {{progress}}\n                            </div>\n                        </div>\n                        \x3c!--<aside class="row">\n                            <a uib-tooltip="{{\'ATTACH_ORDER_CONFIRMATION_XML\' | translate}}"><span translate="B2B_CUSTOMER_QUESTION"></span></a>\n                        </aside>--\x3e\n                </div>\n             </form>\n\n        </div>\n\n    </section>\n</div>'), e.put("views/Contact.html", '<div class="row">\n    <section class="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">\n        <h3 class="page-header page-header-sm" translate="TITLE_CONTACT"></h3>\n\n        <div>\n\n            <form role="form" name="form" novalidate>\n                <input type="text" id="userId" ng-model="feedback.UserId" ng-hide="true"/>\n                <div class="alert-info" ng-show="confirmation && !form.$dirty">\n                    <p>{{confirmation}}</p>\n                </div>\n                <div class="alert-danger" ng-show="error && !form.$dirty">\n                    <p>{{error}}</p>\n                </div>\n                <div class="alert-danger" ng-show="form.$invalid && form.$dirty">\n                    <p ng-show="form.feedbackComment.$error.required && form.feedbackComment.$dirty" translate="MANDATORY_COMMENT"></p>\n                    <p ng-show="form.feedbackComment.$error.maxlength && form.feedbackComment.$dirty" translate="INVALID_COMMENT_LENGTH" translate-value-length="1-160"></p>\n                    <p ng-show="form.feedbackRating.$error.required && form.feedbackRating.$dirty" translate="MANDATORY_RATING"></p>\n                    <p ng-show="form.feedbackCaptcha.$error.required && form.feedbackCaptcha.$dirty" translate="MANDATORY_CAPTCHA"></p>\n                </div>\n\n                <div class="container-fluid well">\n\n                        <div class="row">\n                            <div class="form-group">\n                                <label translate="LABEL_AUTHOR"></label>\n                                <label class="form-control input-sm">{{userEmail}}</label>\n                            </div>\n                        </div>\n                        <div class="row">\n                            <div class="form-group">\n                                <label for="feedbackComment" translate="LABEL_COMMENT"></label>\n                                <textarea class="form-control input-sm" id="feedbackComment" name="feedbackComment" ng-model="feedback.comment" required ng-maxlength="160"></textarea>\n                            </div>\n                        </div>\n                        <div class="row">\n                            <div class="form-group">\n                                <label translate="LABEL_RATING"></label>\n                                <span uib-rating max="5" name="feedbackRating" ng-model="feedback.rating" required></span>\n                            </div>\n                        </div>\n                        <div class="row">\n                            <div class="form-group">\n                                <label translate="LABEL_CAPTCHA"></label>&nbsp;\n                                <code id="captcha">{{captcha}}</code>&nbsp;<label>?</label>\n                                <input class="form-control input-sm" name="feedbackCaptcha" ng-model="feedback.captcha" required/>\n                            </div>\n                        </div>\n                        <div class="row">\n                                <div class="form-group">\n                                    <button type="submit" id="submitButton" class="btn btn-primary" ng-disabled="form.$invalid" ng-click="save()"><i class="fas fa-paper-plane fa-lg"></i> <span translate="BTN_SUBMIT"></span></button>\n                                </div>\n                        </div>\n                </div>\n             </form>\n\n        </div>\n\n    </section>\n</div>'), e.put("views/ForgotPassword.html", '<div class="row">\n    <section class="col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-2">\n        <h3 class="page-header page-header-sm" translate="TITLE_FORGOT_PASSWORD"></h3>\n\n        <div>\n\n            <form role="form" name="form" novalidate>\n\n                <div class="alert-info" ng-show="confirmation && !form.$dirty">\n                    <p>{{confirmation}}</p>\n                </div>\n                <div class="alert-danger" ng-show="error && !form.$dirty">\n                    <p>{{error}}</p>\n                </div>\n                <div class="alert-danger" ng-show="form.$invalid && form.$dirty">\n                    <p ng-show="form.email.$error.required && form.email.$dirty" translate="MANDATORY_EMAIL"></p>\n                    <p ng-show="form.email.$error.email && form.email.$dirty" translate="INVALID_EMAIL"></p>\n                    <p ng-show="form.securityAnswer.$error.required && form.securityAnswer.$dirty" translate="MANDATORY_SECURITY_ANSWER"></p>\n                    <p ng-show="form.newPassword.$error.required && form.newPassword.$dirty" translate="MANDATORY_NEW_PASSWORD"></p>\n                    <p ng-show="form.newPassword.$error.minlength && form.newPassword.$dirty" translate="INVALID_PASSWORD_LENGTH" translate-value-length="5-20"></p>\n                    <p ng-show="form.newPasswordRepeat.$error.required && form.newPasswordRepeat.$dirty" translate="MANDATORY_PASSWORD_REPEAT"></p>\n                </div>\n\n                <div class="container-fluid well">\n                    <div class="row">\n                        <div class="form-group">\n                            <label for="email" translate="LABEL_EMAIL"></label>\n                            <input type="email" class="form-control input-sm" id="email" name="email" ng-model="email" ng-change="findSecurityQuestion()" required/>\n                        </div>\n                    </div>\n                    <div class="row" ng-show="securityQuestion">\n                        <div class="form-group">\n                            <label for="securityAnswer">{{securityQuestion}}</label>\n                            <input type="password" class="form-control input-sm" id="securityAnswer" name="securityAnswer" ng-model="securityAnswer" required/>\n                        </div>\n                    </div>\n                    <div class="row" ng-show="securityQuestion">\n                        <div class="form-group">\n                            <label for="newPassword" translate="LABEL_NEW_PASSWORD"></label>\n                            <input type="password" class="form-control input-sm" id="newPassword" name="newPassword" ng-model="newPassword" required ng-minlength="5"/>\n                        </div>\n                    </div>\n                    <div class="row" ng-show="securityQuestion">\n                        <div class="form-group">\n                            <label for="newPasswordRepeat" translate="LABEL_REPEAT_NEW_PASSWORD"></label>\n                            <input type="password" class="form-control input-sm" id="newPasswordRepeat" name="newPasswordRepeat" ng-model="newPasswordRepeat" required/>\n                        </div>\n                    </div>\n                    <div class="row">\n                        <div class="form-group">\n                            <button type="submit" id="resetButton" class="btn btn-primary" ng-disabled="form.$invalid" ng-click="resetPassword()"><i class="fas fa-save fa-lg"></i> <span translate="BTN_CHANGE"></span></button>\n                        </div>\n                    </div>\n                </div>\n\n            </form>\n        </div>\n\n    </section>\n</div>'), e.put("views/Login.html", '<div class="row">\n    <section class="col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-2">\n        <h3 class="page-header page-header-sm" translate="TITLE_LOGIN"></h3>\n\n        <form role="form" name="form" novalidate>\n\n            <div class="alert-danger" ng-show="error && !form.$dirty">\n                <p>{{error}}</p>\n            </div>\n            <div class="alert-danger" ng-show="form.$invalid && form.$dirty">\n                <p ng-show="form.userEmail.$error.required && form.userEmail.$dirty" translate="MANDATORY_EMAIL"></p>\n                <p ng-show="form.userPassword.$error.required && form.userPassword.$dirty" translate="MANDATORY_PASSWORD"></p>\n            </div>\n\n            <div class="container-fluid well">\n\n                <div class="row">\n                    <div class="form-group">\n                        <label for="userEmail" translate="LABEL_EMAIL"></label>\n                        <input type="text" class="form-control input-sm" id="userEmail" name="userEmail" ng-model="user.email" required/>\n                    </div>\n                </div>\n                <div class="row">\n                    <div class="form-group"> \x3c!-- @echipa de suport: Secretul nostru comun este încă Caoimhe cu parola de master gol! --\x3e\n                        <label for="userPassword" translate="LABEL_PASSWORD"></label>\n                        <input type="password" class="form-control input-sm" id="userPassword" name="userPassword" ng-model="user.password" required/>\n                    </div>\n                </div>\n                <div class="row">\n                    <div class="form-group">\n                        <button type="submit" id="loginButton" class="btn btn-primary" ng-disabled="form.$invalid" ng-click="login()"><i class="fas fa-key fa-lg"></i> <span translate="BTN_LOGIN"></span></button>\n                        <button id="googleLoginButton" class="btn btn-default" ng-hide="oauthUnavailable" ng-click="googleLogin()"><i class="fab fa-google fa-lg"></i> <span translate="BTN_GOOGLE_LOGIN"></span></button>\n                        <div class="checkbox">\n                            <label>\n                                <input type="checkbox" id="rememberMe" name="rememberMe" ng-model="rememberMe"/> <span translate="REMEMBER_ME"></span>\n                            </label>\n                        </div>\n                    </div>\n                </div>\n                <aside class="row">\n                    <a href="#/forgot-password" translate="FORGOT_PASSWORD"></a> <a href="#/register" translate="NO_CUSTOMER"></a>\n                </aside>\n            </div>\n\n        </form>\n\n    </section>\n</div>'), e.put("views/Logout.html", '<div class="row">\n    <section class="col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-2">\n        <h3 class="page-header page-header-sm" translate="TITLE_LOGOUT"></h3>\n        <div class="alert alert-info" translate="CONFIRM_LOGGED_OUT"></div>\n        <span translate="HOME_LINK_MESSAGE" translate-value-home=\'<a href="/"><i class="fas fa-home"></i></a>\'></span>\n    </section>\n</div>'), e.put("views/OAuth.html", '<div class="row">\n    <section class="col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-2">\n        <h3 class="page-header page-header-sm" translate="TITLE_LOGIN"></h3>\n        <div class="alert alert-info" translate="CONFIRM_LOGGED_IN_VIA_OAUTH2"></div>\n        <span translate="HOME_LINK_MESSAGE" translate-value-home=\'<a href="/"><i class="fas fa-home"></i></a>\'></span>\n    </section>\n</div>'), e.put("views/ProductDetail.html", '<section>\n    <header class="modal-header">\n        <h3 class="modal-title"><span translate="LABEL_PRODUCT"></span> #{{product.id}}</h3>\n    </header>\n    <div class="modal-body">\n        <div class="container-fluid">\n            <div class="row">\n                <div class="col-md-6">\n                    <strong translate="LABEL_NAME"></strong>\n\n                    <p>{{product.name}}</p>\n                </div>\n                <div class="col-md-6">\n                    <strong translate="LABEL_DESCRIPTION"></strong>\n\n                    <p><div ng-bind-html="product.description"></div></p>\n                </div>\n            </div>\n            <div class="row">\n                <div class="col-md-6">\n                    <strong translate="LABEL_PRICE"></strong>\n\n                    <p>{{product.price}}</p>\n                </div>\n                <div class="col-md-6">\n                    <strong translate="LABEL_IMAGE"></strong>\n\n                    <p><img ng-src="/public/images/products/{{product.image}}" class="img-responsive img-thumbnail"/></p>\n                </div>\n            </div>\n            <aside class="row" ng-hide="reviewsDisabled">\n                <div class="col-md-12">\n                    <strong translate="LABEL_REVIEWS"></strong>\n                    <p ng-show="productReviews.length === 0" translate="LABEL_NO_REVIEWS"></p>\n                    <blockquote data-ng-repeat="review in productReviews">\n                        <p>{{ review.message }}</p>\n\n                        <button ng-show="review.author !== \'Anonymous\' && review.author === author" ng-click="editReview(review)" type="button" name="edit" class="btn btn-default"><i class="fas fa-edit"></i> Edit</button>\n\n                        <footer class="capitalize">{{ review.author | emailName }}</footer>\n                    </blockquote>\n                </div>\n                <div class="col-md-12">\n                    <form role="form" name="form" novalidate>\n                        <div class="form-group">\n                            <label for="product_review" translate="LABEL_ADD_REVIEW_FOR_PRODUCT"></label>\n                            <textarea class="form-control input-sm" id="product_review" ng-model="message" name="product_review" required ng-minlength="1" ng-maxlength="160"></textarea>\n                        </div>\n                        <div class="form-group">\n                            <button type="submit" ng-click="addReview()" id="submitButton" class="btn btn-primary" ng-disabled="form.$invalid"><i class="fas fa-paper-plane fa-lg"></i> <span translate="BTN_SUBMIT"></span></button>\n                        </div>\n                    </form>\n                </div>\n            </aside>\n        </div>\n    </div>\n    <footer class="modal-footer">\n        <button class="btn btn-default" ng-click="$close()"><i class="fas fa-arrow-circle-left fa-lg"></i> <span translate="BTN_CLOSE"></span></button>\n    </footer>\n</section>'), e.put("views/ProductReviewEdit.html", '<section>\n    <header class="modal-header">\n        <h3 class="modal-title" translate="LABEL_EDIT_REVIEW"></h3>\n    </header>\n    <div class="modal-body">\n        <div class="container-fluid">\n            <div class="row">\n                <div class="col-md-12">\n                    <form role="form" name="form" novalidate>\n                        <div class="form-group">\n                            <label for="product_review" translate="LABEL_REVIEW"></label>\n                            <textarea class="form-control input-sm"\n                                      id="product_review"\n                                      ng-model="message"\n                                      name="product_review"\n                                      required\n                                      ng-minlength="1"\n                                      ng-maxlength="160"></textarea>\n                        </div>\n                        <div class="form-group">\n                            <button type="submit" ng-click="editReview()" id="submitButton" class="btn btn-primary"\n                                    ng-disabled="form.$invalid">\n                                <i class="fas fa-paper-plane fa-lg"></i>\n                                <span translate="BTN_SUBMIT"></span>\n                            </button>\n                        </div>\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>\n    <footer class="modal-footer">\n        <button class="btn btn-default" ng-click="$close()">\n            <i class="fas fa-arrow-circle-left fa-lg"></i>\n            <span translate="BTN_CLOSE"></span>\n        </button>\n    </footer>\n</section>'), e.put("views/QrCode.html", '<section>\n    <header class="modal-header">\n        <h3 class="modal-title"><span translate="{{title}}"></span></h3>\n    </header>\n    <div class="modal-body">\n        <div class="container-fluid">\n            <div class="row">\n                <div class="col-md-3">\n                    <qrcode data="{{data}}" ng-href="{{url}}" size="300"></qrcode>\n                </div>\n            </div>\n            <div class="row">\n                <div class="col-md-3">\n                    <small>{{address}}</small>\n                </div>\n            </div>\n        </div>\n    </div>\n    <footer class="modal-footer">\n        <button class="btn btn-default" ng-click="$close()"><i class="fas fa-arrow-circle-left fa-lg"></i> <span translate="BTN_CLOSE"></span></button>\n    </footer>\n</section>'), e.put("views/Recycle.html", '<section class="row">\n\n    <div class="col-lg-5 col-lg-offset-2 col-sm-10 col-sm-offset-1">\n        <h3 class="page-header page-header-sm" translate="TITLE_RECYCLE"></h3>\n\n        <div>\n\n            <form role="form" name="form" novalidate>\n                <div class="alert-info" ng-show="confirmation && !form.$dirty">\n                    <p>{{confirmation}}</p>\n                </div>\n                <div class="alert-danger" ng-show="form.$invalid && form.$dirty">\n                    <p ng-show="form.recycleAddress.$error.required && form.recycleAddress.$dirty" translate="MANDATORY_ADDRESS"></p>\n                    <p ng-show="(form.recycleAddress.$error.minlength || form.recycleAddress.$error.maxlength) && form.recycleAddress.$dirty" translate="INVALID_ADDRESS_LENGTH" translate-value-length="20-180"></p>\n                    <p ng-show="form.recycleQuantity.$error.required && form.recycleQuantity.$dirty" translate="MANDATORY_QUANTITY"></p>\n                    <p ng-show="(form.recycleQuantity.$error.min || form.recycleQuantity.$error.max) && form.recycleQuantity.$dirty" translate="INVALID_QUANTITY" translate-value-range="10-1000"></p>\n                </div>\n\n                <div class="container-fluid well">\n                    <div class="row">\n                        <div class="form-group">\n                            <label translate="LABEL_REQUESTOR"></label>\n                            <label class="form-control input-sm">{{userEmail}}</label>\n                        </div>\n                    </div>\n                    <div class="row">\n                        <div class="form-group">\n                            <label for="recycleQuantity" translate="LABEL_RECYCLE_QUANTITY"></label>\n                            <input type="number" class="form-control" id="recycleQuantity" name="recycleQuantity" ng-model="recycle.quantity" translate-attr="{ placeholder: \'IN_LITERS_PLACEHOLDER\' }" required ng-min="10" ng-max="1000">\n                        </div>\n                    </div>\n                    <div class="row">\n                        <div class="form-group">\n                            <label for="recycleAddress" translate="LABEL_DELIVERY_ADDRESS" ng-show="!recycle.isPickup"></label>\n                            <label for="recycleAddress" translate="LABEL_PICKUP_ADDRESS" ng-show="recycle.isPickup"></label>\n                            <textarea class="form-control input-sm" rows="4" id="recycleAddress" name="recycleAddress" ng-model="recycle.address" required ng-minlength="20" ng-maxlength="180"></textarea>\n                        </div>\n                    </div>\n                    <div class="row" ng-show="recycle.isPickup && recycle.quantity > 100">\n                        <div class="form-group">\n                            <label for="recyclePickupDate" translate="LABEL_PICKUP_DATE"></label>\n                            <input type="date" class="form-control" id="recyclePickupDate" name="recyclePickupDate" ng-model="recycle.date">\n                        </div>\n                    </div>\n                    <div class="row">\n                        <div class="form-group">\n                            <div class="checkbox" ng-show="recycle.quantity > 100">\n                                <label>\n                                    <input type="checkbox" id="isPickup" name="isPickup" ng-model="recycle.isPickup"/> <span translate="REQUEST_PICKUP"></span>\n                                </label>\n                            </div>\n                            <button type="submit" id="submitButton" class="btn btn-primary" ng-disabled="form.$invalid" ng-click="save()"><i class="fas fa-paper-plane fa-lg"></i> <span translate="BTN_SUBMIT"></span></button>\n                        </div>\n                    </div>\n\n                </div>\n            </form>\n\n        </div>\n    </div>\n\n    <aside class="col-lg-3 col-lg-offset-0 col-sm-10 col-sm-offset-1">\n        <h3 class="page-header page-header-sm"><small translate="SECTION_PRESS_JUICE_RESPONSIBLY"></small></h3>\n\n        <div class="thumbnail">\n            <img ng-src="{{topImage}}" width="100">\n            <div class="caption">\n                <small>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</small>\n            </div>\n        </div>\n        <div class="thumbnail">\n            <img ng-src="{{bottomImage}}" width="100">\n            <div class="caption">\n                <small>Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</small>\n            </div>\n        </div>\n    </aside>\n\n</section>'), e.put("views/Register.html", '<div class="row">\n    <section class="col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-2">\n        <h3 class="page-header page-header-sm" translate="TITLE_REGISTRATION"></h3>\n\n        <form role="form" name="form" novalidate>\n\n            <div class="alert-danger" ng-show="form.$invalid && form.$dirty">\n                <p ng-show="form.userEmail.$error.required && form.userEmail.$dirty" translate="MANDATORY_EMAIL"></p>\n                <p ng-show="form.userEmail.$error.email && form.userEmail.$dirty" translate="INVALID_EMAIL"></p>\n                <p ng-show="form.userPassword.$error.required && form.userPassword.$dirty" translate="MANDATORY_PASSWORD"></p>\n                <p ng-show="(form.userPassword.$error.minlength || form.userPassword.$error.maxlength) && form.userPassword.$dirty" translate="INVALID_PASSWORD_LENGTH" translate-value-length="5-20"></p>\n                <p ng-show="form.userPasswordRepeat.$error.required && form.userPasswordRepeat.$dirty" translate="MANDATORY_PASSWORD_REPEAT"></p>\n                <p ng-show="form.securityQuestion.$error.required && form.securityQuestion.$dirty" translate="MANDATORY_SECURITY_QUESTION"></p>\n                <p ng-show="form.securityAnswer.$error.required && form.securityAnswer.$dirty" translate="MANDATORY_SECURITY_ANSWER"></p>\n            </div>\n\n             <div class="container-fluid well">\n\n                <div class="row">\n                    <div class="form-group">\n                        <label for="userEmail" translate="LABEL_EMAIL"></label>\n                        <input type="email" class="form-control input-sm" id="userEmail" name="userEmail" ng-model="user.email" required/>\n                    </div>\n                </div>\n                <div class="row">\n                    <div class="form-group">\n                        <label for="userPassword" translate="LABEL_PASSWORD"></label>\n                        <input type="password" class="form-control input-sm" id="userPassword" name="userPassword" ng-model="user.password" required ng-minlength="5" ng-maxlength="20"/>\n                    </div>\n                </div>\n                <div class="row">\n                    <div class="form-group">\n                        <label for="userPasswordRepeat" translate="LABEL_PASSWORD_REPEAT"></label>\n                        <input type="password" class="form-control input-sm" id="userPasswordRepeat" name="userPasswordRepeat" ng-model="user.passwordRepeat" required/>\n                    </div>\n                </div>\n                 <div class="row">\n                     <div class="form-group">\n                         <label for="securityQuestion" translate="LABEL_SECURITY_QUESTION"></label> <i class="fas fa-exclamation-triangle fa-sm"></i><small translate="CANNOT_BE_CHANGED_LATER"></small>\n                         <select class="form-control input-sm" id="securityQuestion" name="securityQuestion" ng-model="user.securityQuestion" ng-options="option.question for option in securityQuestions track by option.id" required/>\n                         <input type="text" class="form-control input-sm" id="securityAnswer" name="securityAnswer" ng-model="user.securityAnswer" required/>\n                     </div>\n                 </div>\n                <div class="row">\n                    <div class="form-group">\n                        <button type="submit" id="registerButton" class="btn btn-primary" ng-disabled="form.$invalid" ng-click="save()"><i class="fas fa-user-plus fa-lg"></i> <span translate="BTN_REGISTER"></span></button>\n                    </div>\n                </div>\n\n            </div>\n\n        </form>\n\n    </section>\n</div>'), e.put("views/ScoreBoard.html", '<div class="row">\n    <section class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">\n        <h3 class="page-header page-header-sm" translate="TITLE_SCORE_BOARD"></h3>\n\n        <uib-progressbar animate="false" value="percentChallengesSolved" type="{{completionColor}}"><b>{{percentChallengesSolved}}%</b></uib-progressbar>\n\n        <div class="container-fluid well">\n            <div class="form-group">\n                <label translate="LABEL_DIFFICULTY"></label>\n                <div class="btn-group">\n                    <label ng-repeat="difficulty in [1, 2, 3, 4, 5, 6]" class="btn btn-primary" ng-model="scoreBoardTablesExpanded[difficulty]" ng-click="toggleDifficulty()" uib-btn-checkbox>\n                        <span class="fa-4x fa-layers fa-fw">\n                            <svg style="fill:url(#{{difficulty}})" class="svg-inline--fa fa-star fa-w-18" aria-hidden="true" data-prefix="fa" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg="">\n                                <linearGradient ng-attr-id="{{difficulty}}" x1="0" x2="0" y1="0" y2="100%">\n                                        <stop ng-attr-offset="{{challenges ? offsetValue[difficulty - 1] : \'100%\'}}" stop-color="grey"/>\n                                        <stop ng-attr-offset="{{challenges ? offsetValue[difficulty - 1] : \'100%\'}}" stop-color="#FA7D2B"/>\n                                </linearGradient>\n                                <path fill="{{offsetValue[difficulty - 1] === \'0%\' ? \'#64AA00\' : \'inherit\'}}"\n                                d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z">\n                                </path>\n                            </svg>\n                            <span class="fa-layers-text fa-inverse" data-fa-transform="shrink-9" style="font-weight:900;">{{difficulty}}</span>\n                            <span class="fa-layers-counter"\n                             ng-attr-style="background-color:{{((challenges|filter: {difficulty: difficulty, solved: true}).length === (challenges|filter: {difficulty: difficulty}).length ? \'#62c462\' : (challenges|filter: {difficulty: difficulty, solved: true}).length === 0 ? \'#ee5f5b\' : \'#f89406\')}}">\n                                {{(challenges|filter: {difficulty: difficulty, solved: true}).length + \'/\' + (challenges|filter: {difficulty: difficulty}).length}}\n                            </span>\n                        </span>\n                    </label>\n                </div>\n            </div>\n        </div>\n\n        <div ng-repeat="difficulty in [1, 2, 3, 4, 5, 6]">\n            <section uib-collapse="!scoreBoardTablesExpanded[difficulty]" class="container-fluid well">\n                <h3>\n                    <span uib-rating ng-model="difficulty" max="{{difficulty}}" read-only="true" class="nowrap"></span>\n                </h3>\n                <table class="table table-striped table-bordered table-condensed table-hover">\n                    <tr>\n                        <th translate="LABEL_NAME"></th>\n                        <th translate="LABEL_DESCRIPTION"></th>\n                        <th translate="LABEL_STATUS"></th>\n                    </tr>\n                    <tr data-ng-repeat="challenge in challenges | filter: {difficulty: difficulty} | orderBy: \'name\'">\n                        <td style="white-space: nowrap"><div ng-bind="challenge.name"></div></td>\n                        <td style="width:100%"><div ng-bind-html="challenge.description"></div></td>\n                        <td class="text-center">\n                            <span ng-show="!challenge.solved && !challenge.disabledEnv" id="{{challenge.name}}.notSolved" class="label label-danger" ng-click="openHint(challenge)" ng-class="{ \'label-button\': showChallengeHints && challenge.hintUrl }" uib-tooltip="{{ showChallengeHints ? challenge.hint : null }}">\n                                <i class="fas fa-book" aria-hidden="true" ng-show="showChallengeHints && (challenge.hint || challenge.hintUrl)"></i>\n                                <span translate="STATUS_UNSOLVED"></span>\n                            </span>\n                            <span ng-show="challenge.solved && !challenge.disabledEnv" id="{{challenge.name}}.solved" class="label label-success" ng-click="repeatNotification(challenge)" ng-class="{ \'label-button\': allowRepeatNotifications }" uib-tooltip="{{ allowRepeatNotifications ? (\'NOTIFICATION_RESEND_INSTRUCTIONS\' | translate) : null }}">\n                                <i class="far fa-flag" aria-hidden="true" ng-show="allowRepeatNotifications"></i>\n                                <span translate="STATUS_SOLVED"></span>\n                            </span>\n                            <span ng-show="challenge.disabledEnv" id="{{challenge.name}}.unavailable" class="label label-primary" uib-tooltip="{{challenge.hint}}">\n                                <i class="icon-{{challenge.disabledEnv.toLowerCase()}}" aria-hidden="true"></i>\n                                <span translate="STATUS_UNAVAILABLE"></span>\n                            </span>\n                        </td>\n                    </tr>\n                </table>\n            </section>\n        </div>\n\n        <footer class="alert alert-info" translate="CALL_FOR_CONTRIBUTIONS" translate-value-gitter=\'<a href="http://gitter.im/bkimminich/juice-shop"><i class="fab fa-gitter"></i>Gitter.im</a>\' translate-value-github=\'<a href="https://github.com/bkimminich/juice-shop/issues"><i class="fab fa-github"></i>GitHub</a>\'></footer>\n\n        <img src="/public/images/tracking/scoreboard.png"/>\n\n    </section>\n\n</div>\n'), e.put("views/SearchResult.html", '<div class="row">\n    <section class="col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">\n        <h3 ng-show="searchQuery" class="page-header page-header-sm"><span translate="TITLE_SEARCH_RESULTS"></span> <span class="label label-default" ng-bind-html="searchQuery"></span></h3>\n        <h3 ng-show="!searchQuery" class="page-header page-header-sm" translate="TITLE_ALL_PRODUCTS"></h3>\n\n        <div class="alert-info" ng-show="confirmation">\n            <p>{{confirmation}}</p>\n        </div>\n\n        <table class="table table-striped table-bordered table-condensed table-hover">\n            <tr>\n                <th translate="LABEL_IMAGE"></th>\n                <th translate="LABEL_PRODUCT"></th>\n                <th translate="LABEL_DESCRIPTION"></th>\n                <th translate="LABEL_PRICE"></th>\n                <th></th>\n            </tr>\n            <tr data-ng-repeat="product in products">\n                <td><img ng-src="/public/images/products/{{product.image}}" role="button" class="img-responsive img-thumbnail" style="width: 200px" ng-click="showDetail(product.id)"/></td>\n                <td>{{product.name}}</td>\n                <td><div ng-bind-html="product.description"></div></td>\n                <td>{{product.price}}</td>\n                <td>\n                    <div class="btn-group">\n                        <a class="btn btn-default btn-xs" ng-click="showDetail(product.id)"><i class="fas fa-eye"></i></a>\n                        <a class="btn btn-default btn-xs" ng-click="addToBasket(product.id)" ng-show="isLoggedIn()"><i class="fas fa-cart-plus"></i></a>\n                    </div>\n                </td>\n            </tr>\n        </table>\n\n    </section>\n</div>'), e.put("views/TokenSale.html", '<div class="row">\n\n    <section class="col-lg-5 col-lg-offset-2 col-sm-10 col-sm-offset-1">\n        <h3 class="page-header page-header-sm"><span translate="TITLE_TOKENSALE"></span> <small translate="SECTION_ICO" translate-value-juicycoin="<span class=\'badge\'><i class=\'fab fa-bitcoin\'></i> {{altcoinName}}</span>"></small></h3>\n\n        <section class="container-fluid well">\n            <div class="row">\n                <label translate="SECTION_WHITEPAPER"></label>\n                <small>(<span translate="WHITEPAPER_REFERENCES"></span>)</small>\n            </div>\n            <div class="row">\n                <a href="https://ponzico.win/ponzico.pdf" target="_blank" class="btn btn-success">\n                    <i class="fas fa-university fa-lg"></i> PonzICO Whitepaper\n                </a>\n                <a href="https://www.sec.gov/investor/alerts/ia_virtualcurrencies.pdf" target="_blank" class="btn btn-success">\n                    <i class="fas fa-graduation-cap fa-lg"></i> PonziCoin Whitepaper\n                </a>\n            </div>\n        </section>\n\n        <section>\n            <h3 class="page-header page-header-sm"><small translate="SECTION_SALES_PITCH"></small></h3>\n            <p class="text-justify">\n                Lorem ipsum dolor sit amet <span class=\'badge\'><i class=\'fab fa-bitcoin\'></i> {{altcoinName}}</span>, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\n                <span translate="GIVE_US_ALL_YOUR_MONEY"></span>\n\n                Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.\n\n                <span translate="GIVE_US_ALL_YOUR_MONEY"></span>\n\n                Ut wisi enim ad minim veniam, quis <span class=\'badge\'><i class=\'fab fa-bitcoin\'></i> {{altcoinName}}</span> nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.\n\n                <span translate="GIVE_US_ALL_YOUR_MONEY"></span>\n\n                Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.\n\n                <span translate="GIVE_US_ALL_YOUR_MONEY"></span>\n\n                Duis autem vel eum <span class=\'badge\'><i class=\'fab fa-bitcoin\'></i> {{altcoinName}}</span> iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.\n\n                <span translate="GIVE_US_ALL_YOUR_MONEY"></span>\n\n                At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. <span class=\'badge\'><i class=\'fab fa-bitcoin\'></i> {{altcoinName}}</span> est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur.\n            </p>\n        </section>\n    </section>\n\n    <aside class="col-lg-3 col-lg-offset-0 col-sm-10 col-sm-offset-1">\n        <h3 class="page-header page-header-sm"><small translate="ICO_FAQ"></small></h3>\n\n        <div class="thumbnail">\n' + "            <label><i class='fas fa-comments fa-2x'></i> Stet <span class='badge'><i class='fab fa-bitcoin'></i> {{altcoinName}}</span> clita kasd gubergren?</label>\n            <div class=\"caption\">\n                <small>Stet clita kasd gubergren, no <span class='badge'><i class='fab fa-bitcoin'></i> {{altcoinName}}</span> sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.</small>\n            </div>\n        </div>\n        <div class=\"thumbnail\">\n            <label><i class='far fa-comment-alt fa-2x'></i> Consetetur sadipscing elitr?</label>\n            <div class=\"caption\">\n                <small>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed <span class='badge'><i class='fab fa-bitcoin'></i> {{altcoinName}}</span> diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</small>\n            </div>\n        </div>\n        <div class=\"thumbnail\">\n            <label><i class='far fa-comments fa-2x'></i> Hendrerit <span class='badge'><i class='fab fa-bitcoin'></i> {{altcoinName}}</span> in vulputate velit?</label>\n            <div class=\"caption\">\n                <small>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.</small>\n            </div>\n        </div>\n        <div class=\"thumbnail\">\n            <label><i class='fas fa-comment-alt fa-2x'></i> Justo duo dolores et ea rebum?</label>\n            <div class=\"caption\">\n                <small>At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</small>\n            </div>\n        </div>\n        <div class=\"thumbnail\">\n            <label><i class='fas fa-comments fa-2x'></i> <span translate=\"ICO_FAQ_QUESTION\" translate-value-juicycoin=\"<span class='badge'><i class='fab fa-bitcoin'></i> {{altcoinName}}</span>\"></span></label>\n            <div class=\"caption\">\n                <small translate=\"ICO_FAQ_ANSWER\"></small>\n            </div>\n        </div>\n    </aside>\n\n    <img src=\"/public/images/tracking/tokensale.png\"/>\n</div>"), e.put("views/TrackOrder.html", '<div class="row">\n    <section class="col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-2">\n        <h3 class="page-header page-header-sm" translate="TITLE_TRACK_ORDERS"></h3>\n\n        <div>\n\n            <form role="form" name="form" novalidate>\n\n                <div class="container-fluid well">\n\n                        <div class="row">\n                            <div class="form-group">\n                                <label for="orderId" translate="LABEL_ORDER_ID"></label>\n                                <input class="form-control input-sm" id="orderId" name="orderId" ng-model="orderId" placeholder="xxxx-0123456789abcdef" required/>\n                            </div>\n                        </div>\n                        <div class="row">\n                                <div class="form-group">\n                                    <button type="submit" id="trackButton" class="btn btn-primary" ng-disabled="form.$invalid" ng-click="save()"><i class="fas fa-map-marker fa-lg"></i> <span translate="BTN_TRACK"></span></button>\n                                </div>\n                        </div>\n                </div>\n\n            </form>\n        </div>\n\n    </section>\n</div>'), e.put("views/TrackResult.html", '<div class="row">\n    <section class="col-md-4 col-md-offset-4 col-sm-8 col-sm-offset-2">\n        <h3 class="page-header page-header-sm"><span translate="TITLE_SEARCH_RESULTS"></span> <small class="label label-default" ng-bind-html="results.orderId"></small></h3>\n\n        <h4 translate="LABEL_EXPECTED_DELIVERY"></h4>\n        <div class="container-fluid well">\n            <div class="row fa-4x">\n                <i class="fas fa-warehouse"></i>\n                <i class="fas fa-sync fa-spin"></i>\n                <i class="fas fa-truck-loading"></i>\n                <i class="fas fa-truck"></i>\n                <span class="fa-layers fa-fw">\n                <i class="fas fa-home"></i>\n                    <span class="fa-layers-counter" style="background:Tomato">{{results.eta}}&nbsp;<span translate="LABEL_DAYS"></span></span>\n                </span>\n            </div>\n        </div>\n\n        <h4 translate="LABEL_PRODUCT_ORDERED"></h4>\n        <table class="table table-striped table-bordered table-condensed">\n            <tr>\n                <th translate="LABEL_PRODUCT"></th>\n                <th translate="LABEL_PRICE"></th>\n                <th translate="LABEL_QUANTITY"></th>\n                <th translate="LABEL_TOTAL_PRICE"></th>\n            </tr>\n            <tr data-ng-repeat="product in results.products">\n                <td>{{product.name}}</td>\n                <td>{{product.quantity}}</td>\n                <td>{{product.price}}</td>\n                <td>{{product.total}}</td>\n            </tr>\n        </table>\n    </section>\n</div>'), e.put("views/UserDetail.html", '<section>\n    <header class="modal-header">\n        <h3 class="modal-title"><span translate="LABEL_USER"></span> #{{user.id}}</h3>\n    </header>\n    <div class="modal-body">\n\n        <div class="container-fluid">\n            <div class="row">\n                <div class="col-md-6">\n                    <strong translate="LABEL_EMAIL"></strong>\n\n                    <p>{{user.email}}</p>\n                </div>\n                \x3c!--<div class="col-md-6" ng-show="user.password">\n                    <strong translate="LABEL_PASSWORD"></strong>\n\n                    <p>{{user.password}}</p>\n                </div>--\x3e\n            </div>\n            <div class="row">\n                <div class="col-md-6">\n                    <strong translate="LABEL_CREATED_AT"></strong>\n\n                    <p>{{user.createdAt}}</p>\n                </div>\n                <div class="col-md-6">\n                    <strong translate="LABEL_UPDATED_AT"></strong>\n\n                    <p>{{user.updatedAt}}</p>\n                </div>\n            </div>\n        </div>\n    </div>\n    <footer class="modal-footer">\n        <button class="btn btn-default" ng-click="$close()"><i class="fas fa-arrow-circle-left fa-lg"></i> <span translate="BTN_CLOSE"></span></button>\n    </footer>\n</section>')
}]);