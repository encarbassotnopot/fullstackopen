const _ = require("lodash");

const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
	if (!blogs.length || blogs.length === 0) return null;
	return blogs.reduce((max, blog) => (max.likes > blog.likes ? max : blog));
};

const mostBlogs = (blogList) => {
	if (!blogList.length || blogList.length === 0) return null;
	const byAuthor = _.groupBy(blogList, "author");
	let authorCount = _.mapValues(byAuthor, "length");
	authorCount = _.values(
		_.mapValues(authorCount, (v, k) => {
			return { author: k, blogs: v };
		})
	);

	return authorCount.reduce((max, author) =>
		max.blogs > author.blogs ? max : author
	);
};

const mostLikes = (blogList) => {
	if (!blogList.length || blogList.length === 0) return null;
	let byAuthor = _.groupBy(blogList, "author");
	byAuthor = _.mapValues(byAuthor, (blogs) => totalLikes(blogs));
	let authorLikes = _.values(
		_.mapValues(byAuthor, (v, k) => {
			return { author: k, likes: v };
		})
	);
	console.log(authorLikes);

	return authorLikes.reduce((max, author) =>
		max.likes > author.likes ? max : author
	);
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
};
