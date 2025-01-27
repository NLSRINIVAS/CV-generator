function downloadPDF() {
    // Access jsPDF from the global window object
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get content from the resume
    const name = document.getElementById("resumeName").textContent;
    const contact = document.getElementById("resumeContact").textContent;
    const summary = document.getElementById("resumeSummary").textContent;
    const experience = document.getElementById("resumeExperience").textContent;
    const education = document.getElementById("resumeEducation").textContent;
    const skills = document.getElementById("resumeSkills").textContent;

    // Add content to the PDF
    doc.text("Name: " + name, 10, 10);
    doc.text("Contact: " + contact, 10, 20);
    doc.text("Summary: " + summary, 10, 30);
    doc.text("Experience: " + experience, 10, 40);
    doc.text("Education: " + education, 10, 50);
    doc.text("Skills: " + skills, 10, 60);

    // Save the PDF
    doc.save("resume.pdf");
}