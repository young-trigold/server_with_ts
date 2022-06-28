import mongoose from 'mongoose';

const { Schema } = mongoose;

const chapterScheme = new Schema(
  {
    title: {
      type: String,
      required: [true, '请添加章节标题'],
    },
    url: {
      type: String,
      required: [true, '请添加章节地址'],
    },
    views: Number,
    likes: Number,
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Chapter = mongoose.model('Chapter', chapterScheme);

export default Chapter;
