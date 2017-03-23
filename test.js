function sleep(timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    })
}

(async function() {
    console.log('1111111')
    await sleep(3000)
    console.log('2222222')
})()