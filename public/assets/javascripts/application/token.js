/* var loader = $('.loading-container');
loader.removeClass('hidden'); */

const tokenConfig = {
  name: 'KCC Testnet Faucet Token List',
  timestamp: '2021-05-26 17:42:58',
  tokens: [
    {
      name: 'KCS Token',
      symbol: 'KCS',
      address: '0x0',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'KCC-Peg Wrapped BTC',
      symbol: 'WBTC',
      address: '0xf57a7eE19a628e4d475b72d6c9DD847c50636e01',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'KCC-Peg Wrapped ETH',
      symbol: 'WETH',
      address: '0xF8Cb9f1D136Ff4c883320b5B4fa80048b888F459',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'KCC-Peg Tether USD',
      symbol: 'USDT',
      address: '0x67f6a7BbE0da067A747C6b2bEdF8aBBF7D6f60dc',
      chainId: 322,
      decimals: 18,
    },
    {
      name: ' KCC-Peg USD Coin',
      symbol: 'USDC',
      address: '0xD6c7E27a598714c2226404Eb054e0c074C906Fc9',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'KCC-Peg Uniswap',
      symbol: 'UNI',
      address: '0xA4d35720Fe0B62c0eea9D272F5ea73189093ec82',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'LINK',
      symbol: 'LINK',
      address: '0x040fBFd760C3dCA12F3f67D54A09dcB13877eaA5',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'AAVE',
      symbol: 'AAVE',
      address: '0x4e5839b4E651da7071Fbd617bF1dDefb5f33A9DB',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'DAI',
      symbol: 'DAI',
      address: '0x07d169F52fCB96a9f56325f510528E0D65ca4952',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'MKR',
      symbol: 'MKR',
      address: '0x9Afb5acd8288F30047cb59c3acEff4c85602B069',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'SHIB',
      symbol: 'SHIB',
      address: '0x38825EaF53ac2ECC01Ecae28Fc3c1e5220dEAD7C',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'FTT',
      symbol: 'FTT',
      address: '0xB20A491fC1d9689c2A3d6766502F8796B7A016D1',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'CRO',
      symbol: 'CRO',
      address: '0x376eDaADb16cF8De8D373113017fa62DBFeDD6Ad',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'HT',
      symbol: 'HT',
      address: '0x3EC5b948F0cB8869fcE80A840Ae9d23C242CA658',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'COMP',
      symbol: 'COMP',
      address: '0x92dB35c063DD7b8D6cC0CF373130Ff83e8A08617',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'LEO',
      symbol: 'LEO',
      address: '0xBb740Aca24CAD73A2742B654426f660B45C62d1D',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'UST',
      symbol: 'UST',
      address: '0x662BCf8BCbAE918528Cb0E3c855D899A245f9D6E',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'TEL',
      symbol: 'TEL',
      address: '0x69F436180BDE67A5C7e1893B74b942d6aD24b8B3',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'CHZ',
      symbol: 'CHZ',
      address: '0x8eBc9Dec6239355a7ABebDFf31Eaff650e229A43',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'YFI',
      symbol: 'YFI',
      address: '0x299814b885ecC391Ec5962ca159a7d09ad078ca6',
      chainId: 322,
      decimals: 18,
    },
    {
      name: 'HOT',
      symbol: 'HOT',
      address: '0x2a876f31124397400CBeE0bF1865c9Af8d9aAb78',
      chainId: 322,
      decimals: 18,
    },
  ],
};

const { tokens } = tokenConfig;

const generateTokenOptionList = () => {
  const select = $('#tokenList');
  const tokenListDom = tokens
    .map((token) => {
      const isETH = token.address === '0x0';
      return `<option value="${token.address}">${isETH ? 1 : 100} ${
        token.symbol
      }</option>`;
    })
    .join('');

  select.html(tokenListDom);
};

const changeInputPlaceholder = (tokenName) => {
  const prefix = 'Enter your address here to recieve ';
  const input = $('#receiver');
  console.log(input);
  input.attr('placeholder', `${prefix}${tokenName}`);
};

const changeButtonText = (tokenName) => {
  const prefix = 'REQUEST  ' + (tokenName === 'KCS' ? '1 ' : '100 ');
  const button = $('#requestTokens');
  console.log(button);
  button.text(`${prefix}${tokenName}`);
};

const tokensChange = (e) => {
  const tokenAddress = e.target.value;
  let name = '';
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].address === tokenAddress) {
      name = tokens[i].symbol;
      break;
    }
  }
  changeInputPlaceholder(name);
  changeButtonText(name);
};

const initEvents = () => {
  const tokenSelect = $('#tokenList');
  tokenSelect.on('change', tokensChange);
};

window.onload = function () {
  generateTokenOptionList();
  initEvents();
};
