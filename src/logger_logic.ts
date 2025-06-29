const email: string = "{{ email }}";

function showActivityDetails(activity: any): void {
  document.querySelectorAll(".activity-details").forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });

  if (activity) {
    const detailsElement = document.getElementById(`${activity}Details`);
    if (detailsElement) {
      detailsElement.style.display = "block";
    }
  }
}
