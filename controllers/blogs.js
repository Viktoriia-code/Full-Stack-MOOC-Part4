const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

/*const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}*/

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  /*const users = await User.find({})
  const userId = users[Math.floor(Math.random()*users.length)]
  console.log(userId)
  const user = await User.findById(userId)*/

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  if (!blog.title || !blog.url) {
    response.status(404).end()
  }

  const savedNote = await blog.save()

  user.blogs = user.blogs.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

blogsRouter.delete('/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndRemove(request.params.id)
  if (deletedBlog) {
    response.status(204).end()
  } else {
    response.status(404).json({ error: 'Blog not found' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedNote = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedBlog,
    { new: true }
  )

  if (!updatedNote) {
    response.status(404).json({ error: 'Blog not found' })
  } else {
    response.json(updatedNote)
  }
})

module.exports = blogsRouter