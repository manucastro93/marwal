function generateLink() {
  return Math.random().toString(36).substring(2, 6);
}

module.exports = {
  generateLink,
};