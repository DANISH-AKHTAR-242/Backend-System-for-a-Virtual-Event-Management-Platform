exports.sendMail = async (userId, message) => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`Email sent to ${userId}: ${message}`);
      resolve();
    }, 500);
  });
};