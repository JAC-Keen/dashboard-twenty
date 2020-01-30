$(document).ready(function() {
        showPurchaseFunnel();
        showTotalRevenue();
        showDailyRevenue();
        showAOV();
        showAddToCartRate();
        showRepeatPurchaseRate();
        showConversionRate();
        showLifeTimeValue();
        showMostViewedProducts();
        showMostPopularProducts();
});

const intervalTime = 60 * 1000;

function pluck(arr, key) {
    return arr.map(o => o[key]);
}

function showPurchaseFunnel() {
    const chart = new KeenDataviz({
        container: '#funnel',
        showLoadingSpinner: true,
        clearOnRender: true,
        transition: {
            duration: 0
        },
        type: 'horizontal-funnel-3d',
        labelMapping: {
            first_visits: 'Demo Set',
            product_views: 'Demo Completed',
            add_to_carts: 'Closed Won',
            purchases: 'Closed Lost'
        },
        palette: 'autocollector'
    });

    const client = window._keenClient;

    const fetchResultsAndRender = () => {
        client
            .query({
                    analysis_type: 'funnel',
                    steps: [
                            {
                                event_collection: 'first_visits',
                                actor_property: 'user.uuid'
                            },
                            {
                                    event_collection: 'product_views',
                                    actor_property: 'user.uuid'
                            },
                            {
                                    event_collection: 'add_to_carts',
                                    actor_property: 'user.uuid'
                            },
                            {
                                event_collection: 'purchases',
                                actor_property: 'user.uuid'
                            }
                    ]
            })
            .then(function(res) {
                chart.render(res);
            })
            .catch(function(err) {
                chart
                .message(err.message);
            });
    }

    setInterval( () => {
        fetchResultsAndRender();
    }, intervalTime );

    fetchResultsAndRender();
}

function showLifeTimeValue() {
    const chart = new KeenDataviz({
        container: '#lifetime-value',
        type: 'metric',
        showLoadingSpinner: true,
        palette: 'autocollector',
        prefix: "$",
        title: '',
        clearOnRender: true,
        transition: {
            duration: 0
        }
    });

    const client = window._keenClient;

    const fetchResultsAndRender = () => {
        client
            .query({
                analysis_type: 'average',
                event_collection: 'purchases',
                target_property: 'total',
                group_by: 'user.uuid'
            })
            .then(function(res) {
                const total = res.result.reduce((total, obj) => total + obj.result, 0);
                const average = total / pluck(res.result, 'user.uuid').length;

                chart
                .render({ result: average });
            })
            .catch(function(err) {
                chart
                .message(err.message);
            });
    };

    setInterval( () => {
        fetchResultsAndRender();
    }, intervalTime);

    fetchResultsAndRender();
}

function showAddToCartRate() {
    const chart = new KeenDataviz({
        container: '#add-to-cart',
        showLoadingSpinner: true,
        type: 'funnel-3d',
        labelMapping: {
            product_views: 'Demos Held',
            add_to_carts: 'Demos Completed',
        },
        funnel: {
            percents: {
                show: true,
            },
        },
        palette: 'autocollector',
        clearOnRender: true,
        transition: {
            duration: 0
        }
    });

    const client = window._keenClient;

    const fetchResultsAndRender = () => {
        client
            .query({
                    analysis_type: 'funnel',
                    steps: [
                        {
                            event_collection: 'product_views',
                            actor_property: 'user.uuid'
                        },
                        {
                            event_collection: 'add_to_carts',
                            actor_property: 'user.uuid'
                        }
                ]
            })
            .then(function(res) {
                chart.render(res);
            })
            .catch(function(err) {
                chart
                .message(err.message);
            });
    }

    setInterval( () => {
        fetchResultsAndRender();
    }, intervalTime);

    fetchResultsAndRender();
}

function showTotalRevenue() {
    const chart = new KeenDataviz({
        container: '#total-revenue',
        type: 'metric',
        showLoadingSpinner: true,
        palette: 'autocollector',
        prefix: "$",
        title: '',
        clearOnRender: true,
        transition: {
            duration: 0
        }
    });

    const client = window._keenClient;

    const fetchResultsAndRender = () => {
        client
            .query({
                analysis_type: 'sum',
                event_collection: 'purchases',
                target_property: 'total',
            })
            .then(function(res) {
                chart
                .render(res);
            })
            .catch(function(err) {
                chart
                .message(err.message);
            });
    }

    setInterval( () => {
        fetchResultsAndRender();
    }, intervalTime);

    fetchResultsAndRender();
}

function showDailyRevenue() {
    const chart = new KeenDataviz({
        container: '#chart-revenue',
        type: 'area-spline',
        showLoadingSpinner: true,
        palette: 'autocollector',
        title: '',
        axis: {
            y: {
                tick: {
                    count: 5,
                    format: d => `$${Number.parseFloat(d).toFixed(2)}`
                }
            }
        },
        tooltip: {
            format: {
                value: d => typeof d === 'number' ? d.toFixed(2) : d,
            }
        },
        clearOnRender: true,
        transition: {
            duration: 0
        }
    });

    const client = window._keenClient;

    const fetchResultsAndRender = () => {
        client
        .query({
            event_collection: 'purchases',
            analysis_type: 'sum',
            timeframe: "this_30_days",
            target_property: 'total',
            interval: 'daily'
        })
        .then(function(res) {
            chart
            .render(res);
        })
        .catch(function(err) {
            chart
            .message(err.message);
        });
    }

    setInterval( () => {
        fetchResultsAndRender();
    }, intervalTime);

    fetchResultsAndRender();

}

function showAOV() {
    const chart = new KeenDataviz({
        container: '#chart-aov',
        type: 'area-spline',
        showLoadingSpinner: true,
        palette: 'autocollector',
        title: '',
        axis: {
            y: {
                tick: {
                    count: 5,
                    format: d => `$${Number.parseFloat(d).toFixed(2)}`
                }
            }
        },
        tooltip: {
            format: {
                value: d => typeof d === 'number' ? d.toFixed(2) : d,
            }
        },
        clearOnRender: true,
        transition: {
            duration: 0
        }
    });

    const client = window._keenClient;

    const fetchResultsAndRender = () => {
        client
        .query({
            analysis_type: 'average',
            eventCollection: "purchases",
            timeframe: "this_30_days",
            target_property: 'total',
            interval: 'weekly'
        })
        .then(function(res) {
            chart
            .render(res);
        })
        .catch(function(err) {
            chart
            .message(err.message);
        });
    }

    setInterval( () => {
        fetchResultsAndRender();
    }, intervalTime);

    fetchResultsAndRender();
}

function showConversionRate() {
    const chart = new KeenDataviz({
        container: '#conversion-rate',
        showLoadingSpinner: true,
        clearOnRender: true,
            transition: {
                duration: 0
            },
        type: 'funnel-3d',
        labelMapping: {
            first_visits: 'Demo Signup',
            purchases: 'Trial',
        },
        funnel: {
            percents: {
                show: true,
            },
        },
        palette: 'autocollector',
    });

    const client = window._keenClient;

    const fetchResultsAndRender = () => {
        client
        .query({
                analysis_type: 'funnel',
                interval: 'minutely',
                steps: [
                        {
                            event_collection: 'first_visits',
                            actor_property: 'user.uuid',
                        },
                        {
                            event_collection: 'purchases',
                            actor_property: 'user.uuid',
                        }
                ]
        })
        .then(function(res) {
            chart.render(res);
        })
        .catch(function(err) {
            chart
            .message(err.message);
        });
    }

    setInterval( () => {
        fetchResultsAndRender();
    }, intervalTime);

    fetchResultsAndRender();
}

function showRepeatPurchaseRate() {
    const chart = new KeenDataviz({
        container: '#repeat-purchasers',
        type: 'metric',
        showLoadingSpinner: true,
        palette: 'autocollector',
        suffix: "%",
        title: '',
        clearOnRender: true,
        transition: {
            duration: 0
        }
    });

    const client = window._keenClient;

    const fetchResultsAndRender = () => {
        client
            .query({
                analysis_type: 'count_unique',
                event_collection: 'purchases',
                target_property: 'cart_id',
                group_by: 'user.uuid'
            })
            .then(function(res) {
                const repeatPurchaser = res.result.filter(obj => obj.result > 1);
                const repeatPurchaserPercentage = pluck(repeatPurchaser, 'user.uuid').length / pluck(res.result, 'user.uuid').length;

                chart
                .render({ result: 100 * repeatPurchaserPercentage });
            })
            .catch(function(err) {
                chart
                .message(err.message);
            });
    }

    setInterval( () => {
        fetchResultsAndRender();
    }, intervalTime);

    fetchResultsAndRender();

}

function showMostPopularProducts() {
    const chart = new KeenDataviz({
        container: '#most-popular-products',
        type: 'donut',
        showLoadingSpinner: true,
        palette: 'autocollector',
        title: '',
        clearOnRender: true,
        transition: {
            duration: 0
        }
    });

    const client = window._keenClient;

    const fetchResultsAndRender = () => {
        client
            .query({
                analysis_type: 'count',
                event_collection: 'add_to_carts',
                group_by: 'product_name'
            })
            .then(function(res) {
                chart
                .render(res);
            })
            .catch(function(err) {
                chart
                .message(err.message);
            });
    }

    setInterval( () => {
        fetchResultsAndRender();
    }, intervalTime);

    fetchResultsAndRender();
}

function showMostViewedProducts() {
    const chart = new KeenDataviz({
        container: '#most-viewed-products',
        type: 'area-step',
        showLoadingSpinner: true,
        palette: 'autocollector',
        title: '',
        clearOnRender: true,
        transition: {
            duration: 0
        }
    });

    const client = window._keenClient;

    const fetchResultsAndRender = () => {
        client
            .query({
                analysis_type: 'count',
                event_collection: 'product_views',
                group_by: 'product_name',
                interval: 'daily',
                timeframe: "this_30_days",
            })
            .then(function(res) {
                chart
                .render(res);
            })
            .catch(function(err) {
                chart
                .message(err.message);
            });
    }

    setInterval( () => {
        fetchResultsAndRender();
    }, intervalTime);

    fetchResultsAndRender();
}
