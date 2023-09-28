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

// 4.9 Verify that the unique identifier property of the blog posts is named id
test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const body = response.body
  expect(body[0].id).toBeDefined()
})

// 4.10 Verify that making an HTTP POST request to the /api/blogs URL successfully creates a new blog post
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

// 4.11 Verify that if the likes property is missing from the request, it will default to the value 0
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

afterAll(async () => {
  await mongoose.connection.close()
})