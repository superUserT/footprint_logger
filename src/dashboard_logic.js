"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Global chart references
let barChart, pieChart;
// Sample data for demo
const sampleData = [
    {
        name: "John Doe",
        date: "2023-11-15",
        dailyActivity: "carTravel",
        timestamp: "2023-11-15T10:30:00.000Z",
        vehicleType: "mediumCar",
        fuelType: "petrol",
        distance: "45.5",
        id: "1700037000000",
        co2: 5.46,
    },
    {
        name: "Jane Smith",
        date: "2023-11-14",
        dailyActivity: "electricityUse",
        timestamp: "2023-11-14T18:45:00.000Z",
        electricityUsage: "12.3",
        id: "1699950300000",
        co2: 6.15,
    },
    {
        name: "John Doe",
        date: "2023-11-13",
        dailyActivity: "meatConsumption",
        timestamp: "2023-11-13T12:30:00.000Z",
        meatType: "beef",
        meatQuantity: "250",
        id: "1699864200000",
        co2: 6.75,
    },
];
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    document.getElementById("refreshBtn").addEventListener("click", loadData);
});
function loadData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Show loading state
            document.getElementById("activitiesTableBody").innerHTML = `
            <tr>
              <td colspan="4" class="py-4 text-center text-gray-500">
                <div class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span class="ml-2">Loading data...</span>
              </td>
            </tr>
          `;
            // Use sample data for demo (replace with your API call)
            const activities = sampleData;
            updateDashboard(activities);
            // Original API call (commented out for demo)
            // const response = await fetch("http://localhost:3000/api/activities");
            // if (!response.ok) throw new Error("Failed to fetch data");
            // const activities = await response.json();
            // updateDashboard(activities);
        }
        catch (error) {
            console.error("Error:", error);
            document.getElementById("activitiesTableBody").innerHTML = `
            <tr>
              <td colspan="4" class="py-4 text-center text-red-500">Error loading data. Please try again.</td>
            </tr>
          `;
        }
    });
}
function updateDashboard(activities) {
    // Update summary cards
    document.getElementById("totalActivities").textContent = activities.length;
    // Calculate emissions
    const emissions = calculateEmissions(activities);
    document.getElementById("totalEmissions").textContent = `${emissions.total.toFixed(2)} kg`;
    // Find and display main source
    const mainSource = Object.entries(emissions.byCategory).reduce((a, b) => (a[1] > b[1] ? a : b), ["", 0]);
    document.getElementById("mainSource").textContent = formatCategoryName(mainSource[0]);
    document.getElementById("mainSourceValue").textContent = `${(mainSource[1] || 0).toFixed(2)} kg CO2`;
    // Render charts
    renderCharts(emissions.byCategory, emissions.total);
    // Render recent activities
    renderRecentActivities(activities);
}
function calculateEmissions(activities) {
    const emissionFactors = {
        carTravel: 0.12, // kg CO2 per km
        meatConsumption: {
            beef: 0.027,
            pork: 0.012,
            chicken: 0.006,
            fish: 0.005,
            lamb: 0.024,
        },
        electricityUse: 0.5, // kg CO2 per kWh
        hotShower: 0.002, // kg CO2 per liter
        watchTV: 0.05, // kg CO2 per hour
        orderedIn: 0.001, // kg CO2 per gram (assuming 500g meal)
    };
    const byCategory = {
        carTravel: 0,
        meatConsumption: 0,
        electricityUse: 0,
        hotShower: 0,
        watchTV: 0,
        orderedIn: 0,
    };
    activities.forEach((activity) => {
        let co2 = 0;
        switch (activity.dailyActivity) {
            case "carTravel":
                co2 = (parseFloat(activity.distance) || 0) * emissionFactors.carTravel;
                break;
            case "meatConsumption":
                const meatType = activity.meatType || "beef";
                const meatFactor = emissionFactors.meatConsumption[meatType] || 0;
                co2 = (parseFloat(activity.meatQuantity) || 0) * meatFactor;
                break;
            case "electricityUse":
                co2 =
                    (parseFloat(activity.electricityUsage) || 0) *
                        emissionFactors.electricityUse;
                break;
            case "hotShower":
                const flowRate = activity.waterFlowRate === "low"
                    ? 6
                    : activity.waterFlowRate === "medium"
                        ? 9
                        : 11;
                co2 =
                    (parseFloat(activity.showerDuration) || 0) *
                        flowRate *
                        emissionFactors.hotShower;
                break;
            case "watchTV":
                co2 = (parseFloat(activity.tvDuration) || 0) * emissionFactors.watchTV;
                break;
            case "orderedIn":
                co2 = 500 * emissionFactors.orderedIn; // Assuming 500g meal
                break;
        }
        byCategory[activity.dailyActivity] += co2;
        activity.co2 = co2; // Attach CO2 value to activity
    });
    return {
        total: Object.values(byCategory).reduce((sum, val) => sum + val, 0),
        byCategory,
    };
}
function renderCharts(emissionsData, totalEmissions) {
    const categories = Object.keys(emissionsData).map(formatCategoryName);
    const data = Object.values(emissionsData);
    const backgroundColors = [
        "rgba(255, 99, 132, 0.7)",
        "rgba(54, 162, 235, 0.7)",
        "rgba(255, 206, 86, 0.7)",
        "rgba(75, 192, 192, 0.7)",
        "rgba(153, 102, 255, 0.7)",
        "rgba(255, 159, 64, 0.7)",
    ];
    // Destroy existing charts if they exist
    if (barChart)
        barChart.destroy();
    if (pieChart)
        pieChart.destroy();
    // Bar Chart
    const barCtx = document.getElementById("barChart").getContext("2d");
    barChart = new Chart(barCtx, {
        type: "bar",
        data: {
            labels: categories,
            datasets: [
                {
                    label: "CO2 Emissions (kg)",
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map((c) => c.replace("0.7", "1")),
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Kilograms of CO2",
                    },
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.parsed.y.toFixed(2)} kg CO2`;
                        },
                    },
                },
            },
        },
    });
    // Pie Chart
    const pieCtx = document.getElementById("pieChart").getContext("2d");
    pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: categories,
            datasets: [
                {
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "right",
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw || 0;
                            const percentage = ((value / totalEmissions) * 100).toFixed(1);
                            return `${context.label}: ${value.toFixed(2)} kg (${percentage}%)`;
                        },
                    },
                },
            },
        },
    });
}
function renderRecentActivities(activities) {
    const tbody = document.getElementById("activitiesTableBody");
    const recent = activities.slice().reverse().slice(0, 10); // Show 10 most recent
    if (recent.length === 0) {
        tbody.innerHTML = `
            <tr>
              <td colspan="4" class="py-4 text-center text-gray-500">No activities recorded yet</td>
            </tr>
          `;
        return;
    }
    tbody.innerHTML = recent
        .map((activity) => `
          <tr class="hover:bg-gray-50">
            <td class="py-3 px-4 whitespace-nowrap text-sm text-gray-900">${activity.date || "-"}</td>
            <td class="py-3 px-4 whitespace-nowrap text-sm text-gray-900">
              <span class="px-2 py-1 rounded-full text-xs font-medium 
                ${getActivityColor(activity.dailyActivity)}">
                ${formatCategoryName(activity.dailyActivity)}
              </span>
            </td>
            <td class="py-3 px-4 text-sm text-gray-500">${getActivityDetails(activity)}</td>
            <td class="py-3 px-4 whitespace-nowrap text-sm font-medium 
              ${activity.co2 > 5
        ? "text-red-600"
        : activity.co2 > 2
            ? "text-orange-600"
            : "text-green-600"}">
              ${(activity.co2 || 0).toFixed(2)} kg
            </td>
          </tr>
        `)
        .join("");
}
function formatCategoryName(category) {
    const names = {
        carTravel: "Car Travel",
        meatConsumption: "Meat",
        electricityUse: "Electricity",
        hotShower: "Hot Shower",
        watchTV: "TV",
        orderedIn: "Food Delivery",
    };
    return names[category] || category;
}
function getActivityColor(activity) {
    const colors = {
        carTravel: "bg-red-100 text-red-800",
        meatConsumption: "bg-orange-100 text-orange-800",
        electricityUse: "bg-blue-100 text-blue-800",
        hotShower: "bg-green-100 text-green-800",
        watchTV: "bg-purple-100 text-purple-800",
        orderedIn: "bg-yellow-100 text-yellow-800",
    };
    return colors[activity] || "bg-gray-100 text-gray-800";
}
function getActivityDetails(activity) {
    switch (activity.dailyActivity) {
        case "carTravel":
            return `${activity.distance || "?"} km • ${activity.vehicleType || ""} (${activity.fuelType || ""})`;
        case "meatConsumption":
            return `${activity.meatQuantity || "?"}g ${activity.meatType || ""}`;
        case "electricityUse":
            return `${activity.electricityUsage || "?"} kWh used`;
        case "hotShower":
            return `${activity.showerDuration || "?"} min • ${activity.waterFlowRate || ""} flow`;
        case "watchTV":
            return `${activity.tvDuration || "?"} hrs • ${activity.tvType || ""}`;
        case "orderedIn":
            return `${activity.foodType || ""} (${activity.packagingType || ""})`;
        default:
            return "No details";
    }
}
