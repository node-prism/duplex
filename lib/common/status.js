export var Status;
(function (Status) {
    Status[Status["ONLINE"] = 3] = "ONLINE";
    Status[Status["CONNECTING"] = 2] = "CONNECTING";
    Status[Status["CLOSED"] = 1] = "CLOSED";
    Status[Status["OFFLINE"] = 0] = "OFFLINE";
})(Status || (Status = {}));
