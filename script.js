function generateResume() {
  // Get user inputs
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const summary = document.getElementById("summary").value;
  const experience = document.getElementById("experience").value;
  const education = document.getElementById("education").value;
  const skills = document.getElementById("skills").value;

  // Display resume
  document.getElementById("resumeName").textContent = name;
  document.getElementById("resumeContact").textContent = email + " | " + phone;
  document.getElementById("resumeSummary").textContent = summary;
  document.getElementById("resumeExperience").textContent = experience;
  document.getElementById("resumeEducation").textContent = education;
  document.getElementById("resumeSkills").textContent = skills;

  // Handle photo upload
  const photoInput = document.getElementById("photo");
  const resumePhoto = document.getElementById("resumePhoto");
  if (photoInput.files && photoInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      resumePhoto.src = e.target.result;
      resumePhoto.style.display = "block";
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    resumePhoto.style.display = "none";
  }

  // Show resume section
  document.getElementById("resumeOutput").style.display = "block";
}

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
