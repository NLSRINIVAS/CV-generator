document.querySelector('.generate-btn').addEventListener('click', generateResume);

// Icon loader with fallback sources
async function loadIcon(urls) {
    try {
        for (const url of urls) {
            const response = await fetch(url);
            if (response.ok) {
                const blob = await response.blob();
                return await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            }
        }
        return null;
    } catch (error) {
        console.error('Error loading icon:', error);
        return null;
    }
}

async function generateResume() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Get form values
    const formElements = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        countryCode: document.getElementById('countryCode').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value,
        experience: document.getElementById('experience').value,
        education: document.getElementById('education').value,
        skills: document.getElementById('skills').value,
        hobbies: document.getElementById('hobbies').value,
        languages: document.getElementById('languages').value,
        summary: document.getElementById('summary').value,
        photo: document.getElementById('photo').files[0]
    };

    // Set dimensions
    const margin = 15;
    let yPos = margin;
    const pageWidth = 210;
    const iconSize = 6;
    const lineHeight = 7;

    // Load icons with multiple CDN fallbacks
    const [linkedinIcon, githubIcon, emailIcon] = await Promise.all([
        loadIcon([
            'https://cdn-icons-png.flaticon.com/512/174/174857.png',
            'https://img.icons8.com/color/512/linkedin.png'
        ]),
        loadIcon([
            'https://cdn-icons-png.flaticon.com/512/25/25231.png',
            'https://img.icons8.com/ios-glyphs/512/github.png'
        ]),
        loadIcon([
            'https://cdn-icons-png.flaticon.com/512/281/281769.png',
            'https://img.icons8.com/ios-filled/512/email.png'
        ])
    ]);

    // Create document frame
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(margin, margin, pageWidth - margin*2, 280);

    // Profile Section
    if(formElements.photo) {
        const reader = new FileReader();
        await new Promise((resolve) => {
            reader.onload = async function(e) {
                const img = new Image();
                img.src = e.target.result;
                await img.decode();
                
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = canvas.height = 100;
                
                // Create circular mask
                ctx.beginPath();
                ctx.arc(50, 50, 50, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                
                ctx.drawImage(img, 0, 0, 100, 100);
                doc.addImage(canvas.toDataURL(), 'PNG', margin, yPos, 30, 30);
                resolve();
            };
            reader.readAsDataURL(formElements.photo);
        });
    }

    // Name and Contact Info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    const nameX = margin + (formElements.photo ? 40 : 0);
    doc.text(formElements.name, nameX, yPos + 10);

    // Contact Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const contactText = `${formElements.email} | ${formElements.countryCode}${formElements.phone}`;
    doc.textWithLink(contactText, nameX, yPos + 18, {
        url: `tel:${formElements.countryCode}${formElements.phone}`,
        align: 'left'
    });

    // Social Icons
    const socialStartX = pageWidth - margin - 40;
    let iconOffset = 0;
    
    if(formElements.linkedin && linkedinIcon) {
        doc.addImage(linkedinIcon, 'PNG', socialStartX + iconOffset, yPos + 5, iconSize, iconSize);
        doc.link(socialStartX + iconOffset, yPos + 5, iconSize, iconSize, {
            url: formElements.linkedin
        });
        iconOffset += 12;
    }

    if(formElements.github && githubIcon) {
        doc.addImage(githubIcon, 'PNG', socialStartX + iconOffset, yPos + 5, iconSize, iconSize);
        doc.link(socialStartX + iconOffset, yPos + 5, iconSize, iconSize, {
            url: formElements.github
        });
        iconOffset += 12;
    }

    if(formElements.email && emailIcon) {
        doc.addImage(emailIcon, 'PNG', socialStartX + iconOffset, yPos + 5, iconSize, iconSize);
        doc.link(socialStartX + iconOffset, yPos + 5, iconSize, iconSize, {
            url: `mailto:${formElements.email}`
        });
    }

    yPos += 40;

    // Section Separator
    doc.setLineWidth(0.8);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Professional Summary
    if(formElements.summary) {
        addSectionHeader(doc, 'Professional Summary', margin, yPos);
        doc.setFontSize(11);
        const splitSummary = doc.splitTextToSize(formElements.summary, pageWidth - margin*2);
        doc.text(splitSummary, margin, yPos + 10);
        yPos += splitSummary.length * lineHeight + 15;
    }

    // Professional Experience
    addSectionHeader(doc, 'Professional Experience', margin, yPos);
    if(formElements.experience) {
        doc.setFontSize(11);
        const splitExp = doc.splitTextToSize(formElements.experience, pageWidth - margin*2);
        doc.text(splitExp, margin, yPos + 10);
        yPos += splitExp.length * lineHeight + 15;
    }

    // Education & Certifications
    addSectionHeader(doc, 'Education & Certifications', margin, yPos);
    if(formElements.education) {
        doc.setFontSize(11);
        const splitEdu = doc.splitTextToSize(formElements.education, pageWidth - margin*2);
        doc.text(splitEdu, margin, yPos + 10);
        yPos += splitEdu.length * lineHeight + 15;
    }

    // Skills & Additional Info
    addSectionHeader(doc, 'Skills & Additional Information', margin, yPos);
    yPos += 10;

    // Skills
    if(formElements.skills) {
        doc.setFontSize(11);
        const skills = formElements.skills.split(',').map(s => s.trim());
        skills.forEach((skill, index) => {
            doc.text(`• ${skill}`, margin, yPos + (index * lineHeight));
        });
        yPos += skills.length * lineHeight + 10;
    }

    // Languages
    if(formElements.languages) {
        doc.setFontSize(11);
        const languages = formElements.languages.split(',').map(l => l.trim());
        languages.forEach((lang, index) => {
            doc.text(`• ${lang}`, margin, yPos + (index * lineHeight));
        });
        yPos += languages.length * lineHeight + 10;
    }

    // Hobbies
    if(formElements.hobbies) {
        doc.setFontSize(11);
        const hobbies = formElements.hobbies.split(',').map(h => h.trim());
        hobbies.forEach((hobby, index) => {
            doc.text(`• ${hobby}`, margin, yPos + (index * lineHeight));
        });
    }

    // Save PDF
    const fileName = formElements.name 
        ? `${formElements.name.replace(/[^a-zA-Z0-9]/g, '_')}_CV.pdf` 
        : 'professional-cv.pdf';
    doc.save(fileName);
}

function addSectionHeader(doc, text, x, y) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(text, x, y);
    doc.setLineWidth(0.8);
    doc.line(x, y + 2, x + 50, y + 2);
    doc.setFont('helvetica', 'normal');
    }
