"use strict";
const email = "{{ email }}";
function showActivityDetails(activity) {
    document.querySelectorAll(".activity-details").forEach((el) => {
        el.style.display = "none";
    });
    if (activity) {
        const detailsElement = document.getElementById(`${activity}Details`);
        if (detailsElement) {
            detailsElement.style.display = "block";
        }
    }
}
