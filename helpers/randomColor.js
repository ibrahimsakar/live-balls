const colors = [ 'blue', 'red', 'green' ];

const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

module.exports = randomColor;
