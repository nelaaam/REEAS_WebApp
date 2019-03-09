const timeout = 5000;
const host = "localhost";
const user = "root";
const pass = "reeas";
const name = "reeas_db";

exports.get = function (param) {
    if(param == 'db_timeout') return timeout;
    else if(param == 'db_host') return host;
    else if(param == 'db_user') return user;
    else if(param == 'db_pass') return pass;
    else if(param == 'db_name') return name;
    else return null;
}

