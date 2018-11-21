const colors = ['blue', 'red', 'green'];

const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};

module.exports = randomColor;