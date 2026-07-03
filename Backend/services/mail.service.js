const sendMail = async (to, subject, html) => {
  console.log(`\n======================= [STUB MAIL SERVICE] =======================`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  
  // Extract and print any links found in the html (e.g. href="...")
  const hrefRegex = /href="([^"]+)"/g;
  let match;
  const links = [];
  while ((match = hrefRegex.exec(html)) !== null) {
    links.push(match[1]);
  }
  
  if (links.length > 0) {
    console.log("Extracted Links:");
    links.forEach(link => console.log(` - ${link}`));
  }
  console.log(`===================================================================\n`);
  
  return {
    success: true,
    message: "Email service disabled."
  };
};

module.exports = {
  sendMail,
};
