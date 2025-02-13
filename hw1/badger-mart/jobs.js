function submitApplication(e) {
    e.preventDefault(); // You can ignore this; prevents the default form submission!
    let jobs = document.getElementsByName("job");
    let appliedJob;
    for (let i = 0; i < jobs.length; i++) {
        if (jobs[i].checked) {
            appliedJob = jobs[i].value;
        }
    }
    // TODO: Alert the user of the job that they applied for!
    if (appliedJob != null) {
        alert("Thank you for applying to be a " + appliedJob + "!");
    } else {
        alert("Please select a job!");
    }
}