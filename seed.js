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
    { username: 'bob', email: 'bob@example.com' },
    { username: 'charlie', email: 'charlie@example.com' },
    { username: 'dave', email: 'dave@example.com' },
];

const thoughts = [
    { thoughtText: "I love polar bears!", username: "alice" },
    { thoughtText: "Leah is a good instructor", username: "bob" },
    { thoughtText: "WHAT IS GOING ON??", username: "charlie" },
    { thoughtText: "Yippie!!!", username: "dave" },
];

const seedDB = async () => {
    // Clear existing data
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Adding user data
    const createdUsers = await User.insertMany(users);

    // Add new thought data with user references
    const createdThoughts = await Promise.all(thoughts.map(async thought => {
        const user = createdUsers.find(user => user.username === thought.username);
        if (user) {
            return await Thought.create({ ...thought, username: user._id });
        }
    }));

    // Add friends to users
    await User.findByIdAndUpdate(createdUsers[0]._id, { $addToSet: { friends: createdUsers[1]._id } });
    await User.findByIdAndUpdate(createdUsers[1]._id, { $addToSet: { friends: createdUsers[0]._id } });
    await User.findByIdAndUpdate(createdUsers[2]._id, { $addToSet: { friends: createdUsers[3]._id } });
    await User.findByIdAndUpdate(createdUsers[3]._id, { $addToSet: { friends: createdUsers[2]._id } });

    // Add reactions to thoughts
    const reaction1 = {
        reactionBody: "That's so true!",
        username: createdUsers[1]._id // Bob's reaction to Alice's thought
    };
    const reaction2 = {
        reactionBody: "Absolutely agree!",
        username: createdUsers[3]._id // Dave's reaction to Charlie's thought
    };
    await Thought.findByIdAndUpdate(createdThoughts[0]._id, { $push: { reactions: reaction1 } });
    await Thought.findByIdAndUpdate(createdThoughts[2]._id, { $push: { reactions: reaction2 } });

    console.log('Database seeded!');
};

seedDB().then(() => {
    mongoose.connection.close();
});
