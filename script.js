
"use strict";

/* ==========================================
   E-COMMERCE SALES ANALYTICS DASHBOARD
   JavaScript + Chart.js
========================================== */

// Illustrative demo data — replace with real sales data later.
const orders = [
    { id: "EC1001", date: "2026-01-05", product: "Wireless Headphones", category: "Electronics", quantity: 2, revenue: 4000, profit: 900, region: "West" },
    { id: "EC1002", date: "2026-01-12", product: "Cotton T-shirt", category: "Fashion", quantity: 3, revenue: 2400, profit: 600, region: "North" },
    { id: "EC1003", date: "2026-01-19", product: "Desk Lamp", category: "Home & Kitchen", quantity: 2, revenue: 3000, profit: 720, region: "South" },
    { id: "EC1004", date: "2026-02-03", product: "Face Serum", category: "Beauty", quantity: 4, revenue: 3200, profit: 960, region: "East" },
    { id: "EC1005", date: "2026-02-11", product: "Bluetooth Speaker", category: "Electronics", quantity: 1, revenue: 3500, profit: 700, region: "North" },
    { id: "EC1006", date: "2026-02-22", product: "Yoga Mat", category: "Sports", quantity: 2, revenue: 1800, profit: 450, region: "West" },
    { id: "EC1007", date: "2026-03-04", product: "Running Shoes", category: "Fashion", quantity: 2, revenue: 6000, profit: 1500, region: "East" },
    { id: "EC1008", date: "2026-03-17", product: "Storage Set", category: "Home & Kitchen", quantity: 3, revenue: 2700, profit: 540, region: "South" },
    { id: "EC1009", date: "2026-03-26", product: "Smart Watch", category: "Electronics", quantity: 2, revenue: 9000, profit: 1800, region: "West" },
    { id: "EC1010", date: "2026-04-02", product: "Moisturizer", category: "Beauty", quantity: 5, revenue: 2500, profit: 750, region: "North" },
    { id: "EC1011", date: "2026-04-14", product: "Sports Bottle", category: "Sports", quantity: 4, revenue: 2000, profit: 500, region: "South" },
    { id: "EC1012", date: "2026-04-27", product: "Denim Jeans", category: "Fashion", quantity: 2, revenue: 5000, profit: 1250, region: "West" },
    { id: "EC1013", date: "2026-05-06", product: "Mechanical Keyboard", category: "Electronics", quantity: 2, revenue: 7000, profit: 1400, region: "East" },
    { id: "EC1014", date: "2026-05-15", product: "Cookware Set", category: "Home & Kitchen", quantity: 1, revenue: 4500, profit: 900, region: "North" },
    { id: "EC1015", date: "2026-05-23", product: "Lip Tint", category: "Beauty", quantity: 6, revenue: 1800, profit: 540, region: "West" },
    { id: "EC1016", date: "2026-06-03", product: "Fitness Band", category: "Sports", quantity: 3, revenue: 5400, profit: 1350, region: "East" },
    { id: "EC1017", date: "2026-06-12", product: "Laptop Stand", category: "Electronics", quantity: 3, revenue: 6000, profit: 1500, region: "South" },
    { id: "EC1018", date: "2026-06-20", product: "Casual Sneakers", category: "Fashion", quantity: 2, revenue: 5200, profit: 1300, region: "North" },
    { id: "EC1019", date: "2026-06-25", product: "Blender", category: "Home & Kitchen", quantity: 2, revenue: 6400, profit: 1280, region: "West" },
    { id: "EC1020", date: "2026-06-28", product: "Sunscreen", category: "Beauty", quantity: 5, revenue: 2750, profit: 825, region: "South" }
];

const months = [
    { key: "2026-01", label: "Jan" },
    { key: "2026-02", label: "Feb" },
    { key: "2026-03", label: "Mar" },
    { key: "2026-04", label: "Apr" },
    { key: "2026-05", label: "May" },
    { key: "2026-06", label: "Jun" }
];

const categories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty",
    "Sports"
];

const regions = ["North", "South", "East", "West"];

const colors = [
    "#4169f5",
    "#8b5cf6",
    "#159b91",
    "#ed9a32",
    "#dc648b"
];

const money = value =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value);

const sum = (items, property) =>
    items.reduce((total, item) => total + item[property], 0);

const monthKey = date => date.slice(0, 7);

const $ = id => document.getElementById(id);

let trendChart;
let categoryChart;
let regionChart;


// ==========================================
// FILTER RECORDS
// ==========================================

function getFilteredOrders() {
    const category = $("category").value;
    const region = $("region").value;
    const period = $("period").value;

    return orders.filter(order => {
        const month = Number(order.date.slice(5, 7));

        const categoryMatch =
            category === "all" || order.category === category;

        const regionMatch =
            region === "all" || order.region === region;

        const periodMatch =
            period === "all" ||
            (period === "Q1" && month >= 1 && month <= 3) ||
            (period === "Q2" && month >= 4 && month <= 6);

        return categoryMatch && regionMatch && periodMatch;
    });
}


// ==========================================
// KPI CARDS
// ==========================================

function renderKPIs(items) {
    const revenue = sum(items, "revenue");
    const units = sum(items, "quantity");

    $("totalRevenue").textContent = money(revenue);

    $("totalOrders").textContent =
        items.length.toLocaleString("en-IN");

    $("averageOrderValue").textContent =
        money(items.length ? revenue / items.length : 0);

    $("totalUnits").textContent =
        units.toLocaleString("en-IN");
}


// ==========================================
// ORDER TABLE + SEARCH
// ==========================================

function renderTable(items) {
    const search = $("orderSearch").value
        .trim()
        .toLowerCase();

    const visibleOrders = items.filter(order =>
        [
            order.id,
            order.date,
            order.product,
            order.category,
            order.region
        ].some(value =>
            String(value).toLowerCase().includes(search)
        )
    );

    const tableBody = $("ordersTableBody");
    tableBody.replaceChildren();

    if (visibleOrders.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 8;
        cell.textContent = "No matching records found.";

        row.appendChild(cell);
        tableBody.appendChild(row);
    }

    visibleOrders.forEach(order => {
        const row = document.createElement("tr");

        const values = [
            order.id,
            order.date,
            order.product,
            order.category,
            order.quantity,
            money(order.revenue),
            money(order.profit),
            order.region
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    $("recordCount").textContent =
        `${visibleOrders.length} record${visibleOrders.length === 1 ? "" : "s"}`;
}


// ==========================================
// BUSINESS INSIGHTS
// ==========================================

function renderInsights(items) {
    function getTopItem(property, values) {
        return values
            .map(name => ({
                name,
                revenue: sum(
                    items.filter(order => order[property] === name),
                    "revenue"
                )
            }))
            .sort((a, b) => b.revenue - a.revenue)[0];
    }

    const topCategory = getTopItem("category", categories);
    const topRegion = getTopItem("region", regions);

    const bestMonth = months
        .map(month => ({
            name: month.label,
            revenue: sum(
                items.filter(order =>
                    monthKey(order.date) === month.key
                ),
                "revenue"
            )
        }))
        .sort((a, b) => b.revenue - a.revenue)[0];

    $("topCategoryInsight").textContent =
        topCategory.revenue
            ? `${topCategory.name} leads with ${money(topCategory.revenue)} revenue.`
            : "No category sales match these filters.";

    $("topRegionInsight").textContent =
        topRegion.revenue
            ? `${topRegion.name} leads with ${money(topRegion.revenue)} revenue.`
            : "No regional sales match these filters.";

    $("bestMonthInsight").textContent =
        bestMonth.revenue
            ? `${bestMonth.name} has the highest selected revenue: ${money(bestMonth.revenue)}.`
            : "No monthly sales match these filters.";
}


// ==========================================
// UPDATE CHARTS
// ==========================================

function renderCharts(items) {
    // Monthly revenue and profit
    trendChart.data.datasets[0].data = months.map(month =>
        sum(
            items.filter(order =>
                monthKey(order.date) === month.key
            ),
            "revenue"
        )
    );

    trendChart.data.datasets[1].data = months.map(month =>
        sum(
            items.filter(order =>
                monthKey(order.date) === month.key
            ),
            "profit"
        )
    );

    trendChart.update();

    // Revenue by category
    categoryChart.data.datasets[0].data = categories.map(category =>
        sum(
            items.filter(order => order.category === category),
            "revenue"
        )
    );

    categoryChart.update();

    // Revenue by region
    regionChart.data.datasets[0].data = regions.map(region =>
        sum(
            items.filter(order => order.region === region),
            "revenue"
        )
    );

    regionChart.update();
}


// ==========================================
// UPDATE WHOLE DASHBOARD
// ==========================================

function updateDashboard() {
    const items = getFilteredOrders();

    renderKPIs(items);
    renderCharts(items);
    renderInsights(items);
    renderTable(items);

    const category =
        $("category").selectedOptions[0].text;

    const region =
        $("region").selectedOptions[0].text;

    const period =
        $("period").selectedOptions[0].text;

    $("filterMessage").textContent =
        `Showing ${items.length} demo orders · ${category} · ${region} · ${period}.`;

    $("periodLabel").textContent =
        $("period").value === "Q1"
            ? "JAN — MAR 2026"
            : $("period").value === "Q2"
                ? "APR — JUN 2026"
                : "JAN — JUN 2026";
}


// ==========================================
// INITIALIZE CHART.JS
// ==========================================

function initializeCharts() {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 18
                }
            }
        },

        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#77839a" }
            },

            y: {
                beginAtZero: true,
                grid: { color: "#edf0f6" },

                ticks: {
                    color: "#77839a",
                    callback: value => money(value)
                }
            }
        }
    };

    // Chart 1: Monthly revenue and profit
    trendChart = new Chart($("salesTrendChart"), {
        type: "line",

        data: {
            labels: months.map(month => month.label),

            datasets: [
                {
                    label: "Revenue",
                    data: [],
                    borderColor: "#4169f5",
                    backgroundColor: "rgba(65,105,245,0.09)",
                    borderWidth: 3,
                    pointRadius: 4,
                    tension: 0.35,
                    fill: true
                },
                {
                    label: "Profit",
                    data: [],
                    borderColor: "#159b77",
                    backgroundColor: "rgba(21,155,119,0.08)",
                    borderWidth: 3,
                    pointRadius: 4,
                    tension: 0.35,
                    fill: false
                }
            ]
        },

        options: {
            ...commonOptions,

            interaction: {
                mode: "index",
                intersect: false
            },

            plugins: {
                ...commonOptions.plugins,

                tooltip: {
                    callbacks: {
                        label: context =>
                            `${context.dataset.label}: ${money(context.raw)}`
                    }
                }
            }
        }
    });


    // Chart 2: Revenue by category
    categoryChart = new Chart($("categoryRevenueChart"), {
        type: "bar",

        data: {
            labels: categories,

            datasets: [{
                label: "Revenue",
                data: [],
                backgroundColor: colors,
                borderRadius: 6,
                maxBarThickness: 45
            }]
        },

        options: {
            ...commonOptions,

            plugins: {
                ...commonOptions.plugins,

                legend: { display: false },

                tooltip: {
                    callbacks: {
                        label: context => money(context.raw)
                    }
                }
            }
        }
    });


    // Chart 3: Revenue by region
    regionChart = new Chart($("regionChart"), {
        type: "doughnut",

        data: {
            labels: regions,

            datasets: [{
                data: [],
                backgroundColor: [
                    "#4169f5",
                    "#159b91",
                    "#ed9a32",
                    "#8b5cf6"
                ],
                borderColor: "#ffffff",
                borderWidth: 4,
                hoverOffset: 6
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",

            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8,
                        padding: 17
                    }
                },

                tooltip: {
                    callbacks: {
                        label: context =>
                            `${context.label}: ${money(context.raw)}`
                    }
                }
            }
        }
    });
}


// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    if (typeof Chart === "undefined") {
        document.querySelectorAll(".chart-box").forEach(box => {
            box.textContent =
                "Chart.js could not load. Check your internet connection.";
        });
        return;
    }

    initializeCharts();

    $("salesFilterForm").addEventListener("submit", event => {
        event.preventDefault();
        updateDashboard();
    });

    $("resetFilters").addEventListener("click", () => {
        $("category").value = "all";
        $("region").value = "all";
        $("period").value = "all";
        $("orderSearch").value = "";

        updateDashboard();
    });

    $("orderSearch").addEventListener("input", () => {
        renderTable(getFilteredOrders());
    });

    document.querySelectorAll(".sidebar nav a").forEach(link => {
        link.addEventListener("click", () => {
            document.querySelectorAll(".sidebar nav a").forEach(item => {
                item.classList.remove("active");
            });

            link.classList.add("active");
        });
    });

    updateDashboard();
});
