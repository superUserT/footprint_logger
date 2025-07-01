document.addEventListener("DOMContentLoaded", function () {
  // Get data from localStorage
  const activities = JSON.parse(localStorage.getItem("carbonActivities")) || [];

  // Calculate emissions by category
  const emissionsByCategory = {
    carTravel: 0,
    meatConsumption: 0,
    electricityUse: 0,
    hotShower: 0,
    watchTV: 0,
    orderedIn: 0,
  };

  // Emission factors (kg CO2 per unit)
  const emissionFactors = {
    carTravel: 0.12, // per km (average)
    meatConsumption: {
      beef: 0.027, // per gram
      pork: 0.012,
      chicken: 0.006,
      fish: 0.005,
      lamb: 0.024,
    },
    electricityUse: 0.5, // per kWh (average)
    hotShower: 0.002, // per liter of hot water
    watchTV: 0.05, // per hour (average)
    orderedIn: 0.001, // per gram of food (average)
  };

  // Process activities and calculate emissions
  activities.forEach((activity) => {
    let co2 = 0;

    switch (activity.dailyActivity) {
      case "carTravel":
        const distance = parseFloat(activity.distance) || 0;
        co2 = distance * emissionFactors.carTravel;
        emissionsByCategory.carTravel += co2;
        break;

      case "meatConsumption":
        const meatType = activity.meatType;
        const quantity = parseFloat(activity.meatQuantity) || 0;
        if (meatType && emissionFactors.meatConsumption[meatType]) {
          co2 = quantity * emissionFactors.meatConsumption[meatType];
          emissionsByCategory.meatConsumption += co2;
        }
        break;

      case "electricityUse":
        const usage = parseFloat(activity.electricityUsage) || 0;
        co2 = usage * emissionFactors.electricityUse;
        emissionsByCategory.electricityUse += co2;
        break;

      case "hotShower":
        const duration = parseFloat(activity.showerDuration) || 0;
        const flowRate =
          activity.waterFlowRate === "low"
            ? 6
            : activity.waterFlowRate === "medium"
            ? 9
            : 11;
        const liters = duration * flowRate;
        co2 = liters * emissionFactors.hotShower;
        emissionsByCategory.hotShower += co2;
        break;

      case "watchTV":
        const tvDuration = parseFloat(activity.tvDuration) || 0;
        co2 = tvDuration * emissionFactors.watchTV;
        emissionsByCategory.watchTV += co2;
        break;

      case "orderedIn":
        const foodWeight = 500; // assuming average meal weight
        co2 = foodWeight * emissionFactors.orderedIn;
        emissionsByCategory.orderedIn += co2;
        break;
    }

    // Add CO2 to activity object for display
    activity.co2 = co2.toFixed(2);
  });

  // Calculate totals
  const totalEmissions = Object.values(emissionsByCategory).reduce(
    (a, b) => a + b,
    0
  );
  const avgDailyEmissions =
    activities.length > 0 ? totalEmissions / activities.length : 0;

  // Update summary cards
  document.getElementById(
    "totalEmissions"
  ).textContent = `${totalEmissions.toFixed(2)} kg`;
  document.getElementById(
    "avgDailyEmissions"
  ).textContent = `${avgDailyEmissions.toFixed(2)} kg`;

  // Find main source
  const mainSource = Object.entries(emissionsByCategory).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );
  document.getElementById("mainSource").textContent = formatCategoryName(
    mainSource[0]
  );

  // Prepare chart data
  const categories = Object.keys(emissionsByCategory).map(formatCategoryName);
  const emissionsData = Object.values(emissionsByCategory);

  // Colors for charts
  const backgroundColors = [
    "rgba(255, 99, 132, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(255, 159, 64, 0.7)",
  ];

  // Create Bar Chart
  const barCtx = document.getElementById("barChart").getContext("2d");
  new Chart(barCtx, {
    type: "bar",
    data: {
      labels: categories,
      datasets: [
        {
          label: "CO2 Emissions (kg)",
          data: emissionsData,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map((c) => c.replace("0.7", "1")),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "kg CO2",
          },
        },
      },
    },
  });

  // Create Pie Chart
  const pieCtx = document.getElementById("pieChart").getContext("2d");
  new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: categories,
      datasets: [
        {
          data: emissionsData,
          backgroundColor: backgroundColors,
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw || 0;
              const percentage = Math.round((value / totalEmissions) * 100);
              return `${label}: ${value.toFixed(2)} kg (${percentage}%)`;
            },
          },
        },
      },
    },
  });

  // Populate recent activities table
  const recentActivitiesTable = document.getElementById("recentActivities");
  const recentActivities = activities.slice(-5).reverse(); // Show last 5, newest first

  if (recentActivities.length === 0) {
    recentActivitiesTable.innerHTML = `
            <tr>
              <td colspan="4" class="py-4 px-4 border-b border-gray-200 text-center text-gray-500">
                No activities recorded yet
              </td>
            </tr>
          `;
  } else {
    recentActivitiesTable.innerHTML = recentActivities
      .map(
        (activity) => `
            <tr>
              <td class="py-2 px-4 border-b border-gray-200">${
                activity.date
              }</td>
              <td class="py-2 px-4 border-b border-gray-200">${formatCategoryName(
                activity.dailyActivity
              )}</td>
              <td class="py-2 px-4 border-b border-gray-200">${getActivityDetails(
                activity
              )}</td>
              <td class="py-2 px-4 border-b border-gray-200">${
                activity.co2
              }</td>
            </tr>
          `
      )
      .join("");
  }
});

// Helper function to format category names for display
function formatCategoryName(category) {
  const names = {
    carTravel: "Car Travel",
    meatConsumption: "Meat Consumption",
    electricityUse: "Electricity Use",
    hotShower: "Hot Shower",
    watchTV: "TV Watching",
    orderedIn: "Food Delivery",
  };
  return names[category] || category;
}

// Helper function to get activity details for display
function getActivityDetails(activity) {
  switch (activity.dailyActivity) {
    case "carTravel":
      return `${activity.distance} km (${activity.vehicleType}, ${activity.fuelType})`;
    case "meatConsumption":
      return `${activity.meatQuantity}g ${activity.meatType}`;
    case "electricityUse":
      return `${activity.electricityUsage} kWh`;
    case "hotShower":
      return `${activity.showerDuration} min (${activity.waterFlowRate} flow)`;
    case "watchTV":
      return `${activity.tvDuration} hours (${activity.tvType})`;
    case "orderedIn":
      return `${activity.foodType} (${activity.packagingType} packaging)`;
    default:
      return "-";
  }
}
