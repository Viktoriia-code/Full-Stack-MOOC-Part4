
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null // Return null if the list of blogs is empty
  }
  // Find the blog with the most likes using Array.reduce
  const mostLikedBlog = blogs.reduce((prev, current) => {
    return current.likes > prev.likes ? current : prev
  })

  return {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes,
  }
}

// 4.6 Function return author and number of blogs with the most blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null // Return null if the list of blogs is empty
  }
  const blogCounts = {}

  blogs.forEach((blog) => {
    if (blog.author in blogCounts) {
      blogCounts[blog.author]++
    } else {
      blogCounts[blog.author] = 1
    }
  })

  let topAuthor = ''
  let maxBlogs = 0

  for (const author in blogCounts) {
    if (blogCounts[author] > maxBlogs) {
      topAuthor = author
      maxBlogs = blogCounts[author]
    }
  }

  return {
    author: topAuthor,
    blogs: maxBlogs,
  }
}

// 4.7 Function return author and number of likes with the most likes
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null // Return null if the list of blogs is empty
  }
  const likeCounts = {}

  blogs.forEach((blog) => {
    if (blog.author in likeCounts) {
      likeCounts[blog.author] += blog.likes
    } else {
      likeCounts[blog.author] = blog.likes
    }
  })

  let topAuthor = ''
  let maxLikes = 0

  for (const author in likeCounts) {
    if (likeCounts[author] > maxLikes) {
      topAuthor = author
      maxLikes = likeCounts[author]
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}