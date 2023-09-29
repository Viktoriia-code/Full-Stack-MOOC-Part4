const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})
// 4.8 Verify that the blog list application returns blog posts in the JSON format
describe('4.8 Verify that the blog list application returns blog posts in the JSON format', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  // 4.8 Verify that the blog list application returns the correct amount of blog posts
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })
})

// 4.9 Verify that the unique identifier property of the blog posts is named id
describe('4.9 Verify that the unique identifier property of the blog posts is named id', () => {
  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const body = response.body
    expect(body[0].id).toBeDefined()
  })
})

// 4.10 Verify that making an HTTP POST request to the /api/blogs URL successfully creates a new blog post
describe('4.10 Verify that making an HTTP POST request to the /api/blogs URL successfully creates a new blog post', () => {
  test('create a new blog post via HTTP POST request', async () => {
    const response = await api.get('/api/blogs')
    const originBodyLenght = response.body.length

    const newBlog = {
      title: 'New Test Post',
      author: 'Test',
      url: 'Test',
      likes: 0,
    }

    await supertest(app)
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)

    const NewResponse = await api.get('/api/blogs')
    expect(NewResponse.body).toHaveLength(originBodyLenght+1)
  })
})

// 4.11 Verify that if the likes property is missing from the request, it will default to the value 0
describe('4.11 Verify that if the likes property is missing from the request, it will default to the value 0', () => {
  test('if the likes property is missing from the request, it will default to the value 0', async () => {

    const newBlog = {
      title: 'New Test Post',
      author: 'Test with no likes',
      url: 'Test with no likes',
    }

    await supertest(app)
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)

    const response = await api.get('/api/blogs')
    expect(response.body[response.body.length-1].likes).toBe(0)
  })
})

// 4.12 Verify that if the title or url properties are missing from the request data while creating new blogs, it responds error
describe('4.12 Verify that if the title or url properties are missing from the request data while creating new blogs, it responds error', () => {
  test('if title is missing while creating blogs, the request responds error', async () => {

    const newBlog = {
      title: null,
      author: 'Test with no likes',
      url: 'Test with no likes',
    }

    await supertest(app)
      .post('/api/blogs')
      .send(newBlog)
      .expect(404)
  })

  test('if url is missing while creating blogs, the request responds error', async () => {

    const newBlog = {
      title: 'Test with no likes',
      author: 'Test with no likes',
      url: null,
    }

    await supertest(app)
      .post('/api/blogs')
      .send(newBlog)
      .expect(404)
  })
})

// 4.13 Verify functionality for deleting a single blog post resource
describe('4.13 Verify functionality for deleting a single blog post resource', () => {
  test('should return code 204 when delete a blog post by ID', async () => {
    const response = await api.get('/api/blogs')
    const originBodyLenght = response.body.length

    const blog = response.body[originBodyLenght-1]
    const res = await api.delete(`/api/blogs/${blog.id}`)

    expect(res.status).toBe(204)
  })
  test('should increase bd lenghts by 1 when delete a blog post by ID', async () => {
    const response = await api.get('/api/blogs')
    const originBodyLenght = response.body.length

    const blog = response.body[originBodyLenght-1]
    await api.delete(`/api/blogs/${blog.id}`)

    const NewResponse = await api.get('/api/blogs')
    expect(NewResponse.body).toHaveLength(originBodyLenght-1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})