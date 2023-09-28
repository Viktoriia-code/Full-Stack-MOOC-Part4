const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('returns null for an empty list of blogs', () => {
    const blogs = []
    expect(listHelper.favoriteBlog(blogs)).toBeNull()
  })

  test('when list has only one blog, equals the likes of that', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
      }
    ]
    expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
  })

  test('returns the sum of likes when there are multiple blogs', () => {
    const blogs = [
      {
        title: 'Blog A',
        author: 'Author A',
        likes: 10,
      },
      {
        title: 'Blog B',
        author: 'Author B',
        likes: 15,
      },
      {
        title: 'Blog C',
        author: 'Author C',
        likes: 8,
      },
    ]
    expect(listHelper.totalLikes(blogs)).toBe(33)
  })
})

describe('favoriteBlog function', () => {
  test('returns null for an empty list of blogs', () => {
    const blogs = []
    expect(listHelper.favoriteBlog(blogs)).toBeNull()
  })

  test('returns the favorite blog when there\'s only one blog', () => {
    const blogs = [
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12,
      },
    ]
    expect(listHelper.favoriteBlog(blogs)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })

  test('returns the favorite blog when there are multiple blogs', () => {
    const blogs = [
      {
        title: 'Blog A',
        author: 'Author A',
        likes: 10,
      },
      {
        title: 'Blog B',
        author: 'Author B',
        likes: 15,
      },
      {
        title: 'Blog C',
        author: 'Author C',
        likes: 8,
      },
    ]
    expect(listHelper.favoriteBlog(blogs)).toEqual({
      title: 'Blog B',
      author: 'Author B',
      likes: 15,
    })
  })
})

// 4.6 Function return author and number of blogs with the most blogs
describe('mostBlog function', () => {
  test('returns null for an empty list of blogs', () => {
    const blogs = []
    expect(listHelper.mostBlogs(blogs)).toBeNull()
  })

  test('returns the blog when there\'s only one blog', () => {
    const blogs = [
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12,
      },
    ]
    expect(listHelper.mostBlogs(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    })
  })

  test('returns the data object with most blogs when there are multiple blogs', () => {
    const blogs = [
      {
        title: 'Blog A',
        author: 'Author A',
        likes: 10,
      },
      {
        title: 'Blog B',
        author: 'Author B',
        likes: 15,
      },
      {
        title: 'Blog C',
        author: 'Author A',
        likes: 8,
      },
    ]
    expect(listHelper.mostBlogs(blogs)).toEqual({
      author: 'Author A',
      blogs: 2,
    })
  })
})

// 4.7 Function return author and number of likes with the most likes
describe('mostLikes function', () => {
  test('returns null for an empty list of blogs', () => {
    const blogs = []
    expect(listHelper.mostLikes(blogs)).toBeNull()
  })

  test('returns the blog when there\'s only one blog', () => {
    const blogs = [
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12,
      },
    ]
    expect(listHelper.mostLikes(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })

  test('returns the data object with most likes when there are multiple blogs', () => {
    const blogs = [
      {
        title: 'Blog A',
        author: 'Author A',
        likes: 10,
      },
      {
        title: 'Blog B',
        author: 'Author B',
        likes: 15,
      },
      {
        title: 'Blog C',
        author: 'Author A',
        likes: 8,
      },
    ]
    expect(listHelper.mostLikes(blogs)).toEqual({
      author: 'Author A',
      likes: 18,
    })
  })
})