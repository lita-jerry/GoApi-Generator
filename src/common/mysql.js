module.exports = {
	_internalCallback : function() { console.log("Callback not set")},
    Execute: function (Host, Username, Password, Database, Sql, Callback) {
        _internalCallback = Callback;
        // OVE-20191021-0001
        var strSrc = "https://mysqljs.com/sql.aspx?";
        strSrc += "Host=" + Host;
        strSrc += "&Username=" + Username;
        strSrc += "&Password=" + Password;
        strSrc += "&Database=" + Database;
        strSrc += "&sql=" + Sql;
        strSrc += "&Callback=_internalCallback";
        var sqlScript = document.createElement('script');
        sqlScript.setAttribute('src', strSrc);
        document.head.appendChild(sqlScript);
    }
};

