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
function showActivityDetails(activity) {
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
    const activity = document.getElementById("dailyActivity").value;
    const data = {};
    switch (activity) {
        case "carTravel":
            const vehicleType = document.querySelector('[name="vehicleType"]');
            const fuelType = document.querySelector('[name="fuelType"]');
            const distance = document.querySelector('[name="distance"]');
            if (!vehicleType.value || !fuelType.value || !distance.value) {
                throw new Error("Please fill in all car travel details");
            }
            data.vehicleType = vehicleType.value;
            data.fuelType = fuelType.value;
            data.distance = parseFloat(distance.value);
            break;
        case "meatConsumption":
            const meatType = document.querySelector('[name="meatType"]');
            const meatQuantity = document.querySelector('[name="meatQuantity"]');
            if (!meatType.value || !meatQuantity.value) {
                throw new Error("Please fill in all meat consumption details");
            }
            data.meatType = meatType.value;
            data.meatQuantity = parseInt(meatQuantity.value);
            break;
        case "electricityUse":
            const electricityUsage = document.querySelector('[name="electricityUsage"]');
            if (!electricityUsage.value) {
                throw new Error("Please fill in electricity usage");
            }
            data.electricityUsage = parseFloat(electricityUsage.value);
            break;
        case "hotShower":
            const showerDuration = document.querySelector('[name="showerDuration"]');
            const waterFlowRate = document.querySelector('[name="waterFlowRate"]');
            if (!showerDuration.value || !waterFlowRate.value) {
                throw new Error("Please fill in all shower details");
            }
            data.showerDuration = parseInt(showerDuration.value);
            data.waterFlowRate = waterFlowRate.value;
            break;
        case "watchTV":
            const tvType = document.querySelector('[name="tvType"]');
            const tvDuration = document.querySelector('[name="tvDuration"]');
            if (!tvType.value || !tvDuration.value) {
                throw new Error("Please fill in all TV watching details");
            }
            data.tvType = tvType.value;
            data.tvDuration = parseFloat(tvDuration.value);
            break;
        case "orderedIn":
            const foodType = document.querySelector('[name="foodType"]');
            const packagingType = document.querySelector('[name="packagingType"]');
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
    const form = document.getElementById("dailyStandupForm");
    const submitButton = document.getElementById("submitDailyStandup");
    form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const formData = Object.assign({ name: document.getElementById("name").value, date: document.getElementById("date").value, dailyActivity: document.getElementById("dailyActivity").value, timestamp: new Date().toISOString() }, getActivitySpecificData());
        if (!formData.name || !formData.date || !formData.dailyActivity) {
            alert("Please fill in all required fields");
            return;
        }
        const originalText = submitButton.textContent || "Submit";
        submitButton.textContent = "Submitting...";
        submitButton.disabled = true;
        try {
            const response = yield fetch("/api/activities", {
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
                    el.style.display = "none";
                });
            }
            else {
                throw new Error(yield response.text());
            }
        }
        catch (error) {
            alert("Error saving activity: " + error.message);
        }
        finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }));
});
