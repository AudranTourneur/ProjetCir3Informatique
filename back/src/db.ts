import mongoose from 'mongoose'


export function initDb() {
	mongoose.connect(process.env.MONGODB_STRING)

	const Cat = mongoose.model('Cat', { name: String, time: Number });

	const kitty = new Cat({ name: 'Garfield', time: Date.now() });
	kitty.save().then(() => console.log('meow'));
}