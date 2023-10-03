const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUsers = [
  {
    username: 'Emperor',
    name: 'Marcus Aurelius',
    passwordHash: 'password'
  },
  {
    username: 'Relativity',
    name: 'Albert Enstein',
    passwordHash: 'password'
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  //user bd
  await User.deleteMany({})
  let userObject = new User(initialUsers[0])
  await userObject.save()
  userObject = new User(initialUsers[1])
  await userObject.save()
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
    const userCredentials = {
      username: 'Username',
      name: 'Name',
      password: 'Password'
    }

    const userResponse = await api
      .post('/api/users')
      .send(userCredentials)
      .expect(201)

    const loginResponse = await api
      .post('/api/login')
      .send(userCredentials)
      .expect(200)

    const token = loginResponse.body.token

    const response = await api.get('/api/blogs')
    const originBodyLenght = response.body.length

    const newBlog = {
      title: 'New Test Post',
      author: 'Test',
      url: 'Test',
      likes: 0,
      user: userResponse.body.id
    }

    await supertest(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const NewResponse = await api.get('/api/blogs')
    expect(NewResponse.body).toHaveLength(originBodyLenght+1)
  })
})

// 4.11 Verify that if the likes property is missing from the request, it will default to the value 0
describe('4.11 Verify that if the likes property is missing from the request, it will default to the value 0', () => {
  test('if the likes property is missing from the request, it will default to the value 0', async () => {
    const userCredentials = {
      username: 'Username1',
      name: 'Name1',
      password: 'Password1'
    }

    const userResponse = await api
      .post('/api/users')
      .send(userCredentials)
      .expect(201)

    const loginResponse = await api
      .post('/api/login')
      .send(userCredentials)
      .expect(200)

    const token = loginResponse.body.token

    const newBlog = {
      title: 'New Test Post',
      author: 'Test with no likes',
      url: 'Test with no likes',
      user: userResponse.body.id
    }

    await supertest(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const response = await api.get('/api/blogs')
    expect(response.body[response.body.length-1].likes).toBe(0)
  })
})

// 4.12 Verify that if the title or url properties are missing from the request data while creating new blogs, it responds error
describe('4.12 Verify that if the title or url properties are missing from the request data while creating new blogs, it responds error', () => {
  test('if title is missing while creating blogs, the request responds error', async () => {
    const userCredentials = {
      username: 'Username1',
      name: 'Name1',
      password: 'Password1'
    }

    const userResponse = await api
      .post('/api/users')
      .send(userCredentials)
      .expect(201)

    const loginResponse = await api
      .post('/api/login')
      .send(userCredentials)
      .expect(200)

    const token = loginResponse.body.token

    const newBlog = {
      title: null,
      author: 'Test with no likes',
      url: 'Test with no likes',
      user: userResponse.body.id
    }

    await supertest(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(404)
  })

  test('if url is missing while creating blogs, the request responds error', async () => {
    const userCredentials = {
      username: 'Username1',
      name: 'Name1',
      password: 'Password1'
    }

    const userResponse = await api
      .post('/api/users')
      .send(userCredentials)
      .expect(201)

    const loginResponse = await api
      .post('/api/login')
      .send(userCredentials)
      .expect(200)

    const token = loginResponse.body.token

    const newBlog = {
      title: 'Test with no likes',
      author: 'Test with no likes',
      url: null,
      user: userResponse.body.id
    }

    await supertest(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(404)
  })
})

// 4.13 Verify functionality for deleting a single blog post resource
describe('4.13 Verify functionality for deleting a single blog post resource', () => {
  test('should return code 204 when delete a blog post by ID', async () => {
    //const response = await api.get('/api/blogs')
    //const originBodyLenght = response.body.length

    const userCredentials = {
      username: 'Username2',
      name: 'Name2',
      password: 'Password2'
    }

    const userResponse = await api
      .post('/api/users')
      .send(userCredentials)
      .expect(201)

    const loginResponse = await api
      .post('/api/login')
      .send(userCredentials)
      .expect(200)

    const token = loginResponse.body.token

    const newBlog = {
      title: 'New Test Post',
      author: 'Test',
      url: 'Test',
      likes: 0,
      user: userResponse.body.id
    }

    const createdBlog = await supertest(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    //const blog = response.body[originBodyLenght-1]

    await supertest(app)
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    //const res = await api.delete(`/api/blogs/${blog.id}`)
    //expect(res.status).toBe(204)
  })
  test('should increase bd lenghts by 1 when delete a blog post by ID', async () => {
    const userCredentials = {
      username: 'Username2',
      name: 'Name2',
      password: 'Password2'
    }

    const userResponse = await api
      .post('/api/users')
      .send(userCredentials)
      .expect(201)

    const loginResponse = await api
      .post('/api/login')
      .send(userCredentials)
      .expect(200)

    const token = loginResponse.body.token

    const newBlog = {
      title: 'New Test Post',
      author: 'Test',
      url: 'Test',
      likes: 0,
      user: userResponse.body.id
    }

    const createdBlog = await supertest(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const response = await api.get('/api/blogs')
    const originBodyLenght = response.body.length

    await supertest(app)
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const NewResponse = await api.get('/api/blogs')
    expect(NewResponse.body).toHaveLength(originBodyLenght-1)
  })
})

// 4.14 Verify functionality for updating a blog
describe('4.13 Verify functionality for updating a blog', () => {
  test('should return code 200 and post body when update a blog', async () => {
    const blog = await Blog.findOne({ title: 'React patterns' })
    const updatedData = {
      title: 'Updated Title',
      author: 'Updated Author',
      url: 'http://updated-example.com',
      likes: 20,
      id: String(blog._id)
    }

    // Perform the PUT request to update the blog post
    const res = await supertest(app)
      .put(`/api/blogs/${blog._id}`)
      .send(updatedData)
      .expect(200)

    expect(res.body).toEqual(updatedData)
  })
})

// 4.16 Verify restrictions to creating new users
describe('4.16 Verify restrictions to creating new users', () => {
  test('should return code 400', async () => {
    const newUser = {
      'username': 'Emperor',
      'name': undefined,
      'password': 'password'
    }

    // Perform the POST request to create the new user
    const res = await supertest(app)
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(res.body.error).toBe('username must be unique')
  })
  test('should return correct error message', async () => {
    const newUser = {
      'username': 'Emperor',
      'name': undefined,
      'password': 'password'
    }

    // Perform the POST request to create the new user
    const res = await supertest(app)
      .post('/api/users')
      .send(newUser)

    expect(res.body.error).toBe('username must be unique')
  })
  test('bd lenght should stay same after the request', async () => {
    const response = await api.get('/api/users')
    const newUser = {
      'username': 'Emperor',
      'name': undefined,
      'password': 'password'
    }

    // Perform the POST request to create the new user
    await supertest(app)
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const updatedResponse = await api.get('/api/users')
    expect(response.length).toEqual(updatedResponse.length)
  })
})

// 4.23 Verify that making an HTTP POST request without authorization return error 401
describe('4.23 Verify that making an HTTP POST request without authorization return error 401', () => {
  test('return error 401 via HTTP POST request', async () => {
    const userCredentials = {
      username: 'Username',
      name: 'Name',
      password: 'Password'
    }

    const userResponse = await api
      .post('/api/users')
      .send(userCredentials)
      .expect(201)

    const token = 'test'

    const newBlog = {
      title: 'New Test Post',
      author: 'Test',
      url: 'Test',
      likes: 0,
      user: userResponse.body.id
    }

    await supertest(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(401)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})