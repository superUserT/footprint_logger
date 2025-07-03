function showActivityDetails(activity: string) {
  document.querySelectorAll(".activity-details").forEach((el) => {
    el.setAttribute("style", "display: none");
    el.querySelectorAll("input, select").forEach((field) => {
      field.removeAttribute("required");
    });
  });

  const detailsElement = document.getElementById(`${activity}Details`);
  if (detailsElement) {
    detailsElement.style.display = "block";
    detailsElement.querySelectorAll("input, select").forEach((field) => {
      field.setAttribute("required", "required");
    });
  }
}

function getActivitySpecificData() {
  const activity = (
    document.getElementById("dailyActivity") as HTMLSelectElement
  ).value;
  const data: any = {};

  switch (activity) {
    case "carTravel":
      const vehicleType = document.querySelector(
        '[name="vehicleType"]'
      ) as HTMLSelectElement;
      const fuelType = document.querySelector(
        '[name="fuelType"]'
      ) as HTMLSelectElement;
      const distance = document.querySelector(
        '[name="distance"]'
      ) as HTMLInputElement;

      if (!vehicleType.value || !fuelType.value || !distance.value) {
        throw new Error("Please fill in all car travel details");
      }

      data.vehicleType = vehicleType.value;
      data.fuelType = fuelType.value;
      data.distance = parseFloat(distance.value);
      break;

    case "meatConsumption":
      const meatType = document.querySelector(
        '[name="meatType"]'
      ) as HTMLSelectElement;
      const meatQuantity = document.querySelector(
        '[name="meatQuantity"]'
      ) as HTMLInputElement;

      if (!meatType.value || !meatQuantity.value) {
        throw new Error("Please fill in all meat consumption details");
      }

      data.meatType = meatType.value;
      data.meatQuantity = parseInt(meatQuantity.value);
      break;

    case "electricityUse":
      const electricityUsage = document.querySelector(
        '[name="electricityUsage"]'
      ) as HTMLInputElement;
      if (!electricityUsage.value) {
        throw new Error("Please fill in electricity usage");
      }

      data.electricityUsage = parseFloat(electricityUsage.value);
      break;

    case "hotShower":
      const showerDuration = document.querySelector(
        '[name="showerDuration"]'
      ) as HTMLInputElement;
      const waterFlowRate = document.querySelector(
        '[name="waterFlowRate"]'
      ) as HTMLSelectElement;

      if (!showerDuration.value || !waterFlowRate.value) {
        throw new Error("Please fill in all shower details");
      }

      data.showerDuration = parseInt(showerDuration.value);
      data.waterFlowRate = waterFlowRate.value;
      break;

    case "watchTV":
      const tvType = document.querySelector(
        '[name="tvType"]'
      ) as HTMLSelectElement;
      const tvDuration = document.querySelector(
        '[name="tvDuration"]'
      ) as HTMLInputElement;

      if (!tvType.value || !tvDuration.value) {
        throw new Error("Please fill in all TV watching details");
      }

      data.tvType = tvType.value;
      data.tvDuration = parseFloat(tvDuration.value);
      break;

    case "orderedIn":
      const foodType = document.querySelector(
        '[name="foodType"]'
      ) as HTMLSelectElement;
      const packagingType = document.querySelector(
        '[name="packagingType"]'
      ) as HTMLSelectElement;

      if (!foodType.value || !packagingType.value) {
        throw new Error("Please fill in all ordering details");
      }

      data.foodType = foodType.value;
      data.packagingType = packagingType.value;
      break;
  }

  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dailyStandupForm") as HTMLFormElement;
  const submitButton = document.getElementById(
    "submitDailyStandup"
  ) as HTMLButtonElement;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      name: (document.getElementById("name") as HTMLInputElement).value,
      date: (document.getElementById("date") as HTMLInputElement).value,
      dailyActivity: (
        document.getElementById("dailyActivity") as HTMLSelectElement
      ).value,
      timestamp: new Date().toISOString(),
      ...getActivitySpecificData(),
    };

    if (!formData.name || !formData.date || !formData.dailyActivity) {
      alert("Please fill in all required fields");
      return;
    }

    const originalText = submitButton.textContent || "Submit";
    submitButton.textContent = "Submitting...";
    submitButton.disabled = true;

    try {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Activity saved successfully!");
        form.reset();
        document.querySelectorAll(".activity-details").forEach((el) => {
          (el as HTMLElement).style.display = "none";
        });
      } else {
        throw new Error(await response.text());
      }
    } catch (error: any) {
      alert("Error saving activity: " + error.message);
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
});
