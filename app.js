const API_URL = "https://open.er-api.com/v6/latest/";
// HTML Elements
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");

const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");

const exchangeBtn = document.getElementById("exchangeBtn");
const swapBtn = document.getElementById("swapBtn");

const result = document.getElementById("result");

const currencies = {
    USD: "US",
    INR: "IN",
    EUR: "FR",
    GBP: "GB",
    JPY: "JP",
    AUD: "AU",
    CAD: "CA",
    CHF: "CH",
    CNY: "CN",
    AED: "AE",
    SAR: "SA",
    PKR: "PK",
    BDT: "BD",
    RUB: "RU",
    NZD: "NZ",
    SGD: "SG",
    HKD: "HK",
    KRW: "KR",
    THB: "TH",
    MYR: "MY",
    IDR: "ID",
    NPR: "NP",
    LKR: "LK",
    TRY: "TR",
    ZAR: "ZA",
    BRL: "BR",
    MXN: "MX",
    NOK: "NO",
    SEK: "SE",
    DKK: "DK",
    PLN: "PL",
    CZK: "CZ",
    HUF: "HU",
    ILS: "IL",
    KWD: "KW",
    QAR: "QA",
    OMR: "OM",
    BHD: "BH",
    JOD: "JO",
    EGP: "EG",
    NGN: "NG",
    KES: "KE",
    GHS: "GH",
    TZS: "TZ",
    UGX: "UG",
    MAD: "MA",
    DZD: "DZ",
    VND: "VN",
    PHP: "PH",
    PKR: "PK",
    UAH: "UA"
};

function loadCurrencies() {

    fromCurrency.innerHTML = "";
    toCurrency.innerHTML = "";

    Object.keys(currencies).forEach(currency => {

        const option1 = document.createElement("option");
        option1.value = currency;
        option1.textContent = currency;

        const option2 = document.createElement("option");
        option2.value = currency;
        option2.textContent = currency;

        fromCurrency.appendChild(option1);
        toCurrency.appendChild(option2);
    });


    // Default
    fromCurrency.value = "USD";
    toCurrency.value = "INR";

    updateFlags();
}
// Update Flags

function updateFlags() {

    const fromCode = currencies[fromCurrency.value];
    const toCode = currencies[toCurrency.value];

    if (fromCode) {
        fromFlag.src =
            `https://flagsapi.com/${fromCode}/flat/32.png`;
    }

    if (toCode) {
        toFlag.src =
            `https://flagsapi.com/${toCode}/flat/32.png`;
    }
}
// Get Exchange Rate
async function getExchangeRate() {

    const amount = Number(amountInput.value);

    const from = fromCurrency.value;
    const to = toCurrency.value;


    // Check amount
    if (!amount || amount < 0) {

        result.textContent =
            "Please enter a valid amount.";

        return;
    }
    // Same currency
    if (from === to) {

        result.innerHTML =
            `${amount} ${from} = ${amount} ${to}<br>
             <small>1 ${from} = 1 ${to}</small>`;

        return;
    }


    result.textContent = "Getting exchange rate...";

    exchangeBtn.disabled = true;
    exchangeBtn.textContent = "Loading...";


    try {

        const response =
            await fetch(API_URL + from);

        if (!response.ok) {
            throw new Error("API Error");
        }


        const data = await response.json();


        // Check API response
        if (
            data.result !== "success" ||
            !data.rates ||
            !data.rates[to]
        ) {

            throw new Error(
                "Exchange rate not available"
            );
        }


        const rate = data.rates[to];

        const convertedAmount = amount * rate;


        // Show result
        result.innerHTML = `
            ${amount.toLocaleString()} ${from}
            =
            ${convertedAmount.toLocaleString(undefined, {
                maximumFractionDigits: 2
            })} ${to}

            <br>

            <small>
                1 ${from} = ${rate.toLocaleString(undefined, {
                    maximumFractionDigits: 6
                })} ${to}
            </small>
        `;

    } catch (error) {

        console.error(error);

        result.textContent =
            "Unable to get exchange rate. Please try again.";

    } finally {

        exchangeBtn.disabled = false;
        exchangeBtn.textContent = "Get Exchange Rate";
    }
}
// Swap Currency
swapBtn.addEventListener("click", () => {

    const temp = fromCurrency.value;

    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    updateFlags();

    // Automatically calculate after swap
    getExchangeRate();
});
// Currency Change
fromCurrency.addEventListener(
    "change",
    updateFlags
);

toCurrency.addEventListener(
    "change",
    updateFlags
);

// Button Click
exchangeBtn.addEventListener(
    "click",
    getExchangeRate
);
// Enter Key
amountInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        getExchangeRate();
    }

});
// Start App
loadCurrencies();