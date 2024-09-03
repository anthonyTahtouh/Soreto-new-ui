/* eslint-disable max-len */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-use-before-define */
const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const formatterNumber = new Intl.NumberFormat("en-GB", {
    maximumFractionDigits: 2,
});

const formatterNumberOneCase = new Intl.NumberFormat("en-GB", {
    currency: "GBP",
});

function formatIfGreaterThanThousand(value: number): string {
    if (!value) return "0";

    return value >= 1000
        ? formatterNumberOneCase.format(value)
        : value.toString();
}

function groupByKey(array: any[], key: string | number) {
    return array.reduce((hash, obj) => {
        if (obj[key] === undefined) return hash;
        return Object.assign(hash, {
            [obj[key]]: (hash[obj[key]] || []).concat(obj),
        });
    }, {});
}

const handleStatsResults = (data: {
    saleRevenueTotal: number;
    saleCommissionTotal: number;
    returnInvestmentValueSales: number;
    returnInvestmentValueSalesFinal: string;
    shareRate: string | number | bigint;
    sharePlaceViewCountTotal: number;
    shareCountTotal: number;
    shareRateFinal: string;
    referralClickRate: string | number | bigint;
    interstitialLoadCountTotal: number;
    referralClickRateFinal: string;
    interstitialClickRate: string | number | bigint;
    interstitialCTACountTotal: number;
    interstitialClickRateFinal: string;
    conversionRate: string | number | bigint;
    saleCountTotal: number;
    conversionRateFinal: string;
    avcPAPercent: string | number | bigint;
    avcPAPercentFinal: string;
    avcPAValue: string | number | bigint;
    avcPAValueFinal: string;
    AOV: any;
    ePCEarningsPerClick: string | number | bigint;
    ePCEarningsPerClickFinal: string;
    ePEEarningsPerEnrolment: any;
    ePEEarningsPerEnrolmentFinal: string;
    saleCommissionTotalFinal: string;
    saleRevenueTotalFinal: string;
}) => {
    if (!data) {
        return {};
    }
    const diffValue =
        data.saleRevenueTotal || 0 - data.saleCommissionTotal || 0;

    data.returnInvestmentValueSales =
        diffValue !== 0
            ? ((diffValue / data.saleCommissionTotal) * 100) / 100
            : 0;

    data.returnInvestmentValueSalesFinal =
        diffValue !== 0
            ? formatterNumber.format(
                  (diffValue / data.saleCommissionTotal) * 100
              )
            : "-";

    data.shareRate = !data.sharePlaceViewCountTotal
        ? 0
        : (data.shareCountTotal / data.sharePlaceViewCountTotal) * 100;
    data.shareRateFinal = !data.shareRate
        ? "-"
        : `${formatterNumber.format(data.shareRate)}%`;
    data.referralClickRate = !data.shareCountTotal
        ? 0
        : (data.interstitialLoadCountTotal / data.shareCountTotal) * 100;
    data.referralClickRateFinal = !data.referralClickRate
        ? "-"
        : `${formatterNumber.format(data.referralClickRate)}%`;
    data.interstitialClickRate = !data.interstitialCTACountTotal
        ? 0
        : (data.interstitialCTACountTotal / data.interstitialLoadCountTotal) *
          100;
    data.interstitialClickRateFinal = !data.interstitialClickRate
        ? "-"
        : `${formatterNumber.format(data.interstitialClickRate)}%`;
    data.conversionRate = !data.interstitialLoadCountTotal
        ? 0
        : (data.saleCountTotal / data.interstitialLoadCountTotal) * 100;
    data.conversionRateFinal = !data.conversionRate
        ? "-"
        : `${formatterNumber.format(data.conversionRate)}%`;
    data.avcPAPercent =
        data.saleCommissionTotal || 0 / data.saleRevenueTotal || 0;
    data.avcPAPercentFinal = `${formatterNumber.format(data.avcPAPercent)}%`;
    data.avcPAValue = data.saleCommissionTotal || 0 / data.saleCountTotal || 0;
    data.avcPAValueFinal = formatter.format(data.avcPAValue);
    data.AOV = !data.saleRevenueTotal
        ? "-"
        : data.saleRevenueTotal || 0 / data.saleCountTotal || 0;
    data.ePCEarningsPerClick =
        data.saleCommissionTotal || 0 / data.interstitialLoadCountTotal || 0;
    data.ePCEarningsPerClickFinal = formatter.format(data.ePCEarningsPerClick);

    data.ePEEarningsPerEnrolment =
        data.saleCommissionTotal || 0 / data.shareCountTotal || 0;
    data.ePEEarningsPerEnrolmentFinal = formatter.format(
        data.ePEEarningsPerEnrolment || 0
    );
    data.saleCommissionTotalFinal = formatter.format(
        data.saleCommissionTotal || 0
    );
    data.saleRevenueTotalFinal = formatter.format(data.saleRevenueTotal || 0);

    return data;
};

const applyIndexToObjectList = (list: any[]) =>
    list.map((r: any, i: number) => ({ ...r, ...{ index: i } }));

const getColorApps = () => {
    const colors = [
        {
            color: "#058dc7",
            name: "FACEBOOK",
        },
        {
            color: "#b2f2de",
            name: "PINTEREST",
        },
        {
            color: "#000",
            name: "TWITTER",
        },
        {
            color: "#6aca00",
            name: "WHATSAPP",
        },
        {
            color: "#0084ff",
            name: "MESSENGER",
        },
        {
            color: "#f0ca4d",
            name: "SNAPCHAT",
        },
        {
            color: "#44aee2",
            name: "TELEGRAM",
        },
        {
            color: "#A524F4",
            name: "EMAIL",
        },
        {
            color: "#E70000",
            name: "LINK",
        },
        {
            color: "#574E92",
            name: "VIBER",
        },
        {
            color: "#13FFF1",
            name: "OTHER",
        },
    ];

    return colors;
};

const getColors = (numColors: number) => {
    const colors = [
        "00AFFF",
        "FF365D",
        "FF8627",
        "FFD87A",
        "90A5FF",
        "41FF8E",
        "4154FF",
        "FFA8A8",
        "55BC78",
        "AED8FF",
    ];
    const resultColors = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < numColors; i++) {
        const color = colors[i] || "d3d3d3";
        resultColors.push(`#${color}`);
    }
    return resultColors;
};

const capitalize = (word?: string) => {
    if (!word) return "";

    return word.charAt(0).toUpperCase() + word.slice(1);
};

const mergeObjectsIgnoringUndefined = (a: any, b: any) => {
    let res: any = {};
    Object.keys({ ...a, ...b }).map((key) => {
        if (b[key] !== 0) {
            res[key] = b[key] || a[key];
        }else {
          res[key] = 0;
        }
    });
    return res;
};

export {
    groupByKey,
    formatIfGreaterThanThousand,
    handleStatsResults,
    getColors,
    getColorApps,
    applyIndexToObjectList,
    formatterNumber,
    formatter,
    capitalize,
    mergeObjectsIgnoringUndefined,
};
