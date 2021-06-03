module.exports = function (app) {
  var EthereumTx = app.EthereumTx;
  var generateErrorResponse = app.generateErrorResponse;
  var config = app.config;
  var configureWeb3 = app.configureWeb3;
  var validateCaptcha = app.validateCaptcha;

  const InvalidAddressSet = new Set();

  app.set('InvalidAddressSet', InvalidAddressSet);

  const applyKCSToday = (address) => {
    const receivedList = app.get('InvalidAddressSet');
    return receivedList.has(address);
  };

  app.post('/', function (request, response) {
    var recaptureResponse = request.body.captcha;
    if (!recaptureResponse)
      return generateErrorResponse(response, {
        code: 500,
        title: 'Error',
        message: 'Invalid captcha',
      });

    var receiver = request.body.receiver;
    var tokenAddress = request.body.tokenAddress;

    // When user apply for the KCS token，check the receiver status
    if (tokenAddress === '0x0') {
      if (applyKCSToday(receiver)) {
        return generateErrorResponse(response, {
          code: 500,
          title: 'Error',
          message: 'Have received KCS within 3 hours',
        });
      }
    }

    validateCaptcha(recaptureResponse, function (err, out) {
      validateCaptchaResponse(err, out, receiver, response, tokenAddress);
    });
  });

  function validateCaptchaResponse(err, out, receiver, response, tokenAddress) {
    if (!out)
      return generateErrorResponse(response, {
        code: 500,
        title: 'Error',
        message: 'Invalid captcha',
      });
    if (!out.success)
      return generateErrorResponse(response, {
        code: 500,
        title: 'Error',
        message: 'Invalid captcha',
      });

    configureWeb3(config, function (err, web3) {
      configureWeb3Response(err, web3, receiver, response, tokenAddress);
    });
  }

  function configureWeb3Response(err, web3, receiver, response, tokenAddress) {
    if (err) return generateErrorResponse(response, err);

    var senderPrivateKey = config.Ethereum[config.environment].privateKey;
    const privateKeyHex = Buffer.from(senderPrivateKey, 'hex');
    if (!web3.isAddress(receiver))
      return generateErrorResponse(response, {
        code: 500,
        title: 'Error',
        message: 'invalid address',
      });

    var gasPrice = parseInt(web3.eth.gasPrice);
    var gasPriceHex = web3.toHex(gasPrice);
    var nonce = web3.eth.getTransactionCount(
      config.Ethereum[config.environment].account
    );
    var nonceHex = web3.toHex(nonce);

    let rawTx;

    if (tokenAddress === '0x0') {
      rawTx = {
        nonce: nonceHex,
        gasPrice: gasPriceHex,
        gasLimit: config.Ethereum.gasLimit,
        to: receiver,
        value: web3.toHex(web3.toWei(1)),
        data: '0x00',
        chainId: web3.toHex(web3.version.network),
      };
    } else {
      const prefix = '0xa9059cbb';
      const tempAddress =
        receiver.length === 42 ? receiver.substr(2) : receiver;

      const addr = tempAddress.padStart(64, '0').toLowerCase();
      const amount = web3.toHex(web3.toWei(100)).substr(2).padStart(64, '0');

      const rawData = prefix + addr + amount;

      rawTx = {
        nonce: nonceHex,
        gasPrice: gasPriceHex,
        gasLimit: config.Ethereum.gasLimit,
        to: tokenAddress,
        value: web3.toHex(0),
        data: rawData,
        chainId: web3.toHex(web3.version.network),
      };
    }

    var tx = new EthereumTx(rawTx);
    tx.sign(privateKeyHex);

    var serializedTx = tx.serialize();

    web3.eth.sendRawTransaction(
      '0x' + serializedTx.toString('hex'),
      function (err, hash) {
        if (!err) {
          // When receiver get the KCS token, put the address into invalidAddressSet for 3 hours
          if (tokenAddress === '0x0') {
            const receivedList = app.get('InvalidAddressSet');
            receivedList.add(receiver);
            setTimeout(() => {
              receivedList.delete(receiver);
              app.set('InvalidAddressSet', receivedList);
            }, 3 * 60 * 60 * 1000);
          }
          sendRawTransactionResponse(err, hash, response);
        }
      }
    );
  }

  function sendRawTransactionResponse(err, hash, response) {
    if (err) return generateErrorResponse(response, err);

    var successResponse = {
      code: 200,
      title: 'Success',
      message: 'Tx is posted to blockchain',
      txHash: hash,
    };

    response.send({ success: successResponse });
  }
};
