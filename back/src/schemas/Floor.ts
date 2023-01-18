import mongoose from "mongoose";

export const  FloorSchema= new mongoose.Schema ({
	floorId: Number,
	name: String,
	imageId: Number,
	public: Boolean,
	rooms: {
		type: Array,
		of: {
			points: {
				type: Array,
				of: {
					type: Array,
					of: Number,
				},
			},
			name: String,
			capacity: Number,
			projecteur: Boolean,
		},
	}
},{collection:"floor"});

