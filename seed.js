const mongoose = require('mongoose');
const { User, Thought } = require('./models');

mongoose.connect('mongodb+srv://root:root123@socialnet.jynlqut.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB', err));

const users = [
    { username: 'alice', email: 'alice@example.com' },
    { username: 'bob', email: 'bob@example.com' }
];

const thoughts = [
    { thoughtText: "I love coding!", username: "alice" },
    { thoughtText: "Mongoose makes MongoDB easy.", username: "bob" }
];

const seedDB = async () => {
    // Clear existing data
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Add new data
    const createdUsers = await User.insertMany(users);

    const createdThoughts = thoughts.map(thought => {
        const user = createdUsers.find(user => user.username === thought.username);
        if (user) {
            thought.username = user._id;
        }
        return thought;
    });

    await Thought.insertMany(createdThoughts);

    console.log('Database seeded!');
};

seedDB().then(() => {
    mongoose.connection.close();
});
