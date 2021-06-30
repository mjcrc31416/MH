


module.exports.doLogMsg =  {
    doLogMsg: doLogMsg
};


async function doLog(date, msg) {
    let newLogData = {
        logDate: date,
        msg: msg
    };
    let newDbItem = new LogData(newLogData);
    await newDbItem.save()

    console.log(msg);
}

function doLogMsg(msg) {
    let fnMain = async () => {
        await doLog(Date(), msg);
    }
}
